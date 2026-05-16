<script lang="ts">
  import type { AnswerRecord, Direction, GlosaList, Word } from '../lib/types';
  import { answerFor, buildChoices, promptFor, shuffle } from '../lib/quizEngine';

  export let list: GlosaList;
  export let direction: Direction;
  export let onDone: (answers: AnswerRecord[]) => void;
  export let onBack: () => void;

  let queue: Word[] = shuffle(list.words);
  let index = 0;
  let answers: AnswerRecord[] = [];
  let picked: string | null = null;

  $: current = queue[index];
  $: promptText = current ? promptFor(current, direction) : '';
  $: expected = current ? answerFor(current, direction) : '';
  $: choices = current ? buildChoices(current, list, direction, 4) : [];

  function pick(choice: string) {
    if (picked !== null) return;
    picked = choice;
    const correct = choice === expected;
    answers = [...answers, { prompt: promptText, expected, given: choice, correct }];
    setTimeout(next, correct ? 600 : 1200);
  }

  function next() {
    picked = null;
    if (index + 1 >= queue.length) {
      onDone(answers);
      return;
    }
    index += 1;
  }
</script>

<header>
  <button on:click={onBack}>← Avbryt</button>
  <span class="progress">{index + 1} / {queue.length}</span>
</header>

<div class="card">
  <div class="progress">Översätt {direction === 'en-sv' ? 'till svenska' : 'till engelska'}</div>
  <div class="prompt">{promptText}</div>

  <div class="stack">
    {#each choices as choice (choice)}
      <button
        on:click={() => pick(choice)}
        disabled={picked !== null}
        class:correct={picked !== null && choice === expected}
        class:wrong={picked === choice && choice !== expected}
        style="font-size:1.1rem"
      >
        {choice}
      </button>
    {/each}
  </div>

  {#if picked !== null && picked !== expected}
    <p class="wrong" style="padding:0.5rem;border-radius:0.5rem;text-align:center;margin-top:0.75rem">
      Rätt svar: <strong>{expected}</strong>
    </p>
  {/if}
</div>
