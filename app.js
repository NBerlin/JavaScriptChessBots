const Chess = require('chess.js').Chess
const chess = new Chess()

const player1 = require('./' + process.argv[2])('w')
const player2 = require('./' + process.argv[3])('b')

while (!chess.game_over()) {
  if (chess.turn() == 'w') {
    chess.move(player1.makeMove(new Chess(chess.fen())))
  } else {
    chess.move(player2.makeMove(new Chess(chess.fen())))
  }
  console.log(chess.ascii())
}

console.log(chess.ascii())
if (chess.in_checkmate()) {
  if (chess.turn == 'w') {
    console.log('Winner: ' + player2.name())
  } else {
    console.log('Winner: ' + player1.name())
  }
} else {
  console.log('It was a draw')
}
