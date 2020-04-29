import { FlatRegion } from '../vectors'
import {
  convertDayToSceneStepId,
  convertHoursToSceneStepId,
} from '../utils/time'

interface IRoutineDay {
  name: string
  days: number[]
  schedule: IRoutineDayItem[]
}

interface IRoutineDayItem {
  locations: FlatRegion[]
  locationDuration?: number[]
  end: number[]
  chance?: number
  multipleLocations?: boolean
}

export interface IRoutineItem {
  locations: FlatRegion[]
  locationDuration?: number[]
  multipleLocations?: boolean
  start: number[]
  end: number[]
}

const createTemplates = (
  home: FlatRegion,
  work: FlatRegion,
  foodShops: FlatRegion[],
  entertainment: FlatRegion[]
) => {
  const dayTemplates: IRoutineDay[] = [
    {
      name: 'workday',
      days: [1, 2, 3, 4, 5],
      schedule: [
        { locations: [home], end: [7.5, 9] },
        { locations: [work], end: [12, 13] },
        {
          locations: foodShops,
          end: [12.5, 14],
          locationDuration: [0.5, 0.75],
        },
        { locations: [work], end: [16, 18] },
        { locations: entertainment, end: [19, 23], chance: 0.2 },
      ],
    },
    {
      name: 'saturday',
      days: [6],
      schedule: [
        { locations: [home], end: [9, 15] },
        {
          locations: [...foodShops, ...entertainment],
          end: [11, 16],
          multipleLocations: true,
          locationDuration: [1, 2],
        },
        { locations: [home], end: [16, 20] },
        {
          locations: [...foodShops, ...entertainment],
          end: [22, 27],
          multipleLocations: true,
          locationDuration: [1, 2],
          chance: 0.5,
        },
      ],
    },
    {
      name: 'sunday',
      days: [7],
      schedule: [
        { locations: [home], end: [8, 10] },
        {
          locations: entertainment,
          end: [17, 18],
          multipleLocations: true,
          locationDuration: [0, 1],
        },
      ],
    },
  ]

  return dayTemplates
}

export const createRoutineItems = (
  home: FlatRegion,
  work: FlatRegion,
  foodShops: FlatRegion[],
  entertainment: FlatRegion[]
) => {
  const dayTemplates = createTemplates(home, work, foodShops, entertainment)

  const items: IRoutineItem[] = []

  let previous: IRoutineItem = {
    start: [0, 0],
    end: [0, 0],
    locations: [],
  }
  dayTemplates.forEach((dayTemplate) => {
    dayTemplate.days.forEach((day) => {
      const dayStartTime = convertDayToSceneStepId(day)

      dayTemplate.schedule.forEach((schedule) => {
        if (schedule.chance === undefined || Math.random() < schedule.chance) {
          const item: IRoutineItem = {
            locations: schedule.locations,
            locationDuration: normaliseRange(0, schedule.locationDuration),
            start: previous.end,
            end: normaliseRange(dayStartTime, schedule.end),
          }

          items.push(item)
          previous = item
        }
      })
    })
  })

  return items
}

const normaliseRange = (dayStartTime: number, range: number[]) => {
  if (!range) {
    return undefined
  }

  return [
    convertHoursToSceneStepId(range[0]) + dayStartTime,
    convertHoursToSceneStepId(range[1]) + dayStartTime,
  ]
}
