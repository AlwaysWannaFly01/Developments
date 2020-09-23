import axios from "axios";
import { getToken } from "@/utils/auth";

console.log(process.env.API_HOST)
const instance = axios.create({
	baseURL: process.env.API_HOST, // url = base url + request url
	timeout: 5000 // request timeout
});

const instanceJxyx = axios.create({
	baseURL: process.env.JXYX_HOST,
	timeout: 5000
});

function request(service) {
	service.interceptors.request.use(
		config => {
			config.headers["token"] = getToken();
			return config;
		},
		error => {
			console.log(error); // for debug
			return Promise.reject(error);
		}
	);

	service.interceptors.response.use(
		response => {
			// console.log('response: ', response);
			const { status, statusText, data } = response;
			if (status !== 200 || statusText !== "OK") {
				const errMsg = res.msg || "请求失败";
				return Promise.reject(new Error(errMsg));
			} else {
				return data;
			}
		},
		error => {
			console.log("err", { error }); // for debug
			const { msg } = error.response.data;
			return Promise.reject(error);
		}
	);

	return service;
}

const requestMain = request(instance);
const requestJxyx = request(instanceJxyx);

export { requestMain, requestJxyx };
