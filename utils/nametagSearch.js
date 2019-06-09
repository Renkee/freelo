import TrieSearch from 'trie-search'
import Vue from 'vue'
import NameTag from '~/components/General/NameTag'

class NametagSearch {
	constructor(storeInstance) {
		this.trie = new TrieSearch('name', { ignoreCase: false, splitOnRegEx: false })
		this.nametagsEnabled = false
		this.storeInstance = storeInstance

		const allChampions = this.storeInstance.getters['champions/getAll']
		const allItems = this.storeInstance.getters['items/get']
		const allRunes = this.storeInstance.getters['runes/get']

		this.trie.addAll(allChampions.concat(allItems).concat(allRunes))
	}
	_isUpperCase(str) {
		return str === str.toUpperCase() && str !== str.toLowerCase()
	}
	_findPatternsInText(text) {
		let i = 0
		let nameFound = false
		let name = ''
		let maybeNameParsed = {}
		const namesParsed = []

		while (i < text.length) {
			if (nameFound === false && this._isUpperCase(text[i]) && this.trie.get(text[i]).length > 0) {
				name += text[i]
				nameFound = true
				maybeNameParsed = { startingPoint: i }
				i++
			} else if (nameFound === true) {
				// If there's already a name:
				// 1. Check if there's only one champion found with name after adding the new character to it
				// 2a. If there's no champion after adding it, delete everything and reset to start+1
				// 2b. If there's only one champion but the names aren't exactly matching then continue
				// 2c. If there's only one champion and the name's are matching then save the starting and ending point and continue after the ending point
				name += text[i]

				const search = this.trie.get(name)
				if (search.length === 0) {
					name = ''
					nameFound = false
					i = maybeNameParsed.startingPoint + 1
				} else if (search.length > 0) {
					if (name === search[0].name) {
						namesParsed.push({ name, startingPoint: maybeNameParsed.startingPoint, endingPoint: i })
						name = ''
						nameFound = false
					}
					i++
				}
			} else {
				i++
			}
		}
		return namesParsed
	}
	_replaceTextWithNametags(text, namesParsed) {
		namesParsed.reverse().forEach(({ name, startingPoint, endingPoint }) => {
			text = text
				.split('')
				.filter((char, index) => {
					return index < startingPoint || index > endingPoint
				})
				.join('')

			const responseFromTrie = this.trie.get(name)
			let element = null
			const ComponentClass = Vue.extend(NameTag)
			let instance = null

			if (responseFromTrie !== undefined) {
				if (responseFromTrie[0].type === 'champion') {
					instance = new ComponentClass({
						propsData: {
							name: responseFromTrie[0].name,
							imageLink: responseFromTrie[0].square,
							type: 'champion'
						}
					})
				} else if (responseFromTrie[0].type === 'item') {
					instance = new ComponentClass({
						propsData: {
							name: responseFromTrie[0].name,
							imageLink: responseFromTrie[0].image,
							type: 'item'
						}
					})
				} else if (responseFromTrie[0].type === 'rune') {
					instance = new ComponentClass({
						propsData: {
							name: name,
							imageLink: responseFromTrie[0].icon,
							type: 'rune'
						}
					})
				}
			}

			instance.$mount() // pass nothing
			element = instance.$el

			const splitText = text.split('')
			text =
				splitText.slice(0, startingPoint).join('') +
				element.outerHTML +
				splitText.slice(startingPoint, splitText.length).join('')
		})
		return text.replace(/div/g, 'span') // have to remove block elements because markdown doesn't like them
	}
	replaceWithNameTags(text) {
		if (this.nametagsEnabled) {
			const parsedNames = this._findPatternsInText(text)
			return this._replaceTextWithNametags(text, parsedNames)
		} else {
			return text
		}
	}
	checkForTag(tag) {
		const trieResult = this.trie.get(tag)
		return trieResult[0] !== undefined && trieResult[0].name === tag
	}
	getImageLinkForTag(tag) {
		const trieResult = this.trie.get(tag)[0]
		return trieResult.type === 'champion'
			? trieResult.square
			: trieResult.type === 'item'
			? trieResult.image
			: trieResult.icon
	}
	enableNametags() {
		this.nametagsEnabled = true
	}
}

export default NametagSearch
