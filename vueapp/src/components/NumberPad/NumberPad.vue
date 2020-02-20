<template>
  <v-container
    class="numberPad white"
    @keyup="keyboardInput"
  >
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text class="text-center title">
            &nbsp;{{ display }}&nbsp;
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="d-flex">
      <template v-for="n in 9">
        <v-col
          cols="4"
          :key="n"
        >
          <v-btn
            block
            @click="padInput(n)"
            x-large
            :disabled="length && input.length >= length"
          >
            {{ n }}
          </v-btn>
        </v-col>
      </template>

      <v-col cols="4">
        <v-btn
          block
          @click="backspace"
          x-large
          color="warning"
          v-if="input.length > 0"
        >
          <v-icon>backspace</v-icon>
        </v-btn>

        <v-btn
          block
          @click="close"
          x-large
          color="error"
          v-else
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="4">
        <v-btn
          block
          @click="padInput(0)"
          x-large
          :disabled="length && input.length >= length"
        >
          0
        </v-btn>
      </v-col>

      <v-col cols="4">
        <v-btn
          block
          @click="save"
          x-large
          color="success"
          :disabled="length && input.length < length"
        >
          <v-icon>done</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NumberPad',
  props: {
    length: {
      type: Number,
      default: null
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      input: ''
    };
  },
  computed: {
    display() {
      if (this.hidden) {
        return '⚫'.repeat(this.input.length);
      }

      return this.input;
    }
  },
  methods: {
    backspace() {
      if (this.input.length > 0) {
        this.input = this.input.substring(0, this.input.length - 1);
      }
    },
    close() {
      this.input = '';
      this.$emit('input', null);
    },
    keyboardInput(e) {
      if (e.key >= 0 && e.key <= 9) {
        e.preventDefault();
        this.padInput(e.key);
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        this.save();
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        this.backspace();
      }
    },
    padInput(number) {
      this.input = this.input + number;
    },
    save() {
      if (!this.length || this.input.length === this.length) {
        this.$emit('input', this.input);
        this.input = '';
      }
    }
  },
  created: function() {
    window.addEventListener('keyup', this.keyboardInput);
  },
  beforeDestroy: function() {
    window.removeEventListener('keyup', this.keyboardInput);
  }
};
</script>

<style scoped>

</style>
