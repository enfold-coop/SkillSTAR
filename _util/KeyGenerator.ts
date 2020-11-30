/**
 * RandomIntGenerator
 * -- creates a random integer for use as keys/identifiers in React lists
 */

function RandomIntGenerator(max: number) {
	return Math.floor(Math.random() * Math.floor(max));
}

export default RandomIntGenerator;
