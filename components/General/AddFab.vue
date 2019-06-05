<template>
	<v-fab-transition>
		<v-btn
			v-show="fabToggle"
			id="addFab"
			aria-label="Add new"
			fixed
			absolute
			fab
			:style="colorScheme ? 'color: #000 !important;' : 'color: #fff !important;'"
			color="primary"
			@click="$emit('fabClicked')"
		>
			<v-icon>add</v-icon>
		</v-btn>
	</v-fab-transition>
</template>

<script>
export default {
	data() {
		return {
			fabToggle: false
		}
	},
	computed: {
		colorScheme() {
			return this.$store.getters['colorscheme/get']
		}
	},
	created() {
		setTimeout(() => {
			this.fabToggle = !this.fabToggle
		}, 200)
	}
}
</script>

<style>
#addFab {
	bottom: 25px;
	right: 25px;
	z-index: 10000;
}
.v-icon {
	display: inline-flex !important;
}
</style>
