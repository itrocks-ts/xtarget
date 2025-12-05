import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

export class XTargetMainTarget extends Plugin<XTarget>
{

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		const superTargetElement = xTarget.targetElement
		xTarget.targetElement    = function(target: string | Element)
		{
			return superTargetElement.call(this, (target === '#main') ? 'main' : target)
		}
	}

}
