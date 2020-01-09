const webpack = require('webpack');
const apiMocker = require('webpack-api-mocker');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
		}),
		new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new HtmlWebpackPlugin({
            // title: 'iView admin v' + package.version,
            title: '0.0.茶楼智慧门店管理系统',
			filename: '../index.html',
			template: './index.dev.html',
            inject: false
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/assets/css'
            },
            {
                from: 'src/views/my-components/text-editor/tinymce'
            }
        ], {
            ignore: [
                'text-editor.vue'
            ]
		}),
		new NamedModulesPlugin()
    ],
    //设置跨域代理
    devServer: {
		openPage: 'index.dev.html',
        historyApiFallback: true,
        hot: true,
        inline: true,
        host: '127.0.0.1',
        port: 8080,
        stats: { colors: true },
        proxy: {
			// '/api/staffReport': {
            //     target: 'http://47.107.126.122:8080/app/mock/18/',
            //     // target: 'http://127.0.0.1:8080',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api': ''
            //     }
            // },
			// '/api/staff': {
            //     target: 'http://47.107.126.122:8080/app/mock/18/',
            //     // target: 'http://127.0.0.1:8080',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api': ''
            //     }
            // },

            '/api': {
                // target: 'http://120.78.133.190:8080',
				// target: 'http://127.0.0.1:8080',
				// target: 'http://47.112.133.38:80',
				target: 'https://www.lgzjuice.com:8080',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
			}
			// '/api': {
            //     target: 'http://47.107.126.122:8080/app/mock/19/',
            //     // target: 'http://127.0.0.1:8080',
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/api': ''
            //     }
            // }
        },
        // before(app) {
        //     apiMocker(app, path.resolve('./src/mocker/index.js'), {

        //     });
        // }
    }
});
