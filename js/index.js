$( document ).ready(function(){
  //images for handrwitten X's and O's
  var x, circle;  
  //array representation of the board
  var origBoard = [0,1,2,3,4,5,6,7,8];
  //string representations of players
  var player2,human,computer;
  //paused prevents the player from playing while the computer is playing
  var paused = false;
  var human2 = false;
  //array representation of boxes that signify a win
  var win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  
  //change to symbol selection from menu once user makes a choice
  $(".hvt,.hvh").on("click",function(){
    	$(".decide-players,.bio").fadeOut(1000);  
      $(".choose-symbol").delay(1000).fadeIn(1000);   
  });
  //change to game once user makes a choice
  $(".X,.O").on("click", function(){
    $(".choose-symbol").fadeOut(1000);
    $(".game").delay(1000).fadeIn(1000);
  });
  //assign X's and O's to each player depending on selection
  $(".O").on("click", function(){
    player2;
    human = "X";
    computer = player2 = "O";
    x="<img src='https://res.cloudinary.com/dhjypclhx/image/upload/v1503517586/X_sokepu.png'>";
    circle = "<img src='https://res.cloudinary.com/dhjypclhx/image/upload/v1503515902/CIRCLE_y98msf.png'>";    
  });
  
  $(".X").on("click", function(){
    player2;
    human = "O";
    computer = player2 = "X";  
    circle="<img src='https://res.cloudinary.com/dhjypclhx/image/upload/v1503517586/X_sokepu.png'>";
     x = "<img src='https://res.cloudinary.com/dhjypclhx/image/upload/v1503515902/CIRCLE_y98msf.png'>";    
  });
  //change game setting to human vs human if user chooses that option
  $(".hvh").on("click",function(){
    human2 = true;
  })
  //function that returns array with boxes not continaing an X or an O
  function emptyBoxes(board){
     var empty = board.filter(function(place){
       return place !== "X" && place !== "O";
     });
     return empty;
   }
  //function that uses array above to determine if a player has won
  function winner(board,player){
     for (var i = 0; i < win.length; i++){
        if(board[win[i][0]] == player && board[win[i][1]] == player && board[win[i][2]] == player)
          return true;
     }
     return false;
   } 

  // mimimax function done with the help of this tutorial: https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
 //the minimac function ONLY applies when the computer is playing 
  function minimax(board, player){
    var freeSpots = emptyBoxes(board);
    //assign points dependingo on the winner (negative points if the result would be a win for the human)
    //and (positive points if the resultw would be a win for the computer)
    if (winner(board, human)){
       return {score:-10};
    }
    else if (winner(board, computer)){
      return {score:10};
    }
    //zero points if the result is a draw
    else if (freeSpots.length === 0){
      return {score:0};
    }
    //array collection of objects with an index(position on board) and a move value (-10,+10,0)
    
    var moves = [];
  
    //this for loop goes through every possible move the AI or the human could make
    for (var i = 0; i < freeSpots.length; i++){
      //create a move object
      var move = {};
      //move.index is the index of a given free spot on the board
      move.index = board[freeSpots[i]];
      //mark the spot as taken by the player
      board[freeSpots[i]] = player;
      //recursive calls are made by alternating between a move the human could make and the computer could make
      //once a result is achieved (-10,0,+10), it is stored in the object for the relevant move
      if (player == computer){
        var result = minimax(board, human);
        move.score = result.score;
      }
      else{
        var result = minimax(board, computer);
        move.score = result.score;
      }
      //because the machine is only simuating all possible game outcomes, you must restore the board back to normal
      board[freeSpots[i]] = move.index;
      //push the move into the array with the pertinent score
      moves.push(move);
    }
    //now we're going to choose the move with the best score possible from the array of index/score objects
    //keep in mind that this is outside of the for loop
    var bestMove;
    //for each level, as stated above, the best option is that which results in the lowest score posssible when the human plays
    //or the highest score possible when the computer plays
    if(player === computer){
      var bestScore = -10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score > bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }else{
      var bestScore = 10000;
      for(var i = 0; i < moves.length; i++){
        if(moves[i].score < bestScore){
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    //return the best move possible for each level of recursion
    return moves[bestMove];
  }
  //variable keeps track of turns in order to know whn a draw has been reached
  var turns = 0;
  //when a user selects a space to play in
  $(".box").on("click",function(){    
      //do not allow clicking on boxes if the computer is playing (indicated by "pause" boolean value)
      if($(this).hasClass("checked") || paused)return;    
      //determine the next symbol to be played if two humans are playing
      if(human2 && turns %2 === 1){
        var player = player2;
        var shape = x;
      } else {
        var player = human;
        var shape = circle;
      }
      //add a value to the array representation of the board (origBoard)
      origBoard[parseInt($(this).attr("value"))] = player;      
      //update graphics
      $(this).html(shape);	
      //the "checked" class does not allow changes to an already used box
      $(this).addClass("checked");
      turns++;
      //check if the game is over before allowing next player to play
      if(restartGame())return;
      //if this is a human vs. human game, the computer plays
      //set time out  is used for the computer to play "naturally", as opposed to playinng within milliseconds of the human taking a turn
      if(!human2){
        paused = true;
        setTimeout(function(){
          computerPlays();
          paused = false;
        }, 1000);
      }
    });     
  
    function computerPlays(){
      //board and orgiBoard are changed in a similar way to that in the function above for when a human plays
      var computerMove = minimax(origBoard,computer).index;
      $("[value='" + computerMove.toString() + "']").addClass("checked").html(x);
      origBoard[computerMove] = computer;
      turns++;
      if(restartGame())return;
    }
 //check if there is a winner or a draw, announce the result, and reset the game   
    function restartGame(){
      if(turns == 9 || winner(origBoard,computer) || winner(origBoard,human)){
            //allow use of all boxes on the board again
            $(".box").html("").removeClass("checked");
            //announce result
            if(winner(origBoard,computer)){
              if(human2){
                alert("player 2 wins, player 1 is a loser");
              } else {
                alert("Computer wins. You've been A.I.'d");
              }
            } else {
              if(!human2){
              alert("This is a draw, and it will never be better.");
              }  else if (winner(origBoard,human)) {
                alert("player 1 wins, player 2 is a loser");
              } else {
                alert("This is a draw between two equally smart (or dumb) humans");
              }
            }
           //reset all values to original values 
           $(".game").fadeOut(1000);  
           $(".decide-players,.bio").delay(1000).fadeIn(1000);   
           origBoard =[0,1,2,3,4,5,6,7,8];
           turns = 0;
           human2 = false;
           return true;
        }
      return false;  
    }  
});