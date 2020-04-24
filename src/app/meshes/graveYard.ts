import { Scene } from '@babylonjs/core'
import { regions } from '../settings'
import { StageBase } from './stageBase'

export class GraveYard extends StageBase {
  constructor(scene: Scene) {
    super(scene, regions.graveYard)
  }
}
