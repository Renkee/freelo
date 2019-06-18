<template>
	<div style="display: flex; flex-flow: row wrap">
		<v-chip
			v-if="loggedIn"
			small
			style="margin-right: 5px; margin-bottom: 5px; flex: initial; color: #fff !important;"
			disabled
			:color="post.enabled ? 'success' : 'error'"
		>
			<v-avatar>
				<v-icon :size="17" :class="post.enabled ? 'success' : 'error'" class="darken-2 white--text">
					{{ post.enabled ? 'check' : 'close' }}
				</v-icon>
			</v-avatar>
			{{ post.enabled ? 'Enabled' : 'Disabled' }}
		</v-chip>
		<v-chip
			small
			style="margin-right: 5px; margin-bottom: 5px; flex: initial"
			disabled
			color="primary"
			:style="colorScheme ? 'color: #000 !important;' : 'color: #fff !important;'"
		>
			<v-avatar class="primary darken-3" style="font-size: 1rem; color: #fff !important">#</v-avatar>
			{{ post.patch }}
		</v-chip>
		<v-chip
			v-for="tag in postTags"
			:key="tag"
			small
			:color="nametagSearch.getBGOfTag(tag)"
			:style="colorScheme && !nametagSearch.checkForTag(tag) ? 'color: #000 !important;' : 'color: #fff !important;'"
			style="margin-right: 5px; margin-bottom: 5px; flex: initial"
			disabled
		>
			<v-avatar v-if="tag" class="primary darken-3" style="color: #fff !important; font-size: 14px;">
				<img v-if="nametagSearch.checkForTag(tag)" :src="nametagSearch.getImageLinkForTag(tag)" />
				<div v-else v-text="tag.slice(0, 1).toUpperCase()"></div>
			</v-avatar>
			{{ tag }}
		</v-chip>
		<span
			v-if="limit > 0 && post.tags.length - limit > 0"
			style="align-self: center; margin-left: 5px;"
			v-text="'and ' + (post.tags.length - limit) + ' more'"
		/>
	</div>
</template>

<script>
export default {
	props: {
		post: {
			required: true,
			type: Object
		},
		nametagSearch: {
			required: true,
			type: Object
		},
		limit: {
			required: false,
			default: 0,
			type: Number
		}
	},
	computed: {
		loggedIn() {
			return this.$store.getters['user/get'].id !== null
		},
		colorScheme() {
			return this.$store.getters['colorscheme/get']
		},
		postTags() {
			return this.limit === 0 ? this.post.tags : this.post.tags.slice(0, this.limit)
		}
	}
}
</script>

<style></style>
