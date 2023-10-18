import {
  Viewer,
  Terrain,
  CameraEventType,
  KeyboardEventModifier,
  Ion,
  defaultValue,
} from "cesium";
import { RandomUuid } from "./shared/EngineUtils";

const CESIUM_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNTllNWUzMC02YjIxLTQ0ZjktOTAxOS1mNGQ0MzQwNzM5NjQiLCJpZCI6OTc1OCwic2NvcGVzIjpbImFzciIsImdjIl0sImlhdCI6MTU1NDg2NzYxMX0.1RMng8TM5nMjlDCXqBKir0qqHuURt6LwJsy5LNU0oI8";

export interface EngineOptions extends Viewer.ConstructorOptions {
  accessToken?: string;
  container: HTMLElement | string;
  /** engine id */
  id: string;
  /** engine name */
  name?: string;
}

export class Engine {
  private _viewer!: Viewer;
  private _options: EngineOptions;

  constructor(options: EngineOptions) {
    const { accessToken, ...restOptions } = options;
    this._options = this.initOptions(restOptions);
    this.registerAccessToken(accessToken);
    this.initICesium();
  }
  private initOptions(options: Exclude<EngineOptions, "accsessToken">) {
    return Object.assign(options, {
      id: RandomUuid(),
    });
  }
  /**
   * Registers the access token for the API.
   */
  private registerAccessToken(accessToken?: string) {
    Ion.defaultAccessToken = defaultValue(accessToken, CESIUM_ACCESS_TOKEN);
  }
  /**
   * Initializes the viewer
   */
  private initICesium() {
    const { container, ...restOptions } = this._options;
    this._viewer = new Viewer(container, {
      terrain: Terrain.fromWorldTerrain(),
      ...restOptions,
    });
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
}
