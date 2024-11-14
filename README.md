[![view on npm](https://badgen.net/npm/v/@itrocks/xtarget)](https://www.npmjs.org/package/@itrocks/xtarget)
[![npm module downloads](https://badgen.net/npm/dt/@itrocks/xtarget)](https://www.npmjs.org/package/@itrocks/xtarget)
[![GitHub repo dependents](https://badgen.net/github/dependents-repo/itrocks-ts/xtarget)](https://github.com/itrocks-ts/xtarget/network/dependents?dependent_type=REPOSITORY)
[![GitHub package dependents](https://badgen.net/github/dependents-pkg/itrocks-ts/xtarget)](https://github.com/itrocks-ts/xtarget/network/dependents?dependent_type=PACKAGE)

# xtarget

Allows you to choose any element in your DOM as a target for your anchors and forms.

## Installation

```bash
npm i @itrocks/build @itrocks/xtarget
```

## Usage

Include this ESM script into your web page, then specify the target DOM element id into your HTML code:

```html
<script type="module">
	import buildXTarget from '@itrocks/xtarget/build.js'
	buildXTarget()
</script>
<a href="content-to-load.html" target="#here">Load HTML content</a>
<div id="here">Content will be loaded here</div>
```
