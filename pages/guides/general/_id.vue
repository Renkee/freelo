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
				<v-card-actions style="display: flex; flex-flow: row wrap">
					<v-chip
						v-if="loggedIn"
						style="margin-right: 5px; margin-bottom: 5px; flex: initial; color: #fff !important;"
						disabled
						:color="postByRoute.enabled ? 'success' : 'error'"
						><v-avatar>
							<v-icon :size="20" :class="postByRoute.enabled ? 'success' : 'error'" class="darken-2 white--text">{{
								postByRoute.enabled ? 'check' : 'close'
							}}</v-icon> </v-avatar
						>{{ postByRoute.enabled ? 'Enabled' : 'Disabled' }}</v-chip
					>
					<v-chip
						v-for="tag in [postByRoute.patch, ...postByRoute.tags]"
						:key="tag"
						:color="nametagSearch.getBGOfTag(tag)"
						:style="
							colorScheme && !nametagSearch.checkForTag(tag) ? 'color: #000 !important;' : 'color: #fff !important;'
						"
						style="margin-right: 5px; margin-bottom: 5px; flex: initial"
						disabled
					>
						<v-avatar v-if="tag && nametagSearch.checkForTag(tag)">
							<img :src="nametagSearch.getImageLinkForTag(tag)" />
						</v-avatar>
						{{ tag }}
					</v-chip>
					<v-spacer></v-spacer>
					<v-btn v-if="loggedIn" flat @click="isEditing = true">Edit</v-btn>
				</v-card-actions>
			</v-card>
		</div>
	</div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import PostEdit from '~/components/GuidesGeneralId/PostEdit'
import NametagSearch from '~/utils/nametagSearch.js'
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
		PostEdit
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
