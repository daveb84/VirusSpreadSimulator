import { ITravelMove, ITravelMoveFactory } from './travel'
import { Vector3, Animation } from '@babylonjs/core'
import { FlatRegion } from '../vectors'
import { generateNumber } from '../utils'
import { travelConfig } from '../settings'
import { IProcessStep } from '../appEvents'
import { IRoutineItem, createRoutineItems } from './travelRoutineItems'

export class RoutineMoveFactory implements ITravelMoveFactory {
  private routineItems: IRoutineItem[] = []

  private currentIndex = -1
  private arriveTime: number | null = null
  private leaveTime: number | null = null
  private nextLocationTime: number | null = null

  private target: FlatRegion
  private targetOptions: FlatRegion[]

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
      const weekHour = this.getProcessStep().weekHours
      this.setTarget(weekHour, position)

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
    this.currentIndex = 0
    this.targetOptions = [...this.routineItems[0].locations]
    this.nextLocation()

    if (!this.target) {
      this.target = this.targetOptions[0]
    }
  }

  private setTarget(weekHour: number, position: Vector3) {
    if (weekHour > this.leaveTime) {
      this.nextSchedule()
    } else if (
      this.arriveTime === null &&
      this.target.containsPosition(position)
    ) {
      this.setArrived(weekHour)
    } else if (weekHour > this.nextLocationTime) {
      this.nextLocation()
    }
  }

  private nextSchedule() {
    this.currentIndex++
    if (this.currentIndex > this.routineItems.length - 1) {
      this.currentIndex = 0
    }
    const next = this.routineItems[this.currentIndex]
    this.arriveTime = null
    this.leaveTime = null
    this.nextLocationTime = null

    this.targetOptions = [...next.locations]
    this.nextLocation()
  }

  private nextLocation() {
    if (this.targetOptions.length > 1) {
      const targetIndex = generateNumber(0, this.targetOptions.length - 1, true)
      this.target = this.targetOptions.splice(targetIndex, 1)[0]
    }
  }

  private setArrived(weekHour: number) {
    const item = this.routineItems[this.currentIndex]
    this.arriveTime = weekHour

    if (item.end) {
      this.leaveTime = weekHour + generateNumber(item.end[0], item.end[1])
    }

    if (item.locationDuration) {
      this.nextLocationTime =
        weekHour +
        generateNumber(item.locationDuration[0], item.locationDuration[1])
    }

    if (this.nextLocationTime && this.leaveTime === null) {
      this.leaveTime = this.nextLocationTime
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
}
