import Vue from 'vue';

import QlIcon from './ql-icon.vue';
import QlInputNumber from './ql-input-number.vue';

const qlComponents = [
	QlIcon,
	QlInputNumber
];

function register () {
	qlComponents.forEach(component => {
		Vue.component(component.name, component);
	});
}

register();
