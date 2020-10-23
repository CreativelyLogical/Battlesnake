const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)

app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))


function handleIndex(request, response) {
  let battlesnakeInfo = {
    apiversion: '1',
    author: 'CreativelyLogical',
    color: '#0735ad',
    head: 'default',
    tail: 'default'
  }
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  let gameData = request.body

  console.log('--------------- START ---------------')
  response.status(200).send('ok')
}

/*
  head: Next coordinate of the snake's head based on move
  move: The move that will be examined to see if it will lead to a collision
  prevMove: The previous move of the snake
  board: Data about the game board (contains info about the board's height, width, etc...)

  Returns TRUE if the move will lead to a collision. Returns FALSE otherwise
*/
function willCollide(head, move , prevMove, board) {
  // get the height & width of the game board
  let boardHeight = board.height;
  let boardWidth = board.width;

  // opposite moves are illegal.
  let oppositeMoves = new Map();

  oppositeMoves['up'] = 'down';
  oppositeMoves['down'] = 'up';
  oppositeMoves['left'] = 'right';
  oppositeMoves['right'] = 'left';

  // eliminate the possibility of an opposite move
  if (oppositeMoves[prevMove] === move) {
    // If the current move is an opposite move of the previous move,
    // then a collision with the self will occur
    return true;
  }

  // eliminate collisions with the board
  if (head.x < 0 || head.x > boardWidth - 1 || head.y < 0 || head.y > boardHeight - 1) {
    // if the new head coordinates go out of bounds with either the x OR y axis, a collision will occur
    return true;
  }

  return false;

}

function handleMove(request, response) {
  let gameData = request.body;

  // console.log(gameData);
  let prevMove = gameData.you.shout;
  let boardData = gameData.board;
  let head = gameData.you.head;
  
  let turn = gameData.turn;

  // Declare what the next coordinate of the head will be based on the move
  let nextHeadCoordinates = new Map();
  nextHeadCoordinates['up'] = {
    x: head.x,
    y: head.y + 1,
  };
  nextHeadCoordinates['down'] = {
    x: head.x,
    y: head.y - 1,
  };
  nextHeadCoordinates['left'] = {
    x: head.x - 1,
    y: head.y,
  };
  nextHeadCoordinates['right'] = {
    x: head.x + 1,
    y: head.y,
  };


  let possibleMoves = ['up', 'down', 'left', 'right'];
  // var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  let legalMoves = possibleMoves.filter(move => !willCollide(nextHeadCoordinates[move], move, prevMove, boardData));
  
  let move = legalMoves[Math.floor(Math.random() * legalMoves.length)];

  console.log(`[${legalMoves}]`);

  console.log('MOVE: ' + move + '  TURN: ' + turn);
  response.status(200).send({
    move: move,
    shout: move
  });
}

function handleEnd(request, response) {
  let gameData = request.body;

  console.log('--------------- END ---------------');
  response.status(200).send('ok');
}
