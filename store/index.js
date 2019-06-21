/* eslint-disable */
export const actions = {
	async nuxtServerInit({ commit, dispatch}, {req}) {

		if(req.csrfToken) {
			commit('csrf/setToken', req.csrfToken())
		}

		if (req.session && req.session.userID && req.session.userEmail) {
			commit('user/set', { id: req.session.userID, email: req.session.userEmail })
		}

		// Get and construct required information for website
		await dispatch('api/getCurrentPatch') // League API patch number
		await dispatch('champions/getInfoFromDB')
		await dispatch('champions/processDataFromDBAndApi') // Combine DB data with Riot API data
		await dispatch('posts/getDataFromDB')
		await dispatch('items/getFromRiotGamesAPI')
		await dispatch('runes/getFromRiotGamesAPI')
		await dispatch('changelog/getDataFromDB')
	},
	async nuxtClientInit({ dispatch }) {
		if(process.browser) {
			const colorPreference = await dispatch('colorscheme/checkLocalStorageForPreference')
			if(colorPreference === 'dark') dispatch('colorscheme/toggle')
		}
	}
}
