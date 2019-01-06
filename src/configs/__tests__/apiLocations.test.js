import { getApiUrl } from '../api.js'

const internalUrl = `applications:/v1/application?page=${0}&size=${50}`
const externalUrl = 'external:https://randomuser.com/api/?inc=name&results=50'
const httpsUrl = 'https://randomuser.com/api/?inc=name&results=50'

test('internal:', () => {
	expect(getApiUrl(internalUrl)).toBe(
		'https://uni-applications.dev.kredo:443/v1//v1/application?page=0&size=50'
	)
})
test('external:', () => {
	expect(getApiUrl(externalUrl)).toBe('https://randomuser.com/api/?inc=name&results=50')
})
test('https:', () => {
	expect(getApiUrl(httpsUrl)).toBe('https://randomuser.com/api/?inc=name&results=50')
})
