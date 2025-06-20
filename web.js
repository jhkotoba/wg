const express = require('express');
const path    = require('path');
const http    = require('http');
const { Server } = require('socket.io');

const app  = express();
const port = process.env.PORT || 3000;

/* 정적 파일(public) 제공 */
app.use(express.static(__dirname));
app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));

const server = http.createServer(app);
const io     = new Server(server);

/* ───── 게임 상태 ───── */
const SIZE  = 15;
const rooms = new Map();   // roomId → { board, current, players:{black,white}, finished }

const emptyBoard = () => Array.from({length:SIZE},()=>Array(SIZE).fill(null));

function getRoomsList(){
  const list=[];
  for(const [id,game] of rooms.entries()){
    if(game.finished) continue;
    list.push({id, players:Object.keys(game.players).length});
  }
  return list;
}
function broadcastRooms(){ io.emit('roomsList', getRoomsList()); }

function isWin(board,row,col){
  const color=board[row][col];
  const dirs=[[1,0],[0,1],[1,1],[1,-1]];
  for(const [dr,dc] of dirs){
    let cnt=1; let r=row+dr,c=col+dc;
    while(r>=0&&r<SIZE&&c>=0&&c<SIZE&&board[r][c]===color){cnt++;r+=dr;c+=dc;}
    r=row-dr; c=col-dc;
    while(r>=0&&r<SIZE&&c>=0&&c<SIZE&&board[r][c]===color){cnt++;r-=dr;c-=dc;}
    if(cnt>=5) return true;
  }
  return false;
}

io.on('connection', socket=>{
  /* 로비 최초 방 목록 전달 */
  socket.emit('roomsList', getRoomsList());

  socket.on('login', nick=>{ socket.nickname = nick || `Guest-${socket.id.slice(0,4)}`; });

  /* 방 생성 */
  socket.on('createRoom', roomId=>{
    if(rooms.has(roomId)) return socket.emit('errorMsg','이미 존재하는 방');
    socket.join(roomId);
    rooms.set(roomId, { board:emptyBoard(), current:'black', players:{black:socket.id}, finished:false });
    socket.emit('roomCreated', roomId);
    broadcastRooms();
  });

  /* 방 입장 */
  socket.on('joinRoom', roomId=>{
    const game=rooms.get(roomId);
    if(!game) return socket.emit('errorMsg','존재하지 않는 방');
    if(game.players.white) return socket.emit('errorMsg','방이 가득 찼습니다');
    socket.join(roomId);
    game.players.white=socket.id;

    // 두 플레이어에게 init
    io.to(game.players.black).emit('init',{yourColor:'black',current:'black'});
    io.to(game.players.white).emit('init',{yourColor:'white',current:'black'});
    broadcastRooms();
  });

  /* 돌 놓기 */
  socket.on('place',({row,col})=>{
    const roomId=[...socket.rooms].find(r=>rooms.has(r));
    if(!roomId) return;
    const game=rooms.get(roomId);
    if(!game||game.finished) return;

    const myColor = (game.players.black===socket.id)?'black':(game.players.white===socket.id?'white':null);
    if(!myColor||myColor!==game.current) return;
    if(game.board[row][col]!==null) return;

    game.board[row][col]=myColor;

    if(isWin(game.board,row,col)){
      game.finished=true;
      io.to(roomId).emit('placed',{row,col,color:myColor,next:null});
      io.to(roomId).emit('gameOver',{winner:myColor});
      rooms.delete(roomId);       // 방 종료
      broadcastRooms();
      return;
    }

    game.current = myColor==='black'?'white':'black';
    io.to(roomId).emit('placed',{row,col,color:myColor,next:game.current});
  });

  /* 연결 종료 */
  socket.on('disconnect',()=>{
    for(const [roomId,game] of rooms.entries()){
      if(game.players.black===socket.id||game.players.white===socket.id){
        io.to(roomId).emit('opponentLeft');
        rooms.delete(roomId);
        broadcastRooms();
        break;
      }
    }
  });
});

server.listen(port, ()=>console.log(`✔️ 서버 실행: http://localhost:${port}/`));
