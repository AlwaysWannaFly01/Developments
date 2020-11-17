import {Toast} from "vant";

export default function (message, type = null, duration = 2000, callback) {
	if (type === null) {
		// Toast(message);
		Toast({
			message,
			duration
		});
	} else if (type === 'loadType') {
		Toast.loading({
			message: '加载中...',
			forbidClick: true,
			duration
		});
	} else {
		Toast({
			message,
			type,
			duration
		});
	}
	if (callback) {
		setTimeout(() => {
			callback();
		}, duration)
	}
}
