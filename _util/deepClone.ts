const lodash = { cloneDeep: require('lodash.clonedeep') };

/**
 * Returns a deep clone of the given object. However, it does NOT clone class prototypes.
 * For that, you will need to run the returned object through its class constructor.
 *
 * @param original: The object to clone.
 */
export const deepClone = <T>(original: T): T => {
  return lodash.cloneDeep(original) as T;
};
