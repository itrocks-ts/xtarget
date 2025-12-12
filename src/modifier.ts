import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

export class XTargetModifier extends Plugin<XTarget>
{

	init()
	{
		let modifier: string | undefined

		const superTargetElement = this.of.targetElement
		this.of.targetElement    = function(target : string | Element)
		{
			if (!(target instanceof Element)) {
				[target, modifier] = target.split(':')
			}
			return superTargetElement.call(this, target)
		}

		const superSetHTMLContent = this.of.setHTMLContent
		this.of.setHTMLContent    = function(text, target)
		{
			if (modifier === 'auto') {
				modifier = text.includes('id="' + target.id + '"')
					? 'replace'
					: 'content'
			}
			else {
				modifier ??= 'content'
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
