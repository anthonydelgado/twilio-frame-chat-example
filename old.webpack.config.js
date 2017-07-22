module.exports = {
  entry: './index.js',
  output: {
    path: './public/javascripts',
    filename: 'bundle.js',
    publicPath: '/javascripts'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: [
          'babel'
        ],
        include: './index.js',
        query: {
          presets: [
            'es2015'
          ]
        }
      }
    ]
  }
}