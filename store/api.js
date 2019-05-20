export const state = () => ({
	patch: null
})

export const mutations = {
	setPatch(state, patch) {
		state.patch = patch
	}
}

export const getters = {
	getPatch(state) {
		return state.patch
	}
}

export const actions = {
	async getCurrentPatch({ commit }) {
		const response = await this.$axios.$get('https://ddragon.leagueoflegends.com/realms/na.json')
		await commit('setPatch', response.v)
	}
}
