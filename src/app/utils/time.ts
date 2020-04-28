import { travelConfig } from '../settings'

export const convertToHours = (sceneStepId: number) => Math.floor(sceneStepId * travelConfig.processorStepRatio)

export const convertHoursToSceneStepId = (hours: number) => hours / travelConfig.processorStepRatio

export const convertDayToSceneStepId = (day: number) => convertHoursToSceneStepId(day * travelConfig.timeSlots)