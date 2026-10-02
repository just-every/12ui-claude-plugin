// /12ui: the hint with no workspace, the option lines where nothing draws, and which tool calls teach it a handle.
import { describe, expect, test } from 'claude-code/testing';

import { CREATE, OTHER_RUN_DIR, RUN_DIR, fakeServer, viewWith, workspaceAnswers } from './fixtures/workspace.ts';

const NO_WORKSPACE = 'No Design workspace yet. Ask Claude to open one, for example: Open a Design workspace for my app idea.';

describe('command.test.ts', () => {
  test('session.start registers /12ui', async ($, on) => {
    const registered: unknown[] = [];
    on('command.register', ($$, e) => { registered.push(e); return { value: {} } as never; });
    on('session.start', ($$, e) => ({ cwd: e.cwd }));
    await $.session.start({ cwd: '/work', surface: null, isInteractive: false });
    expect(registered).toEqual([{ name: '12ui', description: 'Open the Design workspace', argumentHint: '[handle]' }]);
  });

  test('a /12ui name taken by another command is logged, never thrown', async ($, on) => {
    const logged: string[] = [];
    on('command.register', () => ({ deny: 'a command named 12ui exists' }) as never);
    on('ui.log', ($$, e) => { logged.push(String((e as { text: string }).text)); return { value: undefined } as never; });
    on('session.start', ($$, e) => ({ cwd: e.cwd }));
    const started = await $.session.start({ cwd: '/work', surface: null, isInteractive: false });
    expect(started.cwd).toBe('/work');
    expect(logged).toHaveLength(1);
    expect(logged[0]).toContain('/12ui is not available');
  });

  test('/12ui with no workspace gives the hint', async ($, on) => {
    on('session.surfaces', () => ({ value: [] }));
    const answer = await $.command.run({ command: '12ui', args: '' } as never);
    expect(answer.text).toBe(NO_WORKSPACE);
  });

  test('/12ui with words that are not a handle says so', async ($, on) => {
    on('session.surfaces', () => ({ value: [] }));
    const answer = await $.command.run({ command: '12ui', args: 'w_short' } as never);
    expect(answer.text).toContain('"w_short" is not a Design workspace handle');
  });

  test('/12ui with a handle where nothing draws answers one line per option', async ($, on) => {
    const server = fakeServer(workspaceAnswers(() => viewWith()));
    on('http.fetch', ($$, e) => server.answer(e.init));
    on('session.surfaces', () => ({ value: [] }));
    const answer = await $.command.run({ command: '12ui', args: RUN_DIR } as never);
    expect(answer.text).toContain(`Design workspace ${RUN_DIR}: A meditation app landing page`);
    expect(answer.text).toContain('A: ready');
    expect(answer.text).toContain('B: waiting for your agent');
    expect(answer.text).toContain('C: failed: Codex on this Mac is not signed in. Nothing was drawn.');
    expect(answer.text).toContain('The Design workspace pane shows in the Claude Code terminal or the Desktop app\'s Code tab.');
    expect(server.calls.map((call) => call.name)).toEqual(['design.slate.show']);
  });

  test('a create result through tool.call teaches the handle', async ($, on) => {
    const server = fakeServer(workspaceAnswers(() => viewWith()));
    on('http.fetch', ($$, e) => server.answer(e.init));
    on('session.surfaces', () => ({ value: [] }));
    on('tool.call', { tool: CREATE }, () => ({ result: { content: [] }, text: JSON.stringify({ schema: '12ui.slate.view/3', runDir: RUN_DIR }) }) as never);
    await $.tool.call({ tool: CREATE, concept: 'A meditation app landing page' } as never);
    const answer = await $.command.run({ command: '12ui', args: '' } as never);
    expect(answer.text).toContain(`Design workspace ${RUN_DIR}`);
    expect(server.calls).toEqual([{ name: 'design.slate.show', args: { runDir: RUN_DIR } }]);
  });

  test('another tool naming a handle teaches nothing', async ($, on) => {
    on('session.surfaces', () => ({ value: [] }));
    on('tool.call', { tool: 'mcp__other__lookup' }, () => ({ result: { content: [] }, text: `runDir ${OTHER_RUN_DIR}` }) as never);
    await $.tool.call({ tool: 'mcp__other__lookup' } as never);
    const answer = await $.command.run({ command: '12ui', args: '' } as never);
    expect(answer.text).toBe(NO_WORKSPACE);
  });
});
