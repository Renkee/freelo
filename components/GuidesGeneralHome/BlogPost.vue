<template>
	<v-card class="blog-post" style="position: relative">
		<v-card-title style="margin-bottom: 7px">
			<div style="width: 100%;">
				<nuxt-link :to="'general/' + post._id"
					><h1
						:style="colorScheme ? 'color: #fff !important;' : 'color: #000 !important;'"
						style="display: inline; line-height: 2.2rem; font-size: 1.9rem"
					>
						{{ post.title }}
					</h1></nuxt-link
				>
			</div>
			<v-tooltip right>
				<template v-slot:activator="{ on }">
					<span class="caption" v-on="on">last updated <Timeago :datetime="post.updatedAt"></Timeago></span>
				</template>
				<span>{{ convertToUTCString(post.updatedAt) }} </span>
			</v-tooltip>
		</v-card-title>
		<v-card-text>
			<nuxt-link
				:style="colorScheme ? 'color: #fff !important;' : 'color: rgba(0,0,0,0.87) !important;'"
				style="text-decoration: none"
				:to="'general/' + post._id"
			>
				<VueMarkdown style="text-decoration: none !important; font-size: 1.1rem" :source="postText" />
			</nuxt-link>
		</v-card-text>
		<no-ssr>
			<div id="spacer" style="width: 100%" :style="{ height: tagsHeight || '0px' }"></div>
		</no-ssr>
		<v-card-actions :ref="post._id">
			<PostTags :nametag-search="nametagSearch" :post="post" :limit="tagLimit"></PostTags>
		</v-card-actions>
	</v-card>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import PostTags from '~/components/General/Posts/PostTags'

export default {
	components: {
		VueMarkdown,
		PostTags
	},
	props: {
		post: {
			required: true,
			type: Object
		},
		textLength: {
			required: true,
			type: Number
		},
		nametagSearch: {
			required: true,
			type: Object
		},
		tagLimit: {
			required: false,
			type: Number,
			default: 5
		}
	},
	data() {
		return {
			isMounted: false,
			tagsHeight: '0px',
			postText: ''
		}
	},
	computed: {
		colorScheme() {
			return this.$store.getters['colorscheme/get']
		},
		loggedIn() {
			return this.$store.getters['user/get'].id !== null
		}
	},
	created() {
		this.$parent.$on('postAdded', this.setPostTextToRecalculatedValue)
		if (process.client) {
			window.addEventListener('resize', this.calculateTagsHeight)
		}
		this.setPostTextToRecalculatedValue()
	},
	destroyed() {
		if (process.client) {
			window.removeEventListener('resize', this.calculateTagsHeight)
		}
	},
	mounted() {
		this.isMounted = true
		this.calculateTagsHeight()
		this.nametagSearch.enableNametags()
		this.setPostTextToRecalculatedValue()
	},
	methods: {
		setPostTextToRecalculatedValue() {
			this.postText = this.postTextWithNametag()
		},
		convertToUTCString(date) {
			return new Date(date).toUTCString()
		},
		calculateTagsHeight() {
			if (this.isMounted) {
				this.tagsHeight = this.$refs[this.post._id].clientHeight + 'px'
			} else {
				this.tagsHeight = '0px'
			}
		},
		postTextWithNametag() {
			const truncatedText = this.post.text
				.split(' ')
				.slice(0, this.textLength)
				.join(' ')
			if (truncatedText.length === this.post.text.length) {
				return this.nametagSearch.replaceWithNameTags(truncatedText)
			} else {
				return this.nametagSearch.replaceWithNameTags(truncatedText) + '...'
			}
		}
	}
}
</script>

<style scoped>
.v-card__text {
	padding: 0px 16px;
}
.v-card .v-card__title a {
	text-decoration: none;
}
.v-card .v-card__title a:hover {
	text-decoration: underline;
}
.v-card a:hover {
	text-decoration: underline;
}
.v-card a {
	text-decoration: none;
}
.v-card__actions {
	position: absolute;
	bottom: 0;
}
</style>
