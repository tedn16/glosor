<script lang="ts">
  import { tick } from 'svelte';
  import type { AnswerRecord, Direction, GlosaList, Word } from '../lib/types';
  import { answerFor, isCorrect, promptFor, shuffle } from '../lib/quizEngine';

  export let list: GlosaList;
  export let direction: Direction;
  export let onDone: (answers: AnswerRecord[]) => void;
  export let onBack: () => void;

  let queue: Word[] = shuffle(list.words);
  let index = 0;
  let value = '';
  let feedback: 'idle' | 'correct' | 'wrong' = 'idle';
  let answers: AnswerRecord[] = [];
  let inputEl: HTMLInputElement | undefined;

  $: current = queue[index];
  $: promptText = current ? promptFor(current, direction) : '';
  $: expected = current ? answerFor(current, direction) : '';

  async function focusInput() {
    await tick();
    inputEl?.focus();
  }

  function submit() {
    if (!current || feedback !== 'idle') return;
    const given = value;
    const correct = isCorrect(given, expected);
    feedback = correct ? 'correct' : 'wrong';
    answers = [...answers, { prompt: promptText, expected, given, correct }];
  }

  async function next() {
    feedback = 'idle';
    value = '';
    if (index + 1 >= queue.length) {
      onDone(answers);
      return;
    }
    index += 1;
    await focusInput();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (feedback === 'idle') submit();
      else next();
    }
  }

  focusInput();
</script>

<header>
  <button on:click={onBack}>← Avbryt</button>
  <span class="progress">{index + 1} / {queue.length}</span>
</header>

<div class="card">
  <div class="progress">Översätt {direction === 'en-sv' ? 'till svenska' : 'till engelska'}</div>
  <div class="prompt">{promptText}</div>

  <input
    bind:this={inputEl}
    bind:value
    on:keydown={onKeyDown}
    type="text"
    inputmode="text"
    autocapitalize="off"
    autocorrect="off"
    autocomplete="off"
    spellcheck="false"
    placeholder="Ditt svar…"
    disabled={feedback !== 'idle'}
    class:correct={feedback === 'correct'}
    class:wrong={feedback === 'wrong'}
  />

  {#if feedback === 'correct'}
    <p class="correct" style="padding:0.5rem;border-radius:0.5rem;text-align:center;margin-top:0.75rem">✅ Rätt!</p>
  {:else if feedback === 'wrong'}
    <p class="wrong" style="padding:0.5rem;border-radius:0.5rem;text-align:center;margin-top:0.75rem">
      ❌ Rätt svar: <strong>{expected}</strong>
    </p>
  {/if}

  <div style="margin-top:1rem">
    {#if feedback === 'idle'}
      <button class="primary" style="width:100%" on:click={submit} disabled={!value.trim()}>Svara</button>
    {:else}
      <button class="primary" style="width:100%" on:click={next}>
        {index + 1 >= queue.length ? 'Visa resultat' : 'Nästa →'}
      </button>
    {/if}
  </div>
</div>
