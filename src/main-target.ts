import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

export class XTargetMainTarget extends Plugin<XTarget>
{

	init()
	{
		const superTargetElement = this.of.targetElement
		this.of.targetElement    = function(target: string | Element)
		{
			return superTargetElement.call(this, (target === '#main') ? 'main' : target)
		}
	}

}
