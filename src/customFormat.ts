// splitLines

export function splitLinesPythonStyle(str: string, keepEnds: boolean = false) {
  const s = `${str}`;
  // Regex matches all Python line boundaries
  const re = /\r\n|[\n\r\u000b\u000c\u001c\u001d\u001e\u0085\u2028\u2029]/g;

  if (keepEnds) {
    // Match lines including separators
    let result = [];
    let lastIndex = 0;
    let match;
    while ((match = re.exec(s)) !== null) {
      result.push(s.slice(lastIndex, re.lastIndex));
      lastIndex = re.lastIndex;
    }
    if (lastIndex < s.length) result.push(s.slice(lastIndex));
    return result;
  } else {
    // Split and discard separators
    return s.split(re);
  }
}

export function normalizeNewlines(of: string) {
  return splitLinesPythonStyle(of).join("\n");
}


export function parseNamedBlocks(string: string, options?: {
  duplicateDisambiguation?: "last" | "error" | "concat",
} | undefined): { [key: string]: string }
export function parseNamedBlocks(string: string, options?: {
  duplicateDisambiguation?: "array",
} | undefined): { [key: string]: string[] }
export function parseNamedBlocks(string: string, options: {
  duplicateDisambiguation?: "last" | "error" | "array" | "concat",
} | undefined = {}): { [key: string]: string | string[] } {
  const duplicateDisambiguation = options?.duplicateDisambiguation
    ?? 'last', result: any = Object.create(null),
     apply = ((key: string, stringArray: string[]) => {
      if (duplicateDisambiguation === 'error') {
        if (Object.hasOwn(result, key))
          throw TypeError(`key "${key}" appears more than once`);
      } else if (duplicateDisambiguation === 'array') {
        if (Object.hasOwn(result, key)) {
          result[key][result[key].length] = stringArray.join('\n');
        } else {
          result[key] = [stringArray.join('\n')];
        }
        return;
      } else if (duplicateDisambiguation === 'concat') {
        const value = '\n\n' + stringArray.join('\n');
        if (Object.hasOwn(result, key)) {
          result[key] += value;
        } else {
          result[key] = value;
        }
      }
      result[key] = stringArray.join('\n');
    });

  for (const element of chunkArrayAt(splitLinesPythonStyle(string), str => str === '---', true)) {
    if (element.length === 0) continue;
    const match = /^name: (.+)/i.exec(element[0])?.[1].trim();
    if (match) {
      apply(match, element.slice(1));
    } else {
      apply(String(), element);
    }
  }
  return result;
}

function chunkArrayAt<T>(array: T[], fn: (element: T, index: number, array: T[]) => boolean, skipAtSplit: boolean = false): T[][] {
  const result: T[][] = [[]]; let current = result[0], index = 0; array = Array.from(array);
  for (let element of array) {
    if (Reflect.apply(fn, array, [element, index++, array])) {
      result[result.length] = current = new Array;
      if (skipAtSplit) continue;
    }
    current[current.length] = element;
  }
  return result;
}
