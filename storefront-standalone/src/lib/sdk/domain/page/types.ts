import { type InferOutput } from 'valibot';

import { type pageTypes } from './consts';
import {
  type rawHomePageSchema,
  type rawStandardPageSchema,
} from './schemas';


export type PageTypes = typeof pageTypes;

export type PageTypesUnion = PageTypes[keyof PageTypes];

export type RawHomePage = InferOutput<typeof rawHomePageSchema>;

export type RawStandardPage = InferOutput<typeof rawStandardPageSchema>;



export type HomePage = {
  type: PageTypes['P020HomePage'];
  title: string;
};

export type StandardPage = {
  type: PageTypes['P060StandardPage'];
  title: string;
};



