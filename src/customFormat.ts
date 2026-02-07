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

export function parseNamedBlocks(string: string) {
  const result: any = new Object;

  for (const element of chunkArrayAt(splitLinesPythonStyle(string), str => str === '---', true)) {
    const match = /^name: (.+)/i.exec(element[0]);
    if (match) {
      result[match[1].trim()] = element.slice(1).join('\n');
    } else {
      result[''] = element.join('\n');
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
