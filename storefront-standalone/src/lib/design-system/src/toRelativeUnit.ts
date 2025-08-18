export const baseFontSize = 16; // By default the html base size

/**
 * Transforms a px value to rem or em, using 16px as base.
 *
 * @param args string
 * @returns string
 */
const memoizedPxToRelativeUnit = (unit: 'rem' | 'em') => {
  const cache: Record<string, string> = {};

  return (pxValue: number, fontSize = baseFontSize): string => {
    const value = parseFloat(pxValue.toString());
    const key = `${value}${fontSize}${unit}`;

    if (!cache[key]) {
      cache[key] = `${value / fontSize}${unit}`;
    }

    return cache[key];
  };
};

/**
 * Transforms any percantage value in string, float or int, to em. Value must be postfixed with symbol, eg. "100%"
 *
 * @param args string
 * @returns string
 */
const memoizedPercentageToEm = () => {
  const cache: Record<string, string> = {};

  return (percentageValue: number | string): string => {
    const num = parseFloat(percentageValue.toString());
    const key = num;

    if (!cache[key]) {
      cache[key] = `${num / 100}em`;
    }

    return cache[key];
  };
};

export const pxToRem = memoizedPxToRelativeUnit('rem');
export const pxToEm = memoizedPxToRelativeUnit('em');
export const percentageToEm = memoizedPercentageToEm();
