class RandomBot {
  constructor(color) {
    this.color = color
  }

  name() {
    return 'RandomBot'
  }

  makeMove(chess) {
    const moves = chess.moves()
    return moves[Math.floor(Math.random() * moves.length)]
  }
}

const create = color => new RandomBot(color)
module.exports = create
