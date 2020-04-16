import {
  Scene,
  Vector3,
  Color3,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Material,
  Animatable,
} from '@babylonjs/core'
import { minBound, maxBound } from '../bounds'
import { generateNumber } from '../../utils/random'
import { createMoveAnimations } from './moveCrawler'

const dimensions = { width: 0.1, height: 0.3, depth: 0.1 }
const positionY = minBound.y + dimensions.height / 2
const frameRate = 10

export const crawlerMaterial = (scene: Scene) => {
  const material = new StandardMaterial('crawlerMaterial', scene)

  material.diffuseColor = new Color3(1, 0.5, 0.5)

  return material
}

export class Crawler {
  public readonly mesh: Mesh
  private moveAnimations: Animatable[] = []
  private moving: boolean = false

  constructor(private scene: Scene, private defaultMaterial: Material) {
    this.mesh = MeshBuilder.CreateBox('crawler', dimensions, this.scene)
    this.mesh.material = defaultMaterial
    this.mesh.animations = []

    this.setRandomPosition()
  }

  private setRandomPosition() {
    this.mesh.position = new Vector3(
      generateNumber(minBound.x, maxBound.x),
      positionY,
      generateNumber(minBound.z, maxBound.z)
    )
  }

  private move() {
    const animations = createMoveAnimations(this.mesh.position, frameRate)

    const running = this.scene.beginDirectAnimation(
      this.mesh,
      animations,
      0,
      frameRate,
      false,
      1,
      () => {
        this.moveAnimations = []
        if (this.moving) {
          this.move()
        }
      }
    )

    this.moveAnimations.push(running)
  }

  start() {
    this.moving = true
    this.move()
  }

  stop() {
    this.moving = false
    if (this.moveAnimations.length) {
      this.moveAnimations.forEach((x) => x.stop())
    }
  }
}
