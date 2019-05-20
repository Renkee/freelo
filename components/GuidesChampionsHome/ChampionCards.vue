<template>
	<div style="display: flex; flex-flow: row wrap; justify-content: center">
		<v-card
			v-for="champion in champions"
			:key="champion.name"
			tag="article"
			class="card ma-2"
			style="display: inline-block; flex: none"
			:width="225"
			@mouseover="hovered.push(champion.name)"
			@mouseleave="
				hovered = hovered.filter(champ => {
					return champ !== champion.name
				})
			"
		>
			<transition name="fade">
				<div
					v-if="loggedIn && hovered.includes(champion.name)"
					style="position: absolute; top: 0; left: 0; z-index: 10000"
				>
					<v-btn round color="error" small @click.stop="$set(deleteDialogs, champion.mongo_id, true)">Remove</v-btn>
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
							dark
							style="flex: none; font-size: 11.5px "
							class="primary white--text text-capitalize font-weight-regular"
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
				<v-tooltip color="error" bottom>
					<template v-slot:activator="{ on }">
						<div class="text-xs-center" v-on="on">
							<v-chip class="error" disabled>
								<v-avatar>
									<v-icon small class="white error--text">fas fa-fist-raised</v-icon>
								</v-avatar>
								<span class="white--text">{{ champion.power[0] }} - {{ champion.power[1] }}</span>
							</v-chip>
						</div>
					</template>
					<span>{{ championPowerExplanation }} </span>
				</v-tooltip>
				<v-spacer></v-spacer>
				<v-btn flat nuxt :to="'champions/' + champion.name" class="primary--text">Details</v-btn>
			</v-card-actions>
			<v-dialog v-model="deleteDialogs[champion.mongo_id]" max-width="350">
				<v-card>
					<v-card-title class="headline pb-1">Are you sure?</v-card-title>
					<v-card-actions>
						<v-spacer></v-spacer>

						<v-btn
							color="error"
							@click="
								$set(deleteDialogs, champion.mongo_id, false)
								removeChampion(champion.mongo_id)
							"
						>
							Delete
						</v-btn>

						<v-btn flat @click="$set(deleteDialogs, champion.mongo_id, false)">
							Close
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-card>
	</div>
</template>

<script>
export default {
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
			hovered: [],
			deleteDialogs: [],
			championPowerExplanation:
				"Champion Power: This range represents the extremes of each champion's possible influence/impact over a game."
		}
	},
	methods: {
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

<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
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
