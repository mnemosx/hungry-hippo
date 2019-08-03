export type Position = [number, number]

// dirty way. needs to get this from app.tsx
const width = 27
const height = 15

export enum TD {
  Up,
  Right,
  Down,
  Left,
  Stop
}
export class Snake {
  constructor(
    private x: number,
    private y: number,
    private tail: TD[] = [TD.Right, TD.Right, TD.Down]) {
  }
  /**
   * Given game state and coordinate of a particulal cell
   * returns whether snake exists on the coordinates of the given cell
   * @param x td index of cell
   * @param y row index of cell
   * @param snake Array of he positions where snake exists
   */

  public isInPosition(x: number, y: number) {
    // Compare head
    if (this.isHeadInPosition([x, y])) {
      return true
    }
    // Compare tail
    return this.isTailInPosition(x, y)
  }

  public isGameOver() {
    return this.isTailInPosition(this.x, this.y)
  }

  public move(dir: TD, apple: Position): Snake {
    const [newX, newY] = Snake.relativeDirection(dir, this.x, this.y)
    const newTail = (newX === apple[0] && newY === apple[1]) ?
      // if apple reached, dont slice tail
      [Snake.oppositeDirection(dir), ...this.tail] :
      [Snake.oppositeDirection(dir), ...this.tail.slice(0, this.tail.length - 1)]
    return new Snake(newX, newY, newTail)
  }

  public hasReachedApple(apple: Position) {
    return this.x === apple[0] && this.y === apple[1]
  }
  public isHeadInPosition(position: Position) {
    return this.x === position[0] && this.y === position[1]
  }
  public isTailInPosition(x: number, y: number) {
    type Acc = [number, number, boolean]
    return this.tail.reduce(([prevX, prevY, returnVal]: Acc, dir: TD) => {
      if (returnVal) return [prevX, prevY, true] as Acc
      const [elX, elY] = Snake.relativeDirection(dir, prevX, prevY)
      return [elX, elY, elX === x && elY === y] as Acc
    }, [this.x, this.y, false] as [number, number, boolean])[2]
  }

  private static relativeDirection(dir: TD, x: number, y: number): Position {
    switch (dir) {
      case TD.Up:
        return (y === 0) ?
          [x, height - 1] :
          [x, y - 1]
      case TD.Right:
        return (x === width - 1) ?
          [0, y] :
          [x + 1, y]
      case TD.Down:
        return (y === height - 1) ?
          [x, 0] :
          [x, y + 1]
      case TD.Left:
        return (x === 0) ?
          [width - 1, y] :
          [x - 1, y]
      default:
        return [x + 1, y]

    }
  }
  public static oppositeDirection(dir: TD): TD {
    switch (dir) {
      case TD.Up:
        return TD.Down
      case TD.Right:
        return TD.Left
      case TD.Down:
        return TD.Up
      case TD.Left:
        return TD.Right
      case TD.Stop:
        return TD.Stop
    }
  }
}