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
		disableHostCheck: true,
		port: 8080,
		host: '0.0.0.0'
	},
	pluginOptions: {
		i18n: {
			locale: 'en',
			fallbackLocale: 'en',
			localeDir: 'locales',
			enableInSFC: true
		}
	}
};
