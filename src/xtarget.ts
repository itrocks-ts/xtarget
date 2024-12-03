import { formFetchOnSubmit }   from '../node_modules/@itrocks/form-fetch/form-fetch.js'
import { HasPlugins, Options } from '../node_modules/@itrocks/plugin/plugin.js'

let defaultOptions = {}

export default class XTarget extends HasPlugins<XTarget>
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
		const element = event.target as HTMLAnchorElement
		if (element.dataset.preventDefault !== '0') {
			event.preventDefault()
		}
		if (element.dataset.stopImmediatePropagation === '1') {
			event.stopImmediatePropagation()
		}
		if (element.dataset.stopPropagation === '1') {
			event.stopPropagation()
		}
		await this.call(element)
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
		if (element.href === 'about:blank') {
			this.setHTML('', element.target)
		}
		else {
			await this.setResponse(await fetch(element.href, this.requestInit(element)), element.target)
		}
	}

	requestInit(_element: XTargetElement): RequestInit
	{
		return {}
	}

	setHTML(text: string, targetSelector: string)
	{
		let global = true
		while (text.includes('<!-- target ')) {
			const targetIndex = text.indexOf('<!-- target ') + 12
			const start       = text.indexOf(' -->', targetIndex) + 4
			const stop        = text.indexOf('<!-- end -->', start)

			let   localTargetSelector = text.slice(targetIndex, start - 4)
			const localText = text.slice(start, stop)
			text = text.slice(0, targetIndex - 12) + text.slice(stop + 12)
			this.setHTML(localText, localTargetSelector)

			if (global && localText.trim().length && document.querySelector(localTargetSelector)) {
				global = false
			}
		}

		let modifier: string
		[targetSelector, modifier] = targetSelector.split(':')
		let target = document.querySelector(targetSelector)
		if (!target && (targetSelector[0] === '#')) {
			target = document.createElement('div')
			target.setAttribute('id', targetSelector.slice(1))
			document.body.appendChild(target)
		}

		if (!target) {
			return console.error('target not found', targetSelector)
		}
		if (!global && (text.trim() === '')) {
			return
		}

		if (!modifier) {
			modifier = 'content'
		}
		else if (modifier === 'auto') {
			modifier = text.includes('id="' + targetSelector.slice(1) + '"')
				? 'replace'
				: 'content'
		}
		if (modifier === 'content') {
			target.innerHTML = text.trim().length ? text : ''
			return
		}

		let fragment: DocumentFragment | undefined
		fragment = document.createRange().createContextualFragment(text.trim().length ? text : '')
		switch (modifier) {
			case 'after':
				target.nextSibling
					? target.parentNode?.insertBefore(fragment, target.nextSibling)
					: target.parentNode?.appendChild(fragment)
				break
			case 'append':
				target.append(fragment)
				break
			case 'before':
				target.parentNode?.insertBefore(fragment, target)
				break
			case 'prepend':
				target.prepend(fragment)
				break
			case 'replace':
				target.replaceWith(fragment)
				break
			default:
				console.error('Invalid modifier', modifier)
		}
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
			? (document.getElementById(targetSelector.slice(1)) ?? undefined)
			: (document.querySelector<HTMLElement>(targetSelector) ?? undefined)
	}

	targetSelector(element: XTargetElement)
	{
		return ((element instanceof HTMLAnchorElement) || (element instanceof HTMLFormElement))
			? element.target
			: (element.formTarget ?? element.form?.target)
	}

}
export { XTarget }

export async function xTargetCall(action: string, target: string, options: Partial<Options<XTarget>> = defaultOptions)
{
	const anchor = document.createElement('a')
	anchor.setAttribute('href',   action)
	anchor.setAttribute('target', target)
	const xTarget = new XTarget(anchor, options)
	await xTarget.call(anchor)
}

export function XTargetDefaultOptions(options: Partial<Options<XTarget>>)
{
	defaultOptions = options
}

export type XTargetElement = HTMLAnchorElement | HTMLButtonElement | HTMLFormElement | HTMLInputElement
