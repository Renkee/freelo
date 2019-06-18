<template>
	<main>
		<h1 v-if="posts.length === 0">No posts found...</h1>
		<BlogPost
			v-if="posts.length > 0"
			id="newest-post"
			:nametag-search="nametagSearch"
			:post="posts[0]"
			:tag-limit="4"
			:text-length="35"
		/>
		<BlogPost
			v-for="post in posts.slice(1)"
			:key="post._id"
			:tag-limit="3"
			:nametag-search="nametagSearch"
			class="other-posts"
			:post="post"
			:text-length="20"
		/>
	</main>
</template>

<script>
import BlogPost from '~/components/Guides/General/Home/BlogPost'
import NametagSearch from '~/utils/nametagSearch.js'
export default {
	components: {
		BlogPost
	},
	data() {
		return {
			postTagElementSizes: [],
			nametagSearch: new NametagSearch(this.$store)
		}
	},
	computed: {
		loggedIn() {
			return this.$store.getters['user/get'].id !== null
		},
		posts() {
			let posts = this.$store.getters['posts/get'].slice().reverse()
			if (!this.loggedIn) {
				posts = posts.filter(post => {
					return post.enabled === true
				})
			}
			const filterTags = this.$store.getters['filters/getGeneralFiltersTags']
			if (filterTags && filterTags.length > 0) {
				posts = this.filterPostsBasedOnTags(posts, filterTags)
			}
			return posts
		},
		colorScheme() {
			return this.$store.getters['colorscheme/get']
		}
	},
	created() {
		this.$parent.$on('postAdded', () => {
			this.$emit('postAdded')
		})
	},
	mounted() {
		this.nametagSearch.enableNametags()
	},
	methods: {
		convertToUTCString(date) {
			return new Date(date).toUTCString()
		},
		filterPostsBasedOnTags(posts, filters) {
			for (let i = 0; i < posts.length; i++) {
				for (let j = 0; j < filters.length; j++) {
					if (!posts[i].tags.includes(filters[j])) {
						// Remove post and go back one index in loop so that we don't skip the next post
						posts.splice(i, 1)
						i--
						break
					}
				}
			}
			return posts
		}
	}
}
</script>
<style>
.half-width {
	max-width: 360px !important;
}
.three-quarters-width {
	max-width: 576px !important;
}
#newest-post .v-card__text img {
	max-width: 768px;
}
.other-posts .v-card__text img {
	max-width: 360px;
}
.v-card__text img {
	width: 100%;
}
</style>
<style scoped>
main {
	max-width: 800px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 15px;
}
.other-posts {
	grid-column-start: span 1;
}
#newest-post {
	grid-column-start: span 2;
}

@media (max-width: 740px) {
	.other-posts {
		grid-column-start: span 2 !important;
	}
}
</style>
