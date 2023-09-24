const excludeFields = <T extends Record<string, unknown>, K extends keyof T>(
  objOrArray: T | T[],
  keysToExclude: K[]
): T | T[] => {
  if (Array.isArray(objOrArray)) {
    // Handle an array of objects
    return objOrArray.map(obj => {
      const result: Partial<T> = { ...obj };
      for (const key of keysToExclude) {
        delete result[key];
      }
      return result as T;
    });
  } else {
    // Handle a single object
    const result: Partial<T> = { ...objOrArray };
    for (const key of keysToExclude) {
      delete result[key];
    }
    return result as T;
  }
};

export default excludeFields;
