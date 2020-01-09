
function _getEle (selector, parent = document) {
	return parent.querySelector(selector);
}
function _getEleHeight (ele) {
	return ele ? ele.getBoundingClientRect().height : 0;
}
/**
 *
 * @param {string} rootSelector i-table selecotr， eg：#my-test-table
 * @param {int} totalHeight
 */
export function resetTableHeight (rootSelector, totalHeight) {
	const table = _getEle(rootSelector);
	const tableHeader = _getEle('.ivu-table-header', table);
	const tableBody = _getEle('.ivu-table-body', table);
	const tableFooter = _getEle('.ivu-table-footer', table);

	const bodyHeight = totalHeight - _getEleHeight(tableHeader) - _getEleHeight(tableFooter);
	tableBody.style.height = bodyHeight + 'px';
}

/**
 * 向下寻找单个子组件
 * @param {*} ctx
 * @param {*} componentName
 */
export function findComponentDownward (ctx, componentName) {
	const ctxChildren = ctx.children;
	let children = null;

	if (ctxChildren.length) {
		for (const child of ctxChildren) {
			if (child.$options.name === componentName) {
				children = child;
				break;
			} else {
				children = findComponentDownward(child, componentName);
				if (children) {
					break;
				}
			}
		}
	}

	return children;
}

/**
 * 向下寻找多个子组件
 * @param {*} cxt
 * @param {*} componentName
 */
export function findComponentsDownward (cxt, componentName) {
	return cxt.$children.reduce((components, child) => {
		if (child.$options.name === componentName) {
			components.push(child);
		}
		const foundChildren = findComponentsDownward(child, componentName);
		return components.concat(foundChildren);
	}, []);
}

/**
 * 千分位 价格 格式化
 */
export function formatPrice (num) {
	const numType = typeof num;
	if ((numType !== 'number') && (numType !== 'string')) {
		// throw new TypeError('can only format number or number string');
		return '';
	}
	if (num === '') {
		return '';
	}
	let [INTEGER, FLOAT] = parseFloat(num).toFixed(2).split('.');
	INTEGER = INTEGER.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
	return INTEGER + '.' + FLOAT;
}

// reg
export const phoneReg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
export const idCardReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
export const passportReg = /^1[45][0-9]{7}$|([P|p|S|s]\d{7}$)|([S|s|G|g|E|e]\d{8}$)|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8}$)|([H|h|M|m]\d{8,10})$/;
export const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
