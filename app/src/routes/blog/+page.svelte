<script lang="ts">
  import Header from '$lib/client/components/Header.svelte';
  import Blog from '$lib/client/blog';
  import showdown from 'showdown';

  const reading_time = (text: string) => {
    const words_per_minute = 200;
    const word_count = text.split(' ').length;
    const minutes = word_count / words_per_minute;
    const read_time = Math.ceil(minutes);
    return read_time;
  };

  const converter = new showdown.Converter({
		emoji: true,
		simplifiedAutoLink: true,
		strikethrough: true,
		tables: true,
		tasklists: true
	});
</script>

<Header uri="dashboard" button_text="Dashboard" site_header={true} />

<main>

    {#each Blog as post}
    <div class="blog-post">
      <h1>{post.name}</h1>
      <small style="opacity: 0.8;">Estimated reading time {reading_time(post.content)} minutes</small>
      <small style="opacity: 0.8;">Published {post.published}, by {post.author}.</small>
      <div style="padding: 10px;" />
      {@html converter.makeHtml(post.content)}
    </div>
    {/each}

  <!-- <h1 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">Nothing here... yet!</h1> -->
</main>

<style>
	:global(body) {
		background: white !important;
	}
  main {
    margin-top: 80px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: black;
  }

  .blog-post {
    width: clamp(300px, 90%, 850px) !important;
    background: #f6f7f9;
    padding: 40px;
    border-radius: 20px;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 750px) {
    .blog-post {
      padding: 0px;
      border-radius: 0px;
      background: transparent;
    }
  }
</style>