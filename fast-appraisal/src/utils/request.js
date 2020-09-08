import axios from 'axios'
// create an axios instance
const service = axios.create({
	baseURL: process.env.API_HOST, // url = base url + request url
	timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
	config => {
		return config
	},
	error => {
		console.log(error) // for debug
		return Promise.reject(error)
	}
)

// response interceptor
service.interceptors.response.use(
	response => {
		const {status, statusText, data} = response
		if (status !== 200 || statusText !== "OK") {
			const errMsg = res.msg || '请求失败'
			return Promise.reject(new Error(errMsg))
		} else {
			return data
		}
	},
	error => {
		console.log('err', {error}) // for debug
		const {msg} = error.response.data

		return Promise.reject(error)
	}
)

export default service
