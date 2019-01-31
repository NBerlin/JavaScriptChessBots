class KlajjanBot {
  name() {
    return "KlajjanBot";
  }

  makeMove(chess) {
    const moves = chess.moves();
    return moves[Math.floor(Math.random() * moves.length)];
  }
}

module.exports = KlajjanBot;
