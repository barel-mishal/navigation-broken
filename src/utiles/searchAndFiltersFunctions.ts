export function customSort(a: string, b: string, phrase: string) {
    // Check for exact match at beginning
    const aStartsWith = a.startsWith(phrase);
    const bStartsWith = b.startsWith(phrase);
    if (aStartsWith && !bStartsWith) return -1;
    if (bStartsWith && !aStartsWith) return 1;
    // Check for exact match anywhere
    const aIncludes = a.includes(phrase);
    const bIncludes = b.includes(phrase);
    if(aIncludes && !bIncludes) return -1;
    if(bIncludes && !aIncludes) return 0.95;
    // Check for containing all characters
    const chars = new Set(phrase.split(''));
    const aHasAllChars = [...chars].every(char => a.includes(char));
    const bHasAllChars = [...chars].every(char => b.includes(char));
    if(aHasAllChars && !bHasAllChars) return -1;
    if(bHasAllChars && !aHasAllChars) return 0.90;
    // If none of the above, maintain original order
    return 0;
}

export function levinshteinDistance(a: string, b: string) {
    const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    for (let i = 0; i <= a.length; i += 1) {
      distanceMatrix[0][i] = i;
    }
    for (let j = 0; j <= b.length; j += 1) {
      distanceMatrix[j][0] = j;
    }
    for (let j = 1; j <= b.length; j += 1) {
      for (let i = 1; i <= a.length; i += 1) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        distanceMatrix[j][i] = Math.min(
          distanceMatrix[j][i - 1] + 1, // deletion
          distanceMatrix[j - 1][i] + 1, // insertion
          distanceMatrix[j - 1][i - 1] + indicator, // substitution
        );
      }
    }
    return distanceMatrix[b.length][a.length];
  }

export function checkDistanceForEachWord(phrase: string, filter: string) {
    const res = phrase
    .split(' ')
    .map(word => filter
        .split(' ')
        .map(filterWord => levinshteinDistance(word, filterWord))
    .reduce((a, b) => a + b, 0))
    .reduce((a, b) => a + b, 0);
    
    return res / phrase.split(' ').length;
}