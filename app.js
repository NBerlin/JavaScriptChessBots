var Chess = require('chess.js').Chess;
var chess = new Chess();

while (!chess.game_over()) {
  console.log(chess.moves());
  var moves = chess.moves();
  var move = moves[Math.floor(Math.random() * moves.length)];
  chess.move(move);
}