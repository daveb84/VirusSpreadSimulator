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

const traceOwnerEnabled: any = {}

interface ITraceMove {
  from: Vector3
  to: Vector3
  owner: Mesh
  trace: Mesh
}

export const traceMoves: ITraceMove[] = []

export const traceMove = (from: Vector3, to: Vector3, owner: Mesh) => {
  const line = createLine(from, to)
  line.setEnabled(!!traceOwnerEnabled[owner.uniqueId])

  traceMoves.push({
    from,
    to,
    owner,
    trace: line,
  })
}

export const toggleTraces = (owner: Mesh) => {
  const show = !traceOwnerEnabled[owner.uniqueId]

  traceOwnerEnabled[owner.uniqueId] = show

  traceMoves
    .filter((x) => x.owner === owner)
    .forEach((x) => x.trace.setEnabled(show))
}

export const tracePoint = (position: Vector3, owner: Mesh) => {
  const scene = owner.getScene()

  const point = new Mesh('point', scene)
  point.position = position
  point.material = pointMaterial
}
