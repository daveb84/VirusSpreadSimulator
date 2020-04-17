import { IObstacle, IMovingMesh } from './types'
import { Material, MeshBuilder, Scene, Vector3 } from '@babylonjs/core'
import { minBound } from '../bounds'

const splatSize = 0.2

export interface ICollisionStateSettings {
  splatMaterial?: Material
}

export class CollisionState {
  private current: IObstacle = null

  constructor(
    private scene: Scene,
    public movingMesh: IMovingMesh,
    private settings: ICollisionStateSettings
  ) {}

  public onMoveComplete() {}

  public collide(obstacle: IObstacle, position: Vector3) {
    if (this.current === obstacle) {
      return
    }

    this.current = obstacle
    this.drawSplat(position)

    const newDirection = this.getNewDirection(obstacle)

    this.movingMesh.stopCurrentMovement(() => {
      this.movingMesh.startNewDirection(newDirection)
    })
  }

  private getNewDirection(obstacle: IObstacle) {
    const deflect = this.movingMesh
      .getCurrentDirection()
      .multiply(obstacle.deflectVector)

    return deflect
  }

  private drawSplat(position: Vector3) {
    if (!this.settings.splatMaterial) {
      return
    }

    const splat = MeshBuilder.CreateSphere(
      'splat',
      { diameter: splatSize },
      this.scene
    )
    splat.position = new Vector3(
      position.x,
      minBound.y + splatSize / 2,
      position.z
    )
    splat.material = this.settings.splatMaterial
  }
}
