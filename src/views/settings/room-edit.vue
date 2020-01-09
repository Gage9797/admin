<template>
  <div id="settings-room-edit">
    <div class="top-bar">
      <div class="left">包间编辑</div>
      <div class="right">
        <Button
			:loading="submitLoading"
			type="success"
			@click="submit">
          &emsp;提交&emsp;
        </Button>
      </div>
    </div>
    <Tabs type="card">
      <TabPane label="基础信息"  class="ql-tab-pane">
        <Form :label-width="100">
          <FormItem label="包间名称">
            <Input v-model="currentRoom.name" placeholder="包间名" :maxlength="30" />
          </FormItem>
          <FormItem label="推荐人数">
			  <InputNumber :min="1" :max="1024" :precision="0" v-model="currentRoom.min" />
              <span>-</span>
			  <InputNumber :min="1" :max="1024" :precision="0" v-model="currentRoom.max" />
              <span>人</span>
          </FormItem>
          <FormItem label="预订定金">
			  <InputNumber2 :min="0.01" :max="65536" :precision="2" v-model="currentRoom.earnest" />
              <span>元</span>
          </FormItem>
		  <FormItem label="定金是否可退">
            <RadioGroup v-model="currentRoom.isRefundable">
				<Radio label="0">
					<span>可退</span>
				</Radio>
				<Radio label="1">
					<span>不可退</span>
				</Radio>
				<Radio label="2">
					<span>其他</span>
				</Radio>
    		</RadioGroup>
			<p class="supplement" v-show="currentRoom.isRefundable !== '2'">注：顾客取消订单定金<span v-show="currentRoom.isRefundable === '1'">不</span>可退</p>
          </FormItem>
		  <FormItem label="  "  v-if="ifShowRefundLimit">
            <span>超过包间保留时长</span>
			<InputNumber  :min="0" v-model="currentRoom.refundTimeLimit" />
			<span>分钟顾客未到店消费则不退定金</span>
          </FormItem>
		  <!-- <FormItem label="预定保留时长">
			  超过 <InputNumber :min="0" v-model="currentRoom.reservationRetaindTime" style="width:8%;"/> 分钟预定包间未开台则取消预定
		  </FormItem> -->
		  <FormItem label="包间费用">
			  <InputNumber2 :min="0.01" :max="65536" :precision="2" v-model="currentRoom.priceValue" />
              <span>元</span>
			  <InputNumber :min="1" :max="24" :precision="0" v-model="currentRoom.priceHour" />
              <span>小时</span>
          </FormItem>
		  <FormItem label="包间续费">
            <span>超过包间时长</span>
			<InputNumber :min="1" :max="59" :precision="0" v-model="currentRoom.renewTimeLimit" />
			<span>分钟加收</span>
			<InputNumber2 :min="0.01" :max="65536" :precision="2" v-model="currentRoom.renewPriceValue" />
			<span>元</span>
			<InputNumber :min="1" :max="24" :precision="0" v-model="currentRoom.renewPriceHour" />
			<span>小时</span>
          </FormItem>
		  <FormItem label="超时服务费">
            <span>超过营业时间需要加收服务费，这部分费用占超时部分费用的</span>
			<InputNumber  :min="0" :max="1024" :precision="2" v-model="currentRoom.serviceCharge" />
			<span>%</span>
          </FormItem>
          <FormItem label="是否可用">
			  <RadioGroup v-model="currentRoom.state" @keydown.native="preventTapDefault">
				<Radio label="1">
					<span>是</span>
				</Radio>
				<Radio label="0">
					<span>否</span>
				</Radio>
    		 </RadioGroup>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="图片管理"  class="ql-tab-pane"  @keydown.native="preventTapDefault">
        <div class="swiper-pics">
          <div class="title">包间封面图片</div>
          <div class="rectangle" v-if="currentRoom.pic!=''">
            <pic :imgUrl="currentRoom.pic" @delete="deletePic"></pic>
          </div>
          <div class="rectangle" v-if="currentRoom.pic==''">
            <upload-button
				str="添加图片"
				accept=".jpg, .png, .jpeg"
				@startUpload="showAnimation"
				@success="addPic"
			>
			</upload-button>
          </div>
        </div>
      </TabPane>
      <TabPane label="视频管理"  class="ql-tab-pane" @keydown.native="preventTapDefault">
        <div v-if="currentRoom.video!=''" class="video-wrapper">
          <my-video :url="currentRoom.video"
          @delete="deleteVideo"
          ></my-video>
        </div>
        <div v-if="currentRoom.video==''" class="add-video-wrapper">
          <div class="rectangle">
              <upload-button
				str="添加视频"
				accept=".avi, .wma, .rmvb, .mp4"
				@startUpload="showAnimation"
				@success="addVideo"
			>
				</upload-button>
          </div>
        </div>
      </TabPane>
      <TabPane label="详情设置"  class="ql-tab-pane" @keydown.native="preventTapDefault">
				<text-editor
					id="room-detail-editor"
					ref="detail"
					:height="400"
					v-model="currentRoom.detail"
				/>
      </TabPane>
      <TabPane label="购买须知" class="ql-tab-pane" @keydown.native="preventTapDefault">
				<text-editor
					id="room-exhort-editor"
					ref="attentions"
					:height="400"
					v-model="currentRoom.purchaseNotes"
					/>
      </TabPane>
    </Tabs>
    <!--加载遮罩层-->
    <Spin size="large" fix v-if="showLoading"></Spin>
  </div>
</template>
<style lang="less" scoped>
.top-bar {
  height: 45px;
  margin-bottom: 15px;
  background: #e4e4e2;
  border-radius: 5px;
  .left {
    float: left;
    font-size: 20px;
    color: #7b7256;
    text-indent: 20px;
    line-height: 45px;
  }
  .right {
    float: right;
    line-height: 45px;
    padding-right: 20px;
  }
}
.title {
  width: 100%;
  font-size: 20px;
  margin-bottom: 10px;
  text-align: left;
  color: #7b7256;
}
.rectangle {
  display: inline-block;
  width: 130px;
  height: 130px;
  border: 1px solid #ddd;
  border-radius: 20px;
  overflow: hidden;
}
.source-pics {
  margin-top: 20px;
}
.source-label {
  vertical-align: top;
}
.source-url {
  display: inline-block;
  vertical-align: top;
  width: 500px;
  outline: none;
  text-indent: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.pic-item {
  margin-bottom: 15px;
}
.video-wrapper {
  margin: 10px 150px 10px 150px;
  border: 2px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
}
.add-video-wrapper {
  text-align: center;
}
.editor-wrapper {
  padding: 10px;
}
</style>
<script>
import pic from './components/pic.vue';
import uploadButton from './components/upload-button.vue';
import myVideo from './components/my-video.vue';
import textEditor from '../my-components/text-editor';
import InputNumber2 from '@/components/input-number';

export default {
	components: {
		InputNumber2,
		pic,
		uploadButton,
		myVideo,
		textEditor
	},
	data () {
		return {
			submitLoading: false,
			showLoading: false,
			currentRoom: {
				min: 1,
				max: 1,
				earnest: 1,
				detail: '',
				purchaseNotes: '',
				pic: '',
				video: '',
				isRefundable: 0,
				priceValue: 0.01,
				priceHour: 1,
				refundTimeLimit: 0,
				renewTimeLimit: 1,
				renewPriceValue: 0.01,
				renewPriceHour: 1,
				serviceCharge: 0,
				reservationRetaindTime: 0
			},
			successTip: '新增包间成功',
			paramsError: ''
		};
	},
	computed: {
		ifShowRefundLimit () {
			return Number(this.currentRoom.isRefundable) === 2;
		}
	},
	created () {
		this.detectEnv();
	},
	methods: {
		// 取消 tap 按键的默认行为
		preventTapDefault (event) {
			if (event.keyCode === 9) {
				event.preventDefault();
			}
		},
		// 检测当前的编辑环境并且完成相应的适配工作
		detectEnv () {
			if (!this.$route.params.id) {
				this.$router.push('/settings/room');
			}
			if (this.$route.params.id !== -1) {
				this.currentRoom = Object.assign({ pic: '', video: '' }, this.$route.params);
			}
		},
		// 添加包间封面图
		addPic (url) {
			this.showLoading = false;
			this.currentRoom.pic = url;
		},
		// 删除包间封面图片
		deletePic () {
			this.currentRoom.pic = '';
		},
		// 添加视频
		addVideo (url) {
			this.showLoading = false;
			this.currentRoom.video = url;
		},
		// 删除视频
		deleteVideo () {
			this.currentRoom.video = '';
		},
		// 显示加载动画
		showAnimation () {
			this.showLoading = true;
		},
		// 格式化请求参数
		createParams () {
			const currentRoom = this.currentRoom;
			let params = {
				teaHouseId: this.$util.getTeaHouseId(),
				flag: currentRoom.flag,
				name: currentRoom.name,
				min: parseInt(currentRoom.min),
				max: parseInt(currentRoom.max),
				earnest: parseFloat(currentRoom.earnest),
				pic: currentRoom.pic,
				video: currentRoom.video,
				detail: currentRoom.detail,
				purchaseNotes: currentRoom.purchaseNotes,
				state: parseInt(currentRoom.state),
				priceValue: currentRoom.priceValue,
				priceHour: currentRoom.priceHour,
				isRefundable: parseInt(currentRoom.isRefundable),
				refundTimeLimit: currentRoom.refundTimeLimit,
				renewTimeLimit: currentRoom.renewTimeLimit,
				renewPriceValue: currentRoom.renewPriceValue,
				renewPriceHour: currentRoom.renewPriceHour,
				serviceCharge: currentRoom.serviceCharge
			};
			if (this.$route.params.id !== -1) {
				params.id = this.currentRoom.id;
			}

			return params;
		},
		// 请求参数校验
		checkParams (params) {
			if (params.name === undefined || this.$validator.isEmpty(params.name)) {
				this.paramsError = '包间名称不能为空';
				return false;
			}
			if (parseInt(params.state) === 0) {
				return true;
			}

			if (isNaN(params.min) || params.min < 0) {
				this.paramsError = '请正确填写包间的最小容量';
				return false;
			} else if (isNaN(params.max) || params.max < 0) {
				this.paramsError = '请正确填写包间的最大容量';
				return false;
			} else if (params.max < params.min) {
				this.paramsError = '包间最大容量不能小于最小容量';
				return false;
			} else if (isNaN(params.earnest) || params.earnest < 0) {
				this.paramsError = '请正确填写定金';
				return false;
			} else if (parseInt(params.isRefundable) === 2 && isNaN(this.currentRoom.refundTimeLimit)) {
				this.paramsError = '请填写超出包间时长多少分钟不可退费';
				return false;
			} else if (isNaN(parseInt(params.state))) {
				this.paramsError = '请选择包间状态是否可用';
				return false;
			} else if (params.pic == '') {
				this.paramsError = '请上传包间封面图片';
				return false;
			} else if (params.video == '') {
				this.paramsError = '请上传包间宣传视频';
				return false;
			} else if (this.$refs.detail.isContentEmpty()) {
				this.paramsError = '包间详情不能为空';
				return false;
			} else if (this.$refs.attentions.isContentEmpty()) {
				this.paramsError = '购买须知不能为空';
				return false;
			} else {
				this.paramsError = '';
				return true;
			}
		},
		// 新增包间
		addRoom () {
			let self = this;
			let params = this.createParams();
			if (!this.checkParams(params)) {
				this.$Message.error(this.paramsError);
				return;
			}
			this.submitLoading = true;
			this.$http
				.request(this, 'POST', '/settings/room/add', params)
				.then(function (response) {
					self.submitLoading = false;
					let res = response.data;
					if (res.errCode === '000000') {
						self.$Message.success('新增包间成功');
						self.$router.push('/settings/room');
					} else if (res.errCode === 'TEA00004406') {
						self.$Message.error({
							content: '已存在同名包间，不可重复创建'
						});
						// self.$router.push('/settings/room');
					} else {
						self.$Message.error({
							content: '[' + res.errCode + ']' + res.errMsg
						});
					}
				})
				.catch(function (error) {
					console.log(error);
					self.submitLoading = false;
				});
		},
		// 修改包间
		modifyRoom () {
			let self = this;
			let params = this.createParams();
			if (!this.checkParams(params)) {
				this.$Message.error(this.paramsError);
				return;
			}
			this.$http
				.request(this, 'POST', '/settings/room/modify', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode == '000000') {
						self.$Message.success('包间信息修改成功');
						self.$router.push('/settings/room');
					} else {
						self.$Message.error({
							content: '[' + res.errCode + ']' + res.errMsg
						});
					}
				})
				.catch(function (error) {});
		},
		// 提交表单，新增或修改包间
		submit () {
			if (this.$route.params.id == -1) {
				this.addRoom();
			} else {
				this.modifyRoom();
			}
		}
	}
};
</script>
