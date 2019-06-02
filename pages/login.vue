<template>
	<v-card style="max-width: 500px; margin-left: auto; margin-right: auto">
		<v-card-title>
			<h1>Login</h1>
		</v-card-title>

		<v-form @submit.prevent="login">
			<v-card-text>
				<v-alert v-if="loginError" style="margin-bottom: 15px" :value="loginError" color="error">{{
					loginError
				}}</v-alert>
				<v-alert v-if="loginSuccessful" style="margin-bottom: 15px" :value="loginSuccessful" color="success"
					>Successfully logged in!</v-alert
				>

				<v-text-field v-model="formEmail" box label="Email" required></v-text-field>
				<v-text-field v-model="formPassword" type="password" box label="Password" required></v-text-field>
			</v-card-text>
			<v-card-actions
				><v-spacer></v-spacer
				><v-btn color="primary" type="submit">
					Sign in
				</v-btn></v-card-actions
			>
		</v-form>
	</v-card>
</template>

<script>
export default {
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
			return this.$store.getters['csrf/getCSRFToken']
		}
	},
	methods: {
		async login() {
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
				this.loginError = e.message
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
