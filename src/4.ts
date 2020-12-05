import readlines from './util/readlines';

const FIELDS = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
  'cid',
];

const EYE_COLORS = [
  'amb',
  'blu',
  'brn',
  'gry',
  'grn',
  'hzl',
  'oth',
];
type EyeColor = typeof EYE_COLORS[number];

type HeightUnit = 'cm' | 'in';
interface Height {
  readonly value: number;
  readonly unit: HeightUnit;
}

interface Passport {
  readonly birthYear: number;
  readonly issueYear: number;
  readonly expirationYear: number;
  readonly height: Height;
  readonly hairColor: string;
  readonly eyeColor: EyeColor;
  readonly passportId: string;
  readonly countryId: string;
}

function validateYear(value: string, min: number, max: number): number|null {
  const year = Number(value);
  if (year >= min && year <= max) {
    return year;
  }
  return null;
}

function validateHeight(value: string): Height|null {
  if (value.endsWith('in') || value.endsWith('cm')) {
    const num = Number(value.substring(0, value.length - 2));
    const unit = value.substring(value.length - 2, value.length) as HeightUnit;
    let min, max;
    if (unit === 'in') {
      min = 59;
      max = 76;
    } else {
      min = 150;
      max = 193;
    }
    if (num >= min && num <= max) {
      return {value: num, unit};
    }
  }
  return null;
}

function validateHairColor(value: string): string|null {
  return value.match(/^#[0-9a-f]{6}$/) !== null ? value : null;
}

function validateEyeColor(value: string): EyeColor|null {
  if (EYE_COLORS.includes(value)) {
    return value as EyeColor;
  }
  return null;
}

function validatePassportId(value: string): string|null {
  return value.match(/^[0-9]{9}$/) !== null ? value : null;
}

function validateCountryId(value: string): string {
  return value;
}

interface LooseObject {
  [key: string]: any
}

/**
 * Parses a list of [key, value] pairs into a valid Passport, or returns null if the fields don't
 * form a valid passport.
 */
function parsePassport(fields: [string, string][]): Passport|null {
  // Require all fields but 'cid'.
  if (fields.map(f => f[0]).filter(k => k !== 'cid').length < FIELDS.length - 1) {
    return null;
  }
  const passport: LooseObject = {};
  for (let [key, value] of fields) {
    let v: unknown|null;
    switch (key) {
      case 'byr':
        passport.birthYear = v = validateYear(value, 1920, 2002);
        break;
      case 'iyr':
        passport.issueYear = v = validateYear(value, 2010, 2020);
        break;
      case 'eyr':
        passport.expirationYear = v = validateYear(value, 2020, 2030);
        break;
      case 'hgt':
        passport.height = v = validateHeight(value);
        break;
      case 'hcl':
        passport.hairColor = v = validateHairColor(value);
        break;
      case 'ecl':
        passport.eyeColor = v = validateEyeColor(value);
        break;
      case 'pid':
        passport.passportId = v = validatePassportId(value);
        break;
      case 'cid':
        passport.countryId = v = validateCountryId(value);
        break;
      default:
        // Invalid field.
        return null;
    }
    if (v === null) {
      // For part 1, remove this line.
      return null;
    }
  }
  return passport as Passport;
}

/** Returns key-value pairs in groups, where each group is separated by an empty line. */
function groupFields(lines: string[]) {
  let groups: [string, string][][] = [];
  let currGroup: [string, string][] = [];
  for (let line of lines) {
    if (line.length === 0) {
      groups.push(currGroup);
      currGroup = [];
    } else {
      const parts = line.split(' ');
      for (let part of parts) {
        const [k, v] = part.split(':');
        currGroup.push([k, v]);
      }
    }
  }
  groups.push(currGroup);
  return groups;
}

export async function solve(): Promise<number> {
  const lines = await readlines('./data/4.txt');
  const passports = groupFields(lines).map(parsePassport).filter(p => p !== null);
  return passports.length;
}
