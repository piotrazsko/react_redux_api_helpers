export type ApiRouteFunction = (payload?: any) => any

export interface ApiRoutesInterface {
	routes: { [key: string]: ApiRouteFunction }
	add: (key: string, func: ApiRouteFunction) => void
}

class ApiRoutesClass implements ApiRoutesInterface {
	public routes: { [key: string]: ApiRouteFunction } = {}

	public add = (key: string, func: ApiRouteFunction): void => {
		if (typeof func === 'function') {
			if (key in this.routes) {
				console.warn('Check your key! This key is already in use.')
			}
			this.routes[key] = func
		} else {
			throw new Error('Check your arguments')
		}
	}
}

const ApiRoutes = (() => {
	let instance: ApiRoutesClass

	return function (): ApiRoutesClass {
		if (!instance) {
			instance = new ApiRoutesClass()
		}
		return instance
	}
})()

export const apiRoutes = ApiRoutes()
export default ApiRoutes
