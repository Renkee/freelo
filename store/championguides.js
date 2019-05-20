import Vue from 'vue'

export const state = () => ({
	contentEdited: [],
	contentCreated: []
})

export const mutations = {
	setContentEdited(state, contentEdited) {
		state.contentEdited = contentEdited
	},
	setContentCreated(state, contentCreated) {
		state.contentCreated = contentCreated
	},
	pushContentEdited(state, contentToPush) {
		state.contentEdited.push(contentToPush)
	},
	pushContentCreated(state, contentToPush) {
		state.contentCreated.push(contentToPush)
	},
	removeItemByIdFromContentEdited(state, id) {
		state.contentEdited = state.contentEdited.filter(content => {
			return content.id !== id
		})
	},
	removeItemByIdFromContentCreated(state, id) {
		state.contentCreated = state.contentCreated.filter(content => {
			return content.id !== id
		})
	},
	setPropertyOnContentEdited(state, { content, newContent }) {
		Object.keys(newContent).forEach(property => {
			Vue.set(content, property, newContent[property])
		})
	},
	setPropertyOnContentCreated(state, { content, newContent }) {
		Object.keys(newContent).forEach(property => {
			Vue.set(content, property, newContent[property])
		})
	}
}

export const getters = {
	getContentEdited(state) {
		return state.contentEdited
	},
	getContentCreated(state) {
		return state.contentCreated
	}
}

export const actions = {
	changePropsOnContentEditedStateWhileEditByID({ commit, getters }, { contentID, newContent }) {
		const content = getters.getContentEdited.find(content => {
			return content.id === contentID
		}).stateWhileEdit
		commit('setPropertyOnContentEdited', { content, newContent })
	},
	changePropsOnContentCreatedStateWhileEditByID({ commit, getters }, { contentID, newContent }) {
		const content = getters.getContentCreated.find(content => {
			return content.id === contentID
		}).stateWhileEdit
		commit('setPropertyOnContentCreated', { content, newContent })
	}
}
