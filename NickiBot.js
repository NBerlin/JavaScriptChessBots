var Chess = require('chess.js').Chess;

class NickiBot{
    constructor(color){
        this.color=color;
    }
    name(){
        return "NickiBot";
    }
    makeMove(board){

        return board.moves()[0];
        
    }
};
module.exports = NickiBot;