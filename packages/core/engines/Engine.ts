import { isWindowAvailable } from "../misc/commonUtils";
import { Nullable } from "../misc/types/SharedTypes";
import { defined } from "cesium";

export interface EngineOptions {
  /** 抗锯齿 */
  antialias?: boolean;
}
/** 负责对接所有低级api，如WebGL和Audio */
export class Engine {
  protected _activeRenderLoops = new Array<() => void>();
  protected _renderingCanvas: Nullable<HTMLCanvasElement>;
  private _onContextLost: Nullable<(event: Event) => void>;
  protected _contextWasLost = false;
  protected _renderingQueueLaunched = false;
  protected _frameHandler: Nullable<number>;
  /** 引擎是否销毁 */
  protected _isDisposed = false;
  /** 引擎是否处于不可见 */
  protected _windowIsBackground = false;
  constructor(
    canvas: Nullable<HTMLCanvasElement>,
    options: EngineOptions = {}
  ) {
    if (!defined(canvas)) throw new Error("canvas is not defined");
    this._renderingCanvas = canvas;

    // 处理Content丢失
    this._onContextLost = (evt: Event) => {
      evt.preventDefault();
      this._contextWasLost = true;
      console.warn("Context lost");
    };
    canvas.addEventListener("webglcontextlost", this._onContextLost, false);
  }

  private get isRenderFrame() {
    return !this._isDisposed && !this._windowIsBackground;
  }
  public get version() {
    return "0.0.1";
  }

  /** */
  private _renderLoop() {
    if (!this._contextWasLost && this.isRenderFrame) {
      this._activeRenderLoops.forEach((renderFunction) => {
        renderFunction();
      });
    }
    if (this._activeRenderLoops.length > 0) {
      this._frameHandler = this.queueNewFrame(() => this._renderLoop());
    } else {
      this._renderingQueueLaunched = false;
    }
  }
  protected _cancelFrame() {
    if (this._renderingQueueLaunched && this._frameHandler) {
      this._renderingQueueLaunched = false;
      const requestContent = this.getHostWindow();
      if (!requestContent) return clearTimeout(this._frameHandler);
      const { cancelAnimationFrame } = requestContent;
      return cancelAnimationFrame(this._frameHandler);
    }
  }
  public getInputElement() {
    return this._renderingCanvas;
  }

  public getHostWindow() {
    if (!isWindowAvailable()) return;
    return this._renderingCanvas?.ownerDocument?.defaultView ?? window;
  }

  /** 将一个新函数排队到请求的动画帧池中,可以降级处理 */
  public queueNewFrame(func: () => void) {
    const requestContent = this.getHostWindow();
    if (!requestContent) return setTimeout(func, 16) as unknown as number;
    const { requestAnimationFrame } = requestContent;
    return requestAnimationFrame(func);
  }

  public runRenderLoop(renderFunction: () => void) {
    if (~this._activeRenderLoops.indexOf(renderFunction)) return;
    this._activeRenderLoops.push(renderFunction);
    if (!this._renderingQueueLaunched) {
      this._renderingQueueLaunched = true;
      this._frameHandler = this.queueNewFrame(() => this._renderLoop());
    }
  }
  public stopRenderLoop(renderFunction?: () => void) {
    if (!renderFunction) {
      this._activeRenderLoops.length = 0;
      this._cancelFrame();
      return;
    }
    const index = this._activeRenderLoops.indexOf(renderFunction);
    if (~index) {
      this._activeRenderLoops.splice(index, 1);
      if (this._activeRenderLoops.length === 0) this._cancelFrame();
    }
  }

  public resize() {}

  public dispose() {
    this._isDisposed = true;
    this.stopRenderLoop();

    // clear event
    this._renderingCanvas &&
      this._renderingCanvas.removeEventListener(
        "webglcontextlost",
        this._onContextLost,
        false
      );
  }
}
