import {
  BoundingSphere,
  Cartesian3,
  Cartographic,
  HeadingPitchRange,
  Viewer,
  defaultValue,
} from "cesium";

export interface flyToBoundingSphereOptions {
  position?: Cartesian3;
  radius?: number;
  duration?: number;
  heading?: number;
  pitch?: number;
  range?: number;
}

export class CommonSdk {
  constructor(protected _viewer: Viewer) {}
  public get viewer() {
    return this._viewer;
  }
  public get scene() {
    return this._viewer.scene;
  }
  public get camera() {
    return this._viewer.camera;
  }
  /** 引擎所用地球仪 */
  public get ellipsoid() {
    return this.scene.globe.ellipsoid;
  }
  /**
   * Gets the rectangular range of the current view
   * 获取当前视图的矩形范围
   * @returns
   */
  public getViewRectangle() {
    return this._viewer.camera.computeViewRectangle();
  }
  /**
   * go to default view
   * @param duration duration of the flight animation in seconds
   */
  public goHome(duration = 1) {
    this._viewer.camera.flyHome(duration);
  }
  /**
   * 判断一个坐标是否位于地下
   * @param position
   * @returns
   */
  public isInGlobe(position: Cartesian3) {
    const _cart = Cartographic.fromCartesian(position, this.ellipsoid);
    return _cart.height < -10000;
  }
  /**
   *fly to spherBoundinge
   * @param options
   */
  public flyToSpherBounding(options: flyToBoundingSphereOptions) {
    const {
      position,
      radius = 100,
      duration = 1,
      heading,
      pitch,
      range,
    } = options;
    if (!position) throw new Error("position is required");
    if (this.isInGlobe(position)) throw new Error("position is in globe");
    const _bs = new BoundingSphere(position, radius);
    this.camera.flyToBoundingSphere(_bs, {
      duration,
      offset: new HeadingPitchRange(
        defaultValue(heading, this.camera.heading),
        defaultValue(pitch, this.camera.pitch),
        defaultValue(range, 0)
      ),
    });
  }
}
