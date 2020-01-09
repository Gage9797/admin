/**
 * @Author: aka
 * @Date: 2018-0110 13:25:01
 */
class PrintPartial {
	constructor (dom, title = '') {
		if (!dom) {
			return null;
		}
		this.title = title;
		this.dom = dom;
		this.iframeDom = null;
		this.iframeDocs = null;
		this.iframeWin = null;

		this.init();
	}

	init () {
		let copyDom = document.createElement('span');
		const styleDom = document.querySelectorAll('style');
		const titleDom = document.createElement('title');
		titleDom.innerText = this.title;

		copyDom.appendChild(titleDom);
		Array.from(styleDom).forEach(item => {
			copyDom.appendChild(item.cloneNode(true));
		});
		copyDom.appendChild(this.dom.cloneNode(true));

		const htmlTemp = copyDom.innerHTML;
		copyDom = null;

		this.iframeDom = document.createElement('iframe');
		const attrObj = {
			height: 0,
			width: 0,
			border: 0,
			wmode: 'Opaque'
		};
		const styleObj = {
			position: 'absolute',
			top: '-999px',
			left: '-999px'
		};
		Object.entries(attrObj).forEach(([key, value]) => this.iframeDom.setAttribute(key, value));
		Object.entries(styleObj).forEach(([key, value]) => this.iframeDom.style[key] = value);
		document.body.insertBefore(this.iframeDom, document.body.children[0]);
		this.iframeWin = this.iframeDom.contentWindow;
		this.iframeDocs = this.iframeWin.document;
		this.iframeDocs.write('<!doctype html>');
		this.iframeDocs.write(htmlTemp);
	}

	print () {
		if (!this.iframeDom) {
			this.init();
		}
		this.iframeWin.focus();
		this.iframeWin.print();

		this.destroy();
	}

	destroy () {
		document.body.removeChild(this.iframeDom);
		this.iframeDocs = null;
		this.iframeDom = null;
		this.iframeWin = null;
	}
}

export default PrintPartial;
