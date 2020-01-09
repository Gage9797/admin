<template>
    <div class="into-warehouse">
        <div class="condition">
           <Form>
            <i-row>
              <i-col span="9">
                <FormItem label="选择时间：">
                  <DatePicker type="daterange" placement="bottom-start" placeholder="请选择" style="width: 70%" v-model="dateRange" :editable="false"></DatePicker>
                </FormItem>
              </i-col>
              <i-col span="9">
                <FormItem label="商品名称：">
                  <Input  class="input" v-model="searchGoodName" style="width: 70%" placeholder="商品名称"/>
                </FormItem>
              </i-col>
              <i-col span="2">
                <Button type="primary" @click="queryRC" style="margin-left: 10px;">查询</Button>
              </i-col>
            </i-row>
          </Form>
        </div>
        <Table border :columns="columns3" :data="data3" class="table"></Table>
        <Page style="margin-top:10px;text-align: center;" :total="RKTotal" show-elevator @on-change="RKChangePage"></Page>
        <Button type="primary" class="add" @click="showAddModal=true">增加入库</Button>
        <Modal
			v-model="showAddModal"
			width="80"
			fullscreen
			title="增加入库"
		>
          <IntoModal @changeModalList="addGoods" ref="intoModal"></IntoModal>
          <div slot="footer">
            <Button @click="handleCancel" type="text" size="large">取消</Button>
            <Button class="modal-confirm" type="primary" size="large" @click="handleSubmit">确定</Button>
        </div>
        </Modal>
    </div>
</template>
<script>
import SelfModal from './self-modal.vue';
import IntoModal from './components/into-modal.vue';
import { formatPrice } from '@/tools';

export default {
	components: {
		SelfModal,
		IntoModal
	},
	data () {
		return {
			searchGoodName: '',
			columns3: [
				{ title: '入库单号', key: 'number', align: 'center' },
				{ title: '商品名称', key: 'goodName', align: 'center' },
				{ title: '入库时间', key: 'time', align: 'center' },
				{ title: '入库前库存', key: 'inventoryBefore', align: 'center' },
				{ title: '入库数量', key: 'count', align: 'center' },
				{ title: '入库总金额', key: 'tranTotalPrice', align: 'center' },
				{ title: '库存', key: 'inventoryAfter', align: 'center' },
				{ title: '单价', key: 'unitPrice', align: 'center' },
				{ title: '库存总额', key: 'totalPrice', align: 'center' },
				{ title: '备注', key: 'comment', align: 'center' }
			],
			data3: [],
			addGoodsArray: [],
			RKTotal: 0,
			dateRange: [new Date(Date.now() - 30 * 24 * 3600 * 1000), new Date()], // 30 d
			teaHouseId: this.$util.getTeaHouseId(),
			showAddModal: false
		};
	},
	methods: {
		formatDateTime (inputTime) {
			var date = new Date(inputTime);
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? '0' + m : m;
			var d = date.getDate();
			d = d < 10 ? '0' + d : d;
			var h = date.getHours();
			h = h < 10 ? '0' + h : h;
			var minute = date.getMinutes();
			var second = date.getSeconds();
			minute = minute < 10 ? '0' + minute : minute;
			second = second < 10 ? '0' + second : second;
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
		},
		getInitialInfo (page = 1) {
			let that = this;
			let postBody = {
				teaHouseId: this.teaHouseId,
				operation: true,
				currentPage: page
			};
			if (this.searchGoodName !== '') {
				postBody = {
					teaHouseId: this.teaHouseId,
					operation: true,
					currentPage: page,
					goodsName: this.searchGoodName
				};
				if (this.dateRange[0]) {
					let startDate = this.dateRange[0].getTime();
					let endDate = this.dateRange[1].getTime();
					postBody = {
						teaHouseId: this.teaHouseId,
						operation: true,
						currentPage: page,
						goodsName: this.searchGoodName,
						startTime: startDate,
						endTime: endDate
					};
				}
			} else {
				if (this.dateRange[0]) {
					let startDate = this.dateRange[0].getTime();
					let endDate = this.dateRange[1].getTime();
					postBody = {
						teaHouseId: this.teaHouseId,
						operation: true,	// true => 入库， false => 出库
						currentPage: page,
						startTime: startDate,
						endTime: endDate
					};
				}
			}
			this.$http
				.request(this, 'POST', '/goods/goodsStockListByParams', postBody)
				.then(res => {
					if (res.data.errCode === '000000') {
						let resList = res.data.result.list;
						let len = resList.length;
						that.RKTotal = res.data.result.total;
						that.data3 = new Array(len);
						for (let i = 0; i < len; i++) {
							let item = {};
							item.number = resList[i].number;
							item.goodName = resList[i].goodsName;
							item.operation = '入库';
							item.time = this.formatDateTime(resList[i].timestamp);
							item.inventoryBefore = resList[i].inventoryBefore;
							item.count = resList[i].count;
							item.unitPrice = formatPrice(resList[i].unitPrice);
							item.tranTotalPrice = formatPrice(parseFloat(item.unitPrice) * parseFloat(item.count));
							item.inventoryAfter = resList[i].inventoryAfter;
							item.totalPrice = formatPrice(parseFloat(item.inventoryAfter) * parseFloat(item.unitPrice));
							item.comment = resList[i].comment;
							that.data3[i] = item;
						}
					}
				})
				.catch(error => {});
		},
		warning () {
			const title = '注意';
			const content = '<p>商品名称不为空时才可以进行筛选</p>';
			this.$Modal.warning({
				title: title,
				content: content
			});
		},
		queryRC (page = 1) {
			if (this.searchGoodName === '') {
				// this.warning();
				this.getInitialInfo();
			} else {
				this.getInitialInfo();
			}
		},
		addGoods (data) {
			this.addGoodsArray = data;
		},
		handleSubmit () {
			if (this.addGoodsArray.length <= 0) {
				return this.$Message.error('请先选择商品');
			}

			let temp = [];
			for (let i = 0; i < this.addGoodsArray.length; i++) {
				let obj = {};
				obj.goodsId = this.addGoodsArray[i].id;
				obj.count = this.addGoodsArray[i].tempNumber;
				obj.comment = this.addGoodsArray[i].comment;
				temp.push(obj);
			}
			let postBody = {
				teaHouseId: this.teaHouseId,
				jsonArray: temp
			};

			let that = this;
			this.$http
				.request(this, 'POST', '/goods/goodsStockIn', postBody)
				.then(res => {
					if (res.data.errCode === '000000') {
						that.getInitialInfo();
						that.$refs.intoModal.reset();
						that.$Message.success('操作成功');
						that.showAddModal = false;
					}
				})
				.catch();
		},
		handleCancel () {
			this.showAddModal = false;
			this.$refs.intoModal.reset();
		},
		RKChangePage (page) {
			this.getInitialInfo(page);
		}
	},
	created () {
		this.getInitialInfo();
	}
};
</script>

<style lang="less" scoped>
  .into-warehouse{
    background: rgb(228,228,226);
    border-radius: 16px;
	position: relative;
	padding: 20px;
  }
  .condition{
    border-bottom: 1px solid rgb(210,210,210);
    padding-top: 10px;
    padding-left: 10px;
    margin-top: 0;
  }
  /deep/ .ivu-input{
    background:rgb(235,235,233);
    display: inline-block;
  }
  /deep/ .ivu-select-selection{
    background:rgb(235,235,233);
  }
  /deep/ .ivu-form-item-label{
    color: rgb(95,95,95);
    font-size: 14px;
    text-align: center;
    padding: 10px 0;
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
  .table{
    margin: 20px 0;
  }
  .add{
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
</style>

