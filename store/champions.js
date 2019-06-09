/* eslint-disable */
import Vue from 'vue'

export const state = () => ({
	championInfoFromServer: [],
	combinedChampionInfo: [],
})

export const getters = {
	getInfoFromServer(state) {
		return state.championInfoFromServer
	},
	getAll(state) {
		return state.combinedChampionInfo
	},
	getFreelo(state) {
		return state.combinedChampionInfo.filter( (champion) => { return champion.freelo === true } )
	},
	getNotFreelo(state) {
		return state.combinedChampionInfo.filter( (champion) => { return champion.freelo !== true } )
	},
	getByID(state) {
		return (id) => {
			return state.combinedChampionInfo.find((champion) => {return champion.mongo_id === id})
		}
	},
	getChampionFromChampionInfoFromServerByID(state) {
		return (id) => {
			return state.championInfoFromServer.find((champion) => {return champion._id === id})
		}
	},
	getContentByIDs(state, getters) {
		return (championID, contentID) => {
			return getters['getByID'](championID).contents.find((content) => {
				return content.id === contentID
			})
		}
	},
	getByNameOrApiName(state) {
		return (name) => {
			return state.combinedChampionInfo.find((champion) => {
				return champion.name === name || champion.api_name === name
			})
		}
	}
}

export const actions = {
	async getInfoFromDB({ commit }) {
		const champions = await this.$axios.$get('api/champions')
		commit('setInfoFromDB', champions)
	},
	async processDataFromDBAndApi({ commit, rootGetters }) {
		let champions = rootGetters['champions/getInfoFromServer']
		const currentPatch = rootGetters['api/getPatch']
		let results = []

		champions = champions.sort((a, b) => {return a.api_name > b.api_name ? 1 : -1})

		const { data } = await this.$axios.$get('https://ddragon.leagueoflegends.com/cdn/' + currentPatch + '/data/en_US/champion.json')
		let championsArrayFromRiotAPI = Object.values(data)

		championsArrayFromRiotAPI = championsArrayFromRiotAPI.sort((a, b) => {return a.id > b.id ? 1 : -1})

		for(let i = 0; i < champions.length; i++) {
			results[i] = {
				mongo_id: champions[i]._id,
				type: 'champion',
				name: championsArrayFromRiotAPI[i].name,
				api_name: champions[i].api_name,
				freelo: champions[i].freelo,
				runes: champions[i].runes,
				epithet: championsArrayFromRiotAPI[i].title,
				contents: champions[i].contents,
				roles: champions[i].roles,
				power: champions[i].power,
				square: 'https://ddragon.leagueoflegends.com/cdn/' +
				currentPatch +
				'/img/champion/' +
				champions[i].api_name +
				'.png',
				splash: 'https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/' + champions[i].api_name + '_0.jpg'
			}
		}

		commit('setCombinedChampionInfo', results)
	},
	updateContentPropertyByID({commit, getters}, {championID, contentID, newContent}) {
		let oldContent = getters['getContentByIDs'](championID, contentID)
		commit('setContentPropertyByID', {oldContent, newContent})
	},
	async swapContentByIndexAndDirection({commit, getters}, {championID, _csrf, index, dir}) {
		let champion = getters['getByID'](championID)
		commit('swapContentByIndexAndDirection', {contents: champion.contents, index, dir})
		await this.$axios.$patch('api/champions/' + championID, {
			_csrf,
			swapContent: {
				index,
				dir
			}
		})
	},
	async updateContentInDB({dispatch}, {championID, _csrf, contentID, title, text, span}) {
		await this.$axios.$patch('api/champions/' + championID + '/' + contentID, {
			_csrf,
			content: {
				title,
				text,
				span
			}
		})
		await dispatch('changelog/addNewChange', {
			_csrf,
			subject: {
				type: 'champion',
				id: championID
			},
			changed_element: {
				type: 'content',
				extra: {
					id: contentID,
					title
				}
			},
			action: 'update'
		}, {root:true})
	},
	createContentWithID({commit, getters}, {championID, contentID}) {
		let champion = getters['getByID'](championID)
		commit('createContentWithID', {
			contents: champion.contents,
			newContent: {
				id: contentID,
				title: '',
				text: '',
				span: 2
			}
		})
	},
	async createContentWithIDInDB({dispatch}, {championID, _csrf, contentID, title, text, span}) {
		await this.$axios.$put('api/champions/' + championID, {
			_csrf,
			content: {
				contentID,
				title,
				text,
				span
			}
		})
		await dispatch('changelog/addNewChange', {
			_csrf,
			subject: {
				type: 'champion',
				id: championID
			},
			changed_element: {
				type: 'content',
				extra: {
					id: contentID,
					title
				}
			},
			action: 'create'
		}, {root:true})
	},
	async deleteContent({commit, getters}, {championID, contentID}) {
		let champion = getters['getByID'](championID)
		commit('deleteContent', {contents: champion.contents, contentID})
	},
	async deleteContentInDB({dispatch}, {championID, _csrf, contentID, title}) {
		await this.$axios.$delete('api/champions/' + championID, {
			data: {
				_csrf,
				contentID
			}
		})
		await dispatch('changelog/addNewChange', {
			_csrf,
			subject: {
				type: 'champion',
				id: championID
			},
			changed_element: {
				type: 'content',
				extra: {
					id: contentID,
					title
				}
			},
			action: 'remove'
		}, {root:true})
	},
	changeGeneralData({commit, getters}, {championID, toBeChanged}) {
		let champion = getters['getByID'](championID)
		commit('changeGeneralData', {champion, toBeChanged})
	},
	async changeGeneralDataInDB({dispatch}, {championID, _csrf, toBeChanged}) {
		await this.$axios.$patch('api/champions/' + championID, {_csrf, ...toBeChanged})
		Object.keys(toBeChanged).forEach(async (change) => {
			let action = 'change'
			if(change === 'freelo') {
				action = toBeChanged.freelo ? 'add' : 'remove'
			}
			await dispatch('changelog/addNewChange', {
				_csrf,
				subject: {
					type: 'champion',
					id: championID
				},
				changed_element: {
					type: change,
					extra: {
						id: null,
						title: null
					}
				},
				action
			}, {root:true})
		})
	},
	refreshForReactivity({commit, getters}, {_id, toBeChanged}) {
		let champion = getters['getChampionFromChampionInfoFromServerByID'](_id)
		commit('changeGeneralData', {champion, toBeChanged})
	}
}

export const mutations = {
	setInfoFromDB(state, champions) {
		state.championInfoFromServer = champions
	},
	setCombinedChampionInfo(state, champions) {
		state.combinedChampionInfo = champions
	},
	setContentPropertyByID(state, {oldContent, newContent}) {
		Object.keys(newContent).forEach((property) => {
			Vue.set(oldContent, property, newContent[property] )
		})
	},
	createContentWithID(state, {contents, newContent}) {
		contents.push(newContent)
	},
	swapContentByIndexAndDirection(state, {contents, index, dir}) {
		let temp = contents[index]
		contents[index] = contents[index + dir]
		Vue.set(contents, index + dir, temp)
	},
	deleteContent(state, {contents, contentID}) {
		const index = contents.findIndex((content) => {return parseInt(content.id) === parseInt(contentID)})
		contents.splice(index, 1)
	},
	changeGeneralData(state, {champion, toBeChanged}) {
		Object.keys(toBeChanged).forEach((prop) => {
			Vue.set(champion, prop, toBeChanged[prop])
		})
	}
}