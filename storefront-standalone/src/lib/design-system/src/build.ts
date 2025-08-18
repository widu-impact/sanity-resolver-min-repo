import fs from 'fs';
import sd from 'style-dictionary';

import { getBaseConfig, getColorConfig, getCoreDictionaryConfig } from './config';
import * as utils from './utils';

const BUILD_PATH = 'dist/';

if (fs.existsSync(BUILD_PATH)) {
  fs.rmSync(BUILD_PATH, { recursive: true });
}

sd.registerFormat({
  name: 'css/variables/themed',
  formatter: utils.formatThemeVariables,
});

sd.registerFormat({
  name: 'css/variables/inverse',
  formatter: utils.formatLocalInverseVariables,
});

sd.registerFormat({
  name: 'typescript/typed',
  formatter: utils.formatTypescriptDeclarations,
});

sd.registerFormat({
  name: 'typescript/color/background',
  formatter: utils.formatColorBackgroundTokensTs,
});

sd.registerFormat({
  name: 'javascript/dictionary',
  formatter: utils.formatDictionary,
});

sd.registerTransform({
  name: 'typography/composite+rest',
  type: 'value',
  transitive: true,
  matcher: ({ type }) => type === 'typography',
  transformer: utils.transformTypographyTokens,
});

sd.registerTransform({
  name: 'spacing/em',
  type: 'value',
  matcher: utils.matchPercentageValues,
  transformer: utils.transformPercentToEm,
});

const theme = process.env.NEXT_PUBLIC_BRAND;

sd.extend(getCoreDictionaryConfig({ buildPath: BUILD_PATH, theme })).buildAllPlatforms();
sd.extend(getBaseConfig({ buildPath: BUILD_PATH, theme })).buildAllPlatforms();
sd.extend(getColorConfig({ buildPath: BUILD_PATH, theme })).buildAllPlatforms();
