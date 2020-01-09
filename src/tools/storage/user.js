import Cookies from 'js-cookie';

const KEY_USER_NAME = 'ql-admin-user-name';

const KEY_TEA_HOUSE_NAME = 'ql-admin-tea-house-name';

export function setUsername (name) {
	Cookies.set(KEY_USER_NAME, name);
}

export function getUserName () {
	Cookies.get(KEY_USER_NAME);
}

export function removeUsername () {
	Cookies.remove(KEY_USER_NAME);
}

export function setTeaHouseName (name) {
	Cookies.set(KEY_TEA_HOUSE_NAME, name);
}

export function getTeaHouseName () {
	Cookies.get(KEY_TEA_HOUSE_NAME);
}

export function removeTeaHouseName () {
	Cookies.remove(KEY_TEA_HOUSE_NAME);
}
