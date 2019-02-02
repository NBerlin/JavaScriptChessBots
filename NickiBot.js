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
    if(this.color='w'){
      return whiteValue - blackValue
    }
    else{
      return blackValue -whiteValue
    }
    
  }
  testMoves(chessCopy){
    this.testTwoMoves(chessCopy);

  }
  testTwoMoves(chessCopy){
    let advBeforeMove = this.getAdvantage(chessCopy);
    let avaMoves = chessCopy.moves();
    let valueOfFirstMoves=avaMoves.map(move=>this.testFirstMoves(move,chessCopy,advBeforeMove))
    .map((v,i)=>({value:v,index:i}))
    .reduce((a,b)=>(a.value>=b.value?a:b));
    return valueOfFirstMoves;
    
  }
  testFirstMoves(move,chessCopy,advBeforeMove){
    chessCopy.move(move);
    if(chessCopy.in_checkmate()){
      return 1000000000000000;
    }
    let moves = chessCopy.moves()
    .map(move2=>this.testSecondMoves(move2,chessCopy,advBeforeMove))
    .reduce((a, b) =>(a<b ? a : b));
    chessCopy.undo();
    return moves;
  }
  testSecondMoves(move2,chessCopy,advBeforeMove){
    chessCopy.move(move2);
    let returnValue = (this.getAdvantage(chessCopy)-advBeforeMove);
    chessCopy.undo();
    return returnValue;
  }
  makeZeroValueMove(fen){

  }
  makeMove(chessCopy) {
    return chessCopy.moves()[this.testTwoMoves(chessCopy)['index']];
  }
}
const create = color => new NickiBot(color)
module.exports = create
