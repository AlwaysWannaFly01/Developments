const qiniu = require('qiniu')
const config = {
	// 个人中心->秘钥管理->AccessKey
	"AK": "vSuZ2cz2CvtI7qnvnGSAzaqSPeDXenKR70cnMrKF",
	// 个人中心->秘钥管理->SecretKey
	"SK": "oHOz0Uuxrc1AkFbVCLo_c_FSM4yXx-w2tg5qn3r3",
	// 对象存储->新建存储空间的名字：(你自己创建时候空间名字)
	"Bucket": "awyspace"
}
console.log(qiniu)
// 官方文档：https://developer.qiniu.com/kodo/manual/1208/upload-token
const mac = new qiniu.auth.digest.Mac(config.AK, config.SK);
const options = {
	scope: config.Bucket,
	expires: 3600 * 24
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

module.exports = {
	uploadToken
}
