const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const nums = [1, 2, 3, 4, 5, 6, 7, 8]
const points = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 45 }
const opponent = { w: 'b', b: 'w' }
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

const movesThatGainPoints = (state, color) => {
  const curr = total(state, color)
  return state.moves().filter(mv => {
    state.move(mv)
    const tot = total(state, color)
    state.undo()
    return tot > curr
  })
}

const moveThatsMateInOne = state =>
  state.moves().find(move => {
    state.move(move)
    const isDone = state.in_checkmate()
    state.undo()
    return isDone
  })

const canMateInOne = moveThatsMateInOne
const seeFreePiece = () => false

const moveman = ({ color = 'w', name = 'oskar' }) => ({
  makeMove: chess => {
    const justMakeTheBestMove = () => {
      const moves = movesThatGainPoints(chess, color)
      if (moves.length !== 0) {
        return moves[Math.floor(Math.random() * moves.length)]
      } else {
        const pawns = chess.moves().filter(m => m.length < 3)
        if (pawns.length > 0) {
          return pawns[Math.floor(Math.random() * pawns.length)]
        }
        return chess.moves()[0]
      }
    }

    if (canMateInOne(chess)) {
      return moveThatsMateInOne(chess)
    }

    if (seeFreePiece()) {
      return takeFreePiece()
    }

    return justMakeTheBestMove()
  },
  name: () => name
})

module.exports = color => moveman({ color })
