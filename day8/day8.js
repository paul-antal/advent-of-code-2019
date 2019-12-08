let stream = input.split("").map(Number);

function getLayers(stream, width, height) {
    const length = width * height;
    const layers = [];
    for (let i = 0; i < stream.length; i += length) {
        layers.push(stream.slice(i, i + length));
    }
    return layers;
}

const width = 25;
const height = 6;

function getDigitFrequencies(layer) {
    return layer.reduce((freq, digit) => {
        freq[digit] = freq[digit] + 1 || 1;
        return freq;
    }, {});
}

function partOne() {
    const layers = getLayers(stream, width, height);
    let fewestZeroesLayer = layers
        .map(getDigitFrequencies)
        .sort((l1, l2) => (l1[0] || 0) - (l2[0] || 0))[0];
    console.log(fewestZeroesLayer[1] * fewestZeroesLayer[2]);
}

function partTwo() {
    const layers = getLayers(stream, width, height);
    const visibleImage = layers[0];
    for (let layer of layers) {
        for (let i = 0; i < visibleImage.length; i++) {
            if (visibleImage[i] === 2) {
                visibleImage[i] = layer[i];
            }
        }
    }
    let prettyImage = "";
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            prettyImage += visibleImage[i * width + j] == 1 ? '#' : ' ';
        }
        prettyImage += "\n";
    }
    console.log(prettyImage);
}

