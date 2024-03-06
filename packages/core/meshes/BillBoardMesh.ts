import { Primitive } from "cesium";
import { Scene } from "@/scene/Scene";

export interface BillBoardMeshOptions {}
export class BillBoardMesh {
  constructor(opt: BillBoardMeshOptions, scene: Scene) {}
}

export function createBillBoard(opt: BillBoardMeshOptions, scene: Scene) {
  return new BillBoardMesh(opt, scene);
}
