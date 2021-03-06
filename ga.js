 // replace at prototype
 String.prototype.replaceAt=function(index, char) {
	return this.substr(0, index) + char + this.substr(index+char.length);
 }
 
 // global variables
 var validChars = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.'";
 var INITIAL_POP_SIZE = 2500;
 var MAX_GENERATIONS = 1000;
 var evolutionTarget = "No he wasn't.";
 var INDIVIDUAL_SIZE = evolutionTarget.length;
 var ELITE = INITIAL_POP_SIZE - INITIAL_POP_SIZE*20/100; //20%
 var MUTATION_RATE = 0.156;
 var MAX_RAND = 32767.00;

 // evolve generation
 function evolve(currentGeneration, generationCounter){
 	var fitnessScores = new Array();
   	var tempGenerationHolder = new Array();
   		
   	// Inner loop: foreach candidate
   	for(var g = 0; g < currentGeneration.length; g++){
   		// evaluate each candidate --> simple string distance
   		fitnessScores[g] = {fitness: levenshtein(evolutionTarget, currentGeneration[g]), chromosome: currentGeneration[g]};
   	}
   			
   	// sort by fitness ascending (smaller distance == better fitness)
   	fitnessScores.sort(function(a, b){
 		return a.fitness - b.fitness;
	});
   		
   	// printout best fit
   	$("<div style='text-align: left;'>Best of <b>generation " + (generationCounter + 1) + "</b>: " + fitnessScores[0].chromosome + "</div>").hide().appendTo('#evolutionPlaceHolder').slideDown('slow');
   	
   	if(fitnessScores[0].fitness == 0){
   		// if perfect match stop evolution
   		$("<h1>" + fitnessScores[0].chromosome + "</h1>").hide().appendTo('#evolutionPlaceHolder').slideDown('slow');
   	} 
   	else if(generationCounter < MAX_GENERATIONS){
   		// save best rules as elite population and shove into temp array for the new generation
   		for(var e = 0; e < ELITE; e++) {
   			tempGenerationHolder.push(fitnessScores[e].chromosome); 
   		}
   		
   		// randomly select a mate (including elite) for all of the remaining ones
   		// using double-point crossover should suffice for this silly problem
   		// note: this should create INITIAL_POP_SIZE - ELITE new individualz
   		for(var s = 0; s < INITIAL_POP_SIZE - ELITE; s++) {
   			// generate random number between 0 and INITIAL_POP_SIZE - ELITE - 1
   			var randInd = Math.floor(Math.random()*(INITIAL_POP_SIZE - ELITE));
   		
   			// mate the individual at index s with indivudal at random index
   			var child = mate(fitnessScores[s].chromosome, fitnessScores[randInd].chromosome);
   		
   			// push the result in the new generation holder
   			tempGenerationHolder.push(child);
   		}
   		
   		// set current generation same as temp generation holder
   		currentGeneration = tempGenerationHolder;
   	
   		// increase counter
   		generationCounter++;
 	
 		// check stopping criteria and recurse
 		setTimeout(function(){evolve(currentGeneration, generationCounter)},200);
 	}
 }
 
 // function to mate individuals
 function mate(individual1, individual2){
 	// generate two random integers for the double point crossover
 	var randomIndex1 = Math.floor(Math.random()*(INDIVIDUAL_SIZE));
 	var randomIndex2 = Math.floor(Math.random()*(INDIVIDUAL_SIZE));
 	
 	var smaller;
 	var bigger;
 	
 	if(randomIndex1 > randomIndex2){
 		smaller = randomIndex2;
 		bigger = randomIndex1;
 	}
 	else {
 		smaller = randomIndex1;
 		bigger = randomIndex2;
 	}
 	
 	// substring each individual generating 3 segments for each
 	var ind1_1 = individual1.substring(0,smaller);
 	var ind1_3 = individual1.substring(bigger, INDIVIDUAL_SIZE);
 	var ind2_2 = individual2.substring(smaller, bigger);
 	
 	// generate offspring
 	var offspring = ind1_1 + ind2_2 + ind1_3;
 	
 	if(offspring.length != INDIVIDUAL_SIZE){
 		alert('anomaly in offspring, lenght = ' + offspring.length + ' - ' + offspring);
 	}
 	
 	// mutate the offspring by chance given MUTATION_RATE
    if (Math.floor(Math.random()*(MAX_RAND + 1)) > MAX_RAND * MUTATION_RATE)
    {
 		offspring = mutate(offspring);
 	}
 	
 	return offspring;
 }
 
 // a function to implement mutation - this is pretty useless/disruptive if the string is too small
 function mutate(individual){
 	// generate a random integer 
 	var marker = Math.floor(Math.random()*(INDIVIDUAL_SIZE));
 	
 	// generate a smaller random integer (pseudo-randomly smaller)
 	var delta = Math.floor(Math.random()*(INDIVIDUAL_SIZE - marker + 1));
 	
 	// generate a random string of delta chars
 	var mutatedStream = "";
 		
 	for(var j=0; j < delta; j++){
 		var randomIndex = Math.floor(Math.random()*(validChars.length + 1));
 		mutatedStream += validChars.charAt(randomIndex);
 	}
 	
 	// override mutated genes
 	for (deltaCounter = 0; deltaCounter < delta; deltaCounter++)
    {
    	individual.replaceAt(marker++, mutatedStream.charAt(deltaCounter));
    }
    
    return individual;
 }
 
 // A function to generate initial population of random strings
 function generateInitialPop(sizeOfIndividual, sizeOfPopulation){
 	
 	var population = new Array();
 	
 	for(var i=0; i < sizeOfPopulation; i++)
 	{
 		var individual = "";
 		
 		for(var j=0; j < sizeOfIndividual; j++){
 			var randomIndex = Math.floor(Math.random()*(validChars.length));
 			
 			if(randomIndex >= validChars.length){
 				alert('randomIndex is ' + randomIndex);
 			}
 			
 			individual += validChars.charAt(randomIndex);
 		}
 		
 		if(individual.length != sizeOfIndividual){
 				alert('size of individual is ' + individual.length + ' - ' + individual);
 		}
 		
 		population.push(individual);
 	}
 	
 	return population;
 }