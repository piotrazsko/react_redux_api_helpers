import axios from 'axios'
import _ from 'lodash'

const instance = axios.create({
	baseURL: 'https://randomuser.me',
	headers: {
		'Content-Type': 'application/json',
	},
	method: 'get',
})

export default params => {
	const { data, token } = params
	// TEMP:  may be structure of token will be changed
	return instance({ ...data })
		.then(response => response)
		.catch(error => {
			const { statusText, status } = error.response || {}

			const errorObj = {
				statusText,
				status,
				response: error.response,
			}
			throw errorObj
		})
}
