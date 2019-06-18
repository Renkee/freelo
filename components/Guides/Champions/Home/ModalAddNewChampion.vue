<template>
	<v-dialog id="add-champ-modal" v-model="showModal" persistent max-width="740">
		<v-card>
			<v-card-title class="headline">Add new champion</v-card-title>
			<v-form>
				<v-card-text>
					<v-container>
						<v-layout row wrap align-center>
							<v-flex xs12>
								<v-overflow-btn
									v-model="addChampion.name"
									v-validate="'required'"
									box
									:error-messages="errors.collect('champion')"
									data-vv-name="champion"
									:items="notFreeloChampionsNames"
									label="Champion"
									editable
									style="margin: 20px"
									required
								></v-overflow-btn>
							</v-flex>
							<v-flex xs12 md6>
								<v-select
									v-model="addChampion.roles"
									v-validate="'required'"
									data-vv-name="role"
									:error-messages="errors.collect('role')"
									:items="[
										{ text: 'Top', value: 'top' },
										{ text: 'Jungle', value: 'jungle' },
										{ text: 'Middle', value: 'middle' },
										{ text: 'Bottom', value: 'bottom' },
										{ text: 'Support', value: 'support' }
									]"
									box
									style="margin: 20px"
									color="primary"
									label="Roles"
									multiple
									chips
									deletable-chips
									required
								></v-select>
							</v-flex>
							<v-flex xs12 md6>
								<v-range-slider
									v-model="addChampion.power"
									box
									style="margin: 20px"
									label="Power"
									:step="0.5"
									:max="30"
									:min="0"
									thumb-label="always"
									required
								></v-range-slider>
							</v-flex>
						</v-layout>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn :loading="addChampionButtonLoading" color="success" @click="submitAddChampionModal()">
						Submit
					</v-btn>
					<v-btn flat @click="disableModal()">
						Cancel
					</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	data() {
		return {
			addChampion: {
				name: null,
				roles: [],
				power: [1, 10]
			},
			addChampionButtonLoading: false
		}
	},
	computed: {
		showModal() {
			return this.$store.getters['championmodals/getNewChampionModalState']
		},
		notFreeloChampions() {
			return this.$store.getters['champions/getNotFreelo']
		},
		notFreeloChampionsNames() {
			return this.notFreeloChampions.map(champ => {
				return champ.name
			})
		},
		csrfToken() {
			return this.$store.getters['csrf/getToken']
		}
	},
	methods: {
		disableModal() {
			this.$store.commit('championmodals/setNewChampionModalState', false)
		},
		getIndexFromRole(role) {
			return ['top', 'jungle', 'middle', 'bottom', 'support'].indexOf(role)
		},
		async submitAddChampionModal() {
			this.addChampionButtonLoading = true
			if (await this.$validator.validateAll()) {
				const champion = this.notFreeloChampions.find(champ => {
					return champ.name === this.addChampion.name
				})
				const { roles, power } = this.addChampion
				roles.sort((a, b) => {
					return this.getIndexFromRole(a) > this.getIndexFromRole(b) ? 1 : -1
				})
				const payload = { championID: champion.mongo_id, toBeChanged: { freelo: true, roles, power } }

				await this.$store.dispatch('champions/changeGeneralData', payload)
				await this.$store.dispatch('champions/changeGeneralDataInDB', { _csrf: this.csrfToken, ...payload })
				this.disableModal()

				// Reset modal items
				this.addChampion = {
					name: null,
					roles: [],
					power: [1, 10]
				}
				this.$validator.reset()
			}
			this.addChampionButtonLoading = false
		}
	}
}
</script>

<style></style>
