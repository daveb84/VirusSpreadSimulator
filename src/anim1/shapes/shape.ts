import { Scene, Node, Animation } from '@babylonjs/core'

export abstract class Shape {
  private _node: Node
  protected _scene: Scene

  constructor(scene: Scene) {
    this._scene = scene
    this._node = this.createShape()
  }

  get node() {
    return this._node
  }

  addAnimation(animation: Animation) {
    if (!this._node.animations) {
      this._node.animations = []
    }

    this._node.animations.push(animation)
  }

  move() {
    this._scene.beginAnimation(this._node, 0, 100, true)
  }

  abstract createShape(): Node
}
