const points = { p: 4, n: 12, b: 12, r: 20, q: 36, k: 120 }

class KlajjanBot {
  constructor(color) {
    this.color = color
  }

  name() {
    return 'KlajjanBot'
  }

  simpleMoveValue(move) {
    return (
      (move.captured ? points[move.captured] : 0) +
      (move.promotion ? points[move.promotion] - points['p'] : 0) +
      (move.flags == 'b' ? 1 : 0) +
      (move.flags == 'q' ? 2 : 0) +
      (move.flags == 'k' ? 3 : 0)
    )
  }

  moveValue(chess, move) {
    let value = this.simpleMoveValue(move)

    chess.move(move.san)
    if (chess.in_checkmate()) {
      value += 100000
    } else if (chess.in_draw()) {
      value -= 10000
    } else {
      value -= Math.max(
        ...chess
          .moves({ verbose: true })
          .map(tMove =>
            tMove.captured && tMove.to == move.to
              ? this.moveValue(chess, tMove)
              : this.simpleMoveValue(tMove)
          )
      )
    }
    chess.undo()

    return value
  }

  reducerMethod(list, move) {
    if (list.length == 0 || list[0].value - move.value < 0) {
      return [move]
    } else if (list[0].value - move.value == 0) {
      return list.concat(move)
    }

    return list
  }

  kingFilter(moves) {
    return moves.every(move => move.piece == 'k')
      ? moves
      : moves.filter(move => move.piece != 'k')
  }

  moves(chess) {
    return chess
      .moves({ verbose: true })
      .map(move => ({ san: move.san, value: this.moveValue(chess, move) }))
  }

  makeMove(chess) {
    const filtered_moves = this.kingFilter(
      this.moves(chess).reduce(
        (list, move) => this.reducerMethod(list, move),
        []
      )
    )

    return filtered_moves[Math.floor(filtered_moves.length * Math.random())].san
  }
}

const create = color => new KlajjanBot(color)
module.exports = create
