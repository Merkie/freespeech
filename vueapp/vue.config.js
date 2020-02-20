module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  transpileDependencies: ['vuetify'],
  pwa: {
    name: 'Freespeech',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes'
  },
  devServer:{
    disableHostCheck:true,
    port:8081,
    host:0.0.0.0
  }
};
