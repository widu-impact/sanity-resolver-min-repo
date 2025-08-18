import StyleDictionary from 'style-dictionary';
import type { TransformedToken } from 'style-dictionary';
import type { FormatterArguments } from 'style-dictionary/types/Format';

import { percentageToEm, pxToRem } from './toRelativeUnit';

/**
 * Mapping dictionary items to styles wrapped in media query and/or theme modifier
 *
 * @param args FormatterArguments
 * @returns string
 */
function formatThemeVariables({ dictionary, file, options }: FormatterArguments): string {
  const { outputReferences } = options;

  const output = `:root {\n${StyleDictionary.formatHelpers.formattedVariables({
    format: 'css',
    dictionary,
    outputReferences,
  })}\n}\n`;

  return StyleDictionary.formatHelpers.fileHeader({ file }) + output;
}

function formatLocalInverseVariables({ dictionary, file }: FormatterArguments): string {
  const modifiers = ['.inverse'];

  // Checks if token name includes either "fill", "stroke", or "text" as well as the word "inverse"
  const inverseTokens = dictionary.allTokens.filter(({ name }) =>
    /(?=.*\b(inverse)\b)(?=.*\b(fill|stroke|text)\b).*/.test(name),
  );

  // Find the original tokens of those that have an "inverse" variant
  const originalTokens = dictionary.allTokens.filter(({ name }) =>
    inverseTokens.some(({ name: inverseName }) =>
      inverseName.replace('-inverse', '').includes(name),
    ),
  );

  // Swap the values
  const swappedInverseTokens = inverseTokens.map((token) => ({
    ...token,
    value: originalTokens.find(({ name }) => token.name.replace('-inverse', '').includes(name))
      ?.value,
  }));

  const swappedOriginalTokens = originalTokens.map((token) => ({
    ...token,
    value: inverseTokens.find((invToken) =>
      invToken.name.replace('-inverse', '').includes(token.name),
    )?.value,
  }));

  const output = `${modifiers.join(' ')} {\n${[...swappedInverseTokens, ...swappedOriginalTokens]
    .map(({ name, value }) => `  --${name}: ${value};`)
    .join('\n')}\n}`;

  return StyleDictionary.formatHelpers.fileHeader({ file }) + output;
}

/**
 * Mapping dictionary items to an interface
 *
 * @param args FormatterArguments
 * @returns string
 */
function formatTypescriptDeclarations({ dictionary, file, options }: FormatterArguments): string {
  const { interface: interfaceName } = options;

  let output = dictionary.allProperties
    .map(({ path, name, value, comment }) => {
      let interfaceProp = `  ${name}: ${StyleDictionary.formatHelpers.getTypeScriptType(value)};`;

      if (comment) {
        interfaceProp += `// ${comment}`;
      }

      // Special "backgroundIsDim" handling, to create the type
      if (path[0] === 'color' && path[1] === 'background') {
        interfaceProp += `\n  ${name}IsDim: boolean;`;
      }

      return interfaceProp;
    })
    .join('\n');

  output = `export interface ${interfaceName} {\n${output}\n}`;

  return StyleDictionary.formatHelpers.fileHeader({ file }) + output;
}

/**
 * Adds "is-dim" value.
 * Makes darkmode handling of colors automatic instead of manual.
 * With manual handling, the same token can't differ mode-wise per brand.
 *
 * @param args TransformedToken
 * @returns string
 */
function formatColorBackgroundTokensTs({ dictionary }: FormatterArguments) {
  return dictionary.allTokens
    .map(({ name, value, extensions }) => {
      const output = [`export const ${name} = ${JSON.stringify(value)};`];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (extensions?.hasOwnProperty('is-dim')) {
        output.push(`export const ${name}IsDim = ${extensions['is-dim']};`);
      }

      return output.join('\n');
    })
    .join('\n');
}

/**
 * Transforms typography tokens from a composite token and adds additional tokens.
 * The composite token can be used by the font property (https://developer.mozilla.org/en-US/docs/Web/CSS/font) with the following values:
 *   font: <font-style> <font-variant> <font-weight> <font-stretch> <font-size>/<line-height> <font-family>;
 * The additional properties (letterSpacing, textDecoration, textCase) can't be used with the font property and is appended.
 * StyleDictionary does not support splitting up composite tokens yet, but read more at https://github.com/amzn/style-dictionary/issues/848#issuecomment-1257275868
 *
 * @param args TransformedToken
 * @returns string
 */
function transformTypographyTokens({ value, name }: TransformedToken): string {
  const entries = Object.entries(value);

  const flattenedValue = entries.reduce(
    (acc, [key, attr], i) => {
      const newLine = acc ? `${acc}\n  ` : '';
      const endLine = i + 1 === entries.length ? '' : ';';

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `${newLine}--${name}-${keyToKebab(key)}: ${attr}${endLine}`;
    },
    // Initiate with the composite token
    `${value.fontWeight} ${pxToRem(value.fontSize || 16)}/${value.lineHeight} ${value.fontFamily};`,
  );

  return flattenedValue;
}

function keyToKebab(key: string): string {
  return StyleDictionary.transform['name/cti/kebab'].transformer(
    {
      path: [key],
      value: undefined,
      name: '',
      original: { value: undefined },
      filePath: '',
      isSource: false,
    },
    { prefix: '' },
  ) as string;
}

/**
 * Transforms any percantage value in string, float or int, to em. Value must be postfixed with symbol, eg. "100%"
 *
 * @param args TransformedToken
 * @returns string
 */
function transformPercentToEm({ value }: TransformedToken): string {
  return percentageToEm(value);
}

/**
 * Match all values of type, or specifically relative values of a type
 *
 * @param TransformedToken
 * @returns boolean
 */
function matchPercentageValues({ type, path }: TransformedToken): boolean {
  const percentageTypes = ['letterSpacing', 'lineHeight'];
  const specificPath = ['spacing', 'relative'];

  return percentageTypes.includes(type) || specificPath.every((x) => path.includes(x));
}

/**
 * @param args FormatterArguments
 * @returns string
 */
function formatDictionary({ dictionary, file, options }: FormatterArguments): string {
  const output = `export const ${options.dictionary} = ${JSON.stringify(dictionary.tokens, null, 2)};`;

  return StyleDictionary.formatHelpers.fileHeader({ file }) + output;
}

/**
 * Exclude tokens defined in files that are listed in the `include` array
 *
 * @param token TransformedToken
 * @returns boolean
 */
function isSourceFilter(token: TransformedToken): boolean {
  return token.isSource;
}

export {
  formatThemeVariables,
  formatLocalInverseVariables,
  formatTypescriptDeclarations,
  formatColorBackgroundTokensTs,
  formatDictionary,
  transformTypographyTokens,
  transformPercentToEm,
  matchPercentageValues,
  isSourceFilter,
};
