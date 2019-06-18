export const state = () => ({
	filterPanelEnabled: false,
	championFilters: {
		name: '',
		role: '',
		roleFilterSwitch: false
	},
	generalFilters: {
		// Blog posts
		tags: []
	}
})

export const mutations = {
	setFilterPanelEnabled(state, value) {
		state.filterPanelEnabled = value
	},
	setChampionNameFilter(state, name) {
		state.championFilters.name = name
	},
	setChampionRoleFilter(state, role) {
		state.championFilters.role = role
	},
	setChampionRoleFilterSwitch(state, bool) {
		state.championFilters.roleFilterSwitch = bool
	},
	setGeneralFiltersTags(state, tags) {
		state.generalFilters.tags = tags
	}
}

export const getters = {
	getFilterPanelState(state) {
		return state.filterPanelEnabled
	},
	getChampionNameFilter(state) {
		return state.championFilters.name
	},
	getChampionRoleFilter(state) {
		return state.championFilters.role
	},
	getChampionRoleFilterSwitch(state) {
		return state.championFilters.roleFilterSwitch
	},
	getGeneralFiltersTags(state) {
		return state.generalFilters.tags
	}
}
