const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
    const config = {
        mode: 'production',
        entry: {
            ['kinetics']: path.join(__dirname, 'src', 'Index.ts'),
            ['kinetics.min']: path.join(__dirname, 'src', 'Index.ts'),
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'build'),
            libraryTarget: 'commonjs',
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
            ],
        },
        resolve: {
            modules: [path.join(__dirname, 'src'), 'node_modules'],
            extensions: ['.ts', '.js'],
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    include: /\.min\.js$/,
                }),
            ],
        },
    };

    if (argv.mode === 'development') {
        Object.assign(config, {
            mode: 'development',
            devtool: 'inline-source-map',
            entry: {
                index: path.join(__dirname, 'example', 'index.ts'),
            },
            output: {
                filename: '[name].js',
                path: path.resolve(__dirname, 'example/dist'),
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: path.join(__dirname, 'example', 'index.html'),
                    filename: 'index.html',
                }),
            ],
            devServer: {
                static: path.resolve(__dirname, 'example/dist'),
            },
        });
    }

    return config;
};
