<script lang="ts">
	import SelectItem from './SelectItem.svelte';

	type Props = {
		items: string[];
		active: string;
		onchange: (active: string) => void;
	};

	let { items, active, onchange }: Props = $props();
</script>

<div class="mt-4 inline-block">
	<ul
		class="text-base-800 shadow-base-800/5 ring-base-900/5 dark:text-base-200 flex rounded-full bg-white/90 px-3 text-sm font-medium shadow-lg ring-1 backdrop-blur dark:bg-white/5 dark:ring-white/10"
	>
		{#each items as item}
			<SelectItem
				onclick={() => {
					active = item;
					onchange(item);
				}}
				isActive={active == item}
			>
				{item}
			</SelectItem>
		{/each}
	</ul>
</div>
