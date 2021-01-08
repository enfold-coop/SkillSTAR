type Enum = { [key: string]: string };

interface EnumItemMap {
  key: string;
  value: string;
}

type EnumMap = { [key: string]: EnumItemMap };

/**
 * Returns a more useful object for the given enum.
 *
 * Given an enum like this:
 * enum Fruit {
 *   'apple': 'Apple',
 *   'banana': 'Banana',
 *   'orange': 'Orange',
 * }
 *
 * Returned object:
 * {
 *   apple: { key: 'apple', value: 'Apple' },
 *   banana: { key: 'banana', value: 'Banana' },
 *   orange: { key: 'orange', value: 'Orange' },
 * }
 *
 * @param enumObject: The enum to convert
 */
export const convertEnumToMap = (enumObject: Enum) => {
  const enumMap: EnumMap = {};
  Object.entries(enumObject).forEach(([key, value]) => {
    enumMap[key] = { key, value };
  });
  return enumMap;
};
