<script lang="ts">
  import type { AnswerRecord, Direction, GlosaList, Mode } from './lib/types';
  import { loadAllGlosor } from './lib/loadGlosor';
  import ListPicker from './components/ListPicker.svelte';
  import ModePicker from './components/ModePicker.svelte';
  import QuizType from './components/QuizType.svelte';
  import QuizChoice from './components/QuizChoice.svelte';
  import Result from './components/Result.svelte';

  type View =
    | { kind: 'list' }
    | { kind: 'mode'; list: GlosaList }
    | { kind: 'quiz'; list: GlosaList; mode: Mode; direction: Direction }
    | { kind: 'result'; list: GlosaList; mode: Mode; direction: Direction; answers: AnswerRecord[] };

  const lists = loadAllGlosor();
  let view: View = { kind: 'list' };

  function pickList(list: GlosaList) {
    view = { kind: 'mode', list };
  }
  function start(list: GlosaList, mode: Mode, direction: Direction) {
    view = { kind: 'quiz', list, mode, direction };
  }
  function done(answers: AnswerRecord[]) {
    if (view.kind !== 'quiz') return;
    view = { kind: 'result', list: view.list, mode: view.mode, direction: view.direction, answers };
  }
  function retry() {
    if (view.kind !== 'result') return;
    view = { kind: 'quiz', list: view.list, mode: view.mode, direction: view.direction };
  }
  function home() {
    view = { kind: 'list' };
  }
  function backToMode() {
    if (view.kind === 'quiz' || view.kind === 'result') {
      view = { kind: 'mode', list: view.list };
    }
  }
</script>

<main>
  {#if view.kind === 'list'}
    <ListPicker {lists} onPick={pickList} />
  {:else if view.kind === 'mode'}
    {@const modeView = view}
    <ModePicker
      list={modeView.list}
      onStart={(mode, direction) => start(modeView.list, mode, direction)}
      onBack={home}
    />
  {:else if view.kind === 'quiz' && view.mode === 'type'}
    {@const quizView = view}
    {#key quizView.list.id + quizView.direction + 'type'}
      <QuizType
        list={quizView.list}
        direction={quizView.direction}
        onDone={done}
        onBack={backToMode}
      />
    {/key}
  {:else if view.kind === 'quiz' && view.mode === 'choice'}
    {@const quizView = view}
    {#key quizView.list.id + quizView.direction + 'choice'}
      <QuizChoice
        list={quizView.list}
        direction={quizView.direction}
        onDone={done}
        onBack={backToMode}
      />
    {/key}
  {:else if view.kind === 'result'}
    {@const resultView = view}
    <Result
      list={resultView.list}
      answers={resultView.answers}
      onRetry={retry}
      onBack={home}
    />
  {/if}
</main>
