import { formFetchOnSubmit }   from '../../form-fetch/form-fetch.js'
import { HasPlugins, Options } from '../../plugin/plugin.js'

let defaultOptions = {}

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
		return this.call(event.target as HTMLAnchorElement)
	}

	activateFormElement(element: Exclude<XTargetElement, HTMLAnchorElement>)
	{
		formFetchOnSubmit(
			element,
			(response, targetSelector) => this.setResponse(response, targetSelector),
			submitter => this.requestInit(submitter as XTargetElement)
		)
	}

	async call(element: HTMLAnchorElement)
	{
		return (element.href === 'about:blank')
			? this.setHTML('', element.target)
			: this.setResponse(await fetch(element.href, this.requestInit(element)), element.target)
	}

	isEmpty(text: string)
	{
		return !text.trim().length
	}

	requestInit(_element: XTargetElement): RequestInit
	{
		return {}
	}

	setHTML(text: string, targetSelector: string)
	{
		let target = this.targetElement(targetSelector)
		return target
			? this.setHTMLContent(text, target)
			: console.error('target not found', targetSelector)
	}

	setHTMLContent(text: string, target: Element)
	{
		target.innerHTML = this.isEmpty(text) ? '' : text
	}

	async setResponse(response: Response, target: string)
	{
		this.setHTML(await response.text(), target)
	}

	targetElement(targetSelector: string)
	{
		if (targetSelector === '') {
			return undefined
		}
		return targetSelector.startsWith('#')
			? ((targetSelector.length > 1) ? (document.getElementById(targetSelector.slice(1)) ?? undefined) : undefined)
			: (document.querySelector<HTMLElement>(targetSelector) ?? undefined)
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
	const anchor = document.createElement('a')
	anchor.setAttribute('href',   action)
	anchor.setAttribute('target', target)
	return new XTarget(anchor, options).call(anchor)
}

export function XTargetDefaultOptions(options: Partial<Options<XTarget>>)
{
	defaultOptions = options
}

export type XTargetElement = HTMLAnchorElement | HTMLButtonElement | HTMLFormElement | HTMLInputElement
