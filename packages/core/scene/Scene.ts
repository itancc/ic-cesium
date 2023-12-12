import {
  Viewer,
  Terrain,
  CameraEventType,
  KeyboardEventModifier,
  Ion,
} from "cesium";
import { CommonSdk } from "./CoomonSdk";
import { Engine } from "../engines/Engine";

export interface SceneOptions extends Viewer.ConstructorOptions {
  accessToken?: string;
  /** enable cesium logo */
  enableLogo?: boolean;
  /** enable default terrain */
  enableTerrain?: boolean;
  /** scene id */
  id?: string;
  /** scene name */
  name?: string;
  /** enable render loop,other than cesium useDefaultRenderLoop, default true */
  enableRenderLoop?: boolean;
}

export class Scene extends CommonSdk {
  private _engine: Engine;
  constructor(engine: Engine, options: SceneOptions) {
    const {
      accessToken,
      enableLogo = false,
      enableTerrain = false,
      enableRenderLoop = true,
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

    const container = engine.getInputElement();
    const viewer = new Viewer(container, {
      ...defaultOptions,
      ...restOptions,
      useDefaultRenderLoop: false,
    });
    super(viewer);
    this._engine = engine;
    this.enableLogo = enableLogo;
    this.enableTerrain = enableTerrain;
    this.enablePresetCameraController = true;
    if (enableRenderLoop) {
      engine.runRenderLoop(() => this.render());
    }
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

  public render() {
    this.viewer.render();
  }

  public dispose() {
    this._viewer.destroy();
  }
}
