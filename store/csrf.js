export const state = () => ({
	csrfToken: ''
})

export const mutations = {
	setToken(state, csrf) {
		state.csrfToken = csrf
	}
}

export const getters = {
	getToken(state) {
		return state.csrfToken
	}
}
