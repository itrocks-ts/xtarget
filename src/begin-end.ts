import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

export class XTargetBeginEnd extends Plugin<XTarget>
{

	init()
	{
		const plugin = this

		const superIsEmpty = this.of.isEmpty
		this.of.isEmpty    = function(text)
		{
			return superIsEmpty.call(this, plugin.innerText(text))
		}

		const superSetHTML = this.of.setHTML
		this.of.setHTML    = function(text, target)
		{
			return superSetHTML.call(this, plugin.innerText(text), target)
		}
	}

	innerText = function(text: string)
	{
		const begin = text.indexOf('<!--BEGIN-->') + 12
		return (begin > 11) ? text.substring(begin, text.indexOf('<!--END-->', begin)) : text
	}

}
