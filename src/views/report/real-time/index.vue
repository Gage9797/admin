<style lang="less" scoped>
#real-time-report {
	min-width: 1024px;
	/deep/ .ivu-tabs-bar {
		margin-bottom: 0;
	}

	/deep/ .card-content-p {
		text-align: center;
	}
}
</style>

<template>
  <div>
    <is-sit-version v-if="!canUse"/>
    <div v-else id="real-time-report">
      <Tabs type="card">
        <TabPane label="订单数据" class="ql-tab-pane">
          <order-data/>
        </TabPane>
        <TabPane label="商品数据" class="ql-tab-pane">
          <goods-data/>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import IsSitVersion from '@/components/is-sit-version';
import OrderData from './order-data';
import GoodsData from './goods-data';
import Mixins from '../mixins';

export default {
	name: 'RealTimeReportIndex',
	mixins: [Mixins],
	components: {
		IsSitVersion,
		OrderData,
		GoodsData
	}
};
</script>
