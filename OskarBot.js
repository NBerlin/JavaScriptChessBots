const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const nums = [1, 2, 3, 4, 5, 6, 7, 8]
const opponent = { w: 'b', b: 'w' }
const capture = 'c'
const nonCapture = 'n'
const pawnPush = 'b'
const passantBS = 'e'
const promotion = 'p'
const kingCastle = 'k'
const queenCastle = 'q'
const stdNotation = 'san'

const pieces = state =>
  alphabet
    .reduce((all, curr) => all.concat(nums.map(n => curr + n)), [])
    .map(sq => state.get(sq))
    .filter(a => a)
    .map(sq => ({ ...sq, value: points[sq.type] }))

const total = (state, color) =>
  pieces(state)
    .filter(p => p.color === color)
    .reduce((tot, curr) => tot + curr.value, 0)

const anyfromListinOther = (A, B) =>
  A.map(item => B.includes(item)).reduce((acc, curr) => acc || curr, false)

const anyFromStringInOther = (A, B) =>
  anyfromListinOther(A.split(''), B.split(''))

const multipliedPoint = multi =>
  Object.assign(...Object.entries(points).map(([k, v]) => ({ [k]: multi * v })))

// check if behind
// check if only king left -> finish him mode

const weights = {
  checkmate: 100000,
  check: 2,
  takePieceLoseRatio: -1,
  threatenTakeRatio: 0.3,
  protectTakeRatio: 0.2,
  protectSquare: 0.01,
  movesAfter: 0.02,
  castle: 2
}

const points = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 50 }
const board = alphabet.reduce(
  (all, curr) => all.concat(nums.map(n => curr + n)),
  []
)
const row = pos =>
  board.filter(
    spot => spot.includes(pos.charAt(0)) || spot.includes(pos.charAt(1))
  )

const diffs = [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]
const pos2pair = pos =>
  pos.split('').map(item => parseInt(item) || parseInt(item.charCodeAt(0) - 96))
const pair2pos = pair => [String.fromCharCode(pair[0] + 96), pair[1]].join('')

const isRealMove = ([a, b]) => a > 0 && a <= 8 && b > 0 && b <= 8
const diagonal = pos =>
  diffs
    .map(num => pos2pair(pos).map(i => i + num))
    .filter(isRealMove)
    .map(pair2pos)

const movesForHorse = [
  [2, 1],
  [-2, 1],
  [2, -1],
  [-2, -1],
  [1, 2],
  [-1, 2],
  [1, -2],
  [-1, -2]
]
//prettier-ignore
const movesForKing = [
  [ 1,  1], [ 1,  0], [ 1, -1],
  [ 0,  1],           [ 0, -1],
  [-1, -1], [-1,  0], [-1,  1],
];
const captureForPawn = [[1, 1], [1, -1]]

const horsemoves = pos =>
  movesForHorse
    .map(([a, b]) => [pos2pair(pos)[0] + a, pos2pair(pos)[1] + b])
    .filter(isRealMove)
    .map(pair2pos)

// TODO, lockcheck?
// move -> if draw -> don't stalemate
// Maximize spots that are protec
// Threathen / protec / stand in protected
// TODO,FUTURE SIGHT
// TODO, skicka med "protected squares, eller sätt funktion för det"

const decoratedMove = (mv, criteria, { value, meta }) => ({
  ...mv,
  ...(criteria && { value: mv.value + value, meta: mv.meta.concat(meta) })
})
const notStuckInLoop = () => true

const moveman = ({ color = 'w', name = 'oskar', debug = false }) => ({
  makeMove: chess =>
    chess
      .moves({ verbose: true })
      .map(mv => ({ ...mv, value: 0, meta: [] }))
      .map(mv => canCheckmate(mv, chess))
      .map(mv => canTakePiece(mv, chess))
      .map(mv => canGetPromotion(mv, chess))
      .map(mv => canCheck(mv, chess))
      .map(mv => canCastle(mv, chess))
      .map(mv => oppCanTakeNewPos(mv, chess))
      .map(mv => oppCanCheckmate(mv, chess))
      .map(mv => canEnableMoves(mv, chess))
      .map(mv => preventDraw(mv, chess))
      //.map(mv => pawnsFinishHim(mv, chess, color))
      .sort(sorter)
      .map(mv => mapDebug(mv, debug))[0],
  name: () => name
})

const mapDebug = (mv, debug) =>
  (debug && console.log(mv.value, mv.piece, mv.to, mv.meta)) || mv
const sorter = (a, b) =>
  b.value === a.value ? Math.random() - 0.5 : b.value - a.value

const oppCanCheckmate = (mv, state) => {
  state.move(mv)
  const theyCheckMate = state.moves().find(mv => mv.includes('#'))
  state.undo()

  return decoratedMove(mv, theyCheckMate, {
    value: weights.checkmate - 1,
    meta: 'this moves enables their checkmate'
  })
}

const pawnsFinishHim = (mv, state, color) => {
  const onlyKingLeft = total(state, opponent[color]) === weights.king
  return decoratedMove(mv, onlyKingLeft && mv.piece === 'p', {
    value: weights.checkmate - 1,
    meta: 'Only king left, getem pawns!'
  })
}

const canEnableMoves = (mv, state) => {
  const before = state.moves().length
  state.move(mv)
  // Opp makes random move
  const oppMovs = state.moves()
  if (oppMovs.length === 0) {
    state.undo() // prevent cheating
    return mv
  }
  state.move(oppMovs[Math.floor(Math.random() * oppMovs.length)])
  const score = state.moves().length - before
  state.undo()
  state.undo()
  return decoratedMove(mv, true, {
    value: score * weights.movesAfter,
    meta: `${score} moves enabled after this move`
  })
}

const canCheckmate = (mv, state) =>
  decoratedMove(mv, mv.san.includes('#'), {
    value: weights.checkmate,
    meta: 'Checkmateboiiiis'
  })

const canCheck = (mv, state) => {
  state.move(mv)
  const check = state.in_check()
  state.undo()
  return decoratedMove(mv, check, {
    value: weights.check,
    meta: 'check'
  })
}

const oppCanTakeNewPos = (mv, state) => {
  const myPos = mv.to
  state.move(mv)
  const enemyTakesMe = state
    .moves({ verbose: true })
    .find(mv => mv.to === myPos)
  state.undo()

  return decoratedMove(mv, enemyTakesMe, {
    value: weights.takePieceLoseRatio * (points[mv.piece] || 0),
    meta: 'lose piece'
  })
}

const canGetPromotion = (mv, state) =>
  decoratedMove(mv, mv.promotion, {
    value: points[mv.promotion],
    meta: 'promotion'
  })
const canTakePiece = (mv, state) =>
  decoratedMove(mv, mv.captured, {
    value: points[mv.captured],
    meta: 'capture'
  })

const canCastle = (mv, state) =>
  decoratedMove(mv, anyFromStringInOther('kq', mv.flags), {
    value: weights.castle,
    meta: 'wow castle'
  })
//TODO know if this works since history doesn't
const preventDraw = (mv, state) => {
  state.move(mv)
  const isDraw = state.in_draw()
  state.undo()
  return decoratedMove(mv, isDraw, {
    value: weights.draw,
    meta: "let's not draw"
  })
}

module.exports = color => moveman({ color, debug: false })
