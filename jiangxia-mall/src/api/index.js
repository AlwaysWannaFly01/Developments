import { requestMain, requestJxyx } from "@/utils/request";
import _ from "lodash";
import qs from "qs";

/**
 * 请求接口公共方法
 */
export function Request(type, reqMethod, reqType = "post", params = {}) {
	let HostType;
	if (type === "main") {
		HostType = requestMain;
	} else if (type === "jxyx") {
		HostType = requestJxyx;
	}

	return new Promise((resolve, reject) => {
		let url = reqMethod;
		let promise;
		switch (reqType) {
			case "post":
				promise = HostType({
					url,
					method: "post",
					data: params
				});
				break;
			case "get":
				if (_.isEmpty(params)) {
					url = reqMethod;
				} else {
					url = url + params.id;
				}
				promise = HostType({
					url,
					method: "get"
				});
				break;
		}
		promise
			.then(response => {
				setTimeout(() => {
					resolve(response);
				}, 500);
			})
			.catch(error => {
				console.log("请求失败");
				reject(error);
			});
	});
}
