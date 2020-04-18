import { generateNumber } from './random'
import { Vector3 } from '@babylonjs/core'
import { minBound, boundsMidpoint, maxBound } from '../settings'

interface IRegion {
  minX: number
  minZ: number
  maxX: number
  maxZ: number
}

export const centerRegion: IRegion = {
  minX: (minBound.x + boundsMidpoint.x) / 2,
  minZ: (minBound.z + boundsMidpoint.z) / 2,
  maxX: (maxBound.x + boundsMidpoint.x) / 2,
  maxZ: (maxBound.z + boundsMidpoint.z) / 2,
}

export const moveTowardPointInRegion = (
  region: IRegion,
  currentPosition: Vector3,
  currentDirection: Vector3
) => {
  const xCoord = generateNumber(region.minX, region.maxX)
  const zCoord = generateNumber(region.minZ, region.maxZ)

  const target = new Vector3(xCoord, currentPosition.y, zCoord)
  const direction = target.subtract(currentPosition)

  const distance = currentDirection.length()
  const scale = distance / direction.length()
  const scaled = direction.scale(scale)

  return scaled
}
