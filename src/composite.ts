import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

export class XTargetComposite extends Plugin<XTarget>
{

	init()
	{
		const superSetHTML = this.of.setHTML
		this.of.setHTML    = function(text, targetSelector)
		{
			let global = true
			while (text.includes('<!--#')) {
				const targetIndex = text.indexOf('<!--#') + 4
				const start       = text.indexOf('-->', targetIndex) + 3
				const stop        = text.indexOf('<!--#end-->', start)

				const localTargetSelector = text.slice(targetIndex, start - 3)
				const localText           = text.slice(start, stop)
				text = text.slice(0, targetIndex - 4) + text.slice(stop + 11)
				this.setHTML(localText, localTargetSelector)

				global = false
			}

			return (global || !this.isEmpty(text)) && superSetHTML.call(this, text, targetSelector)
		}
	}

}
