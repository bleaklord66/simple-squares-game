//TODO modal na pravidla

console.log('started');

let allSquares = null;
let line = null;
let playerImg = null;
let chestImg = null;
let player = null;
let highScore = 0;
let gameEnd = false;
let endGameImage = null;

const init = function () {
    gameEnd = false;

    if (!allSquares) {
        allSquares = Array.from(document.querySelectorAll('img'));
        allSquares.shift();
        line = {
            line1: allSquares.slice(0, 9),
            line2: allSquares.slice(9, 18),
            line3: allSquares.slice(18, 27),
            line4: allSquares.slice(27, 36),
            line5: allSquares.slice(36, 45),
            line6: allSquares.slice(45, 54),
            line7: allSquares.slice(54, 63),
            line8: allSquares.slice(63, 72),
            line9: allSquares.slice(72, 81)
        };
    };
    allSquares.forEach(element => element.src = 'square.png')

    const randomNumber1 = Math.floor(Math.random() * 81)
    let randomNumber2 = Math.floor(Math.random() * 81);
    if (randomNumber1 === randomNumber2) {
        while (randomNumber1 === randomNumber2) {
            randomNumber2 = Math.floor(Math.random() * 81)
        };
    };
    playerImg = allSquares[randomNumber1];
    playerImg.src = 'player.png';
    chestImg = allSquares[randomNumber2];
    chestImg.src = 'chest.png';

    if (!endGameImage) {
        endGameImage = document.createElement("img");
        endGameImage.style.position = 'absolute';
        endGameImage.style.zIndex = '9999';
    };
    endGameImage.classList.toggle('hidden');

    player = {
        howManyMoves: 0,
        score: 0,
        line: null,
        index: null,
        chestLine: null,
        chestIndex: null,
        getStartPosition: function (img) {
            let tempLine = null;
            let tempIndex = null;
            switch (true) {
                case line.line1.includes(img):
                    tempLine = 'line1';
                    tempIndex = line.line1.indexOf(img);
                    break;
                case line.line2.includes(img):
                    tempLine = 'line2';
                    tempIndex = line.line2.indexOf(img);
                    break;
                case line.line3.includes(img):
                    tempLine = 'line3';
                    tempIndex = line.line3.indexOf(img);
                    break;
                case line.line4.includes(img):
                    tempLine = 'line4';
                    tempIndex = line.line4.indexOf(img);
                    break;
                case line.line5.includes(img):
                    tempLine = 'line5';
                    tempIndex = line.line5.indexOf(img);
                    break;
                case line.line6.includes(img):
                    tempLine = 'line6';
                    tempIndex = line.line6.indexOf(img);
                    break;
                case line.line7.includes(img):
                    tempLine = 'line7';
                    tempIndex = line.line7.indexOf(img);
                    break;
                case line.line8.includes(img):
                    tempLine = 'line8';
                    tempIndex = line.line8.indexOf(img);
                    break;
                case line.line9.includes(img):
                    tempLine = 'line9';
                    tempIndex = line.line9.indexOf(img);
                    break;
            };
            if (img.src.split('/')[img.src.split('/').length - 1] === 'player.png') {
                this.line = tempLine;
                this.index = tempIndex;
                console.log(this.line);
                console.log(this.index);
            }
            else if (img.src.split('/')[img.src.split('/').length - 1] === 'chest.png') {
                this.chestLine = tempLine;
                this.chestIndex = tempIndex;
            }
        },
        move: function () {
            const currentLine = line[`${this.line}`];
            currentLine[this.index].src = 'player.png';
            this.howManyMoves--;
            document.querySelector('#roll').src = `dice-${player.howManyMoves}.png`;
            document.querySelector('#roll').textContent = `Steps to make: ${player.howManyMoves}; Score: ${player.score}`;
            document.querySelector('#instructions').textContent = player.howManyMoves === 0 ? 'You have no steps left - roll!' : `Aim for the chest! You have ${player.howManyMoves} moves to make!`;
            this.isLost();
        },
        unmove: function () {
            const currentLine = line[`${this.line}`];
            currentLine[this.index].src = 'fire.png';
        },
        srcToCompareCompute: function () {
            const lineToCompare = line[`${this.line}`];
            const element = lineToCompare[this.index];
            return this.getLastPartOfSource(element);
        },
        stepOnChestLine: function (sign = true) {
            const oldLine = parseInt(this.line[this.line.length - 1])
            this.line = sign ? `line${oldLine - 1}` : `line${oldLine + 1}`;
            const currentLine = line[`${this.line}`]
            currentLine[this.index].src = 'player.png';
            document.querySelector('#instructions').textContent = 'No stepping here :)';
        },
        stepOnChestIndex: function (sign = true) {
            const oldIndex = parseInt(this.index);
            this.index = sign ? oldIndex - 1 : oldIndex + 1;
            const currentLine = line[this.line]
            currentLine[this.index].src = 'player.png';
            document.querySelector('#instructions').textContent = 'No stepping here :)';
        },
        getLastPartOfSource: function (img) {
            return img.src.split('/')[img.src.split('/').length - 1]
        },
        isLost: function () {
            if (gameEnd === true) return;

            const stepsEval = ![0, 1].includes(this.howManyMoves);
            const stuckEval = function (sourceArray, stuckEvaluation, imageSpecification) {
                sourceArray.forEach(source => {
                    if (source === 'fire.png' || source === imageSpecification && stepsEval) stuckEvaluation++;
                });
                return stuckEvaluation;
            };

            const looseEval = function (lineSpecification, indexSpecification, imageSpecification) {
                let upSource = null;
                let downSource = null;
                let leftSource = null;
                let rightSource = null;
                let stuckEvaluation = 0

                const lost = function () {
                    document.querySelector('#instructions').textContent = 'You lost! Restart to play again.';
                    gameEnd = true;
                    allSquares[20].parentNode.insertBefore(endGameImage, allSquares[20]);
                    endGameImage.src = 'lost.png';
                    endGameImage.classList.remove('hidden');
                };

                if (lineSpecification !== 'line1') upSource = player.getLastPartOfSource(line[`line${parseInt(lineSpecification.slice(-1)) - 1}`][indexSpecification]);
                if (lineSpecification !== 'line9') downSource = player.getLastPartOfSource(line[`line${parseInt(lineSpecification.slice(-1)) + 1}`][indexSpecification]);
                if (indexSpecification !== 0) leftSource = player.getLastPartOfSource(line[lineSpecification][indexSpecification - 1]);
                if (indexSpecification !== 8) rightSource = player.getLastPartOfSource(line[lineSpecification][indexSpecification + 1]);

                switch (true) {
                    case (lineSpecification === 'line1' || lineSpecification === 'line9') && (indexSpecification === 0 || indexSpecification === 8): {
                        if (lineSpecification === 'line1' && indexSpecification === 0) {
                            stuckEvaluation = stuckEval([downSource, rightSource], stuckEvaluation, imageSpecification);
                        };
                        if (lineSpecification === 'line9' && indexSpecification === 0) {
                            stuckEvaluation = stuckEval([upSource, rightSource], stuckEvaluation, imageSpecification);
                        };
                        if (lineSpecification === 'line1' && indexSpecification === 8) {
                            stuckEvaluation = stuckEval([downSource, leftSource], stuckEvaluation, imageSpecification);
                        };
                        if (lineSpecification === 'line9' && indexSpecification === 8) {
                            stuckEvaluation = stuckEval([upSource, leftSource], stuckEvaluation, imageSpecification);
                        };
                        if (stuckEvaluation === 2) {
                            lost();
                        };
                        console.log(`${imageSpecification} ${stuckEvaluation}`);
                        break;
                    }
                    case indexSpecification !== 0 && indexSpecification !== 8 && lineSpecification !== 'line1' && lineSpecification !== 'line9': {
                        stuckEvaluation = stuckEval([upSource, downSource, leftSource, rightSource], stuckEvaluation, imageSpecification);
                        console.log(`${imageSpecification}${stuckEvaluation}`);
                        if (stuckEvaluation === 4) {
                            lost();
                        };
                        break;
                    }
                    case (lineSpecification === 'line1' || lineSpecification === 'line9') && indexSpecification !== 0 && indexSpecification !== 8:
                        if (lineSpecification === 'line1') {
                            stuckEvaluation = stuckEval([downSource, leftSource, rightSource], stuckEvaluation, imageSpecification);
                            console.log(`${imageSpecification}${stuckEvaluation}`);
                        };
                        if (lineSpecification === 'line9') {
                            stuckEvaluation = stuckEval([upSource, leftSource, rightSource], stuckEvaluation, imageSpecification);
                        };
                        if (stuckEvaluation === 3) {
                            gameEnd = true;
                            lost();
                        };
                        break;
                    case lineSpecification !== 'line1' && lineSpecification !== 'line9' && (indexSpecification === 0 || indexSpecification === 8): {
                        if (indexSpecification === 0) {
                            stuckEvaluation = stuckEval([upSource, downSource, rightSource], stuckEvaluation, imageSpecification);
                        };
                        if (indexSpecification === 8) {
                            stuckEvaluation = stuckEval([upSource, downSource, leftSource], stuckEvaluation, imageSpecification);
                        };
                        if (stuckEvaluation === 3) {
                            lost();
                        };
                        break;
                    }
                }
            }
            looseEval(player.chestLine, player.chestIndex, 'player.png');
            looseEval(player.line, player.index, 'chest.png');
        }
    }
    document.querySelector('#high-score').textContent = `Highscore: ${highScore}`;
    document.querySelector('#score').textContent = `Current score: ${player.score}`;
    document.querySelector('#instructions').textContent = 'Roll the dice to start!';
    document.querySelector('#roll').src = 'dice-0.png';
    player.getStartPosition(playerImg);
    player.getStartPosition(chestImg);
};

init();

const rollDice = function () {
    if (gameEnd === true) return;
    if (player.howManyMoves !== 0) {
        document.querySelector('#instructions').textContent = 'First use all your steps!';
        return;
    }
    player.howManyMoves = Math.floor(Math.random() * 6) + 1;
    player.score++;
    document.querySelector('#score').textContent = `Current score: ${player.score}`;
    document.querySelector('#roll').src = `dice-${player.howManyMoves}.png`;
    document.querySelector('#instructions').textContent = `Aim for the chest! You have ${player.howManyMoves} moves to make!`;
    player.isLost();
};

const toggleBlur = function () {
    document.querySelectorAll('.not-modal').forEach(element => {
        element.classList.toggle('blur');
    });
    document.querySelector('.modal').classList.toggle('hidden');
};

document.addEventListener('keydown', function (e) {
    if (gameEnd === true) return;
    if (player.howManyMoves === 0 && e.key === 'r') {
        rollDice();
    }
    if (player.howManyMoves === 0) {
        document.querySelector('#instructions').textContent = 'You have no steps left - roll!';
        return;
    }
    switch (e.key) {
        case 'ArrowUp':
        case 'w': {
            if (player.line === 'line1') {
                document.querySelector('#instructions').textContent = "Please do not try to espace the game plan!";
                break;
            }
            player.unmove();
            const oldLine = parseInt(player.line[player.line.length - 1])
            player.line = `line${oldLine - 1}`;

            if (((player.line === player.chestLine && player.index === player.chestIndex && player.howManyMoves !== 1) || player.srcToCompareCompute() === 'fire.png')) {
                player.stepOnChestLine(false);
                break;
            }
            player.move();
            break;
        }
        case 'ArrowDown':
        case 's': {
            if (player.line === 'line9') {
                document.querySelector('#instructions').textContent = "Please do not try to espace the game plan!";
                break;
            }
            player.unmove();
            const oldLine = parseInt(player.line[player.line.length - 1])
            player.line = `line${oldLine + 1}`;
            if (((player.line === player.chestLine && player.index === player.chestIndex && player.howManyMoves !== 1) || player.srcToCompareCompute() === 'fire.png')) {
                player.stepOnChestLine(true);
                break;
            }
            player.move();
            break;
        }
        case 'ArrowLeft':
        case 'a': {
            if (player.index === 0) {
                document.querySelector('#instructions').textContent = "Please do not try to espace the game plan!";
                break;
            }
            player.unmove();
            const oldIndex = parseInt(player.index);
            player.index = oldIndex - 1
            if (((player.line === player.chestLine && player.index === player.chestIndex && player.howManyMoves !== 1) || player.srcToCompareCompute() === 'fire.png')) {
                player.stepOnChestIndex(false);
                break;
            };
            player.move();
            break;
        }
        case 'ArrowRight':
        case 'd': {
            if (player.index === 8) {
                document.querySelector('#instructions').textContent = "Please do not try to espace the game plan!";
                break;
            }
            player.unmove();
            const oldIndex = parseInt(player.index);
            player.index = oldIndex + 1
            if (((player.line === player.chestLine && player.index === player.chestIndex && player.howManyMoves !== 1) || player.srcToCompareCompute() === 'fire.png')) {
                player.stepOnChestIndex(true);
                break;
            };
            player.move();
            break;
        }
    }
    if (player.line === player.chestLine && player.index === player.chestIndex) {
        gameEnd = true;
        highScore = player.score;
        document.querySelector('#high-score').textContent = `Highscore: ${highScore}`;
        document.querySelector('#instructions').textContent = 'You win! Restart to play again.';
        allSquares[20].parentNode.insertBefore(endGameImage, allSquares[20]);
        endGameImage.src = 'win.png';
        endGameImage.classList.remove('hidden');
    }
});

document.querySelector('#button-rules').addEventListener('click', toggleBlur);
document.querySelector('#espace-rules').addEventListener('click', toggleBlur);
document.addEventListener('keydown', function (e) {
    if (!document.querySelector('.modal').classList.contains('hidden') && e.key === 'Escape') toggleBlur();
});

document.querySelector('#button-roll').addEventListener('click', rollDice);
document.querySelector('#button-restart').addEventListener('click', init);