const Chess = require('chess.js').Chess
const chess = new Chess()

const player1 = require('./' + process.argv[2])('w')
const player2 = require('./' + process.argv[3])('b')
const time = process.argv[4]

while (!chess.game_over()) {
  let turn
  if (chess.turn() == 'w') {
    turn = player1.makeMove(new Chess(chess.fen()))
  } else {
    turn = player2.makeMove(new Chess(chess.fen()))
  }

  !chess.move(turn) &&
    console.log('move failed', turn, 'possibilities', chess.moves())

  if (time == 'slow') {
    console.log(chess.ascii())
    for (let i = 1000000000; i >= 0; i--) {}
  }
}

console.log(chess.ascii())
console.log(chess.turn())
if (chess.in_checkmate()) {
  if (chess.turn() == 'w') {
    console.log('Winner: ' + player2.name())
  } else {
    console.log('Winner: ' + player1.name())
  }
} else {
  console.log('It was a draw')
}
