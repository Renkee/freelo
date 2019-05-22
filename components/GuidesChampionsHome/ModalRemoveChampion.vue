<template>
	<v-dialog v-model="showModal" max-width="500">
		<v-card>
			<v-card-title class="headline pb-1" v-text="'Are you sure you want to remove ' + champion.name + '?'"></v-card-title>
			<v-card-actions>
				<v-spacer></v-spacer>

				<v-btn
					color="error"
					@click="
						disableModal()
						removeChampion(champion.mongo_id)
					"
				>
					Remove
				</v-btn>

				<v-btn flat @click="disableModal()">
					Close
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	computed: {
		showModal() {
			return this.$store.getters['championmodals/getRemoveChampionModalState']
		},
		champion() {
			return this.$store.getters['championmodals/getRemoveChampionModalChampion']
		}
	},
	methods: {
		disableModal() {
			this.$store.commit('championmodals/setRemoveChampionModalState', false)
		},
		async removeChampion(_id) {
			this.$store.dispatch('champions/changeGeneralChampionData', {
				_id,
				toBeChanged: { freelo: false }
			})
			await this.$store.dispatch('champions/changeGeneralChampionDataOnServer', {
				_id,
				toBeChanged: { freelo: false }
			})
		}
	}
}
</script>

<style></style>
