<template>
	<v-dialog v-model="showModal" max-width="500">
		<v-card>
			<v-card-title class="headline pb-1" v-text="'Are you sure you want to remove this post?'"></v-card-title>
			<v-card-actions>
				<v-spacer></v-spacer>

				<v-btn
					color="error"
					@click="
						disableModal()
						removePost()
					"
				>
					Remove
				</v-btn>

				<v-btn flat @click="disableModal()">
					Close
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	props: {
		showModal: {
			required: true,
			type: Boolean
		}
	},
	computed: {
		csrfToken() {
			return this.$store.getters['csrf/getToken']
		},
		postID() {
			return this.$route.params.id
		}
	},
	methods: {
		disableModal() {
			this.$emit('disableModal')
		},
		async removePost() {
			try {
				await this.$store.dispatch('posts/deleteInDB', { _csrf: this.csrfToken, postID: this.postID })
				this.$router.push({
					path: '/guides/general'
				})
				this.$store.dispatch('posts/deleteInLocal', this.postID)
			} catch (err) {
				console.log(err) //eslint-disable-line
			}
		}
	}
}
</script>

<style></style>
