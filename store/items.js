export const state = () => ({
	items: []
})

export const getters = {
	get(state) {
		return state.items
	}
}

export const actions = {
	async getFromRiotGamesAPI({ commit, rootGetters }) {
		const currentPatch = rootGetters['api/getPatch']
		const items = await this.$axios.$get('http://ddragon.leagueoflegends.com/cdn/' + currentPatch + '/data/en_US/item.json')
		commit('set', Object.values(items.data))
	}
}

export const mutations = {
	set(state, items) {
		state.items = items
	}
}
