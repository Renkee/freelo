<template>
	<main>
		<v-card
			v-for="(content, index) in champion.contents"
			:id="`content-item-${content.id}`"
			:key="content.id"
			:class="`span-${content.span}`"
			class="content-item"
			:style="loggedIn ? 'padding-bottom: 52px' : ''"
		>
			<div v-if="arrayContainsObjectWithID(contentCreated, content.id).status" id="IF_CREATING">
				<v-tabs centered color="primary" slider-color="#FF9D45" dark @change="onTabChangeWhileCreate(content.id, $event)">
					<v-tab>Create</v-tab>
					<v-tab-item>
						<v-card flat>
							<v-card-text>
								<v-text-field
									:value="content.title"
									label="Title"
									box
									@input="updateContentWhileCreating(content.id, { title: $event })"
								/>
								<v-textarea
									:value="
										contentCreated.find(el => {
											return el.id === content.id
										}).stateWhileEdit.text
									"
									box
									label="Content"
									@input="updateContentWhileCreating(content.id, { text: $event })"
								/>
								<v-switch
									:input-value="content.span"
									color="primary"
									:false-value="1"
									:true-value="2"
									label="Full width"
									@change="updateContent(content.id, { span: $event })"
								></v-switch>
							</v-card-text>
						</v-card>
					</v-tab-item>
					<v-tab>Preview</v-tab>
					<v-tab-item>
						<v-card flat>
							<v-card-title>
								<span class="headline">{{
									contentCreated.find(el => {
										return el.id === content.id
									}).stateWhileEdit.title
								}}</span>
							</v-card-title>
							<v-card-text
								><VueMarkdown
									:source="
										contentTexts.find(el => {
											return el.id === content.id
										}).text
									"
							/></v-card-text>
						</v-card>
					</v-tab-item>
				</v-tabs>
				<v-card-actions id="if-logged-in">
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="createContentSubmit(content.id, content.span)">Submit</v-btn>
					<v-btn flat :ripple="false" @click="deleteContent(index, 'cancel')">Cancel</v-btn>
				</v-card-actions>
			</div>
			<div v-if="arrayContainsObjectWithID(contentEdited, content.id).status" id="IF_EDITING">
				<v-tabs centered color="primary" slider-color="#FF9D45" dark @change="onTabChangeWhileEdit(content.id, $event)">
					<v-tab>Edit</v-tab>
					<v-tab-item>
						<v-card flat>
							<v-card-text>
								<v-text-field
									:value="content.title"
									label="Title"
									box
									@input="updateContentWhileEditing(content.id, { title: $event })"
								/>
								<!-- <v-btn @click="onClick(content)">do something</v-btn> -->
								<v-textarea
									:id="'content-text-field-' + content.id"
									:value="
										contentEdited.find(el => {
											return el.id === content.id
										}).stateWhileEdit.text
									"
									box
									label="Content"
									@input="updateContentWhileEditing(content.id, { text: $event })"
								/>
								<v-switch
									:input-value="content.span"
									color="primary"
									:false-value="1"
									:true-value="2"
									label="Full width"
									@change="updateContent(content.id, { span: $event })"
								></v-switch>
							</v-card-text>
						</v-card>
					</v-tab-item>
					<v-tab>Preview</v-tab>
					<v-tab-item lazy>
						<v-card flat>
							<v-card-title>
								<span class="headline">{{
									contentEdited.find(el => {
										return el.id === content.id
									}).stateWhileEdit.title
								}}</span>
							</v-card-title>
							<v-card-text
								><VueMarkdown
									:ref="'content-text-preview-id-' + content.id"
									:source="
										contentTexts.find(el => {
											return el.id === content.id
										}).text
									"
							/></v-card-text>
						</v-card>
					</v-tab-item>
				</v-tabs>
				<v-card-actions id="if-logged-in">
					<v-spacer></v-spacer>
					<v-btn color="primary" @click="submitEdit(content.id, content.span)">Submit</v-btn>
					<v-btn flat :ripple="false" @click="cancelEdit(content.id)">Cancel</v-btn>
				</v-card-actions>
			</div>
			<div
				v-if="
					!arrayContainsObjectWithID(contentEdited, content.id).status &&
						!arrayContainsObjectWithID(contentCreated, content.id).status
				"
				id="IF_NOT_EDITING"
			>
				<v-card-title>
					<span class="headline">{{ content.title }}</span>
				</v-card-title>
				<v-card-text>
					<VueMarkdown
						:ref="'content-text-id-' + content.id"
						:source="
							contentTexts.find(el => {
								return el.id === content.id
							}).text
						"
					/>
				</v-card-text>
				<v-card-actions v-if="loggedIn" id="if-logged-in">
					<v-btn flat small @click="startEdit(content)">Edit</v-btn>
					<v-btn flat small @click.stop="$set(deleteDialogs, index, true)">Delete</v-btn>

					<v-dialog v-model="deleteDialogs[index]" max-width="350">
						<v-card>
							<v-card-title class="headline pb-1">Are you sure?</v-card-title>

							<v-card-text> <span>You won't be able to undo this action.</span></v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>

								<v-btn
									color="error"
									@click="
										$set(deleteDialogs, index, false)
										deleteContent(content.id, 'delete')
									"
								>
									Delete
								</v-btn>

								<v-btn flat @click="$set(deleteDialogs, index, false)">
									Close
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-spacer></v-spacer>
					<ContentArrows :champion="champion" :index="index" :content="content"></ContentArrows>
				</v-card-actions>
			</div>
		</v-card>
		<v-snackbar v-model="deletedSnackbar" color="error" :timeout="3000" bottom left>
			<span>Content deleted successfully!</span>
			<v-btn flat @click="deletedSnackbar = false">Close</v-btn>
		</v-snackbar>
		<AddFab v-if="loggedIn" @fabClicked="createContent()"></AddFab>
	</main>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import Vue from 'vue'

import NameTag from '~/components/General/NameTag' //eslint-disable-line
import ContentArrows from '~/components/GuidesChampionsName/ContentArrows'
import AddFab from '~/components/General/AddFab'

import TrieSearch from 'trie-search'

export default {
	components: {
		ContentArrows,
        NameTag, //eslint-disable-line
		VueMarkdown,
		AddFab
	},
	props: {
		loggedIn: {
			type: Boolean,
			required: true
		},
		champion: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			deletedSnackbar: false,
			deleteDialogs: [],
			fabToggle: false,
			nameTagsEnabled: false,
			contentTexts: [],
			nameTagSearch: new TrieSearch('name', { ignoreCase: false, splitOnRegEx: false })
		}
	},
	computed: {
		contentEdited() {
			return this.$store.getters['championguides/getContentEdited']
		},
		contentCreated() {
			return this.$store.getters['championguides/getContentCreated']
		},
		allChampions() {
			return this.$store.getters['champions/getAllChampions']
		},
		lolItems() {
			return this.$store.getters['items/getItems']
		},
		allNameTagPossibilites() {
			return this.allChampions.concat(this.lolItems)
		}
	},
	created() {
		// Save content texts to eliminate lag when updating them
		this.champion.contents.forEach(content => {
			this.contentTexts.push({ id: content.id, text: content.text })
		})
		this.nameTagSearch.addAll(this.allNameTagPossibilites)
	},
	mounted() {
		this.nameTagsEnabled = true // Need to do this because .outerHTML is only available after mounting
		this.contentTexts.forEach((obj, index) => {
			Vue.set(this.contentTexts[index], 'text', this.replaceWithNameTags(this.contentTexts[index].text))
		})
	},
	beforeDestroy() {
		// Clear edits and creates
		this.contentEdited.forEach(content => {
			this.cancelEdit(content.id)
		})

		this.contentCreated.forEach(id => {
			this.deleteContent(id)
		})

		this.$store.commit('championguides/setContentEdited', [])
		this.$store.commit('championguides/setContentCreated', [])
	},
	methods: {
		isUpperCase(str) {
			return str === str.toUpperCase() && str !== str.toLowerCase()
		},
		getSpanOfContentByID(contentID) {
			const isInContentEdited = this.arrayContainsObjectWithID(this.contentEdited, contentID)
			const isInContentCreated = this.arrayContainsObjectWithID(this.contentCreated, contentID)
			if (isInContentEdited.status) {
				return isInContentEdited.content.span
			} else if (isInContentCreated.status) {
				return isInContentCreated.content.span
			} else {
				return this.champion.contents.find(content => {
					return content.id === contentID
				}).span
			}
		},
		updateContentTextByID(contentID, newText) {
			const contentTextObj = this.contentTexts.find(el => {
				return el.id === contentID
			})
			Vue.set(contentTextObj, 'text', newText)
		},
		// tabNumber: 0 -> Edit
		// 	          1 -> Preview
		onTabChangeWhileEdit(contentID, tabNumber) {
			if (tabNumber === 1) {
				// Move temporary content state (while editing) to the one used by everything else
				this.updateContentTextByID(
					contentID,
					this.replaceWithNameTags(
						this.contentEdited.find(el => {
							return el.id === contentID
						}).stateWhileEdit.text
					)
				)
			}
		},
		onTabChangeWhileCreate(contentID, tabNumber) {
			if (tabNumber === 1) {
				// Move temporary content state (while editing) to the one used by everything else
				this.updateContentTextByID(
					contentID,
					this.replaceWithNameTags(
						this.contentCreated.find(el => {
							return el.id === contentID
						}).stateWhileEdit.text
					)
				)
			}
		},
		updateContent(contentID, newContent) {
			this.$store.dispatch('champions/updateContentPropertyOfChampionByID', {
				championID: this.champion.mongo_id,
				contentID,
				newContent
			})
		},
		updateContentWhileEditing(contentID, newContent) {
			this.$store.dispatch('championguides/changePropsOnContentEditedStateWhileEditByID', { contentID, newContent })
		},
		updateContentWhileCreating(contentID, newContent) {
			this.$store.dispatch('championguides/changePropsOnContentCreatedStateWhileEditByID', { contentID, newContent })
		},
		startEdit({ id, title, text, span }) {
			this.$store.commit('championguides/pushContentEdited', {
				id,
				stateWhileEdit: {
					title,
					text
				},
				stateBeforeEdit: {
					title,
					text,
					span
				}
			})
		},
		cancelEdit(contentID) {
			const stateBeforeEdit = this.contentEdited.find(el => {
				return el.id === contentID
			}).stateBeforeEdit

			this.updateContent(contentID, stateBeforeEdit)
			this.updateContentTextByID(contentID, this.replaceWithNameTags(stateBeforeEdit.text))

			this.$store.commit('championguides/removeItemByIdFromContentEdited', contentID)
		},
		submitEdit(id, span) {
			const stateWhileEdit = this.contentEdited.find(el => {
				return el.id === id
			}).stateWhileEdit

			this.updateContent(id, { ...stateWhileEdit, span })
			this.updateContentTextByID(id, this.replaceWithNameTags(stateWhileEdit.text))

			this.$store.dispatch('champions/updateChampionContentInDatabase', {
				_id: this.champion.mongo_id,
				contentID: id,
				...stateWhileEdit,
				span
			})
			this.$store.commit('championguides/removeItemByIdFromContentEdited', id)
		},
		createContent() {
			const maximumID = Math.max(...this.champion.contents.map(obj => obj.id)) // returns -Infinity if input is undefined
			const contentID = maximumID === -Infinity ? 0 : maximumID + 1
			this.$store.dispatch('champions/createContentOfChampionWithID', { _id: this.champion.mongo_id, contentID })
			this.contentTexts.push({ id: contentID, text: '' })
			const index = this.champion.contents.length - 1
			this.createContentStartEdit(contentID).then(() => {
				this.$scrollTo(`#content-item-${index}`)
			})
		},
		createContentStartEdit(id) {
			return new Promise(resolve => {
				this.$store.commit('championguides/pushContentCreated', { id, stateWhileEdit: { title: '', text: '', span: 2 } })
				resolve()
			})
		},
		createContentSubmit(id, span) {
			const stateWhileEdit = this.contentCreated.find(el => {
				return el.id === id
			}).stateWhileEdit

			this.$store.dispatch('champions/createContentOfChampionWithIDInDatabase', {
				_id: this.champion.mongo_id,
				contentID: id,
				...stateWhileEdit,
				span
			})

			this.updateContent(id, { ...stateWhileEdit, span })
			this.updateContentTextByID(id, this.replaceWithNameTags(stateWhileEdit.text))

			this.$store.commit('championguides/removeItemByIdFromContentCreated', id)
		},
		deleteContent(id, delOrCan) {
			this.$store.dispatch('champions/deleteContentInChampion', {
				_id: this.champion.mongo_id,
				contentID: id
			})

			if (
				this.contentCreated.find(el => {
					return el.id === id
				})
			) {
				this.$store.commit('championguides/removeItemByIdFromContentCreated', id)
			}

			if (delOrCan === 'delete') {
				this.deletedSnackbar = true
			}
		},
		arrayContainsObjectWithID(array, id) {
			const content = array.find(obj => {
				return obj.id === id
			})
			return { status: content !== undefined, content }
		},
		findPatternsInTextForNameTags(text) {
			let i = 0
			let nameFound = false
			let name = ''
			let maybeNameParsed = {}
			const namesParsed = []

			while (i < text.length) {
				if (nameFound === false && this.isUpperCase(text[i]) && this.nameTagSearch.get(text[i]).length > 0) {
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

					const search = this.nameTagSearch.get(name)
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
		},
		replaceNameTagPosition(text, namesParsed) {
			namesParsed.reverse().forEach(({ name, startingPoint, endingPoint }) => {
				text = text
					.split('')
					.filter((char, index) => {
						return index < startingPoint || index > endingPoint
					})
					.join('')

				const currentPatch = this.$store.getters['api/getPatch']
				const maybeItem = this.nameTagSearch.get(name)
				let element = null
				const ComponentClass = Vue.extend(NameTag)
				let instance = null

				if (maybeItem !== undefined && maybeItem[0].gold === undefined) {
					// A champion

					const champion = this.$store.getters['champions/getChampionByNameOrApiName'](name)

					if (champion) {
						instance = new ComponentClass({
							propsData: {
								name: champion.name,
								imageLink:
									'https://ddragon.leagueoflegends.com/cdn/' +
									currentPatch +
									'/img/champion/' +
									champion.api_name +
									'.png'
							}
						})
					}
					// An item
				} else {
					instance = new ComponentClass({
						propsData: {
							name: name,
							imageLink:
								'http://ddragon.leagueoflegends.com/cdn/' + currentPatch + '/img/item/' + maybeItem[0].image.full
						}
					})
				}

				instance.$mount() // pass nothing
				element = instance.$el

				const splitText = text.split('')
				text =
					splitText.slice(0, startingPoint).join('') +
					element.outerHTML +
					splitText.slice(startingPoint, splitText.length).join('')
			})
			return '<div>' + text + '</div>'
		},
		replaceWithNameTags(text) {
			if (this.nameTagsEnabled) {
				const parsedNames = this.findPatternsInTextForNameTags(text)
				return this.replaceNameTagPosition(text, parsedNames)
			} else {
				return text
			}
		},
		onClick({ id, text }) {
			const element = document.getElementById('content-text-field-' + id)
			const splitText = text.split('')
			const selectionStartSave = element.selectionStart
			const toBeAddedToText = `*{"name": "${this.champion.name}", "type": "champion" }*`
			text =
				splitText.slice(0, selectionStartSave).join('') +
				toBeAddedToText +
				splitText.slice(selectionStartSave, splitText.length).join('')

			this.$store.dispatch('champions/updateContentPropertyOfChampionByID', {
				championID: this.champion.mongo_id,
				contentID: id,
				newContent: { text }
			})

			this.$nextTick(() => {
				element.focus()
				element.setSelectionRange(
					selectionStartSave + toBeAddedToText.length,
					selectionStartSave + toBeAddedToText.length
				)
			})
		}
	}
}
</script>

<style scoped>
#if-logged-in {
	position: absolute;
	bottom: 0;
	right: 0;
	left: 0;
}

#wrapper {
	max-width: 740px;
	margin: 0 auto;
}

main {
	margin-top: 15px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 15px;
}
main .v-card__text {
	padding: 8px 16px 16px 16px;
}
.span-2 {
	grid-column-start: span 2;
}
.span-1 {
	grid-column-start: span 1;
}
.content-item .v-card__title {
	padding-bottom: 0;
}

@media (max-width: 740px) {
	.content-item {
		grid-column-start: span 2;
	}
}
</style>
