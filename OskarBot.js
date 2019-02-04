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

const anyfromAinB = (A, B) =>
  A.map(item => B.includes(item)).reduce((acc, curr) => acc || curr, false)

const movesThatMatchFlags = (state, flagList) =>
  state
    .moves({ verbose: true })
    .filter(mv => anyfromAinB(flagList, mv.flags.split('')))

const moveThatsMateInOne = state =>
  state.moves().find(move => {
    state.move(move)
    const isDone = state.in_checkmate()
    state.undo()
    return isDone
  })

const canMateInOne = moveThatsMateInOne
const seeFreePiece = state =>
  movesThatMatchFlags(state, ['c', 'e', 'p']).find(move => {
    state.move(move)

    const takePos = move.to
    const enemyDefenceMove = state
      .moves({ verbose: true })
      .find(mv => mv.to === takePos)

    state.undo()
    return enemyDefenceMove
  })
const takeFreePiece = seeFreePiece

const seeFreeCheck = state =>
  state.moves({ verbose: true }).find(move => {
    state.move(move)
    const check = state.in_check()

    const checkPosition = move.to
    const enemyDefenceMove = state
      .moves({ verbose: true })
      .find(mv => mv.to === checkPosition)
    // TODO check if worth anyway bcus points
    // TODO, lockcheck?
    // TODO not only do the first move
    // TODO for debug, print list of possible moves and their kategory

    state.undo() // early return made state bad
    return check && !enemyDefenceMove
  })

const notStuckInLoop = () => true
const doFreeCheck = seeFreeCheck
// Todo pusha moves till lista mby ? och sen sortera listan efter värde?

const moveman = ({ color = 'w', name = 'oskar' }) => ({
  makeMove: chess => {
    const justMakeTheBestMove = () => {
      const moves = movesThatMatchFlags(chess, ['c', 'e', 'p'])
      if (moves.length !== 0) {
        return moves[Math.floor(Math.random() * moves.length)]
      } else {
        const pawns = chess
          .moves({ verbose: true })
          .filter(m => m.piece === 'p')
        if (pawns.length > 0) {
          return pawns[Math.floor(Math.random() * pawns.length)]
        }
        return chess.moves()[0]
      }
    }

    if (canMateInOne(chess)) {
      return moveThatsMateInOne(chess)
    }
    if (seeFreePiece(chess)) {
      return takeFreePiece(chess)
    }

    if (seeFreeCheck(chess) && notStuckInLoop(chess)) {
      return doFreeCheck(chess)
    }

    return justMakeTheBestMove()
  },
  name: () => name
})

module.exports = color => moveman({ color })
