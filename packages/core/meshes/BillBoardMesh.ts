import { BillboardGraphics } from "cesium";
import { Scene } from "../scene/Scene";

export interface BillBoardMeshOptions
  extends BillboardGraphics.ConstructorOptions {}
export class BillBoardMesh extends BillboardGraphics {
  constructor(opt: BillBoardMeshOptions, scene: Scene) {
    super(opt);
  }
}

export function createBillBoard(opt: BillBoardMeshOptions, scene: Scene) {
  return new BillBoardMesh(opt, scene);
}
