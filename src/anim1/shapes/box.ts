import { Scene, MeshBuilder, Node } from '@babylonjs/core'
import { GridMaterial } from '@babylonjs/materials'
import { generatePosition, generateRotation } from '../../utils/vectorGenerator'

import { Shape } from './shape'

export class Box extends Shape {
  constructor(scene: Scene) {
    super(scene)
  }

  createShape(): Node {
    var material = new GridMaterial('grid', this._scene)

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
