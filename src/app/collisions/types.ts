import { Mesh, Vector3, Material } from '@babylonjs/core'

export interface IObstacle {
  readonly mesh: Mesh
  readonly deflectVector: Vector3
}

export interface IMovingMesh {
  getCurrentPosition: () => Vector3
  getCurrentDirection: () => Vector3
  stopCurrentMovement: () => void
  startNewDirection: (direction: Vector3) => void
}
