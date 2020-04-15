import { Scene, MeshBuilder, Node } from '@babylonjs/core'
import { GridMaterial } from '@babylonjs/materials'
import { Shape } from './shape'
import { generatePosition } from '../utils/vectorGenerator'

export class Ball extends Shape {
  constructor(scene: Scene) {
    super(scene)
  }

  createShape(): Node {
    var material = new GridMaterial('grid', this._scene)

    var sphere = MeshBuilder.CreateSphere(
      'sphere1',
      { segments: 16, diameter: 2 },
      this._scene
    )
    sphere.position = generatePosition()
    sphere.material = material

    return sphere
  }
}
