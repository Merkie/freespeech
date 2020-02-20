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

	pluginOptions: {
		i18n: {
			locale: 'en',
			fallbackLocale: 'en',
			localeDir: 'locales',
			enableInSFC: true
		}
	}
};
