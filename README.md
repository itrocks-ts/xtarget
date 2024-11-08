
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
