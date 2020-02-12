/*
  textfill
 @name      jquery.textfill.js
 @author    Russ Painter (GeekyMonkey)
 @author    Yu-Jie Lin
 @author    Alexandre Dantas
 @version   0.6.2
 @date      2018-02-24
 @copyright (c) 2009
 @license   MIT License
 @homepage  https://github.com/jquery-textfill/jquery-textfill
 @example   http://jquery-textfill.github.io/jquery-textfill/index.html
*/
(function(k){k.fn.textfill=function(q){function e(){a.debug&&"undefined"!=typeof console&&"undefined"!=typeof console.debug&&console.debug.apply(console,arguments)}function n(b,a,f,l,m,g){function c(a,b){var c=" / ";a>b?c=" > ":a==b&&(c=" = ");return c}e("[TextFill] "+b+" { font-size: "+a.css("font-size")+",Height: "+a.height()+"px "+c(a.height(),f)+f+"px,Width: "+a.width()+c(a.width(),l)+l+",minFontPixels: "+m+"px, maxFontPixels: "+g+"px }")}function p(a,c,f,l,e,g,h,d){for(n(a,c,e,g,h,d);h<Math.floor(d)-
1;){var b=Math.floor((h+d)/2);c.css("font-size",b);var k=f.call(c);if(k<=l){if(h=b,k==l)break}else d=b;n(a,c,e,g,h,d)}c.css("font-size",d);f.call(c)<=l&&(h=d,n(a+"* ",c,e,g,h,d));return h}var a=k.extend({debug:!1,maxFontPixels:40,minFontPixels:4,innerTag:"span",widthOnly:!1,success:null,fail:null,complete:null,explicitWidth:null,explicitHeight:null,changeLineHeight:!1,truncateOnFail:!1,allowOverflow:!1},q);e("[TextFill] Start Debug");this.each(function(){var b=k(a.innerTag+":first",this);e("[TextFill] Inner text: "+
b.text());e("[TextFill] All options: ",a);e("[TextFill] Maximum sizes: { Height: "+c+"px, Width: "+f+"px }");if(b.is(":visible")){var c=a.explicitHeight||k(this).height(),f=a.explicitWidth||k(this).width(),l=b.css("font-size"),m=parseFloat(b.css("line-height"))/parseFloat(l),g=a.minFontPixels,h=0>=a.maxFontPixels?c:a.maxFontPixels,d=void 0;a.widthOnly?b.css("white-space","nowrap"):d=p("Height",b,k.fn.height,c,c,f,g,h);g=p("Width",b,k.fn.width,f,c,f,g,h);a.widthOnly?(b.css({"font-size":g}),a.changeLineHeight&&
b.parent().css("line-height",m*g+"px")):(d=Math.min(d,g),b.css("font-size",d),a.changeLineHeight&&b.parent().css("line-height",m*d+"px"));e("[TextFill] Finished { Old font-size: "+l+", New font-size: "+b.css("font-size")+" }");b.width()>f&&!a.allowOverflow||b.height()>c&&!a.widthOnly&&!a.allowOverflow?(b.css("font-size",l),a.fail&&a.fail(this),e("[TextFill] Failure { Current Width: "+b.width()+", Maximum Width: "+f+", Current Height: "+b.height()+", Maximum Height: "+c+" }")):a.success&&a.success(this)}else a.fail&&
a.fail(this),e("[TextFill] Failure { Current Width: "+b.width()+", Maximum Width: "+f+", Current Height: "+b.height()+", Maximum Height: "+c+" }")});a.complete&&a.complete(this);e("[TextFill] End Debug");return this}})(function(){return"undefined"!==typeof module&&module.exports?require("jquery"):window.jQuery}());
