import { Cartesian2, Color, Material } from "cesium";
import { CesiumMaterialOptions } from "../../shared/CesiumTypes";
import source from "./source.glsl?raw";

export interface TrailLinkMaterialOptions extends CesiumMaterialOptions {
  color?: Color;
  image: string;
  time?: number;
  repeat?: Cartesian2;
}
export class TrailLinkMaterial extends Material {
  constructor(options?: TrailLinkMaterialOptions) {
    const {
      color = new Color(1.0, 0.0, 0.0, 0.5),
      repeat = new Cartesian2(10, 1),
      time = 1000,
      image,
    } = options;
    super({
      ...options,
      fabric: {
        type: "TrailLinkMaterial",
        uniforms: { color, repeat, image, time },
        source,
      },
      translucent: () => true,
    });
  }
}
