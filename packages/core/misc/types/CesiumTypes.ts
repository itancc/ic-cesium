import { TextureMagnificationFilter, TextureMinificationFilter } from "cesium";

export interface CesiumMaterialOptions {
  strict?: boolean;
  translucent?: boolean | ((...params: any[]) => any);
  minificationFilter?: TextureMinificationFilter;
  magnificationFilter?: TextureMagnificationFilter;
  fabric: any;
}
