<template>
    <div class="self-modal">
        <div class="header-wrapper">
            <div class="info-item">
                <span class="title">商品名称</span>
                <Input  class="input" v-model="addGoodName" placeholder="商品名称"/>
                <span class="title">商品类别</span>
                <Select class="good-query" v-model="addGoodType" style="width:200px">
                    <Option v-for="item in classifyName" :value="item.value" :key="item.index">{{item.value}}</Option>
                </Select>
            </div>
            <Button type="primary"  @click="setCategoryId(queryGood)">查询</Button>
        </div>
        <div class="table-container">
        <table>
            <tr>
                <td valign="top">
                    <div class="table-wrapper left">
                    <span class="title">所有商品</span>
                    <Table size="small"  border :columns="columns5" :data="data5" no-data-text="无"></Table>
                    <Page style="margin-top:10px;text-align: center;" :total="leftPageTotal" show-elevator @on-change="leftChangePage"></Page>
                    </div>
                </td>
                <td valign="top">
                    <div class="table-wrapper right">
                    <span class="title">{{rightTableTitle}}</span>
                    <Table size="small" border :columns="columns6" :data="data6" ></Table>
                    <Page style="margin-top:10px;text-align: center;"></Page>
                    </div>
                </td>
            </tr>
        </table>
        </div>
    </div>
</template>
<script>
// import AddDecrease from './components/add-decrease.vue'
export default {
	beforeCreate () {
		// this.$options.components.AddDecrease = () => import('./add-decrease.vue');
	},
	created () {
		this.getModalGoodList();
		this.getCategories();
	},
	props: {
		rightTableTitle: {
			type: String,
			default: ''
		},
		operateType: {
			type: Number // 0表示入库，1表示出库
		}
	},
	component: {
		// AddDecrease: AddDecrease
	},
	data () {
		return {
			addGoodName: '',
			addGoodType: '',
			addGoodTypeId: 0,
			classifyName: [],
			columns5: [{title: '分类', key: 'goodCategory'},
				{title: '名称', key: 'goodName'},
				{title: '单价', key: 'unitPrice'},
				{title: '库存', key: 'stock'},
				{
					title: '操作',
					key: 'operation',
					width: 80,
					align: 'center',
					render: (h, params) => {
						let that = this;
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										for (let i = 0; i < that.data6.length; i++) {
											if (that.data6[i].goodName === params.row.goodName) { return; }
										}
										if (that.operateType === 1 && params.row.stock === 0) {
											confirm('商品数量为0，不可再进行出库了');
											return;
										}
										if (that.data6.length < 10) {
											let temp = {};
											temp.goodName = params.row.goodName;
											temp.unitPrice = params.row.unitPrice;
											temp.tempNumber = 1;
											temp.totalPrice = temp.unitPrice;
											temp.id = params.row.id;
											temp.stock = params.row.stock;
											that.data6.push(temp);
											that.$emit('changeModalList', that.data6);
										}
									}
								}
							}, '添加')
						]);
					}
				}],
			data5: [],
			columns6: [
				{title: '名称', key: 'goodName'},
				{title: '单价', key: 'unitPrice'},
				{
					title: '数量',
					key: 'number',
					width: 100
					// render: (h,params) => {
					//     let that = this;
					//     return h(AddDecrease,{
					//         props: {
					//             operateNumber: that.data6[params.index].tempNumber
					//         },
					//         on:{
					//             addNumber: () => {
					//                 if (that.operateType === 1 && that.data6[params.index].tempNumber === that.data6[params.index].stock){
					//                     confirm('商品出库数量不可多于库存');
					//                     return;
					//                 }
					//                 that.data6[params.index].tempNumber+=1;
					//                 that.data6[params.index].totalPrice = (that.data6[params.index].totalPrice*1000 + that.data6[params.index].unitPrice*1000)/1000;
					//                 that.$emit('changeModalList',that.data6);
					//             },
					//             removeNumber: () =>{
					//                 that.data6[params.index].tempNumber-=1;
					//                 that.data6[params.index].totalPrice = (that.data6[params.index].totalPrice*1000 - that.data6[params.index].unitPrice*1000)/1000;
					//                 that.$emit('changeModalList',that.data6);
					//             }
					//         }
					//     });
					// }
				},
				{title: '总价', key: 'totalPrice'},
				{
					title: '操作',
					key: 'operation',
					width: 80,
					align: 'center',
					render: (h, params) => {
						let that = this;
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										that.data6.splice(params.index, 1);
									}
								}
							}, '删除')
						]);
					}
				},
				{
					title: '备注',
					key: 'comment',
					align: 'center',
					width: 150,
					render: (h, params) => {
						let vm = this;
						return h('i-input', {
							style: {
								width: '120px'
							},
							on: {
								'on-blur': () => {
									vm.data6[params.index].comment = event.target.value;
									vm.$emit('changeModalList', vm.data6);
								}
							}
						});
					}
				}],
			data6: [],
			leftPageTotal: 0,
			classifyName: [],
			teaHouseId: this.$util.getTeaHouseId()
		};
	},
	methods: {
		getModalGoodList (page = 1) {
			let postBody = {
				'teaHouseId': this.teaHouseId, // 茶馆id
				'currentPage': page, // 可选参数，默认值为1
				'pageSize': '10'// 可选参数，默认值为10
			};
			if (this.addGoodTypeId !== 0) {
				postBody = {
					'teaHouseId': this.teaHouseId, // 茶馆id
					'currentPage': page, // 可选参数，默认值为1
					'pageSize': '10', // 可选参数，默认值为10,
					'goodsClassifyId': this.addGoodTypeId
				};
				if (this.addGoodName !== '') {
					postBody = {
						'teaHouseId': this.teaHouseId,
						'currentPage': 1,
						'goodsClassifyId': this.addGoodTypeId,
						'name': this.addGoodName,
						'pageSize': '10'
					};
				}
			}
			let that = this;
			this.$http.request(this, 'POST', '/goods/goodsList', postBody).then((res) => {
				if (res.data.errCode === '000000') {
					let resGoods = res.data.result.list;
					that.data5 = new Array(resGoods.length);
					for (let i = 0; i < resGoods.length; i++) {
						let item = new Object();
						item.goodName = resGoods[i].name;
						item.goodCategory = resGoods[i].goodsClassifyName;
						item.stock = resGoods[i].inventory;
						item.unitPrice = resGoods[i].price;
						item.id = resGoods[i].id;
						that.data5[i] = item;
					}
				}
				that.leftPageTotal = res.data.result.total;
			}).catch((error) => {
				console.log(error);
			});
		},
		leftChangePage (page) {
			this.getModalGoodList(page);
		},
		getCategories () {
			let that = this;
			this.$http.request(this, 'GET', '/goods/goodsClassifyList', {}).then((res) => {
				let list = res.data.result;
				for (let i = 0; i < list.length; i++) {
					if (list[i].name === null) {
						list.splice(i, 1);// i=8,length=9
						i = i - 1;
					}
				}
				that.classifyName = new Array(list.length);
				that.classifyName[0] = {value: '全部', label: 0};
				for (let i = 0; i < list.length; i++) {
					let item = new Object();
					item.value = list[i].name;
					item.label = list[i].id;
					that.classifyName[i + 1] = item;
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		setCategoryId (callback) {
			for (let i = 0; i < this.classifyName.length; i++) {
				if (this.addGoodType === this.classifyName[i].value) {
					this.addGoodTypeId = this.classifyName[i].label;
					callback(this.addGoodTypeId);
					break;
				}
			}
			callback(this.addGoodTypeId);
		},
		queryGood (id) {
			let postBody;
			if (id === 0) {
				postBody = {
					'teaHouseId': this.teaHouseId,
					'currentPage': 1,
					'pageSize': '10'
				};
				if (this.addGoodName !== '') {
					postBody = {
						'teaHouseId': this.teaHouseId,
						'currentPage': 1,
						'name': this.addGoodName,
						'pageSize': '10'
					};
				}
			} else {
				postBody = {
					'teaHouseId': this.teaHouseId,
					'goodsClassifyId': this.addGoodTypeId,
					'currentPage': 1,
					'pageSize': '10'
				};
				if (this.addGoodName !== '') {
					postBody = {
						'teaHouseId': this.teaHouseId,
						'currentPage': 1,
						'goodsClassifyId': this.addGoodTypeId,
						'name': this.addGoodName,
						'pageSize': '10'
					};
				}
			}
			let that = this;
			this.$http.request(this, 'POST', '/goods/goodsList', postBody).then((res) => {
				if (res.data.errCode === '000000') {
					let resGoods = res.data.result.list;
					that.data5 = new Array(resGoods.length);
					for (let i = 0; i < resGoods.length; i++) {
						let item = new Object();
						item.goodName = resGoods[i].name;
						item.goodCategory = resGoods[i].goodsClassifyName;
						item.stock = resGoods[i].inventory;
						item.unitPrice = resGoods[i].price;
						item.id = resGoods[i].id;
						that.data5[i] = item;
					}
					that.leftPageTotal = res.data.result.total;
				}
			}).catch((error) => {
				console.log(error);
			});
		}
	}
};
</script>
<style>
    .table-wrapper{
        display: inline-block;
    }
    .left{
        margin-right: 2rem;
        display: inline-block;
    }
    .right{
        display: inline-block;
    }
    .info-item{
        display: inline-block;
    }
    .title{
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
    }
    .input{
        display: inline-block;
        width: 200px;
    }
    .good-query{
        display: inline-block;
    }
    .table-container{
        margin: 0 auto
    }

</style>


