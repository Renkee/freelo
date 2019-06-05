/* eslint-disable */
export const actions = {
	async nuxtServerInit({ commit, dispatch}, {req}) {
		if(req.csrfToken) {
			commit('csrf/setCSRFToken', req.csrfToken())
		}

		if (req.session && req.session.userID) {
			commit('user/setUser', { id: req.session.userID })
		}

		// Get and construct required information for website
		await dispatch('api/getCurrentPatch') // League API patch number
		await dispatch('champions/getChampionInfoFromServer')
		await dispatch('champions/getCombinedChampionInfo')
		await dispatch('items/getItemsFromRiotGamesAPI')
		await dispatch('changelog/getDataFromDB')
	},
	async nuxtClientInit({ dispatch }) {
		if(process.browser) {
			const colorPreference = await dispatch('colorscheme/checkLocalStorageForColorSchemePreference')
			if(colorPreference === 'dark') dispatch('colorscheme/toggleColorScheme')
		}
	}
}
