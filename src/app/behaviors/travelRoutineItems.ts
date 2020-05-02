import { FlatRegion } from '../vectors'
import { populationConfig } from '../settings'

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

export interface IRoutineLocations {
  home: FlatRegion
  work: FlatRegion[]
  homeShops: FlatRegion[]
  homeEntertainment: FlatRegion[]
  workShops: FlatRegion[]
  workEntertainment: FlatRegion[]
}

const createTemplates = (locations: IRoutineLocations) => {
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
        { name: 'home', locations: [locations.home], end: [7.5, 9] },
        { name: 'work-morning', locations: locations.work, end: [12, 13] },
        {
          name: 'lunch',
          locations: locations.workShops,
          end: [0.75, 1.5],
          endRelative: true,
        },
        { name: 'work-afternoon', locations: locations.work, end: [16, 18] },
        {
          name: 'evening',
          locations: locations.workEntertainment,
          end: [19, 23],
          chance: 0.2,
        },
      ],
    },
    {
      name: 'saturday',
      days: [6],
      schedule: [
        { name: 'home', locations: [locations.home], end: [9, 15] },
        {
          name: 'day-out',
          locations: [...locations.homeShops, ...locations.homeShops],
          end: [11, 16],
          locationDuration: [1, 2],
        },
        { name: 'home-afternoon', locations: [locations.home], end: [16, 20] },
        {
          name: 'night-out',
          locations: [...locations.homeShops, ...locations.homeEntertainment],
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
        { name: 'home', locations: [locations.home], end: [8, 10] },
        {
          name: 'day-out',
          locations: locations.homeEntertainment,
          end: [17, 18],
          locationDuration: [0, 1],
          chance: 0.5,
        },
      ],
    },
  ]

  return dayTemplates
}

const createLockdownTemplates = (locations: IRoutineLocations) => {
  const isWorking = Math.random() < populationConfig.lockdownWorkRatio

  const dayTemplates: IRoutineDay[] = []
  const weekend: IRoutineDay = {
    name: 'weekend',
    days: [6, 7],
    schedule: [
      { name: 'home', locations: [locations.home], end: [5, 22] },
      {
        name: 'shop',
        locations: locations.homeShops,
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
        { name: 'home', locations: [locations.home], end: [6, 10] },
        { name: 'work-morning', locations: locations.work, end: [11, 12.5] },
        {
          name: 'lunch',
          locations: locations.workShops,
          end: [0.75, 1.5],
          endRelative: true,
          chance: 0.5,
        },
        { name: 'work-afternoon', locations: locations.work, end: [16, 20] },
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

export const createRoutineItems = (locations: IRoutineLocations) => {
  const dayTemplates = createTemplates(locations)

  return convertTemplates(dayTemplates)
}

export const createLockdownRoutineItems = (locations: IRoutineLocations) => {
  const dayTemplates = createLockdownTemplates(locations)

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
