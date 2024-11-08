import build              from '../node_modules/@itrocks/build/build.js'
import XTarget            from './xtarget.js'
import { XTargetElement } from './xtarget.js'

export default function buildXTarget(
	targetStart = ['#'], targetEqual = ['main'], elements = ['a', 'form', 'button', 'input']
) {
	const selectors = [] as string[]
	for (const element of elements) {
		const attribute = ['button', 'input'].includes(element) ? 'formtarget' : 'target'
		for (const equal of targetEqual) {
			selectors.push(element + '[' + attribute + '="' + equal + '"]')
		}
		for (const start of targetStart) {
			selectors.push(element + '[' + attribute + '^="' + start + '"]')
		}
	}
	build<XTargetElement>(selectors.join(', '), element => new XTarget(element))
}
