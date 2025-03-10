import Plugin  from '../node_modules/@itrocks/plugin/plugin.js'
import XTarget from './xtarget.js'

export default class XTargetModifier extends Plugin<XTarget>
{

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		let modifier: string | undefined

		const superTargetElement = xTarget.targetElement
		xTarget.targetElement    = function(targetSelector)
		{
			[targetSelector, modifier] = targetSelector.split(':')
			return superTargetElement.call(this, targetSelector)
		}

		const superSetHTMLContent = xTarget.setHTMLContent
		xTarget.setHTMLContent    = function(text, target)
		{
			if (!modifier) {
				modifier = 'content'
			}
			else if (modifier === 'auto') {
				modifier = text.includes('id="' + target.id + '"')
					? 'replace'
					: 'content'
			}
			if (modifier === 'content') {
				return superSetHTMLContent.call(this, this.isEmpty(text) ? '' : text, target)
			}

			let fragment: DocumentFragment | undefined
			fragment = document.createRange().createContextualFragment(this.isEmpty(text) ? '' : text)
			switch (modifier) {
				case 'after':
					return target.nextSibling
						? target.parentNode?.insertBefore(fragment, target.nextSibling)
						: target.parentNode?.appendChild(fragment)
				case 'append':
					return target.append(fragment)
				case 'before':
					return target.parentNode?.insertBefore(fragment, target)
				case 'prepend':
					return target.prepend(fragment)
				case 'replace':
					return target.replaceWith(fragment)
			}
			console.error('Invalid modifier', modifier)
		}
	}

}
