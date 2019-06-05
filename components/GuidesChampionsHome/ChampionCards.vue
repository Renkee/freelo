<template>
	<div style="display: flex; flex-flow: row wrap; justify-content: center">
		<v-card
			v-for="champion in champions"
			:key="champion.name"
			tag="article"
			class="card ma-2 champion-card"
			style="display: inline-block; min-width: 225px"
			:width="225"
			@mouseover="hovered.push(champion.name)"
			@mouseleave="
				hovered = hovered.filter(champ => {
					return champ !== champion.name
				})
			"
		>
			<transition name="fade">
				<div v-if="loggedIn && hovered.includes(champion.name)" style="position: absolute; top: 0; left: 0; z-index: 1">
					<v-btn round color="error" small @click.stop="enableRemoveModal(champion)">Remove</v-btn>
				</div>
			</transition>
			<v-img :height="200" :src="champion.splash">
				<div class="roles-wrapper">
					<div class="role">
						<v-chip
							v-for="role in champion.roles"
							:key="role"
							small
							label
							disabled
							style="flex: none; font-size: 11.5px "
							:style="colorScheme ? 'color: #000 !important;' : 'color: #fff !important;'"
							class="primary text-capitalize font-weight-regular"
							>{{ role }}</v-chip
						>
					</div>
				</div>
			</v-img>
			<header>
				<v-card-title>
					<div>
						<h3 class="headline">{{ champion.name }}</h3>
						<span>{{ champion.epithet }}</span>
					</div>
				</v-card-title>
			</header>
			<v-card-actions>
				<ChampionPower :power="champion.power"></ChampionPower>
				<v-spacer></v-spacer>
				<v-btn flat color="primary" nuxt :to="'champions/' + champion.name">Details</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
import ChampionPower from '~/components/General/ChampionPower'

export default {
	components: {
		ChampionPower
	},
	props: {
		loggedIn: {
			type: Boolean,
			required: true
		},
		champions: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			hovered: []
		}
	},
	computed: {
		colorScheme() {
			return this.$store.getters['colorscheme/getColorScheme']
		}
	},
	methods: {
		enableRemoveModal(champion) {
			this.$store.commit('championmodals/setRemoveChampionModalChampion', champion)
			this.$store.commit('championmodals/setRemoveChampionModalState', true)
		}
	}
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.champion-card {
	flex: none;
}

@media (max-width: 530px) {
	.champion-card {
		flex: 1 !important;
	}
}

.roles-wrapper {
	height: 100%;
	width: 100%;
	padding: 5px;
	display: flex;
}
.role {
	display: flex;
	flex-flow: column wrap;
	flex: 0 0 100%;
	align-items: flex-end;
	justify-content: flex-end;
	align-content: flex-end;
}
.card {
	flex: none;
}

.v-image .v-chip {
	margin: 4px 0 0 0;
	border-radius: 5px;
}
</style>
