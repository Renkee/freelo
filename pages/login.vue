<template>
	<v-card style="max-width: 500px; margin-left: auto; margin-right: auto">
		<v-card-title>
			<h1>Login</h1>
		</v-card-title>

		<v-form @submit.prevent="login">
			<v-card-text>
				<v-alert v-if="loginError && !loggedIn" style="margin-bottom: 15px" :value="loginError" color="error">{{
					loginError
				}}</v-alert>
				<v-alert v-if="loginSuccessful && loggedIn" style="margin-bottom: 15px" :value="loginSuccessful" color="success"
					>Successfully logged in!</v-alert
				>

				<v-text-field v-model="formEmail" box label="Email" required></v-text-field>
				<v-text-field v-model="formPassword" type="password" box label="Password" required></v-text-field>
			</v-card-text>
			<v-card-actions
				><v-spacer></v-spacer
				><v-btn color="primary" :disabled="loggedIn" type="submit">
					Sign in
				</v-btn></v-card-actions
			>
		</v-form>
	</v-card>
</template>

<script>
export default {
	head() {
		return {
			title: 'Login',
			meta: [
				{ name: 'description', content: 'Learn about League of Legends with guides made by former C9 coach: OFGSaiph' }
			]
		}
	},
	data() {
		return {
			formEmail: '',
			formPassword: '',
			loginError: null,
			loginSuccessful: null
		}
	},
	computed: {
		csrfToken() {
			return this.$store.getters['csrf/getToken']
		},
		loggedIn() {
			return this.$store.getters['user/get'].id !== null
		}
	},
	methods: {
		async login() {
			if (this.loggedIn) return
			this.loginSuccessful = null
			try {
				await this.$store.dispatch('user/login', {
					email: this.formEmail,
					password: this.formPassword,
					_csrf: this.csrfToken
				})
				this.formEmail = ''
				this.formPassword = ''
				this.loginError = null
				this.loginSuccessful = true
			} catch (e) {
				if (e.response) {
					this.loginError = e.response.data.message
				} else if (e.message) {
					this.loginError = e.message
				} else {
					this.loginError = 'Unkown error'
				}
			}
		}
		/* async register() {
			try {
				await this.$store.dispatch('user/register', {
					email: this.formRegisterEmail,
					password: this.formRegisterPassword,
					_csrf: this.csrfToken
				})
				this.formRegisterEmail = ''
				this.formRegisterPassword = ''
				this.registerError = null
			} catch (e) {
				this.registerError = e.message
			}
		},
		async logout() {
			await this.$store.dispatch('user/logout', { _csrf: this.csrfToken })
        } */
	}
}
</script>

<style></style>
