<template>
	<v-dialog id="add-post-modal" v-model="showModal" persistent max-width="740">
		<v-card>
			<v-card-title class="headline">Add new post</v-card-title>
			<v-form>
				<v-card-text>
					<v-container>
						<v-layout row wrap align-center>
							<v-flex xs12>
								<v-text-field
									v-model="addPost.title"
									v-validate="'required'"
									label="Title"
									:error-messages="errors.collect('title')"
									data-vv-name="title"
									style="margin: 5px 10px"
									box
								></v-text-field>
							</v-flex>
							<v-flex xs12>
								<v-textarea
									v-model="addPost.text"
									v-validate="'required'"
									box
									label="Text"
									style="margin: 5px 10px"
									data-vv-name="text"
									:error-messages="errors.collect('text')"
								></v-textarea>
							</v-flex>
							<v-flex xs12>
								<v-combobox
									v-model="addPost.tags"
									v-validate="'required'"
									style="margin: 5px 10px"
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
									v-model="addPost.enabled"
									style="margin: 5px 10px"
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
					<v-btn :loading="addPostButtonLoading" color="success" @click="submitAddPostModal()">
						Submit
					</v-btn>
					<v-btn flat @click="disableModal()">
						Cancel
					</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	data() {
		return {
			addPost: {
				title: '',
				text: '',
				tags: [],
				enabled: false
			},
			addPostButtonLoading: false
		}
	},
	computed: {
		showModal() {
			return this.$store.getters['generalmodals/getNewPostModalState']
		},
		csrfToken() {
			return this.$store.getters['csrf/getToken']
		},
		currentPatch() {
			return this.$store.getters['api/getPatch']
		}
	},
	methods: {
		disableModal() {
			this.$store.commit('generalmodals/setNewPostModalState', false)
		},
		async submitAddPostModal() {
			this.addPostButtonLoading = true

			// convert '9.11.1' to '9.11'
			const temp = this.currentPatch.split('.')
			const patch = temp[0] + '.' + temp[1]

			if (await this.$validator.validateAll()) {
				const payload = { patch, ...this.addPost }
				const postID = await this.$store.dispatch('posts/createInDB', { _csrf: this.csrfToken, ...payload })
				await this.$store.dispatch('posts/createInLocal', { _id: postID, ...payload })
				this.disableModal()

				// Reset modal items
				this.addPost = {
					title: '',
					text: '',
					tags: [],
					enabled: false
				}
				this.$validator.reset()
			}
			this.addPostButtonLoading = false
		}
	}
}
</script>

<style></style>
