class JoelBot {
  constructor(color) {
    this.color = color
  }

  name() {
    return `JoelBot: ${this.color}`
  }

  makeMove(chess) {
    var pieces = ['b', 't', 'h', 'l', 'd', 'k']
    var values = [1, 5, 3, 3, 8, 1000]
    var bestmove = 0
    const moves = chess.moves()
    var takePiece = []
    for (var i = moves.length - 1; i >= 0; i--) {
      if (chess.get(moves[i]) != 'null') {
        takePiece.push(moves[i])
      }
    }

    if (takePiece.length == 0) {
      return moves[Math.floor(Math.random() * moves.length)]
    } else {
      return takePiece[Math.floor(Math.random() * takePiece.length)]
    }
  }
}

module.exports = color => new JoelBot(color)
