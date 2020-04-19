import { FlatRegion, IFlatRegion } from './region'
import { Scene, Material, StandardMaterial, Color3 } from '@babylonjs/core'

let defaultMaterial: Material

export class Grid {
  private _rows: number
  private _columns: number
  private _rowWidth: number
  private _columnWidth: number

  private _cells: GridCell[] = []
  private _cellLookup: GridCell[][] = []

  public get cells() {
    return this._cells
  }
  public get cellLookup() {
    return this._cellLookup
  }

  constructor(private parent: FlatRegion, rows: number, columns: number) {
    this._rows = rows
    this._columns = columns

    this.initGrid()
  }

  private initGrid() {
    this._columnWidth = this.parent.width / this._columns
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
        const minX = this.parent.minX + this._columnWidth * column
        const maxX = minX + this._columnWidth

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

  public getDivisions(rowsWide: number, columnsWide: number) {
    let row = 0
    let rowDiv = 0

    let rowRemainder = this._rows % rowsWide
    let columnRemainder = this._columns % columnsWide

    const divisions: GridDivision[] = []

    while (row < this._rows) {
      const rowStart = row
      const rowEnd = rowStart + rowsWide - 1

      if (rowEnd < this._rows) {
        let column = 0
        let columnDiv = 0

        while (column < this._columns) {
          const columnStart = column
          const columnEnd = columnStart + columnsWide - 1

          if (columnEnd < this._columns) {
            const startCell = this._cellLookup[rowStart][columnStart]
            const endCell = this._cellLookup[rowEnd][columnEnd]

            const region = {
              y: this.parent.y,
              minX: startCell.minX,
              minZ: startCell.minZ,
              maxX: endCell.maxX,
              maxZ: endCell.maxZ,
            }

            const indexes = this.getCellIndexes(
              rowStart,
              rowEnd,
              columnStart,
              columnEnd
            )

            const division = new GridDivision(region, indexes)
            divisions.push(division)
          }

          columnDiv++
          column += columnsWide
        }
      }

      rowDiv++
      row += rowsWide
    }

    return divisions
  }

  private getCellIndexes(rowStart, rowEnd, columnStart, columnEnd) {
    const indexes: number[] = []
    let row = rowStart

    while (row < rowEnd) {
      let column = columnStart

      while (column < columnEnd) {
        const cell = this._cellLookup[row][column]
        indexes.push(cell.index)

        column++
      }

      row++
    }

    return indexes
  }
}

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

export class GridDivision extends FlatRegion {
  constructor(region: IFlatRegion, public cellIndexes: number[]) {
    super(region)
  }
}
