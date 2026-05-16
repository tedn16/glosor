<script lang="ts">
  import type { AnswerRecord, GlosaList } from '../lib/types';

  export let list: GlosaList;
  export let answers: AnswerRecord[];
  export let onRetry: () => void;
  export let onBack: () => void;

  $: correctCount = answers.filter((a) => a.correct).length;
  $: total = answers.length;
  $: percent = total === 0 ? 0 : Math.round((correctCount / total) * 100);
  $: wrong = answers.filter((a) => !a.correct);
  $: emoji = percent === 100 ? '🏆' : percent >= 80 ? '🎉' : percent >= 50 ? '👍' : '💪';
</script>

<header>
  <button on:click={onBack}>← Hem</button>
  <span class="progress">{list.title}</span>
</header>

<div class="card" style="text-align:center">
  <div style="font-size:3rem">{emoji}</div>
  <h1 style="margin:0.5rem 0">{correctCount} av {total} rätt</h1>
  <p class="muted">{percent}%</p>
</div>

{#if wrong.length > 0}
  <div class="card">
    <h2>Att öva mer på</h2>
    <div class="stack">
      {#each wrong as a}
        <div style="border:1px solid var(--border);border-radius:0.5rem;padding:0.6rem 0.8rem">
          <div><strong>{a.prompt}</strong> = <span class="correct" style="padding:0.1rem 0.4rem;border-radius:0.3rem">{a.expected}</span></div>
          {#if a.given.trim()}
            <div class="muted" style="font-size:0.85rem">Du svarade: <span class="wrong" style="padding:0.1rem 0.4rem;border-radius:0.3rem">{a.given}</span></div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}

<div class="row">
  <button class="primary" style="flex:1" on:click={onRetry}>🔁 Öva igen</button>
  <button style="flex:1" on:click={onBack}>🏠 Hem</button>
</div>
