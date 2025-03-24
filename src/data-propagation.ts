import { Plugin }  from '../node_modules/@itrocks/plugin/plugin.js'
import { XTarget } from './xtarget.js'

export class XTargetDataPropagation extends Plugin<XTarget>
{

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		const superActivateAnchorEvent = xTarget.activateAnchorEvent
		xTarget.activateAnchorEvent    = function(event)
		{
			const element = event.target as HTMLAnchorElement
			if (element.dataset.stopImmediatePropagation === '1') {
				event.stopImmediatePropagation()
			}
			if (element.dataset.stopPropagation === '1') {
				event.stopPropagation()
			}
			return superActivateAnchorEvent.call(this, event)
		}
	}

}
