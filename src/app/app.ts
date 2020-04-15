import { AppScene } from './scene'
import { Box, Ball, Shape } from '../shapes'
import { Squish } from '../moves'

export const createApp = (canvas: HTMLCanvasElement) => {
  const scene = new AppScene(canvas)

  const shapes = [
    new Box(scene.scene),
    new Box(scene.scene),
    new Ball(scene.scene),
  ]

  scene.start()

  return {
    go: () => {
      loopAnimate(shapes, 1000)
    },
  }
}

const loopAnimate = (shapes: Shape[], delay: number) => {
  shapes.forEach((shape, index) => {
    const time = delay + delay * index

    setTimeout(() => {
      shape.addAnimation(new Squish().createAnimation())
      shape.move()
    }, time)
  })
}
