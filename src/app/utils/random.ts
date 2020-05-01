import { Vector3, Color3 } from '@babylonjs/core'

export const generateRotation = () => {
  const max = 2 * Math.PI
  return generateVector(Vector3.Zero(), new Vector3(max, max, max))
}

export const generateVector = (min: Vector3, max: Vector3) =>
  new Vector3(
    generateNumber(min.x, max.x),
    generateNumber(min.y, max.y),
    generateNumber(min.z, max.z)
  )

export const generateNumber = (
  min: number,
  max: number,
  wholeNumber: boolean = false
) => {
  const number = Math.random() * Math.abs(max - min) + min
  return wholeNumber ? Math.round(number) : number
}

const colors = [
  new Color3(1, 0, 0),
  new Color3(0, 1, 0),
  new Color3(0, 0, 1),
  new Color3(1, 1, 0),
  new Color3(0, 1, 1),
  new Color3(1, 0, 1),
]

export const generateColor = () =>
  colors[generateNumber(0, colors.length - 1, true)]

export const pickRandom = <T>(items: T[], min: number, max: number) => {
  const amount = generateNumber(min, max, true)

  const pickFrom = [...items]
  const picked: T[] = []

  for (let i = 0; i < amount; i++) {
    if (i > pickFrom.length - 1) {
      break
    }

    const index = generateNumber(0, pickFrom.length - 1, true)
    const selected = pickFrom.splice(index, 1)[0]

    picked.push(selected)
  }

  return picked
}
