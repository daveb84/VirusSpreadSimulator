import { IObstacle, IMovingMesh } from './types'
import { MeshBuilder, Scene, Vector3 } from '@babylonjs/core'
import { markCollisions, minBound } from '../settings'
import { getCommonMaterials } from '../materials'

const splatSize = 0.2

export class CollisionState {
  private current: IObstacle[] = []
  private clearCurrent: boolean = false
  private materials = getCommonMaterials()

  constructor(private scene: Scene, public movingMesh: IMovingMesh) {}

  public onMoveComplete() {
    if (this.current.length > 0 && this.clearCurrent) {
      this.current.splice(0, this.current.length)
    }

    if (!this.clearCurrent) {
      this.clearCurrent = true
    }
  }

  public collide(obstacle: IObstacle, position: Vector3) {
    if (this.current.includes(obstacle)) {
      return
    }

    this.drawMarker(position)

    this.current.push(obstacle)
    this.clearCurrent = false
    this.movingMesh.stopCurrentMovement()

    const newDirection = this.getNewDirection(obstacle)

    this.movingMesh.startNewDirection(newDirection)
  }

  private getNewDirection(obstacle: IObstacle) {
    const position = this.movingMesh.getCurrentPosition()
    const direction = this.movingMesh.getCurrentDirection()

    return obstacle.getDeflectDirection(position, direction)
  }

  private drawMarker(position: Vector3) {
    if (!markCollisions) {
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
    marker.material = this.materials.collisionMarker
  }
}
