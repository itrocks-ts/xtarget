import { Plugin }  from '../../plugin/plugin.js'
import { XTarget } from './xtarget.js'

export type XhrInfo = {
	screenHeight:  number,
	screenWidth:   number,
	target?:       string,
	targetHeight?: number,
	targetWidth?:  number,
	windowHeight:  number,
	windowWidth:   number
}

export class XTargetHeadersSize extends Plugin<XTarget>
{

	constructor(xTarget: XTarget)
	{
		super(xTarget)

		const superRequestInit = xTarget.requestInit
		xTarget.requestInit    = function(target?: Element)
		{
			const requestInit      = superRequestInit.call(this, target)
			requestInit.headers  ??= new Headers
			const headers          = requestInit.headers as Headers
			const xhrInfo: XhrInfo = Object.assign(JSON.parse(headers.get('XHR-Info') ?? '{}'), {
				screenHeight: screen.height,
				screenWidth:  screen.width,
				windowHeight: window.innerHeight,
				windowWidth:  window.innerWidth
			})
			if (target) {
				xhrInfo.target       = target.id ? ('#' + target.id) : target.nodeName
				xhrInfo.targetHeight = target.clientHeight
				xhrInfo.targetWidth  = target.clientWidth
			}
			headers.set('XHR-Info', JSON.stringify(xhrInfo))
			return requestInit
		}
	}

}
