const getters = {
	resetSideMenu: state => state.app.resetSideMenu,
	teaHouseName: state => state.user.belongTo,
	authority: state => state.user.authority,
	wxPayState: state => state.user.wxPayState,
	aliPayState: state => state.user.aliPayState,
	defaultPage: state => state.app.defaultPage,
	appVersion: state => state.user.appVersion,
	restTime: state => state.user.restTime,
	questionnaire: state => state.user.questionnaire
};
export default getters;
