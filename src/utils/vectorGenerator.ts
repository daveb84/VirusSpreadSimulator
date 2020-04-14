import { Vector3 } from '@babylonjs/core'

export const generatePosition = () =>
  new Vector3(
    generateNumber(-3, 3),
    generateNumber(-3, 3),
    generateNumber(-3, 3)
  )

export const generateRotation = () =>
  new Vector3(
    generateNumber(0, 2 * Math.PI),
    generateNumber(0, 2 * Math.PI),
    generateNumber(0, 2 * Math.PI)
  )

export const generateNumber = (from: number, to: number) =>
  Math.random() * Math.abs(from - to) + from
