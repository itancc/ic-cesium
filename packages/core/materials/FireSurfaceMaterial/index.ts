import { Material } from "cesium";
import { CesiumMaterialOptions } from "../../misc/types/CesiumTypes";

export interface FireSurfaceMaterialOptions extends CesiumMaterialOptions {}

export class FireSurfaceMaterial extends Material {
  constructor(options?: FireSurfaceMaterialOptions) {
    super(options);
  }
}
