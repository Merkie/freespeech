## mobile-device-detect

Helpers for handling mobile devices in javascript.

## Installation

To install, you can use npm or yarn:

```
npm install mobile-device-detect --save

or

yarn add mobile-device-detect
```

## Usage

Import any helper to your component, for example, in Vue.js:

```html
<script>
import { isMobile } from 'mobile-device-detect';
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: isMobile ? 'Welcome to Your Vue.js mobile App!' : 'Welcome to Your Vue.js App'
    }
  }
}
</script>

```
pass it to template: 

```html
<template>
  <div class="hello">
    {{ msg }}
  </div>
</template>
```

For react example, you can look into separated package [react-device-detect](https://github.com/duskload/react-device-detect)

### Selectors

| Property           | Return type     | Description                                                                            |
| ------------------ | -------- | -------------------------------------------------------------------------------------- |
| isMobile           | bool     | returns true if device type is `mobile` or `tablet`                                    |
| isMobileOnly       | bool     | returns true if device type is `mobile`                                                |
| isTablet           | bool     | returns true if device type is `tablet`                                                |
| isBrowser          | bool     | returns true if device type is `browser`                                               |
| isSmartTV          | bool     | returns true if device type is `smarttv`                                               |
| isWearable         | bool     | returns true if device type is `wearable`                                              |
| isConsole          | bool     | returns true if device type is `console`                                               |
| isAndroid          | bool     | returns true if os type is `Android`                                                   |
| isWinPhone         | bool     | returns true if os type is `Windows Phone`                                             |
| isIOS              | bool     | returns true if os type is `iOS`                                                       |
| isChrome           | bool     | returns true if browser is `Chrome`                                                    |
| isFirefox          | bool     | returns true if browser is `Firefox`                                                   |
| isSafari           | bool     | returns true if browser is `Safari`                                                    |
| isOpera            | bool     | returns true if browser is `Opera`                                                     |
| isIE               | bool     | returns true if browser is `Internet Explorer`                                         |
| isEdge             | bool     | returns true if browser is `Edge`                                                      |
| isYandex           | bool     | returns true if browser is `Yandex`                                                      |
| isChromium         | bool     | returns true if browser is `Chromium`                                                  |
| isMobileSafari     | bool     | returns true if browser is `Mobile Safari`                                             |
| osVersion          | string   | returns os version (e.g 7 for `Windows` or 6 for `Android`)                            |
| osName             | string   | returns os name (e.g `Windows`, `Android`)                                             |
| fullBrowserVersion | string   | returns full browser version (e.g 65.0.3325.181 for `Chrome`)                          |
| browserVersion     | string   | returns browser `major` version (e.g 65 in `Chrome` or 9 in `IE`)                      |
| browserName        | string   | returns browser name                                                                   |
| mobileVendor       | string   | returns mobile device vendor (e.g `LG`, `iPhone` etc)                                  |
| mobileModel        | string   | returns mobile device model (e.g `Nexus 5`)                                            |
| engineName         | string   | returns browser engine `name` (e.g `Gecko` for FF or `WebKit` for Chrome)              |
| engineVersion      | string   | returns engine version                                                                 |
| getUA              | string   | returns user agent                                                                     |
| deviceType         | string   | returns device type (e.g `mobile` or `tablet`)  |
| deviceDetect       | function | return data object which includes all data about device (e.g version, engine, os etc.) |

## License

MIT
