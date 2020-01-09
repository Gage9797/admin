/*
 * @Author: yoto
 * @Desc 打印商品售出方法封装
 * @Date: 2019-10-31 15:32:13
 * @Last Modified by: yoto
 * @Last Modified time: 2019-10-31 15:32:13
 */

import { setPrintData } from './storage/print';

export default (data) => {
	setPrintData(data);
	const url = location.href.split('#/')[0] + '#/print?isGoodsSell=y';
	const win = window.open(url, 'printwindow', 'resizable');
};
