import axios from 'axios';
import env from '../../build/env';
import qs from 'qs';
import Cookies from 'js-cookie';

export default {
	/**
   * 网络请求
   * @param {any} method 请求方式 get,post,delete,put,patch
   * @param {any} url 接口地址
   * @param {any} [params={}] 接口参数
   * @param {any} config 其他配置
   * @returns Promise
   */
	request (vm, method, url, params = {}, config = {
		contentType: 'application/json'
	}) {
		const baseUrl = env === 'development'
			? '/api'
			: env === 'production'
				? ''
				: '';

		let newParams = {};
		for (let key in params) {
			if (params[key] !== '') {
				newParams[key] = params[key];
			}
		}
		if (config.contentType != 'application/json') {
			newParams = qs.stringify(newParams);
		}
		let token = Cookies.get('token');

		let headers = {
			'Content-Type': config.contentType
		};
		if (token) {
			headers.token = encodeURIComponent(token);
			headers.id = 1;
		}
		let axiosConfig = {
			method: method,
			url: baseUrl + url,
			headers,
			data: newParams
		};
		return new Promise(function (resolve, reject) {
			axios.request(axiosConfig).then(function (response) {
				// console.log('url:',url,axiosConfig,response);
				if (response.data.errCode === 'TEA00000046' || response.data.errCode === 'TEA00003021') {
					Cookies.set('user', '');
					Cookies.set('token', '');
					vm.$router.push({ name: 'login' });
					// vm.$Message.error({
					// 	content: '[' + response.data.errCode + ']' + response.data.errMsg
					// });
				} else {
					resolve(response);
				}
			}).catch(function (error) {
				reject(error);
			});
		});
	}

};
