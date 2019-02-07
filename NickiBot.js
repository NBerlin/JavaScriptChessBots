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
    return this.pieceSymbols.map(obj => chess.get(obj)).filter(obj2 => obj2);
  }
getAdvantage(){
    let pieces=this.getPiecesOnBoard()
    .reduce((obj1,obj2)=>{
      if(obj2.color===this.color){
        return obj1+pieceValues[obj2.type];
      }
      return obj1-pieceValues[obj2.type];
    },0);
    return pieces;
  }

testMoves(chessMoves){
    let ggchecker=this.checkCheckMate(chessMoves);
    if(ggchecker){
        return ggchecker;
    }
    chessMoves=this.setValuesOnMoves(chessMoves);
    console.log(chessMoves)
    return chessMoves.reduce((obj1,obj2)=>obj1.rekursionValue>=obj2.rekursionValue?obj1:obj2,-1);
  }
  
  setValuesOnMoves(chessMoves){
    let newChessMoves=chessMoves
    .map(move=>({
      ...move,
      rekursionValue:this.rekursionMove(move,1)
  }));
  return newChessMoves;
}
checkCheckMate(chessMoves){
  chessMoves = chessMoves.filter(move=>move.san.includes("#"))[0];
 if(chessMoves){
  return chessMoves
 }
  return false;
}
  whoWinsCapture(move,initialTradeValue){ 
    chess.move(move.san)
    let chessMoves=chess.moves({verbose:true});
    chessMoves=chessMoves.filter(obj=>obj.captured);
    if(chessMoves.length>0){
      chessMoves=chessMoves.reduce((obj1,obj2)=>pieceValues[obj1.captured]>pieceValues[obj2.captured]?obj1:obj2);
      if(!chessMoves.color===this.color){
      initialTradeValue+=pieceValues[chessMoves.captured]+whoWinsCapture(chessMoves[0],initialTradeValue)

      }
      else{
        initialTradeValue+=this.whoWinsCapture(chessMoves,initialTradeValue)-pieceValues[chessMoves.captured]
      }
    }
    chess.undo();
    return initialTradeValue;
}
rekursionMove(move,depth,me){
  chess.move(move.san);
  let moves = chess.moves({verbose:true})
  if(depth===0){
    return this.getAdvantage();
  }
  if(me){
    var bestMove=-9999;
  }
  else{
    var bestMove=9999;
  }
  
  for(var i =0;i<moves.length;i++){
      if(me){
        bestMove= Math.max(bestMove,this.rekursionMove(moves[i],depth-1,!me));
      }
      else{
        bestMove= Math.min(bestMove,this.rekursionMove(moves[i],depth-1,!me));
      }
      
    
  }
  chess.undo();
  return bestMove;
}
  
  makeMove(chessCopy) {
    chess=chessCopy;
    
    let temp = this.testMoves(chessCopy.moves({verbose:true}));
    return temp.san;
  }
}
const create = color => new NickiBot(color)
module.exports = create
