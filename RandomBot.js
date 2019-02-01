class RandomBot {
  constructor(color) {
    this.color = color;
  }

  name() {
    return "RandomBot: {this.color}";
  }

  makeMove(chess) {
    const moves = chess.moves();
    return moves[Math.floor(Math.random() * moves.length)];
  }
}

module.exports = RandomBot;
