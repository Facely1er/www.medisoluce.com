import cssnano from 'cssnano';

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' 
      ? { 
          cssnano: cssnano({
            preset: ['default', {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              minifyFontValues: true,
              minifySelectors: true,
            }]
          })
        } 
      : {}),
  },
};
