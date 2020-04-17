import { generateNumber } from '../../utils/random'
import { Vector3 } from '@babylonjs/core'
import { minBound, boundsMidpoint, maxBound } from '../settings'

const deflectToCenterBounds = {
  minX: (minBound.x + boundsMidpoint.x) / 2,
  minZ: (minBound.z + boundsMidpoint.z) / 2,
  maxX: (maxBound.x + boundsMidpoint.x) / 2,
  maxZ: (maxBound.z + boundsMidpoint.z) / 2,
}

export const deflectToCenter = (
  currentPosition: Vector3,
  currentDirection: Vector3
) => {
  const xCoord = generateNumber(
    deflectToCenterBounds.minX,
    deflectToCenterBounds.maxX
  )
  const zCoord = generateNumber(
    deflectToCenterBounds.minZ,
    deflectToCenterBounds.maxZ
  )

  const target = new Vector3(xCoord, currentPosition.y, zCoord)
  const direction = target.subtract(currentPosition)

  const distance = currentDirection.length()
  const scale = distance / direction.length()
  const scaled = direction.scale(scale)

  return scaled
}
