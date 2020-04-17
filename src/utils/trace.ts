import {
  Scene,
  Material,
  StandardMaterial,
  Color3,
  Vector3,
  MeshBuilder,
  Mesh,
} from '@babylonjs/core'

let scene: Scene = null
let lineMaterial: Material = null
let pointMaterial: Material = null

export const initTrace = (appScene: Scene) => {
  scene = appScene

  const line = new StandardMaterial('traceLineMaterial', scene)
  line.diffuseColor = new Color3(1, 1, 1)

  const point = new StandardMaterial('traceLineMaterial', scene)
  point.diffuseColor = new Color3(1, 0, 1)

  lineMaterial = line
  pointMaterial = point
}

interface ITraceLine {
  owner: Mesh
  trace: Mesh
}

const traceList: ITraceLine[] = []

export const traceLine = (from: Vector3, to: Vector3, owner: Mesh = null) => {
  if (!scene) {
    return
  }
  const line = MeshBuilder.CreateLines(
    'trace',
    { points: [from, to], updatable: false },
    scene
  )

  line.material = lineMaterial

  if (owner) {
    traceList.push({
      owner,
      trace: line,
    })
  }
}

export const showOnlyTracesForOwner = (owner: Mesh) => {
  traceList.forEach((t) => {
    const show = t.owner === owner

    t.trace.setEnabled(show)
  })
}
