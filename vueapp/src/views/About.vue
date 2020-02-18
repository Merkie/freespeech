<template>
  <v-container class="pb-10">
    <div v-html="compiledMarkdown" />
  </v-container>
</template>

<script>
import readMeAboutMarkDownText from '!raw-loader!../../../README.md';
const marked = require('marked');

export default {
  name: 'About',
  data() {
    return {
      readMeAboutMarkDownText
    };
  },
  computed: {
    compiledMarkdown: function() {
      return marked(readMeAboutMarkDownText, { santzie: true });
    }
  }
};
</script>
