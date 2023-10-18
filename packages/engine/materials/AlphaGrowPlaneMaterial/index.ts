import { Material } from "cesium";
import { CesiumMaterialOptions } from "../../shared/CesiumTypes";
import source from "./source.glsl?raw";

export interface AlphaGrowPlaneMaterialOptions extends CesiumMaterialOptions {}

export class AlphaGrowPlaneMaterial extends Material {
  constructor(options?: AlphaGrowPlaneMaterialOptions) {
    super({
      ...options,
      fabric: {
        type: "alphaGrowPlaneMaterial",
        uniforms: {
          time: 0.0,
          map: "",
        },
        source,
      },
    });
  }
}
