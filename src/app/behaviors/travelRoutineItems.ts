import { FlatRegion } from '../vectors'
import { populationConfig, regions } from '../settings'

interface IRoutineDay {
  name: string
  days: number[]
  schedule: IRoutineDayItem[]
}

interface IRoutineDayItem {
  name: string
  locations: FlatRegion[]
  locationDuration?: number[]
  end: number[]
  chance?: number
  endRelative?: boolean
}

export interface IRoutineItem {
  day: number
  name: string
  debugInfo: string
  locations: FlatRegion[]
  locationDuration?: number[]
  end: number[]
  chance?: number
  endRelative?: boolean
}

const createTemplates = (
  home: FlatRegion,
  work: FlatRegion[],
  shops: FlatRegion[],
  entertainment: FlatRegion[]
) => {
  // const dayTemplates2: IRoutineDay[] = [
  //   {
  //     name: 'workday',
  //     days: [1, 2, 3, 4, 5, 6, 7],
  //     schedule: [
  //       { locations: [home], end: [3, 3] },
  //       { locations: work, end: [5, 16] },
  //       { locations: shops, end: [3, 4], endRelative: true, locationDuration: [1, 1] },
  //       { locations: work, end: [23, 23] },
  //     ],
  //   },
  // ]

  const dayTemplates: IRoutineDay[] = [
    {
      name: 'weekday',
      days: [1, 2, 3, 4, 5],
      schedule: [
        { name: 'home', locations: [home], end: [7.5, 9] },
        { name: 'work-morning', locations: work, end: [12, 13] },
        {
          name: 'lunch',
          locations: shops,
          end: [0.75, 1.5],
          endRelative: true,
        },
        { name: 'work-afternoon', locations: work, end: [16, 18] },
        {
          name: 'evening',
          locations: entertainment,
          end: [19, 23],
          chance: 0.2,
        },
      ],
    },
    {
      name: 'saturday',
      days: [6],
      schedule: [
        { name: 'home', locations: [home], end: [9, 15] },
        {
          name: 'day-out',
          locations: [...shops, ...entertainment],
          end: [11, 16],
          locationDuration: [1, 2],
        },
        { name: 'home-afternoon', locations: [home], end: [16, 20] },
        {
          name: 'night-out',
          locations: [...shops, ...entertainment],
          end: [22, 27],
          locationDuration: [1, 2],
          chance: 0.5,
        },
      ],
    },
    {
      name: 'sunday',
      days: [7],
      schedule: [
        { name: 'home', locations: [home], end: [8, 10] },
        {
          name: 'day-out',
          locations: entertainment,
          end: [17, 18],
          locationDuration: [0, 1],
          chance: 0.5,
        },
      ],
    },
  ]

  return dayTemplates
}

const createLockdownTemplates = (
  home: FlatRegion,
  work: FlatRegion[],
  shops: FlatRegion[]
) => {
  const isWorking = Math.random() < populationConfig.lockdownWorkRatio
  if (!isWorking) {
    work = []
  }

  const dayTemplates: IRoutineDay[] = []
  const weekend: IRoutineDay = {
    name: 'weekend',
    days: [6, 7],
    schedule: [
      { name: 'home', locations: [home], end: [5, 22] },
      {
        name: 'shop',
        locations: shops,
        end: [1, 1.5],
        endRelative: true,
        locationDuration: [0.5, 1],
        chance: 0.5,
      },
    ],
  }

  if (isWorking) {
    dayTemplates.push({
      name: 'weekday',
      days: [1, 2, 3, 4, 5],
      schedule: [
        { name: 'home', locations: [home], end: [6, 10] },
        { name: 'work-morning', locations: work, end: [11, 12.5] },
        {
          name: 'lunch',
          locations: shops,
          end: [0.75, 1.5],
          endRelative: true,
          chance: 0.5,
        },
        { name: 'work-afternoon', locations: work, end: [16, 20] },
      ],
    })
    dayTemplates.push(weekend)
  } else {
    weekend.name = 'everyday'
    weekend.days = [1, 2, 3, 4, 5, 6, 7]
    dayTemplates.push(weekend)
  }
  return dayTemplates
}

export const createRoutineItems = (
  home: FlatRegion,
  work: FlatRegion[],
  shops: FlatRegion[],
  entertainment: FlatRegion[]
) => {
  const dayTemplates = createTemplates(home, work, shops, entertainment)

  return convertTemplates(dayTemplates)
}

export const createLockdownRoutineItems = (
  home: FlatRegion,
  work: FlatRegion[],
  shops: FlatRegion[]
) => {
  const dayTemplates = createLockdownTemplates(home, work, shops)

  return convertTemplates(dayTemplates)
}

const convertTemplates = (dayTemplates: IRoutineDay[]) => {
  const items: IRoutineItem[] = []

  dayTemplates.forEach((dayTemplate) => {
    dayTemplate.days.forEach((day) => {
      const dayHours = (day - 1) * 24

      dayTemplate.schedule.forEach((schedule, index) => {
        if (schedule.locations.length > 0) {
          const item = {
            name: `${dayTemplate.name} ${schedule.name}`,
            debugInfo: '',
            day: day,
            locations: schedule.locations,
            locationDuration: schedule.locationDuration,
            endRelative: schedule.endRelative,
            end: schedule.endRelative
              ? schedule.end
              : [schedule.end[0] + dayHours, schedule.end[1] + dayHours],
            chance: schedule.chance,
          }

          item.debugInfo = `${dayTemplate.name} ${day}:${dayHours} schedule:${item.name} ${index} end:${item.end[0]}-${item.end[1]}`

          items.push(item)
        }
      })
    })
  })

  return items
}
