const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const nums = [1, 2, 3, 4, 5, 6, 7, 8]
const points = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 45 }
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

// TODO, add points if also check?
// TODO, check safe fork
// TODO check if worth anyway bcus points
// TODO, lockcheck?
// TODO not only do the first move
// TODO care about points
// TODO for debug, print list of possible moves and their kategory
// TODO const offerFreePieceForCheckmate = a => a; // the idea is to look for an exchange that would be bad but win the game
// TODO,FUTURE SIGHT
// TODO, add prop -> can opponent do the same

const decoratedMove = (mv, criteria, obj) => ({
  ...mv,
  ...(criteria && obj)
})
const notStuckInLoop = () => true

const moveman = ({ color = 'w', name = 'oskar', debug = false }) => ({
  makeMove: chess =>
    chess
      .moves({ verbose: true })
      .map(mv => ({ ...mv, value: 0, meta: 'garbage default move' }))
      .map(mv => findCheckmate(mv, chess))
      .map(mv => findFreePiece(mv, chess))
      .map(mv => findFreeCheck(mv, chess))
      .map(mv => findCastle(mv, chess))
      .map(mv => findPieceThatLivesAtHome(mv, chess))
      .map(mv => findEvOtherPawn(mv, chess))
      .map(mv => findPawn(mv, chess))
      //.map(mv => pawnCanProtec(mv, chess))
      // prevent free stuff doesn't work
      //.map(mv => findPreventFreeStuffs(mv, chess))
      // Value move where you protec or beofore protec
      // map finish him, fixa när bara kung kvar
      .map(mv => (debug && mv.value > 0 && console.log(mv.meta)) || mv)
      .sort((a, b) =>
        b.value === a.value ? Math.random() - 0.5 : b.value - a.value
      )[0],
  name: () => name
})

const findCheckmate = (mv, state) => {
  state.move(mv)
  const isDone = state.in_checkmate()
  state.undo()
  return decoratedMove(mv, isDone, { value: 1000, meta: 'Checkmateboiiiis' })
}

const findFreeCheck = (mv, state) => {
  state.move(mv)
  const check = state.in_check()
  const checkPosition = mv.to
  const enemyDefenceMove = state
    .moves({ verbose: true })
    .find(mv => mv.to === checkPosition)
  state.undo()
  return decoratedMove(mv, check && !enemyDefenceMove, {
    value: 70,
    meta: 'free Check'
  })
}

const findFreePiece = (mv, state) => {
  const canTakePiece = anyFromStringInOther('cep', mv.flags)
  state.move(mv)
  const takePos = mv.to
  const enemyDefenceMove = state
    .moves({ verbose: true })
    .find(mv => mv.to === takePos)

  state.undo()
  return decoratedMove(mv, canTakePiece && !enemyDefenceMove, {
    value: 90,
    meta: 'free piece'
  })
}

const findCastle = (mv, state) =>
  decoratedMove(mv, anyFromStringInOther('kq', mv.flags), {
    value: 75,
    meta: 'wow castle'
  })

const findPreventFreeStuffs = (mv, state) => {
  // If we move current move
  state.move(mv)
  const theyTakePiece = anyFromStringInOther('cep', mv.flags)
  const takePos = mv.to
  const canTakeBack = state
    .moves({ verbose: true })
    .find(mv => mv.to === takePos)
  state.undo()
  return decoratedMove(mv, theyTakePiece && !canTakeBack, {
    value: mv.value - 50,
    meta: `${mv.meta}, reduced because they take ${takePos}`
  })
}

const findEvOtherPawn = (mv, state) =>
  decoratedMove(
    mv,
    anyFromStringInOther('b', mv.flags) && mv.from.charCodeAt(0) % 2 === 0,
    {
      value: 40,
      meta: 'at least its a big leap for uneven pawn'
    }
  )

const findPieceThatLivesAtHome = (mv, state) =>
  decoratedMove(
    mv,
    parseInt(mv.from.charAt(1)) < 5 &&
      parseInt(mv.to.charAt(1)) > parseInt(mv.from.charAt(1)),
    {
      value: 29,
      meta: 'home alone'
    }
  )
const findPawn = (mv, state) =>
  decoratedMove(mv, mv.peice === 'b', { value: 30, meta: 'normal pawn' })

module.exports = color => moveman({ color, debug: false })
