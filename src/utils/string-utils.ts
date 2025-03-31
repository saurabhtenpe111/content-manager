
// Simple pluralization rules
export const pluralize = (word: string): string => {
  if (!word) return '';
  
  // Special cases
  const irregulars: Record<string, string> = {
    'person': 'people',
    'child': 'children',
    'foot': 'feet',
    'tooth': 'teeth',
    'goose': 'geese',
    'mouse': 'mice',
    'man': 'men',
    'woman': 'women',
    'ox': 'oxen',
    'leaf': 'leaves',
    'knife': 'knives',
    'life': 'lives',
    'wife': 'wives',
    'shelf': 'shelves'
  };
  
  if (irregulars[word]) {
    return irregulars[word];
  }
  
  // Common rules for English pluralization
  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || 
      word.endsWith('ch') || word.endsWith('sh')) {
    return word + 'es';
  } else if (word.endsWith('y') && !isVowel(word.charAt(word.length - 2))) {
    return word.slice(0, -1) + 'ies';
  } else if (word.endsWith('f')) {
    return word.slice(0, -1) + 'ves';
  } else if (word.endsWith('fe')) {
    return word.slice(0, -2) + 'ves';
  } else {
    return word + 's';
  }
};

// Simple singularization rules
export const singularize = (word: string): string => {
  if (!word) return '';
  
  // Special cases
  const irregulars: Record<string, string> = {
    'people': 'person',
    'children': 'child',
    'feet': 'foot',
    'teeth': 'tooth',
    'geese': 'goose',
    'mice': 'mouse',
    'men': 'man',
    'women': 'woman',
    'oxen': 'ox',
    'leaves': 'leaf',
    'knives': 'knife',
    'lives': 'life',
    'wives': 'wife',
    'shelves': 'shelf'
  };
  
  if (irregulars[word]) {
    return irregulars[word];
  }
  
  // Common rules for English singularization
  if (word.endsWith('ies')) {
    return word.slice(0, -3) + 'y';
  } else if (word.endsWith('ves')) {
    return word.slice(0, -3) + 'f';
  } else if (word.endsWith('es') && (
    word.endsWith('sses') || word.endsWith('xes') || word.endsWith('zes') || 
    word.endsWith('ches') || word.endsWith('shes'))) {
    return word.slice(0, -2);
  } else if (word.endsWith('s') && word.length > 1) {
    return word.slice(0, -1);
  }
  
  return word;
};

// Helper function to check if a character is a vowel
const isVowel = (char: string): boolean => {
  return ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());
};

// Convert camelCase to Title Case
export const camelToTitleCase = (camelCase: string): string => {
  if (!camelCase) return '';
  
  const result = camelCase
    // Insert a space before all uppercase letters
    .replace(/([A-Z])/g, ' $1')
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Ensure the first letter is capitalized
    .trim();
  
  return result.charAt(0).toUpperCase() + result.slice(1);
};

// Convert from Title Case to camelCase
export const titleToCamelCase = (titleCase: string): string => {
  if (!titleCase) return '';
  
  return titleCase
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, '');
};

// Slugify a string (convert to lowercase with hyphens)
export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};
