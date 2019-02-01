var Chess = require("chess.js").Chess;
var chess = new Chess();

const BotOne = require("./" + process.argv[2]);
const BotTwo = require("./" + process.argv[3]);
let player1 = new BotOne("w");
let player2 = new BotTwo("b");

while (!chess.game_over()) {
  if (chess.turn() == "w") {
    chess.move(player1.makeMove(new Chess(chess.fen())));
  } else {
    chess.move(player2.makeMove(new Chess(chess.fen())));
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
