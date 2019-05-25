<template>
	<header>
		<v-card id="header-image">
			<v-img contain :src="champion.splash"></v-img>
		</v-card>
		<v-card id="header-info" style="align-items: center; display: flex; justify-content: center;">
			<v-card-text style="display: flex; justify-items: center; flex-direction: column">
				<div v-if="arrayContainsObjectWithID(contentEdited, 'header')" id="IF_EDITING_HEADER">
					<v-select
						:value="upperCaseChampRoles"
						:items="[
							{ text: 'Top', value: 'top' },
							{ text: 'Jungle', value: 'jungle' },
							{ text: 'Middle', value: 'middle' },
							{ text: 'Bottom', value: 'bottom' },
							{ text: 'Support', value: 'support' }
						]"
						box
						color="primary"
						label="Roles"
						multiple
						chips
						deletable-chips
						@change="changeChampionData('roles', $event)"
					></v-select>
					<v-range-slider
						label="Power"
						:step="0.5"
						:max="30"
						:min="0"
						thumb-label="always"
						:value="champion.power"
						@change="changeChampionData('power', $event)"
					></v-range-slider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" @click="submitHeaderEdit()">Submit</v-btn>
						<v-btn flat @click="cancelHeaderEdit()">Cancel</v-btn>
					</v-card-actions>
				</div>
				<div v-else id="IF_NOT_EDITING_HEADER">
					<div style="margin-bottom: 0px" class="headline">{{ champion.name }}</div>
					<div style="margin-bottom: 12px">{{ champion.epithet }}</div>
					<div id="roles" style="margin: -4px">
						<v-chip
							v-for="role in champion.roles"
							:key="role"
							class="text-capitalize white--text"
							disabled
							color="primary"
							label
							>{{ role }}</v-chip
						>
					</div>
					<div style="margin: -4px; margin-top: 12px">
						<ChampionPower :power="champion.power"></ChampionPower>
					</div>
					<div v-if="loggedIn">
						<v-btn flat style="position: absolute; bottom: 0px; right: 0px" @click="startHeaderEdit()">Edit</v-btn>
					</div>
				</div>
			</v-card-text>
		</v-card>
	</header>
</template>

<script>
import ChampionPower from '~/components/General/ChampionPower'

export default {
	components: {
		ChampionPower
	},
	props: {
		champion: {
			type: Object,
			required: true
		},
		loggedIn: {
			type: Boolean,
			required: true
		}
	},
	computed: {
		contentEdited() {
			return this.$store.getters['championguides/getContentEdited']
		},
		upperCaseChampRoles() {
			return this.champion.roles.map(role => {
				return { text: role[0].toUpperCase() + role.substr(1, 999), value: role }
			})
		}
	},
	methods: {
		getIndexFromRole(role) {
			return ['top', 'jungle', 'middle', 'bottom', 'support'].indexOf(role)
		},
		changeChampionData(type, data) {
			// Order roles so that 'top' is first and 'support' is last
			if (type === 'roles') {
				data.sort((a, b) => {
					return this.getIndexFromRole(a) > this.getIndexFromRole(b) ? 1 : -1
				})
			}
			this.$store.dispatch('champions/changeGeneralChampionData', {
				_id: this.champion.mongo_id,
				toBeChanged: {
					[type]: data
				}
			})
		},
		startHeaderEdit() {
			const { roles, runes, power, freelo } = this.champion
			this.$store.commit('championguides/pushContentEdited', {
				id: 'header',
				stateBeforeEdit: {
					roles,
					runes,
					power,
					freelo
				}
			})
		},
		submitHeaderEdit() {
			this.$store.dispatch('champions/changeGeneralChampionDataOnServer', {
				_id: this.champion.mongo_id,
				toBeChanged: { roles: this.champion.roles, power: this.champion.power }
			})
			this.removeHeaderFromContentEdited()
		},
		cancelHeaderEdit() {
			const headerInfo = this.contentEdited.find(obj => {
				return obj.id === 'header'
			})
			const { roles, runes, power, freelo } = headerInfo.stateBeforeEdit
			this.$store.dispatch('champions/changeGeneralChampionData', {
				_id: this.champion.mongo_id,
				toBeChanged: {
					roles,
					runes,
					power,
					freelo
				}
			})
			this.removeHeaderFromContentEdited()
		},
		removeHeaderFromContentEdited() {
			this.$store.commit('championguides/setContentEdited', this.contentEdited.filter(item => item.id !== 'header'))
		},
		arrayContainsObjectWithID(array, id) {
			return array.find(obj => {
				return obj.id === id
			})
		}
	}
}
</script>

<style scoped>
@media (max-width: 520px) {
	#header-image {
		grid-column-start: span 2;
	}
	#header-info {
		grid-column-start: span 2;
	}
}
header {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 7.5px;
}

header #header-info .v-chip {
	background-color: eee !important;
}
</style>
