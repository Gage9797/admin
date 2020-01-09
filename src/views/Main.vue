<style lang="less">
@import "./main.less";
</style>

<template>
    <div class="main">
        <div class="sidebar-menu-con" style="width: 200px;overflow: auto;">
            <scroll-bar ref="scrollBar">
                <shrinkable-menu
                    :shrink="false"
                    theme="dark"
                    :before-push="beforePush"
                    :open-names="openedSubmenuArr"
                    :menu-list="menuList">
                </shrinkable-menu>
            </scroll-bar>
        </div>
        <div class="main-header-con">
            <div class="main-header">
                <div class="logo-wrapper">
                    <img src="../images/logo.png" alt="">
                </div>
                <div class="header-right">
                    <div class="header-title">
                        {{ teaHouseName }}
                    </div>
                    <div class="header-avator-con">
                        <full-screen v-model="isFullScreen"></full-screen>
                        <!-- <lock-screen></lock-screen> -->
                        <!-- <message-tip></message-tip> -->
                        <div class="user-dropdown-menu-con">
                            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                                <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                    <img
                                        src="../images/avator.jpg"
                                        alt="头像不见了"
                                        style="width: 40px; height: 40px;"
                                    />
                                    <a href="javascript:void(0)">
                                        <span style="display: inline-block; max-width: 60px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ userName }}</span>
                                        <Icon type="arrow-down-b"></Icon>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                        <DropdownItem name="loginout">退出登录</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
        </div>
		<!-- <div class="main-notice-bar">
			<notice-bar />
		</div> -->
        <div class="single-page-con" style="left: 200px;">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
		<!-- 指引动画 -->
		<instructor />

		<!-- 右下角浮窗 -->
		<!-- <div class="main-overlay">
			<questionnaire-overlay />
		</div> -->
    </div>
</template>
<script>
import scrollBar from '@/views/my-components/scroll-bar/vue-scroller-bars';
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
import tagsPageOpened from './main-components/tags-page-opened.vue';
import fullScreen from './main-components/fullscreen.vue';
import lockScreen from './main-components/lockscreen/lockscreen.vue';
import messageTip from './main-components/message-tip/index.vue';
import Instructor from './main-components/instructor';
import NoticeBar from './main-components/notice-bar/index.vue';
import QuestionnaireOverlay from './questionnaire/overlay.vue';

import Cookies from 'js-cookie';
import util from '@/libs/util.js';

export default {
	components: {
		QuestionnaireOverlay,
		NoticeBar,
		Instructor,
		shrinkableMenu,
		tagsPageOpened,
		fullScreen,
		lockScreen,
		messageTip,
		scrollBar
	},
	data () {
		return {
			userName: '',
			isFullScreen: false,
			openedSubmenuArr: this.$store.state.app.openedSubmenuArr
		};
	},
	computed: {
		menuList () {
			return this.$store.state.app.menuList; // 在左侧展示的菜单
		},
		pageTagsList () {
			return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
		},
		currentPath () {
			return this.$store.state.app.currentPath; // 当前面包屑数组
		},
		cachePage () {
			return this.$store.state.app.cachePage;
		},
		lang () {
			return this.$store.state.app.lang;
		},
		mesCount () {
			return this.$store.state.app.messageCount;
		},
		teaHouseName () {
			return this.$store.getters.teaHouseName;
		}
	},
	methods: {
		init () {
			// let pathArr = util.setCurrentPath(this, this.$route.name);
			// // this.$store.dispatch('UpdateMenulist');
			// if (pathArr.length >= 2) {
			// 	this.$store.commit('addOpenSubmenu', pathArr[1].name);
			// }
			this.userName = Cookies.get('user');
		},
		handleClickUserDropdown (name) {
			if (name === 'ownSpace') {
				util.openNewPage(this, 'ownspace_index');
				this.$router.push({
					name: 'ownspace_index'
				});
			} else if (name === 'loginout') {
				this.$store.commit('logout', this);
				this.$store.commit('clearOpenedSubmenu');
				this.$router.push({
					name: 'login'
				});
			}
		},
		checkTag (name) {
			let openpageHasTag = this.pageTagsList.some(item => {
				if (item.name === name) {
					return true;
				}
			});
			if (!openpageHasTag) {
				//  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
				util.openNewPage(
					this,
					name,
					this.$route.params || {},
					this.$route.query || {}
				);
			}
		},
		beforePush (name) {
			return true;
		},
		scrollBarResize () {
			// this.$refs.scrollBar.resize();
		}
	},
	watch: {
		// $route (to) {
		// 	this.$store.commit('setCurrentPageName', to.name);
		// 	let pathArr = util.setCurrentPath(this, to.name);
		// 	if (pathArr.length > 2) {
		// 		this.$store.commit('addOpenSubmenu', pathArr[1].name);
		// 	}
		// 	this.checkTag(to.name);
		// 	localStorage.currentPageName = to.name;
		// },
		// lang () {
		// 	util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
		// },
		openedSubmenuArr () {
			setTimeout(() => {
				this.scrollBarResize();
			}, 300);
		}
	},
	mounted () {
		this.init();
		window.addEventListener('resize', this.scrollBarResize);
		// this.$request.post('/checkUser', {}).then(res => {
		// 	console.log('res', res);
		// });
	},
	dispatch () {
		window.removeEventListener('resize', this.scrollBarResize);
	}
};
</script>
