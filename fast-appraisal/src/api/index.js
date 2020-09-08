import request from '@/utils/request';

export function getCode() {
	return request({
		url:'/Account/GetCode',
		method: 'get',
		responseType: 'arraybuffer'
	})
}

export function postData(url,data){
	return request({
		url,
		method:'post',
		data
	})
}
