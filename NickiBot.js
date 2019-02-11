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


    chessMoves = this.setValuesOnMoves(chessMoves);
    return chessMoves.reduce((obj1, obj2) =>
    obj1.rekursionValue >= obj2.rekursionValue ? obj1 : obj2
  )
  }
  setValuesOnMoves(chessMoves) {
    let newChessMoves = chessMoves.map(move => ({
      ...move,
      tradeValue: this.tradeValue(move)
    }));
    return newChessMoves
  }
  tradeValue(move){
    let value = pieceValues[move.captured];
    chess.move(move.san)
    let chessMoves=chess.moves({verbose:true})
    .filter(obj1=>obj1.captured);
    if(chessMoves){
      if(chess.turn()==this.color){
        value-=Math.max(chessMoves.map(obj1=>tradeValue(obj1)))
      }
      else{
        value+=Math.max(chessMoves.map(obj1=>tradeValue(obj1)))
      }

      
    }
  }

}
const create = color => new NickiBot(color)
module.exports = create
