import {
  Viewer,
  Terrain,
  CameraEventType,
  KeyboardEventModifier,
  Ion,
  CesiumWidget,
  Scene as CesiumScene,
  defined,
  JulianDate,
} from "cesium";
import { CommonSdk } from "./CoomonSdk";
import { Engine } from "../engines/Engine";

const CESIUM_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNTllNWUzMC02YjIxLTQ0ZjktOTAxOS1mNGQ0MzQwNzM5NjQiLCJpZCI6OTc1OCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1NDg2NzYxMX0.1RMng8TM5nMjlDCXqBKir0qqHuURt6LwJsy5LNU0oI8";

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
  private _cesiumWidget: CesiumWidget;
  private _scene: CesiumScene;
  constructor(engine: Engine, options: SceneOptions) {
    const {
      accessToken = CESIUM_ACCESS_TOKEN,
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
    this._cesiumWidget = viewer.cesiumWidget;
    this._scene = this._cesiumWidget._scene;
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
    if (this._cesiumWidget._canRender) {
      this._scene.initializeFrame();
      let currentTime = this._cesiumWidget._clock.tick();
      this._scene.render(currentTime);
      // 如下是否进行重写，根据源码
      // //预通过更新。执行任何应该在此处传递之前运行的传递不变式代码
      // this._scene._preUpdate.raiseEvent([this._scene, currentTime]);
      // const frameState = this._scene._frameState;
      // frameState.newFrame = false;
      // if (!defined(currentTime)) {
      //   currentTime = JulianDate.now();
      // }
      // const cameraChanged = this._scene._view.checkForCameraUpdates(this);
      // if (cameraChanged) {
      //   this._scene._globeHeightDirty = true;
      // }
    } else {
      this._cesiumWidget._clock.tick();
    }
  }

  public dispose() {
    this._viewer.destroy();
  }
}
