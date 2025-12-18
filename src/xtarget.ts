import { formFetchOnSubmit }   from '../../form-fetch/form-fetch.js'
import { HasPlugins, Options } from '../../plugin/plugin.js'

export let defaultOptions = {}

export class XTarget extends HasPlugins<XTarget>
{

	constructor(public element: XTargetElement, options: Partial<Options<XTarget>> = defaultOptions)
	{
		super(options)
		this.constructPlugins()
		this.initPlugins()
		this.activate(element)
	}

	activate(element: XTargetElement)
	{
		(element instanceof HTMLAnchorElement)
			? this.activateAnchorElement(element)
			: this.activateFormElement(element)
	}

	activateAnchorElement(element: HTMLAnchorElement)
	{
		element.addEventListener('click', this.activateAnchorEvent.bind(this))
	}

	async activateAnchorEvent(event: MouseEvent)
	{
		event.preventDefault()
		return this.callAnchor(event.target as HTMLAnchorElement)
	}

	activateFormElement(element: Exclude<XTargetElement, HTMLAnchorElement>)
	{
		formFetchOnSubmit(
			element,
			(response, targetSelector) => this.setResponse(response, targetSelector),
			submitter                  => this.requestInit(this.targetElement(this.targetSelector(submitter))),
			(error, href, target)      => this.onCallError(error, href, target)
		)
	}

	async call(href: string, target: string | Element)
	{
		const init = this.requestInit(this.targetElement(target))
		let   response
		try {
			response = await fetch(href, init)
		}
		catch(error: any) {
			this.onCallError(error, href, target)
		}
		return ((href === 'about:blank') || !response)
			? this.setHTML('', target)
			: this.setResponse(await fetch(href, init), target)
	}

	async callAnchor(element: HTMLAnchorElement)
	{
		return this.call(element.href, element.target)
	}

	isEmpty(text: string)
	{
		return !text.trim().length
	}

	onCallError(error: any, href: string, target: string | Element)
	{
		console.error('xtarget call error:', href, target)
		throw error
	}

	requestInit(_target?: Element): RequestInit
	{
		return {}
	}

	setHTML(text: string, target: string | Element)
	{
		const targetElement = this.targetElement(target)
		return targetElement
			? this.setHTMLContent(text, targetElement)
			: console.error('target not found', target)
	}

	setHTMLContent(text: string, target: Element)
	{
		target.innerHTML = this.isEmpty(text) ? '' : text
	}

	async setResponse(response: Response, target: string | Element)
	{
		this.setHTML(await response.text(), target)
	}

	targetElement(target: string | Element)
	{
		if (target instanceof Element) {
			return target
		}
		if (target === '') {
			return undefined
		}
		try {
			return document.querySelector<HTMLElement>(target) ?? undefined
		}
		catch {
			return undefined
		}
	}

	targetSelector(element: XTargetElement)
	{
		return ((element instanceof HTMLAnchorElement) || (element instanceof HTMLFormElement))
			? element.target
			: (element.formTarget ?? element.form?.target)
	}

}

export async function xTargetCall(action: string, target: string, options: Partial<Options<XTarget>> = defaultOptions)
{
	return new XTarget(document.createElement('a'), options).call(action, target)
}

export function XTargetDefaultOptions(options: Partial<Options<XTarget>>)
{
	defaultOptions = options
}

export type XTargetElement = HTMLAnchorElement | HTMLButtonElement | HTMLFormElement | HTMLInputElement
