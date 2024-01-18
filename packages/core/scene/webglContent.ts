/** 存储webgl上下文，并在上下文丢失时，进行恢复 */
export class WebGLContent {
  private _gl: WebGLRenderingContext;
  private _canvas: HTMLCanvasElement;
  private _lostContextHandler: (event: Event) => void;
  private _restoreContextHandler: (event: Event) => void;
  private _lostContextExtension: any;
  private _restoreContextExtension: any;
  private _isLost: boolean = false;

  constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
    this._canvas = canvas;
    this._gl = gl;
    this._lostContextHandler = this._onLostContext.bind(this);
    this._restoreContextHandler = this._onRestoreContext.bind(this);
    this._lostContextExtension = this._gl.getExtension("WEBGL_lose_context");
    this._restoreContextExtension = this._gl.getExtension("WEBGL_lose_context");
    this._canvas.addEventListener(
      "webglcontextlost",
      this._lostContextHandler,
      false
    );
    this._canvas.addEventListener(
      "webglcontextrestored",
      this._restoreContextHandler,
      false
    );
  }

  get gl(): WebGLRenderingContext {
    return this._gl;
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  get isLost(): boolean {
    return this._isLost;
  }

  public dispose(): void {
    this._canvas.removeEventListener(
      "webglcontextlost",
      this._lostContextHandler,
      false
    );
    this._canvas.removeEventListener(
      "webglcontextrestored",
      this._restoreContextHandler,
      false
    );
    this._lostContextHandler = null;
    this._restoreContextHandler = null;
    this._lostContextExtension = null;
    this._restoreContextExtension = null;
    this._gl = null;
    this._canvas = null;
  }

  private _onLostContext(event: Event): void {
    event.preventDefault();
    this._isLost = true;
  }

  private _onRestoreContext(event: Event): void {
    event.preventDefault();
    this._isLost = false;
  }
}
