import { Mesh, Vector3 } from '@babylonjs/core'

export interface IObstacle {
  readonly mesh: Mesh
  readonly deflectVector: Vector3
}
