import { apiSelector } from '../api'

test('test  apiSelector:', () => {
	expect(typeof apiSelector('TEST_REQUEST')).toBe('function')
})

test('test  apiSelector: with wrong Action name', () => {
	expect(() => {
		apiSelector('TEST_REQUESST')
	}).toThrow()
})

test('test  selector success request', () => {
	const state = {
		api: {
			TEST_SUCCESS: {
				response: 'test',
				timestamp: Date.now(),
			},
		},
	}
	console.log(apiSelector('TEST_REQUEST')(state))
	expect(apiSelector('TEST_REQUEST')(state).response).toBe('test')
})

test('test  selector success request after failed', () => {
	const state = {
		api: {
			TEST_SUCCESS: {
				response: 'test',
				timestamp: Date.now(),
			},
			TEST_FAILED: {
				response: 'fail',
				timestamp: Date.now() - 100,
			},
		},
	}
	expect(apiSelector('TEST_REQUEST')(state).response).toBe('test')
})

test('test  selector success failed  after sucess', () => {
	const state = {
		api: {
			TEST_SUCCESS: {
				response: 'test',
				timestamp: Date.now(),
			},
			TEST_FAILED: {
				response: 'fail',
				timestamp: Date.now() + 100,
			},
		},
	}
	expect(apiSelector('TEST_REQUEST')(state).response).toBe('fail')
})

test('test  selector failed request ', () => {
	const state = {
		api: {
			TEST_FAILED: 'test',
		},
	}
	expect(apiSelector('TEST_REQUEST')(state)).toBe('test')
})

test('test  if store hasn`t  response ', () => {
	const state = {
		api: {
			TEST_REQUEST: 'test',
		},
	}

	expect(apiSelector('TEST_REQUEST')(state)).toBeDefined()
})

test('test  if store hasn`t   request ', () => {
	const state = {
		api: {},
	}
	expect(apiSelector('TEST_REQUEST')(state)).toBeDefined()
})
