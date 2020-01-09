<style lang="less">
#upload-button {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  .top {
    width: 100%;
    height: 70%;
    text-align: center;
    padding-top: 20%;
  }
  .bottom {
    text-align: center;
  }
  .file {
    position: absolute;
	top: 0;
	left: 0;
    display: inline-block;
    background: yellow;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
}
</style>
<template>
  <div id="upload-button">
    <div class="top">
      <Icon type="plus" size="60" color="#ccc"></Icon>
    </div>
    <div class="bottom">
      {{ str }}
    </div>
    <input type="file" :accept="accept" class="file" ref="uploadFile" @change="toUpload">
  </div>
</template>

<script>
import axios from 'axios';
export default {
	props: {
		str: '',
		accept: {
			type: String,
			default: '*/*'
		}
	},
	methods: {
		// 获取token准备上传
		toUpload () {
			let file = this.$refs.uploadFile.files[0];

			if (typeof file === 'undefined') {
				return;
			}

			if (this.accept.indexOf('image') !== -1 && file.type.indexOf('image/') === -1) {
				this.$Message.error('请选择图片');
				return;
			}

			this.$emit('startUpload');
			let self = this;
			this.$http.request(this, 'GET', '/oss/getToken/0')
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						let token = res.result.token;
						self.upload(token);
					} else {
						self.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (err) {
					console.log(err);
				});
		},
		// 使用获取到的token进行上传
		upload (token) {
			let file = this.$refs.uploadFile.files[0];
			let formData = new FormData();
			formData.append('token', token);
			formData.append('file', file);
			axios.post(
				this.$config.qiniuUrl,
				formData,
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}
			).then(res => {
				let url = this.$config.cdnUrl + res.data.key;
				this.$emit('success', url);
				this.$refs.uploadFile.value = '';
			}).catch(err => {
				console.log(err);
				this.$emit('fail');
				this.$Message.error('上传失败');
				this.$refs.uploadFile.value = '';
			});
		}
	}
};
</script>


