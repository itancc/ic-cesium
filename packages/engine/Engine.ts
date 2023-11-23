import {
  Viewer,
  Terrain,
  CameraEventType,
  KeyboardEventModifier,
  Ion,
  Cartesian3,
} from "cesium";
import { CommonSdk } from "./core/CoomonSdk";

export interface EngineOptions extends Viewer.ConstructorOptions {
  accessToken?: string;
  container: HTMLElement | string;
  /** enable cesium logo */
  enableLogo?: boolean;
  /** enable default terrain */
  enableTerrain?: boolean;
  /** engine id */
  id?: string;
  /** engine name */
  name?: string;
  /** */
  center: Cartesian3;
}

export class Engine extends CommonSdk {
  constructor(options: EngineOptions) {
    const {
      accessToken,
      container,
      enableLogo = false,
      enableTerrain = false,
      center,
      ...restOptions
    } = options;
    accessToken && (Ion.defaultAccessToken = accessToken);

    // default options
    const defaultOptions: Viewer.ConstructorOptions = {
      homeButton: true,
      timeline: false,
      infoBox: false,
      fullscreenButton: false,
      geocoder: false,
      vrButton: false,
      animation: false,
      sceneModePicker: false,
      selectionIndicator: false,
    };
    const viewer = new Viewer(container, {
      ...defaultOptions,
      ...restOptions,
    });
    super(viewer);
    this.flyToSpherBounding({ position: center });
    this.enableLogo = enableLogo;
    this.enableTerrain = enableTerrain;
    this.enablePresetCameraController = true;
  }

  public set enableTerrain(enable: boolean) {
    if (enable) {
      const terrain = Terrain.fromWorldTerrain({
        requestVertexNormals: true,
        requestWaterMask: true,
      });
      this.scene.setTerrain(terrain);
    } else {
      this.scene.terrainProvider = undefined;
    }
  }
  public set enableLogo(enable: boolean) {
    const logoContainers = document.querySelectorAll<HTMLDivElement>(
      ".cesium-viewer-bottom"
    );
    logoContainers.forEach((logoContainer) => {
      logoContainer.style.display = enable ? "block" : "none";
    });
  }
  public set enablePresetCameraController(enable: boolean) {
    if (enable) {
      // 更改默认的鼠标控制方式
      this.scene.screenSpaceCameraController.zoomEventTypes = [
        CameraEventType.WHEEL,
        CameraEventType.PINCH,
      ];
      this.scene.screenSpaceCameraController.tiltEventTypes = [
        CameraEventType.RIGHT_DRAG,
        CameraEventType.PINCH,
      ];
    } else {
      this.scene.screenSpaceCameraController.zoomEventTypes = [
        CameraEventType.RIGHT_DRAG,
        CameraEventType.WHEEL,
        CameraEventType.PINCH,
      ];
      this.scene.screenSpaceCameraController.tiltEventTypes = [
        CameraEventType.MIDDLE_DRAG,
        CameraEventType.PINCH,
        {
          eventType: CameraEventType.LEFT_DRAG,
          modifier: KeyboardEventModifier.CTRL,
        },
        {
          eventType: CameraEventType.RIGHT_DRAG,
          modifier: KeyboardEventModifier.CTRL,
        },
      ];
    }
  }

  public dispose() {
    this._viewer.destroy();
  }
}
