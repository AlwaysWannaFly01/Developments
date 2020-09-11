import request from '@/utils/request';

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

export function getItemData(param) {
	const {id} = param;
	return request({
		url: '/Home/QuickEstimateBindGrid?id=' + id,
		method: 'get'
	})
}

export function getTopicList(param) {
	const {page, limit} = param;
	return request({
		url: 'https://cnodejs.org/api/v1/topics?page=' + page + '&limit=' + limit,
		method: 'get'
	})
}

export function getData(url, data) {
	return request({
		url,
		method: 'get',
		data
	})
}

export function postData(url, data) {
	return request({
		url,
		method: 'post',
		data
	})
}

/**
 * 请求接口公共方法
 */
export function Request(reqMethod, reqType = 'post', params = {}) {
	return new Promise((resolve, reject) => {
			const url = reqMethod;
			// console.log(url);
			let promise
			switch (reqType) {
				case 'post':
					promise = request({url, params, method: 'post'});
					break;
				case 'get':
					promise = request({url, params, method: 'get'});
					break;
			}
			promise.then(response => {
				console.log('请求成功');
				// setTimeout(()=>{
					resolve(response)
				// },1500)
			}).catch(error => {
				console.log('请求失败');
				reject(error)
			})
		}
	)
}
