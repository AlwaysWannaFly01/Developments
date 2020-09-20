import {Toast} from "vant";

export default function (message, type = null, duration = 2000) {
	if (type === null) {
		Toast(message)
	} else {
		Toast({
			message,
			type,
			duration
		});
	}
}
