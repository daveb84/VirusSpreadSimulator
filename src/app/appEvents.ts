import { Observable } from '@babylonjs/core'

export interface IProcessStep {
  step: number
  sceneStepId: number
}

export const onWalkerNotFound = new Observable<number>()
export const onStep = new Observable<number>()
export const onProcess = new Observable<IProcessStep>()
