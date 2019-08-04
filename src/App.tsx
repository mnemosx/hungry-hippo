import React, { useState } from 'react';
import { Snake, Position, TD } from './snake';
import './App.css';

const width = 27
const height = 15

let direction = TD.Stop
let update = () => { }
let newDir: TD | null = null

setInterval(() => {
  if (newDir !== Snake.oppositeDirection(direction) && newDir !== null) {
    direction = newDir
  }
  update()
}, 200)

function keyToTD(e: KeyboardEvent): TD | null {
  switch (e.key) {
    case 'w':
      return TD.Up
    case 'd':
      return TD.Right
    case 's':
      return TD.Down
    case 'a':
      return TD.Left
    default:
      return TD.Stop
  }
}

document.addEventListener('keyup', (e) => {
  e.preventDefault()
  newDir = keyToTD(e)
})

function tdClass(x: number, y: number, snake: Snake, [appleX, appleY]: Position): 'snake' | 'head' | 'apple' | '' {
  if (snake.isTailInPosition(x, y)) {
    return 'snake'
  } else if (snake.isHeadInPosition([x, y])) {
    return 'head'
  } else if (x === appleX && y === appleY) {
    return 'apple'
  } else {
    return ''
  }
}

function getFieldsWithoutSnake(snake: Snake): Position[] {
  const output: Position[] = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (!snake.isInPosition(x, y)) {
        output.push([x, y])
      }
    }
  }
  return output
}
/**
 * Given snake returns a random position for apple
 * which doesn't overlap wot snake
 * @param snake
 */
function getRandomApple(snake: Snake): Position {
  const possiblePositions = getFieldsWithoutSnake(snake)
  const index = Math.floor(Math.random() * possiblePositions.length)
  return possiblePositions[index]
}

const App: React.FC = () => {
  const [snake, setSnake] = useState<Snake>(new Snake(10, 10, [TD.Left, TD.Left]))
  const [apple, setApple] = useState<Position>(getRandomApple(snake))
  const [gameOver, setGameOver] = useState<boolean>(false)

  function updatePosition() {
    if (snake.isGameOver()) {
      setGameOver(true)
      return
    }
    if (snake.hasReachedApple(apple)) {
      setApple(getRandomApple(snake))
    }
    if (direction !== TD.Stop) {
      setSnake(snake.move(direction, apple))
    }
  }
  update = updatePosition



  return (
    <div className={`App ${gameOver ? 'gameOver' : ''}`}>
      <div className="header">
        <div className="hippo-header"></div>
        <h1>The Hungry<br /> Hippo Game</h1>
      </div>
      <table className={`table ${gameOver ? 'blurred' : ''}`}>
        <tbody>
          {
            Array(height).fill(null).map((_, y: number) =>
              <tr key={y}>{Array(width).fill(null).map((_, x: number) =>
                <td key={`${y}${x}`}
                  className={tdClass(x, y, snake, apple)}>

                </td>)}
              </tr>)}
        </tbody>
      </table>
    </div >
  );
}

export default App;
