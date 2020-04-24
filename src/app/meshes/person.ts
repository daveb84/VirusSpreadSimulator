import { Scene, Mesh, MeshBuilder } from '@babylonjs/core'
import { personHeight, personWidth } from '../settings'
import { getCommonMaterials } from '../materials'

export class Person {
  public readonly mesh: Mesh
  private materials = getCommonMaterials()

  constructor(private scene: Scene) {
    this.mesh = MeshBuilder.CreateBox(
      'person',
      { width: personWidth, height: personHeight, depth: personWidth },
      this.scene
    )
    this.mesh.material = this.materials.default
    this.mesh.animations = []
    this.mesh.isPickable = true
  }
}
