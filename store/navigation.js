export const state = () => ({
	panelState: false
})

export const getters = {
	getPanelState(state) {
		return state.panelState
	}
}

export const mutations = {
	setPanelState(state, val) {
		state.panelState = val
	}
}
