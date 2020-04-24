import {
  Vector3,
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
} from '@babylonjs/core'
import { groundImage } from '../materials'
import { FlatRegion } from '../vectors'

interface IWallCoords {
  width: number
  depth: number
  x: number
  z: number
}

const wallHeight = 0.1
const wallDepth = 0.2

export class StageBase {
  private material: StandardMaterial

  private wallPositionY: number

  private width: number
  private depth: number

  constructor(private scene: Scene, private region: FlatRegion) {
    this.material = new StandardMaterial('groundMaterial', this.scene)
    this.material.diffuseTexture = new Texture(groundImage, this.scene)

    this.wallPositionY = region.y + wallHeight / 2

    this.width = region.width + wallDepth * 2.5
    this.depth = region.depth + wallDepth * 2.5

    const ground = MeshBuilder.CreateGround('ground', {
      width: this.width,
      height: this.depth,
    })

    ground.position = new Vector3(region.midX, region.y, region.midZ)
    ground.material = this.material

    this.createWalls()
  }

  private createWalls() {
    const { region: stageRegion, width, depth } = this

    const wallCoors = {
      front: {
        width: width,
        depth: wallDepth,
        x: stageRegion.midX,
        z: stageRegion.minZ - wallDepth,
      },
      back: {
        width: width,
        depth: wallDepth,
        x: stageRegion.midX,
        z: stageRegion.maxZ + wallDepth,
      },
      left: {
        width: wallDepth,
        depth: depth,
        x: stageRegion.minX - wallDepth,
        z: stageRegion.midZ,
      },
      right: {
        width: wallDepth,
        depth: depth,
        x: stageRegion.maxX + wallDepth,
        z: stageRegion.midZ,
      },
    }

    this.createWall(wallCoors.front)
    this.createWall(wallCoors.back)
    this.createWall(wallCoors.left)
    this.createWall(wallCoors.right)
  }

  private createWall(coords: IWallCoords) {
    const wall = MeshBuilder.CreateBox(
      'north',
      { height: wallHeight, depth: coords.depth, width: coords.width },
      this.scene
    )
    wall.position = new Vector3(coords.x, this.wallPositionY, coords.z)
    wall.material = this.material
  }
}
