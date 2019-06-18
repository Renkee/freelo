<template>
	<v-navigation-drawer id="filters" v-model="enabled" class app right clipped disable-resize-watcher>
		<div class="pa-4 mb-3">
			<div style="float: left" class="title">Filters</div>
			<v-icon style="float: right" :size="24" @click="enabled = false">close</v-icon>
		</div>
		<v-divider></v-divider>
		<div v-if="$route.name === 'guides-general'">
			<v-combobox
				class="mx-4 mt-3"
				hide-selected
				label="Tags"
				multiple
				chips
				:value="filteredTags"
				@change="$store.commit('filters/setGeneralFiltersTags', $event)"
			>
				<template v-slot:selection="data">
					<v-chip
						:color="nametagSearch.getBGOfTag(data.item)"
						:style="
							colorScheme && !nametagSearch.checkForTag(data.item)
								? 'color: #000 !important;'
								: 'color: #fff !important;'
						"
						@click="data.parent.selectItem(data.item)"
					>
						<v-avatar
							v-if="nametagSearch.checkForTag(data.item)"
							class="primary darken-3"
							style="color: #fff !important;"
						>
							<img :src="nametagSearch.getImageLinkForTag(data.item)" />
						</v-avatar>
						{{ data.item }}
					</v-chip>
				</template>
			</v-combobox>
		</div>
		<div v-if="$route.name === 'guides-champions'">
			<v-text-field
				clearable
				class="mx-4 mt-1"
				label="Search by name"
				@input="$store.commit('filters/setChampionNameFilter', $event)"
			></v-text-field>
			<v-divider></v-divider>
			<div class="ma-3">
				<v-expansion-panel v-model="roleSwitch">
					<v-expansion-panel-content ripple>
						<template v-slot:header>
							<div>Roles</div>
						</template>
						<v-card>
							<v-card-text>
								<v-radio-group v-model="filteredRole" class="mt-0">
									<v-radio
										v-for="role in roles"
										:key="role"
										class="mb-3 text-capitalize"
										color="primary"
										:label="role"
										:value="role"
										@change="$store.commit('filters/setChampionRoleFilter', $event)"
									></v-radio>
								</v-radio-group>
							</v-card-text>
						</v-card>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</div>
		</div>

		<v-divider></v-divider>
	</v-navigation-drawer>
</template>

<script>
import NametagSearch from '~/utils/nametagSearch.js'
export default {
	data() {
		return {
			roles: ['top', 'jungle', 'middle', 'bottom', 'support'],
			roleSwitch: [],
			filteredRole: '',
			nametagSearch: new NametagSearch(this.$store)
		}
	},
	computed: {
		enabled: {
			get() {
				return this.$store.getters['filters/getFilterPanelState']
			},
			set(val) {
				this.$store.commit('filters/setFilterPanelEnabled', val)
			}
		},
		colorScheme() {
			return this.$store.getters['colorscheme/get']
		},
		filteredTags() {
			return this.$store.getters['filters/getGeneralFiltersTags']
		}
	},
	watch: {
		roleSwitch() {
			this.$store.commit('filters/setChampionRoleFilterSwitch', this.roleSwitch !== null)
		},
		'$route.name'(val) {
			if (val !== 'guides-champions' && val !== 'guides-general') {
				this.enabled = false
			}
		}
	},
	mounted() {
		this.nametagSearch.enableNametags()
	}
}
</script>

<style>
#filters .v-chip .v-chip__content {
	cursor: pointer !important;
}
</style>
