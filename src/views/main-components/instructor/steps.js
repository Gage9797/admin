
export default [
	{
		msg: '欢迎使用麒龙茶典智慧管家系统',
		btnText: '开始',
		done: false,
		after: function (ele) {
			// 展开营业
			const businessDom = document.querySelector('#main > div > div.sidebar-menu-con > div > div > div > ul > li:nth-child(1) > div');
			if (businessDom && !businessDom.parentElement.classList.contains('ivu-menu-opened')) {
				businessDom.click();
			}
		}
	}, {
		ele: '#main > div > div.sidebar-menu-con > div > div > div > ul > li:nth-child(1) > ul > li:nth-child(1)',
		msg: '在桌台管理中，您可以对包间进行线下预定、开台、点餐和结账的操作',
		btnText: '下一步',
		done: false
	}, 	{
		ele: '#main > div > div.sidebar-menu-con > div > div > div > ul > li:nth-child(1) > ul > li:nth-child(4)',
		msg: '在商品售出中，您可以查看门店商品的零售情况，并可线下进行商品售出',
		btnText: '下一步',
		done: false,
		after: function (ele) {
			// 展开库存
			const stockDom = document.querySelector('#main > div > div.sidebar-menu-con > div > div > div > ul > li:nth-child(2) > div');
			if (stockDom && !stockDom.parentElement.classList.contains('ivu-menu-opened')) {
				stockDom.click();
			}
		}
	}, 	{
		ele: '#main > div > div.sidebar-menu-con > div > div > div > ul > li:nth-child(2)',
		msg: '在库存管理中，您可以在商品列表里查看商品的所有出入库记录，并可以对商品进行出入库操作',
		btnText: '下一步',
		done: false,
		before: function (next) {
			// // 关闭营业
			const businessDom = document.querySelector('#main > div > div.sidebar-menu-con > div > div > div > ul > li:nth-child(1) > div');
			if (businessDom && businessDom.parentElement.classList.contains('ivu-menu-opened')) {
				businessDom.click();
			}
			setTimeout(next, 300);
		}
	}, 	{
		ele: '#main > div > div.sidebar-menu-con > div > div > div > ul > li:nth-child(3)',
		msg: '对店员进行员工管理、部门管理、权限管理，新增员工默认系统登录账号与密码为该员工的手机号',
		btnText: '下一步',
		done: false,
		before: function (next) {
			// // 关闭库存
			const stockDom = document.querySelector('#main > div > div.sidebar-menu-con > div > div > div > ul > li:nth-child(2) > div');
			if (stockDom && stockDom.parentElement.classList.contains('ivu-menu-opened')) {
				stockDom.click();
			}
			setTimeout(next, 300);
		},
		after: function (ele) {
			// 展开设置
			const settingDom = document.querySelector('#main > div > div.sidebar-menu-con > div > div > div > ul > li:nth-child(6) > div');
			if (settingDom && !settingDom.parentElement.classList.contains('ivu-menu-opened')) {
				settingDom.click();
			}
		}
	}, 	{
		ele: '#main > div > div.sidebar-menu-con > div > div > div > ul > li:nth-child(6) > ul > li:nth-child(1)',
		msg: '对门店基本信息进行设置，此设置将同步到移动端茶馆首页。',
		btnText: '前往设置',
		done: true,
		doneCallback: function (self) {
			self.$router.push({
				name: 'home_page_settings'
			});
		}
	}
];
