import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  Node,
  Animation,
} from '@babylonjs/core'

export abstract class Move {
  private _animation: Animation

  constructor() {
    this._animation = this.createAnimation()
  }

  get animation() {
    return this._animation
  }

  abstract createAnimation(): Animation
}
