[![npm version](https://img.shields.io/npm/v/@itrocks/xtarget?logo=npm)](https://www.npmjs.org/package/@itrocks/xtarget)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/xtarget)](https://www.npmjs.org/package/@itrocks/xtarget)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/xtarget?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/xtarget)
[![issues](https://img.shields.io/github/issues/itrocks-ts/xtarget)](https://github.com/itrocks-ts/xtarget/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://discord.gg/WFPJjmUx)

# xtarget

The simplest way to designate any element in your DOM as a target for your anchors and forms.

## Installation

```bash
npm i @itrocks/build @itrocks/xtarget
```

## Usage

Include the ESM script into your web page, then specify the target DOM element's ID into your HTML code:

```html
<script type="module">
	import buildXTarget from './node_modules/@itrocks/xtarget/build.js'
	buildXTarget()
</script>

<a href="content-to-load.html" target="#here">
	Load HTML content
</a>

<div id="here">Content will be loaded here</div>
```

If the target descriptor does not match any existing element, the page will be called,
but the loaded content will be discarded.

## Installing plugins

This example demonstrates installing all built-in plugins.
However, you should include only those you need:

```ts
import buildXTarget           from './node_modules/@itrocks/xtarget/build.js'
import XTargetBeginEnd        from './node_modules/@itrocks/xtarget/begin-end.js'
import XTargetComposite       from './node_modules/@itrocks/xtarget/composite.js'
import XTargetDataPropagation from './node_modules/@itrocks/xtarget/data-propagation.js'
import XTargetDefaultTarget   from './node_modules/@itrocks/xtarget/default-target.js'
import XTargetHead            from './node_modules/@itrocks/xtarget/head.js'
import XTargetHeadersSize     from './node_modules/@itrocks/xtarget/headers-size.js'
import XTargetHistory         from './node_modules/@itrocks/xtarget/history.js'

XTargetDefaultOptions({ plugins: [
	XTargetBeginEnd,
	XTargetComposite,
	XTargetDataPropagation,
	XTargetDefaultTarget,
	XTargetHead,
	XTargetHeadersSize,
	XTargetHistory
] })
buildXTarget()
```

## XTargetBeginEnd plugin

When this plugin is activated, the loaded content may contain `<!--BEGIN-->` and `<!--END-->` markers.
Only the HTML content between these markers will be loaded into the target.

This feature allows you tou build pages that function both as valid standalone pages and as content for a target.

## XTargetComposite plugin

When this plugin is activated, the loaded content may include sections defined by `<!--#targetid-->` and `<!--#end-->`
markers.
The HTML content between these markers will be loaded into the element identified by the id attribute value `targetid`.

You can define multiple sections within the same HTML page content, each directed to its own specific target.

Any HTML outside these sections will be loaded into the target designated by the originating anchor or form.

## XTargetDataPropagation plugin

This plugin allows you to control event propagation when an "xtargeted" anchor is clicked.
You can stop either :
- [Immediate propagation](https://developer.mozilla.org/docs/Web/API/Event/stopImmediatePropagation)
  by adding the `data-stop-immediate-propagation` attribute to your anchor.
- [Parent propagation](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation)
  by adding the `data-stop-propagation` attribute to your anchor.

By including these attributes, you gain granular control over event behavior,
ensuring your anchors function as expected without unintended side effects.

### Example

```html
<a data-stop-immediate-propagation data-stop-propagation href="content-to-load.html" target="#here">
	Load HTML content
</a>
```

## XTargetDefaultTarget plugin

When this plugin is activated, if the target element is not found in the DOM when the user clicks a hypertext link,
a `<div id="thetargetid">` is automatically appended to the `<body>` to receive the loaded page content.

### Example

```html
<a href="content-to-load.html" target="#modal">
	Tell me something in a modal popup
</a>
```

In this example, if the `#modal` element does not exist, it will be created dynamically to display the loaded content.

## XTargetHead plugin

When this plugin is activated, the following `<head>` elements from the loaded page
will be added to the `<head>` of the caller page, if they are not already present:

- any new `<link href="..." rel="stylesheet">` elements,
- any new `<script src="...">` elements,
- the `<title>` text content will replace `<title>` of the caller page.

This plugin is designed to be used in conjonction with the [XTargetBeginEnd plugin](#xtargetbeginend-plugin)
or any equivalent, as it assumes that full-page HTML content is being loaded,
from which only these specific elements will be extracted.

## XTargetHeadersSize plugin

This plugin adds a JSON-formatted `XHR-Info` HTTP header to the request, providing your back-end application
with information about the target selector and its dimensions.

The data included in the JSON structure are:
- screenHeight: [screen.height](https://developer.mozilla.org/en-US/docs/Web/API/Screen/height)
- screenWidth: [screen.width](https://developer.mozilla.org/en-US/docs/Web/API/Screen/width)
- windowHeight: [window.innerHeight](https://developer.mozilla.org/docs/Web/API/Window/innerHeight)
- windowWidth: [window.innerWidth](https://developer.mozilla.org/docs/Web/API/Window/innerWidth)

Additionally, if the target element is found, the following properties are included:
- targetHeight: the [clientHeight](https://developer.mozilla.org/docs/Web/API/Element/clientHeight) of the target,
- targetWidth: the [clientWidth](https://developer.mozilla.org/docs/Web/API/Element/clientWidth) of the target.

## XTargetHistory plugin

*This plugin is experimental: its stability largely depends on your application's architecture*.

When activated, this plugin saves each loaded xtarget link into the browser's history.
This enables users to navigate through the links they followed by clicking on xtarget anchors.

Only `GET` requests with non-empty response content will be added to the history.

When the user navigates back or forward xtarget links:
- if the target is still present on the page, the content will be loaded into the target without a full-page reload,
- otherwise, the content will be loaded as full page.

## Code your own plugins

If you need to create your own plugins for XTarget, feel free to do so!
Here are some resources to get you started:

- Explore the source code of [@itrocks/xtarget](https://github.com/itrocks-ts/xtarget/tree/master/src),
  which provides plenty of examples.
- Review the documentation for the plugin system used by XTarget:
  [@itrocks/plugin](https://www.npmjs.com/package/@itrocks/plugin).

By understanding these resources, you'll be equipped to design and implement custom plugins
tailored to your application's needs.
