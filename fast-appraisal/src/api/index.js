import request from '@/utils/request';
import _ from 'lodash';
import qs from 'qs';

export function getCode() {
	return request({
		url: '/Account/GetCode',
		method: 'get',
		responseType: 'arraybuffer'
	})
}

export function getListData(param) {
	const {size, page} = param;
	return request({
		url: '/Home/QuickEstimateBindGrid?page=' + page + '&size=' + size,
		method: 'get'
	})
}

export function postSearchData(params) {
	const {size, page, param} = params;
	return new Promise((resolve, reject) => {
		request({
			url: '/Home/QuickEstimateBindGrid?page=' + page + '&size=' + size,
			method: 'post',
			data: param
		}).then(res => {
			setTimeout(() => {
				resolve(res)
			}, 600)
		}).catch(err => {
			console.log(err)
		})
	})
}

/**
 * 请求接口公共方法
 */
export function Request(reqMethod, reqType = 'post', params = {}) {
	return new Promise((resolve, reject) => {
			let url = reqMethod;
			let promise;
			switch (reqType) {
				case 'post':
					// console.log(qs.stringify(params))
					promise = request({
						url,
						method: 'post',
						data: params
					})
					// promise = request({url, method: 'post', data: qs.stringify(params)})
					break;
				case 'get':
					if (_.isEmpty(params)) {
						url = reqMethod;
					} else {
						url = url + params.id;
					}
					promise = request({
						url,
						method: 'get',
						headers: {'content-type': 'application/x-www-form-urlencoded'},
					});
					break;
			}
			promise.then(response => {
				// console.log('请求成功');
				// console.log(response)
				setTimeout(() => {
					resolve(response)
				}, 500)
			}).catch(error => {
				console.log('请求失败');
				reject(error)
			})
		}
	)
}
