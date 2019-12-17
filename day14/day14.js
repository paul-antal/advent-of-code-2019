function getReactionMap() {
    const lines = input.split("\n");
    const map = {};
    for (let line of lines) {
        const parts = line.split(" => ");
        const result = parts[1].split(" ");
        const reaction = {
            amount: Number(result[0]),
            reactants: []
        };
        map[result[1]] = reaction;
        const reactants = parts[0].split(", ");
        for (let reactant of reactants) {
            let reactantInfo = reactant.split(" ");
            reaction.reactants.push({
                name: reactantInfo[1],
                amount: reactantInfo[0]
            });
        }
    }
    return map;
}

const reactionsMap = getReactionMap();

function reduceToOre(chemicals, reactions) {
    const reactionFrequency = {};
    const stockpile = {};
    while (
        chemicals.length > 1 ||
        (chemicals.length === 1 && chemicals[0].name !== "ORE")
    ) {
        let chemical = chemicals.pop();
        if (chemical.name === "ORE") continue;

        stockpile[chemical.name] = stockpile[chemical.name] || 0;
        if (stockpile[chemical.name] < chemical.amount) {
            let reaction = reactions[chemical.name];
            let amountToMake = chemical.amount - stockpile[chemical.name];
            let reactionsNeeded = Math.ceil(amountToMake / reaction.amount);
            stockpile[chemical.name] += reactionsNeeded * reaction.amount;
            for (let reactant of reaction.reactants) {
                chemicals.push({
                    name: reactant.name,
                    amount: reactant.amount * reactionsNeeded
                });
            }
            reactionFrequency[chemical.name] =
                reactionFrequency[chemical.name] + reactionsNeeded || reactionsNeeded;
        }
        stockpile[chemical.name] -= chemical.amount;
    }
    let amountsNeeded = {};
    for (let chemical of Object.keys(reactionFrequency)) {
        let reaction = reactions[chemical];
        for (let reactant of reaction.reactants) {
            let reactantNeeded = reactant.amount * reactionFrequency[chemical];
            amountsNeeded[reactant.name] =
                amountsNeeded[reactant.name] + reactantNeeded || reactantNeeded;
        }
    }
    return amountsNeeded.ORE || 0;
}

function partOne() {
    let ore = reduceToOre([{ name: "FUEL", amount: 1 }], reactionsMap);
    console.log(ore);
}

//partOne();

function partTwo() {
    let maxOre = 1000000000000;
    let fuel = 0;
    while (reduceToOre([{ name: "FUEL", amount: fuel }], reactionsMap) < maxOre) {
        fuel += 1000;
    }
    fuel -= 1000;
    while (reduceToOre([{ name: "FUEL", amount: fuel }], reactionsMap) < maxOre) {
        fuel += 1;
    }
    console.log(fuel - 1);
}

  //partTwo();
