class Computer {
    constructor(memory, inputStream, outputStream) {
        this.defaultMemory = [...memory];
        this.memory = [...memory];
        this.inputStream = inputStream.reverse();
        this.outputStream = outputStream;
        this.memoryPointer = 0;

        this.operations = {
            1: () => this.add(),
            2: () => this.multiply(),
            3: () => this.input(),
            4: () => this.output(),
            5: () => this.jumpIfTrue(),
            6: () => this.jumpIfFalse(),
            7: () => this.lessThan(),
            8: () => this.equals()
        };
    }

    getValue(position, mode) {
        if (mode === 0) {
            return this.memory[this.memory[position]];
        } else if (mode === 1) {
            return this.memory[position];
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
        this.memory[this.memory[i + 3]] = sum;

        this.memoryPointer += 4;
    }

    multiply() {
        let i = this.memoryPointer;
        let mul = 1;

        let modeCodes = this.getModes(this.memory[i], 3);
        mul *= this.getValue(i + 1, modeCodes[0]);
        mul *= this.getValue(i + 2, modeCodes[1]);
        this.memory[this.memory[i + 3]] = mul;

        this.memoryPointer += 4;
    }

    input() {
        let i = this.memoryPointer;

        let value = this.inputStream.pop();
        this.memory[this.memory[i + 1]] = value;

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

        this.memory[this.memory[i + 3]] = firstValue < secondValue ? 1 : 0

        this.memoryPointer += 4;
    }

    equals() {
        let i = this.memoryPointer;

        let modeCodes = this.getModes(this.memory[i], 3);
        let firstValue = this.getValue(i + 1, modeCodes[0]);
        let secondValue = this.getValue(i + 2, modeCodes[1]);

        this.memory[this.memory[i + 3]] = firstValue === secondValue ? 1 : 0

        this.memoryPointer += 4;
    }

    run() {
        let memory = this.memory;
        while (this.memory[this.memoryPointer] !== 99) {
            let op = memory[this.memoryPointer] % 100;
            this.operations[op]();
        }

        return input[0];
    }
}

let realInput = [3, 225, 1, 225, 6, 6, 1100, 1, 238, 225, 104, 0, 1002, 36, 25, 224, 1001, 224, -2100, 224, 4, 224, 1002, 223, 8, 223, 101, 1, 224, 224, 1, 223, 224, 223, 1102, 31, 84, 225, 1102, 29, 77, 225, 1, 176, 188, 224, 101, -42, 224, 224, 4, 224, 102, 8, 223, 223, 101, 3, 224, 224, 1, 223, 224, 223, 2, 196, 183, 224, 1001, 224, -990, 224, 4, 224, 1002, 223, 8, 223, 101, 7, 224, 224, 1, 224, 223, 223, 102, 14, 40, 224, 101, -1078, 224, 224, 4, 224, 1002, 223, 8, 223, 1001, 224, 2, 224, 1, 224, 223, 223, 1001, 180, 64, 224, 101, -128, 224, 224, 4, 224, 102, 8, 223, 223, 101, 3, 224, 224, 1, 223, 224, 223, 1102, 24, 17, 224, 1001, 224, -408, 224, 4, 224, 1002, 223, 8, 223, 101, 2, 224, 224, 1, 223, 224, 223, 1101, 9, 66, 224, 1001, 224, -75, 224, 4, 224, 1002, 223, 8, 223, 1001, 224, 6, 224, 1, 223, 224, 223, 1102, 18, 33, 225, 1101, 57, 64, 225, 1102, 45, 11, 225, 1101, 45, 9, 225, 1101, 11, 34, 225, 1102, 59, 22, 225, 101, 89, 191, 224, 1001, 224, -100, 224, 4, 224, 1002, 223, 8, 223, 1001, 224, 1, 224, 1, 223, 224, 223, 4, 223, 99, 0, 0, 0, 677, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1105, 0, 99999, 1105, 227, 247, 1105, 1, 99999, 1005, 227, 99999, 1005, 0, 256, 1105, 1, 99999, 1106, 227, 99999, 1106, 0, 265, 1105, 1, 99999, 1006, 0, 99999, 1006, 227, 274, 1105, 1, 99999, 1105, 1, 280, 1105, 1, 99999, 1, 225, 225, 225, 1101, 294, 0, 0, 105, 1, 0, 1105, 1, 99999, 1106, 0, 300, 1105, 1, 99999, 1, 225, 225, 225, 1101, 314, 0, 0, 106, 0, 0, 1105, 1, 99999, 8, 226, 677, 224, 1002, 223, 2, 223, 1006, 224, 329, 1001, 223, 1, 223, 108, 226, 226, 224, 1002, 223, 2, 223, 1006, 224, 344, 1001, 223, 1, 223, 7, 677, 226, 224, 102, 2, 223, 223, 1005, 224, 359, 101, 1, 223, 223, 7, 226, 677, 224, 102, 2, 223, 223, 1006, 224, 374, 101, 1, 223, 223, 1008, 677, 226, 224, 1002, 223, 2, 223, 1006, 224, 389, 101, 1, 223, 223, 8, 677, 677, 224, 1002, 223, 2, 223, 1005, 224, 404, 101, 1, 223, 223, 8, 677, 226, 224, 102, 2, 223, 223, 1005, 224, 419, 1001, 223, 1, 223, 1107, 677, 226, 224, 102, 2, 223, 223, 1005, 224, 434, 1001, 223, 1, 223, 1107, 226, 677, 224, 1002, 223, 2, 223, 1006, 224, 449, 1001, 223, 1, 223, 107, 677, 226, 224, 1002, 223, 2, 223, 1005, 224, 464, 1001, 223, 1, 223, 1008, 677, 677, 224, 1002, 223, 2, 223, 1006, 224, 479, 1001, 223, 1, 223, 1108, 677, 226, 224, 1002, 223, 2, 223, 1006, 224, 494, 1001, 223, 1, 223, 1108, 677, 677, 224, 1002, 223, 2, 223, 1006, 224, 509, 1001, 223, 1, 223, 107, 677, 677, 224, 1002, 223, 2, 223, 1005, 224, 524, 101, 1, 223, 223, 1007, 677, 226, 224, 102, 2, 223, 223, 1005, 224, 539, 1001, 223, 1, 223, 1107, 226, 226, 224, 1002, 223, 2, 223, 1006, 224, 554, 1001, 223, 1, 223, 1008, 226, 226, 224, 1002, 223, 2, 223, 1006, 224, 569, 101, 1, 223, 223, 1108, 226, 677, 224, 1002, 223, 2, 223, 1006, 224, 584, 101, 1, 223, 223, 108, 677, 677, 224, 1002, 223, 2, 223, 1006, 224, 599, 1001, 223, 1, 223, 1007, 677, 677, 224, 102, 2, 223, 223, 1006, 224, 614, 101, 1, 223, 223, 107, 226, 226, 224, 102, 2, 223, 223, 1006, 224, 629, 101, 1, 223, 223, 1007, 226, 226, 224, 102, 2, 223, 223, 1005, 224, 644, 1001, 223, 1, 223, 108, 226, 677, 224, 102, 2, 223, 223, 1005, 224, 659, 1001, 223, 1, 223, 7, 677, 677, 224, 102, 2, 223, 223, 1006, 224, 674, 1001, 223, 1, 223, 4, 223, 99, 226];


function partOne() {
    let outputStr = [];
    let computer = new Computer(realInput, [1], outputStr);
    computer.run();
    console.log(outputStr);
}

function partTwo() {
    let outputStr = [];
    let computer = new Computer(realInput, [5], outputStr);
    computer.run();
    console.log(outputStr);
}
