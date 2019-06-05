<template>
	<v-dialog id="changelog-modal" v-model="showModal" max-width="600">
		<v-card>
			<v-card-title><h1>Changelog</h1></v-card-title>
			<v-card-text>
				<v-list>
					<v-list-group v-for="(change, index) in changes" :key="change.key" v-model="changesActive[index]" no-action>
						<template v-slot:activator>
							<v-list-tile avatar>
								<v-list-tile-avatar>
									<img :src="change.splash" />
								</v-list-tile-avatar>
								<v-list-tile-content>
									<v-list-tile-title>{{ change.name }}</v-list-tile-title>
									<v-list-tile-sub-title>
										{{ change.changes.length + (change.changes.length === 1 ? ' change' : ' changes') || '' }}
										<span>●</span>
										<Timeago :datetime="change.time"></Timeago
									></v-list-tile-sub-title>
								</v-list-tile-content>
							</v-list-tile>
						</template>

						<v-list-tile v-for="step in change.changes" :key="step.key">
							<v-list-tile-content>
								<v-list-tile-title>{{ step.title }}</v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-list-group>
				</v-list>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn flat @click="disableModal">Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	data() {
		return {
			changesActive: new Array(200).map(() => false)
		}
	},
	computed: {
		showModal: {
			get() {
				return this.$store.getters['changelog/getState']
			},
			set(val) {
				this.$store.commit('changelog/setState', val)
			}
		},
		changes() {
			return this.$store.getters['changelog/getChanges']
		}
	},
	methods: {
		disableModal() {
			this.$store.commit('changelog/setState', false)
		}
	}
}
</script>

<style></style>
