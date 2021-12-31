/* returns direction as a string based on line between point A and B */
export function directionString(pointA, pointB) {
    let angle = (Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x) * 180) / Math.PI;
    if (angle < 0) angle = 360 + angle; // changing range [-180,180] to [0,360]

    if (angle > 330 || angle <= 30) {
        return "left-to-right";
    } else if (angle > 30 && angle <= 150) {
        return "top-to-bottom";
    } else if (angle > 150 && angle <= 240) {
        return "right-to-left";
    } else if (angle > 240 && angle <= 330) {
        return "bottom-to-top";
    }

    return false;
}
