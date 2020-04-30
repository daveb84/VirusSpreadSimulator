import { ITravelMove, ITravelMoveFactory } from './travel'
import { Vector3, Animation } from '@babylonjs/core'
import { FlatRegion } from '../vectors'
import { generateNumber, getWeekFromHours } from '../utils'
import { travelConfig } from '../settings'
import { IProcessStep } from '../appEvents'
import { IRoutineItem } from './travelRoutineItems'

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

interface IRoutineIndex {
  index: number
  isNextWeek: boolean
}

interface INextRoutineItem {
  next: IRoutineItem
  nextIndex: number
  leaveTime: INextTime
  skippedChance?: boolean
  skippedLeaveTime?: boolean
}

export class RoutineMoveFactory implements ITravelMoveFactory {
  private currentIndex = -1

  private leaveTime = defaultNextTime()
  private nextLocationTime = defaultNextTime()

  private itemStartTime: number | null = null
  private locationArriveTime: number | null = null

  private manyTargets: boolean
  private target: FlatRegion
  private targetOptions: FlatRegion[]
  private targetOptionsVisited: FlatRegion[]

  constructor(
    private getProcessStep: () => IProcessStep,
    private routineItems: IRoutineItem[]
  ) {
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
    this.setNextSchedule(this.getProcessStep())
  }

  private setTarget(step: IProcessStep, position: Vector3) {
    if (this.isNextTimeDue(this.leaveTime, step)) {
      this.setNextSchedule(step)
      return
    }

    if (
      this.locationArriveTime === null &&
      this.target.containsPosition(position)
    ) {
      this.setArrived(step)
      return
    }

    if (this.isNextTimeDue(this.nextLocationTime, step)) {
      this.setNextLocation(step)
      this.locationArriveTime = null
      return
    }

    // this.log('No action', step)
  }

  private setNextSchedule(step: IProcessStep) {
    const { next, leaveTime, nextIndex } = this.getNextValidItem(
      this.currentIndex,
      step
    )

    this.itemStartTime = step.weekHours
    this.currentIndex = nextIndex
    this.leaveTime = leaveTime

    this.log('setNextSchedule', step)

    this.locationArriveTime = null
    this.nextLocationTime = defaultNextTime()

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
    this.locationArriveTime = step.weekHours

    const item = this.routineItems[this.currentIndex]
    this.nextLocationTime = this.getNextTime(item.locationDuration, step, true)
  }

  private getNextIndex(currentIndex?: number): IRoutineIndex {
    currentIndex = currentIndex === undefined ? this.currentIndex : currentIndex
    let isNextWeek = false

    currentIndex++
    if (currentIndex > this.routineItems.length - 1) {
      currentIndex = 0
      isNextWeek = true
    }

    return { index: currentIndex, isNextWeek }
  }

  private getNextValidItem(
    currentIndex: number,
    step: IProcessStep,
    trace: INextRoutineItem[] = []
  ) {
    let nextItem: INextRoutineItem

    let current: IRoutineItem
    let nextIndex: IRoutineIndex

    if (currentIndex < 0) {
      current = null
      nextIndex = {
        index: 0,
        isNextWeek: false,
      }
    } else {
      current = this.routineItems[currentIndex]
      nextIndex = this.getNextIndex(currentIndex)
    }

    while (true) {
      nextItem = this.getNextItem(nextIndex, step)

      if (!nextItem.skippedLeaveTime && !nextItem.skippedChance) {
        if (current && nextItem.next.name === current.name) {
          const debugInfo = {
            step,
            current,
            currentLeaveTime: this.leaveTime,
            currentStartTime: this.itemStartTime,
            skipped: trace,
            ...nextItem,
          }

          if (nextItem.next.day === current.day) {
            console.warn(
              'SAME-DAY-WARNING: The next travel schedule item is the same by item and day',
              debugInfo
            )
          } else {
            console.warn(
              'SAME-ITEM-WARNING: The next travel schedule item is the same by item',
              debugInfo
            )
          }
        }

        break
      }

      trace.push(nextItem)
      nextIndex = this.getNextIndex(nextIndex.index)
    }

    return nextItem
  }

  private getNextItem(
    index: IRoutineIndex,
    step: IProcessStep
  ): INextRoutineItem {
    const next = this.routineItems[index.index]
    const leaveTime = this.getNextTime(
      next.end,
      step,
      next.endRelative,
      index.isNextWeek
    )

    let skippedLeaveTime = false
    let skippedChance = false

    if (leaveTime.time === null) {
      skippedLeaveTime = true
    } else if (next.chance !== undefined && Math.random() > next.chance) {
      skippedChance = true
    }
    return {
      next,
      nextIndex: index.index,
      leaveTime,
      skippedLeaveTime,
      skippedChance,
    }
  }

  private getNextTime(
    range: number[],
    step: IProcessStep,
    relative = false,
    isNextWeek = false
  ): INextTime {
    const result = defaultNextTime()

    if (range) {
      if (relative) {
        result.time = generateNumber(range[0], range[1]) + step.weekHours

        if (result.time > travelConfig.hoursInWeek) {
          result.time = result.time % travelConfig.hoursInWeek
          result.isNextWeek = true
        }
      } else if (isNextWeek) {
        result.time = generateNumber(range[0], range[1])
        result.isNextWeek = true
      } else if (range[1] > step.weekHours) {
        const startTime = range[0] < step.weekHours ? step.weekHours : range[0]
        result.time = generateNumber(startTime, range[1])
      }

      if (result.isNextWeek) {
        result.week = getWeekFromHours(step.hours) + 1
      }
    }

    return result
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

  private loggingEnabled = false
  private log(message: string, step: IProcessStep) {
    if (this.loggingEnabled) {
      console.log(
        `${message} hours:${step.hours} weekHours: ${step.weekHours} item: ${
          this.routineItems[this.currentIndex].debugInfo
        }`
      )
    }
  }
}
