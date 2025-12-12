import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

let cursorId: number | undefined
let greyId:   number | undefined
let overlay:  HTMLDivElement | undefined
let pending = 0

function beginWait()
{
	pending ++
	if (pending !== 1) return

	cursorId = window.setTimeout(() => {
		if (!pending) return
		ensureOverlay()
	}, 500)

	greyId = window.setTimeout(() => {
		if (!pending) return
		ensureOverlay()
		if (overlay) {
			overlay.style.backgroundColor = 'rgba(128,128,128,.3)'
		}
	}, 1000)
}

function endWait()
{
	if (!pending) return
	pending --
	if (pending) return
	if (cursorId) {
		clearTimeout(cursorId)
		cursorId = undefined
	}
	if (greyId) {
		clearTimeout(greyId)
		greyId = undefined
	}
	if (overlay) {
		overlay.remove()
		overlay = undefined
	}
}

function ensureOverlay()
{
	if (overlay) return
	overlay = document.createElement('div')
	Object.assign(overlay.style, {
		backgroundColor: 'transparent',
		cursor:          'wait',
		inset:           '0',
		position:        'fixed',
		transition:      'background-color .5s ease-in-out',
		zIndex:          '2147483647',
	})
	document.body.appendChild(overlay)
}

export class XTargetHoldOn extends Plugin<XTarget>
{

	init()
	{
		const superRequestInit = this.of.requestInit
		this.of.requestInit    = function(target?: Element)
		{
			beginWait()
			return superRequestInit.call(this, target)
		}

		const superSetResponse = this.of.setResponse
		this.of.setResponse    = async function(response, target)
		{
			try {
				return await superSetResponse.call(this, response, target)
			}
			finally {
				endWait()
			}
		}
	}

}
