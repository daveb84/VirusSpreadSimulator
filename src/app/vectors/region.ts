import { generateNumber } from './random'
import {
  Vector3,
  Scene,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Material,
} from '@babylonjs/core'

export interface IFlatRegion {
  y: number
  minX: number
  minZ: number
  maxX: number
  maxZ: number
}

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

  private _material: Material

  constructor(region: IFlatRegion) {
    this._y = region.y
    this._minX = region.minX
    this._minZ = region.minZ
    this._maxX = region.maxX
    this._maxZ = region.maxZ

    this.initPoints()
  }

  private initPoints() {
    this._width = this.maxX - this.minX
    this._depth = this.maxZ - this.minZ

    this._midX = (this.minX + this.maxX) / 2
    this._midZ = (this.minZ + this.maxZ) / 2
  }

  public draw(scene: Scene, material?: Material) {
    if (!material) {
      if (!this._material) {
        const mat = new StandardMaterial('regionMat', scene)
        mat.diffuseColor = new Color3(1, 0, 0)

        this._material = mat
      }

      material = this._material
    }

    const plane = MeshBuilder.CreatePlane(
      'regionPlane',
      { width: this.width, height: this.depth },
      scene
    )
    plane.rotation = new Vector3(Math.PI / 2, 0, 0)
    plane.material = material
    plane.position = new Vector3(this.midX, this.y, this.midZ)
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

    this.initPoints()
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

  public getDirectionTowardPoint(
    start: Vector3,
    distance: number | undefined = undefined
  ) {
    const target = this.getRandomPoint()

    const direction = target.subtract(start)

    if (distance !== undefined) {
      const scale = distance / direction.length()
      const scaled = direction.scale(scale)

      return scaled
    }
  }
}
