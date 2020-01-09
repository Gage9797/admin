<style lang="less" scoped>
.img-preview {
	position: relative;
	// width: 200px;
	width: 100%;
	overflow: hidden;

	.img-delete {
		position: absolute;
		width: 100%;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.8);
		bottom: 0;
		z-index: 39;
	}
}
</style>


<template>
  <div class="QNupload">
    <i-row :gutter="16">
      <i-col span="12">
        <i-card>
          <p slot="title" v-if="title">{{ title }}</p>
          <i-upload
		  	multiple
			type="drag"
			action="#"
			:before-upload="upload">
            <div style="padding: 20px 0">
				<div v-if="hasPic">
					<div class="img-preview">
						<img :src="previewPic" alt="img preview" width="100%">
						<div class="img-delete">
							点击或拖拽替换图片
						</div>
					</div>
				</div>
				<div v-else>
					<Icon type="ios-cloud-upload" size="52" style="color: #c3a451"></Icon>
					<p>点击或拖拽文件上传</p>
				</div>
            </div>
          </i-upload>
			<div v-show="fileName !== ''">
				<i-progress style="margin-bottom:10px" v-show="isShowProgress" :percent="uploadProgress"></i-progress>
				<div>您已上传文件：{{fileName}}</div>
			</div>

        </i-card>
      </i-col>
    </i-row>

  </div>
</template>

<script>
import * as qiniu from 'qiniu-js';
import config from '@/config';

const { PUBLIC_CDN, PRIVATE_CDN } = config;

export default {
	name: 'QNupload',
	props: {
		showPreview: {
			type: Boolean,
			default: false
		},
		pic: {
			type: String,
			default: ''
		},
		title: {
			default: '媒体管理'
		},
		maxSize: {
			type: Number,
			default: 2048 // 默认情况下限制文件大小为2M
		},
		isPrivate: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			index: 0,
			uploadToken: '',
			isShowProgress: false,
			valid: '',
			uploadProgress: 0,
			categoryList: [],
			formDynamic: {
				items: []
			},
			fileName: '',
			url: '',
			previewPic: this.pic,
			uploadFlag: false
		};
	},
	computed: {
		hasPic () {
			return this.pic !== '';
		}
	},
	mounted () {
		this.previewPic = this.pic;
		this.getUploadToken();
	},
	methods: {
		getUploadToken () {
			let me = this;
			const params = this.isPrivate ? 1 : 0;
			this.$http.request(this, 'GET', '/oss/getToken/' + params, {}).then(function (response) {
				let res = response.data;
				if (res.errCode === '000000') {
					me.uploadToken = res.result.token;
					me.valid = res.result.valid;
					this.observeToken();
				} else {
					me.$Message.error({
						content: res.errMsg
					});
				}
			}).catch(function (error) {});
		},
		observeToken () {
			if (this.valid <= 0) {
				this.getUploadToken();
			} else {
				// 每1分钟查一次
				setTimeout(() => {
					this.valid -= 60;
					this.observeToken();
				}, 6000);
			}
		},
		submit () {
			let params = {};
			params.files = [];
			for (let index = 0; index < this.formDynamic.items.length; index++) {
				const element = this.formDynamic.items[index];
				let node = {
					key: element.name,
					hash: element.hash,
					category: element.category,
					remark: element.value
				};
				params.files.push(node);
			}
		},
		upload (file) {
			if (file.size > this.maxSize * 1024) {
				return this.handleMaxSize(file);
			}

			const fr = new FileReader();
			fr.readAsDataURL(file);
			fr.onload = () => {
				this.previewPic = fr.result;
			};

			let me = this;
			let key = new Date().getTime() + '-' + file.name;
			let observable = qiniu.upload(
				file,
				key,
				me.uploadToken
			);
			me.isShowProgress = true;
			observable.subscribe(
				function (res) {
					me.uploadProgress = res.total.percent;
				},
				function (err) {
					me.$Message.error('图片上传失败');
					console.log('err', err);
				},
				function (res) {
					if (me.isPrivate) {
						me.url = PRIVATE_CDN + res.key;
					} else {
						me.url = PUBLIC_CDN + res.key;
					}
					// me.showPreview && me.$emit('update:pic', me.url);

					me.fileName = file.name;
					me.uploadFlag = true; // 用来标记是否是上传导致的 pic 更新
					me.$emit('update:pic', me.url);
					me.$emit('resourceUrl', me.url, '');
				}
			);
			return false;
		},
		addFormItem (file, res) {
			this.index++;
			this.formDynamic.items.push({
				fileName: file.name,
				name: res.key,
				hash: res.hash,
				category: '',
				value: '',
				index: this.index
			});
		},
		handleMaxSize (file) {
			this.$Message.error('照片大小不可超过' + this.maxSize + 'kb');
		}
	},
	watch: {
		pic: function (v) {
			if (this.uploadFlag) {
				// 如果是 上传 导致的 pic 更新，由于previewPic 中的值 已经被设置为 base64 的值，无需同步。
				this.uploadFlag = false;
			} else {
				// 通过属性传入，使之同步。
				this.previewPic = v;
				this.fileName = '';
			}
		}
	}
};
</script>
