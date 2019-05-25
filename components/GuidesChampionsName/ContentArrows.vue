<template>
	<div>
		<v-btn
			v-if="
				arrowCalculationsArray[index] % 2 === 0 &&
					content.span === 1 &&
					champion.contents[index - 1] &&
					champion.contents[index - 1].span === 1
			"
			aria-label="Move content"
			flat
			icon
			@click="swapContent(index, -1)"
		>
			<v-icon>keyboard_arrow_left</v-icon>
		</v-btn>
		<v-btn
			v-if="
				arrowCalculationsArray[index] % 2 === 0 &&
					content.span === 1 &&
					champion.contents[index - 1] &&
					champion.contents[index - 1].span === 2
			"
			aria-label="Move content"
			flat
			icon
			@click="swapContent(index, -1)"
		>
			<v-icon>keyboard_arrow_up</v-icon>
		</v-btn>
		<v-btn
			v-if="arrowCalculationsArray[index] % 2 === 0 && content.span === 1 && index < champion.contents.length - 1"
			aria-label="Move content"
			flat
			icon
			@click="swapContent(index, 1)"
		>
			<v-icon>keyboard_arrow_down</v-icon>
		</v-btn>
		<v-btn
			v-if="arrowCalculationsArray[index] % 2 === 0 && content.span === 2 && index > 0"
			aria-label="Move content"
			flat
			icon
			@click="swapContent(index, -1)"
		>
			<v-icon>keyboard_arrow_up</v-icon>
		</v-btn>
		<v-btn
			v-if="arrowCalculationsArray[index] % 2 === 0 && content.span === 2 && index < champion.contents.length - 1"
			aria-label="Move content"
			flat
			icon
			@click="swapContent(index, 1)"
		>
			<v-icon>keyboard_arrow_down</v-icon>
		</v-btn>
		<v-btn
			v-if="arrowCalculationsArray[index] % 2 === 1 && content.span === 1 && index > 0"
			aria-label="Move content"
			flat
			icon
			@click="swapContent(index, -1)"
		>
			<v-icon>keyboard_arrow_up</v-icon>
		</v-btn>
		<v-btn
			v-if="
				arrowCalculationsArray[index] % 2 === 1 &&
					content.span === 1 &&
					index < champion.contents.length - 1 &&
					champion.contents[index + 1] &&
					champion.contents[index + 1].span === 1
			"
			aria-label="Move content"
			flat
			icon
			@click="swapContent(index, 1)"
		>
			<v-icon>keyboard_arrow_right</v-icon>
		</v-btn>
		<v-btn
			v-if="
				arrowCalculationsArray[index] % 2 === 1 &&
					content.span === 1 &&
					index < champion.contents.length - 1 &&
					champion.contents[index + 1] &&
					champion.contents[index + 1].span === 2
			"
			aria-label="Move content"
			flat
			icon
			@click="swapContent(index, 1)"
		>
			<v-icon>keyboard_arrow_down</v-icon>
		</v-btn>
		<v-btn
			v-if="arrowCalculationsArray[index] % 2 === 1 && content.span === 2 && index > 0"
			aria-label="Move content"
			flat
			icon
			@click="swapContent(index, -1)"
		>
			<v-icon>keyboard_arrow_up</v-icon>
		</v-btn>
		<v-btn
			v-if="arrowCalculationsArray[index] % 2 === 1 && content.span === 2 && index < champion.contents.length - 1"
			aria-label="Move content"
			flat
			icon
			@click="swapContent(index, 1)"
		>
			<v-icon>keyboard_arrow_down</v-icon>
		</v-btn>
	</div>
</template>

<script>
export default {
	props: {
		champion: {
			type: Object,
			required: true
		},
		content: {
			type: Object,
			required: true
		},
		index: {
			type: Number,
			required: true
		}
	},
	computed: {
		arrowCalculationsArray() {
			const sumArray = []
			for (let i = 0; i < this.champion.contents.length; i++) {
				if (i === 0) {
					sumArray[i] = this.champion.contents[i].span
				} else {
					sumArray[i] = this.champion.contents[i].span + parseInt(sumArray[i - 1])
				}
			}
			return sumArray
		},
		contentCreated() {
			return this.$store.getters['championguides/getContentCreated']
		}
	},
	methods: {
		swapContent(index, dir) {
			if (index + dir < this.champion.contents.length && index + dir > -1) {
				if (!this.contentCreated.includes(this.champion.contents[index + dir].id)) {
					this.$store.dispatch('champions/swapContentOfChampionByIndexAndDirection', {
						_id: this.champion.mongo_id,
						index,
						dir
					})
				}
			}
		}
	}
}
</script>

<style></style>
