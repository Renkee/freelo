<template>
	<v-layout column justify-center align-center>
		<v-flex xs12 sm8 md6>
			<v-card class="pa-1">
				<v-card-title primary-title class="display-2">
					Welcome.
				</v-card-title>
				<v-card-text class="body-1">
					<p>
						Freelo is a tool that helps you develop a framework in your mind with which you can easily reason about
						League of Legends.
					</p>
					<p>If you have any questions, please join OFGSaiph's official <a href="#">discord</a>.</p>
					<v-subheader class="pl-0">
						Created by
					</v-subheader>
					<v-list two-line>
						<v-list-tile
							v-for="person in madeBy"
							:key="person.name"
							:href="person.link"
							target="_blank"
							ripple
							avatar
						>
							<v-list-tile-avatar>
								<img :src="person.avatar" />
							</v-list-tile-avatar>
							<v-list-tile-content>
								<v-list-tile-title>
									{{ person.name }}
								</v-list-tile-title>
								<v-list-tile-sub-title>
									{{ person.text }}
								</v-list-tile-sub-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-list>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn color="primary" flat nuxt to="/guides/champions">Start learning</v-btn>
				</v-card-actions>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script>
export default {
	data() {
		return {
			madeBy: [
				{
					name: 'OFGSaiph',
					avatar: '/madeByAvatars/ofgsaiph.png',
					text: 'Content creator',
					link: 'https://twitch.tv/ofgsaiph'
				},
				{
					name: 'Renkee',
					avatar: '/madeByAvatars/renkee.png',
					text: 'Web developer',
					link: 'https://renkee.eu'
				}
			]
		}
	}
}
</script>
