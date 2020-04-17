import { IObstacle, IMovingMesh } from './types'
import { Material, MeshBuilder, Scene, Vector3 } from '@babylonjs/core'
import { minBound } from '../bounds'

const splatSize = 0.2

export interface ICollisionStateSettings {
  markCollisions: boolean
  markerMaterial: Material
}

export class CollisionState {
  private current: IObstacle = null
  private clearCurrent: boolean = false

  constructor(
    private scene: Scene,
    public movingMesh: IMovingMesh,
    private settings: ICollisionStateSettings
  ) {}

  public onMoveComplete() {
    if (this.current && this.clearCurrent) {
      this.current = null
    }

    if (!this.clearCurrent) {
      this.clearCurrent = true
    }
  }

  public collide(obstacle: IObstacle, position: Vector3) {
    if (this.current === obstacle) {
      return
    }

    this.drawMarker(position)

    this.current = obstacle
    this.clearCurrent = false
    this.movingMesh.stopCurrentMovement()

    const newDirection = this.getNewDirection(obstacle)

    this.movingMesh.startNewDirection(newDirection)
  }

  private getNewDirection(obstacle: IObstacle) {
    const deflect = this.movingMesh
      .getCurrentDirection()
      .multiply(obstacle.deflectVector)

    return deflect
  }

  private drawMarker(position: Vector3) {
    if (!this.settings.markCollisions) {
      return
    }

    const marker = MeshBuilder.CreateSphere(
      'splat',
      { diameter: splatSize },
      this.scene
    )
    marker.position = new Vector3(
      position.x,
      minBound.y + splatSize / 2,
      position.z
    )
    marker.material = this.settings.markerMaterial
  }
}
