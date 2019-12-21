function getRepeatCoeficient(outputIndex, coeficientIndex, pattern) {
    let indexCorrectedForShift = coeficientIndex + 1;
    let indexCorrectedForDuplicatedElements = Math.floor(
        indexCorrectedForShift / (outputIndex + 1)
    );
    let indexCorrectedForRepeatedPattern =
        indexCorrectedForDuplicatedElements % pattern.length;
    return pattern[indexCorrectedForRepeatedPattern];
}

const pattern = [0, 1, 0, -1];

function FFT(input) {
    const output = [];

    for (let outputIndex = 0; outputIndex < input.length; outputIndex++) {
        const sum = input
            .map((val, i) => val * getRepeatCoeficient(outputIndex, i, pattern))
            .reduce((acc, v) => acc + v, 0);
        output[outputIndex] = Math.abs(sum % 10);
    }

    return output;
}

function partOne() {
    let data = input.split("").map(Number);
    for (let i = 0; i < 100; i++) {
        data = FFT(data);
    }
    console.log(data.slice(0, 8).join(""));
}

//partOne();

function FFTSimplified(input) {
    for (let i = input.length - 1; i >= 0; i--) {
        input[i] = ((input[i + 1] || 0) + input[i]) % 10;
    }
    return input;
}

function partTwo() {
    let data = input.split("").map(Number);

    let offset = Number(input.substring(0, 7));

    let hugeArray = [];
    for (let i = 0; i < 10000; i++) {
        hugeArray.push(...data);
    }

    hugeArray.splice(0, offset);

    for (let i = 0; i < 100; i++) {
        hugeArray = FFTSimplified(hugeArray);
    }
    console.log(hugeArray.slice(0, 8).join(""));
}

partTwo();
