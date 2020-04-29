import { travelConfig } from '../settings'

const days = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const convertStepToHours = (step: number) =>
  step * travelConfig.stepHoursRatio

export const getWeekFromHours = (hours: number) =>
  Math.floor(hours / travelConfig.hoursInWeek)

export const getWeekHourDisplayText = (hours: number) => {
  const hour = hours % 24
  const day = days[((hours - hour) / 24) % 7]
  const week = Math.floor(hours / 24 / 7) + 1

  return `Week ${week} ${day} ${hour}:00`
}
