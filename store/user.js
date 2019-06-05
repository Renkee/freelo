export const state = () => ({
	user: {
		id: null
	}
})

export const mutations = {
	set(state, user) {
		state.user = user
	}
}

export const getters = {
	get(state) {
		return state.user
	}
}

export const actions = {
	async login({ commit }, { email, password, _csrf }) {
		try {
			const data = await this.$axios.$post('/api/auth/login', { email, password, _csrf })
			commit('set', data)
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
			commit('set', { id: null })
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
