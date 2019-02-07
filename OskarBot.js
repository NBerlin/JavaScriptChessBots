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
  check: 5,
  takePieceLoseRatio: -1,
  threatenTakeRatio: 0.3,
  protectTakeRatio: 0.3,
  movesAfter: 0.01,
  castle: 0.7
}

const points = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 45 }

// TODO, add points if also check?
// TODO, check safe fork
// TODO check if worth anyway bcus points
// todo, standing in therathenenddjalkfja
// TODO, lockcheck?
// TODO not only do the first move
// TODO care about points
// TODO for debug, print list of possible moves and their kategory
// TODO const offerFreePieceForCheckmate = a => a; // the idea is to look for an exchange that would be bad but win the game
// TODO,FUTURE SIGHT
// TODO, add prop -> can opponent do the same
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
      .map(mv => canEnableMoves(mv, chess))
      .sort((a, b) =>
        b.value === a.value ? Math.random() - 0.5 : b.value - a.value
      )
      .map(mv => (debug && console.log(mv.value, mv.meta)) || mv)[0],
  name: () => name
})

const canEnableMoves = (mv, state) => {
  const before = state.moves().length
  state.move(mv)
  // Opp makes random move
  const oppMovs = state.moves()
  state.move(oppMovs[Math.floor(Math.random() * oppMovs.length)])
  const score = state.moves().length - before
  state.undo()
  state.undo()
  return decoratedMove(mv, true, {
    value: score * weights.movesAfter,
    meta: `${score} moves enabled after this move`
  })
}

const canCheckmate = (mv, state) => {
  state.move(mv)
  const isDone = state.in_checkmate()
  state.undo()
  return decoratedMove(mv, isDone, {
    value: weights.checkmate,
    meta: 'Checkmateboiiiis'
  })
}

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

module.exports = color => moveman({ color, debug: false })
