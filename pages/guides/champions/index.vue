<template>
	<div id="champ-container">
		<v-card v-for="champion in champions" :key="champion.name" class="card ma-2" style="display: inline-block" :width="225">
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
			<v-card-title>
				<div>
					<h3 class="headline">{{ champion.name }}</h3>
					<span>{{ champion.epithet }}</span>
				</div>
			</v-card-title>
			<v-card-actions>
				<v-tooltip color="primary" bottom>
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
					<span
						>Champion Power: This range represents the extremes of each champion's possible influence/impact over a
						game.
					</span>
				</v-tooltip>
				<v-spacer></v-spacer>
				<v-btn flat nuxt :to="'champions/' + champion.name" class="primary--text">Details</v-btn>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			champions: [
				{
					name: 'Akali',
					epithet: 'the Rogue Assassin',
					roles: ['top', 'middle'],
					freelo: true,
					power: [1, 10],
					splash: '//ddragon.leagueoflegends.com/cdn/img/champion/tiles/' + 'Akali' + '_0.jpg'
				},
				{
					name: 'Aatrox',
					epithet: 'the Angry Russian Boi',
					roles: ['top', 'jungle', 'middle'],
					freelo: true,
					power: [4, 10],
					splash: '//ddragon.leagueoflegends.com/cdn/img/champion/tiles/' + 'Aatrox' + '_0.jpg'
				},
				{
					name: 'Kayle',
					epithet: 'the OP Grill',
					roles: ['top', 'jungle', 'middle', 'support'],
					freelo: true,
					power: [15, 16],
					splash: '//ddragon.leagueoflegends.com/cdn/img/champion/tiles/' + 'Kayle' + '_0.jpg'
				},
				{
					name: 'Kennen',
					epithet: 'the Pikachu',
					roles: ['top'],
					freelo: true,
					power: [2, 14.5],
					splash: '//ddragon.leagueoflegends.com/cdn/img/champion/tiles/' + 'Kennen' + '_0.jpg'
				},
				{
					name: "Kha'zix",
					epithet: 'the Bogárember',
					roles: ['jungle'],
					freelo: true,
					power: [3, 4.5],
					splash: '//ddragon.leagueoflegends.com/cdn/img/champion/tiles/' + 'Khazix' + '_0.jpg'
				},
				{
					name: 'Gragas',
					epithet: 'the Big Boi',
					roles: ['top', 'jungle', 'middle', 'support'],
					freelo: true,
					power: [5, 6],
					splash: '//ddragon.leagueoflegends.com/cdn/img/champion/tiles/' + 'Gragas' + '_0.jpg'
				}
			]
		}
	}
}
</script>

<style scoped>
#champ-container {
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	align-items: center;
	padding: 0 auto !important;
}
#specific-champion-container {
	display: flex !important;
	flex: 1;
}
.card {
	flex: none;
}

.v-image .v-chip {
	margin: 4px 0 0 0;
	border-radius: 5px;
}
.role {
	display: flex;
	flex-flow: column wrap;
	flex: 0 0 100%;
	align-items: flex-end;
	justify-content: flex-end;
	align-content: flex-end;
}
.roles-wrapper {
	height: 100%;
	width: 100%;
	padding: 5px;
	display: flex;
}
</style>
