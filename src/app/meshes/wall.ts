import { Vector3, Mesh, MeshBuilder, Material } from '@babylonjs/core'
import { IObstacle } from '../collisions/types'
import { boundsMidpoint, minBound, maxBound } from '../bounds'
import { generateNumber } from '../../utils/random'

const deflectTargetBounds = {
  minX: (minBound.x + boundsMidpoint.x) / 2,
  minZ: (minBound.z + boundsMidpoint.z) / 2,
  maxX: (maxBound.x + boundsMidpoint.x) / 2,
  maxZ: (maxBound.z + boundsMidpoint.z) / 2,
}

export class Wall implements IObstacle {
  constructor(public readonly mesh: Mesh) {}

  getDeflectDirection(currentDirection: Vector3) {
    const xCoord = generateNumber(
      deflectTargetBounds.minX,
      deflectTargetBounds.maxX
    )
    const zCoord = generateNumber(
      deflectTargetBounds.minZ,
      deflectTargetBounds.maxZ
    )

    const target = new Vector3(xCoord, this.mesh.position.y, zCoord)
    const direction = target.subtract(this.mesh.position)

    const distance = currentDirection.length()
    const scale = distance / direction.length()
    const scaled = direction.scale(scale)

    return scaled
  }
}
