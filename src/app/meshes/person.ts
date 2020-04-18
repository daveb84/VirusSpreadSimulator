import { Scene, Vector3, Mesh, MeshBuilder } from '@babylonjs/core'
import { generateNumber } from '../../utils/random'
import { minBound, maxBound } from '../settings'
import { getCommonMaterials } from '../materials'

const dimensions = { width: 0.1, height: 0.3, depth: 0.1 }
const positionY = minBound.y + dimensions.height / 2

export class Person {
  public readonly mesh: Mesh
  private materials = getCommonMaterials()

  constructor(private scene: Scene) {
    this.mesh = MeshBuilder.CreateBox('person', dimensions, this.scene)
    this.mesh.material = this.materials.default
    this.mesh.animations = []
    this.mesh.isPickable = true

    this.setRandomPosition()
  }

  private setRandomPosition() {
    this.mesh.position = new Vector3(
      generateNumber(minBound.x, maxBound.x),
      positionY,
      generateNumber(minBound.z, maxBound.z)
    )
  }
}
