import { MeshBuilder, Scene, Vector3, Mesh } from '@babylonjs/core'
import { markCollisions } from '../settings'
import { getCommonMaterials } from '../materials'

const splatSize = 0.2

export interface IObstacle {
  readonly mesh: Mesh
  getDeflectTarget(
    currentPosition: Vector3,
    currentTarget: Vector3,
    distance: number
  )
}

export interface IMovingMesh {
  getCurrentPosition: () => Vector3
  getCurrentTarget: () => Vector3
  stopCurrentMove: () => void
  startNewMove: (target: Vector3) => void
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
    this.movingMesh.stopCurrentMove()

    const target = this.getDeflectTarget(obstacle, deflectionDistance)

    this.movingMesh.startNewMove(target)
  }

  private getDeflectTarget(obstacle: IObstacle, distance: number) {
    const position = this.movingMesh.getCurrentPosition()
    const target = this.movingMesh.getCurrentTarget()

    return obstacle.getDeflectTarget(position, target, distance)
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
