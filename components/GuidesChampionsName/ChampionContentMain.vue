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
			<div v-if="arrayContainsObjectWithID(contentCreated, content.id).status" class="IF_CREATING">
				<v-tabs
					centered
					color="primary"
					slider-color="#FF9D45"
					:dark="!colorScheme"
					:light="colorScheme"
					@change="onTabChangeWhileCreate(content.id, $event)"
				>
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
									style="font-size: 1.1rem"
									:source="
										contentTexts.find(el => {
											return el.id === content.id
										}).text
									"
							/></v-card-text>
						</v-card>
					</v-tab-item>
				</v-tabs>
				<v-card-actions class="if-logged-in">
					<v-spacer></v-spacer>
					<v-btn color="success" @click="createContentSubmit(content.id, content.span)">Submit</v-btn>
					<v-btn flat :ripple="false" @click="deleteContentLocally(index, 'cancel')">Cancel</v-btn>
				</v-card-actions>
			</div>
			<div v-if="arrayContainsObjectWithID(contentEdited, content.id).status" class="IF_EDITING">
				<v-tabs
					centered
					color="primary"
					slider-color="#FF9D45"
					:dark="!colorScheme"
					:light="colorScheme"
					@change="onTabChangeWhileEdit(content.id, $event)"
				>
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
									style="font-size: 1.1rem"
									:source="
										contentTexts.find(el => {
											return el.id === content.id
										}).text
									"
							/></v-card-text>
						</v-card>
					</v-tab-item>
				</v-tabs>
				<v-card-actions class="if-logged-in">
					<v-spacer></v-spacer>
					<v-btn color="success" @click="submitEdit(content.id, content.span)">Submit</v-btn>
					<v-btn flat :ripple="false" @click="cancelEdit(content.id)">Cancel</v-btn>
				</v-card-actions>
			</div>
			<div
				v-if="
					!arrayContainsObjectWithID(contentEdited, content.id).status &&
						!arrayContainsObjectWithID(contentCreated, content.id).status
				"
				class="IF_NOT_EDITING"
			>
				<v-card-title>
					<span class="headline">{{ content.title }}</span>
				</v-card-title>
				<v-card-text>
					<VueMarkdown
						:ref="'content-text-id-' + content.id"
						style="font-size: 1.1rem"
						:source="
							contentTexts.find(el => {
								return el.id === content.id
							}).text
						"
					/>
				</v-card-text>
				<v-card-actions v-if="loggedIn" class="if-logged-in">
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
										deleteContentEverywhere(content, 'delete')
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

import ContentArrows from '~/components/GuidesChampionsName/ContentArrows'
import AddFab from '~/components/General/AddFab'

import NametagSearch from '~/utils/nametagSearch.js'

export default {
	components: {
		ContentArrows,
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
			contentTexts: [],
			nametagSearch: new NametagSearch(this.$store)
		}
	},
	computed: {
		contentEdited() {
			return this.$store.getters['championguides/getContentEdited']
		},
		contentCreated() {
			return this.$store.getters['championguides/getContentCreated']
		},
		csrfToken() {
			return this.$store.getters['csrf/getToken']
		},
		colorScheme() {
			return this.$store.getters['colorscheme/get']
		}
	},
	created() {
		// Save content texts to eliminate lag when updating them
		this.champion.contents.forEach(content => {
			this.contentTexts.push({ id: content.id, text: content.text })
		})
	},
	mounted() {
		this.nametagSearch.enableNametags() // Need to do this because .outerHTML is only available after mounting
		this.contentTexts.forEach((obj, index) => {
			Vue.set(this.contentTexts[index], 'text', this.nametagSearch.replaceWithNameTags(this.contentTexts[index].text))
		})
	},
	beforeDestroy() {
		// Clear edits and creates
		this.contentEdited.forEach(content => {
			this.cancelEdit(content.id)
		})

		this.contentCreated.forEach(id => {
			this.deleteContentLocally(id)
		})

		this.$store.commit('championguides/setContentEdited', [])
		this.$store.commit('championguides/setContentCreated', [])
	},
	methods: {
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
					this.nametagSearch.replaceWithNameTags(
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
					this.nametagSearch.replaceWithNameTags(
						this.contentCreated.find(el => {
							return el.id === contentID
						}).stateWhileEdit.text
					)
				)
			}
		},
		updateContent(contentID, newContent) {
			this.$store.dispatch('champions/updateContentPropertyByID', {
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
			this.updateContentTextByID(contentID, this.nametagSearch.replaceWithNameTags(stateBeforeEdit.text))

			this.$store.commit('championguides/removeItemByIdFromContentEdited', contentID)
		},
		submitEdit(id, span) {
			const stateWhileEdit = this.contentEdited.find(el => {
				return el.id === id
			}).stateWhileEdit

			this.updateContent(id, { ...stateWhileEdit, span })
			this.updateContentTextByID(id, this.nametagSearch.replaceWithNameTags(stateWhileEdit.text))

			this.$store.dispatch('champions/updateContentInDB', {
				championID: this.champion.mongo_id,
				_csrf: this.csrfToken,
				contentID: id,
				...stateWhileEdit,
				span
			})
			this.$store.commit('championguides/removeItemByIdFromContentEdited', id)
		},
		createContent() {
			const maximumID = Math.max(...this.champion.contents.map(obj => obj.id)) // returns -Infinity if input is undefined
			const contentID = maximumID === -Infinity ? 0 : maximumID + 1
			this.$store.dispatch('champions/createContentWithID', { championID: this.champion.mongo_id, contentID })
			this.contentTexts.push({ id: contentID, text: '' })
			const index = this.champion.contents.length - 1
			this.createContentStartEdit(contentID).then(() => {
				this.$vuetify.goTo(`#content-item-${index}`, { duration: 400, offset: 0 })
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

			this.$store.dispatch('champions/createContentWithIDInDB', {
				championID: this.champion.mongo_id,
				_csrf: this.csrfToken,
				contentID: id,
				...stateWhileEdit,
				span
			})

			this.updateContent(id, { ...stateWhileEdit, span })
			this.updateContentTextByID(id, this.nametagSearch.replaceWithNameTags(stateWhileEdit.text))

			this.$store.commit('championguides/removeItemByIdFromContentCreated', id)
		},
		async deleteContentEverywhere({ id, title }, delOrCan) {
			this.deleteContentLocally(id, delOrCan)
			await this.deleteContentRemotely(id, title)
		},
		deleteContentLocally(id, delOrCan) {
			this.$store.dispatch('champions/deleteContent', { championID: this.champion.mongo_id, contentID: id })
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
		async deleteContentRemotely(id, title) {
			await this.$store.dispatch('champions/deleteContentInDB', {
				championID: this.champion.mongo_id,
				_csrf: this.csrfToken,
				contentID: id,
				title
			})
		},
		arrayContainsObjectWithID(array, id) {
			const content = array.find(obj => {
				return obj.id === id
			})
			return { status: content !== undefined, content }
		}
	}
}
</script>

<style scoped>
.if-logged-in {
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
