<style lang="less">
@import "../../../styles/loading.less";
.upload-btns {
  position: absolute;
  right: 20px;
  top: 20px;
}
.upload-animation {
	color: #c3a451;
	text-align: center;
	padding: 80px;
}
.confirm-text {
	color: #c3a451;
	text-align: center;
	padding: 30px;
	font-size: 20px;
}
</style>

<template>
    <div>
        <Card shadow>
					<textarea class='tinymce-textarea' :id="tinymceId"></textarea>
					<div class="upload-btns">
						<Upload
							action="#"
							style="display: inline-block;"
							:before-upload="uploadPhoto">
							<Button
								type="primary"
								icon="ios-camera"
								size="small"
								>
								上传图片
							</Button>
						</Upload>
						<Upload
							action="#"
							style="display: inline-block;"
							:before-upload="uploadViedo">
							<Button
								type="primary"
								icon="ios-videocam"
								size="small"
								>
								上传视频
							</Button>
						</Upload>
					</div>
        </Card>
				<Modal
					v-model="showConfirm"
					title="上传确认"
					:mask-closable="false"
					>
					<div
						v-if="(!showAnimation) && showConfirm"
						class="confirm-text">
						将向编辑框中插入
						<br>
						{{ currentFile.name }}
						<br>
						确定吗？
					</div>
					<div
						v-else
						class="upload-animation">
						<Icon type="load-c" size=30 class="demo-spin-icon-load"></Icon>
						<div>文件上传中......</div>
					</div>
					<div slot="footer">
						<Button
							type="text"
							size="large"
							@click="cancelUpload"
							>取消
						</Button>
						<Button
							type="primary"
							size="large"
							@click="confirmUpload"
							>确定
						</Button>
					</div>
				</Modal>
    </div>
</template>

<script>
import tinymce from 'tinymce';
import axios from 'axios';

export default {
	name: 'text-editor',
	props: {
		id: {
			type: String,
			default: function () {
				return 'vue-tinymce-' + ((Math.random() * 1000).toFixed(0) + '');
			}
		},
		value: {
			type: String,
			default: ''
		},
		height: {
			type: Number,
			required: false,
			default: 360
		}
	},
	data () {
		return {
			tinymceId: this.id,
			qiniuUrl: this.$config.qiniuUrl,
			cdnUrl: this.$config.cdnUrl,
			showConfirm: false,
			currentFile: null,
			currentFlag: 1,
			showAnimation: false
		};
	},
	methods: {
		init () {
			this.$nextTick(() => {
				let height = this.height;
				let vm = this;
				tinymce.init({
					selector: `#${this.tinymceId}`,
					branding: false,
					elementpath: false,
					height: height,
					language: 'zh_CN.GB2312',
					menubar: 'edit insert view format table tools',
					plugins: [
						'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
						'searchreplace visualblocks visualchars code fullpage',
						'insertdatetime media nonbreaking save table contextmenu directionality',
						'paste textcolor colorpicker textpattern imagetools codesample wordcount'
					],
					toolbar1:
            'newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample wordcount',
					autosave_interval: '20s',
					image_advtab: true,
					table_default_styles: {
						width: '100%',
						borderCollapse: 'collapse'
					},
					init_instance_callback: editor => {
						if (vm.value) {
							editor.setContent(vm.value);
						}
						vm.hasInit = true;
						editor.on('NodeChange Change KeyUp SetContent', () => {
							this.hasChange = true;
							this.$emit('input', editor.getContent());
						});
					}
				});
			});
		},
		setContent (value) {
			tinymce.get(this.tinymceId).setContent(value);
		},
		getContent () {
			tinymce.get(this.tinymceId).getContent();
		},
		getTextContent () {
			return tinymce.get(this.tinymceId).getContent({ formformat: 'text' });
		},
		getWordcount () {
			return tinymce.get(this.tinymceId).plugins.wordcount.getCount();
		},
		isContentEmpty () {
			const contentText = this.getTextContent();
			const hasNoMedia = contentText.indexOf('img') === -1 && contentText.indexOf('video') === -1;
			// 编辑器为空：没有媒体文件 并且 字数为 0
			return hasNoMedia && this.getWordcount() === 0;
		},
		// 上传文件处理函数
		uploadHandler (file, flag) {
			// flag = 1 代表上传文件，flag = 2 代表上传视频
			this.$http
				.request(this, 'GET', '/oss/getToken/0')
				.then(response => {
					let res = response.data;
					if (res.errCode == '000000') {
						let token = res.result.token;
						let formData = new FormData();
						formData.append('token', token);
						formData.append('file', file);
						axios
							.post(this.qiniuUrl, formData, {
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								}
							})
							.then(res => {
								let url = this.cdnUrl + res.data.key;
								this.showConfirm = false;
								this.showAnimation = false;
								switch (flag) {
									case 1:
										tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${url}" >`);
										break;
									case 2:
										tinymce.get(this.tinymceId).insertContent(`<video controls="controls"><source src="${url}" /></video>`);
										break;
								}
							})
							.catch(err => {
								console.log(err);
								this.showConfirm = false;
								this.showAnimation = false;
							});
					} else {
						self.$Message.error({
							content: '[' + res.errCode + ']' + res.errMsg
						});
					}
				})
				.catch(err => {
					console.log(err);
					this.showConfirm = false;
					this.showAnimation = false;
				});
		},
		// 确认上传文件
		uploadConfirm (file, flag) {
			this.currentFile = file;
			this.currentFlag = flag;
			this.showConfirm = true;
		},
		// 上传图片
		uploadPhoto (photo) {
			this.uploadConfirm(photo, 1);
			return false;
		},
		// 上传视频
		uploadViedo (video) {
			this.uploadConfirm(video, 2);
			return false;
		},
		// 取消图片或者视频的上传
		cancelUpload () {
			this.showConfirm = false;
		},
		// 确认上传图片或者视频
		confirmUpload () {
			this.uploadHandler(this.currentFile, this.currentFlag);
			this.showAnimation = true;
		}
	},
	mounted () {
		this.init();
	},
	watch: {
		value (val) {
			if (!this.hasChange && this.hasInit) {
				this.$nextTick(() => {
					tinymce.get(this.tinymceId).setContent(val || '');
				});
			}
		}
	},
	destroyed () {
		tinymce.get(this.tinymceId).destroy();
	}
};
</script>
