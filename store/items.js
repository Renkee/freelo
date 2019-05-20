export const state = () => ({
	items: []
})

export const getters = {
	getItems(state) {
		return state.items
	}
}

export const actions = {
	async getItemsFromRiotGamesAPI({ commit, rootGetters }) {
		const currentPatch = rootGetters['api/getPatch']
		const items = await this.$axios.$get('http://ddragon.leagueoflegends.com/cdn/' + currentPatch + '/data/en_US/item.json')
		commit('setItems', Object.values(items.data))
	}
}

export const mutations = {
	setItems(state, items) {
		state.items = items
	}
}
