<template>
	<div id="blog-container">
		<BlogPosts></BlogPosts>
		<div v-if="loggedIn">
			<AddFab
				v-if="loggedIn && $store.getters['generalmodals/getNewPostModalState'] === false"
				@fabClicked="$store.commit('generalmodals/setNewPostModalState', true)"
			></AddFab>
			<ModalAddNewPost @postAdded="$emit('postAdded')"></ModalAddNewPost>
		</div>
	</div>
</template>

<script>
import BlogPosts from '~/components/GuidesGeneralHome/BlogPosts'
import AddFab from '~/components/General/AddFab'
import ModalAddNewPost from '~/components/GuidesGeneralHome/ModalAddNewPost'

export default {
	head() {
		return {
			title: `General Guides`,
			meta: [
				{
					name: 'description',
					content: `Learn about general Leauge of Legends stuff with guides made by former C9 coach: OFGSaiph`
				}
			]
		}
	},
	components: {
		BlogPosts,
		AddFab,
		ModalAddNewPost
	},
	data() {
		return {}
	},
	computed: {
		loggedIn() {
			return this.$store.getters['user/get'].id !== null
		}
	}
}
</script>

<style></style>
