/*
 * @Author: yoto
 * @Company: 麒龙网科
 * @Date: 2019-03-05 16:01:37
 * @Last Modified by: yoto
 * @Last Modified time: 2019-06-17 17:30:01
 */

import Cookie from 'js-cookie';

// websocket default config
const DETAULT_CONFIG = {
	// address: 'ws://120.78.133.190:80/TeaHouse/webSocket',
	address: 'ws://47.112.133.38:80/TeaHouse/webSocket',
	ping: 0,
	pong: 0,
	pingTimeout: 5000,
	pongTimeout: 5000,
	maxCountReconnnet: 5,
	debug: false
};

window.arr = [];

class Clinet {
	constructor (option = {}) {
		this.config = Object.assign(DETAULT_CONFIG, option);
		this.reconnectFlag = true;
		this.stub = {};
		this.init();
	}

	get readyState () {
		return this.client.readyState;
	}

	set debug (flag) {
		this.config.debug = !!flag;
	}

	init () {
		this.client = new WebSocket(this.config.address);
		this.client.onopen = (e) => {
			// 在连接上的时候将自己的token发回后台，以读取用户id、teaHouseId。
			this.heartBeat();
			this.send({
				type: 'open',
				message: {
					phone: Cookie.get('phone'),
					token: Cookie.get('token')
				}
			});
			this.dispatch('open', '');
		};

		this.client.onmessage = (e) => {
			// 只要有消息就算有心跳了。
			this.heartBeat();
			// 业务消息
			if (e.data) {
				try {
					const data = JSON.parse(e.data);
					if (data.type === 'data') {
						this.dispatch('data', JSON.parse(data.message));
					}
				} catch (e) {
					console.error(e.message);
				}
			}
		};

		this.client.onclose = (e) => {
			if (this.reconnectFlag && this.config.maxCountReconnnet > 0) {
				// 意外断掉
				this.reconnect();
			} else {
				// 手动断掉
				this.dispatch('close', '');
			}
		};
	}

	reconnect () {
		if (this.config.maxCountReconnnet > 0) {
			this.config.maxCountReconnnet--;
			this.init();
		} else {
			this.reconnectFlag = false;
		}
	}

	heartBeat () {
		clearTimeout(this.pingTimeoutId);
		clearTimeout(this.pongTimeoutId);
		this.ping();
	}

	ping () {
		const { ping, pingTimeout, pongTimeout } = this.config;
		this.pingTimeoutId = setTimeout(() => {
			if (this.config.debug) {
				console.log('ping: ' + ping);
			}
			this.send({
				type: 'ping',
				message: {
					ping
				}
			});
			this.pongTimeoutId = setTimeout(() => {
				// 发送ping信息之后，若设定时间内没有返回任何信息，则判断为断开了连接。
				this.reconnect();
			}, pongTimeout);
		}, pingTimeout);
	}

	on (name, func) {
		if (!this.stub[name]) {
			this.stub[name] = [];
		}
		this.stub[name].push(func);
	}

	dispatch (name, data) {
		if (this.stub[name]) {
			this.stub[name].forEach(func => func(data));
		}
	}

	send (msg) {
		if (this.readyState !== 1) {
			throw new Error('client is on CLOSEING or CLOSED!');
		}
		if (typeof msg !== 'string') {
			msg = JSON.stringify(msg);
		}
		this.client.send(msg);
	}

	close () {
		clearTimeout(this.pingTimeoutId);
		this.reconnectFlag = false;
		this.client.close();
	}
}

export default Clinet;
