import {
  Vector3,
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
} from '@babylonjs/core'
import { minBound, maxBound, boundsMidpoint, boundsSize } from '../settings'
import { groundImage } from '../materials'
import { Wall } from './wall'

const wallHeight = 0.1
const wallDepth = 0.2
const wallPositionY = minBound.y + wallHeight / 2

interface IWallCoords {
  width: number
  depth: number
  x: number
  z: number
}

const groundDimensions = {
  width: boundsSize.width + wallDepth * 2.5,
  depth: boundsSize.depth + wallDepth * 2.5,
}

const wallCoors = {
  front: {
    width: groundDimensions.width,
    depth: wallDepth,
    x: boundsMidpoint.x,
    z: minBound.z - wallDepth,
  },
  back: {
    width: groundDimensions.width,
    depth: wallDepth,
    x: boundsMidpoint.x,
    z: maxBound.z + wallDepth,
  },
  left: {
    width: wallDepth,
    depth: groundDimensions.depth,
    x: minBound.x - wallDepth,
    z: boundsMidpoint.z,
  },
  right: {
    width: wallDepth,
    depth: groundDimensions.depth,
    x: maxBound.x + wallDepth,
    z: boundsMidpoint.z,
  },
}

export class Stage {
  private material: StandardMaterial

  private _walls: Wall[] = []

  public get walls() {
    return this._walls
  }

  constructor(private scene: Scene) {
    this.material = new StandardMaterial('groundMaterial', this.scene)
    this.material.diffuseTexture = new Texture(groundImage, this.scene)

    const ground = MeshBuilder.CreateGround('ground', {
      width: groundDimensions.width,
      height: groundDimensions.depth,
    })

    ground.position = new Vector3(
      boundsMidpoint.x,
      minBound.y,
      boundsMidpoint.z
    )
    ground.material = this.material

    this.createWalls()
  }

  private createWalls() {
    var front = this.createWall(wallCoors.front)
    var back = this.createWall(wallCoors.back)
    var left = this.createWall(wallCoors.left)
    var right = this.createWall(wallCoors.right)

    this._walls = [front, back, left, right]
  }

  private createWall(coords: IWallCoords) {
    const wall = MeshBuilder.CreateBox(
      'north',
      { height: wallHeight, depth: coords.depth, width: coords.width },
      this.scene
    )
    wall.position = new Vector3(coords.x, wallPositionY, coords.z)
    wall.material = this.material

    return new Wall(wall)
  }
}
