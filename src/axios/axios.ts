import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'

export interface ApiRequestParams {
	data: AxiosRequestConfig
	token?: string
}

export interface ApiErrorResponse {
	statusText?: string
	status?: number
	response?: any
}

let instance: AxiosInstance | undefined

export const init = (baseURL: string = 'http://localhost:3000'): void => {
	instance = axios.create({
		baseURL,
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'get',
	})
}

export default (params: ApiRequestParams): Promise<AxiosResponse> => {
	if (typeof instance === 'undefined') {
		throw new Error('need init axios instance')
	} else {
		const { data, token } = params
		// TEMP: may be structure of token will be changed
		return instance({ ...data })
			.then((response: AxiosResponse) => response)
			.catch((error: AxiosError) => {
				const { statusText, status } = error.response || {}

				const errorObj: ApiErrorResponse = {
					statusText,
					status,
					response: error.response,
				}
				throw errorObj
			})
	}
}
