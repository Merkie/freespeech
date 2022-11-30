import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { escape as escape$1 } from 'html-escaper';
/* empty css                               *//* empty css                                 */import { PrismaClient } from '@prisma/client';
import 'is-email';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import tailwindColors from 'tailwindcss/colors.js';
/* empty css                                 */import 'html2canvas';
import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

function check$1(Component) {
	return Component['render'] && Component['$$render'];
}

async function renderToStaticMarkup$1(Component, props, slotted) {
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		slots[key] = () =>
			`<astro-slot${key === 'default' ? '' : ` name="${key}"`}>${value}</astro-slot>`;
	}
	const { html } = Component.render(props, { $$slots: slots });
	return { html };
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.6.12";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape$1;
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const defineErrors = (errs) => errs;
const AstroErrorData = defineErrors({
  UnknownCompilerError: {
    title: "Unknown compiler error.",
    code: 1e3
  },
  StaticRedirectNotAvailable: {
    title: "`Astro.redirect` is not available in static mode.",
    code: 3001,
    message: "Redirects are only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  ClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in current adapter.",
    code: 3002,
    message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
  },
  StaticClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in static mode.",
    code: 3003,
    message: "`Astro.clientAddress` is only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  NoMatchingStaticPathFound: {
    title: "No static path found for requested path.",
    code: 3004,
    message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
    hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
  },
  OnlyResponseCanBeReturned: {
    title: "Invalid type returned by Astro page.",
    code: 3005,
    message: (route, returnedValue) => `Route ${route ? route : ""} returned a \`${returnedValue}\`. Only a Response can be returned from Astro files.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information."
  },
  MissingMediaQueryDirective: {
    title: "Missing value for `client:media` directive.",
    code: 3006,
    message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
  },
  NoMatchingRenderer: {
    title: "No matching renderer found.",
    code: 3007,
    message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are." : "is."} ${validRenderersCount} renderer${plural ? "s." : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were." : "it was not."} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
    hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.`
  },
  NoClientEntrypoint: {
    title: "No client entrypoint specified in renderer.",
    code: 3008,
    message: (componentName, clientDirective, rendererName) => `\`${componentName}\` component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by \`${rendererName}\`.`,
    hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer."
  },
  NoClientOnlyHint: {
    title: "Missing hint on client:only directive.",
    code: 3009,
    message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
    hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
  },
  InvalidGetStaticPathParam: {
    title: "Invalid value returned by a `getStaticPaths` path.",
    code: 3010,
    message: (paramType) => `Invalid params given to \`getStaticPaths\` path. Expected an \`object\`, got \`${paramType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  InvalidGetStaticPathsReturn: {
    title: "Invalid value returned by getStaticPaths.",
    code: 3011,
    message: (returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRemovedRSSHelper: {
    title: "getStaticPaths RSS helper is not available anymore.",
    code: 3012,
    message: "The RSS helper has been removed from `getStaticPaths`. Try the new @astrojs/rss package instead.",
    hint: "See https://docs.astro.build/en/guides/rss/ for more information."
  },
  GetStaticPathsExpectedParams: {
    title: "Missing params property on `getStaticPaths` route.",
    code: 3013,
    message: "Missing or empty required `params` property on `getStaticPaths` route.",
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsInvalidRouteParam: {
    title: "Invalid value for `getStaticPaths` route parameter.",
    code: 3014,
    message: (key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRequired: {
    title: "`getStaticPaths()` function required for dynamic routes.",
    code: 3015,
    message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
    hint: `See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` in your Astro config file to switch to a non-static server build.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`
  },
  ReservedSlotName: {
    title: "Invalid slot name.",
    code: 3016,
    message: (slotName) => `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`
  },
  NoAdapterInstalled: {
    title: "Cannot use Server-side Rendering without an adapter.",
    code: 3017,
    message: `Cannot use \`output: 'server'\` without an adapter. Please install and configure the appropriate server adapter for your final deployment.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information."
  },
  NoMatchingImport: {
    title: "No import found for component.",
    code: 3018,
    message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
    hint: "Please make sure the component is properly imported."
  },
  UnknownViteError: {
    title: "Unknown Vite Error.",
    code: 4e3
  },
  FailedToLoadModuleSSR: {
    title: "Could not import file.",
    code: 4001,
    message: (importName) => `Could not import \`${importName}\`.`,
    hint: "This is often caused by a typo in the import path. Please make sure the file exists."
  },
  InvalidGlob: {
    title: "Invalid glob pattern.",
    code: 4002,
    message: (globPattern) => `Invalid glob pattern: \`${globPattern}\`. Glob patterns must start with './', '../' or '/'.`,
    hint: "See https://docs.astro.build/en/guides/imports/#glob-patterns for more information on supported glob patterns."
  },
  UnknownCSSError: {
    title: "Unknown CSS Error.",
    code: 5e3
  },
  CSSSyntaxError: {
    title: "CSS Syntax Error.",
    code: 5001
  },
  UnknownMarkdownError: {
    title: "Unknown Markdown Error.",
    code: 6e3
  },
  MarkdownFrontmatterParseError: {
    title: "Failed to parse Markdown frontmatter.",
    code: 6001
  },
  UnknownConfigError: {
    title: "Unknown configuration error.",
    code: 7e3
  },
  ConfigNotFound: {
    title: "Specified configuration file not found.",
    code: 7001,
    message: (configFile) => `Unable to resolve \`--config "${configFile}"\`. Does the file exist?`
  },
  ConfigLegacyKey: {
    title: "Legacy configuration detected.",
    code: 7002,
    message: (legacyConfigKey) => `Legacy configuration detected: \`${legacyConfigKey}\`.`,
    hint: "Please update your configuration to the new format.\nSee https://astro.build/config for more information."
  },
  UnknownError: {
    title: "Unknown Error.",
    code: 99999
  }
});

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function getErrorDataByCode(code) {
  const entry = Object.entries(AstroErrorData).find((data) => data[1].code === code);
  if (entry) {
    return {
      name: entry[0],
      data: entry[1]
    };
  }
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}

class AstroError extends Error {
  constructor(props, ...params) {
    var _a;
    super(...params);
    this.type = "AstroError";
    const { code, name, title, message, stack, location, hint, frame } = props;
    this.errorCode = code;
    if (name) {
      this.name = name;
    } else {
      this.name = ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ?? "UnknownError";
    }
    this.title = title;
    if (message)
      this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setErrorCode(errorCode) {
    var _a;
    this.errorCode = errorCode;
    this.name = ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ?? "UnknownError";
  }
  setLocation(location) {
    this.loc = location;
  }
  setName(name) {
    this.name = name;
  }
  setMessage(message) {
    this.message = message;
  }
  setHint(hint) {
    this.hint = hint;
  }
  setFrame(source, location) {
    this.frame = codeFrame(source, location);
  }
  static is(err) {
    return err.type === "AstroError";
  }
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}
function isPromise(value) {
  return !!value && typeof value === "object" && typeof value.then === "function";
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(displayName, inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(AstroErrorData.MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.error = void 0;
    this.expressions = expressions.map((expression) => {
      if (isPromise(expression)) {
        return Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
      }
      return expression;
    });
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let parts = new HTMLParts();
  for await (const chunk of renderAstroComponent(Component)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
class Skip {
  constructor(vnode) {
    this.vnode = vnode;
    this.count = 0;
  }
  increment() {
    this.count++;
  }
  haveNoTried() {
    return this.count === 0;
  }
  isCompleted() {
    return this.count > 2;
  }
}
Skip.symbol = Symbol("astro:jsx:skip");
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  let skip;
  if (vnode.props) {
    if (vnode.props[Skip.symbol]) {
      skip = vnode.props[Skip.symbol];
    } else {
      skip = new Skip(vnode);
    }
  } else {
    skip = new Skip(vnode);
  }
  return renderJSXVNode(result, vnode, skip);
}
async function renderJSXVNode(result, vnode, skip) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skip.increment();
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (skip.haveNoTried() || skip.isCompleted()) {
          useConsoleFilter();
          try {
            const output2 = await vnode.type(vnode.props ?? {});
            let renderResult;
            if (output2 && output2[AstroJSX]) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            } else if (!output2) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            }
          } catch (e) {
            if (skip.isCompleted()) {
              throw e;
            }
            skip.increment();
          } finally {
            finishUsingConsoleFilter();
          }
        } else {
          skip.increment();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      props[Skip.symbol] = skip;
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid", "@astrojs/vue (jsx)"];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}, route) {
  var _a, _b;
  Component = await Component ?? Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const { slotInstructions: slotInstructions2, children: children2 } = await renderSlots(result, slots);
      const html2 = Component.render({ slots: children2 });
      const hydrationHtml = slotInstructions2 ? slotInstructions2.map((instr) => stringifyChunk(result, instr)).join("") : "";
      return markHTMLString(hydrationHtml + html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(displayName, _props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...AstroErrorData.NoClientOnlyHint,
        message: AstroErrorData.NoClientOnlyHint.message(metadata.displayName),
        hint: AstroErrorData.NoClientOnlyHint.hint(
          probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
        )
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...AstroErrorData.NoMatchingRenderer,
          message: AstroErrorData.NoMatchingRenderer.message(
            metadata.displayName,
            (_b = metadata == null ? void 0 : metadata.componentUrl) == null ? void 0 : _b.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: AstroErrorData.NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new AstroError({
      ...AstroErrorData.NoClientEntrypoint,
      message: AstroErrorData.NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      )
    });
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
function renderHead(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const $$Astro$c = createAstro("/Users/macbookpro/Desktop/freespeech/src/pages/index.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$Index$8 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Index$8;
  return renderTemplate`<html lang="en">
  <head>
    <meta charset="utf-8">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="viewport" content="width=device-width">
    <meta name="generator"${addAttribute(Astro2.generator, "content")}>
    <title>Astro</title>
  ${renderHead($$result)}</head>
  <body>
    <h1>Astro</h1>
  </body></html>`;
});

const $$file$9 = "/Users/macbookpro/Desktop/freespeech/src/pages/index.astro";
const $$url$9 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index$8,
	file: $$file$9,
	url: $$url$9
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$b = createAstro("/Users/macbookpro/Desktop/freespeech/src/pages/dashboard/index.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$Index$7 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Index$7;
  return Astro2.redirect("/dashboard/projects");
});

const $$file$8 = "/Users/macbookpro/Desktop/freespeech/src/pages/dashboard/index.astro";
const $$url$8 = "/dashboard";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index$7,
	file: $$file$8,
	url: $$url$8
}, Symbol.toStringTag, { value: 'Module' }));

function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function set_store_value(store, ret, value) {
    store.set(value);
    return ret;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
Promise.resolve();
const ATTR_REGEX = /[&"]/g;
const CONTENT_REGEX = /[&<]/g;
/**
 * Note: this method is performance sensitive and has been optimized
 * https://github.com/sveltejs/svelte/pull/5701
 */
function escape(value, is_attr = false) {
    const str = String(value);
    const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
    pattern.lastIndex = 0;
    let escaped = '';
    let last = 0;
    while (pattern.test(str)) {
        const i = pattern.lastIndex - 1;
        const ch = str[i];
        escaped += str.substring(last, i) + (ch === '&' ? '&amp;' : (ch === '"' ? '&quot;' : '&lt;'));
        last = i + 1;
    }
    return escaped + str.substring(last);
}
function each(items, fn) {
    let str = '';
    for (let i = 0; i < items.length; i += 1) {
        str += fn(items[i], i);
    }
    return str;
}
const missing_component = {
    $$render: () => ''
};
function validate_component(component, name) {
    if (!component || !component.$$render) {
        if (name === 'svelte:component')
            name += ' this={...}';
        throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules. Otherwise you may need to fix a <${name}>.`);
    }
    return component;
}
let on_destroy;
function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots, context) {
        const parent_component = current_component;
        const $$ = {
            on_destroy,
            context: new Map(context || (parent_component ? parent_component.$$.context : [])),
            // these will be immediately discarded
            on_mount: [],
            before_update: [],
            after_update: [],
            callbacks: blank_object()
        };
        set_current_component({ $$ });
        const html = fn(result, props, bindings, slots);
        set_current_component(parent_component);
        return html;
    }
    return {
        render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
            on_destroy = [];
            const result = { title: '', head: '', css: new Set() };
            const html = $$render(result, props, {}, $$slots, context);
            run_all(on_destroy);
            return {
                html,
                css: {
                    code: Array.from(result.css).map(css => css.code).join('\n'),
                    map: null // TODO
                },
                head: result.title + result.head
            };
        },
        $$render
    };
}
function add_attribute(name, value, boolean) {
    if (value == null || (boolean && !value))
        return '';
    const assignment = (boolean && value === true) ? '' : `="${escape(value, true)}"`;
    return ` ${name}${assignment}`;
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

const AppMode = writable("home");
const Me$1 = writable({});
const EditModeToolSelection = writable("");
const CurrentProject = writable(
  {}
);
const CurrentPage = writable("Home");
const TextEditTileId = writable("");
const TileEditQueue = writable({});
const Loading = writable(false);
const EditingSpeakText = writable(false);
const EditModeColorSelectedValue = writable("500");
const EditModeColorSelectedShade = writable("gray");
const EditModeColorSelectedType = writable("border");
const EditModeSwapTile = writable(null);
const PageHistory = writable(["Home"]);
const PageIndex = writable(0);
const ModalCreateProjectOpen = writable(false);
const storedMe = localStorage.getItem("me");
try {
  if (storedMe)
    Me$1.set(JSON.parse(storedMe));
} catch {
}
Me$1.subscribe((value) => {
  localStorage.setItem("me", JSON.stringify(value));
});
const storedCurrentProject = localStorage.getItem("currentProject");
try {
  if (storedCurrentProject)
    CurrentProject.set(JSON.parse(storedCurrentProject));
} catch {
}
CurrentProject.subscribe((value) => {
  localStorage.setItem("currentProject", JSON.stringify(value));
});

/* src/components/StoreManager.svelte generated by Svelte v3.53.1 */

const StoreManager = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $Me, $$unsubscribe_Me;
	$$unsubscribe_Me = subscribe(Me$1, value => $Me = value);
	let { _Me = null } = $$props;

	if (_Me.email) {
		set_store_value(Me$1, $Me = _Me, $Me);
	}

	if ($$props._Me === void 0 && $$bindings._Me && _Me !== void 0) $$bindings._Me(_Me);
	$$unsubscribe_Me();
	return ``;
});

const pc = new PrismaClient();

async function Me(cookie) {
  const token = await pc.accessToken.findUnique({
    where: {
      token: cookie?.split("=")[1] + ""
    }
  });
  if (token) {
    return await pc.user.findUnique({
      where: {
        id: token.userId
      },
      include: {
        projects: true
      }
    });
  }
  return {};
}

const $$Astro$a = createAstro("/Users/macbookpro/Desktop/freespeech/src/layouts/DefaultLayout.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$DefaultLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$DefaultLayout;
  const { title } = Astro2.props;
  let user = await Me(Astro2.request.headers.get("cookie") + "");
  return renderTemplate`<html lang="en">
  <head>
    <meta charset="utf-8">
    <!-- <meta name="viewport" content="width=device-width, initial-scale=0.85" /> -->
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">

    <title>${title}</title>
  ${renderHead($$result)}</head>
  <body class="text-gray-50">
    ${renderSlot($$result, $$slots["default"])}
    ${renderComponent($$result, "StoreManager", StoreManager, { "client:load": true, "_Me": user, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/StoreManager.svelte", "client:component-export": "default" })}
  </body></html>`;
});

const $$Astro$9 = createAstro("/Users/macbookpro/Desktop/freespeech/src/layouts/DashboardLayout.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$DashboardLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$DashboardLayout;
  const { selected } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "DefaultLayout", $$DefaultLayout, { "title": "Dashboard" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="h-full min-h-screen bg-gray-900 flex flex-col">
    <header class="bg-blue-500 border border-x-0 border-t-0 border-blue-600 p-2 px-4 flex items-center">
      <h1 class="font-bold text-2xl">
        FreeSpeech <span class="font-light text-lg">Dashboard</span>
      </h1>
      <div class="flex-1"></div>
      <a href="/app" class="bg-gray-50 text-blue-600 p-2 px-4 rounded-md flex gap-2 items-center">App <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
        </svg>
      </a>
    </header>
    <div class="w-full max-w-[1200px] mx-auto flex-1 flex">
      <section class="p-4 h-max flex flex-col items-baseline gap-2 border border-y-0 border-l-0 border-gray-700">
        <a href="/dashboard/projects"${addAttribute(`flex justify-center items-center gap-2 text-xl ${selected === "projects" ? "text-gray-50" : "text-gray-400"}`, "class")}>
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3"></path>
          </svg>
          <p>Projects</p>
        </a>
        <a href="/dashboard/account"${addAttribute(`flex justify-center items-center gap-2 text-xl ${selected === "account" ? "text-gray-50" : "text-gray-400"}`, "class")}>
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"></path>
          </svg>
          <p>Account</p>
        </a>
        <a href="/dashboard/settings"${addAttribute(`flex justify-center items-center gap-2 text-xl ${selected === "settings" ? "text-gray-50" : "text-gray-400"}`, "class")}>
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"></path>
          </svg>
          <p>Settings</p>
        </a>
        <a href="/dashboard/community"${addAttribute(`flex justify-center items-center gap-2 text-xl ${selected === "community" ? "text-gray-50" : "text-gray-400"}`, "class")}>
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"></path>
          </svg>
          <p>Community</p>
        </a>
      </section>
      <section class="flex-1 h-full p-4">
        ${renderSlot($$result, $$slots["default"])}
      </section>
    </div>
  </main>` })}`;
});

const $$Astro$8 = createAstro("/Users/macbookpro/Desktop/freespeech/src/pages/dashboard/community/index.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$Index$6 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Index$6;
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "selected": "community" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<h1>Hello!</h1>` })}`;
});

const $$file$7 = "/Users/macbookpro/Desktop/freespeech/src/pages/dashboard/community/index.astro";
const $$url$7 = "/dashboard/community";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index$6,
	file: $$file$7,
	url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

/* node_modules/svelte-material-icons/ArrowRightBold.svelte generated by Svelte v3.53.1 */

const ArrowRightBold = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* src/components/Modal.svelte generated by Svelte v3.53.1 */

const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { editsMade = false } = $$props;
	let { links = false } = $$props;
	let { close } = $$props;
	let { save } = $$props;
	if ($$props.editsMade === void 0 && $$bindings.editsMade && editsMade !== void 0) $$bindings.editsMade(editsMade);
	if ($$props.links === void 0 && $$bindings.links && links !== void 0) $$bindings.links(links);
	if ($$props.close === void 0 && $$bindings.close && close !== void 0) $$bindings.close(close);
	if ($$props.save === void 0 && $$bindings.save && save !== void 0) $$bindings.save(save);

	return `<main style="${"background: rgba(0,0,0,0.5)"}" class="${"fixed top-0 left-0 z-20 grid h-full min-h-screen w-full place-items-center"}"><div class="${"flex w-full max-w-[500px] flex-col gap-2 border border-gray-700 bg-gray-800 p-4 sm:rounded-md"}">${slots.default ? slots.default({}) : ``}
    <div class="${"flex gap-4"}"><button class="${"flex-1 rounded-md border border-gray-400 bg-gray-500 p-2 text-center"}">Cancel</button>
      <button ${!editsMade ? "disabled" : ""} class="${"flex-1 rounded-md border border-blue-400 bg-blue-500 p-2 text-center"}">Save</button></div></div>
  ${links
	? `<div class="${"fixed bottom-5 right-5 flex w-[200px] flex-col gap-4"}"><a href="${"/dashboard/projects"}" class="${"flex items-center justify-center gap-2 rounded-md border border-gray-500 bg-gray-800 p-4 text-xl text-gray-50 shadow-xl"}">Dashboard ${validate_component(ArrowRightBold, "ArrowRightBold").$$render($$result, {}, {}, {})}</a></div>`
	: ``}</main>`;
});

/* src/components/dashboard/ModalCreateProject.svelte generated by Svelte v3.53.1 */

const ModalCreateProject = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $ModalCreateProjectOpen, $$unsubscribe_ModalCreateProjectOpen;
	let $$unsubscribe_Me;
	$$unsubscribe_ModalCreateProjectOpen = subscribe(ModalCreateProjectOpen, value => $ModalCreateProjectOpen = value);
	$$unsubscribe_Me = subscribe(Me$1, value => value);
	let name;
	let description;
	let columns;
	let rows;
	let editsMade = false;

	const createProject = async () => {
		{
			alert("Please fill out all fields");
			return;
		}
	};

	$$unsubscribe_ModalCreateProjectOpen();
	$$unsubscribe_Me();

	return `${$ModalCreateProjectOpen
	? `${validate_component(Modal, "Modal").$$render(
			$$result,
			{
				editsMade,
				links: false,
				close: () => $ModalCreateProjectOpen = false,
				save: createProject
			},
			{},
			{
				default: () => {
					return `<h1 class="${"text-2xl font-bold"}">Settings</h1>
    <p class="${"text-gray-300"}">Project Name</p>
    <input class="${"gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"}" type="${"text"}"${add_attribute("value", name, 0)}>
    <p class="${"text-gray-300"}">Project Description</p>
    <input class="${"gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"}" type="${"text"}"${add_attribute("value", description, 0)}>
    <p class="${"text-gray-300"}">Project Columns</p>
    <input class="${"gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"}" type="${"number"}" placeholder="${"8"}"${add_attribute("value", columns, 0)}>
    <p class="${"text-gray-300"}">Project Rows</p>
    <input class="${"gb-gray-100 mb-2 rounded-md border-gray-200 p-2 text-gray-700"}" type="${"number"}" placeholder="${"6"}"${add_attribute("value", rows, 0)}>`;
				}
			}
		)}`
	: ``}`;
});

/* src/components/dashboard/ProjectGrid.svelte generated by Svelte v3.53.1 */

const ProjectGrid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $Me, $$unsubscribe_Me;
	let $$unsubscribe_CurrentProject;
	let $$unsubscribe_CurrentPage;
	let $$unsubscribe_ModalCreateProjectOpen;
	$$unsubscribe_Me = subscribe(Me$1, value => $Me = value);
	$$unsubscribe_CurrentProject = subscribe(CurrentProject, value => value);
	$$unsubscribe_CurrentPage = subscribe(CurrentPage, value => value);
	$$unsubscribe_ModalCreateProjectOpen = subscribe(ModalCreateProjectOpen, value => value);
	$$unsubscribe_Me();
	$$unsubscribe_CurrentProject();
	$$unsubscribe_CurrentPage();
	$$unsubscribe_ModalCreateProjectOpen();

	return `<div class="${"grid w-fit grid-cols-3 grid-rows-3 flex-wrap justify-center gap-4"}">${each($Me.projects || [], project => {
		return `<button style="${""}" class="${"min-h-[150px] grow rounded-md border border-gray-700 bg-gray-800 p-4 text-left"}"><span><img${add_attribute("src", project.thumbnail, 0)} alt="${"thumbnail"}" class="${"max-h-[150px] w-full rounded-md object-cover"}">
        <h1 class="${"my-2 text-xl font-medium"}">${escape(project.name)}</h1>
        <p class="${"font-light"}">${escape(project.description)}</p></span>
    </button>`;
	})}
  <button class="${"grid min-h-[150px] w-full place-items-center rounded-md border border-dashed"}"><span class="${"text-4xl"}">+</span></button></div>`;
});

const $$Astro$7 = createAstro("/Users/macbookpro/Desktop/freespeech/src/pages/dashboard/projects/index.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$Index$5 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Index$5;
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "selected": "projects" }, { "default": () => renderTemplate`${renderComponent($$result, "ModalCreateProject", ModalCreateProject, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/dashboard/ModalCreateProject.svelte", "client:component-export": "default" })}${maybeRenderHead($$result)}<h1 class="font-medium text-2xl mb-4">Your Projects</h1>${renderComponent($$result, "ProjectGrid", ProjectGrid, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/dashboard/ProjectGrid.svelte", "client:component-export": "default" })}` })}`;
});

const $$file$6 = "/Users/macbookpro/Desktop/freespeech/src/pages/dashboard/projects/index.astro";
const $$url$6 = "/dashboard/projects";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index$5,
	file: $$file$6,
	url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$6 = createAstro("/Users/macbookpro/Desktop/freespeech/src/pages/dashboard/settings/index.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$Index$4 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Index$4;
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "selected": "settings" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<h1>Hello!</h1>` })}`;
});

const $$file$5 = "/Users/macbookpro/Desktop/freespeech/src/pages/dashboard/settings/index.astro";
const $$url$5 = "/dashboard/settings";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index$4,
	file: $$file$5,
	url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

/* src/components/dashboard/Account.svelte generated by Svelte v3.53.1 */

const Account = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `
<h1>Account!</h1>`;
});

const $$Astro$5 = createAstro("/Users/macbookpro/Desktop/freespeech/src/pages/dashboard/account/index.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$Index$3 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Index$3;
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "selected": "account" }, { "default": () => renderTemplate`${renderComponent($$result, "Account", Account, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/dashboard/Account.svelte", "client:component-export": "default" })}` })}`;
});

const $$file$4 = "/Users/macbookpro/Desktop/freespeech/src/pages/dashboard/account/index.astro";
const $$url$4 = "/dashboard/account";

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index$3,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const logo = "/assets/logo-white.42403a04.png";

const della = "/assets/della-portal-splash.c322b672.png";

/* src/components/portal/PortalForm.svelte generated by Svelte v3.53.1 */

const PortalForm = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { isLogin } = $$props;
	let email;
	let name;
	let password;
	let confirmPassword;

	if ($$props.isLogin === void 0 && $$bindings.isLogin && isLogin !== void 0) $$bindings.isLogin(isLogin);

	return `<div class="${"flex w-full flex-col"}"><p>${escape(isLogin ? "Your email" : "Add your email")}</p>
  <input${add_attribute(
		"class",
		`${"mb-4"} rounded-sm border ${"border-gray-300"} bg-gray-200 p-2 text-gray-500`,
		0
	)} type="${"text"}"${add_attribute("this", email, 0)}>
  ${``}
  ${``}
  ${!isLogin
	? `<p>Add your name</p>
    <input class="${"mb-4 rounded-sm border border-gray-300 bg-gray-200 p-2 text-gray-500"}" type="${"text"}"${add_attribute("this", name, 0)}>`
	: ``}
  <p>${escape(isLogin ? "Your password" : "Choose a password")}</p>
  <input${add_attribute(
		"class",
		`rounded-sm border ${"border-gray-300"}  bg-gray-200 p-2 text-gray-500`,
		0
	)} type="${"password"}"${add_attribute("this", password, 0)}>
  ${!isLogin
	? `<p${add_attribute("class", `mb-4 text-sm ${"text-gray-400"}`, 0)}>Min 6 characters
    </p>
    <p>Confirm your password</p>
    <input${add_attribute(
			"class",
			`rounded-sm border ${"border-gray-300"}  bg-gray-200 p-2 text-gray-500`,
			0
		)} type="${"password"}"${add_attribute("this", confirmPassword, 0)}>`
	: ``}
  <button class="${"my-4 flex justify-center rounded-md border border-blue-400 bg-blue-600 p-2 text-blue-50"}">${escape(isLogin ? "Log in" : "Create account")}</button>
  <p>${escape(isLogin
	? "Don't have an account?"
	: "Already have an account?")}
    <a class="${"text-sm text-blue-500 underline"}"${add_attribute("href", isLogin ? "/portal/signup" : "/portal/login", 0)}>${escape(isLogin ? "Create one instead" : "Log in instead")}</a></p></div>`;
});

const $$Astro$4 = createAstro("/Users/macbookpro/Desktop/freespeech/src/layouts/PortalLayout.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$PortalLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$PortalLayout;
  const { isLogin } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "DefaultLayout", $$DefaultLayout, { "title": "Portal" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<main class="h-screen bg-blue-600 sm:bg-gradient-to-b sm:from-gray-800 sm:to-gray-900 text-gray-50">
    <a class="absolute -translate-x-0 top-4 left-4 flex gap-2 items-center" href="/">
      <img${addAttribute(logo, "src")} alt="free speech logo" width="30px" height="30px">
      <h1 class="font-bold text-2xl">
        FreeSpeech <span class="font-light">AAC</span>
      </h1>
    </a>

    <div class="flex flex-col sm:grid sm:grid-cols-2 sm:grid-rows-1 w-full max-w-[700px] py-8 sm:py-0 sm:h-[700px] bg-gray-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <section class="h-full w-full bg-blue-500 hidden sm:block">
        <img class="w-full h-full object-cover opacity-75"${addAttribute(della, "src")} alt="">
      </section>
      <section class="h-full w-full p-4 text-gray-900 flex flex-col g-4 justify-center">
        <h1 class="font-medium text-2xl mb-4">
          ${isLogin ? "Log in" : "Join FreeSpeech"}
        </h1>
        ${renderComponent($$result, "PortalForm", PortalForm, { "client:load": true, "isLogin": isLogin, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/portal/PortalForm.svelte", "client:component-export": "default" })}
      </section>
    </div>
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-blue-50 sm:text-gray-400 flex">
      <a class="hover:text-gray-50" href="https://github.com/merkie/freespeech" target="_blank">
        <svg style="width:45px;height:45px;" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"></path>
        </svg>
      </a>
      <a class="hover:text-gray-50" href="/docs">
        <svg style="width:45px;height:45px;" viewBox="0 0 24 24">
          <path fill="currentColor" d="M18,22A2,2 0 0,0 20,20V4C20,2.89 19.1,2 18,2H12V9L9.5,7.5L7,9V2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18Z"></path>
        </svg>
      </a>
    </div>
  </main>` })}`;
});

const $$Astro$3 = createAstro("/Users/macbookpro/Desktop/freespeech/src/pages/portal/signup/index.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$Index$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Index$2;
  return renderTemplate`${renderComponent($$result, "PortalLayout", $$PortalLayout, { "isLogin": false })}`;
});

const $$file$3 = "/Users/macbookpro/Desktop/freespeech/src/pages/portal/signup/index.astro";
const $$url$3 = "/portal/signup";

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index$2,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro("/Users/macbookpro/Desktop/freespeech/src/pages/portal/login/index.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Index$1;
  return renderTemplate`${renderComponent($$result, "PortalLayout", $$PortalLayout, { "isLogin": true })}`;
});

const $$file$2 = "/Users/macbookpro/Desktop/freespeech/src/pages/portal/login/index.astro";
const $$url$2 = "/portal/login";

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index$1,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro("/Users/macbookpro/Desktop/freespeech/src/pages/404.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$404 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$404;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", `<main class="h-screen w-screen bg-blue-500 grid place-items-center text-gray-50">
  <div class="flex flex-col items-center">
    <h1 class="text-5xl font-bold text-center">404</h1>
    <p>We didn't find the page you're looking for</p>
    <a class="underline" href="/">We're taking you back home now, click here to get there faster</a>
    <script>
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        window.location.assign("/");
      })();
    <\/script>
  </div>
</main>`])), maybeRenderHead($$result));
});

const $$file$1 = "/Users/macbookpro/Desktop/freespeech/src/pages/404.astro";
const $$url$1 = "/404";

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$404,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const post$b = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const user = await Me(request.headers.get("cookie") + "");
  if (!user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const body = await request.json();
  const project = await pc.project.create({
    data: {
      name: body.name,
      description: body.description || "",
      columns: body.columns || 8,
      rows: body.rows || 6,
      user: {
        connect: {
          id: user.id
        }
      },
      pages: {
        create: {
          name: "Home"
        }
      }
    }
  });
  return new Response(JSON.stringify({ success: true, project }), {
    status: 200
  });
};

const _page9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post: post$b
}, Symbol.toStringTag, { value: 'Module' }));

const post$a = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const user = await Me(request.headers.get("cookie") + "");
  if (!user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const body = await request.json();
  const _project = await pc.project.findFirst({
    where: { id: body.id }
  });
  if (_project?.userId !== user.id)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  await pc.project.delete({
    where: {
      id: body.id
    }
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

const _page10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post: post$a
}, Symbol.toStringTag, { value: 'Module' }));

const post$9 = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const user = await Me(request.headers.get("cookie") + "");
  const body = await request.json();
  const project = await pc.project.findFirst({
    where: { id: body.id },
    include: {
      pages: {
        include: {
          tiles: true
        }
      }
    }
  });
  if (project?.userId === user.id || project?.visibility === "public")
    return new Response(JSON.stringify({ success: true, project }));
  return new Response(JSON.stringify({ success: false }), { status: 401 });
};

const _page11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post: post$9
}, Symbol.toStringTag, { value: 'Module' }));

const post$8 = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const user = await Me(request.headers.get("cookie") + "");
  if (!user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const body = await request.json();
  const _project = await pc.project.findFirst({
    where: { id: body.id }
  });
  if (_project?.userId !== user.id)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const project = await pc.project.update({
    where: {
      id: body.id
    },
    data: {
      name: body.name || _project.name,
      description: body.description || _project.description,
      thumbnail: body.thumbnail || _project.thumbnail,
      columns: body.columns || _project.columns,
      rows: body.rows || _project.rows,
      visibility: body.visibility || _project.visibility
    }
  });
  return new Response(JSON.stringify({ success: true, project }));
};

const _page12 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post: post$8
}, Symbol.toStringTag, { value: 'Module' }));

dotenv.config();
const s3 = new S3Client({ region: process.env.S3_REGION });

const post$7 = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const user = await Me(request.headers.get("cookie") + "");
  if (!user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const body = await request.json();
  if (!["png", "jpg", "jpeg", "gif"].includes(body.ext))
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const fileData = body.base64.split(",")[1];
  const fileBuffer = Buffer.from(fileData, "base64");
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: `${Date.now()}.${body.ext}`,
    Body: fileBuffer
  });
  await s3.send(command);
  const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${command.input.Key}`;
  return new Response(JSON.stringify({ success: true, url }), { status: 200 });
};

const _page13 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post: post$7
}, Symbol.toStringTag, { value: 'Module' }));

const post$6 = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const user = await Me(request.headers.get("cookie") + "");
  if (!user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const body = await request.json();
  const project = await pc.project.findUnique({
    where: {
      id: body.projectId
    }
  });
  if (project?.userId !== user.id)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const page = await pc.page.create({
    data: {
      name: body.name,
      project: {
        connect: {
          id: body.projectId
        }
      }
    },
    include: {
      tiles: true
    }
  });
  return new Response(JSON.stringify({ success: true, page }), {
    status: 200
  });
};

const _page14 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post: post$6
}, Symbol.toStringTag, { value: 'Module' }));

const post$5 = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const user = await Me(request.headers.get("cookie") + "");
  if (!user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const body = await request.json();
  const page = await pc.page.findUnique({
    where: {
      id: body.pageId
    },
    include: {
      project: {
        include: {
          user: true
        }
      }
    }
  });
  if (page?.project.user.id !== user.id)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const tile = await pc.tile.create({
    data: {
      x: body.x,
      y: body.y,
      page: {
        connect: {
          id: body.pageId
        }
      }
    }
  });
  return new Response(JSON.stringify({ success: true, tile }), {
    status: 200
  });
};

const _page15 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post: post$5
}, Symbol.toStringTag, { value: 'Module' }));

const post$4 = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const user = await Me(request.headers.get("cookie") + "");
  if (!user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const body = await request.json();
  const _tile = await pc.tile.findFirst({
    where: { id: body.id },
    include: {
      page: {
        include: {
          project: true
        }
      }
    }
  });
  if (_tile?.page.project.userId !== user.id)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  await pc.tile.delete({
    where: {
      id: body.id
    }
  });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

const _page16 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post: post$4
}, Symbol.toStringTag, { value: 'Module' }));

const post$3 = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const user = await Me(request.headers.get("cookie") + "");
  if (!user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const body = await request.json();
  body.tiles.forEach(async (tile) => {
    const _tile = await pc.tile.findUnique({
      where: {
        id: tile.id
      },
      include: {
        page: {
          include: {
            project: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });
    if (_tile?.page.project.user.id !== user.id)
      return;
    await pc.tile.update({
      where: {
        id: tile.id
      },
      data: {
        ...tile
      }
    });
  });
  return new Response(JSON.stringify({ success: true }), {
    status: 200
  });
};

const _page17 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post: post$3
}, Symbol.toStringTag, { value: 'Module' }));

const post$2 = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const { email } = await request.json();
  const user = await pc.user.findUnique({
    where: { email }
  });
  return new Response(
    JSON.stringify({ taken: user ? true : false, success: true }),
    {
      status: 200
    }
  );
};

const _page18 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post: post$2
}, Symbol.toStringTag, { value: 'Module' }));

const post$1 = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const { email, password, name, userAgent } = await request.json();
  const user = await pc.user.findUnique({
    where: { email }
  });
  if (user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await pc.user.create({
    data: {
      email,
      hashedPassword,
      name
    }
  });
  const token = await pc.accessToken.create({
    data: {
      user: {
        connect: {
          id: createdUser.id
        }
      },
      userAgent
    },
    include: {
      user: true
    }
  });
  delete token.user.hashedPassword;
  return {
    body: JSON.stringify({
      success: true,
      token
    })
  };
};

const _page19 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post: post$1
}, Symbol.toStringTag, { value: 'Module' }));

const post = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json")
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  const { email, password, userAgent } = await request.json();
  const user = await pc.user.findUnique({
    where: { email }
  });
  if (!user)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const passwordMatch = await bcrypt.compare(
    password,
    user.hashedPassword + ""
  );
  if (!passwordMatch)
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  const token = await pc.accessToken.create({
    data: {
      user: {
        connect: {
          id: user.id
        }
      },
      userAgent
    },
    include: {
      user: true
    }
  });
  delete token.user.hashedPassword;
  return {
    body: JSON.stringify({
      success: true,
      token
    })
  };
};

const _page20 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	post
}, Symbol.toStringTag, { value: 'Module' }));

/* src/components/app/EditHeaderSelect.svelte generated by Svelte v3.53.1 */

const EditHeaderSelect = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { values } = $$props;
	let { defaultValue } = $$props;
	let { submitValue } = $$props;
	let selectedValue = defaultValue;
	if ($$props.values === void 0 && $$bindings.values && values !== void 0) $$bindings.values(values);
	if ($$props.defaultValue === void 0 && $$bindings.defaultValue && defaultValue !== void 0) $$bindings.defaultValue(defaultValue);
	if ($$props.submitValue === void 0 && $$bindings.submitValue && submitValue !== void 0) $$bindings.submitValue(submitValue);

	return `<div class="${"relative flex h-[40px] cursor-pointer items-center gap-2 rounded-md bg-gray-900 p-2 font-medium capitalize text-gray-50 sm:rounded-none"}"><p>${escape(selectedValue)}</p>
  <svg style="${"width:24px;height:24px"}" viewBox="${"0 0 24 24"}"><path fill="${"currentColor"}" d="${"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"}"></path></svg>
  ${``}</div>
${``}`;
});

/* src/components/app/EditModeColorPicker.svelte generated by Svelte v3.53.1 */

const EditModeColorPicker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $EditModeToolSelection, $$unsubscribe_EditModeToolSelection;
	let $EditModeColorSelectedShade, $$unsubscribe_EditModeColorSelectedShade;
	let $EditModeColorSelectedValue, $$unsubscribe_EditModeColorSelectedValue;
	$$unsubscribe_EditModeToolSelection = subscribe(EditModeToolSelection, value => $EditModeToolSelection = value);
	$$unsubscribe_EditModeColorSelectedShade = subscribe(EditModeColorSelectedShade, value => $EditModeColorSelectedShade = value);
	$$unsubscribe_EditModeColorSelectedValue = subscribe(EditModeColorSelectedValue, value => $EditModeColorSelectedValue = value);
	let colors = {};

	for (const color in tailwindColors) {
		if ([
			"gray",
			"red",
			"orange",
			// "amber",
			"yellow",
			// "lime",
			"green",
			// "emerald",
			// "teal",
			"cyan",
			// "sky",
			"blue",
			// "indigo",
			// "violet",
			"purple",
			// "fuchsia",
			"pink"
		].includes(color)) {
			colors[color] = tailwindColors[color]; // "rose",
		}
	}

	$$unsubscribe_EditModeToolSelection();
	$$unsubscribe_EditModeColorSelectedShade();
	$$unsubscribe_EditModeColorSelectedValue();

	return `${$EditModeToolSelection === "color"
	? `<div class="${"flex h-[40px] items-center justify-center gap-2 rounded-md bg-gray-900 px-2 sm:rounded-none"}">${each(Object.keys(colors), color => {
			return `<button${add_attribute("style", `background-color: ${colors[color][parseInt($EditModeColorSelectedValue)]}`, 0)}${add_attribute(
				"class",
				`h-[27px] w-[27px] ${$EditModeColorSelectedShade === color
				? "rounded-full ring-2 ring-gray-50"
				: ""} rounded-md`,
				0
			)}></button>`;
		})}
    ${validate_component(EditHeaderSelect, "EditHeaderSelect").$$render(
			$$result,
			{
				defaultValue: "500",
				values: [
					"50 (lightest)",
					"100",
					"200",
					"300",
					"400",
					"500",
					"600",
					"700",
					"800",
					"900 (darkest)"
				],
				submitValue: value => $EditModeColorSelectedValue = value.split(" ")[0]
			},
			{},
			{}
		)}</div>`
	: ``}`;
});

/* src/components/app/EditModeHeader.svelte generated by Svelte v3.53.1 */

const EditModeHeader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $AppMode, $$unsubscribe_AppMode;
	let $EditModeToolSelection, $$unsubscribe_EditModeToolSelection;
	let $$unsubscribe_EditingSpeakText;
	let $$unsubscribe_EditModeColorSelectedType;
	let $TileEditQueue, $$unsubscribe_TileEditQueue;
	$$unsubscribe_AppMode = subscribe(AppMode, value => $AppMode = value);
	$$unsubscribe_EditModeToolSelection = subscribe(EditModeToolSelection, value => $EditModeToolSelection = value);
	$$unsubscribe_EditingSpeakText = subscribe(EditingSpeakText, value => value);
	$$unsubscribe_EditModeColorSelectedType = subscribe(EditModeColorSelectedType, value => value);
	$$unsubscribe_TileEditQueue = subscribe(TileEditQueue, value => $TileEditQueue = value);
	$$unsubscribe_AppMode();
	$$unsubscribe_EditModeToolSelection();
	$$unsubscribe_EditingSpeakText();
	$$unsubscribe_EditModeColorSelectedType();
	$$unsubscribe_TileEditQueue();

	return `${$AppMode === "edit"
	? `<section class="${"flex min-h-[40px] w-full flex-wrap items-center gap-2 bg-gray-800 p-1 px-2 text-gray-50 sm:px-2 sm:py-0"}"><p class="${"flex h-[40px] items-center gap-2 text-gray-300"}">Current Tool: <span class="${"h-[40px] rounded-md bg-gray-900 p-2 font-medium capitalize text-gray-50 sm:rounded-none"}">${escape($EditModeToolSelection || "none")}</span></p>

    ${$EditModeToolSelection === "text"
		? `<p>Mode:</p>
      <select class="${"h-[40px] rounded-md bg-gray-900 p-2 font-medium capitalize text-gray-50 sm:rounded-none"}"><option value="${"display"}">Display</option><option value="${"speak"}">Speak</option></select>
      <p>Tip: Click or tap on a tile to edit its text.</p>`
		: ``}

    ${$EditModeToolSelection === "color"
		? `<p>Mode:</p>
      ${validate_component(EditHeaderSelect, "EditHeaderSelect").$$render(
				$$result,
				{
					defaultValue: "border",
					values: ["border", "background", "text"],
					submitValue: value => value
				},
				{},
				{}
			)}
      ${validate_component(EditModeColorPicker, "EditModeColorPicker").$$render($$result, {}, {}, {})}`
		: ``}

    ${Object.keys($TileEditQueue).length > 0
		? `<button class="${"rounded-md border border-green-500 bg-green-600 p-1"}">Save Changes
      </button>`
		: ``}</section>`
	: ``}`;
});

/* node_modules/svelte-material-icons/FormatText.svelte generated by Svelte v3.53.1 */

const FormatText = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/Image.svelte generated by Svelte v3.53.1 */

const Image = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/ImageOutline.svelte generated by Svelte v3.53.1 */

const ImageOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/Palette.svelte generated by Svelte v3.53.1 */

const Palette = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/PaletteOutline.svelte generated by Svelte v3.53.1 */

const PaletteOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2C17.5,2 22,6 22,11A6,6 0 0,1 16,17H14.2C13.9,17 13.7,17.2 13.7,17.5C13.7,17.6 13.8,17.7 13.8,17.8C14.2,18.3 14.4,18.9 14.4,19.5C14.5,20.9 13.4,22 12,22M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C12.3,20 12.5,19.8 12.5,19.5C12.5,19.3 12.4,19.2 12.4,19.1C12,18.6 11.8,18.1 11.8,17.5C11.8,16.1 12.9,15 14.3,15H16A4,4 0 0,0 20,11C20,7.1 16.4,4 12,4M6.5,10C7.3,10 8,10.7 8,11.5C8,12.3 7.3,13 6.5,13C5.7,13 5,12.3 5,11.5C5,10.7 5.7,10 6.5,10M9.5,6C10.3,6 11,6.7 11,7.5C11,8.3 10.3,9 9.5,9C8.7,9 8,8.3 8,7.5C8,6.7 8.7,6 9.5,6M14.5,6C15.3,6 16,6.7 16,7.5C16,8.3 15.3,9 14.5,9C13.7,9 13,8.3 13,7.5C13,6.7 13.7,6 14.5,6M17.5,10C18.3,10 19,10.7 19,11.5C19,12.3 18.3,13 17.5,13C16.7,13 16,12.3 16,11.5C16,10.7 16.7,10 17.5,10Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/CursorMove.svelte generated by Svelte v3.53.1 */

const CursorMove = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/Bookmark.svelte generated by Svelte v3.53.1 */

const Bookmark = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/BookmarkOutline.svelte generated by Svelte v3.53.1 */

const BookmarkOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M17,18L12,15.82L7,18V5H17M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/Folder.svelte generated by Svelte v3.53.1 */

const Folder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/FolderOutline.svelte generated by Svelte v3.53.1 */

const FolderOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/Link.svelte generated by Svelte v3.53.1 */

const Link = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/Delete.svelte generated by Svelte v3.53.1 */

const Delete = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/DeleteOutline.svelte generated by Svelte v3.53.1 */

const DeleteOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/Cog.svelte generated by Svelte v3.53.1 */

const Cog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/CogOutline.svelte generated by Svelte v3.53.1 */

const CogOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* src/components/app/EditModeSideBar.svelte generated by Svelte v3.53.1 */

const EditModeSideBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $AppMode, $$unsubscribe_AppMode;
	let $EditModeToolSelection, $$unsubscribe_EditModeToolSelection;
	$$unsubscribe_AppMode = subscribe(AppMode, value => $AppMode = value);
	$$unsubscribe_EditModeToolSelection = subscribe(EditModeToolSelection, value => $EditModeToolSelection = value);

	const EditButtons = [
		{
			name: "text",
			outlineIcon: FormatText,
			solidIcon: FormatText
		},
		{
			name: "image",
			outlineIcon: ImageOutline,
			solidIcon: Image
		},
		{
			name: "color",
			outlineIcon: PaletteOutline,
			solidIcon: Palette
		},
		{
			name: "move",
			outlineIcon: CursorMove,
			solidIcon: CursorMove
		},
		{
			name: "accent",
			outlineIcon: BookmarkOutline,
			solidIcon: Bookmark
		},
		// {
		//   name: "invisible",
		//   outlineIcon: EyeOffOutline,
		//   solidIcon: EyeOff,
		// },
		{
			name: "folder",
			outlineIcon: FolderOutline,
			solidIcon: Folder
		},
		{
			name: "link",
			outlineIcon: Link,
			solidIcon: Link
		},
		{
			name: "delete",
			outlineIcon: DeleteOutline,
			solidIcon: Delete
		},
		{
			name: "settings",
			outlineIcon: CogOutline,
			solidIcon: Cog
		}
	];

	$$unsubscribe_AppMode();
	$$unsubscribe_EditModeToolSelection();

	return `${$AppMode === "edit"
	? `<div class="${"z-10 flex w-[75px] flex-col"}"><div class="${"w-[75px] p-1 text-center"}"><h1>Tools</h1></div>
    <div${add_attribute("class", `grid flex-1 grid-cols-1 grid-rows-${EditButtons.length + 1} gap-2 bg-gray-800 p-2`, 0)}>${each(EditButtons, EditBtn => {
			return `<button${add_attribute(
				"class",
				`border shadow-md ${$EditModeToolSelection === EditBtn.name
				? "border-gray-600 bg-gray-700 text-gray-50"
				: "border-gray-700"} flex flex-col items-center justify-center gap-2 rounded-md p-2`,
				0
			)}>${validate_component(EditBtn.outlineIcon || missing_component, "svelte:component").$$render(
				$$result,
				{
					color: $EditModeToolSelection === EditBtn.name
					? "#f9fafb"
					: "#9ca3af",
					size: "25px"
				},
				{},
				{}
			)}
          
        </button>`;
		})}</div></div>`
	: ``}`;
});

/* src/components/app/Loader.svelte generated by Svelte v3.53.1 */

const css$1 = {
	code: ".lds-spinner.svelte-op3hun.svelte-op3hun{color:official;display:inline-block;position:relative;width:80px;height:80px}.lds-spinner.svelte-op3hun div.svelte-op3hun{transform-origin:40px 40px;animation:svelte-op3hun-lds-spinner 1.2s linear infinite}.lds-spinner.svelte-op3hun div.svelte-op3hun:after{content:\" \";display:block;position:absolute;top:3px;left:37px;width:6px;height:18px;border-radius:20%;background:#fff}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(1){transform:rotate(0deg);animation-delay:-1.1s}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(2){transform:rotate(30deg);animation-delay:-1s}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(3){transform:rotate(60deg);animation-delay:-0.9s}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(4){transform:rotate(90deg);animation-delay:-0.8s}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(5){transform:rotate(120deg);animation-delay:-0.7s}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(6){transform:rotate(150deg);animation-delay:-0.6s}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(7){transform:rotate(180deg);animation-delay:-0.5s}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(8){transform:rotate(210deg);animation-delay:-0.4s}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(9){transform:rotate(240deg);animation-delay:-0.3s}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(10){transform:rotate(270deg);animation-delay:-0.2s}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(11){transform:rotate(300deg);animation-delay:-0.1s}.lds-spinner.svelte-op3hun div.svelte-op3hun:nth-child(12){transform:rotate(330deg);animation-delay:0s}@keyframes svelte-op3hun-lds-spinner{0%{opacity:1}100%{opacity:0}}",
	map: null
};

const Loader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $Loading, $$unsubscribe_Loading;
	$$unsubscribe_Loading = subscribe(Loading, value => $Loading = value);
	$$result.css.add(css$1);
	$$unsubscribe_Loading();

	return `${$Loading
	? `<main style="${"background: rgba(0,0,0,0.75)"}" class="${"fixed top-0 left-0 z-40 grid h-screen w-full place-items-center"}"><div class="${"lds-spinner svelte-op3hun"}"><div class="${"svelte-op3hun"}"></div>
      <div class="${"svelte-op3hun"}"></div>
      <div class="${"svelte-op3hun"}"></div>
      <div class="${"svelte-op3hun"}"></div>
      <div class="${"svelte-op3hun"}"></div>
      <div class="${"svelte-op3hun"}"></div>
      <div class="${"svelte-op3hun"}"></div>
      <div class="${"svelte-op3hun"}"></div>
      <div class="${"svelte-op3hun"}"></div>
      <div class="${"svelte-op3hun"}"></div>
      <div class="${"svelte-op3hun"}"></div>
      <div class="${"svelte-op3hun"}"></div></div></main>`
	: ``}`;
});

/* src/components/app/ModalProjectSettings.svelte generated by Svelte v3.53.1 */

const ModalProjectSettings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $$unsubscribe_Loading;
	let $EditModeToolSelection, $$unsubscribe_EditModeToolSelection;
	let $CurrentProject, $$unsubscribe_CurrentProject;
	$$unsubscribe_Loading = subscribe(Loading, value => value);
	$$unsubscribe_EditModeToolSelection = subscribe(EditModeToolSelection, value => $EditModeToolSelection = value);
	$$unsubscribe_CurrentProject = subscribe(CurrentProject, value => $CurrentProject = value);
	let name = $CurrentProject.name;
	let description = $CurrentProject.description;
	let columns = $CurrentProject.columns;
	let rows = $CurrentProject.rows;
	let isPrivate = $CurrentProject.visibility === "private";
	let editsMade = false;

	const saveChanges = async () => {
		{
			alert("Please fill out all fields");
			return;
		}
	};

	$$unsubscribe_Loading();
	$$unsubscribe_EditModeToolSelection();
	$$unsubscribe_CurrentProject();

	return `${$EditModeToolSelection === "settings"
	? `${validate_component(Modal, "Modal").$$render(
			$$result,
			{
				editsMade,
				links: true,
				close: () => $EditModeToolSelection = "",
				save: saveChanges
			},
			{},
			{
				default: () => {
					return `<h1 class="${"text-2xl font-bold"}">Settings</h1>
    <p class="${"text-gray-300"}">Project Name</p>
    <input class="${"gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"}" type="${"text"}"${add_attribute("value", name, 0)}>
    <p class="${"text-gray-300"}">Project Description</p>
    <input class="${"gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"}" type="${"text"}"${add_attribute("value", description, 0)}>
    <p class="${"text-gray-300"}">Project Columns</p>
    <input class="${"gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"}" type="${"number"}"${add_attribute("value", columns, 0)}>
    <p class="${"text-gray-300"}">Project Rows</p>
    <input class="${"gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"}" type="${"number"}"${add_attribute("value", rows, 0)}>
    <span class="${"flex justify-between"}"><p class="${"text-gray-300"}">Private Project</p>
      <input class="${"gb-gray-100 rounded-md border-gray-200 p-2 text-gray-700"}" type="${"checkbox"}"${add_attribute("checked", isPrivate, 1)}></span>`;
				}
			}
		)}`
	: ``}`;
});

/* node_modules/svelte-material-icons/KeyboardOutline.svelte generated by Svelte v3.53.1 */

const KeyboardOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M4,5A2,2 0 0,0 2,7V17A2,2 0 0,0 4,19H20A2,2 0 0,0 22,17V7A2,2 0 0,0 20,5H4M4,7H20V17H4V7M5,8V10H7V8H5M8,8V10H10V8H8M11,8V10H13V8H11M14,8V10H16V8H14M17,8V10H19V8H17M5,11V13H7V11H5M8,11V13H10V11H8M11,11V13H13V11H11M14,11V13H16V11H14M17,11V13H19V11H17M8,14V16H16V14H8Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/Keyboard.svelte generated by Svelte v3.53.1 */

const Keyboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M19,10H17V8H19M19,13H17V11H19M16,10H14V8H16M16,13H14V11H16M16,17H8V15H16M7,10H5V8H7M7,13H5V11H7M8,11H10V13H8M8,8H10V10H8M11,11H13V13H11M11,8H13V10H11M20,5H4C2.89,5 2,5.89 2,7V17A2,2 0 0,0 4,19H20A2,2 0 0,0 22,17V7C22,5.89 21.1,5 20,5Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/HomeOutline.svelte generated by Svelte v3.53.1 */

const HomeOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22L12 3Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/Home.svelte generated by Svelte v3.53.1 */

const Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/PencilOutline.svelte generated by Svelte v3.53.1 */

const PencilOutline = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* node_modules/svelte-material-icons/Pencil.svelte generated by Svelte v3.53.1 */

const Pencil = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* src/components/app/Navigation.svelte generated by Svelte v3.53.1 */

const Navigation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $PageIndex, $$unsubscribe_PageIndex;
	let $PageHistory, $$unsubscribe_PageHistory;
	let $CurrentPage, $$unsubscribe_CurrentPage;
	let $AppMode, $$unsubscribe_AppMode;
	$$unsubscribe_PageIndex = subscribe(PageIndex, value => $PageIndex = value);
	$$unsubscribe_PageHistory = subscribe(PageHistory, value => $PageHistory = value);
	$$unsubscribe_CurrentPage = subscribe(CurrentPage, value => $CurrentPage = value);
	$$unsubscribe_AppMode = subscribe(AppMode, value => $AppMode = value);

	// Define data for Navigation Buttons
	const NavigationButtons = [
		{
			name: "home",
			outlineIcon: HomeOutline,
			solidIcon: Home,
			onClick: () => {
				if ($AppMode === "home") {
					set_store_value(CurrentPage, $CurrentPage = "Home", $CurrentPage);
					set_store_value(PageHistory, $PageHistory = ["Home"], $PageHistory);
					set_store_value(PageIndex, $PageIndex = 0, $PageIndex);
				}
			}
		},
		{
			name: "keyboard",
			outlineIcon: KeyboardOutline,
			solidIcon: Keyboard
		},
		{
			name: "edit",
			outlineIcon: PencilOutline,
			solidIcon: Pencil
		}
	];

	$$unsubscribe_PageIndex();
	$$unsubscribe_PageHistory();
	$$unsubscribe_CurrentPage();
	$$unsubscribe_AppMode();

	return `<section class="${"flex gap-2 border border-x-0 border-b-0 border-gray-600 bg-gray-800 p-2"}">${each(NavigationButtons, NavBtn => {
		return `<button${add_attribute(
			"class",
			`flex flex-1 items-center justify-center gap-2 rounded-md border p-2 text-xl capitalize ${$AppMode === NavBtn.name
			? "border-blue-500 bg-blue-600"
			: "border-gray-600 bg-gray-700"}`,
			0
		)} ${NavBtn.disabled ? "disabled" : ""}>${validate_component(
			($AppMode === NavBtn.name
			? NavBtn.solidIcon
			: NavBtn.outlineIcon) || missing_component,
			"svelte:component"
		).$$render($$result, { color: "white", size: "25px" }, {}, {})}
      
      <span class="${"hidden sm:inline"}">${escape(NavBtn.name)}</span>
    </button>`;
	})}</section>`;
});

/* node_modules/svelte-material-icons/Backspace.svelte generated by Svelte v3.53.1 */

const Backspace = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M22,3H7C6.31,3 5.77,3.35 5.41,3.88L0,12L5.41,20.11C5.77,20.64 6.31,21 7,21H22A2,2 0 0,0 24,19V5A2,2 0 0,0 22,3M19,15.59L17.59,17L14,13.41L10.41,17L9,15.59L12.59,12L9,8.41L10.41,7L14,10.59L17.59,7L19,8.41L15.41,12"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* src/components/app/SentenceBuilder.svelte generated by Svelte v3.53.1 */

const SentenceBuilder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	return `<div class="${"flex h-[100px] w-full items-center bg-gray-100 text-gray-900"}"><div class="${"flex-1"}"><div></div></div>
  <button class="${"grid h-full place-items-center p-4"}">${validate_component(Backspace, "Backspace").$$render($$result, { color: tailwindColors.gray[900], size: "40px" }, {}, {})}</button>
  </div>`;
});

/* node_modules/svelte-material-icons/Plus.svelte generated by Svelte v3.53.1 */

const Plus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let { size = "1em" } = $$props;
	let { width = size } = $$props;
	let { height = size } = $$props;
	let { color = "currentColor" } = $$props;
	let { viewBox = "0 0 24 24" } = $$props;
	if ($$props.size === void 0 && $$bindings.size && size !== void 0) $$bindings.size(size);
	if ($$props.width === void 0 && $$bindings.width && width !== void 0) $$bindings.width(width);
	if ($$props.height === void 0 && $$bindings.height && height !== void 0) $$bindings.height(height);
	if ($$props.color === void 0 && $$bindings.color && color !== void 0) $$bindings.color(color);
	if ($$props.viewBox === void 0 && $$bindings.viewBox && viewBox !== void 0) $$bindings.viewBox(viewBox);
	return `<svg${add_attribute("width", width, 0)}${add_attribute("height", height, 0)}${add_attribute("viewBox", viewBox, 0)}><path d="${"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"}"${add_attribute("fill", color, 0)}></path></svg>`;
});

/* src/components/app/Tile.svelte generated by Svelte v3.53.1 */

const Tile = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $$unsubscribe_PageHistory;
	let $$unsubscribe_CurrentPage;
	let $$unsubscribe_PageIndex;
	let $AppMode, $$unsubscribe_AppMode;
	let $$unsubscribe_CurrentProject;
	let $EditModeToolSelection, $$unsubscribe_EditModeToolSelection;
	let $$unsubscribe_TileEditQueue;
	let $$unsubscribe_EditModeSwapTile;
	let $$unsubscribe_EditModeColorSelectedType;
	let $$unsubscribe_EditModeColorSelectedValue;
	let $$unsubscribe_EditModeColorSelectedShade;
	let $TextEditTileId, $$unsubscribe_TextEditTileId;
	let $EditingSpeakText, $$unsubscribe_EditingSpeakText;
	$$unsubscribe_PageHistory = subscribe(PageHistory, value => value);
	$$unsubscribe_CurrentPage = subscribe(CurrentPage, value => value);
	$$unsubscribe_PageIndex = subscribe(PageIndex, value => value);
	$$unsubscribe_AppMode = subscribe(AppMode, value => $AppMode = value);
	$$unsubscribe_CurrentProject = subscribe(CurrentProject, value => value);
	$$unsubscribe_EditModeToolSelection = subscribe(EditModeToolSelection, value => $EditModeToolSelection = value);
	$$unsubscribe_TileEditQueue = subscribe(TileEditQueue, value => value);
	$$unsubscribe_EditModeSwapTile = subscribe(EditModeSwapTile, value => value);
	$$unsubscribe_EditModeColorSelectedType = subscribe(EditModeColorSelectedType, value => value);
	$$unsubscribe_EditModeColorSelectedValue = subscribe(EditModeColorSelectedValue, value => value);
	$$unsubscribe_EditModeColorSelectedShade = subscribe(EditModeColorSelectedShade, value => value);
	$$unsubscribe_TextEditTileId = subscribe(TextEditTileId, value => $TextEditTileId = value);
	$$unsubscribe_EditingSpeakText = subscribe(EditingSpeakText, value => $EditingSpeakText = value);
	let { tile } = $$props;
	let tileTextRef;
	let dragging = false;
	let img;

	const url2base64 = async url => {
		return await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				xhr.onload = () => {
					const reader = new FileReader();

					reader.onloadend = () => {
						resolve(reader.result);
					};

					reader.readAsDataURL(xhr.response);
				};

				xhr.open("GET", url);
				xhr.responseType = "blob";
				xhr.send();
			});
	};

	if ($$props.tile === void 0 && $$bindings.tile && tile !== void 0) $$bindings.tile(tile);

	{
		try {
			if (tile.image) {
				url2base64(tile.image).then(base64 => {
					img = "data:image/png;base64," + (base64 + "").split(",")[1];
				});
			}
		} catch(e) {
			console.error(e);
		}
	}

	$$unsubscribe_PageHistory();
	$$unsubscribe_CurrentPage();
	$$unsubscribe_PageIndex();
	$$unsubscribe_AppMode();
	$$unsubscribe_CurrentProject();
	$$unsubscribe_EditModeToolSelection();
	$$unsubscribe_TileEditQueue();
	$$unsubscribe_EditModeSwapTile();
	$$unsubscribe_EditModeColorSelectedType();
	$$unsubscribe_EditModeColorSelectedValue();
	$$unsubscribe_EditModeColorSelectedShade();
	$$unsubscribe_TextEditTileId();
	$$unsubscribe_EditingSpeakText();

	return `<button${add_attribute(
		"style",
		`
    --bg: ${tile.backgroundColor || tailwindColors["gray"]["50"]};
    --border: ${tile.borderColor || tailwindColors["gray"]["900"]};
    --text: ${tile.textColor || tailwindColors["gray"]["900"]};
    background: var(--bg);
    border: 2px solid var(--border);
    color: var(--text);
  `,
		0
	)} class="${"relative flex h-full w-full flex-col rounded-md"}">
  ${tile.navigationPageName
	? `<div style="${"left: -2px; border-top-right-radius: 10px; border-top-left-radius: 10px; background: var(--bg); border-color: var(--border);"}" class="${"absolute top-1 h-[10px] w-1/2 -translate-y-full border-2 border-b-0"}"></div>`
	: ``}

  
  <div class="${"absolute top-0 left-0 h-full w-full overflow-hidden"}"><div style="${"background: var(--border)"}"${add_attribute(
		"class",
		`absolute h-[50px] w-[50px] rotate-45 ${tile.accented
		? "-top-[30px] -right-[30px]"
		: "-top-[50px] -right-[50px]"}`,
		0
	)}></div></div>

  
  ${tile.image || dragging
	? `<div class="${"h-1/2 w-full flex-1"}"><img${add_attribute("src", tile.image, 0)} alt="${"Loading..."}" width="${"40%"}" class="${"mx-auto h-full object-contain pt-1"}"></div>`
	: ``}

  
  <div${add_attribute("class", `grid h-${tile.image ? "1/2" : "full"} w-full flex-1 place-items-center text-xl`, 0)}><p${add_attribute("contenteditable", $AppMode === "edit" && $EditModeToolSelection === "text" && $TextEditTileId === tile.id, 0)}${add_attribute("this", tileTextRef, 0)}>${escape($EditingSpeakText && $EditModeToolSelection === "text" && $AppMode === "edit"
	? tile.speakText || ""
	: tile.text)}</p></div></button>


<input class="${"hidden"}" type="${"file"}">

`;
});

/* src/components/app/TileGrid.svelte generated by Svelte v3.53.1 */

const css = {
	code: "@media(max-width: 750px){main.svelte-1t6xwg6{grid-template-columns:repeat(4, 1fr) !important}}",
	map: null
};

const TileGrid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $PageIndex, $$unsubscribe_PageIndex;
	let $PageHistory, $$unsubscribe_PageHistory;
	let $CurrentProject, $$unsubscribe_CurrentProject;
	let $$unsubscribe_Me;
	let $$unsubscribe_CurrentPage;
	let $AppMode, $$unsubscribe_AppMode;
	$$unsubscribe_PageIndex = subscribe(PageIndex, value => $PageIndex = value);
	$$unsubscribe_PageHistory = subscribe(PageHistory, value => $PageHistory = value);
	$$unsubscribe_CurrentProject = subscribe(CurrentProject, value => $CurrentProject = value);
	$$unsubscribe_Me = subscribe(Me$1, value => value);
	$$unsubscribe_CurrentPage = subscribe(CurrentPage, value => value);
	$$unsubscribe_AppMode = subscribe(AppMode, value => $AppMode = value);
	let { lag = 0 } = $$props;
	let tiles = [];
	let tgElement;

	if ($$props.lag === void 0 && $$bindings.lag && lag !== void 0) $$bindings.lag(lag);
	$$result.css.add(css);

	{
		try {
			tiles = Array.from(
				{
					length: ($CurrentProject.columns || 10) * ($CurrentProject.rows || 6)
				},
				(_, i) => i
			).map((_, i) => {
				let x = i % ($CurrentProject.columns || 10) + 1;
				let y = Math.floor(i / ($CurrentProject.columns || 10)) + 1;
				return $CurrentProject.pages.find(p => p.name === $PageHistory[$PageHistory.length - 1 - $PageIndex - lag])?.tiles.find(t => t.x === x && t.y === y);
			});
		} catch {
			
		}
	}

	$$unsubscribe_PageIndex();
	$$unsubscribe_PageHistory();
	$$unsubscribe_CurrentProject();
	$$unsubscribe_Me();
	$$unsubscribe_CurrentPage();
	$$unsubscribe_AppMode();

	return `<main${add_attribute(
		"style",
		`
    grid-template-columns: repeat(${$CurrentProject.columns || "10"}, 1fr);
    grid-template-rows: repeat(${$CurrentProject.rows || "6"}, 1fr);
  `,
		0
	)} class="${"grid h-full w-full gap-2 p-2 text-gray-900 svelte-1t6xwg6"}"${add_attribute("this", tgElement, 0)}>${tiles.length > 0
	? `${each(tiles, (tile, i) => {
			return `${tile
			? `${validate_component(Tile, "Tile").$$render($$result, { tile }, {}, {})}`
			: `${$AppMode === "edit"
				? `<button class="${"grid h-full w-full place-items-center rounded-md border-2 border-dashed border-gray-300 text-gray-300"}">${validate_component(Plus, "Plus").$$render($$result, { size: 30 }, {}, {})}
        </button>`
				: `<div></div>`}`}`;
		})}`
	: ``}
</main>`;
});

/* src/components/app/TileGridNav.svelte generated by Svelte v3.53.1 */

const TileGridNav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
	let $PageHistory, $$unsubscribe_PageHistory;
	let $PageIndex, $$unsubscribe_PageIndex;
	$$unsubscribe_PageHistory = subscribe(PageHistory, value => $PageHistory = value);
	$$unsubscribe_PageIndex = subscribe(PageIndex, value => $PageIndex = value);
	$$unsubscribe_PageHistory();
	$$unsubscribe_PageIndex();

	return `<div class="${"flex w-full items-center justify-center border border-x-0 border-gray-600 bg-gray-800 p-4 text-xl text-gray-50"}"><div class="${"flex items-center gap-4"}"><button ${$PageHistory.length <= 1 || $PageIndex === $PageHistory.length - 1
	? "disabled"
	: ""}><svg style="${"width:36px;height:36px"}" viewBox="${"0 0 24 24"}"><path fill="${"currentColor"}" d="${"M10.05 16.94V12.94H18.97L19 10.93H10.05V6.94L5.05 11.94Z"}"></path></svg></button>
    <p class="${"text-2xl"}">${escape($PageHistory[$PageHistory.length - 1 - $PageIndex])}</p>
    <button ${$PageIndex === 0 ? "disabled" : ""}><svg style="${"width:36px;height:36px"}" viewBox="${"0 0 24 24"}"><path fill="${"currentColor"}" d="${"M14 16.94V12.94H5.08L5.05 10.93H14V6.94L19 11.94Z"}"></path></svg></button></div></div>`;
});

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("/Users/macbookpro/Desktop/freespeech/src/pages/app/index.astro", "", "file:///Users/macbookpro/Desktop/freespeech/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const user = await Me(Astro2.request.headers.get("cookie") + "");
  if (!user || !user.projects || user.projects.length < 1)
    return Astro2.redirect("/dashboard/projects");
  return renderTemplate(_a || (_a = __template(["", '\n<script>\n  window.addEventListener("drop", () => {\n    event.preventDefault();\n  });\n  window.addEventListener("dragover", () => {\n    // event.dataTransfer.dropEffect = "none"; // dont allow drops\n    event.preventDefault();\n  });\n<\/script>'])), renderComponent($$result, "DefaultLayout", $$DefaultLayout, { "title": "Hello, World!" }, { "default": () => renderTemplate`${renderComponent($$result, "Loader", Loader, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/app/Loader.svelte", "client:component-export": "default" })}${renderComponent($$result, "ModalProjectSettings", ModalProjectSettings, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/app/ModalProjectSettings.svelte", "client:component-export": "default" })}${maybeRenderHead($$result)}<main class="h-screen w-screen bg-gray-900 flex flex-col">
    ${renderComponent($$result, "EditModeHeader", EditModeHeader, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/app/EditModeHeader.svelte", "client:component-export": "default" })}
    <div class="flex-1 w-screen flex">
      ${renderComponent($$result, "EditModeSideBar", EditModeSideBar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/app/EditModeSideBar.svelte", "client:component-export": "default" })}
      <main class="flex flex-col flex-1 relative border border-gray-600 border-b-0 border-r-0">
        ${renderComponent($$result, "SentenceBuilder", SentenceBuilder, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/app/SentenceBuilder.svelte", "client:component-export": "default" })}
        ${renderComponent($$result, "TileGridNav", TileGridNav, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/app/TileGridNav.svelte", "client:component-export": "default" })}
        <main class="w-full relative flex-1 bg-gray-200">
          ${renderComponent($$result, "TileGrid", TileGrid, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/app/TileGrid.svelte", "client:component-export": "default" })}
          <!-- <span class="absolute top-0 w-full z-20">
            <TileGrid client:load />
          </span> -->
        </main>

        <!-- <main class="absolute opacity-50 bottom-0 w-full bg-red-200">
          
        </main> -->
      </main>
    </div>
    ${renderComponent($$result, "Navigation", Navigation, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/macbookpro/Desktop/freespeech/src/components/app/Navigation.svelte", "client:component-export": "default" })}
  </main>` }));
});

const $$file = "/Users/macbookpro/Desktop/freespeech/src/pages/app/index.astro";
const $$url = "/app";

const _page21 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/dashboard/index.astro', _page1],['src/pages/dashboard/community/index.astro', _page2],['src/pages/dashboard/projects/index.astro', _page3],['src/pages/dashboard/settings/index.astro', _page4],['src/pages/dashboard/account/index.astro', _page5],['src/pages/portal/signup/index.astro', _page6],['src/pages/portal/login/index.astro', _page7],['src/pages/404.astro', _page8],['src/pages/api/v1/project/create.json.ts', _page9],['src/pages/api/v1/project/delete.json.ts', _page10],['src/pages/api/v1/project/fetch.json.ts', _page11],['src/pages/api/v1/project/edit.json.ts', _page12],['src/pages/api/v1/file/upload.json.ts', _page13],['src/pages/api/v1/page/create.json.ts', _page14],['src/pages/api/v1/tile/create.json.ts', _page15],['src/pages/api/v1/tile/delete.json.ts', _page16],['src/pages/api/v1/tile/edit.json.ts', _page17],['src/pages/api/v1/user/checkEmail.json.ts', _page18],['src/pages/api/v1/user/create.json.ts', _page19],['src/pages/api/v1/user/login.json.ts', _page20],['src/pages/app/index.astro', _page21],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/svelte","clientEntrypoint":"@astrojs/svelte/client.js","serverEntrypoint":"@astrojs/svelte/server.js"}, { ssr: _renderer1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":["assets/404.0b0f87d5.css"],"scripts":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/404.0b0f87d5.css"],"scripts":[],"routeData":{"route":"/dashboard","type":"page","pattern":"^\\/dashboard\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard/index.astro","pathname":"/dashboard","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/404.0b0f87d5.css","assets/index.7236ae50.css"],"scripts":[],"routeData":{"route":"/dashboard/community","type":"page","pattern":"^\\/dashboard\\/community\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}],[{"content":"community","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard/community/index.astro","pathname":"/dashboard/community","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/404.0b0f87d5.css","assets/index.7236ae50.css"],"scripts":[],"routeData":{"route":"/dashboard/projects","type":"page","pattern":"^\\/dashboard\\/projects\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}],[{"content":"projects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard/projects/index.astro","pathname":"/dashboard/projects","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/404.0b0f87d5.css","assets/index.7236ae50.css"],"scripts":[],"routeData":{"route":"/dashboard/settings","type":"page","pattern":"^\\/dashboard\\/settings\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard/settings/index.astro","pathname":"/dashboard/settings","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/404.0b0f87d5.css","assets/index.7236ae50.css"],"scripts":[],"routeData":{"route":"/dashboard/account","type":"page","pattern":"^\\/dashboard\\/account\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}],[{"content":"account","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard/account/index.astro","pathname":"/dashboard/account","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/404.0b0f87d5.css","assets/index.7236ae50.css"],"scripts":[],"routeData":{"route":"/portal/signup","type":"page","pattern":"^\\/portal\\/signup\\/?$","segments":[[{"content":"portal","dynamic":false,"spread":false}],[{"content":"signup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/portal/signup/index.astro","pathname":"/portal/signup","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/404.0b0f87d5.css","assets/index.7236ae50.css"],"scripts":[],"routeData":{"route":"/portal/login","type":"page","pattern":"^\\/portal\\/login\\/?$","segments":[[{"content":"portal","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/portal/login/index.astro","pathname":"/portal/login","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/404.0b0f87d5.css"],"scripts":[],"routeData":{"route":"/404","type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/project/create.json","type":"endpoint","pattern":"^\\/api\\/v1\\/project\\/create\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"project","dynamic":false,"spread":false}],[{"content":"create.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/project/create.json.ts","pathname":"/api/v1/project/create.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/project/delete.json","type":"endpoint","pattern":"^\\/api\\/v1\\/project\\/delete\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"project","dynamic":false,"spread":false}],[{"content":"delete.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/project/delete.json.ts","pathname":"/api/v1/project/delete.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/project/fetch.json","type":"endpoint","pattern":"^\\/api\\/v1\\/project\\/fetch\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"project","dynamic":false,"spread":false}],[{"content":"fetch.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/project/fetch.json.ts","pathname":"/api/v1/project/fetch.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/project/edit.json","type":"endpoint","pattern":"^\\/api\\/v1\\/project\\/edit\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"project","dynamic":false,"spread":false}],[{"content":"edit.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/project/edit.json.ts","pathname":"/api/v1/project/edit.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/file/upload.json","type":"endpoint","pattern":"^\\/api\\/v1\\/file\\/upload\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"file","dynamic":false,"spread":false}],[{"content":"upload.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/file/upload.json.ts","pathname":"/api/v1/file/upload.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/page/create.json","type":"endpoint","pattern":"^\\/api\\/v1\\/page\\/create\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"page","dynamic":false,"spread":false}],[{"content":"create.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/page/create.json.ts","pathname":"/api/v1/page/create.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/tile/create.json","type":"endpoint","pattern":"^\\/api\\/v1\\/tile\\/create\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"tile","dynamic":false,"spread":false}],[{"content":"create.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/tile/create.json.ts","pathname":"/api/v1/tile/create.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/tile/delete.json","type":"endpoint","pattern":"^\\/api\\/v1\\/tile\\/delete\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"tile","dynamic":false,"spread":false}],[{"content":"delete.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/tile/delete.json.ts","pathname":"/api/v1/tile/delete.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/tile/edit.json","type":"endpoint","pattern":"^\\/api\\/v1\\/tile\\/edit\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"tile","dynamic":false,"spread":false}],[{"content":"edit.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/tile/edit.json.ts","pathname":"/api/v1/tile/edit.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/user/checkemail.json","type":"endpoint","pattern":"^\\/api\\/v1\\/user\\/checkEmail\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"user","dynamic":false,"spread":false}],[{"content":"checkEmail.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/user/checkEmail.json.ts","pathname":"/api/v1/user/checkEmail.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/user/create.json","type":"endpoint","pattern":"^\\/api\\/v1\\/user\\/create\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"user","dynamic":false,"spread":false}],[{"content":"create.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/user/create.json.ts","pathname":"/api/v1/user/create.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/api/v1/user/login.json","type":"endpoint","pattern":"^\\/api\\/v1\\/user\\/login\\.json$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"v1","dynamic":false,"spread":false}],[{"content":"user","dynamic":false,"spread":false}],[{"content":"login.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/v1/user/login.json.ts","pathname":"/api/v1/user/login.json","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/404.0b0f87d5.css","assets/index.fea40d58.css","assets/index.7236ae50.css"],"scripts":[],"routeData":{"route":"/app","type":"page","pattern":"^\\/app\\/?$","segments":[[{"content":"app","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/app/index.astro","pathname":"/app","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","/Users/macbookpro/Desktop/freespeech/src/components/dashboard/ModalCreateProject.svelte":"ModalCreateProject.8c6641ad.js","/Users/macbookpro/Desktop/freespeech/src/components/dashboard/ProjectGrid.svelte":"ProjectGrid.98577982.js","/Users/macbookpro/Desktop/freespeech/src/components/dashboard/Account.svelte":"Account.13fcc741.js","/Users/macbookpro/Desktop/freespeech/src/components/app/Loader.svelte":"Loader.fc57930f.js","/Users/macbookpro/Desktop/freespeech/src/components/app/ModalProjectSettings.svelte":"ModalProjectSettings.83650afd.js","/Users/macbookpro/Desktop/freespeech/src/components/app/EditModeHeader.svelte":"EditModeHeader.0824c13d.js","/Users/macbookpro/Desktop/freespeech/src/components/app/EditModeSideBar.svelte":"EditModeSideBar.d4b74893.js","/Users/macbookpro/Desktop/freespeech/src/components/app/SentenceBuilder.svelte":"SentenceBuilder.e32471b5.js","/Users/macbookpro/Desktop/freespeech/src/components/app/TileGridNav.svelte":"TileGridNav.58ab9daf.js","/Users/macbookpro/Desktop/freespeech/src/components/app/TileGrid.svelte":"TileGrid.0cc724bf.js","/Users/macbookpro/Desktop/freespeech/src/components/app/Navigation.svelte":"Navigation.f327a82e.js","/Users/macbookpro/Desktop/freespeech/src/components/portal/PortalForm.svelte":"PortalForm.eff0aa0d.js","/Users/macbookpro/Desktop/freespeech/src/components/StoreManager.svelte":"StoreManager.916bb219.js","@astrojs/svelte/client.js":"client.788af3ea.js","astro:scripts/before-hydration.js":""},"assets":["/assets/logo-white.42403a04.png","/assets/della-portal-splash.c322b672.png","/assets/404.0b0f87d5.css","/assets/index.7236ae50.css","/assets/index.fea40d58.css","/Account.13fcc741.js","/EditModeHeader.0824c13d.js","/EditModeSideBar.d4b74893.js","/Loader.fc57930f.js","/ModalCreateProject.8c6641ad.js","/ModalProjectSettings.83650afd.js","/Navigation.f327a82e.js","/PortalForm.eff0aa0d.js","/ProjectGrid.98577982.js","/SentenceBuilder.e32471b5.js","/StoreManager.916bb219.js","/TileGrid.0cc724bf.js","/TileGridNav.58ab9daf.js","/add.png","/client.788af3ea.js","/della-portal-splash.png","/logo-white.png","/chunks/Modal.11c7fa9c.js","/chunks/colors.74a4511f.js","/chunks/index.e1c8ffd7.js","/chunks/stores.8cf13533.js"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler };
