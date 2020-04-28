import { FlatRegion, pickRandom } from '../vectors'

interface IRoutineDay {
  name: string
  days: number[]
  schedule: IRoutineItem[]
}

interface IRoutineItem {
  locations: FlatRegion[]
  leave?: number[]
  duration?: number[]
  chance?: number
  allLocations?: boolean
}

export class RoutineMoveSchedule {
  private daySchedules: IRoutineDay[] = []

  constructor(
    private home: FlatRegion,
    private work: FlatRegion,
    private foodShops: FlatRegion[],
    private entertainment: FlatRegion[]
  ) {}

  createDaySchedules() {
    const { home, work, foodShops, entertainment } = this

    this.daySchedules = [
      {
        name: 'workday',
        days: [1, 2, 3, 4, 5],
        schedule: [
          { locations: [home], leave: [7.5, 9] },
          { locations: [work], leave: [12, 13] },
          { locations: foodShops, duration: [0.5, 0.75] },
          { locations: [work], leave: [16, 18] },
          { locations: entertainment, leave: [19, 23], chance: 0.2 },
        ],
      },
      {
        name: 'weekend1',
        days: [6, 7],
        schedule: [
          { locations: [home], leave: [9, 15] },
          { locations: [...foodShops, ...entertainment], duration: [1, 2] },
          { locations: [home], leave: [16, 20] },
          {
            locations: [...foodShops, ...entertainment],
            allLocations: true,
            duration: [1, 2],
            leave: [22, 3],
            chance: 0.5,
          },
        ],
      },
      {
        name: 'weekend2',
        days: [6, 7],
        schedule: [
          { locations: [home], leave: [8, 10] },
          {
            locations: entertainment,
            allLocations: true,
            duration: [0, 1],
            leave: [17, 18],
          },
        ],
      },
    ]
  }

  getSchedule(day: number, time: number) {
    const days = this.daySchedules.filter(x => x.days.some(d => d === day))

    const daySchedule = pickRandom(days, 1, 1);
  }
}
