import Vue from 'vue'
export const state = () => ({
	posts: []
})

export const mutations = {
	set(state, posts) {
		state.posts = posts
	},
	addNew(state, post) {
		state.posts.push(post)
	},
	updateByID(state, { post, payload }) {
		Object.keys(payload).forEach(property => {
			Vue.set(post, property, payload[property])
		})
	},
	removeByID(state, id) {
		Vue.set(
			state,
			'posts',
			state.posts.filter(post => {
				return post._id !== id
			})
		)
	}
}

export const getters = {
	get(state) {
		return state.posts
	},
	getByID(state) {
		return id => {
			return state.posts.find(post => {
				return post._id === id
			})
		}
	}
}

export const actions = {
	async getDataFromDB({ commit }) {
		const posts = await this.$axios.$get('api/posts')
		commit('set', posts)
	},
	createInLocal({ commit }, payload) {
		commit('addNew', { updatedAt: new Date(), ...payload })
	},
	async createInDB(context, payload) {
		try {
			const response = await this.$axios.$put('api/posts', payload)
			return response.postID
		} catch (err) {
			console.log(err) //eslint-disable-line
		}
	},
	updateInLocal({ commit, getters }, payload) {
		const post = getters.getByID(payload._id)
		commit('updateByID', { post, payload: { updatedAt: new Date(), ...payload } })
	},
	async updateInDB(context, payload) {
		try {
			await this.$axios.$patch('api/posts/' + payload._id, payload)
		} catch (err) {
			console.log(err) //eslint-disable-line
		}
	},
	deleteInLocal({ commit }, postID) {
		commit('removeByID', postID)
	},
	deleteInDB(context, { postID, _csrf }) {
		try {
			this.$axios.$delete('api/posts/' + postID, {
				data: {
					_csrf
				}
			})
		} catch (err) {
			console.log(err) //eslint-disable-line
		}
	}
}
