const points = { p: 8, n: 24, b: 24, r: 40, q: 72, k: 240 }
const promotion = {
  n: points['n'] - points['p'],
  b: 0,
  r: 0,
  q: points['q'] - points['p']
}
const letterToNum = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 }
const pawnNeighbours = {
  a: ['b'],
  b: ['a', 'c'],
  c: ['b', 'd'],
  d: ['c', 'e'],
  e: ['d', 'f'],
  f: ['e', 'g'],
  g: ['f', 'h'],
  h: ['g']
}
const nPosition = [
  [2, 3, 4, 4, 4, 4, 3, 2],
  [3, 4, 6, 6, 6, 6, 4, 3],
  [4, 6, 8, 8, 8, 8, 6, 4],
  [4, 6, 8, 8, 8, 8, 6, 4],
  [4, 6, 8, 8, 8, 8, 6, 4],
  [4, 6, 8, 8, 8, 8, 6, 4],
  [3, 4, 6, 6, 6, 6, 4, 3],
  [2, 3, 4, 4, 4, 4, 3, 2]
]
const bPosition = [
  [7, 7, 7, 7, 7, 7, 7, 7],
  [7, 9, 9, 9, 9, 9, 9, 7],
  [7, 9, 11, 11, 11, 11, 9, 7],
  [7, 9, 11, 13, 13, 11, 9, 7],
  [7, 9, 11, 13, 13, 11, 9, 7],
  [7, 9, 11, 11, 11, 11, 9, 7],
  [7, 9, 9, 9, 9, 9, 9, 7],
  [7, 7, 7, 7, 7, 7, 7, 7]
]
const qPosition = [
  [21, 21, 21, 21, 21, 21, 21, 21],
  [21, 23, 23, 23, 23, 23, 23, 21],
  [21, 23, 25, 25, 25, 25, 23, 21],
  [21, 23, 25, 27, 27, 25, 23, 21],
  [21, 23, 25, 27, 27, 25, 23, 21],
  [21, 23, 25, 25, 25, 25, 23, 21],
  [21, 23, 23, 23, 23, 23, 23, 21],
  [21, 21, 21, 21, 21, 21, 21, 21]
]

class KlajjanBot {
  constructor(color) {
    this.color = color
  }

  name() {
    return 'KlajjanBot'
  }

  tradeDown(move) {
    return move.captured
      ? points[move.captured] - points[move.piece] < 0
      : false
  }

  positionValue(move) {
    const xFrom = letterToNum[move.from[0]]
    const yFrom = parseInt(move.from[1]) - 1
    const xTo = letterToNum[move.to[0]]
    const yTo = parseInt(move.to[1]) - 1
    switch (move.piece) {
      case 'n':
        return nPosition[yTo][xTo] - nPosition[yFrom][xFrom]
      case 'b':
        return bPosition[yTo][xTo] - bPosition[yFrom][xFrom]
      case 'q':
        return qPosition[yTo][xTo] - qPosition[yFrom][xFrom]
      case 'p':
        return 0
      default:
        return 0
    }
  }

  simpleMoveValue(move) {
    return (
      (this.color == move.color ? 1 : -1) *
      ((move.captured ? points[move.captured] : 0) +
        (move.promotion ? promotion[move.promotion] : 0) +
        (move.flags == 'q' ? 4 : 0) +
        (move.flags == 'k' ? 7 : 0) +
        this.positionValue(move))
    )
  }

  moveValue(chess, move, ret = false, level = 0) {
    let value = this.simpleMoveValue(move)

    if (ret || level > 3) {
      return value
    }

    chess.move(move.san)
    if (chess.in_checkmate() && level == 0) {
      value += 100000
    } else if (chess.in_draw() && level == 0) {
      value -= 100000
    } else {
      const func = move.color == this.color ? Math.min : Math.max
      value += func(
        ...chess.moves({ verbose: true }).map(tMove =>
          tMove.captured // && tMove.to == move.to)
            ? this.moveValue(chess, tMove, this.tradeDown(move), level + 1)
            : this.simpleMoveValue(tMove)
        )
      )
    }
    chess.undo()
    return value
  }

  reducerMethod(list, move) {
    if (list.length == 0 || list[0].value - move.value < 0) {
      return [move]
    } else if (list[0].value - move.value == 0) {
      return list.concat(move)
    }

    return list
  }

  kingFilter(moves) {
    return moves.every(move => move.piece == 'k')
      ? moves
      : moves.filter(move => move.piece != 'k')
  }

  moves(chess) {
    return chess
      .moves({ verbose: true })
      .map(move => ({ san: move.san, value: this.moveValue(chess, move) }))
  }

  makeMove(chess) {
    const filtered_moves = this.kingFilter(
      this.moves(chess).reduce(
        (list, move) => this.reducerMethod(list, move),
        []
      )
    )

    return filtered_moves[Math.floor(filtered_moves.length * Math.random())].san
  }
}

const create = color => new KlajjanBot(color)
module.exports = create
