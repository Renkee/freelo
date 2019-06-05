/* eslint-disable */
export const state = () => ({
	enabled: false,
	changes: []
})

export const mutations = {
	setState(state, newState) {
		state.enabled = newState
	},
	setChanges(state, changes) {
		state.changes = changes
	}
}

export const getters = {
	getState(state) {
		return state.enabled
	},
	getChanges(state) {
		return state.changes
	}
}

export const actions = {
	async addNewChange(context, { subject, changed_element, action, _csrf }) {
		await this.$axios.$post('api/changelog', {
			_csrf,
			subject,
			changed_element,
			action
		})
	},
	async getDataFromDB({commit, dispatch}) {
        const limit = 100
		let {changes} = await this.$axios.$get('api/changelog?amount=' + limit)
        commit('setChanges', await dispatch('processData', changes))
    },
    processData({rootGetters}, data) {
        let finalArray = []
        let previousSubject = {
			type: '',
			id: ''
		}

        for(let i = 0; i < data.length; i++) {
			let {subject, action, changed_element} = data[i]
			let changeTitle = ''
			const capitalizedAction = action.charAt(0).toUpperCase() + action.slice(1)

			if(changed_element.type === 'power') changed_element.type = 'champion power'

			if(changed_element.type === 'freelo') {
				action === 'add' ? changeTitle = `Added to Freelo`
								 : changeTitle = 'Removed from Freelo'
			} else if(changed_element.type === 'content'){
				changeTitle = `${capitalizedAction}d ${changed_element.type} with title '${changed_element.extra.title}'`
			} else {
				changeTitle = `${capitalizedAction}d ${changed_element.type}`
			}

			const changesObj = {
				key: data[i]._id,
				title: changeTitle
			}

			if (previousSubject.type === subject.type && previousSubject.id === subject.id) {
				finalArray[0].changes.push(changesObj)
			} else {
				let champion = null;
				if(subject.type === 'champion') {
					champion = rootGetters['champions/getChampionByID'](subject.id)
				}
				finalArray.unshift({
					time: data[i].createdAt,
					key: data[i]._id,
					splash: champion.splash || '',
					name: champion.name || '',
					changes: [changesObj]
				})
				previousSubject = subject
			}
		}
		return finalArray
    }
}
