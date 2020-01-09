<template>
  <div id="pic" @mouseover="toShowDelete" @mouseout="notShowDelete">
    <img :src="imgUrl" alt="">
    <div v-show="showDelete" class="mask">
      <div
				class="wrapper"
			  @click="toDelete">
        <Icon
          type="ios-trash-outline"
          color="white"
          size="100"
          >
        </Icon>
      </div>
    </div>
  </div>
</template>
<script>
export default {
	props: {
		imgUrl: ''
	},
	data () {
		return {
			showDelete: false
		};
	},
	methods: {
		toShowDelete () {
			this.showDelete = true;
		},
		notShowDelete () {
			this.showDelete = false;
		},
		toDelete () {
			this.$emit('delete');
		}
	}
};
</script>
<style lang="less" scoped>
#pic {
  position: relative;
  width: 100%;
  height: 100%;
  background: #eee;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: rgba(0,0,0,0.5);
    .wrapper {
      text-align: center;
      padding-top: 15px;
    }
  }
}
</style>

