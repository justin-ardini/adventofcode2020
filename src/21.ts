import readlines from './util/readlines';
import {permute, sum} from './util/arrays';

type Ingredients = string[];
type Allergens = string[];

function parseLine(line: string): [Ingredients, Allergens] {
  const [ingredients, allergens] = line.split(' (contains ');
  return [ingredients.split(' '), allergens.slice(0, allergens.length - 1).split(', ')];
}

function findNonAllergens(pairs: [Ingredients, Allergens][]): [number, Map<string, string[]>, Set<string>] {
  const allergenToIngredients: Map<string, string[]> = new Map();
  for (let [ingredients, allergens] of pairs) {
    for (let allergen of allergens) {
      let possibleIngredients = allergenToIngredients.get(allergen);
      if (possibleIngredients) {
        possibleIngredients = possibleIngredients.filter(i => ingredients.includes(i));
      } else {
        possibleIngredients = [...ingredients];
      }
      allergenToIngredients.set(allergen, possibleIngredients);
    }
  }
  const allIngredients: Set<string> = new Set();
  for (let ingredients of allergenToIngredients.values()) {
    ingredients.forEach((i) => {
      allIngredients.add(i);
    });
  }
  let total = 0;
  for (let [ingredients, allergens] of pairs) {
    total += sum(ingredients.map(i => allIngredients.has(i) ? 0 : 1));
  }

  return [total, allergenToIngredients, allIngredients];
}

function orderIngredients(allergenToIngredients: Map<string, string[]>, ingredients: Set<string>): string[] {
  let allergens = [...allergenToIngredients.keys()];
  allergens.sort();
  for (let maybeIngredients of permute([...ingredients])) {
    if (isValid(allergenToIngredients, allergens, maybeIngredients)) {
      return maybeIngredients;
    }
  }
  return [];
}

function isValid(allergenToIngredients: Map<string, string[]>, allergens: string[], ingredients: string[]): boolean {
  for (let i = 0; i < allergens.length; ++i) {
    let allergen = allergens[i];
    let ingredient = ingredients[i];
    if (!allergenToIngredients.get(allergen).includes(ingredient)) {
      return false;
    }
  }
  return true;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/21.txt');
  const pairs: [Ingredients, Allergens][] = lines.map(parseLine);
  const [totalFound, allergenToIngredients, ingredients] = findNonAllergens(pairs);

  // Part 1:
  // console.log(totalFound);

  // Part 2
  console.log(orderIngredients(allergenToIngredients, ingredients).join(','));

  return 0;
}
