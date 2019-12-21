class Computer {
    constructor(memory, inputStream = [], outputStream = []) {
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
  
  const childToParentDirection = [0, 2, 1, 4, 3];
  
  class Drone {
    constructor(computer) {
      this.computer = computer;
      this.moves = [];
    }
  
    move(direction) {
      this.computer.inputStream.push(direction);
      this.computer.run();
  
      let output = this.computer.outputStream.pop();
      if (output) {
        this.moves.push(direction);
      }
      return output;
    }
  
    goBack() {
      const previousStep = this.moves.pop();
  
      this.computer.inputStream.push(childToParentDirection[previousStep]);
      this.computer.run();
      return this.computer.outputStream.pop();
    }
  }
  
  function searchValve(drone, parentDirection, distance = 0) {
    for (let i = 1; i <= 4; i++) {
      if (i === parentDirection) continue;
  
      let output = drone.move(i);
  
      if (output === 2) {
        return distance + 1;
      } else if (output === 1) {
        let childOut = searchValve(
          drone,
          childToParentDirection[i],
          distance + 1
        );
        if (childOut !== undefined) {
          return childOut;
        }
  
        drone.goBack();
      }
    }
  
    return;
  }
  
  function partOne() {
    const memory = JSON.parse(input);
    const drone = new Drone(new Computer(memory));
    const distanceToValve = searchValve(drone);
  
    console.log(distanceToValve);
  }
  
  //partOne();
  
  function searchMaxDistance(drone, parentDirection, distance = 0) {
    let maxDistance = distance;
    for (let i = 1; i <= 4; i++) {
      if (i === parentDirection) continue;
  
      let output = drone.move(i);
  
      if (output === 1) {
        let childDistance = searchMaxDistance(
          drone,
          childToParentDirection[i],
          distance + 1
        );
        if (childDistance > maxDistance) {
          maxDistance = childDistance;
        }
  
        drone.goBack();
      }
    }
  
    return maxDistance;
  }
  
  function partTwo() {
    const memory = JSON.parse(input);
    const drone = new Drone(new Computer(memory));
    const startNode = searchValve(drone);
  
    const minutes = searchMaxDistance(drone);
    console.log(minutes);
  }
  
  //partTwo();
  