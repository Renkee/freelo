<template>
	<div id="IF_EDITING">
		<div>
			<ModalRemovePost :show-modal="showRemoveModal" @disableModal="showRemoveModal = false"></ModalRemovePost>
		</div>
		<v-tabs
			centered
			color="primary"
			slider-color="#FF9D45"
			:dark="!colorScheme"
			:light="colorScheme"
			@change="onTabChange($event)"
		>
			<v-tab>Edit</v-tab>
			<v-tab-item>
				<v-card id="post">
					<v-card-title>
						<h1>Edit post</h1>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-layout row wrap align-center>
								<v-flex xs12>
									<v-text-field
										v-model="editedPost.title"
										v-validate="'required'"
										label="Title"
										:error-messages="errors.collect('title')"
										data-vv-name="title"
										box
									></v-text-field>
								</v-flex>
								<v-flex xs12>
									<v-textarea
										v-model="editedPost.text"
										v-validate="'required'"
										:height="350"
										box
										label="Text"
										data-vv-name="text"
										:error-messages="errors.collect('text')"
									></v-textarea>
								</v-flex>
								<v-flex xs12>
									<v-combobox
										v-model="editedPost.tags"
										v-validate="'required'"
										data-vv-name="tags"
										:error-messages="errors.collect('tags')"
										box
										hide-selected
										label="Tags"
										multiple
										chips
									>
									</v-combobox>
								</v-flex>
								<v-flex xs12>
									<v-checkbox
										v-model="editedPost.enabled"
										label="Enabled"
										color="primary"
										hint="If you check enabled, then everyone can see it, otherwise only logged in users"
										persistent-hint
									></v-checkbox>
								</v-flex>
							</v-layout>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="success" @click="submitEdit">Submit</v-btn>
						<v-btn style="position: absolute; top: 16px; right: 16px" color="error" @click="showRemoveModal = true"
							>Remove</v-btn
						>
						<v-btn flat @click="cancelEdit">Cancel</v-btn>
					</v-card-actions>
				</v-card>
			</v-tab-item>
			<v-tab>Preview</v-tab>
			<v-tab-item lazy>
				<v-card id="post">
					<v-card-title>
						<h1 :style="colorScheme ? 'color: #fff !important;' : 'color: #000 !important;'" style="width: 100%">
							{{ editedPost.title }}
						</h1>
						<v-tooltip right>
							<template v-slot:activator="{ on }">
								<span class="caption" v-on="on">last updated <Timeago :datetime="post.updatedAt"></Timeago></span>
							</template>
							<span>{{ convertToUTCString(editedPost.updatedAt) }} </span>
						</v-tooltip>
					</v-card-title>
					<v-card-text
						><VueMarkdown style="font-size: 1.1rem" :source="editedTextWithNametag"></VueMarkdown
					></v-card-text>
					<v-card-actions style="display: flex; flex-flow: row wrap">
						<v-chip
							style="margin-right: 5px; margin-bottom: 5px; flex: initial; color: #fff !important;"
							disabled
							:color="editedPost.enabled ? 'success' : 'error'"
							><v-avatar>
								<v-icon
									:size="20"
									:class="editedPost.enabled ? 'success' : 'error'"
									class="darken-2 white--text"
									>{{ editedPost.enabled ? 'check' : 'close' }}</v-icon
								> </v-avatar
							>{{ editedPost.enabled ? 'Enabled' : 'Disabled' }}</v-chip
						>
						<v-chip
							v-for="tag in [post.patch, ...editedPost.tags]"
							:key="tag"
							:color="nametagSearch.getBGOfTag(tag)"
							:style="
								colorScheme && !nametagSearch.checkForTag(tag)
									? 'color: #000 !important;'
									: 'color: #fff !important;'
							"
							style="margin-right: 5px; margin-bottom: 5px; flex: initial"
							disabled
							><v-avatar v-if="tag && nametagSearch.checkForTag(tag)">
								<img :src="nametagSearch.getImageLinkForTag(tag)" /> </v-avatar
							>{{ tag }}</v-chip
						>
					</v-card-actions>
				</v-card>
			</v-tab-item>
		</v-tabs>
	</div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import NametagSearch from '~/utils/nametagSearch.js'
import ModalRemovePost from '~/components/GuidesGeneralHome/ModalRemovePost'
export default {
	components: {
		ModalRemovePost,
		VueMarkdown
	},
	props: {
		post: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			editedPost: {
				title: '',
				text: '',
				tags: [],
				enabled: false
			},
			showRemoveModal: false,
			editedTextWithNametag: '',
			nametagSearch: new NametagSearch(this.$store)
		}
	},
	computed: {
		colorScheme() {
			return this.$store.getters['colorscheme/get']
		},
		csrfToken() {
			return this.$store.getters['csrf/getToken']
		},
		currentPatch() {
			return this.$store.getters['api/getPatch']
		}
	},
	created() {
		const properties = ['title', 'text', 'tags', 'enabled']

		properties.forEach(property => {
			this.editedPost[property] = this.post[property]
		})
		this.recalculateText()
	},
	mounted() {
		this.nametagSearch.enableNametags() // Need to do this because .outerHTML is only available after mounting
		this.recalculateText()
	},
	methods: {
		recalculateText() {
			this.editedTextWithNametag = this.nametagSearch.replaceWithNameTags(this.editedPost.text)
		},
		// tabNumber: 0 -> Edit
		// 	          1 -> Preview
		onTabChange(tabNumber) {
			if (tabNumber === 1) {
				this.recalculateText()
			}
		},
		convertToUTCString(date) {
			return new Date(date).toUTCString()
		},
		cancelEdit() {
			this.$emit('stopEditing')
		},
		async submitEdit() {
			// convert 'x.xx.x' to 'x.xx'
			const temp = this.currentPatch.split('.')
			const patch = temp[0] + '.' + temp[1]

			if (await this.$validator.validateAll()) {
				let payload = {}
				let recalculateText = false
				Object.keys(this.editedPost).forEach(property => {
					if (!(this.editedPost[property] === this.post[property])) {
						payload[property] = this.editedPost[property]
						if (property === 'text') {
							recalculateText = true
						}
					}
				})
				payload = { ...payload, patch, _id: this.post._id }
				await this.$store.dispatch('posts/updateInDB', { _csrf: this.csrfToken, ...payload })
				await this.$store.dispatch('posts/updateInLocal', payload)
				if (recalculateText) this.$emit('recalculateText')
				this.cancelEdit()

				this.$validator.reset()
			}
		}
	}
}
</script>

<style>
.v-card__text {
	padding: 0px 16px;
}
</style>
