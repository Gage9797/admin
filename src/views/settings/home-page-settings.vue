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
  display: block;
  font-weight: bold;
  text-align: left;
  color: #7b7256;
  padding: 5px;
  margin-bottom: 20px;
  font-size: 20px;
}
.rectangle {
  display: inline-block;
  width: 130px;
  height: 130px;
  margin-right: 10px;
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
.editor-wrapper {
  padding: 10px;
}
.location-input {
  display: inline-block;
  height: 30px;
  outline: none;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-indent: 5px;
  width: 180px;
}

// 地址呈现修改相关
.map-container {
	height: 400px;
	margin-top: 10px;
}
</style>

<template>
  <div id="home-page-settings">
    <div class="top-bar">
		<div class="left">首页设置</div>
		<div class="right">
			<Button type="success" @click="submit">&emsp;提交&emsp; </Button>
		</div>
    </div>
    <Tabs type="card">
		<TabPane label="基础设置" class="ql-tab-pane">
			<Form :label-width="100">
			<FormItem label="茶馆名称">
				<Input v-model="homePageInfo.name" placeholder="茶馆名称" :maxlength="20" />
			</FormItem>
			<FormItem label="茶馆地址">
				<Row>
					<Col span="8">
						<Cascader :data="addressData" v-model="cascaderAddress" @on-change="cascaderAddressChange"></Cascader>
					</Col>
					<Col span="15" offset="1">
						<Input v-model="homePageInfo.address" placeholder="请输入详细地址后回车" @keypress.enter.native="setDetailAddress" />
					</Col>
				</Row>
				<div id="map-container" class="map-container"></div>
				<!-- <Input v-model="homePageInfo.address" placeholder="茶馆地址" />
				</FormItem>
				<FormItem label="茶馆坐标">
					<span>经度</span>
					<input
					type="number"
					class="location-input"
					placeholder="-180~180，正数代表东经度数"
					v-model="homePageInfo.longitude"
					/>
					&emsp;&emsp;&emsp;&emsp;
					<span>纬度</span>
					<input
					type="number"
					class="location-input"
					placeholder="-90~90，正数代表北纬"
					v-model="homePageInfo.latitude"
					/> -->
			</FormItem>
			<FormItem label="手机号码">
				<Input v-model="homePageInfo.phone" placeholder="茶馆电话" />
			</FormItem>
			<FormItem label="是否有wifi">
				<RadioGroup v-model="homePageInfo.hasWifiStr">
				<Radio label="1">有</Radio>
				<Radio label="0">没有</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="是否可以停车">
				<RadioGroup v-model="homePageInfo.parkableStr">
				<Radio label="1">是</Radio>
				<Radio label="0">否</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="营业时间">
				<TimePicker
					format="HH:mm"
					type="timerange"
					placement="top"
					placeholder="选择时间"
					style="width: 168px"
					:editable="false"
					:steps="[1, 30]"
					:confirm="true"
					v-model="businessTime"
					@keydown.native="preventTapDefault"
					@on-change="changeBusinessTime"
					@on-clear="clearBusinessTime"
				/>
			</FormItem>
			</Form>
		</TabPane>
		<TabPane label="图片管理" name="name2" class="ql-tab-pane" @keydown.native="preventTapDefault">
			<div class="swiper-pics">
			<div class="title">首页轮播图</div>
			<div
				class="rectangle"
				v-for="(item, index) in homePageInfo.imgArr"
				:key="index"
			>
				<pic :imgUrl="item" @delete="deleteHomePagePic(index)"></pic>
			</div>
			<div
				class="rectangle"
				v-if="homePageInfo.imgArr && homePageInfo.imgArr.length < 6"
			>
				<upload-button
					str="添加图片"
					accept=".jpg, .png, .jpeg"
					@startUpload="showAnimation"
					@success="addHomePagePic"
					@fail="hideAnimation"
				/>
			</div>
			</div>
		</TabPane>
		<TabPane label="茶馆介绍" class="ql-tab-pane" @keydown.native="preventTapDefault">
			<text-editor
				id="synopsis-editor"
				ref="editorDesc"
				:height="400"
				v-model="homePageInfo.abstractIntroduction"
			/>
		</TabPane>
		<TabPane label="茶馆故事" class="ql-tab-pane">
			<text-editor
				id="detail-editor"
				ref="editorStory"
				:height="400"
				v-model="homePageInfo.story"
			/>
		</TabPane>
    </Tabs>
    <!--加载遮罩层-->
    <Spin size="large" fix v-if="showLoading"></Spin>
  </div>
</template>

<script>
import AddressData from '@/assets/js/address.json';
import pic from './components/pic.vue';
import uploadButton from './components/upload-button.vue';
import textEditor from '../my-components/text-editor';

// 腾讯地图相关变量
let maps = null;
let geocoder = null;
let map = null;
let marker = null;

export default {
	components: {
		pic,
		uploadButton,
		textEditor
	},
	data () {
		return {
			showLoading: false,
			homePageInfo: {
				abstractIntroduction: '',
				story: '',
				imgArr: [],
				businessHoursStart: '',
				businessHoursEnd: '',
				address: '',
				latitude: '',
				longitude: ''
			},
			paramsError: '',
			state: 0,
			businessTime: [],

			// 修改地图呈现
			addressData: AddressData,
			cascaderAddress: [],
			mapFlag: ''
		};
	},
	created () {
		this.$nextTick(() => {
			this.initMap();
		});
		this.getHomePageInfo();
	},
	methods: {
		// 取消 tap 按键的默认行为
		preventTapDefault (event) {
			if (event.keyCode === 9) {
				event.preventDefault();
			}
		},
		changeBusinessTime () {
			const [s, e] = this.businessTime;
			if (this.businessTime.length === 2) {
				this.homePageInfo.businessHoursStart = s ? s.getTime() : '';
				this.homePageInfo.businessHoursEnd = e ? e.getTime() : '';
			}
		},
		clearBusinessTime () {
			this.businessTime = ['', ''];
			this.homePageInfo.businessHoursStart = '';
			this.homePageInfo.businessHoursEnd = '';
		},
		// 上传图片时显示加载动画
		showAnimation () {
			this.showLoading = true;
		},
		hideAnimation () {
			this.showLoading = false;
		},
		// 获取首页信息
		getHomePageInfo () {
			let self = this;
			let params = {
				teaHouseId: this.$util.getTeaHouseId()
			};
			this.$http
				.request(this, 'POST', '/settings/home/query', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						self.state = 1;
						try {
							self.homePageInfo = self.dealInfo(res.result);
						} catch (err) {
							console.log(err);
						}
					} else if (res.errCode === 'TEA00004302') {
						//
					} else {
						self.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (error) {});
		},
		// 对返回的首页设置信息进行处理，以方便在界面的显示
		dealInfo (info) {
			info.hasWifiStr = info.hasWifi !== null ? info.hasWifi.toString() : '';
			info.parkableStr = info.parkable !== null ? info.parkable.toString() : '';
			this.businessTime = [
				this.timeLongToStr(info.businessHoursStart),
				this.timeLongToStr(info.businessHoursEnd)
			];
			info.imgArr = info.carouselFigureUrls ? info.carouselFigureUrls.split(';') : [];

			if (info.latitude) {
				this.setMapByLatLng(info.latitude, info.longitude);
			} else {
				this.setMapByAddress(info.address);
			}

			return info;
		},
		// 删除首页轮播图
		deleteHomePagePic (index) {
			this.homePageInfo.imgArr.splice(index, 1);
		},
		// 新增首页轮播图
		addHomePagePic (url) {
			this.homePageInfo.imgArr.push(url);
			this.showLoading = false;
		},
		// long时间戳转字符串
		timeLongToStr (time) {
			if (!time) {
				return '';
			}
			let date = new Date(time);
			let hours = date.getHours();
			let minutes = date.getMinutes();
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			let str = hours + ':' + minutes;
			return str;
		},
		// 根据用户填写的表格构造向后端传输的参数
		createParams () {
			let carouselFigureUrls = '';
			this.homePageInfo.imgArr.map(ele => {
				carouselFigureUrls += ele + ';';
			});
			carouselFigureUrls = carouselFigureUrls.substring(
				0,
				carouselFigureUrls.length - 1
			);
			let params = {
				name: this.homePageInfo.name,
				carouselFigureUrls: carouselFigureUrls,
				hasWifi: parseInt(this.homePageInfo.hasWifiStr),
				parkable: parseInt(this.homePageInfo.parkableStr),
				businessHoursStart: this.homePageInfo.businessHoursStart,
				businessHoursEnd: this.homePageInfo.businessHoursEnd,
				address: this.homePageInfo.address,
				longitude: parseFloat(this.homePageInfo.longitude),
				latitude: parseFloat(this.homePageInfo.latitude),
				phone: this.homePageInfo.phone,
				abstractIntroduction: this.homePageInfo.abstractIntroduction || '',
				story: this.homePageInfo.story || ''
			};
			if (this.state == 1) {
				params.id = this.homePageInfo.id;
			}
			return params;
		},
		// 提交修改时校验参数
		checkParams (params) {
			if (params.name == undefined || this.$validator.isEmpty(params.name)) {
				this.paramsError = '茶馆名称不能为空';
				return false;
			} else if (
				params.address == undefined ||
        		this.$validator.isEmpty(params.address)
			) {
				this.paramsError = '茶馆地址不能为空';
				return false;
			} else if (isNaN(params.longitude)) {
				this.paramsError = '请填写茶馆位置的经度';
				return false;
			} else if (isNaN(params.latitude)) {
				this.paramsError = '请填写茶馆所在位置的纬度';
				return false;
			} else if (params.longitude > 180 || params.longitude < -180) {
				this.paramsError = '经度填写错误';
				return false;
			} else if (params.latitude > 90 || params.latitude < -90) {
				this.paramsError = '纬度填写错误';
				return false;
			} else if (params.phone === undefined || params.phone.trim() === '') {
				this.paramsError = '手机号码不可为空';
				return false;
			} else if (!(this.$validator.isPhone(params.phone))) {
				this.paramsError = '手机号码格式不正确';
				return false;
			} else if (isNaN(params.hasWifi)) {
				this.paramsError = '请选择是否有WiFi';
				return false;
			} else if (isNaN(params.parkable)) {
				this.paramsError = '请选择是否可停车的选项';
				return false;
			} else if (isNaN(parseInt(params.businessHoursStart))) {
				this.paramsError = '请选择开始营业的时间';
				return false;
			} else if (isNaN(parseInt(params.businessHoursEnd))) {
				this.paramsError = '请选择结束营业时间';
				return false;
			} else if (this.homePageInfo.imgArr === undefined || this.homePageInfo.imgArr.length < 1) {
				this.paramsError = '请至少上传一张首页轮播图';
				return false;
			} else if (this.$refs.editorDesc.isContentEmpty()) {
				this.paramsError = '茶馆介绍不能为空';
				return false;
			} else if (this.$refs.editorStory.isContentEmpty()) {
				this.paramsError = '茶馆故事不能为空';
				return false;
			} else {
				return true;
			}
		},
		// 首次设置首页信息
		setHomePageInfo () {
			let self = this;
			let params = this.createParams();
			if (!this.checkParams(params)) {
				this.$Message.error({
					content: this.paramsError
				});
				return;
			}
			this.$http
				.request(this, 'POST', '/settings/home/create', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						self.$Message.success('首页信息设置成功！');
					} else {
						self.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (error) {
					console.log(error);
					self.$Message.error('网络异常');
				});
		},
		// 更新首页信息
		updateHomePageInfo () {
			let self = this;
			let params = this.createParams();
			if (!this.checkParams(params)) {
				this.$Message.error({
					content: this.paramsError
				});
				return;
			}
			this.$http
				.request(this, 'POST', '/settings/home/modify', params)
				.then(function (response) {
					let res = response.data;
					if (res.errCode === '000000') {
						// 需要刷新一下茶馆信息，茶馆信息是随用户信息返回的。
						self.$store.dispatch('GetUserInfo');
						self.$Message.success('首页信息更新成功！');
					} else {
						self.$Message.error({
							content: res.errMsg
						});
					}
				})
				.catch(function (error) {
					console.log(error);
					self.$Message.error('网络异常');
				});
		},
		// 提交修改
		submit () {
			if (this.state === 0) {
				this.setHomePageInfo();
			} else {
				this.updateHomePageInfo();
			}
		},
		/**
		 * author：yoto
		 * 以下为新增的内容，比如地图、初始化经纬度等。
		 */
		initMap (lat = 23.047611, lng = 113.405535) {
			maps = window.qq.maps;
			map = new maps.Map(document.getElementById('map-container'), {
				center: new maps.LatLng(lat, lng),
				zoom: 13
			});

			geocoder = new maps.Geocoder();
			geocoder.setError(() => {
				this.$Message.error('地址格式出错，请输入详细地址。');
			});
			geocoder.setComplete((res) => {
				let { addressComponents, location, address } = res.detail;
				const { province, city, district } = addressComponents;

				switch (this.mapFlag) {
					case 'FROM_CACHE':
						// 利用保存的信息初始化
						this.cascaderAddress = [province, city, district];
						break;

					case 'MAP_CLICK':
						// 点击地图时
						this.cascaderAddress = [province, city, district];
						this.homePageInfo.address = address;
						break;

					case 'DETAIL_INPUT':
						// 详细地址输入框时
						break;

					case 'GET_MAP_RANGE':
						// 三级联动输入时

					default:
						break;
				}

				this.homePageInfo.latitude = location.lat;
				this.homePageInfo.longitude = location.lng;
				map.setCenter(location);
				marker.moveTo(new maps.LatLng(location.lat, location.lng), 100000000);
			});

			// 生成标记
			marker = new maps.Marker({
				map: map,
				position: new maps.LatLng(lat, lng)
			});

			// 绑定单击事件添加参数
			maps.event.addListener(map, 'click', (event) => {
				let lat = event.latLng.getLat();
				let lng = event.latLng.getLng();
				this.mapFlag = 'MAP_CLICK';
				this.setAddress(lat, lng);
			});
		},
		setMapByLatLng (lat, lng) {
			this.mapFlag = 'FROM_CACHE';
			this.setAddress(Number(lat), Number(lng));
		},
		setMapByAddress (addressStr) {
			// 这里的处理理论上只发生一次。
			this.mapFlag = 'FROM_CACHE';
			geocoder.getLocation(addressStr);
		},
		setAddress (lat, lng) {
			geocoder.getAddress(new maps.LatLng(Number(lat), Number(lng)));
		},
		cascaderAddressChange (value) {
			if (value.length > 0) {
				// 三级联动获取地图范围
				this.mapFlag = 'GET_MAP_RANGE';
				geocoder.getLocation(value.join(''));
			}
		},
		setDetailAddress () {
			// 详细地址输入框回车查询
			const address = this.homePageInfo.address;
			const cascaderAddress = this.cascaderAddress;
			if (cascaderAddress.length < 3) {
				this.$Message.error('请先选择茶馆所在的城市');
				return false;
			}
			if (!address) {
				this.$Message.error('请先输入详细地址');
				return false;
			}
			this.mapFlag = 'DETAIL_INPUT';
			geocoder.getLocation(cascaderAddress.join('') + address);
		}
	}
};
</script>


