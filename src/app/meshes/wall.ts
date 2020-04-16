import { Vector3, Mesh } from '@babylonjs/core'
import { IObstacle } from '../obstacles/obstacle'

export class Wall implements IObstacle {
  constructor(
    public readonly mesh: Mesh,
    public readonly deflectVector: Vector3
  ) {}
}
