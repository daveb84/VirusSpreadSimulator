import { FlatRegion, IFlatRegion } from './region'
import { Scene, Color3, Vector3 } from '@babylonjs/core'

export interface IGridRegion {
  startRow: number
  endRow: number
  startColumn: number
  endColumn: number
}

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
  public get rows() {
    return this._rows
  }
  public get columns() {
    return this._columns
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

  public getRegions(
    rowsWide: number,
    columnsWide: number,
    withinRegion?: IGridRegion
  ) {
    if (!withinRegion) {
      withinRegion = {
        startRow: 0,
        endRow: this._rows - 1,
        startColumn: 0,
        endColumn: this._columns - 1,
      }
    }
    let row = withinRegion.startRow

    const regions: GridRegion[] = []

    while (row <= withinRegion.endRow) {
      const rowStart = row
      const rowEnd = rowStart + rowsWide - 1

      if (rowEnd <= withinRegion.endRow) {
        let column = withinRegion.startColumn

        while (column <= withinRegion.endColumn) {
          const columnStart = column
          const columnEnd = columnStart + columnsWide - 1

          if (columnEnd <= withinRegion.endColumn) {
            const region = this.createGridRegion(
              rowStart,
              rowEnd,
              columnStart,
              columnEnd
            )

            regions.push(region)
          }

          column += columnsWide
        }
      }

      row += rowsWide
    }

    return regions
  }

  public getRegionByRadius(
    center: GridCell,
    rowRadius: number,
    columnRadius: number
  ) {
    const row = {
      from: center.rowIndex - rowRadius,
      to: center.rowIndex + rowRadius,
    }
    this.adjustGridRegion(row, this._rows - 1)

    const col = {
      from: center.columnIndex - columnRadius,
      to: center.columnIndex + columnRadius,
    }
    this.adjustGridRegion(col, this._columns - 1)

    const gridRegion = this.createGridRegion(row.from, row.to, col.from, col.to)

    return gridRegion
  }

  private adjustGridRegion(indexes: { from: number; to: number }, max: number) {
    if (indexes.from >= 0 && indexes.to <= max) {
      return
    }

    if (indexes.from < 0) {
      indexes.to += Math.abs(indexes.from)
      indexes.from = 0
    }

    if (indexes.to >= max) {
      indexes.from -= max - indexes.to
      indexes.to = max
    }

    if (indexes.from < 0) {
      indexes.from = 0
    }
  }

  public getGridCell(position: Vector3) {
    return this.gridCellResolver(position)
  }

  private createGridRegion(
    rowStart: number,
    rowEnd: number,
    columnStart: number,
    columnEnd: number
  ) {
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

    const start = cells[0]
    const end = cells[cells.length - 1]

    const region = {
      y: this.parent.y,
      minX: start.minX,
      minZ: start.minZ,
      maxX: end.maxX,
      maxZ: end.maxZ,
    }

    const gridRegion = new GridRegion(region, cells)

    return gridRegion
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

export class GridRegion extends FlatRegion implements IGridRegion {
  constructor(region: IFlatRegion, public readonly cells: GridCell[]) {
    super(region)

    const last = cells[cells.length - 1]

    this.startRow = cells[0].rowIndex
    this.endRow = last.rowIndex

    this.startColumn = cells[0].columnIndex
    this.endColumn = last.columnIndex
  }

  startRow: number
  endRow: number
  startColumn: number
  endColumn: number
}
