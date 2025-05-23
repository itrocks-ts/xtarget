import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

export class XTargetHead extends Plugin<XTarget>
{

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		const superSetHTML = xTarget.setHTML
		xTarget.setHTML    = function(text, target)
		{
			const addHead     = document.createElement('head')
			const position    = text.indexOf('>', text.indexOf('<head') + 5) + 1
			addHead.innerHTML = text.substring(position, text.indexOf('</head>', position))

			const head = document.head
			for (const element of Array.from(addHead.children)) {
				if (
					(element instanceof HTMLLinkElement)
					&& (element.getAttribute('rel') === 'stylesheet')
					&& !head.querySelector('link[href="' + element.getAttribute('href') + '"]')
				) {
					head.appendChild(element)
				}
				if (
					(element instanceof HTMLScriptElement)
					&& !head.querySelector('script[src="' + element.getAttribute('src') + '"]')
				) {
					const script = document.createElement('script')
					for (const attributeName of element.getAttributeNames()) {
						const attributeValue = element.getAttribute(attributeName)
						if (!attributeValue) continue
						script.setAttribute(attributeName, attributeValue)
					}
					head.appendChild(script)
				}
				if (element instanceof HTMLTitleElement) {
					document.title = element.innerText
				}
			}

			return superSetHTML.call(this, text, target)
		}
	}

}
