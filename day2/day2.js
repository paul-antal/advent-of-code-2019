class Computer {
    constructor(initialMemory) {
        this.memory = [...initialMemory];
        this.operationMap = {
            1: (addr) => this.add(addr),
            2: (addr) => this.multiply(addr),
        };
    }

    compute(noun, verb) {
        this.memory[1] = noun;
        this.memory[2] = verb;
        this.run(this.memory);
        return this.memory;
    }

    run(memory) {
        for (let addr = 0; addr < memory.length && memory[addr] !== 99; addr += 4) {
            this.memory[addr]
            this.operationMap[this.memory[addr]](addr);
        }
    }

    add(addr) {
        var iResult = this.memory[addr + 3];
        var iFirstTerm = this.memory[addr + 1];
        var iSecondTerm = this.memory[addr + 2];
        this.memory[iResult] = this.memory[iFirstTerm] + this.memory[iSecondTerm];
    }

    multiply(addr) {
        var iResult = this.memory[addr + 3];
        var iFirstTerm = this.memory[addr + 1];
        var iSecondTerm = this.memory[addr + 2];
        this.memory[iResult] = this.memory[iFirstTerm] * this.memory[iSecondTerm];
    }
}

function bruteforce(value, memory) {
}

var realInput = [1, 0, 0, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 6, 1, 19, 1, 5, 19, 23, 1, 13, 23, 27, 1, 6, 27, 31, 2, 31, 13, 35, 1, 9, 35, 39, 2, 39, 13, 43, 1, 43, 10, 47, 1, 47, 13, 51, 2, 13, 51, 55, 1, 55, 9, 59, 1, 59, 5, 63, 1, 6, 63, 67, 1, 13, 67, 71, 2, 71, 10, 75, 1, 6, 75, 79, 1, 79, 10, 83, 1, 5, 83, 87, 2, 10, 87, 91, 1, 6, 91, 95, 1, 9, 95, 99, 1, 99, 9, 103, 2, 103, 10, 107, 1, 5, 107, 111, 1, 9, 111, 115, 2, 13, 115, 119, 1, 119, 10, 123, 1, 123, 10, 127, 2, 127, 10, 131, 1, 5, 131, 135, 1, 10, 135, 139, 1, 139, 2, 143, 1, 6, 143, 0, 99, 2, 14, 0, 0];

function part1() {
    var computer = new Computer(realInput);
    var result = computer.compute(12, 2)[0];
    console.log(result);
}

function part2() {
    for (let i = 0; i <= 99; i++) {
        for (let j = 0; j <= 99; j++) {
            var computer = new Computer(realInput);
            var result = computer.compute(i, j)[0];
            if (result === 19690720) {
                console.log(i * 100 + j);
                return;
            }
        }
    }
}