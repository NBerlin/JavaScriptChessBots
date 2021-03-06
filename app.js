const Chess = require('chess.js').Chess
const chess = new Chess()

const player1 = require('./' + process.argv[2])('w')
const player2 = require('./' + (process.argv[3] || 'RandomBot.js'))('b')
const arg = process.argv[4]

let timePlayer1 = 0
let timePlayer2 = 0

while (!chess.game_over()) {
  let playerMove
  const prevFen = chess.fen()
  const temp = Date.now()
  if (chess.turn() == 'w') {
    playerMove = player1.makeMove(chess)
    timePlayer1 += Date.now() - temp
  } else {
    playerMove = player2.makeMove(chess)
    timePlayer2 += Date.now() - temp
  }

  if (chess.fen() != prevFen) {
    chess = new Chess(prevFen)
    console.log('Fen changed,', chess.turn(), 'cheated!')
    break
  }

  if (!chess.move(playerMove)) {
    console.log('move failed', playerMove, 'possibilities', chess.moves())
    break
  }

  if (arg == 'slow' || arg == 'show') {
    console.log(chess.fen())
    prettyPrint(chess)
  }

  if (arg == 'slow') {
    for (let i = 1000000000; i >= 0; i--) {}
  }
}

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

const prettyPrint = chess =>
  console.log(
    chess
      .ascii()
      .split('')
      .map(item => unicodemap[item] || item)
      .join('')
  )
const unicodemap = {
  K: '\u2654',
  Q: '\u2655',
  R: '\u2656',
  B: '\u2657',
  N: '\u2658',
  P: '\u2659',
  k: '\u265A',
  q: '\u265B',
  r: '\u265C',
  b: '\u265D',
  n: '\u265E',
  p: '\u265F'
}

if (!arg) {
  prettyPrint(chess)
}
