import { Scene, Mesh, MeshBuilder } from '@babylonjs/core'
import { personHeight } from '../settings'
import { getCommonMaterials } from '../materials'

export class Person {
  public readonly mesh: Mesh
  private materials = getCommonMaterials()

  constructor(private scene: Scene) {
    this.mesh = MeshBuilder.CreateBox(
      'person',
      { width: 0.1, height: personHeight, depth: 0.1 },
      this.scene
    )
    this.mesh.material = this.materials.default
    this.mesh.animations = []
    this.mesh.isPickable = true
  }
}
