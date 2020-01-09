import { formatPrice } from '@/tools';

export default {
	filters: {
		formatPrice (v) {
			return formatPrice(v);
		}
	},
	data () {
		return {
			canUse: false
		};
	},
	computed: {
		requestTimestamp () {
			let start = this.daterange[0].getTime();
			let end = this.daterange[1].getTime();

			return {
				start,
				end
			};
		}
	},
	created () {
		// this.$store
		// 	.dispatch('GetAppInfo')
		// 	.then(({ appVersion, restTime }) => {
		// 		this.canUse = (appVersion === 3 && restTime >= 0);
		// 		this.canUse && (this.search && this.search());
		// 	})
		// 	.catch(err => {
		// 		console.log(err);
		// 	});

		let now = new Date();
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);

		let sevenDayAgoTimestamp = +now - 30 * 24 * 60 * 60 * 1000;
		let sevenDayAgo = new Date(sevenDayAgoTimestamp);

		this.daterange = [sevenDayAgo, now];

		// 产品说试用版可以用报表了。
		this.canUse = true;
		this.search && this.search();
	}
};
