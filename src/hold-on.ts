import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

export class XTargetHoldOn extends Plugin<XTarget>
{

	private cursorId?: number
	private greyId?:   number
	private overlay?:  HTMLDivElement
	private pending  = 0

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		const plugin           = this
		const superRequestInit = xTarget.requestInit
		xTarget.requestInit    = function(target?: Element)
		{
			plugin.beginWait()
			return superRequestInit.call(this, target)
		}

		const superSetResponse = xTarget.setResponse
		xTarget.setResponse    = async function(response, target)
		{
			try {
				return await superSetResponse.call(this, response, target)
			}
			finally {
				plugin.endWait()
			}
		}
	}

	private beginWait()
	{
		this.pending ++
		if (this.pending !== 1) return

		this.cursorId = window.setTimeout(() => {
			if (!this.pending) return
			this.ensureOverlay()
		}, 500)

		this.greyId = window.setTimeout(() => {
			if (!this.pending) return
			this.ensureOverlay()
			if (this.overlay) {
				this.overlay.style.backgroundColor = 'rgba(128,128,128,.3)'
			}
		}, 1000)
	}

	private endWait()
	{
		if (!this.pending) return
		this.pending --
		if (this.pending) return

		if (this.cursorId) {
			clearTimeout(this.cursorId)
			this.cursorId = undefined
		}
		if (this.greyId) {
			clearTimeout(this.greyId)
			this.greyId = undefined
		}
		if (this.overlay) {
			this.overlay.remove()
		}
	}

	private ensureOverlay()
	{
		if (this.overlay) return
		const div = document.createElement('div')
		Object.assign(div.style, {
			backgroundColor: 'transparent',
			cursor:          'wait',
			inset:           '0',
			position:        'fixed',
			transition:      'background-color .5s ease-in-out',
			zIndex:          '2147483647',
		})
		document.body.appendChild(div)
		this.overlay = div
	}

}
