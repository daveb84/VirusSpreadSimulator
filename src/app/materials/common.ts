import { Scene, StandardMaterial, Color3, Material } from '@babylonjs/core'

export interface ICommonMaterials {
  default: Material
  incubating: Material
  ill: Material
  recovered: Material
  died: Material
  collisionMarker: Material
  homeBuilding: Material
  workBuilding: Material
  shopBuilding: Material
}

let _materials: ICommonMaterials = null

export const makeMaterial = (
  scene: Scene,
  name: string,
  color: Color3,
  alpha?: number
) => {
  const material = new StandardMaterial(name, scene)
  material.diffuseColor = color

  if (alpha !== undefined) {
    material.alpha = alpha
  }

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
    died: makeMaterial(scene, 'walkerDied', new Color3(0.2, 0.2, 0.2)),
    collisionMarker: makeMaterial(
      scene,
      'collision',
      new Color3(0.7, 0.3, 0.3)
    ),
    homeBuilding: makeMaterial(scene, 'home', new Color3(1, 0.7, 0.7), 0.5),
    workBuilding: makeMaterial(scene, 'work', new Color3(0.7, 0.7, 1), 0.5),
    shopBuilding: makeMaterial(scene, 'shop', new Color3(0.7, 1, 0.7), 0.5),
  }

  materials.collisionMarker.alpha = 0.8

  _materials = materials

  return _materials
}

export const getCommonMaterials = () => _materials

export const lazyMaterial = (scene: Scene, color: Color3, alpha?: number) => {
  let material: Material = null

  return () => {
    if (!material) {
      material = makeMaterial(scene, 'lazy', color, alpha)
    }

    return material
  }
}
