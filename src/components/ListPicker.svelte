<script lang="ts">
  import type { GlosaList } from '../lib/types';
  export let lists: GlosaList[];
  export let onPick: (list: GlosaList) => void;
</script>

<h1>Glosförhör</h1>
<p class="muted">Välj en läxa att öva på.</p>

{#if lists.length === 0}
  <div class="card">
    <p>Inga glosor hittades. Lägg en <code>.md</code>-fil i <code>glosor/</code>.</p>
  </div>
{:else}
  <div class="stack">
    {#each lists as list (list.id)}
      <button class="card" style="text-align:left" on:click={() => onPick(list)}>
        <div style="font-weight:600">Vecka {list.week} — {list.title}</div>
        <div class="muted" style="font-size:0.875rem">{list.words.length} ord</div>
      </button>
    {/each}
  </div>
{/if}
