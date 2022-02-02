let mix = require('laravel-mix');
const webpack = require('webpack')
// const dotenv = require('dotenv')
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig({
    // node: {
    //     fs: "empty"
    // },
    externals: {
      vue: 'Vue'
    },
    plugins:[
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(true),
        VERSION: JSON.stringify('5fa3b9'),
        BROWSER_SUPPORTS_HTML5: true,
        TWO: '1+1',
        'typeof window': JSON.stringify('object'),
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          INVENTORY_ENDPOINT: JSON.stringify(process.env.INVENTORY_ENDPOINT || 'http://inventory/api/'),
          CATALOGUE_ENDPOINT: JSON.stringify(process.env.CATALOGUE_ENDPOINT || 'http://catalogue/api/'),
          MARKETING_ENDPOINT: JSON.stringify(process.env.MARKETING_ENDPOINT || 'http://marketing/api/'),
          CDN_ENDPOINT: JSON.stringify(process.env.CDN_ENDPOINT || 'http://cdn/api/'),
          CDN_FILE: JSON.stringify(process.env.CDN_FILE || 'https://comximages.blob.core.windows.net/files'),
          ACCOUNTS_ENDPOINT: JSON.stringify(process.env.ACCOUNTS_ENDPOINT || 'http://customer-accounts/api/'),
          WEBSITE_ENDPOINT: JSON.stringify(process.env.WEBSITE_ENDPOINT || 'https://comms-expess.uk.com/'),
          PUSHER_APP_KEY: JSON.stringify(process.env.PUSHER_APP_KEY || '9b17d9480ab771fb4837')
        },
      })
    ]
})

mix.options({
  processCssUrls: false // Process/optimize relative stylesheet url()'s. Set to false, if you don't want them touched.
});

mix.js('resources/assets/js/app.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css')
    .copy('resources/assets/images', 'public/images')
    .webpackConfig({
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'resources/assets/js'),
                '#': path.resolve(__dirname, 'resources/assets/sass'),
            }
        }
    });
