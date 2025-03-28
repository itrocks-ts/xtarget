import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

export class XTargetMainTarget extends Plugin<XTarget>
{

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		const superTargetElement = xTarget.targetElement
		xTarget.targetElement    = function(targetSelector: string)
		{
			if (targetSelector === '#main') {
				const element = document.getElementsByTagName('main')[0]
				if (element) {
					return element
				}
			}
			return superTargetElement.call(this, targetSelector)
		}
	}

}
