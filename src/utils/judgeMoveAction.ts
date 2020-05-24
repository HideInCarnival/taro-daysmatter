import { moveDerection } from "../typings/types";

export function judgeMoveDeg(moveDisX: number, moveDisY: number): boolean {
    const relativeDisX = Math.abs(moveDisX);
    const relativeDisY = Math.abs(moveDisY);
    const tan = relativeDisY / relativeDisX;
    const tan30 = Math.tan(Math.PI / 6);
    if (tan < tan30) {
        return true
    }
    return false
}

export function judgeMoveDerection(moveDisX) {
    if (moveDisX > 40) {
        return moveDerection.right
    }
    if(moveDisX < - 40) {
        return moveDerection.left
    }
}