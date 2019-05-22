<template>
	<div id="champ-container">
		<ChampionCards :logged-in="loggedIn" :champions="filteredChampions"></ChampionCards>
		<div v-if="loggedIn">
			<AddFab v-if="loggedIn" @fabClicked="$store.commit('championmodals/setNewChampionModalState', true)"></AddFab>
			<ModalRemoveChampion></ModalRemoveChampion>
			<ModalAddNewChampion></ModalAddNewChampion>
		</div>
	</div>
</template>

<script>
import ChampionCards from '~/components/GuidesChampionsHome/ChampionCards'
import AddFab from '~/components/General/AddFab'
import ModalAddNewChampion from '~/components/GuidesChampionsHome/ModalAddNewChampion'
import ModalRemoveChampion from '~/components/GuidesChampionsHome/ModalRemoveChampion'

export default {
	components: {
		ChampionCards,
		ModalAddNewChampion,
		ModalRemoveChampion,
		AddFab
	},
	data() {
		return {
			loggedIn: true,
			showModal: false
		}
	},
	computed: {
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
