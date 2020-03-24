const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const postCssConfigPlugins = require( './post-css-config' );

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  ...defaultConfig,
  // We need to extend the module.rules & plugins to add the SCSS build process.
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /\.(sc|sa|c)ss$/,
        exclude: [ /node_modules/ ],
        use: [
        	MiniCssExtractPlugin.loader,
			'css-loader',
			{
				loader: 'postcss-loader',
				options: {
					ident: 'postcss',
					plugins: () => postCssConfigPlugins,
				},
			},
			'sass-loader'
		],
      },
    ],
  },

  plugins: [
    ...defaultConfig.plugins,
    new MiniCssExtractPlugin( {
      filename: '[name].css',
    } ),
  ],
};
