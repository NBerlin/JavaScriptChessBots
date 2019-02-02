const Chess = require('chess.js').Chess
const chess = new Chess()

const player1 = require('./' + process.argv[2])('w')
const player2 = require('./' + process.argv[3])('b')
const time = process.argv[4]

const pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 40 }
const colorValue = { w: 1, b: -1 }

// TODO: Make method
function getAdvantage(chess) {
  console.log(chess.fen().split(' ')[0])
}

while (!chess.game_over()) {
  if (chess.turn() == 'w') {
    chess.move(player1.makeMove(new Chess(chess.fen())))
  } else {
    chess.move(player2.makeMove(new Chess(chess.fen())))
  }
  if (time == 'slow') {
    console.log(chess.ascii())
    console.log('Board value: ', getAdvantage(chess))
    for (var i = 1000000000 - 1; i >= 0; i--) {}
  }
}

console.log(chess.ascii())
if (chess.in_checkmate()) {
  if (chess.turn() != 'w') {
    console.log('Winner: ' + player1.name())
  } else {
    console.log('Winner: ' + player2.name())
  }
} else {
  console.log('It was a draw')
}
