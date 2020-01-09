<template>
    <div id='main' class='app-main'>
        <router-view></router-view>
    </div>
</template>

<script>
    import {appRouter} from './router/router';

    export default {
    	data () {
    		return {
    			currentPageName: ''
    		};
    	},
    	mounted () {
    		this.currentPageName = this.$route.name;
    		// 显示打开的页面的列表
    		this.$store.commit('setOpenedList');
    		this.$store.commit('initCachepage');
    		// 本来是iview admin用来检查软件更新的，可以留着用来以后推送我们相关的消息
    		this.$util.checkUpdate(this);
    	},
    	created () {
    		let tagsList = [];
    		appRouter.map((item) => {
    			if (item.children.length <= 1) {
    				tagsList.push(item.children[0]);
    			} else {
    				tagsList.push(...item.children);
    			}
		});
		this.$store.commit('setTagsList', tagsList);
		// 在页面加载时读取sessionStorage里的状态信息
		if (sessionStorage.getItem('store')) {
			this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))));
			sessionStorage.removeItem('store');
		};
		// 在页面刷新时将vuex里的信息保存到sessionStorage里
		window.addEventListener('beforeunload', () => {
			sessionStorage.setItem('store', JSON.stringify(this.$store.state));
		});
	}
};
</script>

<style>
html,body{
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: auto;
}
.app-main{
    width: 100%;
	height: 100%;
}
</style>
