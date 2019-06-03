<template>
	<div id="wrapper">
		<div id="breadcrumbs">
			<v-breadcrumbs :items="breadcrumbs" divider=">" />
		</div>
		<ChampionContentHeader :logged-in="loggedIn" :champion="championByRoute"></ChampionContentHeader>
		<ChampionContentMain :logged-in="loggedIn" :champion="championByRoute"></ChampionContentMain>
		<footer>
			<div style="min-height: 250px; width: 100%"></div>
		</footer>
	</div>
</template>

<script>
import ChampionContentHeader from '~/components/GuidesChampionsName/ChampionContentHeader'
import ChampionContentMain from '~/components/GuidesChampionsName/ChampionContentMain'

export default {
	head() {
		return {
			title: `${this.championByRoute.name} Champion Guide`,
			meta: [
				{
					name: 'description',
					content: `Learn about ${this.championByRoute.name} with this guide made by former C9 coach: OFGSaiph`
				}
			]
		}
	},
	components: {
		ChampionContentHeader,
		ChampionContentMain
	},
	computed: {
		loggedIn() {
			return this.$store.getters['user/getUser'].id !== null
		},
		championByRoute() {
			const freelo = this.$store.getters['champions/getFreeloChampions']
			const name = this.$route.params.name
			const champion = freelo.find(champ => {
				return champ.name === name || champ.api_name === name
			})
			return champion
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
					text: 'Champions',
					disabled: false,
					nuxt: true,
					to: '/guides/champions',
					exact: true
				},
				{
					text: this.championByRoute.name,
					disabled: true,
					tag: 'span',
					to: '/guides/champions'
				}
			]
		}
	}
}
</script>

<style>
#wrapper {
	max-width: 740px;
	margin: 0 auto;
}
#breadcrumbs a:not(.v-breadcrumbs__item--disabled) {
	text-decoration: underline !important;
}
</style>
