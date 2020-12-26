// affiche la fenetre
window.onload = function() {
    var canvasWidth = 900;
    var canvasHeight = 600;
    blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score;

    init();

    function init() {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake([[6,4] , [5,4] ,[4,4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
        
    }

    function refreshCanvas() {
        snakee.advance();
        if(snakee.checkCollision()){
            //GAME OVER
            gameOver();
            console.log(score);
        }

        else{
            if(snakee.isEatingApple(applee)){
                // the snake eating the apple
                score++;
                snakee.ateApple = true;
                do{
                    applee.setnewPosition();
                }
                while (applee.isOnSnake(snakee))
            }
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            snakee.draw();
            applee.draw();
            drawScore();
            setTimeout(refreshCanvas, delay);
        }
        
    }

    function gameOver() {
        ctx.save();
        ctx.fillText("Game Over",5,15);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", 5 , 30);
        ctx.restore(); 
    }

    function restart(){
        snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
        applee = new Apple([10, 10]);
        score = 0;
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.fillText(score.toString(),5, canvasHeight - 5);
        ctx.restore();
    }

    function drawBlock(ctx, position) {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }

    /*SNAKE START*/
    function Snake(body, direction) {
        this.body = body;
        this.ateApple = false;
        this.direction = direction;

        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };

        //AVANCE
        this.advance =  function(){
            var nextPosition = this.body[0].slice();
            switch (this.direction) {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw ("Invalid Direction");
            }
            this.body.unshift(nextPosition);

            if(!this.ateApple){
                this.body.pop();
            }
            else{
                this.ateApple = false;
            }
            
        };

        //direction
        this.setDirection = function (newDirection){
            var allowedDirections;
            switch (this.direction) {
                case "left":
                case "right":
                    allowedDirections = ["up" , "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction");
            }

            if(allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };
        //collision
        this.checkCollision = function() {
            var wallCollidion = false;
            var snakeCollision = false;
            var headSnake = this.body[0];
            var restBodySnake = this.body.slice(1);
            var snakeX = headSnake[0];
            var snakeY = headSnake[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks -1;
            var maxY = heightInBlocks - 1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                wallCollidion = true;
            }
            
            for (var i = 0; i < restBodySnake.length; i++) {
                if(snakeX === restBodySnake[i][0] && snakeY === restBodySnake[i][1]){
                    snakeCollision = true;
                }
            }

            return wallCollidion || snakeCollision;
        };

        //mange la pomme 

        this.isEatingApple = function(appleToEat) {
            var headSnake = this.body[0];

            if (headSnake[0] === appleToEat.position[0] && headSnake[1] === appleToEat.position[1]) {
                return true;
            }
            else{
                return false;
            }

        };


    }
    /* SNAKE END */

    /*APPLE START*/
    function Apple(position) {
        this.position = position;
        this.draw = function() {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize / 2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();//remplire
            ctx.restore();
        };

        //new position
        this.setnewPosition = function() {
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        };

        //if the apple is on snake
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;

            for (let i = 0; i < snakeToCheck.body.length; i++) {
                if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }
    /*APPLE END*/


    /*KEY SATRT*/
    //move to key
    document.onkeydown = function handleKeyDown(e) {
        var key = e.keyCode;
        var newDirection;
        switch (key) {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up" ;
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
    /*KEY END*/
}
