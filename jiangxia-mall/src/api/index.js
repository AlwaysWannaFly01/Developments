import request from '@/utils/request';
import _ from 'lodash';
import qs from 'qs';

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
