export type Enum = { [key: string]: string };

export interface EnumItemMap {
  key: string;
  value: string;
  order: number;
}

export type EnumMap = { [key: string]: EnumItemMap };

/**
 * Returns a more useful object for the given string enum and its corresponding
 * labels string enum
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
 * @param keysEnumObject: The string enum to convert
 * @param labelsEnumObject: The enum labels, which is also a string enum
 */
export const convertEnumToMap = (keysEnumObject: Enum, labelsEnumObject: Enum): EnumMap => {
  const enumMap: EnumMap = {};
  Object.keys(keysEnumObject).forEach((key: string, order: number) => {
    enumMap[key] = { key, value: labelsEnumObject[key], order };
  });
  return enumMap;
};
