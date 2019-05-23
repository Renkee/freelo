/* eslint-disable */
import Vue from 'vue'

export const state = () => ({
	championInfoFromServer: [],
	combinedChampionInfo: [],
	freeloChampions: [],
	notFreeloChampions: []
})

export const getters = {
	getChampionInfoFromServer(state) {
		return state.championInfoFromServer
	},
	getAllChampions(state) {
		return state.combinedChampionInfo
	},
	getFreeloChampions(state) {
		return state.combinedChampionInfo.filter( (champion) => { return champion.freelo === true } )
	},
	getNotFreeloChampions(state) {
		return state.combinedChampionInfo.filter( (champion) => { return champion.freelo !== true } )
	},
	getChampionByID(state) {
		return (id) => {
			return state.combinedChampionInfo.find((champion) => {return champion.mongo_id === id})
		}
	},
	getChampionFromChampionInfoFromServerByID(state) {
		return (id) => {
			return state.championInfoFromServer.find((champion) => {return champion._id === id})
		}
	},
	getChampionContentByIDs(state, getters) {
		return (championID, contentID) => {
			return getters['getChampionByID'](championID).contents.find((content) => {
				return content.id === contentID
			})
		}
	},
	getChampionByNameOrApiName(state) {
		return (name) => {
			return state.combinedChampionInfo.find((champion) => {
				return champion.name === name || champion.api_name === name
			})
		}
	}
}

export const actions = {
	async getChampionInfoFromServer({ commit }) {
		const champions = await this.$axios.$get('api/champions')
		commit('setChampionInfoFromServer', champions)
	},
	async getCombinedChampionInfo({ commit, rootGetters }) {
		let champions = rootGetters['champions/getChampionInfoFromServer']
		const currentPatch = rootGetters['api/getPatch']
		let results = []

		champions = champions.sort((a, b) => {return a.api_name > b.api_name ? 1 : -1})

		const { data } = await this.$axios.$get('https://ddragon.leagueoflegends.com/cdn/' + currentPatch + '/data/en_US/champion.json')
		let championsArrayFromRiotAPI = Object.values(data)

		championsArrayFromRiotAPI = championsArrayFromRiotAPI.sort((a, b) => {return a.id > b.id ? 1 : -1})

		for(let i = 0; i < champions.length; i++) {
			results[i] = {
				mongo_id: champions[i]._id,
				name: championsArrayFromRiotAPI[i].name,
				api_name: champions[i].api_name,
				freelo: champions[i].freelo,
				runes: champions[i].runes,
				epithet: championsArrayFromRiotAPI[i].title,
				contents: champions[i].contents,
				roles: champions[i].roles,
				power: champions[i].power,
				splash: 'https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/' + champions[i].api_name + '_0.jpg'
			}
		}

		commit('setCombinedChampionInfo', results)
	},
	updateContentPropertyOfChampionByID({commit, getters}, {championID, contentID, newContent}) {
		let oldContent = getters['getChampionContentByIDs'](championID, contentID)
		commit('setContentPropertyOfChampionByID', {oldContent, newContent})
	},
	async swapContentOfChampionByIndexAndDirection({commit, getters}, {_id, index, dir}) {
		let champion = getters['getChampionByID'](_id)
		commit('swapContentOfChampionByIndexAndDirection', {contents: champion.contents, index, dir})
		await this.$axios.$patch('api/champions/' + _id, {
			swapContent: {
				index,
				dir
			}
		})
	},
	async updateChampionContentInDatabase(context, {_id, contentID, title, text, span}) {
		await this.$axios.$patch('api/champions/' + _id + '/' + contentID, {
			content: {
				title,
				text,
				span
			}
		})
	},
	createContentOfChampionWithID({commit, getters}, {_id, contentID}) {
		let champion = getters['getChampionByID'](_id)
		commit('createContentOfChampionWithID', {
			contents: champion.contents,
			newContent: {
				id: contentID,
				title: '',
				text: '',
				span: 2
			}
		})
	},
	async createContentOfChampionWithIDInDatabase({getters}, {_id, contentID, title, text, span}) {
		await this.$axios.$put('api/champions/' + _id, {
			content: {
				contentID,
				title,
				text,
				span
			}
		})
	},
	async deleteContentInChampion({commit, getters}, {_id, contentID}) {
		let champion = getters['getChampionByID'](_id)
		commit('deleteContentInChampion', {contents: champion.contents, contentID})
		await this.$axios.$delete('api/champions/' + _id, {
			data: {
				contentID
			}
		})
	},
	changeGeneralChampionData({commit, getters}, {_id, toBeChanged}) {
		let champion = getters['getChampionByID'](_id)
		commit('changeGeneralChampionData', {champion, toBeChanged})
	},
	async changeGeneralChampionDataOnServer(ctx, {_id, toBeChanged}) {
		await this.$axios.$patch('api/champions/' + _id, toBeChanged)
	},
	refreshChampionForReactivity({commit, getters}, {_id, toBeChanged}) {
		let champion = getters['getChampionFromChampionInfoFromServerByID'](_id)
		commit('changeGeneralChampionData', {champion, toBeChanged})
	}
}

export const mutations = {
	setChampionInfoFromServer(state, champions) {
		state.championInfoFromServer = champions
	},
	setCombinedChampionInfo(state, champions) {
		state.combinedChampionInfo = champions
	},
	setContentPropertyOfChampionByID(state, {oldContent, newContent}) {
		Object.keys(newContent).forEach((property) => {
			Vue.set(oldContent, property, newContent[property] )
		})
	},
	deleteContentOfChampionByIndex(state, information) {
		delete state.freeloChampions.find((champion) => {return champion.name === name || champion.api_name === name}).contents[contentIndex]
	},
	createContentOfChampionWithID(state, {contents, newContent}) {
		contents.push(newContent)
	},
	swapContentOfChampionByIndexAndDirection(state, {contents, index, dir}) {
		let temp = contents[index]
		contents[index] = contents[index + dir]
		Vue.set(contents, index + dir, temp)
	},
	deleteContentInChampion(state, {contents, contentID}) {
		const index = contents.findIndex((content) => {return parseInt(content.id) === parseInt(contentID)})
		contents.splice(index, 1)
	},
	changeGeneralChampionData(state, {champion, toBeChanged}) {
		Object.keys(toBeChanged).forEach((prop) => {
			Vue.set(champion, prop, toBeChanged[prop])
		})
	}
}