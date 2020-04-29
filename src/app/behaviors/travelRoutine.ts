import { ITravelMove, ITravelMoveFactory } from './travel'
import { Vector3, Animation } from '@babylonjs/core'
import { FlatRegion } from '../vectors'
import { generateNumber, getWeekFromHours } from '../utils'
import { travelConfig } from '../settings'
import { IProcessStep } from '../appEvents'
import { IRoutineItem, createRoutineItems } from './travelRoutineItems'

interface INextTime {
  time: number
  isNextWeek: boolean
  week: number | null
}
const defaultNextTime = (): INextTime => ({
  time: null,
  isNextWeek: false,
  week: null,
})

export class RoutineMoveFactory implements ITravelMoveFactory {
  private routineItems: IRoutineItem[] = []

  private currentIndex = -1
  private arriveTime: number | null = null

  private leaveTime = defaultNextTime()
  private nextLocationTime = defaultNextTime()

  private manyTargets: boolean
  private target: FlatRegion
  private targetOptions: FlatRegion[]
  private targetOptionsVisited: FlatRegion[]

  constructor(
    private getProcessStep: () => IProcessStep,
    home: FlatRegion,
    work: FlatRegion[],
    shops: FlatRegion[],
    entertainment: FlatRegion[]
  ) {
    this.routineItems = createRoutineItems(home, work, shops, entertainment)
    this.init()
  }

  createNextMove(position: Vector3, target?: Vector3) {
    if (!target) {
      const step = this.getProcessStep()
      this.setTarget(step, position)

      target = this.target.getRandomPointFrom(
        position,
        this.target.containsPosition(position)
          ? travelConfig.distanceWithinTarget
          : travelConfig.distance
      )
    }

    const animation = this.createAnimation(position, target)

    const move: ITravelMove = {
      target,
      endFrame: travelConfig.endFrame,
      animations: [animation],
    }

    return move
  }

  private init() {
    this.setNextSchedule(this.getProcessStep(), 0)
  }

  private setTarget(step: IProcessStep, position: Vector3) {
    if (this.isNextTimeDue(this.leaveTime, step)) {
      this.setNextSchedule(step)
      return
    }

    if (this.arriveTime === null && this.target.containsPosition(position)) {
      this.setArrived(step)
      return
    }

    if (this.isNextTimeDue(this.nextLocationTime, step)) {
      this.setNextLocation(step)
      this.arriveTime = null
      return
    }

    // this.log('No action', step)
  }

  private setNextSchedule(step: IProcessStep, index: number = null) {
    if (index === null) {
      index =
        this.currentIndex < this.routineItems.length - 1
          ? this.currentIndex + 1
          : 0
      while (index !== this.currentIndex) {
        if (this.routineItems[index].end[1] > step.weekHours) {
          break
        }

        index++
        if (index > this.routineItems.length - 1) {
          index = 0
          break
        }
      }
    }

    this.currentIndex = index

    this.log('setNextSchedule', step)

    const next = this.routineItems[this.currentIndex]
    if (next.chance !== undefined && Math.random() > next.chance) {
      this.setNextSchedule(step)
      return
    }

    this.arriveTime = null
    this.nextLocationTime = defaultNextTime()
    this.leaveTime = this.getNextTime(next.end, step)

    this.manyTargets =
      next.locations.length > 1 && next.locationDuration !== undefined
    this.target = null
    this.targetOptions = [...next.locations]
    this.targetOptionsVisited = []
    this.setNextLocation(step)
  }

  private setNextLocation(step: IProcessStep) {
    this.log('setNextLocation', step)
    if (!this.manyTargets) {
      this.target = this.targetOptions[0]
      return
    }

    if (this.targetOptions.length === 0) {
      this.targetOptions = [...this.targetOptionsVisited]
    }

    const targetIndex = generateNumber(0, this.targetOptions.length - 1, true)
    this.target = this.targetOptions.splice(targetIndex, 1)[0]
    this.targetOptionsVisited.push(this.target)
  }

  private setArrived(step: IProcessStep) {
    this.log('setArrived', step)
    this.arriveTime = step.weekHours
    this.setNextLocationTime(step)
  }

  private getNextTime(
    range: number[],
    step: IProcessStep,
    addWeekHour = false
  ): INextTime {
    let time: number = null
    let isNextWeek: boolean = false
    let week: number = null

    if (range) {
      if (addWeekHour) {
        time = generateNumber(range[0], range[1]) + step.weekHours
      } else {
        const startTime = range[0] < step.weekHours ? step.weekHours : range[0]
        time = generateNumber(startTime, range[1])
      }

      if (time > travelConfig.hoursInWeek) {
        isNextWeek = true
        time = time % travelConfig.hoursInWeek
        week = getWeekFromHours(step.hours) + 1
      }
    }
    return { time, isNextWeek, week }
  }

  private setNextLocationTime(step: IProcessStep) {
    const item = this.routineItems[this.currentIndex]
    this.nextLocationTime = this.getNextTime(item.locationDuration, step, true)
  }

  private isNextTimeDue(time: INextTime, step: IProcessStep) {
    if (time.time === null) {
      return false
    }

    if (time.week === null && step.weekHours > time.time) {
      return true
    }

    if (
      time.week !== null &&
      time.week <= getWeekFromHours(step.hours) &&
      step.weekHours > time.time
    ) {
      return true
    }
  }

  private createAnimation(from: Vector3, to: Vector3) {
    const animation = new Animation(
      'move',
      'position',
      travelConfig.frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    )

    const keys = [
      {
        frame: 0,
        value: from,
      },
      {
        frame: travelConfig.endFrame,
        value: to,
      },
    ]

    animation.setKeys(keys)

    return animation
  }

  private log(message: string, step: IProcessStep) {
    //console.log(`${message} hours:${step.hours} weekHours: ${step.weekHours} item: ${this.routineItems[this.currentIndex].key}`)
  }
}
