var Chess = require('chess.js').Chess
var chess = new Chess()
var pieceValues = { p: 100, n: 320, b: 350, r: 500, q: 900, k: 20000 }
var symbolTranslator = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 }
const pawnMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0]
]
const knightMatrix = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50]
]
const bishopMatrix = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20]
]
const rookMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0]
]
const queenMatrix = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20]
]
const kingMatrixWhite = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20]
]
class NickiBot {
  constructor(color) {
    this.color = color
    this.pieceSymbols = this.getPieceSymbols()
  }
  name() {
    return 'NickiBot'
  }
  getPieceSymbols() {
    const symbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8]
    return symbols.reduce(
      (full, curr) => full.concat(numbers.map(n => curr + n)),
      []
    )
  }
  getPiecesOnBoard() {
    return this.pieceSymbols.map(obj => chess.get(obj)).filter(obj2 => obj2)
  }
  getAdvantage() {
    let pieces = this.getPiecesOnBoard()
      .map(obj1 =>
        obj1.color === this.color
          ? pieceValues[obj1.type]
          : -pieceValues[obj1.type]
      )
      .reduce((obj1, obj2) => obj1 + obj2)

    return pieces
  }

  checkCheckMate(chessMoves) {
    chessMoves = chessMoves.filter(move => move.san.includes('#'))[0]
    if (chessMoves) {
      return chessMoves
    }
    return false
  }
  rekursionMove(move, depth) {
    chess.move(move.san)
    let moves = chess.moves({ verbose: true })
    if (depth === 0) {
      let score = this.getAdvantage()
      chess.undo()
      return score
    }
    if (moves.length > 0) {
      if (chess.turn() === this.color) {
        var bestMove = -9999
      } else {
        var bestMove = 9999
      }
    }
    if (chess.in_checkmate()) {
      chess.undo()
      if (chess.turn() === this.color) {
        return -9999999
      } else {
        return 1000000
      }
    }

    for (var i = 0; i < moves.length; i++) {
      if (moves[i].color === this.color) {
        bestMove = Math.max(bestMove, this.rekursionMove(moves[i], depth - 1))
      } else {
        if (chess.in_checkmate()) {
          chess.undo()
          return 999999
        }
        bestMove = Math.min(bestMove, this.rekursionMove(moves[i], depth - 1))
      }
    }
    chess.undo()
    return bestMove
  }

  makeMove(chessCopy) {
    chess = chessCopy
    let temp = this.testMoves(chessCopy.moves({ verbose: true }))
    return temp.san
  }
  testMoves(chessMoves) {
    let ggchecker = this.checkCheckMate(chessMoves)
    if (ggchecker) {
      return ggchecker
    }

    chessMoves = this.setValuesOnMoves(chessMoves)
    return chessMoves.reduce((obj1, obj2) =>
      obj1.tradeValue >= obj2.tradeValue ? obj1 : obj2
    )
  }
  setValuesOnMoves(chessMoves) {
    let newChessMoves = chessMoves.map(move => ({
      ...move,
      tradeValue: this.tradeValue(move, this.moveValue(move), 0)
    }))
    return newChessMoves
  }
  moveValue(move) {
    let values = move.to.split('')
    let secondValue = parseInt(values[1])
    values = parseInt(symbolTranslator[values[0]])
    let values2 = move.from.split('')
    let secondValue2 = parseInt(values2[1])
    values2 = parseInt(symbolTranslator[values2[0]])
    switch (move.piece) {
      case 'p':
        if (this.color == 'w') {
          return (
            pawnMatrix[8 - secondValue][values] -
            pawnMatrix[8 - secondValue2][values2]
          )
        } else {
          return (
            pawnMatrix[secondValue - 1][8 - values] -
            pawnMatrix[secondValue2 - 1][values2 + 8]
          )
        }

      case 'n':
        if (this.color == 'w') {
          return (
            knightMatrix[8 - secondValue][values] -
            knightMatrix[8 - secondValue2][values2]
          )
        } else {
          return (
            knightMatrix[secondValue - 1][8 - values] -
            knightMatrix[secondValue2 - 1][values2 + 8]
          )
        }

      case 'b':
        if (this.color == 'w') {
          return (
            bishopMatrix[8 - secondValue][values] -
            bishopMatrix[8 - secondValue2][values2]
          )
        } else {
          return (
            bishopMatrix[secondValue - 1][8 - values] -
            bishopMatrix[secondValue2 - 1][values2 + 8]
          )
        }

      case 'r':
        if (this.color == 'w') {
          return (
            rookMatrix[8 - secondValue][values] -
            rookMatrix[8 - secondValue2][values2]
          )
        } else {
          return (
            rookMatrix[secondValue - 1][8 - values] -
            rookMatrix[secondValue2 - 1][values2 + 8]
          )
        }

      case 'q':
        if (this.color == 'w') {
          return (
            queenMatrix[8 - secondValue][values] -
            queenMatrix[8 - secondValue2][values2]
          )
        } else {
          return (
            queenMatrix[secondValue - 1][8 - values] -
            queenMatrix[secondValue2 - 1][values2 + 8]
          )
        }

      case 'k':
        if (this.color == 'w') {
          return (
            kingMatrixWhite[8 - secondValue][values - 1] -
            kingMatrixWhite[8 - secondValue2][values2 - 1]
          )
        } else {
          return (
            kingMatrixWhite[secondValue - 1][8 - values] -
            kingMatrixWhite[secondValue2 - 1][values2 + 8]
          )
        }
    }
  }
  tradeValue(move, value, depth) {
    if (move.color === this.color) {
      value += pieceValues[move.captured] || 0
    } else {
      value = value - pieceValues[move.captured] || 0
    }

    chess.move(move.san)
    if (chess.turn() == this.color) {
      if (chess.in_checkmate()) {
        chess.undo()

        return -10000000
      }
    } else {
      if (chess.in_checkmate()) {
        chess.undo()

        return 100000
      }
    }
    let chessMoves = chess.moves({ verbose: true })
    let ggcheck = this.checkCheckMate(chessMoves)
    if (ggcheck) {
      if (ggcheck.color === this.color) {
        chess.undo()
        return 100000
      } else {
        chess.undo()
        return -100000000
      }
    }
    chessMoves = chessMoves.filter(obj1 => obj1.captured)

    if (chessMoves && depth < 2) {
      if (chess.turn() == this.color) {
        value += chessMoves
          .map(obj1 => this.tradeValue(obj1, value, depth + 1))
          .reduce((obj1, obj2) => (obj1 > obj2 ? obj1 : obj2), 0)
      } else {
        value += chessMoves
          .map(obj1 => this.tradeValue(obj1, value, depth + 1))
          .reduce((obj1, obj2) => (obj1 < obj2 ? obj1 : obj2), 0)
      }
    }
    chess.undo()
    return value
  }
}
const create = color => new NickiBot(color)
module.exports = create
