const excludeFields = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keysToExclude: K[]
): Omit<T, K> => {
  const result: Partial<T> = { ...obj };
  for (const key of keysToExclude) {
    delete result[key];
  }
  return result as Omit<T, K>;
};

export default excludeFields;
