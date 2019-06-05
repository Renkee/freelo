import Vue from 'vue'
export const state = () => ({
	colorScheme: false
})

export const mutations = {
	toggle(state) {
		state.colorScheme = !state.colorScheme
	}
}

export const getters = {
	get(state) {
		return state.colorScheme
	}
}

export const actions = {
	toggle({ commit, getters }) {
		!getters.get ? (Vue.prototype.$vuetify.theme.primary = '#4DB6AC') : (Vue.prototype.$vuetify.theme.primary = '#3F51B5')
		commit('toggle')
	},
	checkLocalStorageForPreference() {
		if (process.browser) {
			if (window.localStorage) {
				const preference = window.localStorage.getItem('colorScheme')
				if (!preference) {
					window.localStorage.setItem('colorScheme', 'light')
					return 'light'
				} else {
					return preference
				}
			}
		}
	},
	changePreferenceInLocalStorage(context, preference) {
		if (process.browser) {
			if (window.localStorage) {
				window.localStorage.setItem('colorScheme', preference)
			}
		}
	}
}
