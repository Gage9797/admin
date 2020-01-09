<template>
    <div class="item-detail">
        <div class="info-header">
           <Form>
            <i-row>
              <i-col>
                <FormItem label="商品编号:">
                  <span class="info">{{ info.goodCode }}</span>
                </FormItem>
              </i-col>
            </i-row>
            <i-row>
              <i-col span="10">
                <FormItem label="商品名称:">
                  <span class="info">{{ info.goodName }}</span>
                </FormItem>
              </i-col>
            </i-row>
            <i-row>
              <i-col span="10">
                <FormItem label="商品类别:">
                  <span class="info">{{ info.goodCategory }}</span>
                </FormItem>
              </i-col>
            </i-row>
            <i-row>
              <i-col span="9">
                <FormItem label="选择时间">
                  <DatePicker type="daterange" placement="bottom-start" placeholder="请选择" style="width: 70%" v-model="dateRange"></DatePicker>
                </FormItem>
              </i-col>
              <i-col span="9">
                <FormItem label="操作类型">
                  <Select style="width: 70%" v-model="selectedType">
                    <Option :value="0">全部</Option>
                    <Option :value="1">入库</Option>
                    <Option :value="2">出库</Option>
                </Select>
                </FormItem>
              </i-col>
              <i-col span="2">
                <Button type="primary" @click="query">查询</Button>
              </i-col>
            </i-row>
          </Form>
            <!-- <div >
                <span class="title">商品编号:</span>
                <span class="info">{{info.goodCode}}</span>
            </div> -->
            <!-- <div>
                <span class="title">商品名称:</span>
                <span class="info">{{info.goodName}}</span>
            </div> -->
            <!-- <div>
                <span class="title">商品类别:</span>
                <span class="info">{{info.goodCategory}}</span>
            </div> -->
            <!-- <div class="condition">
                <span class="title">选择时间</span>
                <DatePicker type="daterange" placement="bottom-start" placeholder="Select date" style="width: 200px" v-model="dateRange"></DatePicker>
            </div>
            <div class="condition">
                <span class="title">操作类型</span>
                <Select class="good-query" v-model="selectedType">
                    <Option value="0">全部</Option>
                    <Option value="1">入库</Option>
                    <Option value="2">出库</Option>
                </Select>
            </div> -->
            <!-- <Button type="primary" @click="query">查询</Button> -->
        </div>
        <Table border :columns="columns2" :data="data2" class="table"></Table>
        <Page style="margin-top:10px;text-align: center;" :total="itemPageTotal" show-elevator @on-change="itemChangePage" v-show="!queryFlag"></Page>
        <Page style="margin-top:10px;text-align: center;" :total="itemPageTotal2" show-elevator @on-change="itemChangePage2" v-show="queryFlag"></Page>
    </div>
</template>

<script>
import { formatPrice } from '@/tools';

export default {
	created () {
		this.info = this.$route.params.info;
		if (!this.info) {
			return this.$router.push({
				name: 'goods-list'
			});
		}

		let now = new Date();
		let thirtyDayAgoTimestamp = +now - 30 * 24 * 60 * 60 * 1000;
		let thirtyDayAgo = new Date(thirtyDayAgoTimestamp);
		thirtyDayAgo.setHours(0);
		thirtyDayAgo.setMinutes(0);
		thirtyDayAgo.setSeconds(0);
		this.dateRange = [thirtyDayAgo, now];

		this.queryFlag = false;
		this.getSpecificGood();
	},
	data () {
		return {
			info: {},
			columns2: [
				{ title: '出入库单号', key: 'number' },
				{ title: '操作类型', key: 'operation' },
				{ title: '出/入库时间', key: 'time' },
				{ title: '出/入库前库存', key: 'inventoryBefore' },
				{ title: '出/入库量', key: 'count' },
				{ title: '出/入库总额', key: 'tranTotalPrice', render: (h, params) => h('div', formatPrice(params.row.tranTotalPrice)) },
				{ title: '库存', key: 'inventoryAfter' },
				{ title: '单价', key: 'unitPrice', render: (h, params) => h('div', formatPrice(params.row.unitPrice)) },
				{ title: '库存总额', key: 'totalPrice', render: (h, params) => h('div', formatPrice(params.row.totalPrice)) }
			],
			data2: [],
			selectedType: 0,
			itemPageTotal: 0,
			itemPageTotal2: 0,
			dateRange: [],
			queryFlag: false,
			teaHouseId: this.$util.getTeaHouseId()
		};
	},
	methods: {
		formatDateTime (inputTime) {
			var date = new Date(inputTime);
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			var h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			var minute = date.getMinutes();
			var second = date.getSeconds();
			minute = minute < 10 ? ('0' + minute) : minute;
			second = second < 10 ? ('0' + second) : second;
			return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
		},
		getSpecificGood (page = 1) {
			let that = this;
			let currentDate = new Date().getTime();
			let monthAgoDate = currentDate - 1000 * 24 * 60 * 60 * 30;
			let postBody = {
				'teaHouseId': this.teaHouseId,
				'goodsName': that.info.goodName,
				'startTime': monthAgoDate,
				'endTime': currentDate,
				'currentPage': page
			};
			this.$http.request(this, 'POST', '/goods/goodsStockListByParams', postBody).then((res) => {
				if (res.data.errCode === '000000') {
					let resList = res.data.result.list;
					let len = resList.length;
					that.data2 = new Array(len);
					for (let i = 0; i < len; i++) {
						let item = {};
						item.number = resList[i].number;
						if (resList[i].operation === true) { item.operation = '入库'; } else { item.operation = '出库'; }
						item.time = this.formatDateTime(resList[i].timestamp);
						item.inventoryBefore = resList[i].inventoryBefore;
						item.count = resList[i].count;
						item.unitPrice = resList[i].unitPrice;
						item.tranTotalPrice = parseFloat(item.count) * parseFloat(item.unitPrice);
						item.inventoryAfter = resList[i].inventoryAfter;
						item.totalPrice = parseFloat(item.inventoryAfter) * parseFloat(item.unitPrice);
						that.data2[i] = item;
						console.log(item);
					}
					that.itemPageTotal = Number(res.data.result.total);
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		itemChangePage (page) {
			this.getSpecificGood(page);
		},
		query () {
			this.queryRecord(1);
		},
		queryRecord (searchpage) {
			this.queryFlag = true;
			let that = this;
			let postBody = {};

			if (this.dateRange[0]) {
				let startDate = this.dateRange[0].getTime();
				let endDate = this.dateRange[1].getTime();
				if (this.selectedType == 0) {
					postBody = {
						'teaHouseId': this.teaHouseId,
						'goodsName': that.info.goodName,
						'startTime': startDate,
						'endTime': endDate,
						'currentPage': searchpage
					};
				} else if (this.selectedType == 1) {
					postBody = {
						'teaHouseId': this.teaHouseId,
						'goodsName': that.info.goodName,
						'startTime': startDate,
						'endTime': endDate,
						'operation': true,
						'currentPage': searchpage
					};
				} else if (this.selectedType == 2) {
					postBody = {
						'teaHouseId': this.teaHouseId,
						'goodsName': that.info.goodName,
						'startTime': startDate,
						'endTime': endDate,
						'operation': false,
						'currentPage': searchpage
					};
				}
			} else {
				if (this.selectedType == 0) {
					postBody = {
						'teaHouseId': this.teaHouseId,
						'goodsName': that.info.goodName,
						'currentPage': searchpage
					};
				} else if (this.selectedType == 1) {
					postBody = {
						'teaHouseId': this.teaHouseId,
						'goodsName': that.info.goodName,
						'operation': true,
						'currentPage': searchpage
					};
				} else if (this.selectedType == 2) {
					postBody = {
						'teaHouseId': this.teaHouseId,
						'goodsName': that.info.goodName,
						'operation': false,
						'currentPage': searchpage
					};
				}
			}

			this.$http.request(this, 'POST', '/goods/goodsStockListByParams', postBody).then((res) => {
				if (res.data.errCode === '000000') {
					let resList = res.data.result.list;
					let len = resList.length;
					that.itemPageTotal2 = Number(res.data.result.total);
					that.data2 = new Array(len);
					for (let i = 0; i < len; i++) {
						let item = {};
						item.number = resList[i].number;
						if (resList[i].operation === true) { item.operation = '入库'; } else { item.operation = '出库'; }
						item.time = this.formatDateTime(resList[i].timestamp);
						item.inventoryBefore = resList[i].inventoryBefore;
						item.count = resList[i].count;
						item.unitPrice = resList[i].unitPrice;
						item.tranTotalPrice = item.count * item.unitPrice;
						item.inventoryAfter = resList[i].inventoryAfter;
						item.totalPrice = item.inventoryAfter * item.unitPrice;
						that.data2[i] = item;
					}
				}
			}).catch((error) => {
				console.log(error);
			});
		},
		itemChangePage2 (page) {
			console.log('searchPage', page);
			this.queryRecord(page);
		}
	}
};
</script>

<style  lang="less" scoped>
  .item-detail{
    background: rgb(228,228,226);
    border-radius: 16px;
    padding: 20px;
    margin: 20px 10px 0 10px
  }
  .info-header{
    border-bottom: 1px solid rgb(210,210,210);
    padding-left: 10px;
    padding-bottom: 10px;
  }
  .info{
      color: rgb(95,95,95);
      font-size: 14px;
  }
  .condition{
      display: inline-block;
  }
  .table{
      margin-top: 20px;
  }
  /deep/ .ivu-form-item{
    margin-bottom: 8px;
  }
  /deep/ .ivu-form-item-label{
      color: rgb(95,95,95);
      font-size: 14px;
      text-align: center;
      padding: 10px 8px
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
</style>


