<template>
	<div id="champ-container">
		<ChampionCards :logged-in="loggedIn" :champions="filteredChampions"></ChampionCards>
		<div v-if="loggedIn">
			<AddFab
				v-if="loggedIn && $store.getters['championmodals/getNewChampionModalState'] === false"
				@fabClicked="$store.commit('championmodals/setNewChampionModalState', true)"
			></AddFab>
			<ModalChangelog></ModalChangelog>
			<ModalRemoveChampion></ModalRemoveChampion>
			<ModalAddNewChampion></ModalAddNewChampion>
		</div>
	</div>
</template>

<script>
import ChampionCards from '~/components/GuidesChampionsHome/ChampionCards'
import AddFab from '~/components/General/AddFab'
import ModalChangelog from '~/components/General/ModalChangelog'
import ModalAddNewChampion from '~/components/GuidesChampionsHome/ModalAddNewChampion'
import ModalRemoveChampion from '~/components/GuidesChampionsHome/ModalRemoveChampion'

export default {
	head() {
		return {
			title: 'Champion Guides',
			meta: [
				{
					name: 'description',
					content: 'See all the guides about League of Legends champions made by former C9 coach: OFGSaiph'
				}
			]
		}
	},
	components: {
		ChampionCards,
		ModalChangelog,
		ModalAddNewChampion,
		ModalRemoveChampion,
		AddFab
	},
	data() {
		return {
			showModal: false
		}
	},
	computed: {
		loggedIn() {
			return this.$store.getters['user/getUser'].id !== null
		},
		freeloChampions() {
			return this.$store.getters['champions/getFreeloChampions']
		},
		filteredChampions() {
			const nameFilter = this.$store.getters['filters/getChampionNameFilter']
			const roleFilter = this.$store.getters['filters/getChampionRoleFilter']
			const isRoleFilterEnabled = this.$store.getters['filters/getChampionRoleFilterSwitch']

			const championsFilteredByName =
				nameFilter && nameFilter.length > 0
					? this.freeloChampions.filter(champion => {
							return champion.name.toLowerCase().includes(nameFilter.toLowerCase())
					  })
					: this.freeloChampions

			const championsFilteredByRole = isRoleFilterEnabled
				? championsFilteredByName.filter(champion => {
						return champion.roles.includes(roleFilter)
				  })
				: championsFilteredByName

			return championsFilteredByRole
		}
	}
}
</script>
<style scoped>
#champ-container {
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	align-items: center;
	padding: 0 auto !important;
}
</style>
