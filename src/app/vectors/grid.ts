import { FlatRegion, IFlatRegion } from './region'
import { Scene, Color3, Vector3 } from '@babylonjs/core'

export class Grid {
  private _rows: number
  private _columns: number
  private _rowWidth: number
  private _columnWidth: number

  private _cells: GridCell[] = []
  private _cellLookup: GridCell[][] = []
  private gridCellResolver: (position: Vector3) => GridCell

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
    let row = 0

    while (row < this._rows) {
      const minZ = this.parent.minZ + this._rowWidth * row
      const maxZ = minZ + this._rowWidth

      const rowLookup: GridCell[] = []
      this._cellLookup.push(rowLookup)

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

    const minCell = this._cellLookup[0][0]

    this.gridCellResolver = (position: Vector3) => {
      const x = position.x - minCell.minX
      const z = position.z - minCell.minZ

      const column = Math.floor(x / this._columnWidth)
      const row = Math.floor(z / this._rowWidth)

      if (
        row >= 0 &&
        row < this._rows &&
        column >= 0 &&
        column < this._columns
      ) {
        return this._cellLookup[row][column]
      }
      return null
    }
  }

  public drawAll(scene: Scene, color?: Color3) {
    this._cells.forEach((x) => {
      x.draw(scene, color)
    })
  }

  public drawCell(row: number, column: number, scene: Scene, color?: Color3) {
    this._cellLookup[row][column].draw(scene, color)
  }

  public getDivisions(rowsWide: number, columnsWide: number) {
    let row = 0
    let rowDiv = 0

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

            const indexes = this.getCells(
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

  public getGridCell(position: Vector3) {
    return this.gridCellResolver(position)
  }

  private getCells(rowStart, rowEnd, columnStart, columnEnd) {
    const cells: GridCell[] = []
    let row = rowStart

    while (row <= rowEnd) {
      let column = columnStart

      while (column <= columnEnd) {
        const cell = this._cellLookup[row][column]
        cells.push(cell)

        column++
      }

      row++
    }

    return cells
  }
}

export class GridCell extends FlatRegion {
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
  constructor(region: IFlatRegion, public readonly cells: GridCell[]) {
    super(region)
  }
}
