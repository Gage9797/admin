/*
 * @Author: yoto
 * @Desc 打印订单所需数据
 * @Date: 2019-10-31 15:29:22
 * @Last Modified by: yoto
 * @Last Modified time: 2019-10-31 15:53:35
 */

const Storage = window.localStorage;

const KEY_PRINT_DATA = 'printData';

export const setPrintData = (data) => {
	Storage.setItem(KEY_PRINT_DATA, JSON.stringify(data));
};

export const getPrintData = () => {
	return JSON.parse(Storage.getItem(KEY_PRINT_DATA));
};

export const removePrintData = () => {
	Storage.removeItem(KEY_PRINT_DATA);
};
