<template>
	<v-chip
		class="champion-tag"
		disabled
		small
		:color="type === 'champion' ? 'deep-orange' : type === 'item' ? 'blue darken-3' : 'red'"
	>
		<a rel="noopener" title="Wiki page" :href="'https://leagueoflegends.fandom.com/wiki/' + name" target="_blank">
			<v-avatar><img alt="" :src="imageLink"/></v-avatar>
			<span class="champion-tag-text font-weight-medium" style="color: #fff !important;">{{ name }}</span>
		</a>
	</v-chip>
</template>

<script>
export default {
	props: {
		name: { type: String, default: '', required: true },
		imageLink: { type: String, default: '', required: true },
		type: { type: String, default: 'champion', required: true }
	}
}
</script>
<style scoped>
a {
	text-decoration: none;
}
.champion-tag {
	height: 1.2rem !important;
	margin-bottom: 0.1rem !important;
	margin: 0;
}
.champion-tag-text {
	margin-right: 12px;
	margin-left: -3px;
}
.champion-tag a {
	margin-top: 2px !important;
	margin-right: -15px;
}
.champion-tag img {
	height: 1.4rem !important;
	width: 1.4rem !important;
	margin-right: 5px !important;
	margin-bottom: 1px !important;
	margin-top: -2px !important;
}
.champion-tag .v-chip__content .v-avatar {
	margin-right: 0px !important;
}
</style>
