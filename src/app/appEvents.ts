import { Observable } from '@babylonjs/core'

export const onWalkerNotFound = new Observable<number>()
export const onStep = new Observable<number>()
export const onProcess = new Observable<{ step: number; sceneStepId: number }>()
