class KlajjanBot {
  constructor(color) {
    this.color = color
  }

  name() {
    return `KlajjanBot: ${this.color}`
  }

  makeMove(chess) {
    const moves = chess.moves()

    return moves[Math.floor(Math.random() * moves.length)]
  }
}

const create = color => new KlajjanBot(color)
module.exports = create
