import { formMethod }     from '../../form-fetch/form-fetch.js'
import { Plugin }         from '../../plugin/plugin.js'
import { defaultOptions } from './xtarget.js'
import { XTarget }        from './xtarget.js'
import { xTargetCall }    from './xtarget.js'

export class XTargetHistory extends Plugin<XTarget>
{

	init()
	{
		let   postMethod = false
		let   response:    Response | undefined
		const xTarget    = this.of

		const superActivateFormElement = xTarget.activateFormElement
		xTarget.activateFormElement    = function(element)
		{
			postMethod = formMethod(element.form ?? element).toLowerCase() === 'post'
			superActivateFormElement.call(this, element)
		}

		const superSetHTML = xTarget.setHTML
		xTarget.setHTML    = function(text, targetSelector)
		{
			const target = this.targetElement(targetSelector)
			const html   = superSetHTML.call(this, text, target ?? targetSelector)
			if (!response || !target || postMethod || xTarget.options.targetHistoryDisable) {
				return html
			}
			const state = {
				reload: true,
				target: target.id ? '#' + target.id : target.nodeName,
				title:  document.title
			}
			history.pushState(state, '', response.url)
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
	if (event.state?.reload && event.state.target && document.querySelector(event.state.target)) {
		document.title = event.state.title
		return xTargetCall(
			document.location.href,
			event.state.target,
			Object.assign({}, defaultOptions, { targetHistoryDisable: true })
		)
	}
	document.location.reload()
})
