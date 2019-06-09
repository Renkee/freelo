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
		const { data } = await this.$axios.$get(
			'http://ddragon.leagueoflegends.com/cdn/' + currentPatch + '/data/en_US/item.json'
		)
		const items = Object.values(data).map(item => {
			return {
				type: 'item',
				name: item.name,
				image: 'https://ddragon.leagueoflegends.com/cdn/' + currentPatch + '/img/item/' + item.image.full
			}
		})
		commit('set', items)
	}
}

export const mutations = {
	set(state, items) {
		state.items = items
	}
}
