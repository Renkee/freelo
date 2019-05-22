/* eslint-disable */
export const actions = {
	async nuxtServerInit({ dispatch }) {
		// Get and construct required information for website
		await dispatch('api/getCurrentPatch') // League API patch number
		await dispatch('champions/getChampionInfoFromServer')
		await dispatch('champions/getCombinedChampionInfo')
		await dispatch('items/getItemsFromRiotGamesAPI')

	}
}
