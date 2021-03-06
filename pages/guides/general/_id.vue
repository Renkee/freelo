<template>
	<div id="wrapper">
		<div id="breadcrumbs">
			<v-breadcrumbs :items="breadcrumbs" divider=">" />
		</div>
		<div v-if="isEditing" id="IF_EDITING">
			<PostEdit
				:post="
					postByRoute
						? {
								_id: postByRoute._id,
								title: postByRoute.title,
								text: postByRoute.text,
								tags: postByRoute.tags,
								patch: postByRoute.patch,
								updatedAt: postByRoute.updatedAt,
								enabled: postByRoute.enabled
						  }
						: {}
				"
				@stopEditing="isEditing = false"
				@recalculateText="recalculateText"
			/>
		</div>
		<div v-else id="IF_NOT_EDITING">
			<v-card id="post">
				<v-card-title>
					<h1
						:style="colorScheme ? 'color: #fff !important;' : 'color: #000 !important;'"
						style="width: 100%; line-height: 2.2rem; font-size: 1.9rem"
					>
						{{ postByRoute.title }}
					</h1>
					<v-tooltip right>
						<template v-slot:activator="{ on }">
							<span class="caption" v-on="on"
								>last updated <Timeago :datetime="postByRoute.updatedAt"></Timeago
							></span>
						</template>
						<span>{{ convertToUTCString(postByRoute.updatedAt) }} </span>
					</v-tooltip>
				</v-card-title>
				<v-card-text><VueMarkdown style="font-size: 1.1rem" :source="textWithNametags"></VueMarkdown></v-card-text>
				<v-card-actions style="width: 100%;padding-bottom: 48px">
					<PostTags :nametag-search="nametagSearch" :post="postByRoute" :limit="0"></PostTags>
				</v-card-actions>
				<div v-if="loggedIn" style="position: absolute; bottom: 0; right: 0;">
					<v-btn flat @click="isEditing = true">Edit</v-btn>
				</div>
			</v-card>
		</div>
	</div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import PostEdit from '~/components/Guides/General/Id/PostEdit'
import NametagSearch from '~/utils/nametagSearch.js'
import PostTags from '~/components/General/Posts/PostTags'
export default {
	head() {
		return {
			title: `${this.headTitle}`,
			meta: [
				{
					name: 'description',
					content: `Learn about League of Legends with this post made by former C9 coach: OFGSaiph`
				}
			]
		}
	},
	components: {
		VueMarkdown,
		PostEdit,
		PostTags
	},
	data() {
		return {
			isEditing: false,
			textWithNametags: '',
			nametagSearch: new NametagSearch(this.$store)
		}
	},
	computed: {
		headTitle() {
			if (this.postByRoute) {
				return this.postByRoute.title
			} else {
				return 'Title not found'
			}
		},
		postByRoute() {
			return this.$store.getters['posts/getByID'](this.$route.params.id)
		},
		loggedIn() {
			return this.$store.getters['user/get'].id !== null
		},
		colorScheme() {
			return this.$store.getters['colorscheme/get']
		},
		currentPatch() {
			return this.$store.getters['api/getPatch']
		},
		breadcrumbs() {
			return [
				{
					text: 'Guides',
					disabled: true,
					tag: 'span',
					to: '/guides/champions'
				},
				{
					text: 'General',
					disabled: false,
					nuxt: true,
					to: '/guides/general',
					exact: true
				},
				{
					text: this.headTitle,
					disabled: true,
					tag: 'span',
					to: '/guides/champions'
				}
			]
		}
	},
	created() {
		this.recalculateText()
	},
	mounted() {
		this.nametagSearch.enableNametags() // Need to do this because .outerHTML is only available after mounting
		this.$nextTick().then(() => {
			this.recalculateText()
		})
	},
	methods: {
		convertToUTCString(date) {
			return new Date(date).toUTCString()
		},
		recalculateText() {
			this.textWithNametags = this.nametagSearch.replaceWithNameTags(this.postByRoute.text)
		}
	}
}
</script>

<style>
.avatar-no-margin-right .v-chip__content .v-avatar {
	margin-right: 0px;
}
.v-card__text {
	padding: 0px 16px;
}
.v-card__text img {
	max-width: 768px;
}
#post {
	width: 100%;
}
#wrapper {
	max-width: 800px;
	margin: 0 auto;
	display: grid;
	grid-template-columns: 1fr;
	grid-gap: 0px;
}
#breadcrumbs a:not(.v-breadcrumbs__item--disabled) {
	text-decoration: underline !important;
}
</style>
