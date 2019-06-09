export const state = () => ({
	runes: []
})

export const getters = {
	get(state) {
		return state.runes
	}
}

export const actions = {
	async getFromRiotGamesAPI({ commit, rootGetters }) {
		const currentPatch = rootGetters['api/getPatch']
		const response = await this.$axios.$get(
			'http://ddragon.leagueoflegends.com/cdn/' + currentPatch + '/data/en_US/runesReforged.json'
		)
		// This code is just multiple flatmaps, but node version isn't high enough for flatMap so had to replace them with reduce+concat
		const runes = response.reduce(
			(acc, tree) =>
				acc.concat(
					tree.slots.reduce(
						(acc1, bef) =>
							acc1.concat(
								bef.runes.reduce(
									(acc2, rune) =>
										acc2.concat({
											name: rune.name,
											type: 'rune',
											icon: 'https://ddragon.leagueoflegends.com/cdn/img/' + rune.icon
										}),
									[]
								)
							),
						[]
					)
				),
			[]
		)
		commit('set', runes)
	}
}

export const mutations = {
	set(state, runes) {
		state.runes = runes
	}
}
