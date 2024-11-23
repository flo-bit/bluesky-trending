<script lang="ts">
	import Select from '$lib/Select.svelte';
	import ThemeToggle from '$lib/ThemeToggle.svelte';

	const { data } = $props();

	let selected = $state('last hour');
	let tags = $derived(selected == 'last hour' ? data.lastHourTags : data.last24HourTags);
</script>

<div class="absolute left-4 right-4 top-4 flex items-start justify-between">
	<!-- <button onclick={() => (showLanguageSelector = true)}>
		{languageEmojis[data.languageCode]}
	</button> -->
	<div class="text-xs font-medium text-base-700 dark:text-base-300">
		made by
		<a
			href="https://flo-bit.dev"
			target="_blank"
			class="text-accent-600 hover:text-accent-500 dark:text-cyan-500 dark:hover:text-accent-400"
			>flo-bit</a
		>
	</div>

	<ThemeToggle class="size-6" />
</div>

<div class="mx-auto max-w-xl px-4 py-16 text-black dark:text-white">
	<div class="flex items-center gap-2 text-2xl font-bold text-black dark:text-white">
		Most Popular Hashtags on <svg
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="-40 -40 680 620"
			version="1.1"
			class="size-7 fill-cyan-500 dark:fill-cyan-400"
		>
			<path
				d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z"
			></path>
		</svg>
	</div>

	<Select items={['last hour', 'last day']} bind:active={selected} />

	<div class="mt-4">
		{#each tags as hashtag}
			<a
				href={'https://bsky.app/hashtag/' + hashtag.tag}
				target="_blank"
				class="item group mb-2 flex w-fit items-baseline text-lg"
				data-flip-id={hashtag.tag}
			>
				<span
					class="font-semibold text-accent-500 transition-colors duration-150 group-hover:text-cyan-500 dark:text-cyan-400"
					>{hashtag.tag}</span
				>
				<span class="ml-2 text-xs text-base-700 dark:text-base-300">({hashtag.total_count}x)</span>
			</a>
		{/each}
	</div>
</div>
