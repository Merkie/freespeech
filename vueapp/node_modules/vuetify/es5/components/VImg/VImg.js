"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("../../../src/components/VImg/VImg.sass");

var _intersect = _interopRequireDefault(require("../../directives/intersect"));

var _VResponsive = _interopRequireDefault(require("../VResponsive"));

var _console = require("../../util/console");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Styles
// Directives
// Components
// Utils

/* @vue/component */
var _default2 = _VResponsive.default.extend({
  name: 'v-img',
  directives: {
    intersect: _intersect.default
  },
  props: {
    alt: String,
    contain: Boolean,
    eager: Boolean,
    gradient: String,
    lazySrc: String,
    options: {
      type: Object,
      // For more information on types, navigate to:
      // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
      default: function _default() {
        return {
          root: undefined,
          rootMargin: undefined,
          threshold: undefined
        };
      }
    },
    position: {
      type: String,
      default: 'center center'
    },
    sizes: String,
    src: {
      type: [String, Object],
      default: ''
    },
    srcset: String,
    transition: {
      type: [Boolean, String],
      default: 'fade-transition'
    }
  },
  data: function data() {
    return {
      currentSrc: '',
      image: null,
      isLoading: true,
      calculatedAspectRatio: undefined,
      naturalWidth: undefined
    };
  },
  computed: {
    computedAspectRatio: function computedAspectRatio() {
      return Number(this.normalisedSrc.aspect || this.calculatedAspectRatio);
    },
    hasIntersect: function hasIntersect() {
      return typeof window !== 'undefined' && 'IntersectionObserver' in window;
    },
    normalisedSrc: function normalisedSrc() {
      return typeof this.src === 'string' ? {
        src: this.src,
        srcset: this.srcset,
        lazySrc: this.lazySrc,
        aspect: Number(this.aspectRatio || 0)
      } : {
        src: this.src.src,
        srcset: this.srcset || this.src.srcset,
        lazySrc: this.lazySrc || this.src.lazySrc,
        aspect: Number(this.aspectRatio || this.src.aspect)
      };
    },
    __cachedImage: function __cachedImage() {
      if (!(this.normalisedSrc.src || this.normalisedSrc.lazySrc)) return [];
      var backgroundImage = [];
      var src = this.isLoading ? this.normalisedSrc.lazySrc : this.currentSrc;
      if (this.gradient) backgroundImage.push("linear-gradient(".concat(this.gradient, ")"));
      if (src) backgroundImage.push("url(\"".concat(src, "\")"));
      var image = this.$createElement('div', {
        staticClass: 'v-image__image',
        class: {
          'v-image__image--preload': this.isLoading,
          'v-image__image--contain': this.contain,
          'v-image__image--cover': !this.contain
        },
        style: {
          backgroundImage: backgroundImage.join(', '),
          backgroundPosition: this.position
        },
        key: +this.isLoading
      });
      /* istanbul ignore if */

      if (!this.transition) return image;
      return this.$createElement('transition', {
        attrs: {
          name: this.transition,
          mode: 'in-out'
        }
      }, [image]);
    }
  },
  watch: {
    src: function src() {
      // Force re-init when src changes
      if (!this.isLoading) this.init(undefined, undefined, true);else this.loadImage();
    },
    '$vuetify.breakpoint.width': 'getSrc'
  },
  mounted: function mounted() {
    this.init();
  },
  methods: {
    init: function init(entries, observer, isIntersecting) {
      // If the current browser supports the intersection
      // observer api, the image is not observable, and
      // the eager prop isn't being used, do not load
      if (this.hasIntersect && !isIntersecting && !this.eager) return;

      if (this.normalisedSrc.lazySrc) {
        var lazyImg = new Image();
        lazyImg.src = this.normalisedSrc.lazySrc;
        this.pollForSize(lazyImg, null);
      }
      /* istanbul ignore else */


      if (this.normalisedSrc.src) this.loadImage();
    },
    onLoad: function onLoad() {
      this.getSrc();
      this.isLoading = false;
      this.$emit('load', this.src);
    },
    onError: function onError() {
      (0, _console.consoleError)("Image load failed\n\n" + "src: ".concat(this.normalisedSrc.src), this);
      this.$emit('error', this.src);
    },
    getSrc: function getSrc() {
      /* istanbul ignore else */
      if (this.image) this.currentSrc = this.image.currentSrc || this.image.src;
    },
    loadImage: function loadImage() {
      var _this = this;

      var image = new Image();
      this.image = image;

      image.onload = function () {
        /* istanbul ignore if */
        if (image.decode) {
          image.decode().catch(function (err) {
            (0, _console.consoleWarn)("Failed to decode image, trying to render anyway\n\n" + "src: ".concat(_this.normalisedSrc.src) + (err.message ? "\nOriginal error: ".concat(err.message) : ''), _this);
          }).then(_this.onLoad);
        } else {
          _this.onLoad();
        }
      };

      image.onerror = this.onError;
      image.src = this.normalisedSrc.src;
      this.sizes && (image.sizes = this.sizes);
      this.normalisedSrc.srcset && (image.srcset = this.normalisedSrc.srcset);
      this.aspectRatio || this.pollForSize(image);
      this.getSrc();
    },
    pollForSize: function pollForSize(img) {
      var _this2 = this;

      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

      var poll = function poll() {
        var naturalHeight = img.naturalHeight,
            naturalWidth = img.naturalWidth;

        if (naturalHeight || naturalWidth) {
          _this2.naturalWidth = naturalWidth;
          _this2.calculatedAspectRatio = naturalWidth / naturalHeight;
        } else {
          timeout != null && setTimeout(poll, timeout);
        }
      };

      poll();
    },
    genContent: function genContent() {
      var content = _VResponsive.default.options.methods.genContent.call(this);

      if (this.naturalWidth) {
        this._b(content.data, 'div', {
          style: {
            width: "".concat(this.naturalWidth, "px")
          }
        });
      }

      return content;
    },
    __genPlaceholder: function __genPlaceholder() {
      if (this.$slots.placeholder) {
        var placeholder = this.isLoading ? [this.$createElement('div', {
          staticClass: 'v-image__placeholder'
        }, this.$slots.placeholder)] : [];
        if (!this.transition) return placeholder[0];
        return this.$createElement('transition', {
          props: {
            appear: true,
            name: this.transition
          }
        }, placeholder);
      }
    }
  },
  render: function render(h) {
    var node = _VResponsive.default.options.render.call(this, h);

    node.data.staticClass += ' v-image'; // Only load intersect directive if it
    // will work in the current browser.

    node.data.directives = this.hasIntersect ? [{
      name: 'intersect',
      options: this.options,
      modifiers: {
        once: true
      },
      value: this.init
    }] : [];
    node.data.attrs = {
      role: this.alt ? 'img' : undefined,
      'aria-label': this.alt
    };
    node.children = [this.__cachedSizer, this.__cachedImage, this.__genPlaceholder(), this.genContent()];
    return h(node.tag, node.data, node.children);
  }
});

exports.default = _default2;
//# sourceMappingURL=VImg.js.map