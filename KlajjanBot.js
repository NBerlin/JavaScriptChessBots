const points = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 40 }

class KlajjanBot {
  constructor(color) {
    this.color = color
  }

  name() {
    return `KlajjanBot: ${this.color}`
  }

  getSquare(move) {
    return move
      .replace('+', '')
      .split('=')[0]
      .split('x')
      .slice(-1)[0]
  }

  getMoveValue(chess, move) {
    const chess_square = chess.get(this.getSquare(move))
    let value = 0
    if (move.includes('=')) {
      value += points[move.split('=')[1]]
    }
    if (move == 'O-O' || move == 'O-O-O') {
      value += 2
    }
    if (chess_square) {
      value += points[chess_square.type]
    }

    return value
  }

  getValue(chess, move) {
    let value = this.getMoveValue(chess, move)

    chess.move(move)
    if (chess.in_checkmate()) {
      value += 100000
    } else {
      value -= chess
        .moves()
        .map(move => this.getMoveValue(chess, move))
        .reduce((v1, v2) => Math.max(v1, v2), 0)
    }
    chess.undo()

    return value
  }

  reducerMethod(list, obj, comp) {
    if (list.length == 0 || comp(list[0], obj) < 0) {
      return [obj]
    } else if (comp(list[0], obj) == 0) {
      list.push(obj)
    }

    return list
  }

  onlyKingMoves(moves) {
    return moves.map(move => move.move[0] == 'K').reduce((a, b) => a && b, true)
  }

  filterKings(moves) {
    return this.onlyKingMoves(moves)
      ? moves
      : moves.filter(move => move.move[0] != 'K')
  }

  makeMove(chess) {
    const moves = chess
      .moves()
      .map(move => ({ move: move, value: this.getValue(chess, move) }))

    const filtered_moves = this.filterKings(
      moves.reduce(
        (m1, m2) => this.reducerMethod(m1, m2, (o1, o2) => o1.value - o2.value),
        []
      )
    )

    return filtered_moves[Math.floor(filtered_moves.length * Math.random())]
      .move
  }
}

const create = color => new KlajjanBot(color)
module.exports = create
