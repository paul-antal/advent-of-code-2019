class Computer {
    constructor(memory, inputStream, outputStream) {
        this.defaultMemory = [...memory];
        this.memory = [...memory];
        this.inputStream = inputStream;
        this.outputStream = outputStream;
        this.memoryPointer = 0;
        this.relativeMemory = 0;
        this.notWaiting = true;

        this.operations = {
            1: () => this.add(),
            2: () => this.multiply(),
            3: () => this.input(),
            4: () => this.output(),
            5: () => this.jumpIfTrue(),
            6: () => this.jumpIfFalse(),
            7: () => this.lessThan(),
            8: () => this.equals(),
            9: () => this.updateRelativeMemory()
        };
    }

    getValue(position, mode) {
        if (mode === 0) {
            return this.memory[this.memory[position]] || 0;
        } else if (mode === 1) {
            return this.memory[position] || 0;
        } else if (mode === 2) {
            return this.memory[this.memory[position] + this.relativeMemory] || 0;
        }
    }

    setValue(position, mode, value) {
        if (mode === 0) {
            this.memory[this.memory[position]] = value;
        } else if (mode === 2) {
            this.memory[this.memory[position] + this.relativeMemory] = value;
        }
    }

    getModes(modeNum, paramNum) {
        let modes = Math.floor(modeNum / 100);
        let modeCodes = [];
        for (let i = 0; i < paramNum; i++) {
            modeCodes.push(modes % 10);
            modes = Math.floor(modes / 10);
        }
        return modeCodes;
    }

    add() {
        let i = this.memoryPointer;
        let sum = 0;

        let modeCodes = this.getModes(this.memory[i], 3);
        sum += this.getValue(i + 1, modeCodes[0]);
        sum += this.getValue(i + 2, modeCodes[1]);
        this.setValue(i + 3, modeCodes[2], sum);

        this.memoryPointer += 4;
    }

    multiply() {
        let i = this.memoryPointer;
        let mul = 1;

        let modeCodes = this.getModes(this.memory[i], 3);
        mul *= this.getValue(i + 1, modeCodes[0]);
        mul *= this.getValue(i + 2, modeCodes[1]);

        this.setValue(i + 3, modeCodes[2], mul);
        this.memoryPointer += 4;
    }

    input() {
        if (this.inputStream.length == 0) {
            this.notWaiting = false;
            return;
        }
        let i = this.memoryPointer;

        let modeCodes = this.getModes(this.memory[i], 1);
        let value = this.inputStream.splice(0, 1)[0];

        this.setValue(i + 1, modeCodes[0], value);
        this.memoryPointer += 2;
    }

    output() {
        let i = this.memoryPointer;

        let modeCodes = this.getModes(this.memory[i], 1);
        let value = this.getValue(i + 1, modeCodes[0]);
        this.outputStream.push(value);

        this.memoryPointer += 2;
    }

    jumpIfTrue() {
        let i = this.memoryPointer;

        let modeCodes = this.getModes(this.memory[i], 2);
        let condition = this.getValue(i + 1, modeCodes[0]);
        if (condition !== 0) {
            this.memoryPointer = this.getValue(i + 2, modeCodes[1]);
            return;
        }

        this.memoryPointer += 3;
    }

    jumpIfFalse() {
        let i = this.memoryPointer;

        let modeCodes = this.getModes(this.memory[i], 2);
        let condition = this.getValue(i + 1, modeCodes[0]);

        if (condition === 0) {
            this.memoryPointer = this.getValue(i + 2, modeCodes[1]);
            return;
        }

        this.memoryPointer += 3;
    }

    lessThan() {
        let i = this.memoryPointer;

        let modeCodes = this.getModes(this.memory[i], 3);
        let firstValue = this.getValue(i + 1, modeCodes[0]);
        let secondValue = this.getValue(i + 2, modeCodes[1]);
        this.memory[i + 3];

        this.setValue(i + 3, modeCodes[2], firstValue < secondValue ? 1 : 0);

        this.memoryPointer += 4;
    }

    equals() {
        let i = this.memoryPointer;

        let modeCodes = this.getModes(this.memory[i], 3);
        let firstValue = this.getValue(i + 1, modeCodes[0]);
        let secondValue = this.getValue(i + 2, modeCodes[1]);

        this.setValue(i + 3, modeCodes[2], firstValue === secondValue ? 1 : 0);

        this.memoryPointer += 4;
    }

    updateRelativeMemory() {
        let i = this.memoryPointer;

        let modeCodes = this.getModes(this.memory[i], 1);
        let value = this.getValue(i + 1, modeCodes[0]);

        this.relativeMemory += value;

        this.memoryPointer += 2;
    }

    run() {
        let memory = this.memory;
        if (this.inputStream.length > 0) {
            this.notWaiting = true;
        }
        while (this.memory[this.memoryPointer] !== 99 && this.notWaiting) {
            let op = memory[this.memoryPointer] % 100;
            this.operations[op]();
        }
        if (this.memory[this.memoryPointer] === 99) {
            this.isFinished = true;
        }
    }
}

let paintingProgram = [3, 8, 1005, 8, 332, 1106, 0, 11, 0, 0, 0, 104, 1, 104, 0, 3, 8, 102, -1, 8, 10, 101, 1, 10, 10, 4, 10, 108, 1, 8, 10, 4, 10, 101, 0, 8, 28, 3, 8, 102, -1, 8, 10, 1001, 10, 1, 10, 4, 10, 1008, 8, 1, 10, 4, 10, 101, 0, 8, 51, 1, 1103, 5, 10, 1, 1104, 9, 10, 2, 1003, 0, 10, 1, 5, 16, 10, 3, 8, 102, -1, 8, 10, 101, 1, 10, 10, 4, 10, 108, 0, 8, 10, 4, 10, 1001, 8, 0, 88, 1006, 0, 2, 1006, 0, 62, 2, 8, 2, 10, 3, 8, 1002, 8, -1, 10, 101, 1, 10, 10, 4, 10, 1008, 8, 1, 10, 4, 10, 102, 1, 8, 121, 1006, 0, 91, 1006, 0, 22, 1006, 0, 23, 1006, 0, 1, 3, 8, 102, -1, 8, 10, 1001, 10, 1, 10, 4, 10, 1008, 8, 1, 10, 4, 10, 101, 0, 8, 155, 1006, 0, 97, 1, 1004, 2, 10, 2, 1003, 6, 10, 3, 8, 1002, 8, -1, 10, 101, 1, 10, 10, 4, 10, 108, 0, 8, 10, 4, 10, 1002, 8, 1, 187, 1, 104, 15, 10, 2, 107, 9, 10, 1006, 0, 37, 1006, 0, 39, 3, 8, 1002, 8, -1, 10, 1001, 10, 1, 10, 4, 10, 108, 0, 8, 10, 4, 10, 102, 1, 8, 223, 2, 2, 17, 10, 1, 1102, 5, 10, 3, 8, 1002, 8, -1, 10, 101, 1, 10, 10, 4, 10, 108, 0, 8, 10, 4, 10, 1001, 8, 0, 253, 3, 8, 102, -1, 8, 10, 1001, 10, 1, 10, 4, 10, 1008, 8, 1, 10, 4, 10, 1002, 8, 1, 276, 1006, 0, 84, 3, 8, 102, -1, 8, 10, 101, 1, 10, 10, 4, 10, 1008, 8, 0, 10, 4, 10, 1001, 8, 0, 301, 2, 1009, 9, 10, 1006, 0, 10, 2, 102, 15, 10, 101, 1, 9, 9, 1007, 9, 997, 10, 1005, 10, 15, 99, 109, 654, 104, 0, 104, 1, 21102, 1, 936995738516, 1, 21101, 0, 349, 0, 1105, 1, 453, 21102, 1, 825595015976, 1, 21102, 1, 360, 0, 1105, 1, 453, 3, 10, 104, 0, 104, 1, 3, 10, 104, 0, 104, 0, 3, 10, 104, 0, 104, 1, 3, 10, 104, 0, 104, 1, 3, 10, 104, 0, 104, 0, 3, 10, 104, 0, 104, 1, 21102, 46375541763, 1, 1, 21101, 0, 407, 0, 1105, 1, 453, 21102, 1, 179339005019, 1, 21101, 0, 418, 0, 1106, 0, 453, 3, 10, 104, 0, 104, 0, 3, 10, 104, 0, 104, 0, 21102, 825012036372, 1, 1, 21102, 441, 1, 0, 1105, 1, 453, 21101, 988648461076, 0, 1, 21101, 452, 0, 0, 1105, 1, 453, 99, 109, 2, 22102, 1, -1, 1, 21102, 40, 1, 2, 21102, 484, 1, 3, 21101, 0, 474, 0, 1106, 0, 517, 109, -2, 2105, 1, 0, 0, 1, 0, 0, 1, 109, 2, 3, 10, 204, -1, 1001, 479, 480, 495, 4, 0, 1001, 479, 1, 479, 108, 4, 479, 10, 1006, 10, 511, 1102, 1, 0, 479, 109, -2, 2105, 1, 0, 0, 109, 4, 2102, 1, -1, 516, 1207, -3, 0, 10, 1006, 10, 534, 21101, 0, 0, -3, 21202, -3, 1, 1, 22101, 0, -2, 2, 21102, 1, 1, 3, 21102, 553, 1, 0, 1106, 0, 558, 109, -4, 2106, 0, 0, 109, 5, 1207, -3, 1, 10, 1006, 10, 581, 2207, -4, -2, 10, 1006, 10, 581, 22102, 1, -4, -4, 1105, 1, 649, 21202, -4, 1, 1, 21201, -3, -1, 2, 21202, -2, 2, 3, 21101, 0, 600, 0, 1105, 1, 558, 21201, 1, 0, -4, 21101, 0, 1, -1, 2207, -4, -2, 10, 1006, 10, 619, 21101, 0, 0, -1, 22202, -2, -1, -2, 2107, 0, -3, 10, 1006, 10, 641, 22102, 1, -1, 1, 21102, 1, 641, 0, 106, 0, 516, 21202, -2, -1, -2, 22201, -4, -2, -4, 109, -5, 2105, 1, 0];

const directionValue = {
    "^": -10000,
    ">": +1,
    v: +10000,
    "<": -1
};

function positionValueToCoords(positionValue) {
    let y = 0;
    let x = 0;
    positionValue = Number(positionValue);
    while (positionValue < 0) {
        positionValue += 10000;
        y--;
    }
    y += Math.floor(positionValue / 10000);
    x = positionValue % 10000;

    return { x, y };
}

const LEFT = 0;
const RIGHT = 1;

const BLACK = 0;
const WHITE = 1;

function turn(current, direction) {
    var directions = Object.keys(directionValue);
    let indexCurrent = directions.indexOf(current);
    if (indexCurrent === -1) return;

    let newIndex = indexCurrent + (direction === LEFT ? -1 : +1);

    if (newIndex < 0) {
        newIndex += directions.length;
    }

    return directions[newIndex % directions.length];
}

function paint(startTileColor) {
    let paintedTiles = { 0: startTileColor };
    let currentDirection = "^";
    let positionValue = 0;

    let computer = new Computer(paintingProgram, [], []);

    while (!computer.isFinished) {
        const tileColor = paintedTiles[positionValue] ? WHITE : BLACK;
        computer.inputStream.push(tileColor);
        computer.run();

        currentDirection = turn(currentDirection, computer.outputStream.pop());
        const newColor = computer.outputStream.pop();
        if (newColor !== tileColor) {
            paintedTiles[positionValue] = newColor;
        }
        positionValue += directionValue[currentDirection];
    }
    return paintedTiles;
}

function partOne() {
    let paintedTiles = paint();
    console.log(Object.keys(paintedTiles).length);
}

//partOne();

function partTwo() {
    let paintedTiles = paint(1);
    var paintedCoords = Object.entries(paintedTiles).reduce(
        (acc, [key, value]) => {
            let coords = positionValueToCoords(key);
            acc[coords.y][coords.x] = value;
            return acc;
        },
        [[], [], [], [], [], []]
    );

    let painting = "";

    for (let i = 0; i <= 5; i++) {
        for (let j = 0; j <= 40; j++) {
            painting += paintedCoords[i][j] ? "# " : "  ";
        }
        painting += "\n";
    }
    console.log(painting);
}

//partTwo();
