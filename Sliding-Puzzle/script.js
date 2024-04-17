import checkMovebility from './checkMovebility.js';
import solvePuzzle from './solver.js';

document.addEventListener("DOMContentLoaded", function () {


    /*    Class names for each position
        
          left top  |  center top   |   right top
    
        left middle | center middle |   right middle
    
        left bottom | center bottom |   right bottom        */


    /*  DOM elements ------------------------------------------------------------*/

    let pieces = {
        leftTop: document.querySelector("#left__top"),
        centerTop: document.querySelector("#center__top"),
        rightTop: document.querySelector("#right__top"),
        leftMiddle: document.querySelector("#left__middle"),
        centerMiddle: document.querySelector("#center__middle"),
        rightMiddle: document.querySelector("#right__middle"),
        centerBottom: document.querySelector("#center__bottom"),
        rightBottom: document.querySelector("#right__bottom")
    };
    // left bottom is the puzzle's missing piece

    const blocker = document.querySelector("#blocker");
    const puzzleContainer = document.querySelector("#puzzle__container");
    const btnShuffle = document.querySelector("#btn__shuffle");
    const btnSolve = document.querySelector("#btn__solve");
    const startModal = document.querySelector("#start__modal");
    const btnStart = document.querySelector("#btn__start");
    const scoreBoardContainer = document.querySelector("#scoreboard__container");
    const chronometerNumber = document.querySelector("#chronometer__number");
    const movesNumber = document.querySelector("#moves__counter");
    const moveSound = document.querySelector("#move__sound");
    const victoryMusic = document.querySelector("#victory__music");

    /*  DOM elements ------------------------------------------------------------*/

    /* chronometer --------------------------------------------------------------*/
    /* src: https://codepen.io/vanessametonini/pen/GMWEBv */

    let hours = `00`,
        minutes = `00`,
        seconds = `00`,
        chronometerCall;

    function chronometer() {

        seconds++;

        if (seconds < 10) seconds = `0` + seconds;

        if (seconds > 59) {
            seconds = `00`;
            minutes++;

            if (minutes < 10) minutes = `0` + minutes;
        };

        if (minutes > 59) {
            minutes = `00`;
            hours++;

            if (hours < 10) hours = `0` + hours;
        }

        chronometerNumber.textContent = `${hours}:${minutes}:${seconds}`;

    }

    /* chronometer --------------------------------------------------------------*/

    let freePlace = "left bottom";
    let allPositions = ["left top", "center top", "right top", "left middle", "center middle", "right middle", "left bottom", "center bottom", "right bottom"];
    let movesCounter = 0;

    function updateMoveCounter() {
        movesCounter++;
        movesNumber.textContent = movesCounter;
    }

    function shuffleArrayRamdom(array) {
        let currentIndex = array.length;
        let randomIndex;

        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

    };

    function setColor(piece) {
        if (piece.id.replace("__", " ") !== piece.className) {
            piece.style.border = ".5px solid rgb(202, 11, 11)";
            piece.style.boxShadow = "rgb(202, 11, 11) 0px 3px 8px";
        } else {
            piece.style.border = ".5px solid rgb(1, 4, 194)";
            piece.style.boxShadow = "rgb(74, 25, 250) 0px 3px 8px";
        }
    }

    function startingColors() {

        Object.entries(pieces).forEach((piece) => {
            setColor(piece[1]);
        });

    }

    function resetScoreboard() {

        movesCounter = 0;
        movesNumber.textContent = movesCounter;

        clearInterval(chronometerCall);
        chronometerNumber.textContent = `00:00:00`;
        hours = `00`,
            minutes = `00`,
            seconds = `00`;
        chronometerCall = setInterval(chronometer, 1000);

    }

    function shuffleBoardRamdom() {

        resetScoreboard();

        shuffleArrayRamdom(allPositions);
        freePlace = allPositions[0];
        let i = 1;

        Object.entries(pieces).forEach(async (piece) => {
            //piece -> [entry-name, respective-div]
            piece[1].className = allPositions[i];
            i++;
        });

        startingColors();
    };

    function shuffleBoard() {
        
        startingColors();
        scoreBoardContainer.style.display = "none";
        btnShuffle.style.display = "none";
        btnSolve.style.display = "none";

        let freePlaceCopy = freePlace;
        let allPositionsCopy = [...allPositions];
        let shuffleSequence = [];
        let lastMovement = "";

        for (let i = 0; i <= 50; i++) {

            allPositionsCopy.forEach(piece => {
                if (piece !== lastMovement && piece !== freePlaceCopy && checkMovebility(piece, freePlaceCopy)) {
                    shuffleSequence.push(piece);
                    lastMovement = freePlaceCopy;
                    freePlaceCopy = piece;
                }
                shuffleArrayRamdom(allPositionsCopy);
            });

        }

        executeShuffleSequence(shuffleSequence);
    }

    function executeShuffleSequence(shuffleSequence) {

        blocker.style.display = "block";
        if (shuffleSequence.length === 0) {
            resetScoreboard();
            scoreBoardContainer.style.display = "block";
            btnShuffle.style.display = "block";
            btnSolve.style.display = "block";
            blocker.style.display = "none";
            return;
        };
        const piece = document.getElementsByClassName(shuffleSequence.shift())[0];
        move(piece);
        setTimeout(() => executeShuffleSequence(shuffleSequence), 100);
    }

    function checkFinished() {
        let finished = true;

        Object.entries(pieces).forEach((piece) => {
            let p = piece[1];
            if (p.id.replace("__", " ") !== p.className) {
                finished = false;
            }
        });

        return finished;
    }

    function move(piece) {

        if (checkMovebility(piece.className, freePlace)) {
            let temp = piece.className;
            moveSound.play();
            piece.className = freePlace;
            freePlace = temp;

            setColor(piece);

            updateMoveCounter();

            if(checkFinished()) {
                blocker.style.display = "block";
                setTimeout(completeBoard, 400);
            };;
        }
    }

    function executeSolution(solution) {

        if (solution.length === 0) {
            return;
        };

        const piece = document.getElementsByClassName(solution.shift())[0];
        move(piece);
        setTimeout(() => executeSolution(solution), 400);
    }

    function solve() {
        blocker.style.display = "block";
        btnShuffle.style.display = "none";
        btnSolve.style.display = "none";
        const solution = solvePuzzle();
        if (solution === null) alert("Estado sem solução");
        else executeSolution(solution);
    }

    function appendMissingPiece() {
        let missingPieceContainer = document.createElement("div");
        missingPieceContainer.id = "left__bottom";
        missingPieceContainer.className = "left bottom";
        let missingPieceImage = document.createElement("img");
        missingPieceImage.className = "x-left y-bottom";
        missingPieceImage.src = "./assets/main_image.jpg";
        missingPieceImage.alt = "Bully maguire dancing";
        let missingPieceCover = document.createElement("div");
        missingPieceCover.className = "cover";

        missingPieceContainer.appendChild(missingPieceImage);
        missingPieceContainer.appendChild(missingPieceCover);
        puzzleContainer.appendChild(missingPieceContainer);

        pieces = { ...pieces, leftBottom: document.querySelector("#left__bottom") }
    }

    function completeBoard() {

        btnShuffle.style.display = "none";
        btnSolve.style.display = "none";
        clearInterval(chronometerCall);

        appendMissingPiece();
        victoryMusic.currentTime = "17.8";
        victoryMusic.play();

        setTimeout(() => {
            Object.entries(pieces).forEach((piece) => {
                piece[1].style.transition = "all linear 2s"
                piece[1].style.borderRadius = "0";
                piece[1].style.borderWidth = "0px";
                piece[1].style.boxShadow = "rgb(74, 25, 250) 0px 0px 0px";
            });
        }, 400);

        setTimeout(() => {
            Object.entries(pieces).forEach((piece) => {
                piece[1].children[0].src = "./assets/main_gif.gif"
            });

            invertImage(-1);

        }, 2300);

    }

    function invertImage(scale) {

        Object.entries(pieces).forEach((piece) => {
            piece[1].children[0].style.transform = `scaleX(${scale})`;
        });
        setTimeout(() => invertImage(scale *= -1), 3280);

    }

    /* event listeners ---------------------------------------------------------------*/

    btnStart.addEventListener("click", () => {
        startModal.style.display = "none";
        shuffleBoard();
    });

    btnShuffle.addEventListener("click", shuffleBoard);
    btnSolve.addEventListener("click", solve);

    Object.entries(pieces).forEach((piece) => {
        piece[1].addEventListener("click", event => move(event.target.parentNode));
    });

});
