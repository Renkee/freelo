<template>
	<v-app :dark="colorScheme">
		<NavigationDrawer />
		<Navbar />
		<Filters />

		<v-content>
			<v-container>
				<nuxt />
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import Filters from '~/components/Layout/Filters'
import Navbar from '~/components/Layout/Navbar'
import NavigationDrawer from '~/components/Layout/NavigationDrawer'
export default {
	components: {
		Filters,
		Navbar,
		NavigationDrawer
	},
	computed: {
		colorScheme() {
			return this.$store.getters['colorscheme/get']
		}
	}
}
</script>

<style scoped></style>
