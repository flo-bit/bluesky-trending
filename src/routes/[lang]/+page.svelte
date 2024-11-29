<script lang="ts">
	import Select from '$lib/Select.svelte';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	import { relativeTime } from 'svelte-relative-time';

	import { gsap } from 'gsap';

	import { Flip } from 'gsap/Flip';
	import { tick } from 'svelte';
	import { languageEmojis } from '$lib/emojis';
	import { slide } from 'svelte/transition';

	gsap.registerPlugin(Flip);

	const { data } = $props();

	let liveHashtags: { tag: string; total_count: number }[] = $state([]);

	let selected = $state('last hour');
	let tags = $derived(
		selected == 'last hour'
			? data.lastHourTags
			: selected == 'last day'
				? data.last24HourTags
				: liveHashtags
	);

	let wordCounts = new Map<string, number>();
	let posts = 0;

	let lastUpdateTime = 0;

	let startTime = 0;

	function secondsToMicroseconds(seconds: number) {
		return Math.floor(seconds * 1000000);
	}

	let ws: WebSocket;

	$effect(() => {
		if (selected === 'live') {
			startTime = Date.now() * 1000 - secondsToMicroseconds(60);
			console.log(startTime);

			wordCounts.clear();
			liveHashtags = [];
			posts = 0;

			// WebSocket URL from BlueSky
			const url =
				'wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=app.bsky.feed.post&cursor=' +
				startTime;

			// WebSocket logic
			ws = new WebSocket(url);
			ws.onopen = () => {
				console.log('Connected to BlueSky WebSocket');
			};

			ws.onmessage = (event) => {
				const json = JSON.parse(event.data);

				// console.log(json);
				if (
					json.kind === 'commit' &&
					json.commit.collection === 'app.bsky.feed.post' &&
					json.commit.operation === 'create' &&
					json.commit.record.text
				) {
					if (data.languageCode !== 'en' && json.commit.record.langs) {
						// go through all langs and check if any of them match the language code
						let shouldProcess = false;
						for (let lang of json.commit.record.langs) {
							// remove everything after the first - and trim and lowercase
							const langCode = lang.split('-')[0].toLowerCase().trim();
							if (langCode === data.languageCode) {
								shouldProcess = true;
								break;
							}
						}

						if (!shouldProcess) return;
					}

					// get text of post
					const text: string = json.commit.record.text;

					// check if text contains #
					if (!text.includes('#')) {
						// console.log(json);
						return;
					}

					// find all hashtags
					const hashtags = text.match(/#(\w+)/g);

					hashtags?.forEach((hashtag) => {
						hashtag = hashtag.toLowerCase().replace('#', '');
						wordCounts.set(hashtag, (wordCounts.get(hashtag) || 0) + 1);
					});

					// check if we're up to date

					const postTime = json.time_us;
					if (Date.now() > lastUpdateTime + 1000 && posts > 100) {
						lastUpdateTime = Date.now();

						lastUpdateTimestamp = postTime;

						// get most popular hashtags
						update('live');
					}

					posts++;
				}
			};
		} else {
			if (ws) ws.close();

			lastUpdateTimestamp = data.lastUpdateTimestamp;
		}
	});

	async function update(select: string) {
		const state = Flip.getState('.item', {
			props: 'opacity,y'
		});

		selected = select;

		if (select === 'live') {
			liveHashtags = getMostPopularHashtags(50);
		}

		await tick();

		Flip.from(state, {
			duration: 0.5,
			ease: 'power3.inOut',
			onEnter: (el) => {
				gsap.from(el, { opacity: 0, y: 20, duration: 0.5 });
			},
			onExit: (el: HTMLElement) => {
				gsap.to(el, { opacity: 0, y: -20, duration: 0.5 });
			}
		});
	}

	function getMostPopularHashtags(num: number) {
		// get num most popular hashtags with counts
		const mostPopular = Array.from(wordCounts.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, num)
			.map((el) => {
				return { tag: el[0], total_count: el[1] };
			});
		return mostPopular;
	}

	let lastUpdateTimestamp: number = $state(data.lastUpdateTimestamp);

	let showLanguageSelector = $state(false);
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
	<div class="mb-2 flex justify-end text-3xl">
		{#if !showLanguageSelector}
			<button
				onclick={() => (showLanguageSelector = true)}
				class="transition-transform duration-100 hover:scale-110"
				>{languageEmojis[data.languageCode]}
			</button>
		{/if}

		{#if showLanguageSelector}
			<div
				class="text-md relative mb-4 flex flex-col items-end justify-end rounded-lg bg-base-100 p-2 dark:bg-base-900"
			>
				<div class="max-w-sm">
					<div class="text-sm font-semibold text-base-700 dark:text-base-300">Select Language</div>

					{#each data.languages as language}
						<a
							class="transition-transform duration-100 hover:scale-110"
							href="/bluesky-trending/{language}"
							title={language?.toString()}
							onclick={() => (showLanguageSelector = false)}
							>{languageEmojis[language as keyof typeof languageEmojis]}
						</a>
					{/each}
				</div>

				<button
					class="absolute right-2 top-2 rounded-lg bg-base-200 p-0.5 transition-transform duration-100 hover:scale-110 dark:bg-base-800"
					onclick={() => (showLanguageSelector = false)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="size-4"
					>
						<path
							fill-rule="evenodd"
							d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
							clip-rule="evenodd"
						/>
					</svg>

					<span class="sr-only">close language selector</span>
				</button>
			</div>
		{/if}
	</div>
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

	<Select items={['last hour', 'last day', 'live']} active={selected} onchange={update} />

	<div class="mt-2 text-xs text-base-700 dark:text-base-300">
		last updated <span use:relativeTime={{ date: lastUpdateTimestamp / 1000 }}></span>
	</div>

	<div class="mt-4">
		{#each tags as hashtag}
			<a
				href={'https://bsky.app/hashtag/' + hashtag.tag}
				target="_blank"
				class="item group mb-2 flex w-fit items-baseline text-lg"
				data-flip-id={hashtag.tag}
			>
				<span
					class="font-semibold text-accent-600 transition-colors duration-150 group-hover:text-cyan-500 dark:text-cyan-400 group-hover:dark:text-cyan-300"
					>{hashtag.tag}</span
				>
				<span class="ml-2 text-xs text-base-700 dark:text-base-300">({hashtag.total_count}x)</span>
			</a>
		{/each}

		{#if tags.length === 0}
			<div class="text-sm font-semibold text-base-700 dark:text-base-300">loading...</div>
		{/if}
	</div>
</div>
