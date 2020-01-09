<template>
    <div class="goods-list">
        <div class="header-wrapper">
          <Form>
            <i-row>
              <i-col span="9">
                <FormItem label="商品类别：">
                  <Select class="good-query" v-model="category" style="width: 70%">
                    <Option v-for="(item,index) in classifyName" :value="item" :key="index" >{{ item }}</Option>
                  </Select>
                </FormItem>
              </i-col>
              <i-col span="9">
                <FormItem label="商品名称：">
                  <Input v-model="name" placeholder="商品名称" style="width: 70%"/>
                </FormItem>
              </i-col>
              <i-col span="2">
                <Button class="query" type="primary" @click="searchName(name)">查询</Button>
              </i-col>
			  <i-col span="2">
                <Button class="query" type="primary" @click="add()">新增</Button>
              </i-col>
            </i-row>
          </Form>
        </div>
        <Table border :columns="columns1" :data="goodList">
		</Table>
        <Page style="margin-top:10px;text-align: center;" :current.sync="current" :total="pageTotal" show-elevator @on-change="changePage"></Page>
		<Modal
            v-model="modifyModal"
            title="修改商品"
            @on-ok="modifyConfirm"
            @on-cancel="modifyCancel">
            <Form ref="goods" :model="goods" label-position="left" :label-width="80">
				<Row>
					<Col span="24">
						<FormItem label="商品编号">
							<span>{{ goods.id }}</span>
							<!-- <Input v-model="reserveForm.type" disabled style="width: 80%;" /> -->
						</FormItem>
					</Col>
				</Row>

				<Row>
					<Col span="24">
						<FormItem label="商品名称" prop="goodName">
							<i-input v-model="goods.goodName" :maxlength="30" style="width: 80%" />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<FormItem label="商品类别" prop="goodCategory">
							<i-input v-model="goods.goodCategory" style="width: 80%" />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<FormItem label="单价" prop="unitPrice">
							<i-input v-model="goods.unitPrice" style="width: 80%" />
						</FormItem>
					</Col>
				</Row>
            </Form>
			<div slot="footer">
				<Button type="text" @click="modifyCancel">取消</Button>
                <Button type="primary" @click="modifyConfirm">确定</Button>
			</div>
		</Modal>
		<Modal
            v-model="addModal"
            title="新增商品"
            @on-ok="addConfirm"
            @on-cancel="addCancel">
            <Form ref="addGoods" :model="addGoods" label-position="left" :label-width="80">
				<Row>
					<Col span="24">
						<FormItem label="商品名称" prop="goodName">
							<i-input v-model="addGoods.goodName" :maxlength="30" style="width: 80%" />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<FormItem label="商品类别" prop="goodCategory">
							<i-input v-model="addGoods.goodCategory" style="width: 80%" />
						</FormItem>
					</Col>
				</Row>
				<Row>
					<Col span="24">
						<FormItem label="单价" prop="unitPrice">
							<i-input v-model="addGoods.unitPrice" style="width: 80%" />
						</FormItem>
					</Col>
				</Row>
            </Form>
			<div slot="footer">
				<Button type="text" @click="addCancel">取消</Button>
                <Button type="primary" @click="addConfirm">确定</Button>
			</div>
		</Modal>
    </div>
</template>

<script>
import { formatPrice } from '@/tools';

export default {
	data () {
		return {
			columns1: [
				{
					title: '商品编号',
					key: 'id'
				},
				{
					title: '商品名称',
					key: 'goodName'
				},
				{
					title: '商品类别',
					key: 'goodCategory'
				},
				{
					title: '单价',
					key: 'unitPrice',
					render: (h, params) => h('div', formatPrice(params.row.unitPrice))
				},
				// {
				// 	title: '总价',
				// 	key: 'totalPrice',
				// 	render: (h, params) => h('div', formatPrice(params.row.totalPrice))
				// },
				{
					title: '操作',
					key: 'action',
					width: 150,
					align: 'center',
					render: (h, params) => {
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
										this.modify(params.row);
									}
								}
							}, '修改'),
							h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								on: {
									click: () => {
										this.delete(params.row);
									}
								}
							}, '删除')
						]);
					}
				}
			],
			goods: {},
			addGoods: {
				goodCode: '1',
				goodName: '',
				goodCategory: '',
				stock: '100',
				unitPrice: '',
				totalPrice: ''
			},
			modifyModal: false,
			addModal: false,
			goodList: [],
			current: 1,
			pageTotal: 0,
			classifyName: ['全部'],
			searchGoodCategory: '',
			category: '',
			searchCategoryId: 0,
			searchGoodName: '',
			name: '',
			showFlag: false,
			rows: {},
			teaHouseId: this.$util.getTeaHouseId()
		};
	},
	methods: {
		getTableData () {
			this.$http.request(this, 'POST', '/goods/goodsList').then((res) => {
				if (res.data.errCode === '000000') {
					let resGoods = res.data.data.goodsList;
					this.goodList = resGoods;
				}
				// that.pageTotal = res.data.result.total;
				this.classifyName.push(this.goodList[0].goodCategory);
			}).catch((error) => {
				console.log(error);
			});
		},
		modify (params) {
			this.modifyModal = true;
			this.goods = params;
		},
		add () {
			this.addModal = true;
			// this.goods = params;
		},
		delete (params) {
			console.log('params', params);
			this.$http.request(this, 'POST', '/goods/deleteGoods', {id: params.id})
				.then(res => {
					if (res.data.errCode === '000000') {
						this.$Message.success('删除成功!');
						this.goods = {};
						this.getTableData();
					} else {
						this.$Message.error('操作失败');
					}
				});
		},
		modifyCancel () {
			this.modifyModal = false;
			this.goods = {};
		},
		modifyConfirm () {
			this.modifyModal = false;
			this.$http.request(this, 'POST', '/goods/modifyGoods', this.goods)
				.then(res => {
					if (res.data.errCode === '000000') {
						this.$Message.success('修改成功!');
						this.goods = {};
						this.getTableData();
					} else {
						this.$Message.error('操作失败');
					}
				});
		},
		addCancel () {
			this.addModal = false;
		},
		addConfirm () {
			this.addModal = false;
			this.$http.request(this, 'POST', '/goods/addGoods', this.addGoods)
				.then(res => {
					if (res.data.errCode === '000000') {
						this.$Message.success('新增成功!');
						this.addGoods = {};
						this.getTableData();
					} else {
						this.$Message.error('操作失败');
					}
				});
		},
		searchName (searchGoodName) {
			// let goods = {};
			console.log('this.goodList', this.goodList, searchGoodName);
			this.goodList.forEach(item => {
				if (item.goodName === searchGoodName) {
					this.goodList = [];
					this.goodList.push(Object.assign({}, item));
				}
			});
			// this.goodList = goods;
		},
		changePage (page) {
			this.getTableData(page);
		},
		getCategories () {
			let that = this;
			this.$http.request(this, 'GET', '/goods/goodsClassifyList').then((res) => {
				let list = res.data.result;
				for (let i = 0; i < list.length; i++) {
					if (list[i].name === null) {
						list.splice(i, 1);// i=8,length=9
						i = i - 1;
					}
				}

				that.classifyName = new Array(list.length);
				that.classifyName[0] = { value: 0, label: '全部' };
				that.searchCategoryId = 0;
				for (let i = 0; i < list.length; i++) {
					let item = {};
					item.label = list[i].name;
					item.value = list[i].id;
					that.classifyName[i + 1] = item;
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		setCategoryId (callback) {
			callback(this.searchCategoryId);
		},
		queryGood (id) {
			this.current = 1;
			let postBody = {};
			if (id === 0) {
				postBody = {
					'teaHouseId': this.teaHouseId,
					'currentPage': 1,
					'pageSize': '10'
				};
				if (this.searchGoodName !== '') {
					postBody = {
						'teaHouseId': this.teaHouseId,
						'currentPage': 1,
						'name': this.searchGoodName,
						'pageSize': '10'
					};
				}
			} else {
				postBody = {
					'teaHouseId': this.teaHouseId,
					'goodsClassifyId': this.searchCategoryId,
					'currentPage': 1,
					'pageSize': '10'
				};
				if (this.searchGoodName !== '') {
					postBody = {
						'teaHouseId': this.teaHouseId,
						'goodsClassifyId': this.searchCategoryId,
						'currentPage': 1,
						'name': this.searchGoodName,
						'pageSize': '10'
					};
				}
			}
			let that = this;
			this.$http.request(this, 'POST', '/goods/goodsListWithState', postBody).then((res) => {
				if (res.data.errCode === '000000') {
					let resGoods = res.data.result.list;
					that.goodList = new Array(resGoods.length);
					for (let i = 0; i < resGoods.length; i++) {
						let item = {};
						item.goodCode = resGoods[i].id;
						item.goodName = resGoods[i].name;
						item.goodCategory = resGoods[i].goodsClassifyName;
						item.stock = resGoods[i].inventory;
						item.unitPrice = resGoods[i].price;
						item.totalPrice = item.stock * item.unitPrice;
						that.goodList[i] = item;
					}
				}
				that.pageTotal = res.data.result.total;
			}).catch((error) => {
				console.log(error);
			});
		}
	},
	created () {
		this.getTableData();
		// this.getCategories();
	}
};
</script>

<style lang="less" scoped>
    .goods-list{
        position: relative;
        background: rgb(228,228,226);
        border-radius: 16px;
        padding: 20px;
    }
    .header-wrapper{
        padding-top: 10px;
        padding-left: 20px;
        border-bottom: 1px solid rgb(210,210,210);
        position: relative;
        font-size: 16px;
        color: rgb(135,135,135);
    }
    .title{
        display: inline-block;
    }
    .good-query{
        width: 150px
    }
    .name-text{
        margin-left: 30px;
    }
    .good-name{
        display: inline-block;
        width: 150px;
    }
    .query{
        display: inline-block;
        margin-left: 15px;
    }
    .item-detail{
        position:absolute;
        top: 0;
        left: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        background: #ffffff;
    }
    /deep/ .ivu-input{
      background:rgb(235,235,233);
      display: inline-block;
    }
    /deep/ .ivu-select-selection{
      background:rgb(235,235,233);
    }
    /deep/ .ivu-table td{
        background: rgb(235,235,233);
        border-bottom: 1px solid rgb(210,210,210)
    }
    /deep/ .ivu-table th{
        background: rgb(235,235,233);
        border-bottom: 1px solid rgb(210,210,210);
        color: rgb(107,92,67)
    }
    /deep/ .ivu-form-item-label{
      color: rgb(95,95,95);
      font-size: 14px;
      text-align: center;
      padding: 10px 0
    }
</style>
