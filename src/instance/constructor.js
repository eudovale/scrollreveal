import defaults from './defaults'
import noop from './noop'

import destroy from './methods/destroy'
import reveal from './methods/reveal'
import sync from './methods/sync'
import watch from './methods/watch'

import { transformSupported, transitionSupported } from '../utils/browser'
import { getNode, logger } from '../utils/core'
import { deepAssign, nextUniqueId } from '../utils/generic'


export default function ScrollReveal (options = {}) {

	// Returns a new instance without `new` keyword.
	if (typeof this === 'undefined' || Object.getPrototypeOf(this) !== ScrollReveal.prototype) {
		return new ScrollReveal(options)
	}

	if (!ScrollReveal.isSupported()) {
		logger('Instantiation aborted.', 'This browser is not supported.')
		return noop
	}

	try {
		Object.defineProperty(this, 'defaults', {
			get: (() => {
				const config = {}
				deepAssign(config, defaults, options)
				return () => config
			})(),
		})
	} catch (error) {
		logger('Instantiation failed.', 'Invalid configuration provided.', error.message)
		return noop
	}

	const container = getNode(this.defaults.container)
	if (!container) {
		logger('Instantiation failed.', 'Invalid or missing container.')
		return noop
	}

	document.documentElement.classList.add('sr')

	this.store = {
		containers: {},
		elements: {},
		history: [],
		sequences: {},
	}

	const containerId = nextUniqueId()
	this.store.containers[containerId] = {
		id: containerId,
		node: container,
	}

	this.initialized = false
}

ScrollReveal.isSupported = () => transformSupported() && transitionSupported()

ScrollReveal.prototype.destroy = destroy
ScrollReveal.prototype.reveal = reveal
ScrollReveal.prototype.sync = sync
ScrollReveal.prototype.watch = watch
