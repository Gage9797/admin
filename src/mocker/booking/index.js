module.exports = {
	'POST /api/reserveManage/reserveList': (req, res) => {
		let state = parseInt(req.body.state);

		if (state === 3) {
			return res.send({
				'errCode': '000000',
				'errMsg': '成功',
				'result': {
					'pageNum': 1,
					'pageSize': 10,
					'total': 3,
					'pages': 1,
					'isFirstPage': true,
					'isLastPage': true,
					'list': [{
						'id': 264,
						'roomName': 'qwq',
						'orderId': '2018081112afbfc4',
						'buyerId': 136,
						'roomId': 10,
						'payId': null,
						'createTime': 1534002019000,
						'cancelTime': null,
						'cancelReason': null,
						'state': 3,
						'orderEvaluateId': null,
						'confirmTime': null,
						'fee': 10.00,
						'consumerPhone': '13902239944',
						'consumerName': '金蓉',
						'remark': '1314520@9944@123@654',
						'startTime': 1534059000000,
						'endTime': 1534062600000,
						'isFeeBack': -1,
						'peopleNum': 2
					}, {
						'id': 264,
						'roomName': 'qwq',
						'orderId': '2018081112afbfc4',
						'buyerId': 136,
						'roomId': 10,
						'payId': null,
						'createTime': 1534002019000,
						'cancelTime': null,
						'cancelReason': null,
						'state': 3,
						'orderEvaluateId': null,
						'confirmTime': null,
						'fee': 10.00,
						'consumerPhone': '13902239944',
						'consumerName': '金蓉',
						'remark': '1314520@9944@123@654',
						'startTime': 1534059000000,
						'endTime': 1534062600000,
						'isFeeBack': 1,
						'peopleNum': 2
					}]
				}
			});
		} else if (state === 4) {
			return res.send({
				'errCode': '000000',
				'errMsg': '成功',
				'result': {
					'pageNum': 1,
					'pageSize': 10,
					'total': 3,
					'pages': 1,
					'isFirstPage': true,
					'isLastPage': true,
					'list': [{
						'id': 195,
						'roomName': 'qwq',
						'orderId': '20180723fb3a1770',
						'buyerId': 137,
						'roomId': 8,
						'payId': null,
						'createTime': 1532344269000,
						'cancelTime': null,
						'cancelReason': null,
						'state': 4,
						'orderEvaluateId': null,
						'confirmTime': null,
						'fee': 10.00,
						'consumerPhone': '15914424888',
						'consumerName': '啦啦啦',
						'remark': '乌龙茶',
						'startTime': 1532345400000,
						'endTime': 1532359800000,
						'isFeeBack': 2,
						'peopleNum': 2
					}]
				}
			});
		} else {
			return res.send({
				'errCode': '000000',
				'errMsg': '成功',
				'result': {
					'pageNum': 1,
					'pageSize': 10,
					'total': 3,
					'pages': 1,
					'isFirstPage': true,
					'isLastPage': true,
					'list': [{
						'id': 195,
						'roomName': 'qwq',
						'orderId': '20180723fb3a1770',
						'buyerId': 137,
						'roomId': 8,
						'payId': null,
						'createTime': 1532344269000,
						'cancelTime': null,
						'cancelReason': null,
						'state': 8,
						'orderEvaluateId': null,
						'confirmTime': null,
						'fee': 10.00,
						'consumerPhone': '15914424888',
						'consumerName': '啦啦啦',
						'remark': '乌龙茶',
						'startTime': 1532345400000,
						'endTime': 1532359800000,
						'isFeeBack': 2,
						'peopleNum': 2
					}, {
						'id': 251,
						'roomName': 'qwq',
						'orderId': '2018080630523440',
						'buyerId': 135,
						'roomId': 10,
						'payId': null,
						'createTime': 1533563289000,
						'cancelTime': null,
						'cancelReason': null,
						'state': 8,
						'orderEvaluateId': null,
						'confirmTime': null,
						'fee': 10.00,
						'consumerPhone': '15627900292',
						'consumerName': 'ttt',
						'remark': '',
						'startTime': 1533564000000,
						'endTime': 1533567600000,
						'isFeeBack': 1,
						'peopleNum': 2
					}, {
						'id': 264,
						'roomName': 'qwq',
						'orderId': '2018081112afbfc4',
						'buyerId': 136,
						'roomId': 10,
						'payId': null,
						'createTime': 1534002019000,
						'cancelTime': null,
						'cancelReason': null,
						'state': 8,
						'orderEvaluateId': null,
						'confirmTime': null,
						'fee': 10.00,
						'consumerPhone': '13902239944',
						'consumerName': '金蓉',
						'remark': '1314520@9944@123@654',
						'startTime': 1534059000000,
						'endTime': 1534062600000,
						'isFeeBack': -1,
						'peopleNum': 2
					}]
				}
			});
		}
	},
	'POST /api/teaTable/tableStaff': (req, res) => {
		console.log('post staff');
		console.log(req.body);
		return res.send({
			'errCode': '000000',
			'errMsg': '成功',
			'result': {
				'result': '0',
				'data': [{
					'label': 'name1',
					'value': 2
				}, {
					'label': 'name2',
					'value': 3
				}, {
					'label': 'test',
					'value': 4
				}]
			}
		});
	},
	'POST /api/teaTable/tableChargeRule': (req, res) => {
		console.log('post reserveList');
		console.log(req.body);
		return res.send({
			'errCode': '000000',
			'errMsg': '成功',
			'result': {
				'result': '0',
				'data': [{
					'label': '导入',
					'value': 1
				}]
			}
		});
	}

};
