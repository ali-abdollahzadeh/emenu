const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['nativewind'],
    },
  }, argv);

  // Update PostCSS configuration
  config.module.rules = config.module.rules.map(rule => {
    if (rule.oneOf) {
      rule.oneOf = rule.oneOf.map(oneOf => {
        if (oneOf.test && oneOf.test.toString().includes('css')) {
          return {
            ...oneOf,
            use: [
              ...oneOf.use,
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      require('tailwindcss'),
                      require('autoprefixer'),
                      require('nativewind/postcss'),
                    ],
                  },
                },
              },
            ],
          };
        }
        return oneOf;
      });
    }
    return rule;
  });

  return config;
}; 