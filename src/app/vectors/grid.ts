import { FlatRegion, IFlatRegion } from './region'
import { Scene, Material, StandardMaterial, Color3 } from '@babylonjs/core'

let defaultMaterial: Material

class GridCell extends FlatRegion {
  private _index: number
  private _rowIndex: number
  private _columnIndex: number

  public get index() {
    return this._index
  }
  public get rowIndex() {
    return this._rowIndex
  }
  public get columnIndex() {
    return this._columnIndex
  }

  constructor(
    region: IFlatRegion,
    index: number,
    rowIndex: number,
    columnIndex: number
  ) {
    super(region)
    this._index = index
    this._rowIndex = rowIndex
    this._columnIndex = columnIndex
  }
}

export class Grid {
  private _rows: number
  private _columns: number
  private _rowWidth: number
  private _columnWith: number

  private _cells: GridCell[] = []
  private _cellLookup: GridCell[][] = []

  constructor(private parent: FlatRegion, rows: number, columns: number) {
    this._rows = rows
    this._columns = columns

    this.initGrid()
  }

  private initGrid() {
    this._columnWith = this.parent.width / this._columns
    this._rowWidth = this.parent.depth / this._rows

    let index = 0
    let z = this.parent.minZ
    let row = 0

    while (row < this._rows) {
      const minZ = this.parent.minZ + this._rowWidth * row
      const maxZ = minZ + this._rowWidth

      const rowLookup: GridCell[] = []
      this._cellLookup.push(rowLookup)

      let x = this.parent.minX
      let column = 0

      while (column < this._columns) {
        const minX = this.parent.minX + this._columnWith * column
        const maxX = minX + this._columnWith

        const region = {
          y: this.parent.y,
          minX,
          maxX,
          minZ,
          maxZ,
        }

        const cell = new GridCell(region, index, row, column)
        this._cells.push(cell)
        rowLookup.push(cell)
        column++
        index++
      }

      row++
    }
  }

  public drawAll(scene: Scene, material?: Material) {
    if (!material) {
      if (!defaultMaterial) {
        const mat = new StandardMaterial('regionMat', scene)
        mat.diffuseColor = new Color3(0.5, 0.5, 1)

        defaultMaterial = mat
      }

      material = defaultMaterial
    }

    this._cells.forEach((x) => {
      x.draw(scene, material)
    })
  }

  public drawCell(
    row: number,
    column: number,
    scene: Scene,
    material?: Material
  ) {
    if (!material) {
      if (!defaultMaterial) {
        const mat = new StandardMaterial('regionMat', scene)
        mat.diffuseColor = new Color3(0.5, 0.5, 1)

        defaultMaterial = mat
      }

      material = defaultMaterial
    }

    this._cellLookup[row][column].draw(scene, material)
  }
}
