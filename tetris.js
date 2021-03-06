// code to access the canvas...calling it by its id
const canvas = document.getElementById('tetris');
// get the context out
const context = canvas.getContext('2d');
// scaling works as zooming a tetris piece
context.scale(20,20);


// data structure for the tetris pieces
// start with a T in 2d matrix
// const matrix =[  
//     [0, 0, 0],
//     [1, 1, 1],
//     [0, 1, 0],
// ];

function arenaClear(){
    let rowCount = 1;
  outer: for(let y = arena.length - 1; y < 0; y--){
        for( let x = 0; x < arena[y].length; x++){
            if(arena[y][x] === 0){
                continue outer;
            }
        }

      const row = arena.splice(y, 1)[0].fill(0);
       arena.unshift(row);
       y++;

       player.score += rowCount * 10;
       rowCount *=  2;

    }
}

 function collide(arena, player){
    const [m,o] = [player.matrix, player.pos];
    for(let y = 0; y < m.length; y++){
     for(let x = 0; x < m[y]. length; x++){
         if(m[y][x] !== 0 &&
            (arena[y +o.y]&&
            arena[y + o.y][x + o.x]) !==0){
                return true;
            }
     }
 }
 return false; 
    }

function createMatrix(w, h){
    const matrix = [];
    while (h --){
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}
 
function createPiece(type){
    if(type ==='T'){
        return  [  
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    }else if(type === 'O'){
        return  [  
            [2, 2],
            [2, 2],
        ];
    }else if(type === 'L'){
        return  [  
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 31],
        ];
    }else if(type === 'J'){
        return  [  
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    }else if(type === 'I'){
        return  [  
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    }else if(type === 'S'){
        return  [  
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    }
    else if(type === 'Z'){
        return  [  
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

function draw(){
 // paint the context to a black color
context.fillStyle = '#000';
 // fill it as a rectangle
context.fillRect(0,0,canvas.width,canvas.height);

    drawMatrix(arena,{x:0, y:0} );
    drawMatrix(player.matrix, player.pos);
}
// embody it in a function
function drawMatrix(matrix, offset, x,y){
    // drawing our first piece..get the row and the y index
    matrix.forEach((row, y)=>  {
        // get the value and the x index
        row.forEach((value, x) => {
            // if it is not 0 then we draw  else we skip it
            if(value !== 0){
                context.fillStyle = colors[value];
                // get a tiny piece of T
                context.fillRect (x + offset.x,
                y + offset.y,
            1, 1);
            }
        });
    });
}

function merge(arena, player){
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0){
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop(){
    player.pos.y++;
    if(collide(arena, player)){
         player.pos.y --;
         merge(arena, player);
         playerReset();
        //  player.pos.y = 0;
        arenaClear();
        updateScore();
      }
    
    dropCounter = 0;
}

function playerMove(dir){
    player.pos.x += dir;
    if(collide(arena, player)){
        player.pos.x  -= dir;

    }
}

function playerReset(){
    const pieces =  'TOLJISZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0]. length / 2 | 0) -
                    (player.matrix[0]. length / 2 | 0);
 
    if(collide(arena, player)){
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir){
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while(collide(arena, player)){
        player.pos.x += offset;
        offset =  -(offset + (offset > 0 ? 1 : -1));
        if(offset > player.matrix[0].length){
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, dir){
    for(let y = 0; y < matrix.length; y++){
        for(let x = 0; x < y; x++){
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    if (dir > 0){
        matrix.forEach(row => row.reverse());
    }
    else{
         matrix.reverse();
    }
}
function updateScore(){
    document.getElementById('score').innerText = player.score;
}


let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0){
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if(dropCounter > dropInterval){
        // player.pos.y++;
        // dropCounter = 0;
      playerDrop();
    }
    draw();
 requestAnimationFrame(update);
}

const colors = [
    null,
    'blue',
    'red',
    'violet',
    'green',
    'purple',
    'orange',
    'pink',
];
   

const arena = createMatrix(12, 20);
// console.log(field),console.table(field);


// player structure
const player = {
    // pos: {x: 5, y: 5},
    pos: {x: 0, y: 0},
    // matrix : createPiece('T'),
    matrix : null,
    score : 0,
}

document.addEventListener('keydown',event =>{
    // console.log(event);
    if(event.keyCode === 37){
         playerMove(-1);
        //player.pos.x --;
    }else if(event.keyCode === 39){
       playerMove(+1);
        //player.pos.x ++;
    }else if(event.keyCode === 40){ 
        playerDrop();
    }
    else if(event.keyCode === 81){
        playerRotate(-1); 
    }
    else if(event.keyCode === 87){
        playerRotate(1); 
    }
}); 
 
playerReset();
updateScore();
update();
