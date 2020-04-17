import { MeshBuilder, Mesh } from '@babylonjs/core/Meshes'
import { Scene, StandardMaterial, Vector3 } from '@babylonjs/core'
import { boundsSize, boundsMidpoint } from '../settings'
import { IObstacle } from '../collisions'
import { deflectToCenter } from '../collisions/deflections'

export class StageArea implements IObstacle {
  public mesh: Mesh

  constructor(scene: Scene) {
    const bounds = MeshBuilder.CreateBox(
      'boundBox',
      {
        ...boundsSize,
      },
      scene
    )
    bounds.position = boundsMidpoint
    bounds.isPickable = false

    const material = new StandardMaterial('boundsMaterial', scene)
    // material.diffuseColor = new Color3(1, 1, 1)
    // material.wireframe = true
    material.alpha = 0
    // material.alpha = 0.3
    // material.backFaceCulling  = false

    bounds.material = material

    this.mesh = bounds
  }

  getDeflectDirection(currentPosition: Vector3, currentDirection: Vector3) {
    return deflectToCenter(currentPosition, currentDirection)
  }
}
