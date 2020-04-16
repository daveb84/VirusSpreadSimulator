import { Scene, Mesh, Animation } from '@babylonjs/core'

export abstract class Shape {
  private _mesh: Mesh
  protected _scene: Scene

  constructor(scene: Scene) {
    this._scene = scene
    this._mesh = this.createShape()
  }

  get mesh() {
    return this._mesh
  }

  addAnimation(animation: Animation) {
    if (!this._mesh.animations) {
      this._mesh.animations = []
    }

    this._mesh.animations.push(animation)
  }

  move() {
    this._scene.beginAnimation(this._mesh, 0, 100, true)
  }

  abstract createShape(): Mesh
}
