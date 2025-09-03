import { describe, test, expect } from 'vitest'
import { apiSelector } from '../apiSelector'
import { ApiState } from '../apiSelector'

describe('API Selector', () => {
	test('test apiSelector:', () => {
		expect(typeof apiSelector('TEST_REQUEST')).toBe('function')
	})

	test('test apiSelector: with wrong Action name', () => {
		expect(() => {
			apiSelector('TEST_REQUESST')
		}).toThrow()
	})

	test('test selector success request', () => {
		const state: ApiState = {
			api: {
				TEST_SUCCESS: {
					responseData: 'test',
					timestamp: Date.now(),
				},
			},
		}
		const result = apiSelector('TEST_REQUEST')(state)
		expect(result).toBe('test')
	})

	test('test selector success request after failed', () => {
		const now = Date.now()
		const state: ApiState = {
			api: {
				TEST_SUCCESS: {
					responseData: 'test',
					timestamp: now,
				},
				TEST_FAILED: {
					responseData: 'fail',
					timestamp: now - 100,
				},
			},
		}
		expect(apiSelector('TEST_REQUEST')(state)).toBe('test')
	})

	test('test selector failed after success', () => {
		const now = Date.now()
		const state: ApiState = {
			api: {
				TEST_SUCCESS: {
					responseData: 'test',
					timestamp: now,
				},
				TEST_FAILED: {
					responseData: 'fail',
					timestamp: now + 100,
				},
			},
		}
		// With default filter='success', this should return initial data since latest is failed
		const result = apiSelector('TEST_REQUEST')(state)
		expect(Array.isArray(result)).toBe(true)
		expect(result.loaded).toBe(false)
	})

	test('test selector failed request with filter=false', () => {
		const state: ApiState = {
			api: {
				TEST_FAILED: {
					responseData: 'test',
				},
			},
		}
		// Use filter=false to get any status
		expect(apiSelector('TEST_REQUEST', { filter: false })(state)).toBe('test')
	})

	test('test if store has no response', () => {
		const state: ApiState = {
			api: {
				TEST_REQUEST: {
					responseData: 'test',
				},
			},
		}
		expect(apiSelector('TEST_REQUEST')(state)).toBeDefined()
	})

	test('test if store has no request', () => {
		const state: ApiState = {
			api: {},
		}
		expect(apiSelector('TEST_REQUEST')(state)).toBeDefined()
	})
})
