<script lang="ts">
	export let data
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article>
	<hgroup>
		<h1>{data.meta.title} <span style="font-weight: normal">by</span> {data.meta.artist}</h1>
	</hgroup>

	<div>
		tags: 
		{#each data.meta.tags as tag}
			<a href={"/tag/"+tag}>{tag}</a>,&nbsp;
		{/each}
	</div>

	<svelte:component this={data.content} />
</article>