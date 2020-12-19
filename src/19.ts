import readlines from './util/readlines';
import {sum} from './util/arrays';

type SubRule = string | number[];

type Rule = {
  index: number;
  subRules: SubRule[];
}

function parseRule(line: string): Rule {
  const [indexStr, ruleStr] = line.split(': ');
  const subRules: SubRule[] = ruleStr.split(' | ')
    .map(r => r.split(' '))
    .map(r => {
      if (!isNaN(Number(r[0]))) {
        return r.map(Number);
      }
      return r[0].charAt(1);
    });

  return {
    index: Number(indexStr),
    subRules,
  };
}

function isMatch(message: string, rulesByIdx: Map<number, Rule>, idx: number, cache: Map<number, Map<string, boolean>>): boolean {
  const rule = rulesByIdx.get(idx);
  if (typeof rule.subRules[0] === 'string') {
    return message === rule.subRules[0];
  }

  const cacheVal = cache.get(idx)?.get(message);
  if (cacheVal != null) {
    return cacheVal;
  }

  let match = false;
  for (let r of rule.subRules) {
    r = r as number[];
    if (r.length === 1) {
      match = isMatch(message, rulesByIdx, r[0], cache);
      if (match) {
        addToCache(cache, idx, message, match);
        return match;
      }
    } else {
      let maxLength = message.length - r.length + 1;
      if (maxLength <= 0) {
        continue;
      }
      for (let i = 1; i <= maxLength; ++i) {
        if (r.length === 2) {
          match = isMatch(message.substring(0, i), rulesByIdx, r[0], cache) &&
            isMatch(message.substring(i), rulesByIdx, r[1], cache);
          if (match) {
            addToCache(cache, idx, message, match);
            return match;
          }
        } else if (r.length === 3) {
          for (let j = i + 1; j < message.length; ++j) {
            match = isMatch(message.substring(0, i), rulesByIdx, r[0], cache) &&
              isMatch(message.substring(i, j), rulesByIdx, r[1], cache) &&
              isMatch(message.substring(j), rulesByIdx, r[2], cache);
            if (match) {
              addToCache(cache, idx, message, match);
              return match;
            }
          }
        }
      }
    }
  }
  addToCache(cache, idx, message, match);
  return match;
}

function addToCache(cache: Map<number, Map<string, boolean>>, idx: number, message: string, match: boolean) {
  let subcache = cache.get(idx);
  if (subcache == null) {
    subcache = new Map();
    cache.set(idx, subcache);
  }
  subcache.set(message, match);
}

export async function solve(): Promise<number> {
  // Part 1:
  // const lines = await readlines('./data/19.txt');

  // Part 2
  const lines = await readlines('./data/19-2.txt');

  const rulesEnd = lines.indexOf('');
  const rules: Rule[] = lines.slice(0, rulesEnd).map(parseRule);
  const messages: string[] = lines.slice(rulesEnd + 1);
  const rulesByIdx: Map<number, Rule> = new Map();
  rules.forEach(r => {
    rulesByIdx.set(r.index, r);
  });

  return sum(messages.map(m => isMatch(m, rulesByIdx, 0, new Map()))
    .map(match => match ? 1 : 0));
}
