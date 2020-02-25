<template>
	<v-container class="pb-10">
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div v-html="compiledMarkdown" />
	</v-container>
</template>

<script>
import readMeAboutMarkDownText from '!raw-loader!../../../README.md';
const createDOMPurify = require('dompurify');
const DOMPurify = createDOMPurify(window);

const marked = require('marked');

export default {
	name: 'About',
	data () {
		return {
			readMeAboutMarkDownText
		};
	},
	computed: {
		compiledMarkdown: function () {
			let htmlFromMarkDown = marked(readMeAboutMarkDownText, { sanitize: false });			
			let cleanHtml = DOMPurify.sanitize(htmlFromMarkDown);
			return cleanHtml;
		}
	}
};
</script>
