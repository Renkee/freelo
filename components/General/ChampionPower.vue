<template>
	<v-tooltip color="error" bottom>
		<template v-slot:activator="{ on }">
			<div style="display: inline" class="text-xs-center" v-on="on">
				<v-chip class="error" disabled>
					<v-avatar>
						<v-icon small class="white error--text">fas fa-fist-raised</v-icon>
					</v-avatar>
					<span class="white--text">{{ power[0] }} - {{ power[1] }}</span>
				</v-chip>
			</div>
		</template>
		<span>{{ championPowerExplanation }} </span>
	</v-tooltip>
</template>

<script>
export default {
	props: {
		power: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			championPowerExplanation:
				"Champion Power: This range represents the extremes of each champion's possible influence/impact over a game."
		}
	}
}
</script>

<style></style>
