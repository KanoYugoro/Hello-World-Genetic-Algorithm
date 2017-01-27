var desiredResult = "Hello, World!";
var mutationRate = 0.005;
var maxGenerations = 100000;
var initialPopulation = 30;
var printInterval = 1000;

// Our fitness Function
function getCost(inputString) {
  // console.log(inputString);
  var cost = 0;
  for (var i = 0; i < desiredResult.length; i = i + 1) {
    cost = cost + Math.pow(Number(desiredResult.charCodeAt(i)) - Number(inputString.charCodeAt(i)), 2);
  }
  return cost*cost;
}

// Initial Seeded Values
var useableCharacters = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789,.?!@#$%^&*-_+=~ ";
function generateString() {
  var outPut = "";
  for (var i = 0; i < desiredResult.length; i = i + 1) {
    outPut = outPut + useableCharacters.charAt(Math.floor(Math.random() * useableCharacters.length));
  }

  return outPut;
}

// Mutate a random digit in a string
function mutateString(startString) {
  var index = Math.floor(Math.random() * startString.length);
  return startString.substring(0, index) + useableCharacters.charAt(Math.floor(Math.random() * useableCharacters.length)) + startString.substring(index + 1);
}

// Cross Over two chromosomes
function crossOver(dad, mom) {
  var index = Math.max(Math.min(Math.floor(Math.random() * desiredResult.length, 1), desiredResult.length - 2));
  return [
    dad.substring(0, index) + mom.substring(index),
    mom.substring(0, index) + dad.substring(index),
  ];
}

// Generate the first population
function getInitialPopulation(size) {
  var population = [];
  for (var i = 0; i < size; i = i + 1) {
    population[i] = generateString();
  }

  return population;
}

// Printing out method for ease of use
function printOut(population, generation) {
  var average = 0;
  var scores = [];
  for (var i = 0; i < population.length; i = i + 1) {
    var cost = getCost(population[i]);
    average = average + cost;
    if (generation % printInterval == 0) {
      console.log('    ' + population[i] + ' ' + cost);
    }
    scores = scores.concat(cost);
  }

  if (generation % printInterval == 0) {
    console.log('Generation: ' + generation + ' Composite: ' + (average / population.length));
  }
  return scores;
}

// Survival of the fittest
function selectForBreeding(population, excludeVal) {
  var pop = population;
  if (population.indexOf(excludeVal) > -1) {
    pop = pop.splice(pop.indexOf(excludeVal), 1);
  }
  var weights = pop.map(function(x) {
      return getCost(x);
  });

  var maxWeight = weights.sort(function(a,b) {
    return a-b;
  })[weights.length-1];

  var totalWeight = pop.reduce(function(acc, x) {
    return acc + (maxWeight - getCost(x));
  }, 0);

  var randomIndex = Math.floor(Math.random() * totalWeight);
  for (var i = 0; i < pop.length; i = i + 1) {
    randomIndex = randomIndex - (maxWeight - getCost(pop[i]));
    if (randomIndex <= 0) {
      return pop[i];
    }
  }
}

// Make a new Generation
function getNewGeneration(oldPopulation) {
  var population = [];
  while (population.length < initialPopulation) {
    var dad = selectForBreeding(oldPopulation);
    var mom = selectForBreeding(oldPopulation, dad);

    var temp = crossOver(dad, mom);
    //Check for mutation here
    if (Math.random() < mutationRate) {
      temp[0] = mutateString(temp[0]);
    }

    if (Math.random() < mutationRate) {
      temp[1] = mutateString(temp[1]);
    }
    population = population.concat(temp);
  }

  return population;
}

// Termination condition
function checkTerminate(scores, genNumber, population) {
  if (scores.indexOf(0) != -1) {
    console.log('Success on generation ' + genNumber);
    return false;
  }

  if (genNumber > maxGenerations) {
    console.log('Maximum generations reached');
    return false;
  }

  return true;
}

var generation = 0;
var population = getInitialPopulation(initialPopulation);
var scores = printOut(population, generation);

while (checkTerminate(scores, generation, population)) {
  generation = generation + 1;
  population = getNewGeneration(population);
  scores = printOut(population, generation);
}

