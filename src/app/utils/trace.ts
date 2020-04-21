import {
  Scene,
  Material,
  StandardMaterial,
  Color3,
  Vector3,
  MeshBuilder,
  Mesh,
} from '@babylonjs/core'
import { traceEnabled } from '../settings'

const lineColor: Color3 = new Color3(1, 0, 1)

let scene: Scene = null
let pointMaterial: Material = null

export const initTrace = (appScene: Scene) => {
  scene = appScene

  const point = new StandardMaterial('tracePointMaterial', scene)
  point.diffuseColor = new Color3(1, 0, 1)
  pointMaterial = point
}

const createLine = (from: Vector3, to: Vector3) => {
  const line = MeshBuilder.CreateLines(
    'trace',
    { points: [from, to], updatable: false },
    scene
  )

  line.color = lineColor

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
}

export const traceMoves: ITraceMove[] = []

export const traceMove = (from: Vector3, to: Vector3, owner: Mesh) => {
  if (!traceEnabled) {
    return
  }

  const trace = createLine(from, to)

  traceMoves.push({
    from,
    to,
    owner,
    trace,
  })
}

export const tracePoint = (position: Vector3, owner: Mesh) => {
  const scene = owner.getScene()

  const point = new Mesh('point', scene)
  point.position = position
  point.material = pointMaterial
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
