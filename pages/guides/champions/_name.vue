<template>
	<div id="wrapper">
		<div id="breadcrumbs">
			<v-breadcrumbs :items="breadcrumbs" divider=">"> </v-breadcrumbs>
		</div>
		<div id="header">
			<v-card id="header-image">
				<v-img contain :src="champion.image"></v-img>
			</v-card>
			<v-card
				id="header-info"
				style="align-items: center; display: flex; justify-content: center;"
				class="white--text"
				color="primary"
			>
				<v-card-text style="display: flex; justify-items: center; flex-direction: column">
					<div style="margin-bottom: 0px" class="headline">{{ champion.name }}</div>
					<div style="margin-bottom: 12px">{{ champion.epithet }}</div>
					<div id="roles" style="margin: -4px">
						<v-chip
							v-for="role in champion.roles"
							:key="role"
							class="text-capitalize grey lighten-3 black--text"
							disabled
							label
							>{{ role }}</v-chip
						>
					</div>
					<div style="margin: -4px; margin-top: 12px">
						<v-chip class="error" disabled>
							<v-avatar>
								<v-icon small class="white error--text">fas fa-fist-raised</v-icon>
							</v-avatar>
							<span class="white--text">{{ champion.power[0] }} - {{ champion.power[1] }}</span>
						</v-chip>
					</div>
				</v-card-text>
			</v-card>
		</div>
		<div id="content">
			<v-card v-for="content in contents" :key="content.title" :class="content.span" class="content-item">
				<v-card-title primary-title>
					<span class="headline">{{ content.title }}</span>
				</v-card-title>
				<v-card-text v-html="content.text"> </v-card-text> <!-- eslint-disable-line -->
			</v-card>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			loggedIn: true,
			contents: [
				{
					title: 'General Information',
					text:
						'<span><p><b>Lorem ipsum</b> dolor sit amet, consectetur adipisicing elit.<div class="title mb-2 font-weight-regular">Other interesting stuff</div> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima nisi est accusantium itaque aspernatur dolores ipsa, sit consectetur ex porro! </span>',
					span: 'span2'
				},
				{
					title: 'Weaknesses',
					text: '<span>Thats a lotta damage and this is very good content btw...</span>',
					span: ''
				},
				{
					title: 'Strengths',
					text: '<span>Thats a lotta damage and this is very good content btw...</span>',
					span: ''
				}
			],
			champion: {
				name: 'Akali',
				epithet: 'the Rogue Assassin',
				roles: ['top', 'middle'],
				freelo: true,
				power: [1, 10],
				image: '//ddragon.leagueoflegends.com/cdn/img/champion/tiles/' + 'Akali' + '_0.jpg'
			},
			breadcrumbs: [
				{
					text: 'Guides',
					disabled: true,
					to: '/guides/champions'
				},
				{
					text: 'Champions',
					disabled: false,
					nuxt: true,
					to: '/guides/champions',
					exact: true
				},
				{
					text: 'Akali',
					disabled: true,
					to: '/guides/champions'
				}
			]
		}
	}
}
</script>

<style>
#wrapper {
	max-width: 740px;
	margin: 0 auto;
}
#splash {
	background-repeat: no-repeat;
	background-position: 60% top;
	width: 100%;
	height: 350px;
}

#header {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 7.5px;
}

#content {
	margin-top: 15px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 15px;
}
.span2 {
	grid-column-start: span 2;
}
.content-item .v-card__title {
	padding-bottom: 0;
}

@media (max-width: 740px) {
	.content-item {
		grid-column-start: span 2;
	}
}

@media (max-width: 520px) {
	#header-image {
		grid-column-start: span 2;
	}
	#header-info {
		grid-column-start: span 2;
	}
}
</style>
