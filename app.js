const Chess = require('chess.js').Chess
const chess = new Chess()

const player1 = require('./' + process.argv[2])('w')
const player2 = require('./' + process.argv[3])('b')
const time = process.argv[4]

let timePlayer1 = 0
let timePlayer2 = 0

while (!chess.game_over()) {
  let turn
  const temp = Date.now()
  if (chess.turn() == 'w') {
    turn = player1.makeMove(new Chess(chess.fen()))
    timePlayer1 += Date.now() - temp
  } else {
    turn = player2.makeMove(new Chess(chess.fen()))
    timePlayer2 += Date.now() - temp
  }

  !chess.move(turn) &&
    console.log('move failed', turn, 'possibilities', chess.moves())

  if (time == 'slow') {
    console.log(chess.ascii())
    for (let i = 1000000000; i >= 0; i--) {}
  }
}

console.log(chess.ascii())
if (chess.in_checkmate()) {
  if (chess.turn() != 'w') {
    console.log('White Won!')
  } else {
    console.log('Black Won!')
  }
} else {
  console.log('It was a draw')
}
console.log('---')

console.log(player1.name(), ' (white)')
console.log('time (s): ', timePlayer1 / 1000.0, '\n')
console.log(player2.name(), ' (black)')
console.log('time (s): ', timePlayer2 / 1000.0)
