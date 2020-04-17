import { Vector3, Mesh } from '@babylonjs/core'
import { IObstacle } from '../collisions/types'

export class Wall implements IObstacle {
  constructor(
    public readonly mesh: Mesh,
    public readonly deflectVector: Vector3
  ) {}
}
