import { Scene, MeshBuilder, Mesh, StandardMaterial } from '@babylonjs/core'
import { Shape } from './shape'
import { generatePosition, generateColor } from '../utils/random'

export class Ball extends Shape {
  constructor(scene: Scene) {
    super(scene)
  }

  createShape(): Mesh {
    var material = new StandardMaterial('material', this._scene)
    material.diffuseColor = generateColor()

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
