<style lang="less" scoped>
.cover-wrapper {
	position: fixed;
	width: 100%;
	height: 100%;
	z-index: 30;
}
.cover {
	position: fixed;
	left: 0;
	top: 0;
	width: 0;
	height: 0;
	border-radius: 50%;
	box-shadow: inset 0 0 20px 1px,0 0 5px 2000px rgba(0,0,0,0.8);
	z-index: 31;
	transition: all 0.3s;
}
.cover-con {
	position: absolute;
	left: 0;
	top: 0;
	color: #fff;
	font-size: 22px;
	letter-spacing: 6px;
	transform: translate(300px, 300px);
	z-index: 32;
	transition: all 0.3s;
}
</style>

<template>
	<div id="cover-wrapper" class="cover-wrapper" v-if="hasNext">
		<div id="cover" class="cover"></div>
		<div id="cover-con" class="cover-con">
			<p>{{ msg }}</p>
			<i-button
				style="color: #c3a451; margin-top: 20px;"
				type="ghost"
				v-show="btnText !== ''"
				@click="next">
				{{ btnText }}
			</i-button>
		</div>
	</div>
</template>

<script>
import Steps from './steps';

export default {
	name: 'cover',
	data () {
		return {
			cover: null,
			coverCon: null,
			msg: '',
			btnText: '',
			done: false,
			index: 0,
			step: null,
			hasNext: false,
			lastEle: null,
			isBlocked: false
		};
	},
	computed: {
		isFirstEnter () {
			return this.$store.state.user.isFirstEnter;
		}
	},
	mounted () {
		// setTimeout(this.begin, 1000);
		// this.hasNext = true;
		// setTimeout(this.begin, 300);
	},
	methods: {
		begin () {
			this.cover = document.getElementById('cover');
			this.coverCon = document.getElementById('cover-con');
			this.process(Steps[0]);
		},
		process (step) {
			if (step.before) {
				this.isBlocked = true;
				step.before(() => {
					ani.call(this);
					this.isBlocked = false;
				});
			} else {
				ani.call(this);
			}

			function ani () {
				let ele = document.querySelector(step.ele);
				if (ele) {
					let rect = ele.getBoundingClientRect();
					this.resetStyle(rect.left, rect.top, ele.clientWidth, ele.clientHeight);
				}
				// 显示内容
				this.msg = step.msg || '';
				this.btnText = step.btnText || '(o^^o)';

				this.done = step.done;
				this.step = step;

				step.after && step.after(ele);
			}
		},
		next () {
			if (this.isBlocked) {
				return false;
			}

			if (!this.done) {
				this.process(Steps[++this.index]);
			} else {
				this.step.doneCallback(this);
				this.hasNext = false;
			}
		},
		resetStyle (left, top, width, height) {
			let coverStyleStr = `width: ${width + 10}px; height: ${height + 10}px;transform: translate(${left - 5}px, ${top - 5}px);`;
			let conStyleStr = `transform: translate(${left + width + 20}px, ${top + 5}px);`;
			this.cover.style = coverStyleStr;
			(this.index > 0) && (this.coverCon.style = conStyleStr);
		}
	},
	watch: {
		isFirstEnter: {
			immediate: true,
			handler: function (v) {
				if (v) {
					this.hasNext = true;
					setTimeout(this.begin, 300);
				}
			}
		}
	}

};
</script>
