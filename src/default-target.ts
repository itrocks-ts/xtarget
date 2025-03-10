import Plugin  from '../node_modules/@itrocks/plugin/plugin.js'
import XTarget from './xtarget.js'

export default class XTargetDefaultTarget extends Plugin<XTarget>
{

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		const plugin             = this
		const superTargetElement = xTarget.targetElement
		xTarget.targetElement    = function(targetSelector)
		{
			return superTargetElement.call(this, targetSelector)
				?? plugin.createDefaultElement(targetSelector)
		}
	}

	createDefaultElement(targetSelector: string)
	{
		if (targetSelector.length === 1) {
			return
		}
		if (targetSelector[0] === '.') {
			const target = document.createElement('div')
			target.classList.add(...targetSelector.slice(1).split('.'))
			document.body.appendChild(target)
			return target
		}
		if (targetSelector[0] === '#') {
			const target = document.createElement('div')
			target.setAttribute('id', targetSelector.slice(1))
			document.body.appendChild(target)
			return target
		}
	}

}
