<script lang="ts">
  import type { Direction, GlosaList, Mode } from '../lib/types';

  export let list: GlosaList;
  export let onStart: (mode: Mode, direction: Direction) => void;
  export let onBack: () => void;

  let mode: Mode = 'type';
  let direction: Direction = 'en-sv';
</script>

<header>
  <button on:click={onBack}>← Tillbaka</button>
  <strong>v.{list.week}</strong>
</header>

<h1>{list.title}</h1>
<p class="muted">{list.words.length} ord</p>

<div class="card">
  <h2>Läge</h2>
  <div class="grid-2">
    <button
      class:primary={mode === 'type'}
      on:click={() => (mode = 'type')}
    >✍️ Skriv svar</button>
    <button
      class:primary={mode === 'choice'}
      on:click={() => (mode = 'choice')}
    >🔘 Välj rätt (4 alt.)</button>
  </div>
</div>

<div class="card">
  <h2>Riktning</h2>
  <div class="grid-2">
    <button
      class:primary={direction === 'en-sv'}
      on:click={() => (direction = 'en-sv')}
    >🇬🇧 → 🇸🇪<br /><small>Översätt till svenska</small></button>
    <button
      class:primary={direction === 'sv-en'}
      on:click={() => (direction = 'sv-en')}
    >🇸🇪 → 🇬🇧<br /><small>Översätt till engelska</small></button>
  </div>
</div>

<button class="primary" style="width:100%;font-size:1.1rem;padding:1rem"
  on:click={() => onStart(mode, direction)}>
  Starta →
</button>
