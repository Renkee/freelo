export const state = () => ({
	championFilters: {
		name: '',
		role: '',
		roleFilterSwitch: false
	}
})

export const mutations = {
	setChampionNameFilter(state, name) {
		state.championFilters.name = name
	},
	setChampionRoleFilter(state, role) {
		state.championFilters.role = role
	},
	setChampionRoleFilterSwitch(state, bool) {
		state.championFilters.roleFilterSwitch = bool
	}
}

export const getters = {
	getChampionNameFilter(state) {
		return state.championFilters.name
	},
	getChampionRoleFilter(state) {
		return state.championFilters.role
	},
	getChampionRoleFilterSwitch(state) {
		return state.championFilters.roleFilterSwitch
	}
}
