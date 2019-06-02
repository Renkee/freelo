export const state = () => ({
	user: {
		id: null
	}
})

export const mutations = {
	setUser(state, user) {
		state.user = user
	}
}

export const getters = {
	getUser(state) {
		return state.user
	}
}

export const actions = {
	async login({ commit }, { email, password, _csrf }) {
		try {
			const data = await this.$axios.$post('/api/auth/login', { email, password, _csrf })
			commit('setUser', data)
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401 || error.response.status === 400) {
					throw new Error(error.response.data.message)
				}
			}
			throw error
		}
	},
	async register(context, { email, password, _csrf }) {
		try {
			await this.$axios.$post('/api/auth/register', { email, password, _csrf })
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401 || error.response.status === 400) {
					throw new Error(error.response.data.message)
				}
			}
			throw error
		}
	},

	async logout({ commit }, { _csrf }) {
		try {
			await this.$axios.$post('/api/auth/logout', { _csrf })
			commit('setUser', { id: null })
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401 || error.response.status === 400) {
					throw new Error(error.response.data.message)
				}
			}
			throw error
		}
	}
}
