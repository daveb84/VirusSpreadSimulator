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
import { minBound, maxBound } from '../../bounds'
import { generateNumber } from '../../../utils/random'
import { createMoveAnimations } from './moveCrawler'
import { IObstacle } from '../../obstacles/obstacle'

const dimensions = { width: 0.1, height: 0.3, depth: 0.1 }
const positionY = minBound.y + dimensions.height / 2
const frameRate = 10

export interface CrawlerSettings {
  defaultMaterial: Material
  infectedMaterial: Material
}

export const getCrawlerSettings = (scene: Scene) => {
  const defaultMaterial = new StandardMaterial('crawlerMat1', scene)
  const infectedMaterial = new StandardMaterial('crawlerMat2', scene)

  defaultMaterial.diffuseColor = new Color3(0.5, 0.5, 1)
  infectedMaterial.diffuseColor = new Color3(1, 0.4, 0.4)

  const settings: CrawlerSettings = {
    defaultMaterial,
    infectedMaterial,
  }

  return settings
}

export class Crawler {
  public readonly mesh: Mesh

  private moveAnimations: Animatable[] = []
  private moving: boolean = false
  private _infected: boolean = false

  constructor(private scene: Scene, private settings: CrawlerSettings) {
    this.mesh = MeshBuilder.CreateBox('crawler', dimensions, this.scene)
    this.mesh.material = settings.defaultMaterial
    this.mesh.animations = []

    this.setRandomPosition()
  }

  public get infected() {
    return this._infected
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

  collideWithObstacle(obstacle: IObstacle) {
    this._infected = true
    this.mesh.material = this.settings.infectedMaterial
  }
}
