
export default function checkMovebility(piece, freePlace) {

    //prevent middle pieces from moving diagonally
    if (!freePlace.includes("center") && !freePlace.includes("middle") && piece == "center middle") return false;
    if (!piece.includes("center") && !piece.includes("middle") && freePlace == "center middle") return false;

    //prevent the middle pieces from moving diagonally
    const middlePieces = ["center top", "right middle", "center bottom", "left middle"];
    if (middlePieces.includes(piece) && middlePieces.includes(freePlace)) return false;

    //prevent pieces non-neighbors of the free place from moving  -----------------------------------
    let horizontally = false;

    if (piece.includes("left")) {
        horizontally = freePlace.includes("left") || freePlace.includes("center") ? true : false;
    } else if (piece.includes("center")) {
        horizontally = true;
    } else {
        horizontally = freePlace.includes("center") || freePlace.includes("right") ? true : false;
    }

    // ----------------------------------------------------------------------------------------------

    let vertically = false;

    if (piece.includes("top")) {
        vertically = freePlace.includes("top") || freePlace.includes("middle") ? true : false;
    } else if (piece.includes("middle")) {
        vertically = true;
    } else {
        vertically = freePlace.includes("middle") || freePlace.includes("bottom") ? true : false;
    }

    return (horizontally && vertically);
}