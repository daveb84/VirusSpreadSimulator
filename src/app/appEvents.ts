import { Observable } from '@babylonjs/core'

export interface IProcessStep {
  step: number
  sceneStepId: number
}

export const onWalkerNotFound = new Observable<number>()
export const onProcessNextStep = new Observable<number>()
export const onProcessCycleBegin = new Observable<IProcessStep>()
export const onProcessCycleComplete = new Observable<IProcessStep>()
