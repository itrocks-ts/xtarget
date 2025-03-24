import { Plugin }  from '../node_modules/@itrocks/plugin/plugin.js'
import { XTarget } from './xtarget.js'

export class XTargetBeginEnd extends Plugin<XTarget>
{

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		const plugin       = this
		const superIsEmpty = xTarget.isEmpty
		xTarget.isEmpty    = function(text)
		{
			return superIsEmpty.call(this, plugin.innerText(text))
		}

		const superSetHTML = xTarget.setHTML
		xTarget.setHTML    = function(text, target)
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
