function getCoordinates(string) {
    let segments = string.match(/<x=(.*), y=(.*), z=(.*)>/);
    segments.splice(0, 1);

    return segments.map(Number);
}

function getPositions() {
    return input
        .split("\n")
        .map(getCoordinates)
        .map(([x, y, z]) => {
            return { x, y, z };
        });
}

function get1DInfluence(objectCoord, influencerCoord) {
    if (objectCoord === influencerCoord) return 0;
    return objectCoord > influencerCoord ? -1 : +1;
}

class Moon {
    constructor(position) {
        this.position = position;
        this.velocity = { x: 0, y: 0, z: 0 };
    }

    beInfluenced(moon) {
        this;
        this.velocity.x += get1DInfluence(this.position.x, moon.position.x);
        this.velocity.y += get1DInfluence(this.position.y, moon.position.y);
        this.velocity.z += get1DInfluence(this.position.z, moon.position.z);
    }

    move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.velocity.z;
    }

    equals(moon) {
        return (
            this.position.x === moon.position.x &&
            this.position.y === moon.position.y &&
            this.position.z === moon.position.z &&
            this.velocity.x === moon.velocity.x &&
            this.velocity.y === moon.velocity.y &&
            this.velocity.z === moon.velocity.z
        );
    }

    equalsX(moon) {
        return (
            this.position.x === moon.position.x && this.velocity.x === moon.velocity.x
        );
    }

    equalsY(moon) {
        return (
            this.position.y === moon.position.y && this.velocity.y === moon.velocity.y
        );
    }

    equalsZ(moon) {
        return (
            this.position.z === moon.position.z && this.velocity.z === moon.velocity.z
        );
    }

    get potentialEnergy() {
        return (
            Math.abs(this.position.x) +
            Math.abs(this.position.y) +
            Math.abs(this.position.z)
        );
    }

    get kineticEnergy() {
        return (
            Math.abs(this.velocity.x) +
            Math.abs(this.velocity.y) +
            Math.abs(this.velocity.z)
        );
    }

    get totalEnergy() {
        return this.kineticEnergy * this.potentialEnergy;
    }
}

function getMoons() {
    let positions = getPositions();
    return positions.map(pos => new Moon(pos));
}

function step(moons) {
    for (let moon of moons) {
        for (let otherMoon of moons) {
            if (moon === otherMoon) continue;

            moon.beInfluenced(otherMoon);
        }
    }

    for (let moon of moons) {
        moon.move();
    }
}

function statesEqual(state1, state2, comparer) {
    return state1.reduce(
        (acc, moon, index) => acc && comparer(moon, state2[index]),
        true
    );
}

function getCycleLength(comparer) {
    const initial = getMoons();
    const moons = getMoons();
    step(moons);

    let steps = 1;
    while (!statesEqual(initial, moons, comparer)) {
        step(moons);
        steps++;
    }
    return steps;
}

function partOne() {
    const moons = getMoons();
    for (let i = 0; i < 1000; i++) {
        step(moons);
    }
    const energy = moons.reduce((acc, moon) => acc + moon.totalEnergy, 0);
    console.log(energy);
}

function lcm(x, y) {
    return !x || !y ? 0 : (x * y) / gcd(x, y);
}

function gcd(x, y) {
    while (y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function partTwo() {
    let xCycle = getCycleLength((moon1, moon2) => moon1.equalsX(moon2));
    let yCycle = getCycleLength((moon1, moon2) => moon1.equalsY(moon2));
    let zCycle = getCycleLength((moon1, moon2) => moon1.equalsZ(moon2));
    console.log(lcm(xCycle, lcm(yCycle, zCycle)));
}

partTwo();
