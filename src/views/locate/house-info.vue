<style lang="less" scoped>
@import './common.less';

.map-container {
	margin-top: 10px;
	height: 400px;
}
</style>

<template>
	<div class="house-info">
		<Form ref="houseInfoForm" :model="houseInfoForm" :rules="houseInfoFormRules" :label-width="80">
			<Row>
				<Col span="11">
					<FormItem label="茶馆名称" prop="name">
						<Input v-model="houseInfoForm.name" placeholder="请输入茶馆名称"/>
					</FormItem>
				</Col>
				<Col span="11" offset="2">
					<FormItem label="茶馆电话" prop="phone">
						<Input v-model="houseInfoForm.phone" placeholder="请输入茶馆的联系电话"/>
					</FormItem>
				</Col>
			</Row>
			<FormItem label="茶馆地址" prop="address">
				<!-- <Input v-model="houseInfoForm.address" placeholder="在下边的地图中用鼠标点击获取地址" @keypress.enter.native="getAddressScope"/> -->
				<Row>
					<Col span="8">
						<Cascader :data="addressData" v-model="cascaderAddress" @on-change="cascaderAddressChange"></Cascader>
					</Col>
					<Col span="14" offset="2">
						<Input v-model="houseInfoForm.address" placeholder="请输入详细地址后回车" @keypress.enter.native="getAddressScope" />
					</Col>
				</Row>
				<div id="map-container" class="map-container"></div>
				<p class="supplement">小提示：在上方的地图中可以通过鼠标点击选取地址。</p>
			</FormItem>
			<FormItem label="茶馆照片" prop="photo">
				<upload :pic.sync="houseInfoForm.photo" :showPreview="true" :isPrivate="false" title=""/>
				<p class="supplement">请上传一张门店照片，需清晰展示完整的门店招牌。</p>
			</FormItem>

			<footer class="btn-wrapper">
				<Button type="primary" class="btn" @click="nextHandler" :loading="nextLoading">下一步</Button>
			</footer>
		</Form>
	</div>
</template>

<script>
import Upload from '@/components/upload/upload.vue';
import AddressData from '@/assets/js/address.json';

let maps = null;
let geocoder = null;
let map = null;
let marker = null;

export default {
	name: 'locateHouseInfo',
	components: {
		Upload
	},
	data () {
		return {
			addressData: AddressData,
			cascaderAddress: [],
			houseInfoForm: {
				name: '',
				phone: '',
				address: '',
				photo: ''
			},
			houseInfoFormRules: {
				name: [
					{ required: 'true', trigger: 'blur', message: '茶馆名称不可为空' }
				],
				phone: [
					{ required: 'true', trigger: 'blur', message: '联系方式不可为空' }
				],
				address: [
					{
						validator: (rule, value, callback) => {
							if (this.cascaderAddress.length < 3) {
								callback(new Error('请先选择茶馆所在的城市'));
							} else if (!value) {
								callback(new Error('请填写详细地址'));
							} else {
								callback();
							}
						},
						required: 'true',
						trigger: 'input'
					}
					// { required: 'true', message: '请先在地图上选择地址' }
				],
				photo: [
					{ required: 'true', trigger: 'blur', message: '请上传您的茶馆照片' }
				]
			},
			lat: '',
			lng: '',
			nextLoading: false,
			inputFlag: false,
			mapFlag: ''
		};
	},
	created () {
		// 获取缓存内容;
		this.$Spin.show();
		this.$request.get('/join/auditCache1')
			.then(res => {
				this.$Spin.hide();
				if (res.errCode === '000000') {
					if (!(typeof res.result.name === 'undefined' || res.result.name === '')) {
						const result = res.result;
						this.houseInfoForm = {
							name: result.name,
							phone: result.phone,
							address: result.address,
							photo: result.carousel_figure_urls || ''
						};
						this.lat = result.latitude;
						this.lng = result.longitude;
						this.mapFlag = 'FROM_CACHE';
						if (this.lat) {
							this.initMap(result.latitude, result.longitude);
							this.setAddress(result.latitude, result.longitude);
						} else {
							this.initMap();
							geocoder.getLocation(result.address);
						}
					} else {
						this.initMap();
					}
				}
			})
			.catch(err => {
				this.$Spin.hide();
				console.log(err);
			});
	},
	methods: {
		cascaderAddressChange (value, selecedData) {
			if (value.length > 0) {
				this.getMapRange(value.join(''));
			}
		},
		initMap (lat, lng) {
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
				const { province, city, district, street, streetNumber } = addressComponents;

				switch (this.mapFlag) {
					case 'FROM_CACHE':
						// 利用保存的信息初始化
						this.cascaderAddress = [province, city, district];
						break;

					case 'MAP_CLICK':
						// 点击地图时
						const town = addressComponents.town || '';
						this.cascaderAddress = [province, city, district];
						// this.houseInfoForm.address = town + street + streetNumber;
						this.houseInfoForm.address = address;
						break;

					case 'DETAIL_INPUT':
						// 详细地址输入框时
						break;

					case 'GET_MAP_RANGE':
						// 三级联动输入时

					default:
						break;
				}

				this.lat = location.lat;
				this.lng = location.lng;
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
		setAddress (lat, lng) {
			geocoder.getAddress(new maps.LatLng(lat, lng));
		},
		getAddressScope (e) {
			// 详细地址输入框回车查询
			const address = this.houseInfoForm.address;
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
		},
		getMapRange (address) {
			// 三级联动获取地图范围
			this.mapFlag = 'GET_MAP_RANGE';
			geocoder.getLocation(address);
		},
		nextHandler () {
			this.$refs.houseInfoForm.validate(valid => {
				if (!valid) {
					return false;
				}
				// 如果是读取缓存的内容，图片后缀会有 token e 两个参数。在上传到服务器上前需要截取掉。
				let photoUrl = this.houseInfoForm.photo;
				if (photoUrl.indexOf('?') !== -1) {
					photoUrl = photoUrl.split('?')[0];
				}

				const params = {
					name: this.houseInfoForm.name,
					phone: this.houseInfoForm.phone,
					address: this.houseInfoForm.address,
					longitude: this.lng,
					latitude: this.lat,
					carousel_figure_urls: photoUrl
				};
				this.nextLoading = true;
				this.$request.post('/join/info', params)
					.then(res => {
						this.nextLoading = false;
						if (res.errCode === '000000') {
							this.$router.push({
								name: 'locateQualification'
							});
						} else {
							this.$Message.error(res.errMsg);
						}
					})
					.catch(err => {
						this.nextLoading = false;
						console.log(err);
					});
			});
		}
	}
};
</script>
