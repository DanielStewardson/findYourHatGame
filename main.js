const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this._field = field;
    this.y = 0;
    this.x = 0;
    this._field[this.y][this.x] = pathCharacter;
    this.message;
  }
//------------------------start game----------------------//
  startGame() {
    let playing = true;   

    while (playing) {
      this.print(this._field);
      if (this.message) console.log(this.message);
      this.message = false;
      console.log('Which way do you want to move?');
      this.move();
      
    if (this._field[this.y][this.x] === hat) {
      console.log('---- Good job! You found the hat! ----');
      console.log('\n');
      playing = false;
      playGame();
    } else if (this._field[this.y][this.x] === hole) {
      console.log('---- Wrong step! You fell down a hole! ----')
      console.log('\n');
      playing = false;
      playGame();
    } else {
      this._field[this.y][this.x] = pathCharacter;
      };
    };
  }
//------------------------move----------------------//
//------If boundary of field hit alert and re prompt-----//
  move() {
    const move = prompt('Up, Down, Left or Right? ').toUpperCase();

    if(move === 'RIGHT' || move === 'R') {
        if (this.x === this._field[this.y].length -1) {
          this.message = ('You can\'t go any further to the right!');
        } else { 
          this._field[this.y][this.x] = fieldCharacter;
          this.x += 1; }
        } else if (move === 'LEFT' || move === 'L') {
        if (this.x === 0) {
          this.message = ('You can\'t go any further to the left!');
        } else { 
          this._field[this.y][this.x] = fieldCharacter;
          this.x -= 1; }
        } else if (move === 'DOWN' || move === 'D') {
        if (this.y === this._field.length-1) {
          this.message = ('You can\'t go down any further!');
        } else { 
          this._field[this.y][this.x] = fieldCharacter;
          this.y += 1; }
        } else if (move === 'UP' || move === 'U') {
        if (this.y === 0) {
          this.message = ('You can\'t go up any further!');
        } else { 
          this._field[this.y][this.x] = fieldCharacter;
          this.y -= 1; }
    };
  }
//------------------------print field to console---------------------//
  print() {
    console.log('\n');
    for(let row of this._field) {
      console.log(row.join(''));
    };
  }
//------------------------generate field------------------------//
  static generateField(fieldSize, numHoles) {
    let newField = [];
    let height;
    let width;
    let holes = numHoles;

    switch (fieldSize) {
      case 'LARGE': 
        height = 20;
        width = 30;
        break;
      case 'MEDIUM': 
        height = 10;
        width = 20;
        break;
      case 'SMALL': 
        height = 5;
        width = 10;
        break;
    }
    
    for (let i = 0; i < height; i++) {
      newField.push([]);
      for (let j = 0; j < width; j++) {
          newField[i].push(fieldCharacter)
      };
    };
//------------------place hat-----------------//
    let hatY;
    let hatX;
    do {
      hatY = Math.floor(Math.random()*height);
      hatX = Math.floor(Math.random()*width);
//------------------place hat a minimum distance from start point-----------------//
      } while (hatY + hatX >= 0 && hatY + hatX < (height+width)/2);
    newField[hatY][hatX] = hat;

//----------------place holes-----------------//
//--------Take level selected and set amount of traps--------//
    holes = Math.floor((height*width) / 18 * holes);

    for (let i = holes; i > 0; i--) {
      let holeY = 0;
      let holeX = 0;
      while (newField[holeY][holeX] != fieldCharacter || holeY+holeX === 0) {
        holeY = Math.floor(Math.random()*height);
        holeX = Math.floor(Math.random()*width);
        };
      newField[holeY][holeX] = hole;
    };
    return newField;
  }
  //------------------------validate field to check if completable--------------------------------//
  //--Copied this method and function as was not ready but understand it now added --//
  isValidField() {
    let testField = [...this._field];
    let wasHere = [];

    for(let row = 0; row < testField.length; row++){
        let newLine = [];
        for(let col = 0; col < testField[0].length; col++){
            newLine.push(false);
        };
        wasHere.push([...newLine]);
      };
//---------------------loops inside itself-----------------------------------//
    function findPath(y, x) {
        if(testField[y][x] === hat)
            return true;
        if(testField[y][x] === hole || wasHere[y][x])
            return false;

        wasHere[y][x] = true;

        if(y != 0){
            if(findPath(y-1, x)){
                return true;
            }
        };
        if(y != testField.length - 1){
            if(findPath(y+1, x)){
                return true;
            }
        };
        if(x != 0){
            if(findPath(y, x-1)){
                return true;
            }
        };
        if(x != testField[0].length - 1){
            if(findPath(y, x+1)){
                return true;
            }
        };
        return false;
    };
    return findPath(this.y, this.x);
  }
};

//-------------------get player parameters and start game----------------------------//
function playGame() {
  const start = prompt(`Want to start a new game? y/n: `).toUpperCase();
  let fieldSize;
  let numHoles;
  let myField;
  if(start === 'Y') {
    console.log('What size field do you want to play on?');
    do {
      fieldSize = prompt('Large, medium or small? ').toUpperCase();
      } while (fieldSize != 'LARGE' && fieldSize != 'MEDIUM' && fieldSize != 'SMALL');
    do {
      numHoles = prompt('Trap intensity? (1-10) ');
      } while (numHoles < 1 || numHoles > 10);
    do {
      myField = new Field(Field.generateField(fieldSize, numHoles));
      } while (!myField.isValidField());
     
      myField.startGame();
    } else {
    console.log('Too bad.');
  };
};
//-----------------------Welcome message and run start sequence---------------------------------//
console.log('\n');
console.log('Welcome to Find your hat!');

playGame();


//Add reset function _/
//Choose size of field in game menu _/
//Message for edge of bounds _/
//Make past player locations change back to fieldCharacters _/
//Better graphics etc?
//Add holes after turns?
//set hat to make sure its away from player? _/
//Validator to make sure playable _/
