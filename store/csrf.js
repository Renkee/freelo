export const state = () => ({
	csrfToken: ''
})

export const mutations = {
	setCSRFToken(state, csrf) {
		state.csrfToken = csrf
	}
}

export const getters = {
	getCSRFToken(state) {
		return state.csrfToken
	}
}
