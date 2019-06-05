/* eslint-disable */
export const actions = {
	async nuxtServerInit({ commit, dispatch}, {req}) {
		if(req.csrfToken) {
			commit('csrf/setToken', req.csrfToken())
		}

		if (req.session && req.session.userID) {
			commit('user/set', { id: req.session.userID })
		}

		// Get and construct required information for website
		await dispatch('api/getCurrentPatch') // League API patch number
		await dispatch('champions/getInfoFromDB')
		await dispatch('champions/processDataFromDBAndApi') // Combine DB data with Riot API data
		await dispatch('items/getFromRiotGamesAPI')
		await dispatch('changelog/getDataFromDB')
	},
	async nuxtClientInit({ dispatch }) {
		if(process.browser) {
			const colorPreference = await dispatch('colorscheme/checkLocalStorageForPreference')
			if(colorPreference === 'dark') dispatch('colorscheme/toggle')
		}
	}
}
