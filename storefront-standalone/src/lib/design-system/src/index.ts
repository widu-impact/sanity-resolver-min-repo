// Minimal design system exports to fix imports

export interface IBaseTokens {
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
}

export interface IColorTokens {
  background: Record<string, string>;
  text: Record<string, string>;
}

export const base: IBaseTokens = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};

export const color: IColorTokens = {
  background: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
  },
  text: {
    primary: '#000000',
    secondary: '#666666',
  },
};
