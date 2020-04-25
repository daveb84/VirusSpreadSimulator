import { Mesh, MeshBuilder, Material, Scene } from '@babylonjs/core'

export class Building {
  public readonly mesh: Mesh

  constructor(
    private scene: Scene,
    material: Material,
    width: number,
    height: number,
    depth: number
  ) {
    this.mesh = MeshBuilder.CreateBox(
      'building',
      { width, height, depth },
      this.scene
    )
    this.mesh.isPickable = false
    this.mesh.material = material
  }
}
