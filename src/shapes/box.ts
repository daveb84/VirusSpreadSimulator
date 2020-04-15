import { Scene, MeshBuilder, Node, StandardMaterial } from '@babylonjs/core'
import {
  generatePosition,
  generateRotation,
  generateColor,
} from '../utils/random'

import { Shape } from './shape'

export class Box extends Shape {
  constructor(scene: Scene) {
    super(scene)
  }

  createShape(): Node {
    var material = new StandardMaterial('material', this._scene)
    material.diffuseColor = generateColor()

    var box = MeshBuilder.CreateBox(
      'box',
      { width: 2, height: 3, depth: 1 },
      this._scene
    )
    box.material = material
    box.position = generatePosition()
    box.rotation = generateRotation()

    return box
  }
}
