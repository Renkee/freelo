export const state = () => ({
	newPostModal: {
		state: false
	},
	removePostModal: {
		state: false,
		post: {
			title: '',
			text: '',
			patch: '',
			tags: []
		}
	}
})

export const mutations = {
	setNewPostModalState(state, bool) {
		state.newPostModal.state = bool
	},

	setRemovePostModalState(state, bool) {
		state.removePostModal.state = bool
	},
	setRemovePostModalPost(state, post) {
		state.removePostModal.post = post
	}
}

export const getters = {
	getNewPostModalState(state) {
		return state.newPostModal.state
	},

	getRemovePostModalState(state) {
		return state.removePostModal.state
	},
	getRemovePostModalPost(state) {
		return state.removePostModal.post
	}
}
