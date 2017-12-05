module.exports = {
    entry: './script/temp.js',
    output: {
        filename: 'index.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' }
        ]
    }
};