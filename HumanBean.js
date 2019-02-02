const readline = require('readline-sync')
const moveman = ({ color = 'w', name = 'human' }) => ({
  makeMove: chess => {
    const moves = chess.moves()
    console.log(chess.ascii())
    console.log('available moves', moves)
    let move = readline.question('Pick a move\n')
    while (!moves.includes(move)) {
      move = readline.question(
        'that is not valid, please pick something else\n'
      )
    }
    return move
  },
  name: () => name
})

module.exports = color => moveman({ color })
