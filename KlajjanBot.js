class KlajjanBot {
  constructor(color) {
    this.color = color;
  }

  name() {
    return `KlajjanBot: ${this.color}`;
  }

  makeMove(chess) {
    const moves = chess.moves();
    return moves[0];
  }
}

const create = color => new KlajjanBot(color);
module.exports = create;
