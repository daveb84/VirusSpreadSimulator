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
import { moveCrawler, createDirection } from './moveCrawler'
import { IObstacle } from '../../collisions/obstacle'

const dimensions = { width: 0.1, height: 0.3, depth: 0.1 }
const positionY = minBound.y + dimensions.height / 2

export interface CrawlerSettings {
  defaultMaterial: Material
  infectedMaterial: Material
  collisionMaterial: Material
  traceMaterial: Material
}

export const getCrawlerSettings = (scene: Scene) => {
  const defaultMaterial = new StandardMaterial('crawlerMat1', scene)
  const infectedMaterial = new StandardMaterial('crawlerMat2', scene)
  const collisionMaterial = new StandardMaterial('crawlerMat3', scene)
  const traceMaterial = new StandardMaterial('crawlerMat3', scene)

  defaultMaterial.diffuseColor = new Color3(0.5, 0.5, 1)
  infectedMaterial.diffuseColor = new Color3(1, 0.4, 0.4)

  collisionMaterial.diffuseColor = new Color3(0.7, 0.3, 0.3)
  collisionMaterial.alpha = 0.1

  traceMaterial.diffuseColor = new Color3(1, 1, 1)

  const settings: CrawlerSettings = {
    defaultMaterial,
    infectedMaterial,
    collisionMaterial,
    traceMaterial,
  }

  return settings
}

export class Crawler {
  public readonly mesh: Mesh

  private moveAnimations: Animatable[] = []
  private _moving: boolean = false
  private _infected: boolean = false

  private direction: Vector3 | null = null
  private collisionObstacle: IObstacle | null = null

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

  start() {
    this.move()
  }

  stop() {
    this._moving = false
    if (this.moveAnimations.length) {
      this.moveAnimations.forEach((x) => x.stop())
    }

    this.moveAnimations.splice(0, this.moveAnimations.length)
  }

  collideWithObstacle(obstacle: IObstacle) {
    if (this.collisionObstacle === obstacle) {
      return
    }

    this.collisionObstacle = obstacle

    this.stop()
    this.drawCollision()

    const deflect = this.direction.multiply(obstacle.deflectVector)

    this.move(deflect, true)

    this._infected = true
    this.mesh.material = this.settings.infectedMaterial
  }

  private setRandomPosition() {
    this.mesh.position = new Vector3(
      generateNumber(minBound.x, maxBound.x),
      positionY,
      generateNumber(minBound.z, maxBound.z)
    )
  }

  private move(direction?: Vector3 | undefined, isDeflection: boolean = false) {
    if (direction === undefined) {
      direction = createDirection()
    }

    this.direction = direction

    const from = this.mesh.position.clone()
    const to = from.add(direction)

    this.drawTrace(from, to)

    const animation = moveCrawler(this.mesh, from, to, () =>
      this.onMoveComplete(isDeflection)
    )

    this.moveAnimations.push(animation)
    this._moving = true
  }

  private onMoveComplete(isDeflection: boolean = false) {
    this.moveAnimations.splice(0, this.moveAnimations.length)

    if (isDeflection) {
      this.collisionObstacle = null
    }

    if (this._moving) {
      this.move()
    }
  }

  private drawCollision() {
    const splatSize = 0.2
    const splat = MeshBuilder.CreateSphere(
      'splat',
      { diameter: splatSize },
      this.scene
    )
    splat.position = new Vector3(
      this.mesh.position.x,
      minBound.y + splatSize / 2,
      this.mesh.position.z
    )
    splat.material = this.settings.collisionMaterial
  }

  private drawTrace(from: Vector3, to: Vector3) {
    const line = MeshBuilder.CreateLines(
      'lines',
      { points: [from, to], updatable: false },
      this.scene
    )
    line.material = this.settings.traceMaterial
  }
}
