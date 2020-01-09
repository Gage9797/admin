const phone = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
const tele = /^(\d{3,4}-)?\d{7,8}$/;
const email = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
const idCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

/**
 * @param {string} text 用户输入的字符串 必选
 * @returns {bool} true | false
 */
let isEmpty = text => {
	let str = text.trim();
	if (str.length < 1) {
		return true;
	}
	return false;
};

/**
 * @param {string} text 用户输入的字符串 必选
 * @returns {bool} true | false
 */
let isPhone = text => {
	if (isEmpty(text)) {
		return false;
	}
	return phone.test(text);
};

/**
 *
 * @param {*} text 固话
 */
let isTele = text => {
	return tele.test(text);
};

/**
 * @param {string} text 用户输入的字符串 必选
 * @returns {bool} true | false
 */
let isEmail = text => {
	if (isEmpty(text)) {
		return false;
	}
	return email.test(text);
};

/**
 * @param {string} text 用户输入的字符串 必选
 * @returns {bool} true | false
 */
let isIdCard = text => {
	if (isEmpty(text)) {
		return false;
	}
	return idCard.test(text);
};

module.exports = {
	isTele,
	isPhone,
	isEmail,
	isIdCard,
	isEmpty
};
