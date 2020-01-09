const test = require('./test');
const seatRoom = require('./seat-room');
const booking = require('./booking');
const index = require('./order');
const questionnaire = require('./questionnaire');

const apiList = [
	test,
	questionnaire
];

const proxy = {};

apiList.forEach(ele => {
	Object.assign(proxy, ele);
});

module.exports = proxy;
