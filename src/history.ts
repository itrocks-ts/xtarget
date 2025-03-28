import { formMethod }           from '../../form-fetch/form-fetch.js'
import { Plugin }               from '../../plugin/plugin.js'
import { XTarget, xTargetCall } from './xtarget.js'

export class XTargetHistory extends Plugin<XTarget>
{

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		let postMethod = false
		let response: Response | undefined

		const superActivateFormElement = xTarget.activateFormElement
		xTarget.activateFormElement    = function(element)
		{
			postMethod = formMethod(element.form ?? element).toLowerCase() === 'post'
			superActivateFormElement.call(this, element)
		}

		const superSetHTML = xTarget.setHTML
		xTarget.setHTML    = function(text, targetSelector)
		{
			const html = superSetHTML.call(this, text, targetSelector)
			if (!response || postMethod || xTarget.options.targetHistoryDisable) {
				return html
			}
			history.pushState({ reload: true, target: targetSelector, title: document.title }, '', response.url)
			response = undefined
			return html
		}

		const superSetResponse = xTarget.setResponse
		xTarget.setResponse    = function(responseCall, target)
		{
			response = responseCall
			return superSetResponse.call(this, responseCall, target)
		}
	}

}

addEventListener('popstate', async event => {
	if (event.state && event.state.reload && event.state.target && document.querySelector(event.state.target)) {
		document.title = event.state.title
		return xTargetCall(document.location.href, event.state.target, { targetHistoryDisable: true })
	}
	document.location.reload()
})
