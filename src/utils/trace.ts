import {
  Scene,
  Material,
  StandardMaterial,
  Color3,
  Vector3,
  MeshBuilder,
  Mesh,
} from '@babylonjs/core'
import { traceEnabled } from '../app/settings'

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

const createLine = (from: Vector3, to: Vector3) => {
  const line = MeshBuilder.CreateLines(
    'trace',
    { points: [from, to], updatable: false },
    scene
  )

  line.material = lineMaterial

  return line
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

  const trace = createLine(from, to)

  if (owner) {
    traceList.push({
      owner,
      trace,
    })
  }
}

interface ITraceMove extends ITraceLine {
  from: Vector3
  to: Vector3
  direction: Vector3
}

export const traceMoves: ITraceMove[] = []

export const traceMove = (
  from: Vector3,
  to: Vector3,
  direction: Vector3,
  owner: Mesh
) => {
  if (!traceEnabled) {
    return
  }

  const trace = createLine(from, to)

  traceMoves.push({
    from,
    to,
    direction,
    owner,
    trace,
  })
}

export const showOnlyTracesForOwner = (owner: Mesh) => {
  traceList.forEach((t) => {
    const show = t.owner === owner

    t.trace.setEnabled(show)
  })
}

export const showOnlyTraceMovesForOwner = (owner: Mesh) => {
  traceMoves.forEach((t) => {
    const show = t.owner === owner

    t.trace.setEnabled(show)
  })
}
