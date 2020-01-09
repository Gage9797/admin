<style lang="less" scoped>
@import './common.less';
.qualification {
	padding: 0 20px;
	h1 {
		margin: 0 0 10px 0;
	}
	.first-level {
		padding: 0 20px;
	}
	.second-level {
		padding-left: 10px;
	}
}

</style>

<template>
	<div class="qualification">
		<Form ref="qualificationForm" :model="qualificationForm" :rules="qualificationFormRules" label-position="left"  :label-width="120">
			<h1><Icon type="information-circled"></Icon> 经营信息</h1>
			<section class="first-level">
				<FormItem label="经营类目" prop="businessScope">
					<Cascader :data="businessData" v-model="qualificationForm.businessScope"></Cascader>
				</FormItem>
				<FormItem label="营业执照类型" prop="licenseType">
					<RadioGroup v-model="qualificationForm.licenseType">
						<Radio :label="0">
							<span>企业法人</span>
						</Radio>
						<Radio :label="1">
							<span>个体工商户</span>
						</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="营业执照注册号" prop="registrationNumber">
					<Input v-model="qualificationForm.registrationNumber" placeholder=""/>
					<div id="map-container" class="map-container"></div>
				</FormItem>
				<FormItem label="营业执照名称" prop="licenseName">
					<Input v-model="qualificationForm.licenseName" placeholder=""/>
				</FormItem>
				<FormItem label="营业执照期限" prop="licenseExpires">
					<DatePicker v-model="qualificationForm.licenseExpires[0]" type="date" placeholder=""></DatePicker>
					<span> -- </span>
					<DatePicker v-model="qualificationForm.licenseExpires[1]" type="date" :options="licenseExpsDatePickerOptions" placeholder=""></DatePicker>
					<!-- <DatePicker v-model="qualificationForm.licenseExpires" type="daterange" split-panels placeholder=""></DatePicker> -->
					<Checkbox v-model="isLicenseLongtermEffective">长期有效</Checkbox>
				</FormItem>
				<FormItem label="注册地址" prop="registeredAddress">
					<Input v-model="qualificationForm.registeredAddress" placeholder=""/>
				</FormItem>
				<FormItem label="营业执照扫描件" prop="licenseScannedPhoto">
					<upload :isPrivate="true" :pic.sync="qualificationForm.licenseScannedPhoto" :showPreview="true" title=""/>
					<p class="supplement">请上传一张营业执照照片，需要在有效期内。</p>
				</FormItem>
				<FormItem label="是否三证合一" prop="isTwoInOne">
					<RadioGroup v-model="qualificationForm.isTwoInOne">
						<Radio :label="1">
							<span>是</span>
						</Radio>
						<Radio :label="0">
							<span>否</span>
						</Radio>
					</RadioGroup>
				</FormItem>
				<!-- 显示与否取决于是否三证合一。 -->
				<section class="second-level" v-if="parseInt(qualificationForm.isTwoInOne) === 0">
					<FormItem label="组织机构代码" prop="organizationCode">
						<Input v-model="qualificationForm.organizationCode" placeholder=""/>
					</FormItem>
					<FormItem label="营业期限" prop="organizationBusinessTerm">
						<Input v-model="qualificationForm.organizationBusinessTerm" placeholder=""/>
					</FormItem>
					<FormItem label="组织机构证件照" prop="organizationScanedPhoto">
						<upload :isPrivate="true" :pic.sync="qualificationForm.organizationScanedPhoto" :showPreview="true" title=""/>
					</FormItem>

				</section>
			</section>

			<!-- 商户信息 -->
			<h1><Icon type="person"></Icon> 商户信息</h1>
			<section class="first-level">
				<FormItem label="是否开通微信支付" prop="useWxPay">
					<RadioGroup v-model="qualificationForm.useWxPay">
						<Radio :label="1">
							<span>开通</span>
						</Radio>
						<Radio :label="0">
							<span>暂不开通</span>
						</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="是否开通支付宝支付" prop="useAliPay">
					<RadioGroup v-model="qualificationForm.useAliPay">
						<Radio :label="1">
							<span>开通</span>
						</Radio>
						<Radio :label="0">
							<span>暂不开通</span>
						</Radio>
					</RadioGroup>
				</FormItem>
				<!-- 下边的表单取决于支付的开通情况 -->
				<section class="second-level" v-if="needConcatInfo">
					<!-- 联系人信息 -->
					<h2>联系人信息</h2>
					<p class="supplement">联系人信息将用于接收签约后的重要通知，如确认协议、到期提醒等。</p>

					<FormItem label="联系人姓名" prop="contactName">
						<Input v-model="qualificationForm.contactName" placeholder=""/>
						<div id="map-container" class="map-container"></div>
					</FormItem>
					<FormItem label="手机号码" prop="contactTel">
						<Input v-model="qualificationForm.contactTel" placeholder=""/>
						<div id="map-container" class="map-container"></div>
					</FormItem>
					<FormItem label="常用邮箱" prop="contactEmail">
						<Input v-model="qualificationForm.contactEmail" placeholder=""/>
						<div id="map-container" class="map-container"></div>
					</FormItem>
				</section>

				<section class="second-level" v-if="parseInt(qualificationForm.useWxPay) === 1">
					<!-- 企业法人 -->
					<h2>企业法人</h2>
					<FormItem label="证件持有人类型" prop="certificateHolderType">
						<RadioGroup v-model="qualificationForm.certificateHolderType">
							<Radio :label="1">
								<span>法人</span>
							</Radio>
							<Radio :label="2">
								<span>经办人</span>
							</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="证件类型" prop="identificationType">
						<RadioGroup v-model="qualificationForm.identificationType">
							<Radio :label="1">
								<span>身份证（限中国大陆居民）</span>
							</Radio>
							<Radio :label="2">
								<span>护照（限境外人士）</span>
							</Radio>
						</RadioGroup>
					</FormItem>
					<FormItem label="身份证正面照" prop="idCardFrontImage">
						<upload :isPrivate="true" :pic.sync="qualificationForm.idCardFrontImage" :showPreview="true" title=""/>
					</FormItem>
					<FormItem label="身份证反面照" prop="idCardBackImage">
						<upload :isPrivate="true" :pic.sync="qualificationForm.idCardBackImage" :showPreview="true" title=""/>
					</FormItem>
					<FormItem label="证件号码" prop="identificationNumber">
						<Input v-model="qualificationForm.identificationNumber" placeholder=""/>
					</FormItem>
					<FormItem label="证件持有人姓名" prop="identificationHolderName">
						<Input v-model="qualificationForm.identificationHolderName" placeholder=""/>
					</FormItem>
					<FormItem label="证件有效期" prop="identificationExpires">
						<DatePicker v-model="qualificationForm.identificationExpires[0]" type="date" placeholder=""></DatePicker>
						<span> -- </span>
						<DatePicker v-model="qualificationForm.identificationExpires[1]" :options="idExpsDatePickerOptions" type="date" placeholder=""></DatePicker>
						<!-- <DatePicker v-model="qualificationForm.identificationExpires" type="daterange" split-panels placeholder=""></DatePicker> -->
						<Checkbox v-model="isIdentificationLongtermEffective">长期有效</Checkbox>
						<p class="supplement">证件有效期限需于上传文件上所示期限一致，若有效期限超过2100年，请选择“长期”。</p>
					</FormItem>

					<!--  结算账户-->
					<h2>结算账户</h2>

					<FormItem label="基本户开户行" prop="bankName">
						<Input v-model="qualificationForm.bankName" placeholder=""/>
						<div id="map-container" class="map-container"></div>
					</FormItem>
					<FormItem label="基本户开户支行" prop="bankBranchName">
						<Input v-model="qualificationForm.bankBranchName" placeholder=""/>
						<div id="map-container" class="map-container"></div>
					</FormItem>
					<FormItem label="基本户银行账号" prop="bankAccountNumber">
						<Input v-model="qualificationForm.bankAccountNumber" placeholder=""/>
						<div id="map-container" class="map-container"></div>
					</FormItem>
				</section>
			</section>
		</Form>

		<footer class="btn-wrapper">
			<Button type="primary" class="btn" :loading="previewLoading" @click="preHandler">上一步</Button>
			<Button type="primary" class="btn" :loading="nextLoading" @click="nextHandler">下一步</Button>
		</footer>
	</div>
</template>

<script>
import Upload from '@/components/upload/upload.vue';
import { phoneReg, idCardReg, passportReg } from '@/tools';

export default {
	name: 'locateQualification',
	components: {
		Upload
	},
	data () {
		const emptyValidatorGen = (msg) => (rule, value, callback) => {
			if (value.trim() !== '') {
				callback();
			} else {
				callback(new Error(msg));
			}
		};

		return {
			// checkout组件没法解析复杂的属性，单独抽出啦。都是 ‘是否长期有效’ checkbox。
			isLicenseLongtermEffective: false,
			isIdentificationLongtermEffective: false,

			// 资质评审中必填的信息，会将其中因某些选项而非必填的单独抽出来。
			qualificationForm: {
				businessScope: [],
				licenseType: 0,
				registrationNumber: '',
				licenseName: '',
				licenseExpires: ['', ''],
				registeredAddress: '',
				licenseScannedPhoto: '',
				isTwoInOne: 1,
				useWxPay: 1,
				useAliPay: 1,

				// 非二合一时的表单
				organizationCode: '',
				organizationBusinessTerm: '',
				organizationScanedPhoto: '',

				// 联系人信息
				contactName: '',
				contactTel: '',
				contactEmail: '',

				// 企业法人 和 结算账户（因为是跟微信支付绑定在一起的）
				certificateHolderType: 1,
				identificationType: 1,
				idCardFrontImage: '',
				idCardBackImage: '',
				identificationNumber: '',
				identificationHolderName: '',
				identificationExpires: ['', ''],
				bankName: '',
				bankBranchName: '',
				bankAccountNumber: ''
			},

			// 表单验证内容
			qualificationFormRules: {
				businessScope: [
					{ type: 'array', required: true, trigger: 'change', message: '请选择经营类目' }
				],
				licenseType: [
					{ required: true }
				],
				registrationNumber: [
					{ required: true, trigger: 'blur', validator: emptyValidatorGen('请填写营业执照注册号') }
				],
				licenseName: [
					{ required: true, trigger: 'blur', validator: emptyValidatorGen('请填写营业执照名称') }
				],
				licenseExpires: [
					{ type: 'array', required: true, trigger: 'blur', message: '请选择营业执照期限' },
					{
						validator: (rule, value, callback) => {
							if (!this.isLicenseLongtermEffective && (value[0] === '' || value[1] === '')) {
								// 不是长期有效，则前后时间点都要选择
								callback(new Error('请选择营业执照期限'));
							} else if (this.isLicenseLongtermEffective && value[0] === '') {
								// 选择了长期有效， 只需要有前边的时间点
								callback(new Error('请选择营业执照起始时间'));
							} else {
								callback();
							}
						}
					}
				],
				registeredAddress: { required: true, trigger: 'blur', validator: emptyValidatorGen('请填写注册地址') },
				licenseScannedPhoto: { required: true, trigger: 'blur', message: '请上传营业执照扫描件' },
				isTwoInOne: [
					{ required: true }
				],

				// 非二合一时的表单
				organizationCode: { required: true, trigger: 'blur', validator: emptyValidatorGen('请填写组织机构代码') },
				organizationBusinessTerm: { required: true, trigger: 'blur', validator: emptyValidatorGen('请填写营业期限') },
				organizationScanedPhoto: { required: true, trigger: 'blur', validator: emptyValidatorGen('请上传组织机构证件照') },

				// 联系人信息
				contactName: { required: true, trigger: 'blur', validator: emptyValidatorGen('请填写联系人姓名') },
				contactTel: [
					{ required: true, trigger: 'blur', message: '请填写手机号码' },
					// { pattern: phoneReg, trigger: 'blur', message:  },
					{
						validator: (rule, value, callback) => {
							if (phoneReg.test(value)) {
								callback();
							} else {
								callback(new Error('手机格式不正确'));
							}
						}
					}
				],
				contactEmail: [
					{ required: true, trigger: 'blur', message: '请填写常用邮箱' },
					{ type: 'email', trigger: 'blur', message: '邮件格式不正确' }
				],

				// 企业法人 和 结算账户（因为是跟微信支付绑定在一起的）
				certificateHolderType: [
					{ required: true, message: '证件持有人类型不可为空' }
				],
				identificationType: [
					{ required: true, message: '证件类型不可为空' }
				],
				idCardFrontImage: [
					{ required: true, trigger: 'blur', message: '请上传身份证正面照' }
				],
				idCardBackImage: [
					{ required: true, trigger: 'blur', message: '请上传身份证反面照' }
				],
				identificationNumber: [
					{ required: true, trigger: 'blur', message: '请填写证件号码' },
					{
						validator: (rule, value, callback) => {
							if (idCardReg.test(value) || passportReg.test(value)) {
								callback();
							} else {
								callback(new Error('格式不正确'));
							}
						}
					}
				],
				identificationHolderName: [
					{ required: true, trigger: 'blur', message: '请填写联系人姓名' }
				],
				identificationExpires: [
					{ type: 'array', required: true, trigger: 'blur', message: '请选择证件有效期' },
					{
						validator: (rule, value, callback) => {
							if (!this.isIdentificationLongtermEffective && (value[0] === '' || value[1] === '')) {
								// 不是长期有效，则前后时间点都要选择
								callback(new Error('请选择证件有效期'));
							} else if (this.isIdentificationLongtermEffective && value[0] === '') {
								// 选择了长期有效， 只需要有前边的时间点
								callback(new Error('请选择证件起始时间'));
							} else {
								callback();
							}
						}
					}
				],
				bankName: [
					{ required: true, trigger: 'blur', validator: emptyValidatorGen('请填写银行名称') }
				],
				bankBranchName: [
					{ required: true, trigger: 'blur', validator: emptyValidatorGen('请填写支行名称') }
				],
				bankAccountNumber: [
					{ required: true, trigger: 'blur', message: '请填写银行账号' },
					{ pattern: /^[1-9]\d{5,29}$/, trigger: 'change', message: '格式错误' }
				]
			},

			businessData: [],

			previewLoading: false,
			nextLoading: false
		};
	},
	computed: {
		needConcatInfo () {
			// 只要开通一项支付就需要
			let { useWxPay, useAliPay } = this.qualificationForm;
			return parseInt(useWxPay) + parseInt(useAliPay);
		},
		idExpsDatePickerOptions () {
			// 根据第一个日期选择框禁用掉第二个框的某些时间
			const self = this;
			return {
				disabledDate (date) {
					if (self.qualificationForm.identificationExpires[0] === '') {
						return false;
					}
					return date < self.qualificationForm.identificationExpires[0];
				}
			};
		},
		licenseExpsDatePickerOptions () {
			const self = this;
			return {
				disabledDate (date) {
					if (self.qualificationForm.licenseExpires[0] === '') {
						return false;
					}
					return date < self.qualificationForm.licenseExpires[0];
				}
			};
		}
	},
	created () {
		this.$request.get('/join/businessCategory')
			.then(res => {
				if (res.errCode === '000000') {
					res.result.forEach(item => {
						let t = {};
						t.label = item.primaryCategory;
						t.value = item.primaryId;
						t.children = item.second.map(child => {
							return {
								label: child.secondaryCategory,
								value: child.secondaryId
							};
						});
						this.businessData.push(t);
					});
				} else {
					throw new Error(res.errMsg);
				}
			})
			.catch(err => {
				console.log(err);
			});

		/**
		 * 获取缓存内容
		 * 这里的应用场景是填写完这份表单进入下一步，而后断开，再次进入本页面。因而这些数据是经过校验的了。
		 */
		this.$Spin.show();
		this.$request.get('/join/auditCache2')
			.then(res => {
				this.$Spin.hide();
				if (res.errCode === '000000') {
					// 如果为第一次填写返回 "result": { }
					if (typeof res.result.licenseType !== 'undefined') {
						const result = res.result;

						// 时间期限的特殊处理
						let licenseExpires = [new Date(result.licenseIssueDate || 0), ''];
						let identificationExpires = [new Date(result.identificationIssueDate || 0), ''];
						if (!result.isLicenseLongtermEffective) {
							licenseExpires[1] = new Date(result.licenseExpiryDate);
						}
						if (!result.isIdentificationLongtermEffective) {
							identificationExpires[1] = new Date(result.identificationExpiryDate);
						}

						this.isLicenseLongtermEffective = result.isLicenseLongtermEffective;
						this.isIdentificationLongtermEffective = result.isIdentificationLongtermEffective;
						this.qualificationForm = {
							businessScope: [result.primaryId, result.secondaryId],
							licenseType: Number(result.licenseType),
							registrationNumber: result.registrationNumber,
							licenseName: result.licenseName,
							licenseExpires: licenseExpires,
							registeredAddress: result.registeredAddress,
							licenseScannedPhoto: result.licenseScannedPhoto || '',
							isTwoInOne: Number(result.isTwoInOne),
							useWxPay: Number(result.useWxPay),
							useAliPay: Number(result.useAliPay),

							// 非二合一时的表单
							organizationCode: result.organizationCode || '',
							organizationBusinessTerm: result.businessTerm || '',
							organizationScanedPhoto: result.organizationScannedPhoto || '',

							// 联系人信息
							contactName: result.contactName || '',
							contactTel: result.contactTel || '',
							contactEmail: result.contactEmail || '',

							// 企业法人 和 结算账户（因为是跟微信支付绑定在一起的）
							certificateHolderType: result.certificateHolderType || 1,
							identificationType: result.identificationType || 1,
							idCardFrontImage: result.idCardFrontImage || '',
							idCardBackImage: result.idCardBackImage || '',
							identificationNumber: result.identificationNumber || '',
							identificationHolderName: result.identificationHolderName || '',
							identificationExpires: identificationExpires,
							bankName: result.bankName || '',
							bankBranchName: result.bankBranchName || '',
							bankAccountNumber: result.bankAccountNumber || ''
						};
					}
				}
			})
			.catch(err => {
				this.$Spin.hide();
				console.log(err);
			});
	},
	methods: {
		preHandler () {
			this.$router.push({
				name: 'locateHouseInfo'
			});
		},
		nextHandler () {
			this.$refs.qualificationForm.validate(valid => {
				if (!valid) {
					return false;
				}

				const qualificationForm = this.qualificationForm;
				let params = {};

				try {
					// 如果是读取缓存的内容，图片后缀会有 token e 两个参数。在上传到服务器上前需要截取掉。
					let licenseScannedPhoto = qualificationForm.licenseScannedPhoto;
					let organizationScanedPhoto = qualificationForm.organizationScanedPhoto;
					let idCardFrontImage = qualificationForm.idCardFrontImage;
					let idCardBackImage = qualificationForm.idCardBackImage;

					if (licenseScannedPhoto.indexOf('?') !== -1) {
						licenseScannedPhoto = licenseScannedPhoto.split('?')[0];
					}
					if (organizationScanedPhoto.indexOf('?') !== -1) {
						organizationScanedPhoto = organizationScanedPhoto.split('?')[0];
					}
					if (idCardFrontImage.indexOf('?') !== -1) {
						idCardFrontImage = idCardFrontImage.split('?')[0];
					}
					if (idCardBackImage.indexOf('?') !== -1) {
						idCardBackImage = idCardBackImage.split('?')[0];
					}

					params = {
						license_type: qualificationForm.licenseType,
						registration_number: qualificationForm.registrationNumber,
						license_name: qualificationForm.licenseName,
						license_issue_date: qualificationForm.licenseExpires[0].getTime(),
						license_expiry_date: this.isLicenseLongtermEffective ? '' : qualificationForm.licenseExpires[1].getTime(),
						is_license_longterm_effective: this.isLicenseLongtermEffective,
						// business_scope: qualificationForm.businessScope.join('/'),
						primary_id: qualificationForm.businessScope[0],
						secondary_id: qualificationForm.businessScope[1],
						registered_address: qualificationForm.registeredAddress,
						license_scanned_photo: licenseScannedPhoto,
						is_two_in_one: qualificationForm.isTwoInOne === 1,

						organization_code: qualificationForm.organizationCode,
						business_term: qualificationForm.organizationBusinessTerm,
						organization_scanned_photo: organizationScanedPhoto,

						use_wx_pay: qualificationForm.useWxPay === 1,
						use_ali_pay: qualificationForm.useAliPay === 1,
						contact_name: qualificationForm.contactName,
						contact_tel: qualificationForm.contactTel,
						contact_email: qualificationForm.contactEmail,

						certificate_holder_type: qualificationForm.certificateHolderType,
						identification_type: qualificationForm.identificationType,
						id_card_front_image: idCardFrontImage,
						id_card_back_image: idCardBackImage,
						identification_number: qualificationForm.identificationNumber,
						identification_holder_name: qualificationForm.identificationHolderName,
						identification_issue_date: qualificationForm.useWxPay ? qualificationForm.identificationExpires[0].getTime() : '',
						identification_expiry_date: qualificationForm.useWxPay ? (this.isIdentificationLongtermEffective ? '' : qualificationForm.identificationExpires[1].getTime()) : '',

						bank_name: qualificationForm.bankName,
						bank_branch_name: qualificationForm.bankBranchName,
						bank_account_number: qualificationForm.bankAccountNumber,
						is_identification_longterm_effective: this.isIdentificationLongtermEffective
					};
				} catch (e) {
					console.log(e);
				}
				console.log(params);
				this.nextLoading = true;
				this.$request.post('/join/detail', params)
					.then(res => {
						this.nextLoading = false;
						if (res.errCode === '000000') {
							this.$router.push({
								name: 'locatePayment'
							});
						} else {
							this.$Message.error(res.errMsg);
						}
					})
					.catch(err => {
						this.nextLoading = false;
						console.log(err);
						this.$Message.error(err.message);
					});
			});
		}
	}
};
</script>
