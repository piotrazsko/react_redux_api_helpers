import createHistory from 'history/createBrowserHistory'
import qs from 'querystring'

const history = createHistory()

const addLocationQuery = () => {
	const search = history.location.search.replace('?', '')
	history.location = Object.assign(history.location, { query: qs.parse(search) })
}

addLocationQuery()

history.listen(() => {
	addLocationQuery(history)
})

export default history
