import iView from 'iview';
import axios from 'axios';
import qs from 'qs';
import Cookies from 'js-cookie';
import { router } from '../router/index';
import env from '../../build/env';

const baseUrl = env === 'development'
	? '/api'
	: env === 'production'
		? ''
		: '';

const axiosInstance = axios.create({
	baseURL: baseUrl,
	timeout: 5000
});

axiosInstance.interceptors.request.use(
	config => {
		const token = Cookies.get('token');
		if (token) {
			config.headers = {'Authorization': encodeURIComponent(token)};
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

axiosInstance.interceptors.response.use(
	res => {
		if (res.code === '0') {
			Cookies.set('user', '');
			Cookies.set('token', '');
			router.push({ name: 'login' });
			// iView.Message.error({
			// 	content: '[' + res.data.errCode + ']' + res.data.errMsg
			// });
			return Promise.reject(res.data.errMsg);
		}
		return res;
	},
	error => {
		// error.response.status === 403 等该如何处理？
		return Promise.reject(error);
	}
);

// export const request = (url, method = 'GET', params = {}, config = {contentType: 'application/json'}) => {
// 	let newParams = {};
// 	for (let key in params) {
// 		if (params[key] !== '') {
// 			newParams[key] = params[key];
// 		}
// 	}
// 	if (config.contentType !== 'application/json') {
// 		newParams = qs.stringify(newParams);
// 	}

// 	let headers = {
// 		'Content-Type': config.contentType
// 	};
export const request = (url, method, param) => {
	let axiosConfig = {
		method: method,
		url: url,
		headers: {'Content-Type': 'application/json'},
		data: param
	};
	return new Promise((resolve, reject) => {
		axiosInstance.request(axiosConfig)
			.then(res => {
				resolve(res.data);
			})
			.catch(err => {
				reject(err);
			});
	});
};

export const get = (url, params) => {
	return request(url, 'GET', params);
};

export const post = (url, params) => {
	return request(url, 'POST', params);
};

request.get = get;
request.post = post;

export default {
	install: (Vue, options) => {
		Vue.prototype.$request = request;
	}
};
