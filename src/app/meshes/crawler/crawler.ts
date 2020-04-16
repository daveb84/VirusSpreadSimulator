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
import { createMoveAnimations, createTargetVector } from './moveCrawler'
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
  private _moving: boolean = false
  private _infected: boolean = false

  private moveVector: Vector3
  private collisionDeflectVector: Vector3

  constructor(private scene: Scene, private settings: CrawlerSettings) {
    this.mesh = MeshBuilder.CreateBox('crawler', dimensions, this.scene)
    this.mesh.material = settings.defaultMaterial
    this.mesh.animations = []

    this.setRandomPosition()
  }

  public get infected() {
    return this._infected
  }

  public get moving() {
    return this._moving
  }

  private setRandomPosition() {
    this.mesh.position = new Vector3(
      generateNumber(minBound.x, maxBound.x),
      positionY,
      generateNumber(minBound.z, maxBound.z)
    )
  }

  private moveToNewTarget() {
    const angle = generateNumber(0, 360)
    this.moveVector = createTargetVector(angle)

    this.moveToTarget()
  }

  private moveToTarget() {
    const animations = createMoveAnimations(
      this.mesh.position,
      this.moveVector,
      frameRate
    )

    const running = this.scene.beginDirectAnimation(
      this.mesh,
      animations,
      0,
      frameRate,
      false,
      1,
      () => {
        this.moveAnimations = []

        if (this.collisionDeflectVector) {
          this.moveVector = this.collisionDeflectVector
          this.collisionDeflectVector = null
          this.moveToTarget()
        }
        if (this._moving) {
          this.moveToNewTarget()
        }
      }
    )

    this.moveAnimations.push(running)
  }

  start() {
    this._moving = true
    this.moveToNewTarget()
  }

  stop() {
    this._moving = false
    if (this.moveAnimations.length) {
      this.moveAnimations.forEach((x) => x.stop())
    }
  }

  collideWithObstacle(obstacle: IObstacle) {
    if (this.collisionDeflectVector) {
      return
    }

    this.collisionDeflectVector = this.moveVector.multiply(
      obstacle.deflectVector
    )
    this.moveAnimations.forEach((x) => x.stop())

    this._infected = true
    this.mesh.material = this.settings.infectedMaterial
  }
}
