<template>
	<v-navigation-drawer v-model="enabled" :disable-resize-watcher="true" :clipped="true" fixed app>
		<v-list expand>
			<v-list-tile to="/" nuxt exact>
				<v-list-tile-action>
					<v-icon>home</v-icon>
				</v-list-tile-action>
				<v-list-tile-title>Welcome</v-list-tile-title>
			</v-list-tile>
			<v-list-group prepend-icon="person">
				<template v-slot:activator>
					<v-list-tile>
						<v-list-tile-title>Account</v-list-tile-title>
					</v-list-tile>
				</template>
				<template v-if="!loggedIn">
					<v-list-tile to="/login" nuxt exact avatar>
						<v-list-tile-avatar />
						<v-list-tile-content>
							<v-list-tile-title>Login</v-list-tile-title>
						</v-list-tile-content>
						<v-list-tile-action>
							<v-icon :size="23">fas fa-sign-in</v-icon>
						</v-list-tile-action>
					</v-list-tile>
					<!--<v-list-tile to="/register" nuxt exact avatar>
						<v-list-tile-avatar />
						<v-list-tile-content>
							<v-list-tile-title>Register</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>-->
				</template>

				<template v-else>
					<v-list-tile avatar>
						<v-list-tile-avatar />
						<v-list-tile-content>
							<v-list-tile-title>Logged in</v-list-tile-title>
							<v-list-tile-sub-title>{{ user.email }}</v-list-tile-sub-title>
						</v-list-tile-content>
						<v-list-tile-action />
					</v-list-tile>
					<v-list-tile avatar @click="logout">
						<v-list-tile-avatar />
						<v-list-tile-content>
							<v-list-tile-title>
								Logout
							</v-list-tile-title>
						</v-list-tile-content>
						<v-list-tile-action>
							<v-icon :size="23">fas fa-sign-out</v-icon>
						</v-list-tile-action>
					</v-list-tile>
				</template>
			</v-list-group>
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
</template>

<script>
export default {
	data() {
		return {
			guides: [
				{
					title: 'General',
					to: '/guides/general',
					icon: 'fas fa-asterisk',
					paddingR: '3px'
				},
				{
					title: 'Champions',
					to: '/guides/champions',
					icon: 'fas fa-eye',
					paddingR: '2px'
				}
			]
		}
	},
	computed: {
		user() {
			return this.$store.getters['user/get']
		},
		csrfToken() {
			return this.$store.getters['csrf/getToken']
		},
		loggedIn() {
			return this.user.id !== null
		},
		enabled: {
			get() {
				return this.$store.getters['navigation/getPanelState']
			},
			set(val) {
				this.$store.commit('navigation/setPanelState', val)
			}
		}
	},
	methods: {
		async logout() {
			await this.$store.dispatch('user/logout', { _csrf: this.csrfToken })
		}
	}
}
</script>

<style></style>
