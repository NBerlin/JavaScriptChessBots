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
    if ((this.color = 'w')) {
      return whiteValue - blackValue
    }
    return blackValue - whiteValue
  }
  testMoves(chessMoves) {
    let ggchecker = this.checkCheckMate(chessMoves)
    if (ggchecker) {
      return ggchecker
    }
    chessMoves = this.setValuesOnMoves(chessMoves)
    let godMove = chessMoves.reduce(
      (obj1, obj2) =>
        obj1.rekursionValue >= obj2.rekursionValue ? obj1 : obj2,
      -1
    )
    if (godMove.rekursionValue > 0) {
      return godMove
    }
    return this.safeMove(chessMoves) || godMove
    //return (this.simpleCapture(chessMoves)||chessMoves[0]);
    // return this.testTwoMoves(chessCopy);
  }
  bestTradeMove(moves) {
    moves = moves.filter(move => this.bestTradeMoveHelp(move) != null)
  }
  bestTradeMoveHelp(move) {
    chess.move(move.san)
    move = chess.moves().filter(move => move.captured)
    if (move.length > 0)
      move.forEach(move => {
        move.rekursionValue = whoWinsCapture(move)
      })

    return move.reduce((move1, move2) =>
      move1.rekursionValue > move2.rekursionValue ? move1 : move2
    )
  }
  safeMove(moves) {
    moves = moves.filter(obj => this.safeMoveHelp(obj))
    return moves[Math.floor(Math.random() * moves.length)]
  }
  safeMoveHelp(move) {
    chess.move(move.san)
    move = chess.moves({ verbose: true })
    chess.undo()
    if (move.filter(move => move.captured).length > 0) {
      return false
    }
    return true
  }
  setValuesOnMoves(chessMoves) {
    let newChessMoves = chessMoves.map(move => ({
      ...move,
      pieceValue: pieceValues[move.piece],
      captureValue:
        (pieceValues[move.captured] || 0) +
        (0 + pieceValues[move.promotion] || 0),
      tradeValue:
        (pieceValues[move.captured] || 0) +
        (0 + pieceValues[move.promotion] || 0) -
        pieceValues[move.piece],
      rekursionValue: this.whoWinsCapture(move, pieceValues[move.captured] || 0)
    }))
    return newChessMoves
  }
  checkCheckMate(chessMoves) {
    chessMoves = chessMoves.filter(move => move.san.includes('#'))[0]
    if (chessMoves) {
      return chessMoves
    }
    return false
  }
  simpleCapture(chessMoves) {
    return (
      this.getFreePiece(chessMoves) ||
      this.pushAFuckingPawn(chessMoves) ||
      chessMoves[Math.floor(Math.random * chessMoves.length)]
    )
  }
  getFreePiece(chessMoves) {
    chessMoves = chessMoves
      .filter(moves => moves.captureValue > 0)
      .map(move => ({
        ...move,
        freePiece: this.freePiece(move)
      }))
      .reduce(
        (move1, move2) =>
          move1.captureValue > move2.captureValue ? move1 : move2,
        0
      )
    if (chessMoves.captureValue > 0) {
      return chessMoves
    }
    return null
  }
  freePiece(move) {
    chess.move(move.san)
    let chessMoves = chess.moves()
    chessMoves = chessMoves.filter(secondMove => secondMove.captured)
    chess.undo()
    if (chessMoves) {
      chessMoves.reduce(
        (firstMove, secondMove) =>
          pieceValues[firstMove.captured] > pieceValues[secondMove.captured]
            ? firstMove
            : secondMove,
        0
      )
      return move.captureValue - pieceValues[chessMoves.captured]
    }
    return move.captureValue
  }
  whoWinsCapture(move, initialTradeValue) {
    chess.move(move.san)
    let chessMoves = chess.moves({ verbose: true })
    chessMoves = chessMoves.filter(obj => obj.captured)
    if (chessMoves.length > 0) {
      chessMoves = chessMoves.reduce((obj1, obj2) =>
        pieceValues[obj1.captured] > pieceValues[obj2.captured] ? obj1 : obj2
      )
      if (!chessMoves.color === this.color) {
        initialTradeValue +=
          pieceValues[chessMoves.captured] +
          whoWinsCapture(chessMoves[0], initialTradeValue)
      } else {
        initialTradeValue +=
          this.whoWinsCapture(chessMoves, initialTradeValue) -
          pieceValues[chessMoves.captured]
      }
    }
    chess.undo()
    return initialTradeValue
  }
  pushAFuckingPawn(chessMoves) {
    chessMoves = chessMoves.filter(move => move.piece == 'p')
    return chessMoves[Math.floor(Math.random() * chessMoves.length)]
  }
  getTempMoves(move) {
    chess.move(move)
    let temp = chess.moves()
    chess.undo()
    return temp
  }
  makeMove(chessCopy) {
    chess = chessCopy

    let temp = this.testMoves(chessCopy.moves({ verbose: true }))
    return temp.san
  }
}
const create = color => new NickiBot(color)
module.exports = create
