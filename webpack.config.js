var htmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: {
    main: path.resolve(__dirname, './app/main'),
    // append: path.resolve(__dirname, './app/append'),
  },
  module: {
    rules: [{
      test: /\.(js|jsx)?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ] 
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ] 
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [
        'file-loader',
        'img-loader'
      ]
    }]
  },
  devServer: {
    port: 3300,
    inline: true,
    hot: true
  },
  resolve: {
    alias: {
      containers: path.resolve(__dirname, 'app/containers/'),
      components: path.resolve(__dirname, 'app/components/'),
      actions: path.resolve(__dirname, 'app/actions/'),
      reducers: path.resolve(__dirname, 'app/reducers/'),
      store: path.resolve(__dirname, 'app/store/'),
      constants: path.resolve(__dirname, 'app/constants/'),
      static: path.resolve(__dirname, 'app/static/')
    },
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, './public/template.html')
    })
  ]
};