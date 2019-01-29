var Chess = require('chess.js').Chess;
var pieceSymbols=[];
class NickiBot{
    constructor(color){
        this.color=color;
        this.getPieceSymbols();
    }
    name(){
        return "NickiBot";
    }
    getPieceSymbols(){
         const symbols=["a","b","c","d","e","f","g","h"];
         const numbers=[1,2,3,4,5,6,7,8]
        symbols.forEach(obj=>numbers.forEach(nmb=>pieceSymbols.push(obj+nmb)));
    }
    getPiecesOnBoard(board){

        //why no work
        console.log(board.get('a1'));
        console.log(pieceSymbols.forEach(obj=>board.get(obj)));
    }
    makeMove(board){
        
        let bestMove=-1;
        const moves=board.moves();
        this.getPiecesOnBoard(board);
        for(let i =0;i<moves.length;i++){
            
        }
        
    }
};
module.exports = NickiBot;