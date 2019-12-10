
function getAsteroidsAngleMap(candidate, asteroids) {
    function angle(first, second) {
        let angleDeg =
            (Math.atan2(second.y - first.y, second.x - first.x) * 180) / Math.PI;
        if (angleDeg < 0) angleDeg = angleDeg + 360;
        return angleDeg;
    }

    function squareDistance(first, second) {
        return (
            (second.x - first.x) * (second.x - first.x) +
            (second.y - first.y) * (second.y - first.y)
        );
    }
    var vectorialCoordinates = asteroids
        .filter(c => c.x !== candidate.x || c.y !== candidate.y)
        .map(a => {
            return {
                angle: angle(candidate, a),
                squareDistance: squareDistance(candidate, a),
                ortCoord: a
            };
        });

    var angleGroupedCoordinates = vectorialCoordinates.reduce(
        (angleMap, coord) => {
            if (!angleMap[coord.angle]) angleMap[coord.angle] = [];
            angleMap[coord.angle].push(coord);
            angleMap[coord.angle] = angleMap[coord.angle].sort((a, b) => a.squareDistance - b.squareDistance);

            return angleMap;
        },
        {}
    );

    return angleGroupedCoordinates;
}

function getBestLocation(asteroids) {
    let maxVisibleAsteroids = 0;
    let maxCoords;

    for (let candidateAsteroid of asteroids) {
        var visibleAsteroids = getAsteroidsAngleMap(candidateAsteroid, asteroids);
        var visibleAsteroidsCount = Object.keys(visibleAsteroids).length;
        if (maxVisibleAsteroids < visibleAsteroidsCount) {
            maxVisibleAsteroids = visibleAsteroidsCount;
            maxCoords = candidateAsteroid;
        }
    }
    return { location: maxCoords, visibleAsteroids: maxVisibleAsteroids };
}

function partOne() {
    let asteroids = getAsteroidCoordinates();

    console.log(getBestLocation(asteroids));
}


function partTwo() {
    function clockwise(a, b) {

        function clockwiseNormalise(a) {
            var normA = a - 270;
            if (normA < 0) normA = normA + 360;
            return normA;
        }

        return clockwiseNormalise(a) - clockwiseNormalise(b);
    }

    let asteroids = getAsteroidCoordinates();
    let bestPlace = getBestLocation(asteroids).location;
    var map = getAsteroidsAngleMap(bestPlace, asteroids);

    var mapKeys = Object.keys(map).sort(clockwise);
    let destroyedSoFar = 0;
    let index = 0;
    let lastDestroyed;
    while (destroyedSoFar < 200) {
        lastDestroyed = map[mapKeys[index]].splice(0, 1);

        if (map[mapKeys[index]].length === 0) {
            mapKeys.splice(index, 1);
        } else {
            index++;
            index = index % mapKeys.length;
        }

        destroyedSoFar++;
    }
    console.log(lastDestroyed);
}