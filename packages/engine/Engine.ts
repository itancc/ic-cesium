import {
  Viewer,
  Terrain,
  CameraEventType,
  KeyboardEventModifier,
  Ion,
  DrawCommand,
} from "cesium";

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
}

export class Engine {
  private _viewer!: Viewer;

  constructor(options: EngineOptions) {
    const { accessToken, ...restOptions } = options;
    accessToken && (Ion.defaultAccessToken = accessToken);
    this.initCesium(restOptions);
  }

  /**
   * Initializes the viewer
   */
  private initCesium(options: Exclude<EngineOptions, "accessToken">) {
    const {
      container,
      enableLogo = false,
      enableTerrain = false,
      ...restOptions
    } = options;
    // default options
    const defaultOptions: Viewer.ConstructorOptions = {
      homeButton: false,
      timeline: false,
      infoBox: false,
      fullscreenButton: false,
      geocoder: false,
      vrButton: false,
      animation: false,
      sceneModePicker: false,
      selectionIndicator: false,
    };
    this._viewer = new Viewer(container, {
      ...defaultOptions,
      ...restOptions,
    });

    if (enableTerrain) {
      const terrain = Terrain.fromWorldTerrain({
        requestVertexNormals: true,
        requestWaterMask: true,
      });
      this._viewer.scene.setTerrain(terrain);
    }
    if (!enableLogo) {
      const logoContainers = document.querySelectorAll<HTMLDivElement>(
        ".cesium-viewer-bottom"
      );
      logoContainers.forEach((logoContainer) => {
        logoContainer.style.display = "none";
      });
    }

    this.customCameraController();
  }

  public customCameraController() {
    // 更改默认的鼠标控制方式
    this.scene.screenSpaceCameraController.zoomEventTypes = [
      CameraEventType.WHEEL,
      CameraEventType.PINCH,
    ];
    this.scene.screenSpaceCameraController.tiltEventTypes = [
      CameraEventType.RIGHT_DRAG,
      CameraEventType.PINCH,
    ];
  }

  public originCameraController() {
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

  public get viewer() {
    return this._viewer;
  }

  public get scene() {
    return this._viewer.scene;
  }

  public get camera() {
    return this._viewer.camera;
  }

  public dispose() {
    this._viewer.destroy();
  }
}
