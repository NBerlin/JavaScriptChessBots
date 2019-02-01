var Chess = require('chess.js').Chess
var chess = new Chess()
var pieceValues = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 40 }
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
  getPiecesOnBoard(board) {
    //Returns a array containing every piece on the board.

    return this.pieceSymbols.map(obj => board.get(obj)).filter(obj2 => obj2)
  }
  getAdvantage(board) {
    let piecesOnBoard = this.getPiecesOnBoard(board)
    let whitePieces = piecesOnBoard.filter(obj => obj.color === 'w')
    let blackPieces = piecesOnBoard.filter(obj => obj.color === 'b')
    whitePieces = whitePieces.map(piece => ({
      ...piece,
      value: pieceValues[piece.type]
    }))
    blackPieces = blackPieces.map(piece => ({
      ...piece,
      value: pieceValues[piece.type]
    }))
    let whiteValue = whitePieces.reduce(
      (firstValue, secondValue) => firstValue + secondValue.value,
      0
    )
    let blackValue = blackPieces.reduce(
      (bValue, b2Value) => bValue + b2Value.value,
      0
    )
    return whiteValue - blackValue
  }
  makeMove(fen) {
    chess.load(fen)
    let board = chess
    let bestMove = -1000
    const moves = board.moves()
    const currentAdvantage = this.getAdvantage(board)
    let bestMoveIndex = 0
    for (let i = 0; i < moves.length; i++) {
      chess.load(fen)
      let tempBoard = chess
      tempBoard.move(moves[i])
      let moveValue = this.getAdvantage(tempBoard) - currentAdvantage
      if (tempBoard.in_checkmate()) {
        bestMoveIndex = i
        break
      }

      if (moveValue > bestMove) {
        bestMove = moveValue
        bestMoveIndex = i
      }
    }

    chess.load(fen)

    if (bestMove === 0) {
      let allTheMoves = chess.moves()
      allTheMoves = allTheMoves.filter(word => word.length < 3)
      if (allTheMoves.length >= 1) {
        return allTheMoves[Math.floor(Math.random() * allTheMoves.length)]
      }
    }
    return chess.moves()[bestMoveIndex]
  }
}
module.exports = NickiBot
