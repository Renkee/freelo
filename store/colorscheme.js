export const state = () => ({
	colorScheme: false
})

export const mutations = {
	toggleColorScheme(state) {
		state.colorScheme = !state.colorScheme
	}
}

export const getters = {
	getColorScheme(state) {
		return state.colorScheme
	}
}
/*
export const actions = {
} */
