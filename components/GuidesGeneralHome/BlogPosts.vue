<template>
	<main>
		<BlogPost id="newest-post" :nametag-search="nametagSearch" :post="posts[0]" :text-length="35" />
		<BlogPost
			v-for="post in posts.slice(1)"
			:key="post._id"
			:nametag-search="nametagSearch"
			class="other-posts"
			:post="post"
			:text-length="20"
		/>
	</main>
</template>

<script>
import BlogPost from '~/components/GuidesGeneralHome/BlogPost'
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
			const posts = this.$store.getters['posts/get'].slice().reverse()
			return this.loggedIn
				? posts
				: posts.filter(post => {
						return post.enabled === true
				  })
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
