import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

export class XTargetDataPropagation extends Plugin<XTarget>
{

	init()
	{
		const superActivateAnchorEvent = this.of.activateAnchorEvent
		this.of.activateAnchorEvent    = function(event)
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
