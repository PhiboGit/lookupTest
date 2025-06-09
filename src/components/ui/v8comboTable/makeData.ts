import { v7 as uuidv7 } from 'uuid';


// 1. The data structure type
type Animal = {
  id: string
  name: string
  class: string
  diet: string
}

// 2. Data pools for realistic random generation
const animalNames: string[] = [
  "Lion", "Elephant", "Giraffe", "Zebra", "Penguin", "Snake", 
  "Crocodile", "Eagle", "Shark", "Clownfish", "Frog", "Spider",
  "Tiger", "Bear", "Wolf", "Hippo", "Gorilla", "Parrot"
];

const animalClasses: string[] = [
  "Mammal", "Reptile", "Bird", "Fish", "Amphibian", "Arachnid", "Insect"
];

const animalDiets: string[] = [
  "Carnivore", "Herbivore", "Omnivore"
];

/**
 * A helper function to pick a random element from an array.
 * @param arr The array to pick an element from.
 * @returns A random element from the array.
 */
const getRandomElement = <T>(arr: T[]): T => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

/**
 * Generates an array of mock Animal data.
 * @param count The number of animal objects to generate. Defaults to 10.
 * @returns An array of Animal objects.
 */
export const generateAnimalData = (count: number = 10): Animal[] => {
  const animals: Animal[] = [];

  for (let i = 0; i < count; i++) {
    const animal: Animal = {
      id: uuidv7(), // Simple sequential ID
      name: getRandomElement(animalNames),
      class: getRandomElement(animalClasses),
      diet: getRandomElement(animalDiets),
    };
    animals.push(animal);
  }

  return animals;
};