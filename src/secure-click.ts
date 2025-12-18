import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

const MIN_DELAY = 1000 // ms

export class XTargetSecureClick extends Plugin<XTarget>
{

	init()
	{
		let lastActivationTime   = 0
		let lastResponseReceived = true

		function canActivate()
		{
			if (!lastActivationTime) {
				return true
			}
			const now   = Date.now()
			const delay = now - lastActivationTime
			return lastResponseReceived && (delay >= MIN_DELAY)
		}

		function markActivation()
		{
			lastActivationTime   = Date.now()
			lastResponseReceived = false
		}

		const superActivateAnchorEvent = this.of.activateAnchorEvent
		this.of.activateAnchorEvent = function(event)
		{
			if (!canActivate()) {
				event.preventDefault()
				return Promise.resolve()
			}
			markActivation()
			return superActivateAnchorEvent.call(this, event)
		}

		const superActivateFormElement = this.of.activateFormElement
		this.of.activateFormElement = function(element)
		{
			const form = (element instanceof HTMLFormElement) ? element : element.form
			if (form) {
				form.addEventListener('submit', event => {
					if (!canActivate()) {
						event.preventDefault()
						event.stopImmediatePropagation()
						return
					}
					markActivation()
				})
			}
			return superActivateFormElement.call(this, element)
		}

		const superOnCallError = this.of.onCallError
		this.of.onCallError = function(error, href, target)
		{
			lastResponseReceived = true
			return superOnCallError.call(this, error, href, target)
		}

		const superSetResponse = this.of.setResponse
		this.of.setResponse = function(responseCall, target)
		{
			lastResponseReceived = true
			return superSetResponse.call(this, responseCall, target)
		}
	}

}
