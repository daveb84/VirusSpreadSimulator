import { MeshBuilder, Scene, Vector3, Mesh } from '@babylonjs/core'
import { markCollisions } from '../settings'
import { getCommonMaterials } from '../materials'

const splatSize = 0.2

export interface IObstacle {
  readonly mesh: Mesh
  getDeflectDirection(
    currentPosition: Vector3,
    currentDirection: Vector3,
    distance: number
  )
}

export interface IMovingMesh {
  getCurrentPosition: () => Vector3
  getCurrentDirection: () => Vector3
  stopCurrentMovement: () => void
  startNewDirection: (direction: Vector3) => void
}

export class CollisionHandler {
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

  public collide(
    obstacle: IObstacle,
    position: Vector3,
    deflectionDistance: number
  ) {
    if (this.current.includes(obstacle)) {
      return
    }

    this.drawMarker(position)

    this.current.push(obstacle)
    this.clearCurrent = false
    this.movingMesh.stopCurrentMovement()

    const newDirection = this.getNewDirection(obstacle, deflectionDistance)

    this.movingMesh.startNewDirection(newDirection)
  }

  private getNewDirection(obstacle: IObstacle, distance: number) {
    const position = this.movingMesh.getCurrentPosition()
    const direction = this.movingMesh.getCurrentDirection()

    return obstacle.getDeflectDirection(position, direction, distance)
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
    marker.position = position
    marker.material = this.materials.collisionMarker
  }
}
