import { Scene, StandardMaterial, Color3, Material } from '@babylonjs/core'

export interface ICommonMaterials {
  default: Material
  incubating: Material
  ill: Material
  recovered: Material
  collisionMarker: Material
  homeBuilding: Material
  workBuilding: Material
  shopBuilding: Material
}

let _materials: ICommonMaterials = null

const makeMaterial = (scene: Scene, name: string, color: Color3) => {
  const material = new StandardMaterial(name, scene)
  material.diffuseColor = color
  return material
}

export const initMaterials = (scene: Scene) => {
  const materials = {
    default: makeMaterial(scene, 'walkerDefault', new Color3(0.9, 0.9, 0.7)),
    incubating: makeMaterial(
      scene,
      'walkerIncubating',
      new Color3(0.1, 0.5, 0.1)
    ),
    ill: makeMaterial(scene, 'walkerIll', new Color3(0, 1, 0)),
    recovered: makeMaterial(scene, 'walkerIll', new Color3(0.6, 0.6, 1)),
    collisionMarker: makeMaterial(
      scene,
      'collision',
      new Color3(0.7, 0.3, 0.3)
    ),
    homeBuilding: makeMaterial(scene, 'home', new Color3(1, 0.7, 0.7)),
    workBuilding: makeMaterial(scene, 'work', new Color3(0.7, 0.7, 1)),
    shopBuilding: makeMaterial(scene, 'shop', new Color3(0.7, 1, 0.7)),
  }

  materials.collisionMarker.alpha = 0.8

  _materials = materials

  return _materials
}

export const getCommonMaterials = () => _materials
