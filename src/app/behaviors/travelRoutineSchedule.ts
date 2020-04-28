import { FlatRegion, pickRandom, generateNumber } from '../vectors'
import { Vector3 } from '@babylonjs/core'
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
  end: number[]
  duration?: number[]
  chance?: number
  allLocations?: boolean
}

interface IRoutineItem {
  locations: FlatRegion[]
  allLocations?: boolean

  start: number[]
  end: number[]
  duration?: number[]
  chance?: number,
  arrive?: number | undefined
  leave?: number | undefined
}

export class RoutineMoveSchedule {
  private weekSchedules: IRoutineItem[] = []

  private scheduleIndex: number
  private target: FlatRegion

  constructor(
    private home: FlatRegion,
    private work: FlatRegion,
    private foodShops: FlatRegion[],
    private entertainment: FlatRegion[]
  ) {
    this.initWeekSchedules()
  }

  private initWeekSchedules() {
    const { home, work, foodShops, entertainment } = this

    const dayTemplates: IRoutineDay[] = [
      {
        name: 'workday',
        days: [1, 2, 3, 4, 5],
        schedule: [
          { locations: [home], end: [7.5, 9] },
          { locations: [work], end: [12, 13] },
          { locations: foodShops, end: [12.5, 14], duration: [0.5, 0.75] },
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
            allLocations: true,
            duration: [1, 2],
          },
          { locations: [home], end: [16, 20] },
          {
            locations: [...foodShops, ...entertainment],
            end: [22, 27],
            allLocations: true,
            duration: [1, 2],
            chance: 0.5,
          },
        ],
      },
      {
        name: 'weekend2',
        days: [7],
        schedule: [
          { locations: [home], end: [8, 10] },
          {
            locations: entertainment,
            end: [17, 18],
            allLocations: true,
            duration: [0, 1],
          },
        ],
      },
    ]

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
          const item: IRoutineItem = {
            locations: schedule.locations,
            allLocations: schedule.allLocations,
            chance: schedule.chance,
            start: previous.end,
            end: this.normaliseRange(dayStartTime, schedule.end),
            duration: this.normaliseRange(0, schedule.duration),
          }

          items.push(item)
          previous = item
        })
      })
    })

    this.weekSchedules = items
  }

  private normaliseRange(dayStartTime: number, range: number[]) {
    if (!range) {
      return undefined
    }

    return [
      convertHoursToSceneStepId(range[0]) + dayStartTime,
      convertHoursToSceneStepId(range[1]) + dayStartTime,
    ]
  }

  private setTarget(
    weekStep: number,
    position: Vector3,
  ) {
    const current = this.weekSchedules[this.scheduleIndex]

    if(weekStep > current.leave) {
     this.next()
     return;
    }
    
    if(current.leave === undefined && this.target.containsPosition(position)) {
      this.arrived(weekStep)
      return;
    }
  }

  private next() {
    const previous = this.weekSchedules[this.scheduleIndex]
    previous.arrive = undefined
    previous.leave = undefined

    this.scheduleIndex++
    if(this.scheduleIndex > this.weekSchedules.length - 1) {
      this.scheduleIndex = 0
    }
    const next = this.weekSchedules[this.scheduleIndex]
    this.target = next.locations[generateNumber(0, next.locations.length - 1)]
  }

  private arrived(weekStep: number) {
    const item = this.weekSchedules[this.scheduleIndex]
    item.arrive = weekStep
    if(item.duration) {
      item.leave = weekStep + generateNumber(item.duration[0], item.duration[1])
    }
    else {
      item.leave = weekStep + generateNumber(item.end[0], item.end[1])
    }
  }
}
