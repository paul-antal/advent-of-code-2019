class Computer {
    constructor(memory, inputStream, outputStream) {
        this.defaultMemory = [...memory];
        this.memory = [...memory];
        this.inputStream = inputStream;
        this.outputStream = outputStream;
        this.memoryPointer = 0;
        this.notWaiting = true;

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
        if (this.inputStream.length == 0) {
            this.notWaiting = false;
            return;
        }
        let i = this.memoryPointer;

        let value = this.inputStream.splice(0, 1)[0];
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

        this.memory[this.memory[i + 3]] = firstValue < secondValue ? 1 : 0;

        this.memoryPointer += 4;
    }

    equals() {
        let i = this.memoryPointer;

        let modeCodes = this.getModes(this.memory[i], 3);
        let firstValue = this.getValue(i + 1, modeCodes[0]);
        let secondValue = this.getValue(i + 2, modeCodes[1]);

        this.memory[this.memory[i + 3]] = firstValue === secondValue ? 1 : 0;

        this.memoryPointer += 4;
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

function generatePhaseCombinationsPartOne(currentPhase = []) {
    if (currentPhase.length === 5) return [currentPhase];

    let phases = [];
    for (let i = 0; i <= 4; i++) {
        if (currentPhase.indexOf(i) === -1)
            phases.push(...generatePhaseCombinationsPartOne([...currentPhase, i]));
    }
    return phases;
}

function generatePhaseCombinationsPartTwo(currentPhase = []) {
    if (currentPhase.length === 5) return [currentPhase];

    let phases = [];
    for (let i = 5; i <= 9; i++) {
        if (currentPhase.indexOf(i) === -1)
            phases.push(...generatePhaseCombinationsPartTwo([...currentPhase, i]));
    }
    return phases;
}

const memory = [3, 8, 1001, 8, 10, 8, 105, 1, 0, 0, 21, 38, 63, 88, 97, 118, 199, 280, 361, 442, 99999, 3, 9, 1002, 9, 3, 9, 101, 2, 9, 9, 1002, 9, 4, 9, 4, 9, 99, 3, 9, 101, 3, 9, 9, 102, 5, 9, 9, 101, 3, 9, 9, 1002, 9, 3, 9, 101, 3, 9, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 1001, 9, 3, 9, 102, 3, 9, 9, 101, 2, 9, 9, 1002, 9, 4, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 99, 3, 9, 102, 4, 9, 9, 101, 5, 9, 9, 102, 2, 9, 9, 101, 5, 9, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 99, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 99, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 99];

function partOne() {
    let maxSignal = 0;
    let maxSignalPhase = [];
    const phases = generatePhaseCombinationsPartOne();
    for (let phase of phases) {
        const inputs = phase.map(p => [p]);
        inputs[0].push(0);
        const output = [];

        const amplifiers = [
            new Computer(memory, inputs[0], inputs[1]),
            new Computer(memory, inputs[1], inputs[2]),
            new Computer(memory, inputs[2], inputs[3]),
            new Computer(memory, inputs[3], inputs[4]),
            new Computer(memory, inputs[4], output)
        ];

        for (let amplifier of amplifiers) {
            amplifier.run();
        }

        if (output[0] > maxSignal) {
            maxSignal = output[0];
            maxSignalPhase = phase;
        }
    }
    console.log(maxSignalPhase, maxSignal);
}

function partTwo() {
    let maxSignal = 0;
    let maxSignalPhase = [];
    const phases = generatePhaseCombinationsPartTwo();
    for (let phase of phases) {
        const inputs = phase.map(p => [p]);
        inputs[0].push(0);

        const amplifiers = [
            new Computer(memory, inputs[0], inputs[1]),
            new Computer(memory, inputs[1], inputs[2]),
            new Computer(memory, inputs[2], inputs[3]),
            new Computer(memory, inputs[3], inputs[4]),
            new Computer(memory, inputs[4], inputs[0])
        ];
        while (!amplifiers[4].isFinished) {
            for (let amplifier of amplifiers) {
                amplifier.run();
            }
        }

        if (inputs[0][0] > maxSignal) {
            maxSignal = inputs[0][0];
            maxSignalPhase = phase;
        }
    }
    console.log(maxSignalPhase, maxSignal);
}
