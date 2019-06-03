import Vue from 'vue'
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

export const actions = {
	toggleColorScheme({ commit, getters }) {
		!getters.getColorScheme
			? (Vue.prototype.$vuetify.theme.primary = '#4DB6AC')
			: (Vue.prototype.$vuetify.theme.primary = '#3F51B5')
		commit('toggleColorScheme')
	},
	checkLocalStorageForColorSchemePreference() {
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
	changeColorSchemePreferenceInLocalStorage(context, preference) {
		if (process.browser) {
			if (window.localStorage) {
				window.localStorage.setItem('colorScheme', preference)
			}
		}
	}
}
