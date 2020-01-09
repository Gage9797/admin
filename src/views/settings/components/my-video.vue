<template>
  <div id="my-video">
    <video
    :src="url"
    controls="controls"
    class="my-video-item">
    您的浏览器不支持 video 标签。
    </video>
    <div class="mask">
      <Icon type="trash-a" color="white" size="40" @click.native="toDelete"></Icon>
    </div>
  </div>
</template>
<style lang="less" scoped>
#my-video {
  position: relative;
  width: 100%;
  height: 100%;
  .my-video-item {
    width: 100%;
    height: 100%;
  }
}
#my-video:hover {
  .mask {
    opacity: 1;
  }
}
.mask {
  position: absolute;
  top: 0;
  right: 0;
  padding: 25px;
  border-radius: 0 0 0 10px;
  text-align: center;
  cursor: pointer;
  opacity: 0;
  background: rgba(0,0,0,0.8);
}
</style>
<script>
export default {
	props: {
		url: ''
	},
	methods: {
		toDelete () {
			this.$emit('delete');
		}
	}
};
</script>

