<script>
import {Article} from 'spaper'
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Article title="Title">
    <p slot="meta">
      Written by Super User on 24 November 2017. Posted in Blog
    </p>
    <p slot="textLead">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur repellendus excepturi</p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corrupti iure totam nam debitis aliquid impedit, et quas omnis aspernatur optio molestias ex laborum quia. Ducimus culpa tempore, veritatis officia delectus dolore dignissimos reprehenderit vero, sunt odit placeat est non molestiae ipsa nam velit in iusto hic quasi similique facere. Maxime?
    </p>
    <p slot="footer">
      <button>Read More</button>
      <button>5 Comments</button>
    </p>
  </Article>
</section>
