
const prodHost = 'pcstore.gzqlcd.com';		// 47.101.44.155
const devHost = 'test.pcstore.gzqlcd.com';	// 120.78.133.190

let config = {};

// 七牛云上传地址
config.qiniuUrl = process.env.NODE_ENV === 'production' ? 'https://upload-z2.qiniup.com/' : 'http://upload-z2.qiniup.com/';

// cdn地址
config.PUBLIC_CDN = config.cdnUrl = process.env.NODE_ENV === 'production' ? 'https://cdn.gzqlcd.com/' : 'http://cdn.gzqlwk.com/';
config.PRIVATE_CDN = process.env.NODE_ENV === 'production' ? 'https://privatecdn.gzqlcd.com/' : 'http://privatecdn.gzqlwk.com/';

// 图片下载前缀
export const downloadImgPrefix = config.resourceUrl = '//' + (process.env.NODE_ENV === 'production' ? prodHost : devHost);

export default config;

// 通知消息的服务器地址
let prefix = '';
if (process.env.NODE_ENV === 'production') {
	prefix = 'wss://' + prodHost;		// pcstore
} else if (process.env.NODE_ENV === 'sit') {
	prefix = 'ws://' + devHost;		// test.pcstore
} else {
	prefix = 'ws://' + devHost;
}
export const WS_1_ADRRESS = prefix + '/webSocket';

// 打印小票所需的域名前缀。
// export const PRINT_BASE_URL = process.env.NODE_ENV === 'production' ? `http://${prodHost}/` : `http://${devHost}/`;
