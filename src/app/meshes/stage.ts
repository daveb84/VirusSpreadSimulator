import {
  Vector3,
  Scene,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Mesh,
} from '@babylonjs/core'
import { regions } from '../settings'
import { groundImage } from '../materials'
import { IObstacle } from '../behaviors'
import { FlatRegion } from '../vectors'

const stageRegion = regions.stage
const walkerRegion = regions.walker

const wallHeight = 0.1
const wallDepth = 0.2
const wallPositionY = stageRegion.y + wallHeight / 2

interface IWallCoords {
  width: number
  depth: number
  x: number
  z: number
}

const groundDimensions = {
  width: stageRegion.width + wallDepth * 2.5,
  depth: stageRegion.depth + wallDepth * 2.5,
}

const wallCoors = {
  front: {
    width: groundDimensions.width,
    depth: wallDepth,
    x: stageRegion.midX,
    z: stageRegion.minZ - wallDepth,
  },
  back: {
    width: groundDimensions.width,
    depth: wallDepth,
    x: stageRegion.midX,
    z: stageRegion.maxZ + wallDepth,
  },
  left: {
    width: wallDepth,
    depth: groundDimensions.depth,
    x: stageRegion.minX - wallDepth,
    z: stageRegion.midZ,
  },
  right: {
    width: wallDepth,
    depth: groundDimensions.depth,
    x: stageRegion.maxX + wallDepth,
    z: stageRegion.midZ,
  },
}

export class Stage {
  private material: StandardMaterial

  private _bounds

  public get bounds() {
    return this._bounds
  }

  constructor(private scene: Scene) {
    this.material = new StandardMaterial('groundMaterial', this.scene)
    this.material.diffuseTexture = new Texture(groundImage, this.scene)

    const ground = MeshBuilder.CreateGround('ground', {
      width: groundDimensions.width,
      height: groundDimensions.depth,
    })

    ground.position = new Vector3(
      stageRegion.midX,
      stageRegion.y,
      stageRegion.midZ
    )
    ground.material = this.material

    this._bounds = new StageBounds(scene)

    this.createWalls()
  }

  private createWalls() {
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
    wall.position = new Vector3(coords.x, wallPositionY, coords.z)
    wall.material = this.material
  }
}

export class StageBounds implements IObstacle {
  public mesh: Mesh

  private deflectTarget: FlatRegion

  constructor(scene: Scene) {
    const bounds = MeshBuilder.CreateBox(
      'boundBox',
      {
        width: stageRegion.width,
        height: 1,
        depth: stageRegion.depth,
      },
      scene
    )
    bounds.position = new Vector3(
      stageRegion.midX,
      stageRegion.y + 0.5,
      stageRegion.midZ
    )
    bounds.isPickable = false

    const material = new StandardMaterial('boundsMaterial', scene)
    // material.diffuseColor = new Color3(1, 1, 1)
    // material.wireframe = true
    material.alpha = 0
    // material.alpha = 0.3
    // material.backFaceCulling  = false

    bounds.material = material

    this.mesh = bounds

    this.deflectTarget = walkerRegion.copy()
    this.deflectTarget.resize(
      walkerRegion.width * 0.75,
      walkerRegion.depth * 0.75
    )

    // this.deflectTarget.draw(scene)
    // regions.buildingGrid.drawAll(scene)
  }

  getDeflectTarget(
    currentPosition: Vector3,
    currentTarget: Vector3,
    distance: number
  ) {
    return this.deflectTarget.getRandomPointFrom(currentPosition, distance)
  }
}
