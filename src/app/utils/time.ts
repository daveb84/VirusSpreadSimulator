import { travelConfig } from '../settings'

export const convertStepToHours = (step: number) =>
  step * travelConfig.stepHoursRatio
export const convertDayToStep = (day: number) =>
  (day * travelConfig.hoursInWeek) / travelConfig.stepHoursRatio
export const convertHoursToStep = (hours: number) =>
  hours / travelConfig.stepHoursRatio
export const convertDayToHours = (day: number) => day * travelConfig.hoursInWeek
export const getWeekFromHours = (hours: number) =>
  Math.floor(hours / travelConfig.hoursInWeek)
