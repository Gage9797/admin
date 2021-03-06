const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const os = require('os');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

webpackConfig = merge(webpackBaseConfig, {
    output: {
        publicPath: '/static/',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].chunk.js'
    },
    plugins: [
        new cleanWebpackPlugin(['static/*'], {
            root: path.resolve(__dirname, '../')
        }),
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // name: 'vendors',
            // filename: 'vendors.[hash].js'
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        }),
        new CopyWebpackPlugin([
            {
                from: 'favicon.ico'
            },
            {
                from: 'src/styles/fonts',
                to: 'fonts'
            },
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
        new HtmlWebpackPlugin({
            // title: 'iView admin v' + package.version,
            title: '茶楼智慧门店管理系统',
            favicon: './favicon.ico',
            filename: '../index.html',
            template: '!!ejs-loader!./src/template/index.ejs',
            inject: false
        })
	],
    externals: {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'iview': 'iview',
        'xlsx': 'XLSX',
        // 'tinymce': 'tinymce',
        'echarts': 'echarts'
    }
});

if (process.env.npm_config_report) {
	const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
	webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
