const chess = new require("chess.js").Chess();

const moveman = ({ color = "w", name = "oskar" }) => ({
  makeMove: chess => {
    return chess.moves()[0];
  }
});

const stupidman = {
  makeMove: chess =>
    chess.moves()[Math.floor(Math.random() * chess.moves().length)]
};

const player1 = moveman({ color: "w", name: "john" });
const player2 = stupidman;

while (!chess.game_over()) {
  temp = chess;
  console.log(chess.turn());
  if (chess.turn() == "w") {
    chess.move(player1.makeMove(temp));
  } else {
    chess.move(player2.makeMove(temp));
  }
}

console.log(chess.ascii());
if (chess.in_checkmate()) {
  if (chess.turn === "w") {
    console.log("Winner: " + player2.name());
  } else {
    console.log("Winner: " + player1.name());
  }
} else {
  console.log("It was a draw");
}
