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

  getTakeValue(chess, move) {
    const chess_square = chess.get(this.getSquare(move))
    if (!chess_square) {
      return 0
    } else {
      return points[chess_square.type]
    }
  }

  getValue(chess, move) {
    let value = this.getTakeValue(chess, move)

    chess.move(move)
    if (chess.in_checkmate()) {
      value += 100000
    } else {
      value -= chess
        .moves()
        .map(move => this.getTakeValue(chess, move))
        .reduce((v1, v2) => Math.max(v1, v2), 0)
    }
    chess.undo()

    return value
  }

  getBetterMove(m1, m2) {
    if (m1.value == m2.value) {
      return Math.random() < 0.5 ? m1 : m2
    }
    return m1.value > m2.value ? m1 : m2
  }

  makeMove(chess) {
    const moves = chess
      .moves()
      .map(move => ({ move: move, value: this.getValue(chess, move) }))

    const best = moves.reduce((move1, move2) =>
      this.getBetterMove(move1, move2)
    )
    return best.move
  }
}

const create = color => new KlajjanBot(color)
module.exports = create
