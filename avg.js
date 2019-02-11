const Chess = require('chess.js').Chess

const whitePlayer = require('./' + process.argv[2])('w')
const blackPlayer = require('./' + (process.argv[3] || 'RandomBot.js'))('b')
const matchesCount = parseInt(process.argv[4]) || 10

let whiteTimeArray = []
let whiteMoveTimeArray = []
let blackTimeArray = []
let blackMoveTimeArray = []
let whiteVictories = 0
let blackVictories = 0
let invalidMatches = 0
let invalidMatchData = []

const timeBegin = Date.now()
for (var i = 0; i < matchesCount; i++) {
  const chess = new Chess()
  let whiteTime = 0
  let blackTime = 0
  while (!chess.game_over()) {
    let playerMove
    const temp = Date.now()
    const prevFen = chess.fen()
    if (chess.turn() == 'w') {
      playerMove = whitePlayer.makeMove(chess)
      const delta = Date.now() - temp
      whiteMoveTimeArray.push(delta)
      whiteTime += delta
    } else {
      playerMove = blackPlayer.makeMove(chess)
      const delta = Date.now() - temp
      blackMoveTimeArray.push(delta)
      blackTime += delta
    }

    if (chess.fen() != prevFen) {
      console.log('Fen changed,', new Chess(prevFen).turn(), 'cheated!')
      invalidMatchData.push({
        turn: chess.turn(),
        move: playerMove,
        validMoves: chess.moves()
      })
      invalidMatches += 1
      break
    }

    if (!chess.move(playerMove)) {
      invalidMatchData.push({
        turn: chess.turn(),
        move: playerMove,
        validMoves: chess.moves()
      })
      invalidMatches += 1
      break
    }
  }

  whiteTimeArray.push(whiteTime)
  blackTimeArray.push(blackTime)

  if (chess.in_checkmate()) {
    if (chess.turn() != 'w') {
      whiteVictories += 1
    } else {
      blackVictories += 1
    }
  }
}
const totalTime = Date.now() - timeBegin

const whiteTime = whiteTimeArray.reduce((a, b) => a + b)
const whiteMoveTime = whiteMoveTimeArray.reduce((a, b) => a + b)
const whiteTimeProcent = ((100 * whiteTime) / totalTime).toFixed(2)

const blackTime = blackTimeArray.reduce((a, b) => a + b)
const blackMoveTime = blackMoveTimeArray.reduce((a, b) => a + b)
const blackTimeProcent = ((100 * blackTime) / totalTime).toFixed(2)

const computerTime = totalTime - (whiteTime + blackTime)
const computerTimeProcent = ((100 * computerTime) / totalTime).toFixed(2)

console.log('--- Time Data ---')
console.log('Chess total runtime (s):', (totalTime / 1000).toFixed(2))
console.log('White p. total time (s):', (whiteTime / 1000).toFixed(2))
console.log('Black p. total time (s):', (blackTime / 1000).toFixed(2))
console.log('Computer total time (s):', (computerTime / 1000).toFixed(2), '\n')

console.log('White p. procent:', whiteTimeProcent + '%')
console.log('Black p. procent:', blackTimeProcent + '%')
console.log('Computer procent:', computerTimeProcent + '%', '\n')

console.log(
  'White avg game time:',
  (whiteTime / whiteTimeArray.length).toFixed(2)
)
console.log(
  'White avg move time:',
  (whiteMoveTime / whiteMoveTimeArray.length).toFixed(2)
)
console.log('White max move time:', Math.max(...whiteMoveTimeArray))
console.log('White min move time:', Math.min(...whiteMoveTimeArray), '\n')

console.log(
  'Black avg game time:',
  (blackTime / blackTimeArray.length).toFixed(2)
)
console.log(
  'Black avg move time:',
  (blackMoveTime / blackMoveTimeArray.length).toFixed(2)
)
console.log('Black max move time:', Math.max(...blackMoveTimeArray))
console.log('Black min move time:', Math.min(...blackMoveTimeArray), '\n')

console.log('--- Game Data ---')
console.log('White p. victories:', whiteVictories)
console.log('Black p. victories:', blackVictories)
console.log(
  'Matches drawn     :',
  matchesCount - (whiteVictories + blackVictories + invalidMatches)
)

if (invalidMatches > 0) {
  console.log('Invalid m. matches:', invalidMatches)
  invalidMatchData.forEach((data, idx) => {
    console.log()
    console.log('Invalid match nbr:', idx + 1)
    console.log('Turn:', data.turn)
    console.log('Move:', data.move)
    console.log('Valid moves:', data.validMoves.reduce((a, b) => a + ', ' + b))
  })
}
