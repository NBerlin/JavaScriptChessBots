const chess = new require("chess.js").Chess();
const chs = new require("chess.js").Chess();

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h"];
const nums = [1, 2, 3, 4, 5, 6, 7, 8];
const points = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 45 };
const opponent = { w: "b", b: "w" };
const pieces = state =>
  alphabet
    .reduce((all, curr) => all.concat(nums.map(n => curr + n)), [])
    .map(sq => state.get(sq))
    .filter(a => a)
    .map(sq => ({ ...sq, value: points[sq.type] }));

const total = (state, color) =>
  pieces(state)
    .filter(p => p.color === color)
    .reduce((tot, curr) => tot + curr.value, 0);

const movesThatGainPoints = (state, color) => {
  const curr = total(state, color);
  return state.moves().filter(mv => {
    state.move(mv);
    const tot = total(state, color);
    state.undo();
    return tot > curr;
  });
};

const moveman = ({ color = "w", name = "oskar" }) => ({
  makeMove: fen => {
    chs.load(fen);
    const moveThatsMateInOne = () =>
      chs.moves().find(move => {
        chs.move(move);
        const isDone = chs.in_checkmate();
        chs.undo();
        return isDone;
      });
    const canMateInOne = moveThatsMateInOne;
    const seeFreePiece = () => false;
    const justMakeTheBestMove = () => {
      const moves = movesThatGainPoints(chs, "w");
      if (moves.length !== 0) {
        return moves[Math.floor(Math.random() * moves.length)];
      } else {
        return chs.moves()[Math.floor(Math.random() * chs.moves().length)];
      }
    };

    if (canMateInOne()) {
      return moveThatsMateInOne();
    }

    if (seeFreePiece()) {
      return takeFreePiece();
    }

    return justMakeTheBestMove();
  },
  name: () => name
});

const stupidman = {
  makeMove: fen => {
    chs.load(fen);
    return chs.moves()[Math.floor(Math.random() * chess.moves().length)];
  },
  name: "stopid"
};

const player1 = moveman({ color: "w" });
const player2 = stupidman;

while (!chess.game_over()) {
  const currentFen = chess.fen();
  let pMove;

  if (chess.turn() == "w") {
    pMove = player1.makeMove(currentFen);
  } else {
    pMove = player2.makeMove(currentFen);
  }
  chess.move(pMove);
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
