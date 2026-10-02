# 12ui Design

Open a Design workspace in Claude Code: a pane that shows design options for an app or a website as images. Select the one you like, ask for more options with a note, ask for a change to an option with a note, and hand an option off to be built.

Your agent runs the 12ui command line once per request, which draws every option at once with your own Codex sign-in and image generation, and adds each option to the workspace as it finishes. Your agent never draws in the conversation. There is no 12ui account and no sign-in: a workspace is reached through a private handle held in your session. Images are stored for up to 30 days and removed after 14 days without use.

Works in Claude Code on a computer with Node.js; your agent installs the 12ui command line once. Drawing needs Codex signed in with ChatGPT on the same computer; without it nothing is drawn and each option shows the reason. The pane needs Claude Code 2.1.287 or later, in the terminal or the Desktop app's Code tab. The draw command reaches design.12ui.com, and Claude Code asks you to approve it.

Version 0.2.83. Install with `claude plugin marketplace add just-every/12ui-claude-plugin`, then `claude plugin install 12ui@12ui`.

## Requirements

- Claude Code in the terminal or in the Desktop app's Code tab, with Node.js. The agent installs the 12ui command line once with `npx -y @12ui/design cli install`.
- The pane needs Claude Code 2.1.287 or later.
- Drawing needs Codex signed in with ChatGPT on the same computer.
- Draft, branch and hosted conversion need a 12ui account (`12ui auth login`).

## What this plugin runs, sends and fetches

- **Skill** (`12ui-design`). It runs `npx -y @12ui/design cli install` once, from npm and unpinned, then `12ui` commands. Those commands reach https://12ui.com (hosted draft, branch, conversion, the design corpus and improve kits) and https://design.12ui.com (workspace plans, image upload and download), and run `codex exec` locally when Codex is ready. The skill also downloads one workspace image with `curl` from design.12ui.com.
- **MCP server** `https://design.12ui.com/mcp`: anonymous. It stores the brief and images; images are kept up to 30 days and removed after 14 days without use.
- **Mod** (the Design workspace pane, Claude Code 2.1.287 or later). It runs inside Claude Code as plain readable source in `hooks/`. It never draws or converts anything itself, runs no processes, reads and writes no files, and reads no environment or settings.

  Hooks it registers, each with what it is for:

  - `session.start`: registers the /12ui command
  - `tool.call{tool=mcp__plugin_12ui_12ui-workspace__design_slate_create|mcp__plugin_12ui_12ui-workspace__design_slate_show}`: observes only this plugin's own create and show tools, to learn the workspace handle and open the pane; it never changes or blocks the call
  - `command.run{command="12ui"}`: answers /12ui: opens the pane, or lists the options as text where nothing draws
  - `ui.close{id=design-workspace}`: stops polling when the pane closes
  - `ui.render{component=Pane}`: draws the Design workspace pane and passes every other plugin's pane on untouched

  Calls it makes, each with its purpose:

  - `$.clock.after`: schedules the next workspace refresh and the follow-up check after a click
  - `$.clock.every`: redraws the start countdown once a second while it runs
  - `$.clock.now`: reads the time to count the start countdown down
  - `$.command.register`: registers the /12ui command
  - `$.http.fetch`: reads the workspace and records your clicks at https://design.12ui.com/mcp
  - `$.prompt.submit`: tells Claude what you clicked in the pane (a selection, a request for options, a change, a hand-off), framed as from this plugin and never with your own words
  - `$.session.surfaces`: checks whether the session draws anything before opening the pane
  - `$.ui.blit`: asks whether the terminal shows pictures, to switch to colour cells where it cannot
  - `$.ui.invalidate`: redraws the pane when the workspace changes
  - `$.ui.log`: writes diagnostic lines to Claude Code's debug log
  - `$.ui.open`: opens the Design workspace pane
  - `$.ui.resolve`: reads the elements the surface draws with
  - `$.ui.toast`: says the workspace is ready when the terminal is too narrow to show the pane

  The one network destination it reaches: `https://design.12ui.com/mcp`.

## Example prompts

- "Open a Design workspace for my app idea."
- "Show me design options for a fitness app home screen."
- "Explore looks for my landing page in a Design workspace."

## Troubleshooting

- No pane: Claude Code is older than 2.1.287, mods are turned off, or the session is the VS Code panel, `claude -p` or Chat.
- "Codex on this Mac is not signed in. Nothing was drawn.": that is the 12ui command line's own message. Sign in to Codex with ChatGPT on the same computer.
- "can't reach design.12ui.com": your organization's network policy blocks the host.
- "The Design workspace can't reach design.12ui.com: … nonessential network traffic is disabled": Claude Code refuses the pane's web requests while `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` is set.
- Open a workspace again with `/12ui <handle>`.

## Privacy and support

- Privacy policy: https://12ui.com/privacy
- Terms of service: https://12ui.com/terms
- Support: https://12ui.com/contact
- Security reports: see SECURITY.md.

## Dependencies

| Name | Version | License | Source |
| --- | --- | --- | --- |
| jpeg-js decoder | 0.4.4 | Apache-2.0 (file header); BSD-3-Clause (package) | https://github.com/jpeg-js/jpeg-js |

## License

MIT. See LICENSE.
