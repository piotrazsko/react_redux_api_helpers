const ApiRoutes = new (function () {
	var instance = this
	this.routes = {}
	this.add = (key, func) => {
		if (typeof func === 'function') {
			if (key in this.routes) {
				console.warn('Check your key! This key is already in use.')
			}
			this.routes[key] = func
		} else {
			throw new Error('Check your arguments')
		}
	}
	return function () {
		return instance
	}
})()
export const apiRoutes = new ApiRoutes()
export default ApiRoutes
