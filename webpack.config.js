const weback = require('webpack');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: "bundle.js"
    },
    devtool: 'source-maps',
    module: {
        rules: [
            { test: /\.js?$/, loader: 'babel-loader', exclude: /node_modules/},
            { test: /\.png$/, use: [
                {
                    loader: 'url-loader',
                    options: {
                        mimetype: 'image/png',
                    }
                }
            ]},
            { test: /\.css?$/, loader: ['style-loader', 'css-loader']},
            { test: /\.s(a|c)ss?/, loader: ['style-loader', 'css-loader', 'sass-loader']}
        
        ]
    },
    devServer: {
        contentBase: 'src',
        hot: true, 
        open: true, 
        port: 8000,
        watchContentBase: true 
    },
    plugins: [
        new webpack.HotModuleReplacemtPlugin(),
    ]
}