var Chess = require("chess.js").Chess;
var chess = new Chess();
const NickiBot = require("./NickiBot.js");
let player1 = new NickiBot("w");
let player2 = new NickiBot("b");
while (!chess.game_over()) {
  temp = chess;
  if (chess.turn() == "w") {
    chess.move(player1.makeMove(temp));
  } else {
    chess.move(player2.makeMove(temp));
  }
}
console.log(chess.ascii());
if (chess.in_checkmate()) {
  if (chess.turn == "w") {
    console.log("Winner: " + player2.name());
  } else {
    console.log("Winner: " + player1.name());
  }
} else {
  console.log("It was a draw");
}
