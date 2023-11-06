declare module "*?raw" {
  const value: string;
  export default value;
}

/** 手动暴露cesium的一些私有类或方法 */
declare module "cesium" {
  export class DrawCommand {
    constructor();
  }
}
