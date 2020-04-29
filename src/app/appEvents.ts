import { Observable } from '@babylonjs/core'

export interface IProcessStep {
  step: number
  hours: number
  weekHours: number
  weekHoursWhole: number
}

export interface ISelectedWalker {
  walkerIndex: number
  moveCount: number
  canInfect: boolean
}

export const onWalkerNotFound = new Observable<number>()
export const onWalkerMoveNotFound = new Observable<ISelectedWalker>()
export const onWalkerSelected = new Observable<ISelectedWalker>()
export const onProcessNextHour = new Observable<number>()
export const onProcessCycleBegin = new Observable<IProcessStep>()
export const onProcessCycleComplete = new Observable<IProcessStep>()
