import Plugin  from '../node_modules/@itrocks/plugin/plugin.js'
import XTarget from './xtarget.js'

export default class XTargetDataPropagation extends Plugin<XTarget>
{

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		xTarget.activateAnchorEvent = function(event)
		{
			const element = event.target as HTMLAnchorElement
			if (element.dataset.preventDefault !== '0') {
				event.preventDefault()
			}
			if (element.dataset.stopImmediatePropagation === '1') {
				event.stopImmediatePropagation()
			}
			if (element.dataset.stopPropagation === '1') {
				event.stopPropagation()
			}
			return this.call(element)
		}
	}

}