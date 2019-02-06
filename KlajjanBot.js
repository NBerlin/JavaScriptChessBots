const points = { p: 8, n: 24, b: 24, r: 40, q: 72, k: 240 }
const promotion = {
  n: points['n'] - points['p'],
  b: 0,
  r: 0,
  q: points['q'] - points['p']
}
const colMul = { w: 1, b: -1 }
const letterToNum = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 }
const numToLetter = 'abcdefgh'
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
const pPosition = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 3, 3, 2, 1, 0],
  [0, 1, 2, 2, 2, 2, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
]

class KlajjanBot {
  constructor(color) {
    this.color = color
  }

  name() {
    return 'KlajjanBot'
  }

  square(pos) {
    return numToLetter[pos.x] + (pos.y + 1)
  }

  position(pos) {
    return { x: letterToNum[pos[0]], y: parseInt(pos[1]) - 1 }
  }

  pawnCheckSquare(chess, pos, dx, dy, checkForPawn = false) {
    const sq = chess.get(this.square({ x: pos.x - dx, y: pos.y - dy }))
    return sq && sq.color == this.color && (checkForPawn || sq.type == 'p')
      ? 1
      : 0
  }

  pawnNeighbourValue(chess, pos) {
    return (
      this.pawnCheckSquare(chess, pos, -1, colMul[this.color]) +
      this.pawnCheckSquare(chess, pos, 1, colMul[this.color]) +
      this.pawnCheckSquare(chess, pos, -1, -colMul[this.color], true) +
      this.pawnCheckSquare(chess, pos, 1, -colMul[this.color], true) -
      this.pawnCheckSquare(chess, pos, -1, 0, true) -
      this.pawnCheckSquare(chess, pos, 1, 0, true) -
      2 * this.pawnCheckSquare(chess, pos, 0, colMul[this.color], true) -
      2 * this.pawnCheckSquare(chess, pos, 0, -colMul[this.color], true)
    )
  }

  pawnValue(chess, from, to) {
    return (
      this.pawnNeighbourValue(chess, to) - this.pawnNeighbourValue(chess, from)
    )
  }

  positionValue(chess, move) {
    const from = this.position(move.from)
    const to = this.position(move.to)
    switch (move.piece) {
      case 'n':
        return nPosition[to.y][to.x] - nPosition[from.y][from.x]
      case 'b':
        return bPosition[to.y][to.x] - bPosition[from.y][from.x]
      case 'q':
        return qPosition[to.y][to.x] - qPosition[from.y][from.x]
      case 'p':
        return (
          pPosition[to.y][to.x] -
          pPosition[from.y][from.x] +
          this.pawnValue(chess, from, to)
        )
      default:
        return 0
    }
  }

  simpleMoveValue(chess, move) {
    return (
      (this.color == move.color ? 1 : -1) *
      ((move.captured ? points[move.captured] : 0) +
        (move.promotion ? promotion[move.promotion] : 0) +
        (move.flags == 'q' ? 4 : 0) +
        (move.flags == 'k' ? 7 : 0) +
        (move.san[move.san.length - 1] == '#' ? 1000 : 0) +
        this.positionValue(chess, move))
    )
  }

  tradeDown(move) {
    return move.captured
      ? points[move.captured] - points[move.piece] < 0
      : false
  }

  checkMove(move) {
    return move.san[move.san.length - 1] == '+'
  }

  moveValue(chess, move, ret = false, checkedChecked = false, level = 0) {
    let value = this.simpleMoveValue(chess, move)

    if (ret || level > 3) {
      return value
    }

    chess.move(move.san)
    if (chess.in_checkmate()) {
      value += 1000
    } else if (chess.in_draw() && level == 0) {
      value -= 1000
    } else {
      const func = move.color == this.color ? Math.min : Math.max
      value += func(
        ...chess
          .moves({ verbose: true })
          .map(tMove =>
            tMove.captured || (!checkedChecked && this.checkMove(move))
              ? this.moveValue(
                  chess,
                  tMove,
                  this.tradeDown(move),
                  checkedChecked || this.checkMove(move),
                  level + 1
                )
              : this.simpleMoveValue(chess, tMove)
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
