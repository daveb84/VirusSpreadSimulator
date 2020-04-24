import {
  Vector3,
  Scene,
  MeshBuilder,
  StandardMaterial,
  Mesh,
} from '@babylonjs/core'
import { regions } from '../settings'
import { IObstacle } from '../behaviors'
import { FlatRegion } from '../vectors'
import { StageBase } from './stageBase'
import { GraveYard } from './graveYard'

const stageRegion = regions.stage
const walkerRegion = regions.walker

export class Stage extends StageBase {
  private _bounds: StageBounds

  public get bounds() {
    return this._bounds
  }

  private _graveYard: GraveYard

  public get graveYard() {
    return this._graveYard
  }

  constructor(scene: Scene) {
    super(scene, regions.stage)

    this._bounds = new StageBounds(scene)
    this._graveYard = new GraveYard(scene)
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
