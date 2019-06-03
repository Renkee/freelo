<template>
	<v-app :dark="colorScheme">
		<v-navigation-drawer v-model="drawerFilter" class="" app right clipped disable-resize-watcher>
			<div class="pa-4 mb-3">
				<div style="float: left" class="title">Filters</div>
				<v-icon style="float: right" :size="24" @click="drawerFilter = !drawerFilter">close</v-icon>
			</div>
			<v-divider></v-divider>
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
			<v-divider></v-divider>
		</v-navigation-drawer>
		<v-toolbar clipped-left clipped-right color="primary" :dark="!colorScheme" :light="colorScheme" fixed app>
			<v-toolbar-side-icon aria-label="Open navigation menu" @click.stop="drawerNav = !drawerNav" />
			<v-toolbar-title v-text="title" />
			<v-spacer />
			<v-btn
				v-if="this.$route.name === 'guides-champions'"
				aria-label="Open filter menu"
				icon
				flat
				@click.stop="drawerFilter = !drawerFilter"
			>
				<v-icon>filter_list</v-icon>
			</v-btn>

			<v-btn aria-label="Toggle dark mode" flat icon @click="toggleDarkMode">
				<v-icon v-if="colorScheme" :size="20">fas fa-moon</v-icon>
				<v-icon v-else :size="20">fas fa-sun</v-icon>
			</v-btn>
		</v-toolbar>
		<v-navigation-drawer v-model="drawerNav" :disable-resize-watcher="true" :clipped="true" fixed app>
			<v-list>
				<v-list-tile to="/" nuxt exact>
					<v-list-tile-action>
						<v-icon>home</v-icon>
					</v-list-tile-action>
					<v-list-tile-title>Welcome</v-list-tile-title>
				</v-list-tile>
				<v-list-group prepend-icon="apps" value="true">
					<template v-slot:activator>
						<v-list-tile>
							<v-list-tile-title>Guides</v-list-tile-title>
						</v-list-tile>
					</template>
					<v-list-tile v-for="guide in guides" :key="guide.title" :to="guide.to" nuxt exact>
						<v-list-tile-action> </v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title v-text="guide.title" />
						</v-list-tile-content>
						<v-list-tile-action>
							<v-icon :style="`padding-right: ${guide.paddingR}`" :size="18">{{ guide.icon }}</v-icon>
						</v-list-tile-action>
					</v-list-tile>
				</v-list-group>
			</v-list>
		</v-navigation-drawer>

		<v-content>
			<v-container>
				<nuxt />
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
export default {
	data() {
		return {
			title: 'Freelo',
			roles: ['top', 'jungle', 'middle', 'bottom', 'support'],
			roleSwitch: [],
			filteredRole: '',
			drawerNav: false,
			drawerFilter: false,
			guides: [
				{
					title: 'Champions',
					to: '/guides/champions',
					icon: 'fas fa-asterisk',
					paddingR: '3px'
				},
				{
					title: 'Runes',
					to: '/guides/runes',
					icon: 'fas fa-book-spells',
					paddingR: '4px'
				},
				{
					title: 'Items',
					to: '/guides/items',
					icon: 'fas fa-sword',
					paddingR: '3px'
				}
			]
		}
	},
	computed: {
		colorScheme() {
			return this.$store.getters['colorscheme/getColorScheme']
		}
	},
	watch: {
		'$route.name'(val) {
			if (val !== 'guides-champions') {
				this.drawerFilter = false
			}
		},
		roleSwitch() {
			this.$store.commit('filters/setChampionRoleFilterSwitch', this.roleSwitch !== null)
		}
	},
	methods: {
		toggleDarkMode() {
			this.$store.dispatch('colorscheme/toggleColorScheme')
			this.$store.dispatch('colorscheme/changeColorSchemePreferenceInLocalStorage', !this.colorScheme ? 'light' : 'dark')
		},
		getAssetByRole(role) {
			return '/roleImgs/' + role + '.png'
		}
	}
}
</script>

<style scoped></style>
