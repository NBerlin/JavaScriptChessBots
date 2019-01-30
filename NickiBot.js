var Chess = require('chess.js').Chess;
var pieceValues = {p:1,n:3,b:3,r:5,q:9,k:10000} 
class NickiBot{
    constructor(color){
        this.color=color;
        this.pieceSymbols = this.getPieceSymbols();
        
    }
    name(){
        return "NickiBot";
    }
    getPieceSymbols(){
         const symbols=["a","b","c","d","e","f","g","h"];
         const numbers=[1,2,3,4,5,6,7,8]
        return symbols.reduce((full, curr) => full.concat(numbers.map(n => curr+n)),[])
    }
    getPiecesOnBoard(board){

        //Returns a array containing every piece on the board.
       
        return this.pieceSymbols.map(obj=>board.get(obj)).filter(obj2=>obj2);
        
    }
    getAdvantage(board){
        let piecesOnBoard = this.getPiecesOnBoard(board);
        let whitePieces = piecesOnBoard.filter(obj=>obj.color==='w');
        let blackPieces = piecesOnBoard.filter(obj=>obj.color==='b'); 
        whitePieces = whitePieces.map(piece=> ({...piece, value: pieceValues[piece.type] }))
        blackPieces = blackPieces.map(piece=> ({...piece, value: pieceValues[piece.type] }))
        let whiteValue=whitePieces.reduce((firstValue,secondValue)=>firstValue+secondValue.value,0);
        let blackValue=blackPieces.reduce((bValue,b2Value)=>bValue+b2Value.value,0);
        return whiteValue-blackValue;
    }   
    makeMove(board){
        
        let bestMove=-1000;
        const moves=board.moves();
        const currentAdvantage = this.getAdvantage(board);
        let bestMoveIndex=0;
        for(let i =0;i<moves.length;i++){
            let tempBoard=board;
            tempBoard.move(moves[i]);
            const moveValue=this.getAdvantage(tempBoard)-currentAdvantage;
            if(tempBoard.in_check()){
                bestMoveIndex=i;
                break;
            }
            else if(moveValue>bestMove){
                bestMove=moveValue
                bestMoveIndex=i;
            }
            
        }
        return board.moves()[bestMoveIndex];
        
    }
};
module.exports = NickiBot;