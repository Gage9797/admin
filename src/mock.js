// 引入mockjs
const Mock = require('mockjs');

// 登录
const login = function (param) {
    param = JSON.parse(param.body) || '';//获取传过来的参数
    if (param.userName == 'lgz' && param.password == "1234") {
        return {
            code: '200',
            data: 'success',
            result: {
                userName: param.userName,
                token: 'token'
            }
        }
    }
    else {
        return {
            code: '0',
            data: 'null',
        }
    }
}
//获取用户信息
const getUserInfo = function (param) {
    param = JSON.parse(param.body) || '';//获取传过来的参数
    console.log('param', param);
        if (param.userName == 'lgz') {
        return {
            code: '200',
            data: 'success',
            result: {
                munu:'admin'
            }
        }
    }
    else {
        return {
            code: '0',
            data: 'null'
        }
    }
}
//获取用户权限
const getAuth = function (param) {
    param = JSON.parse(param.body) || '';//获取传过来的参数
    console.log('param', param);
    if (param.userName == 'lgz') {
        return {
            code: '200',
            data: 'success',
            result: {
                munu:'admin'
            }
        }
    }
    else {
        return {
            code: '0',
            data: 'null'
        }
    }
}
// Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/mk_login', 'post', login);// 登录
Mock.mock('/mk_getUserInfo', 'post', getUserInfo);// 获取用户信息
Mock.mock('/mk_getAuth', 'post', getAuth);// 获取用户权限

