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
		url: '/Home/QuickEstimateBindGrid?id='+id,
		method: 'get'
	})
}
export function getTopicList(param){
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
