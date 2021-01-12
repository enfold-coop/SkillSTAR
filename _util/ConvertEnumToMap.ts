export type Enum = { [key: string]: string };

export interface EnumItemMap {
  key: string;
  value: string;
}

export type EnumMap = { [key: string]: EnumItemMap };

/**
 * Returns a more useful object for the given enum.
 *
 * Given 2 enums like this:
 * enum Fruit {
 *   'apple': 'apple',
 *   'banana': 'banana',
 *   'orange': 'orange',
 * }

 * enum FruitLabels {
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
export const convertEnumToMap = (keysEnumObject: Enum, labelsEnumObject: Enum) => {
  const enumMap: EnumMap = {};
  Object.keys(keysEnumObject).forEach((key: string) => {
    enumMap[key] = { key, value: labelsEnumObject[key] };
  });
  return enumMap;
};
