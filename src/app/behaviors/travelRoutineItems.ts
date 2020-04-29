import { FlatRegion } from '../vectors'

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
  key: string
  locations: FlatRegion[]
  locationDuration?: number[]
  multipleLocations?: boolean
  start: number[]
  end: number[]
  chance?: number
}

const createTemplates = (
  home: FlatRegion,
  work: FlatRegion[],
  shops: FlatRegion[],
  entertainment: FlatRegion[]
) => {
  // const dayTemplates: IRoutineDay[] = [
  //   {
  //     name: 'workday',
  //     days: [1, 2, 3, 4, 5, 6, 7],
  //     schedule: [
  //       { locations: [home], end: [7.5, 9] },
  //       { locations: work, end: [22, 23], locationDuration: [3, 4] },
  //     ],
  //   },
  // ]

  const dayTemplates: IRoutineDay[] = [
    {
      name: 'workday',
      days: [1, 2, 3, 4, 5],
      schedule: [
        { locations: [home], end: [7.5, 9] },
        { locations: work, end: [12, 13] },
        {
          locations: shops,
          end: [12.5, 14],
          locationDuration: [0.5, 0.75],
        },
        { locations: work, end: [16, 18] },
        { locations: entertainment, end: [19, 23], chance: 0.2 },
      ],
    },
    {
      name: 'saturday',
      days: [6],
      schedule: [
        { locations: [home], end: [9, 15] },
        {
          locations: [...shops, ...entertainment],
          end: [11, 16],
          multipleLocations: true,
          locationDuration: [1, 2],
        },
        { locations: [home], end: [16, 20] },
        {
          locations: [...shops, ...entertainment],
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
  work: FlatRegion[],
  shops: FlatRegion[],
  entertainment: FlatRegion[]
) => {
  const dayTemplates = createTemplates(home, work, shops, entertainment)

  const items: IRoutineItem[] = []

  let previous: IRoutineItem = {
    key: '',
    start: [0, 0],
    end: [0, 0],
    locations: [],
  }
  dayTemplates.forEach((dayTemplate) => {
    dayTemplate.days.forEach((day) => {
      const dayHours = (day - 1) * 24

      dayTemplate.schedule.forEach((schedule, index) => {
        const item: IRoutineItem = {
          key: `${dayTemplate.name}${day}:${dayHours} schedule:${index}`,
          locations: schedule.locations,
          locationDuration: schedule.locationDuration,
          start: previous.end,
          end: [schedule.end[0] + dayHours, schedule.end[1] + dayHours],
          chance: schedule.chance,
        }

        item.key += ` end:${item.end[0]}-${item.end[1]}`

        items.push(item)
        previous = item
      })
    })
  })

  return items
}
