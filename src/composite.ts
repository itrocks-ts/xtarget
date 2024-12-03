import Plugin  from '../node_modules/@itrocks/plugin/plugin.js'
import XTarget from './xtarget.js'

export default class XTargetComposite extends Plugin<XTarget>
{

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		const superSetHTML = xTarget.setHTML
		xTarget.setHTML = function(text, targetSelector)
		{
			let global = true
			while (text.includes('<!--#')) {
				const targetIndex = text.indexOf('<!--#') + 5
				const start       = text.indexOf('-->', targetIndex) + 3
				const stop        = text.indexOf('<!--#end-->', start)

				let   localTargetSelector = text.slice(targetIndex, start - 3)
				const localText = text.slice(start, stop)
				text = text.slice(0, targetIndex - 5) + text.slice(stop + 11)
				this.setHTML(localText, localTargetSelector)

				if (global && localText.trim().length && document.querySelector(localTargetSelector)) {
					global = false
				}
			}

			return global && text.trim().length && superSetHTML.call(this, text, targetSelector)
		}
	}

}
