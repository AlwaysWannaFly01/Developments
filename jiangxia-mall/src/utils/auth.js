// {"token":"必填", //加密生成 加密字符串 JXYX_用户ID(无用户ID为：0)_时间戳_4位随机数 例：JXYX_14_1600565163_5984 }

import {encryptByDES, decryptByDES} from './encryptDES.js';

const userId = localStorage.getItem('userId')
// console.log(userId);
let TokenKey = ''
if (userId) {
	TokenKey = `JXYX_${userId}_`
} else {
	TokenKey = "JXYX_0_";
}
// console.log(TokenKey)
const tmp = Date.parse(new Date()).toString();

function rand(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

const randnum = rand(1000, 9999);

export function getToken() {
	return encryptByDES(TokenKey + tmp + "_" + randnum);
}
