const path = require('path')
module.exports = {
    publicPath: '.',
    outputDir: './dist/render',
    productionSourceMap: false,
    devServer: {
        port: 8000,
    },
    css: {
        extract: true,
        sourceMap: false,
        loaderOptions: {},
        requireModuleExtension: true
    },
    configureWebpack: (config) => {
        config.entry.app = './src/ui/main.ts'
    }
}