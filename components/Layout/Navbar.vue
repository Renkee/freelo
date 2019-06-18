<template>
	<v-toolbar clipped-left clipped-right color="primary" :dark="!colorScheme" :light="colorScheme" fixed app>
		<v-toolbar-side-icon aria-label="Open navigation menu" @click.stop="navigationDrawerState = !navigationDrawerState" />
		<v-toolbar-title v-text="title" />
		<v-spacer />
		<v-btn
			v-if="this.$route.name === 'guides-champions' || this.$route.name === 'guides-general'"
			aria-label="Open filter menu"
			icon
			flat
			@click.stop="filterPanelState = !filterPanelState"
		>
			<v-icon>filter_list</v-icon>
		</v-btn>
		<v-btn
			v-if="this.$route.name === 'guides-champions'"
			aria-label="Open changelogs"
			flat
			icon
			@click="enableChangelogModal"
		>
			<v-icon>assignment</v-icon>
		</v-btn>
		<v-btn aria-label="Toggle dark mode" flat icon @click="toggleDarkMode">
			<v-icon v-if="colorScheme" :size="20">fas fa-moon</v-icon>
			<v-icon v-else :size="20">fas fa-sun</v-icon>
		</v-btn>
	</v-toolbar>
</template>

<script>
export default {
	data() {
		return {
			title: 'Freelo'
		}
	},
	computed: {
		colorScheme() {
			return this.$store.getters['colorscheme/get']
		},
		filterPanelState: {
			get() {
				return this.$store.getters['filters/getFilterPanelState']
			},
			set(val) {
				this.$store.commit('filters/setFilterPanelEnabled', val)
			}
		},
		navigationDrawerState: {
			get() {
				return this.$store.getters['navigation/getPanelState']
			},
			set(val) {
				this.$store.commit('navigation/setPanelState', val)
			}
		}
	},
	methods: {
		toggleDarkMode() {
			this.$store.dispatch('colorscheme/toggle')
			this.$store.dispatch('colorscheme/changePreferenceInLocalStorage', !this.colorScheme ? 'light' : 'dark')
		},
		enableChangelogModal() {
			this.$store.commit('changelog/setState', true)
		}
	}
}
</script>

<style></style>
