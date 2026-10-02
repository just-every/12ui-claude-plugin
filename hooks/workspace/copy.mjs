/**
 * The words the mod shows the person: the pane's labels, the toast, and the `/12ui` command's answers. Sentence case,
 * bare-verb buttons, no all-caps. Pure: no `$`.
 */

import { stateLine } from './view.mjs';

export const PANE_ID = 'design-workspace';
export const PANE_TITLE = 'Design workspace';
export const COMMAND_NAME = '12ui';
export const COMMAND_DESCRIPTION = 'Open the Design workspace';
export const COMMAND_HINT = '[handle]';

export const READY_TOAST = 'Design workspace ready. Type /12ui to open it.';
export const NO_WORKSPACE = 'No Design workspace yet. Ask Claude to open one, for example: Open a Design workspace for my app idea.';
export const WHERE_PANE_SHOWS = 'The Design workspace pane shows in the Claude Code terminal or the Desktop app\'s Code tab.';
export const OPENED = 'Design workspace opened.';
export const LOADING = 'Loading the Design workspace.';
export const BRANCH_PAGES_HINT = 'Pages (optional), e.g. about, sign in, settings';
export const SENT = 'Recorded. Claude has been told.';
export const RECORDED_RUNNER = 'Recorded. It will be drawn on this computer.';

export const LABELS = Object.freeze({
  design: 'Design',
  selected: 'Selected',
  chosen: 'Building',
  back: 'Back',
  branch: 'Branch',
  fullPage: 'Full page',
  morePages: 'More pages',
  buildThis: 'Build this',
  select: 'Select',
  like: 'More like this',
  edit: 'Edit',
  send: 'Send',
  cancel: 'Cancel',
  more: 'Generate more',
  continue: 'Continue',
  cells: 'Show colour cells',
  pictures: 'Show pictures',
  count: 'Options',
  note: 'Note',
  pages: 'Pages',
  change: 'Change',
  explanation: 'Explanation',
  format: 'Format',
});

/** The `/12ui` answer for an argument that is not a handle. */
export function notAHandle(word) {
  return `"${word}" is not a Design workspace handle. A handle is w_ followed by 22 letters and digits.`;
}

/** The `/12ui` answer where nothing draws: one line per option, then where the pane shows. */
export function workspaceText(runDir, brief, tiles) {
  const lines = [`Design workspace ${runDir}: ${brief}`];
  if (tiles.length === 0) lines.push('No options yet.');
  for (const tile of tiles) lines.push(`${tile.label}: ${stateLine(tile)}`);
  lines.push(WHERE_PANE_SHOWS);
  return lines.join('\n');
}

/**
 * An option picture's alt text. The terminal draws it in the picture's place, under the option's own label, where it
 * cannot show pixels: there it says only what to do, never the label again. Elsewhere it is read in place of the
 * picture, so it names the option.
 */
export const TERMINAL_PICTURE_ALT = 'Press v for colour cells';

export function pictureAlt(label, surface) {
  return surface === 'terminal' ? TERMINAL_PICTURE_ALT : `Option ${label}`;
}

/** A pick with no round waiting on the person. */
export const NO_ROUND_WAITING = 'Picks feed a round while it waits for you. Ask Claude for new designs to choose again.';
