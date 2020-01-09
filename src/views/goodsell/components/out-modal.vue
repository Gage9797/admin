<template>
  <div class="out-modal">
    <div class="header-wrapper">
      <Form>
        <i-row>
          <i-col span="9">
            <FormItem label="商品名称：">
              <Input class="input" v-model="addGoodName" placeholder="商品名称" style="width:70%"/>
            </FormItem>
          </i-col>
          <i-col span="9">
            <FormItem label="商品类别：">
              <Select class="good-query" v-model="addGoodType" style="width:70%">
                <Option
                  v-for="item in classifyName"
                  :value="item.value"
                  :key="item.index"
                >{{item.value}}</Option>
              </Select>
            </FormItem>
          </i-col>
          <i-col span="2">
            <Button type="primary" @click="setCategoryId(queryGood)">查询</Button>
          </i-col>
        </i-row>
      </Form>
    </div>
    <Form>
      <i-row>
        <i-col span="11">
          <div class="title-name">所有商品</div>
          <div class="table-wrapper left-table-wrapper">
            <Table
              	size="small"
				height="300"
				border
				:columns="goodsHeader"
				:data="allGoods"
				no-data-text="暂无数据"
				class="left-table"
            />
            <Page
              size="small"
              :page-size="10"
              :total="leftPageTotal"
              show-elevator
              @on-change="leftChangePage"
              class="left-page"
            ></Page>
          </div>
        </i-col>
        <i-col span="12" offset="1">
          <div class="title-name">出库商品</div>
          <div class="table-wrapper">
            <Table
              size="small"
			  height="300"
              border
              :columns="CKGoodsHeader"
              :data="CKGoods"
              no-data-text="暂无数据"
            />
          </div>
        </i-col>
      </i-row>
    </Form>
  </div>
</template>

<script>
import QlInputNumber from '../../../components/ql-input-number';
export default {
	// beforeCreate () {
	//     this.$options.components.QlInputNumber = () => import('../../../components/ql-input-number');
	// },
	components: {
		QlInputNumber
	},
	data () {
		return {
			classifyName: [],
			addGoodName: '',
			addGoodType: '',
			addGoodTypeId: 0,
			goodsHeader: [
				{ title: '分类', key: 'goodCategory' },
				{ title: '名称', key: 'goodName' },
				{ title: '单价', key: 'unitPrice' },
				{ title: '库存', key: 'stock' },
				{
					title: '操作',
					key: 'operation',
					width: 80,
					align: 'center',
					render: (h, params) => {
						let that = this;
						return h(
							'Button',
							{
								props: {
									type: 'primary',
									size: 'small',
									disabled: params.row.stock <= 0
								},
								on: {
									click: () => {
										for (let i = 0; i < that.CKGoods.length; i++) {
											if (that.CKGoods[i].goodName === params.row.goodName) {
												return;
											}
										}
										if (params.row.stock === 0) {
											confirm('商品数量为0，不可再进行出库了');
											return;
										}
										if (that.CKGoods.length < 5) {
											let temp = {};
											temp.goodName = params.row.goodName;
											temp.unitPrice = params.row.unitPrice;
											temp.tempNumber = 1;
											temp.totalPrice = temp.unitPrice;
											temp.id = params.row.id;
											temp.stock = params.row.stock;
											temp.comment = '';
											that.CKGoods.push(temp);
											that.$emit('changeModalList', that.CKGoods);
										}
									}
								}
							},
							'添加'
						);
					}
				}
			],
			allGoods: [],
			leftPageTotal: 0,
			CKGoodsHeader: [
				{ title: '名称', key: 'goodName' },
				{ title: '单价', key: 'unitPrice' },
				{ title: '总价', key: 'totalPrice' },
				{
					title: '数量',
					key: 'number',
					width: 135,
					align: 'center',
					render: (h, params) => {
						let that = this;
						return h(QlInputNumber, {
							props: {
								value: that.CKGoods[params.index].tempNumber,
								max: that.CKGoods[params.index].stock
							},
							on: {
								input (number) {
									if (number === 0) {
										that.CKGoods.splice(params.index, 1);
									} else {
										if (number === that.CKGoods[params.index].stock) {
											that.$Message.info('出库数量已达库存数量');
										}
										that.CKGoods[params.index].tempNumber = number;
										that.CKGoods[params.index].totalPrice =
                      (that.CKGoods[params.index].unitPrice * 1000 * number) /
                      1000;
										that.$emit('changeModalList', that.CKGoods);
									}
								}
							}
						});
					}
				},
				{
					title: '操作',
					key: 'operation',
					align: 'center',
					render: (h, params) => {
						let that = this;
						return h(
							'Button',
							{
								props: {
									type: 'primary',
									size: 'small'
								},
								on: {
									click: () => {
										that.CKGoods.splice(params.index, 1);
									}
								}
							},
							'删除'
						);
					}
				},
				{
					title: '备注',
					key: 'comment',
					align: 'center',
					width: 150,
					render: (h, params) => {
						let vm = this;
						return h('Input', {
							props: {
								maxlength: 20,
								value: params.row.comment
							},
							style: {
								width: '120px'
							},
							on: {
								'on-blur': () => {
									vm.CKGoods[params.index].comment = event.target.value;
									vm.$emit('changeModalList', vm.CKGoods);
								}
							}
						});
					}
				}
			],
			CKGoods: []
		};
	},
	created () {
		this.getModalGoodList();
		this.getCategories();
	},
	methods: {
		clearGoods () {
			this.CKGoods = [];
			this.$emit('changeModalList', []);
		},
		getModalGoodList (page = 1) {
			let postBody = {
				teaHouseId: this.$util.getTeaHouseId(), // 茶馆id
				currentPage: page, // 可选参数，默认值为1
				pageSize: 10 // 可选参数，默认值为10
			};
			let that = this;
			this.$http
				.request(this, 'POST', '/goods/goodsList', postBody)
				.then(res => {
					if (res.data.errCode === '000000') {
						let resGoods = res.data.result.list;
						that.allGoods = new Array(resGoods.length);
						for (let i = 0; i < resGoods.length; i++) {
							let item = {};
							item.goodName = resGoods[i].name;
							item.goodCategory = resGoods[i].goodsClassifyName;
							item.stock = resGoods[i].inventory;
							item.unitPrice = resGoods[i].price;
							item.id = resGoods[i].id;
							that.allGoods[i] = item;
						}
					}
					that.leftPageTotal = res.data.result.total;
				})
				.catch();
		},
		leftChangePage (page) {
			this.getModalGoodList(page);
		},
		getCategories () {
			let that = this;
			this.$http
				.request(this, 'GET', '/goods/goodsClassifyList')
				.then(res => {
					let list = res.data.result;
					for (let i = 0; i < list.length; i++) {
						if (list[i].name === null) {
							list.splice(i, 1); // i=8,length=9
							i = i - 1;
						}
					}
					that.classifyName = new Array(list.length);
					that.classifyName[0] = { value: '全部', label: 0 };
					for (let i = 0; i < list.length; i++) {
						let item = {};
						item.value = list[i].name;
						item.label = list[i].id;
						that.classifyName[i + 1] = item;
					}
				})
				.catch(error => {
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
					teaHouseId: this.$util.getTeaHouseId(),
					currentPage: 1,
					pageSize: '10'
				};
				if (this.addGoodName !== '') {
					postBody = {
						teaHouseId: this.$util.getTeaHouseId(),
						currentPage: 1,
						name: this.addGoodName,
						pageSize: '10'
					};
				}
			} else {
				postBody = {
					teaHouseId: this.$util.getTeaHouseId(),
					goodsClassifyId: this.addGoodTypeId,
					currentPage: 1,
					pageSize: '8'
				};
				if (this.addGoodName !== '') {
					postBody = {
						teaHouseId: this.$util.getTeaHouseId(),
						currentPage: 1,
						goodsClassifyId: this.addGoodTypeId,
						name: this.addGoodName,
						pageSize: '8'
					};
				}
			}
			let that = this;
			this.$http
				.request(this, 'POST', '/goods/goodsList', postBody)
				.then(res => {
					if (res.data.errCode === '000000') {
						let resGoods = res.data.result.list;
						that.allGoods = new Array(resGoods.length);
						for (let i = 0; i < resGoods.length; i++) {
							let item = {};
							item.goodName = resGoods[i].name;
							item.goodCategory = resGoods[i].goodsClassifyName;
							item.stock = resGoods[i].inventory;
							item.unitPrice = resGoods[i].price;
							item.id = resGoods[i].id;
							that.allGoods[i] = item;
						}
						that.leftPageTotal = res.data.result.total;
					}
				})
				.catch(error => {
					console.log(error);
				});
		}
	}
};
</script>

<style lang="less" scoped>
.title-name {
  font-size: 14px;
  color: rgb(107, 92, 67);
  margin-bottom: 5px;
}
.table-wrapper {
  background: rgb(228, 228, 226);
  border-radius: 10px;
  padding: 15px;
  height: 380px;
  padding-bottom: 40px;
}
.left-table {
  margin-bottom: 15px;
}
.left-table-wrapper {
  position: relative;
}
.left-page {
  position: absolute;
  bottom: 15px;
  left: 20%;
}
/deep/ .ivu-table-body {
  background-color: rgb(228, 228, 226);
}
</style>
