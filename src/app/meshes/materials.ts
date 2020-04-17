import { Scene, StandardMaterial, Color3, Material } from '@babylonjs/core'

export interface ICommonMaterials {
  default: Material
  infected: Material
  collisionMarker: Material
}

let _materials: ICommonMaterials = null

export const initMaterials = (scene: Scene) => {
  const materials = {
    default: new StandardMaterial('crawlerMat1', scene),
    infected: new StandardMaterial('crawlerMat2', scene),
    collisionMarker: new StandardMaterial('crawlerMat3', scene),
  }

  materials.default.diffuseColor = new Color3(0.5, 0.5, 1)
  materials.infected.diffuseColor = new Color3(1, 0.4, 0.4)

  materials.collisionMarker.diffuseColor = new Color3(0.7, 0.3, 0.3)
  materials.collisionMarker.alpha = 0.8

  _materials = materials

  return _materials
}

export const getCommonMaterials = () => _materials
