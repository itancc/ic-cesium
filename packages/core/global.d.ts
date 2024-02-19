declare module "*?raw" {
  const value: string;
  export default value;
}

/** 手动暴露cesium的一些私有类或方法 */
declare module "cesium" {
  export interface DrawCommandOptions {
    /** 顶点数组，向 GPU 传递顶点属性、索引（可选的）数组等几何信息 */
    vertexArray: any;
    shaderProgram?: any;
    /** 渲染状态对象 */
    renderState: any;
    /** 渲染通道，封装在Cesium.Pass */
    pass: any;

    boundingVolume?: any;
    modelMatrix?: any;
    orientedBoundingBox?: any;
    primitiveType?: any;
    count?: any;
    offset?: any;
    instanceCount?: number;
    /** 用于传递自定义 uniform 变量的值 */
    uniformMap?: any;
    framebuffer?: any;
    owner?: any;
    cull?: any;
    pickId?: any;
    pickOnly?: boolean;
    castShadows?: boolean;
    receiveShadows?: boolean;
    debugShowBoundingVolume?: boolean;
  }
  export class DrawCommand {
    constructor(options: DrawCommandOptions);
  }
  // 扩展原有的CesiumWidget Class类型
  export interface CesiumWidget {
    _canRender: boolean;
    _scene: Scene;
    _clock: Clock;
  }
  export interface Scene {
    initializeFrame: () => void;
    _preUpdate: Event<any>;
    _frameState: any;
    _view: any;
    _globeHeightDirty: boolean;
  }
}
