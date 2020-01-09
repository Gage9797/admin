module.exports = {
	'POST /api/teaTable/getTableList': (req, res) => {
		return res.send({
			'errCode': '000000',
			'errMsg': '成功',
			'result': {
				'teaTableList': [{
					'usingTime': 1535621955000,
					'price': 1024.00,
					'name': 'A425座',
					'orderKeyId': 90,
					'id': 1
				}, {
					'usingTime': 1535628566000,
					'price': 1024.00,
					'orderKeyId': 91,
					'name': 'A426座',
					'id': 2
				}],
				'roomList': [{
					'usingTime': 1535631783000,
					'price': 111.00,
					'name': '啦啦啦包间',
					'orderKeyId': 12,
					'id': 15
				}, {
					'reserveStartTime': 1532953800000,
					'reserveId': 153,
					'name': '不要加班包间',
					'id': 19,
					'consumerName': '金蓉'
				}, {
					'name': '12布朗山',
					'id': 20
				}],
				'chargeRule': {
					'room': [{
						'label': 0.01,
						'value': 15
					}, {
						'label': 0.01,
						'value': 19
					}, {
						'label': 1000.00,
						'value': 20
					}],
					'table': [{
						'label': '计费规则2',
						'value': 1
					}, {
						'label': '计费规则1',
						'value': 3
					}, {
						'label': '计费规则3',
						'value': 4
					}]
				},
				'staff': [{
					'label': '我是小茶妹',
					'value': 1
				}]
			}
		});
	},
	'POST /api/teaTable/setTableBegin': (req, res) => {
		console.log('post setTableBegin: ');
		console.log(req.body);

		return res.send({
			'errCode': '000000',
			'errMsg': '成功',
			'result': '0'
		});
	},
	'POST /api/reserveManage/reserveBuild': (req, res) => {
		console.log('post reserveBuild');
		console.log(req.body);
		return res.send({
			'errCode': '000000',
			'errMsg': '成功',
			'result': {
				'result': 0
			}
		});
	}
};
