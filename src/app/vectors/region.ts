import { generateNumber } from './random'
import { Vector3, Scene, MeshBuilder, Color3 } from '@babylonjs/core'

export interface IFlatRegion {
  y: number
  minX: number
  minZ: number
  maxX: number
  maxZ: number
}

const defaultColor = new Color3(1, 0, 0)

export class FlatRegion implements IFlatRegion {
  private _y: number
  private _minX: number
  private _minZ: number
  private _maxX: number
  private _maxZ: number

  private _width: number
  private _depth: number

  private _midX: number
  private _midZ: number

  private _points: Vector3[] = []

  public get y() {
    return this._y
  }
  public get minX() {
    return this._minX
  }
  public get minZ() {
    return this._minZ
  }
  public get maxX() {
    return this._maxX
  }
  public get maxZ() {
    return this._maxZ
  }

  public get width() {
    return this._width
  }
  public get depth() {
    return this._depth
  }

  public get midX() {
    return this._midX
  }
  public get midZ() {
    return this._midZ
  }

  public get points() {
    return this._points
  }

  constructor(region: IFlatRegion) {
    this._y = region.y
    this._minX = region.minX
    this._minZ = region.minZ
    this._maxX = region.maxX
    this._maxZ = region.maxZ

    this.initValues()
  }

  private initValues() {
    this._width = this.maxX - this.minX
    this._depth = this.maxZ - this.minZ

    this._midX = (this.minX + this.maxX) / 2
    this._midZ = (this.minZ + this.maxZ) / 2

    this._points = [
      new Vector3(this.minX, this.y, this.minZ),
      new Vector3(this.maxX, this.y, this.minZ),
      new Vector3(this.maxX, this.y, this.maxZ),
      new Vector3(this.minX, this.y, this.maxZ),
    ]
  }

  public draw(scene: Scene, color?: Color3) {
    if (!color) {
      color = defaultColor
    }

    const points = this._points.map((x) => x)
    points.push(points[0])

    const lines = MeshBuilder.CreateLines('region', { points }, scene)
    lines.color = color
  }

  public resize(width: number, depth: number) {
    const xMid = this.midX
    const zMid = this.midZ

    const wHalf = width / 2
    const dHalf = depth / 2

    this._minX = xMid - wHalf
    this._maxX = xMid + wHalf

    this._minZ = zMid - dHalf
    this._maxZ = zMid + dHalf

    this.initValues()
  }

  public copy(override?: {
    y?: number
    minX?: number
    minZ?: number
    maxX?: number
    maxZ?: number
  }) {
    const copyProps = {
      y: this.y,
      minX: this.minX,
      minZ: this.minZ,
      maxX: this.maxX,
      maxZ: this.maxZ,
    }

    const newProps = {
      ...copyProps,
      ...override,
    }

    const newRegion = new FlatRegion(newProps)

    return newRegion
  }

  public getRandomPoint() {
    const xCoord = generateNumber(this.minX, this.maxX)
    const zCoord = generateNumber(this.minZ, this.maxZ)

    const target = new Vector3(xCoord, this.y, zCoord)
    return target
  }

  public getRandomPointFrom(start: Vector3, length: number) {
    const target = this.getRandomPoint()

    const direction = target.subtract(start)

    const scale = length / direction.length()
    const scaled = direction.scale(scale)

    const scaledTarget = start.add(scaled)

    return scaledTarget
  }

  public containsPosition(position: Vector3) {
    return (
      position.x >= this.minX &&
      position.x <= this.maxX &&
      position.z >= this.minZ &&
      position.z <= this.maxZ
    )
  }
}
