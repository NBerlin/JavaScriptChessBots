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
  testMoves(fen){
    chess.load(fen);
    const currentAdvantage = this.getAdvantage(chess);
    let bestMoveCurrently =-10;
    let bestMoveIndexCurrently =0;
    let movesAva = chess.moves();
    for(let index =0;index<movesAva.length;index++){
      chess.load(fen)
      chess.move(movesAva[index])
      let moveValue = (this.getAdvantage(chess)-currentAdvantage)
      if (chess.in_checkmate()) {
        return [index,10000000000];
      }
      if (moveValue > bestMoveCurrently) {
        let tempFen=chess.fen();
        let tempMoves=chess.moves();
        let secondCurrentAdvantage=this.getAdvantage(chess);
      
        let biggestSecondMoveValue=0;
        for(let i = 0;i<tempMoves.length;i++){
          chess.load(tempFen)
          chess.move(tempMoves[i]);
          let secondMoveValue=((this.getAdvantage(chess)-secondCurrentAdvantage)+moveValue);
          if(secondMoveValue<biggestSecondMoveValue){
            biggestSecondMoveValue=secondMoveValue;
          }
        }
        if(biggestSecondMoveValue>bestMoveCurrently){
          bestMoveCurrently = moveValue;
          bestMoveIndexCurrently = index;
        }
    
      }
    }
    console.log(bestMoveCurrently)
    return [bestMoveIndexCurrently,bestMoveCurrently];

  }
  makeZeroValueMove(fen){
    chess.load(fen);
    let allTheMoves = chess.moves()
    allTheMoves = allTheMoves.filter(word => word.length < 3)
    if (allTheMoves.length >= 1) {
      return allTheMoves[Math.floor(Math.random() * allTheMoves.length)]
    }
    return chess.moves()[Math.floor(Math.random() * chess.moves().length)]
  }
  makeMove(chessCopy) {
    let fen = chessCopy.fen();
    let bestMove=this.testMoves(fen);
    return chessCopy.moves()[bestMove[0]]
  }
}
const create = color => new NickiBot(color)
module.exports = create
