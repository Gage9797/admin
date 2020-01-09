<template>
    <div class="worker-index">
      <div>
          <Tabs type="card" class="ql-tab">
            <TabPane label="员工管理" class="ql-tab-pane">
              <WorkerPage ref="workerPage" :data1="staffList"></WorkerPage>
            </TabPane>
        </Tabs>
      </div>
    </div>
</template>
<script>
import WorkerPage from './worker-page.vue';
import PriorityPage from './priority-page.vue';
export default {
	components: {
		WorkerPage,
		PriorityPage
	},
	provide: function () {
		return {
			refreshMySon: this.refreshMySon
		};
	},
	data () {
		return {
			seletedType: 'worker',
			workerFlag: true,
			departmentFlag: false,
			priorityFlag: false,
			staffList: [],
			departmentList: [],
			authorityList: []
		};
	},
	methods: {
		showSelection (selection) {
			if (selection === 'worker') {
				this.workerFlag = true;
				this.departmentFlag = false;
				this.priorityFlag = false;
			} else if (selection === 'department') {
				this.workerFlag = false;
				this.departmentFlag = true;
				this.priorityFlag = false;
			} else {
				this.workerFlag = false;
				this.departmentFlag = false;
				this.priorityFlag = true;
			}
		},
		refreshMySon () {
			/**
			 * 整个员工模块的数据设计不合理，有共有的部分应该提升到当前。
			 * 现在出现的问题是，某一个tab页面的数据更新后，其余页面出现了脏数据。
			 * 暂时的处理方法是通知其余页面更新。
			 *
			 * TODO：公共数据提升至当前，减少多余请求。
			 */

			const children = ['workerPage', 'departmentPage', 'priorityPage'];

			children.forEach(refName => {
				this.$refs[refName].refresh();
			});
		}

	}
};
</script>

<style  scoped lang="less">
/deep/.add-button{
    margin-top: 20px;
    text-align: right;
}
/deep/ .ivu-tabs-tab-active{
  background: rgb(228,228,226)
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
/deep/ .ivu-btn-error{
  background: rgb(235,200,107);
  border-color: rgb(235,200,107);
}
</style>
