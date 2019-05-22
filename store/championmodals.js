export const state = () => ({
	newChampionModal: {
		state: false
	},
	removeChampionModal: {
		state: false,
		champion: {
			name: 'Aatrox' // Default value to prevent errors
		}
	}
})

export const mutations = {
	setNewChampionModalState(state, bool) {
		state.newChampionModal.state = bool
	},

	setRemoveChampionModalState(state, bool) {
		state.removeChampionModal.state = bool
	},

	setRemoveChampionModalChampion(state, champion) {
		state.removeChampionModal.champion = champion
	}
}

export const getters = {
	getNewChampionModalState(state) {
		return state.newChampionModal.state
	},

	getRemoveChampionModalState(state) {
		return state.removeChampionModal.state
	},

	getRemoveChampionModalChampion(state) {
		return state.removeChampionModal.champion
	}
}
