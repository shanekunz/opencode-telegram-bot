export const en = {
  "cmd.description.status": "Server and session status",
  "cmd.description.new": "Create a new session",
  "cmd.description.abort": "Abort current action",
  "cmd.description.stop": "Stop current action",
  "cmd.description.sessions": "List sessions",
  "cmd.description.messages": "Browse session messages",
  "cmd.description.last": "Show latest session message",
  "cmd.description.tts": "Toggle audio replies",
  "cmd.description.projects": "List projects",
  "cmd.description.task": "Create a scheduled task",
  "cmd.description.tasklist": "List scheduled tasks",
  "cmd.description.commands": "Custom commands",
  "cmd.description.skills": "Skills catalog",
  "cmd.description.model": "Select model",
  "cmd.description.agent": "Select agent",
  "cmd.description.cleanup": "Close stale topic threads",
  "cmd.description.opencode_start": "Start OpenCode server",
  "cmd.description.opencode_stop": "Stop OpenCode server",
  "cmd.description.help": "Help",
  "cmd.description.open": "Add a project by browsing directories",

  "callback.unknown_command": "Unknown command",
  "callback.processing_error": "Processing error",

  "error.load_agents": "❌ Failed to load agents list",
  "error.load_models": "❌ Failed to load models list",
  "error.load_variants": "❌ Failed to load variants list",
  "error.context_button": "❌ Failed to process context button",
  "error.generic": "🔴 Something went wrong.",

  "interaction.blocked.expired": "⚠️ This interaction has expired. Please start it again.",
  "interaction.blocked.expected_callback":
    "⚠️ Please use the inline buttons for this step or tap Cancel.",
  "interaction.blocked.expected_text": "⚠️ Please send a text message for this step.",
  "interaction.blocked.expected_command": "⚠️ Please send a command for this step.",
  "interaction.blocked.command_not_allowed":
    "⚠️ This command is not available in the current step.",
  "interaction.blocked.finish_current":
    "⚠️ Finish the current interaction first (answer or cancel), then open another menu.",

  "inline.blocked.expected_choice": "⚠️ Choose an option using the inline buttons or tap Cancel.",
  "inline.blocked.command_not_allowed":
    "⚠️ This command is not available while inline menu is active.",

  "question.blocked.expected_answer":
    "⚠️ Answer the current question using buttons, Custom answer, or Cancel.",
  "question.blocked.command_not_allowed":
    "⚠️ This command is not available until current question flow is completed.",

  "inline.button.cancel": "❌ Cancel",
  "inline.inactive_callback": "This menu is inactive",
  "inline.cancelled_callback": "Cancelled",

  "common.unknown": "unknown",
  "common.unknown_error": "unknown error",

  "start.welcome":
    "👋 Welcome to OpenCode Telegram Group Topics Bot!\n\nUse commands:\n/projects — select project\n/sessions — session list\n/new — new session\n/status — status\n/help — help\n\nUse the bottom buttons to select the agent, model, and variant.",
  "start.welcome_dm":
    "👋 DM mode is limited to bot/server status and control commands.\n\nUse a group topic thread for project/session work.",
  "help.keyboard_hint":
    "💡 Use the bottom keyboard buttons for the agent, model, variant, and context actions.",
  "help.text":
    "📖 **Help**\n\n/status - Check server status\n/sessions - Session list\n/new - Create new session\n/help - Help",

  "bot.thinking": "💭 Thinking...",
  "bot.project_not_selected":
    "🏗 Project is not selected.\n\nFirst select a project with /projects.",
  "bot.creating_session": "🔄 Creating a new session...",
  "bot.create_session_error":
    "🔴 Failed to create session. Try /new or check server status with /status.",
  "bot.session_created": "✅ Session created: {title}",
  "bot.session_busy":
    "⏳ Your last request is still running, so this new one was not started.\n\nWhy this happened: OpenCode accepts one active run per session.\nWhat to do: wait for the current reply, or use /abort if it seems stuck, then send your message again.",
  "bot.session_queued":
    "📝 Your message was queued for this session.\n\nQueue position: {position}\nWhat happens next: it will start automatically after the current run finishes.",
  "bot.session_queue_started":
    "▶️ Starting the next queued message for this session.\n\nQueued message:\n{preview}",
  "bot.session_reset_project_mismatch":
    "⚠️ Active session does not match the selected project, so it was reset. Use /sessions to pick one or /new to create a new session.",
  "bot.prompt_send_error":
    "⚠️ I could not deliver this message to OpenCode.\n\nLikely cause: a temporary connection hiccup between the bot and OpenCode server.\nWhat to do: send the message again. If it keeps happening, run /status and check that OpenCode is reachable.",
  "bot.prompt_send_error_session_not_found":
    "⚠️ I could not deliver this message because the active session is no longer available.\n\nWhy this happened: the session may have been reset, changed, or removed.\nWhat to do: choose a session with /sessions or create a new one with /new, then resend your message.",
  "bot.session_error": "🔴 OpenCode returned an error: {message}",
  "bot.session_retry":
    "🔁 {message}\n\nProvider keeps returning the same error on repeated retries. Use /abort to abort.",
  "bot.unknown_command": "⚠️ Unknown command: {command}. Use /help to see available commands.",
  "bot.photo_downloading": "⏳ Downloading photo...",
  "bot.photo_too_large": "⚠️ Photo is too large (max {maxSizeMb}MB)",
  "bot.photo_model_no_image": "⚠️ Current model doesn't support image input. Sending text only.",
  "bot.photo_download_error": "🔴 Failed to download photo",
  "bot.photo_no_caption": "💡 Tip: Add a caption to describe what you want to do with this photo.",
  "bot.file_downloading": "⏳ Downloading file...",
  "bot.file_too_large": "⚠️ File is too large (max {maxSizeMb}MB)",
  "bot.file_download_error": "🔴 Failed to download file",
  "bot.model_no_pdf": "⚠️ Current model doesn't support PDF input. Sending text only.",
  "bot.text_file_too_large": "⚠️ Text file is too large (max {maxSizeKb}KB)",

  "status.header_running": "🟢 OpenCode Server is running",
  "status.health.healthy": "Healthy",
  "status.health.unhealthy": "Unhealthy",
  "status.line.health": "Status: {health}",
  "status.line.version": "Version: {version}",
  "status.line.managed_yes": "Started by this bot: Yes",
  "status.line.managed_no": "Started by this bot: No (external process)",
  "status.line.pid": "PID: {pid}",
  "status.line.uptime_sec": "Uptime: {seconds} sec",
  "status.line.mode": "Agent: {mode}",
  "status.line.model": "Model: {model}",
  "status.line.tts": "TTS replies: {tts}",
  "status.tts.on": "On",
  "status.tts.off": "Off",
  "status.agent_not_set": "not set",
  "status.project_selected": "🏗 Project: {project}",
  "status.project_not_selected": "🏗 Project: not selected",
  "status.project_hint": "Use /projects to select a project",
  "status.session_selected": "📋 Current session: {title}",
  "status.session_not_selected": "📋 Current session: not selected",
  "status.session_hint": "Use /sessions to select one or /new to create one",
  "status.global_overview": "📈 Global overview",
  "status.global_projects": "Projects: {count}",
  "status.global_sessions": "Sessions: {count}",
  "status.server_unavailable":
    "🔴 OpenCode Server is unavailable\n\nUse /opencode_start to start the server.",

  "tts.enabled": "🔊 Audio replies enabled globally.",
  "tts.not_configured":
    "⚠️ Audio replies are unavailable. Set `TTS_API_URL` and `TTS_API_KEY` first.",
  "tts.disabled": "🔇 Audio replies disabled globally.",
  "tts.failed": "⚠️ Failed to generate audio reply.",

  "dm.restricted.command":
    "⚠️ Session control commands are disabled in DM. Use a group topic thread for project/session work.",
  "dm.restricted.prompt":
    "⚠️ Prompts are disabled in DM. Use a group topic thread to run OpenCode tasks.",
  "help.dm.title": "DM control commands",
  "help.dm.command_start": "show DM mode guidance",
  "help.dm.hint": "Use group topic threads for project/session work.",
  "status.dm.title": "DM status overview",
  "status.dm.hint": "Use group topic threads to run OpenCode sessions.",
  "group.general.prompts_disabled":
    "⚠️ Prompts are disabled in General topic. Use /new to create a dedicated session topic.",
  "topic.unbound": "⚠️ This topic is not linked to any session. Go to General topic and run /new.",
  "topic.worktree_missing":
    "⚠️ This topic is linked to a worktree that is no longer available. Switch to Session Control, choose an available worktree, and create a new topic.",

  "projects.empty":
    "📭 No projects found.\n\nOpen a directory in OpenCode and create at least one session, then it will appear here.",
  "projects.select": "Select a project:",
  "projects.select_with_current": "Select a project:\n\nCurrent: 🏗 {project}",
  "projects.page_indicator": "Page {current}/{total}",
  "projects.prev_page": "⬅️ Previous",
  "projects.next_page": "Next ➡️",
  "projects.fetch_error":
    "🔴 OpenCode Server is unavailable or an error occurred while loading projects.",
  "projects.page_load_error": "Cannot load this page. Please try again.",
  "projects.selected":
    "✅ Project selected: {project}\n\n📋 Session was reset. Use /sessions or /new for this project.",
  "projects.select_error": "🔴 Failed to select project.",
  "projects.locked.topic_scope":
    "⚠️ This topic is bound to its own project/session scope. Switch projects only from General before creating topics.",
  "projects.locked.group_project":
    "⚠️ This group is already configured for project: {project}. Create a new group if you want to work on another repository.",
  "projects.locked.callback": "Project switching is locked for this group.",
  "projects.worktree_missing":
    "⚠️ The selected project directory is no longer available. Choose an available project or worktree from /projects.",
  "skills.select": "Choose an OpenCode skill:",
  "skills.empty": "📭 No OpenCode skills are available for this project.",
  "skills.fetch_error": "🔴 Failed to load OpenCode skills.",
  "skills.no_description": "No description",
  "skills.button.execute": "✅ Execute",
  "skills.button.cancel": "❌ Cancel",
  "skills.confirm":
    "Choose how to run skill {skill}. Tap Execute to run it directly, or send text arguments.",
  "skills.inactive_callback": "This skill menu is inactive",
  "skills.cancelled_callback": "Cancelled",
  "skills.execute_callback": "Using skill...",
  "skills.executing_prefix": "⚡ Using skill:",
  "skills.arguments_empty": "⚠️ Arguments cannot be empty. Send text or tap Execute.",
  "skills.select_page": "Choose an OpenCode skill (page {page}):",
  "skills.button.prev_page": "⬅️ Prev",
  "skills.button.next_page": "Next ➡️",
  "skills.page_empty_callback": "No skills on this page",
  "skills.page_load_error_callback": "Cannot load this page. Please try again.",

  "open.back": "⬆️ Up",
  "open.roots": "📋 Back to roots",
  "open.prev_page": "⬅️ Previous",
  "open.next_page": "Next ➡️",
  "open.select_current": "✅ Select this folder",
  "open.select_root": "📂 Select a root directory to browse:",
  "open.access_denied": "⛔ Access denied: path is outside allowed roots",
  "open.scan_error": "🔴 Cannot browse directory: {error}",
  "open.open_error": "🔴 Failed to open directory browser.",
  "open.selected": "✅ Project added: {project}\n\n📋 Use /sessions or /new to start working.",
  "open.select_error": "🔴 Failed to add project.",
  "open.no_subfolders": "📭 No subfolders",
  "open.subfolder_count": "{count} subfolder",
  "open.subfolders_count": "{count} subfolders",

  "sessions.project_not_selected":
    "🏗 Project is not selected.\n\nFirst select a project with /projects.",
  "sessions.empty": "📭 No sessions found.\n\nCreate a new session with /new.",
  "sessions.select": "Select a session:",
  "sessions.select_page": "Select a session (page {page}):",
  "sessions.fetch_error":
    "🔴 OpenCode Server is unavailable or an error occurred while loading sessions.",
  "sessions.select_project_first": "🔴 Project is not selected. Use /projects.",
  "sessions.page_empty_callback": "No sessions on this page",
  "sessions.page_load_error_callback": "Cannot load this page. Please try again.",
  "sessions.button.prev_page": "⬅️ Prev",
  "sessions.button.next_page": "Next ➡️",
  "sessions.topic_locked":
    "⚠️ This topic is bound to its current session. Use /new in General to create another topic.",
  "sessions.general_overview": "Topic sessions overview:",
  "sessions.general_item": "• {topic} (thread #{thread}) - {status}",
  "sessions.general_empty": "No session topics yet. Use /new to create one.",
  "sessions.bound_topic_link": "🔗 Topic for this session: {url}",
  "sessions.created_topic_link": "✅ Created topic for this session: {url}",
  "sessions.loading_context": "⏳ Loading context and latest messages...",
  "sessions.selected": "✅ Session selected: {title}",
  "sessions.select_error": "🔴 Failed to select session.",
  "sessions.preview.empty": "No recent messages.",
  "sessions.preview.title": "Recent messages:",
  "sessions.preview.you": "You:",
  "sessions.preview.agent": "Agent:",
  "sessions.resume.assistant_title": "Last agent message:",
  "sessions.resume.last_turn_title": "Last visible message:",

  "last.title": "Latest message:",
  "last.session_not_selected": "📋 No session selected. Use /sessions or /new first.",
  "last.empty": "No recent visible messages in this session.",
  "last.fetch_error": "🔴 Failed to load the latest session message.",

  "new.project_not_selected":
    "🏗 Project is not selected.\n\nFirst select a project with /projects.",
  "new.created": "✅ New session created: {title}",
  "new.topic_only_in_general":
    "⚠️ Run /new from the General topic to create a dedicated session topic.",
  "new.requires_forum_general": "⚠️ /new requires the General topic in a forum-enabled supergroup.",
  "new.topic_created": "✅ Session topic is ready: {title}",
  "new.general_created": "✅ Created a new OpenCode session and group topic.",
  "new.topic_create_error":
    "🔴 Failed to create a session topic. Check forum permissions and try again.",
  "new.topic_create_no_rights":
    "🔴 I cannot create forum topics in this group. Please grant the bot topic management permission (Manage Topics), then retry /new.",
  "new.general_open_link": "🔗 Open topic: {url}",
  "new.create_error":
    "🔴 OpenCode Server is unavailable or an error occurred while creating session.",

  "task.project_not_selected":
    "🏗 Project is not selected.\n\nFirst select a project with /projects.",
  "task.output_topic_blocked":
    "⚠️ Prompts are disabled in Scheduled Task Output. Use 🎛️ Session Control to manage projects, sessions, and scheduled tasks.",
  "task.output_topic_commands_only":
    "⚠️ Most commands are disabled in Scheduled Task Output. Use 🎛️ Session Control to manage projects, sessions, and scheduled tasks.",
  "task.schedule_prompt":
    "Send the schedule for this task. Examples: `every weekday at 09:00` or `tomorrow at 18:30`.\n\nAfter the schedule is parsed, you can still change agent and model defaults from 🎛️ Session Control before sending the final task prompt.",
  "task.schedule_parsing":
    "⏳ Still parsing the schedule. Wait for the preview before sending more text.",
  "task.schedule_preview": "Schedule parsed.\n\nSummary: {summary}\nNext run: {nextRunAt}",
  "task.prompt_prompt":
    "Send the prompt for this scheduled task. You can still change the 🎛️ Session Control agent, model, or variant before sending it; this task will use whatever defaults are active when you send the final prompt.",
  "task.schedule_error":
    "⚠️ I could not parse that schedule: {message}\n\nSend a clearer schedule description.",
  "task.created": "✅ Scheduled task created.\n\nSchedule: {summary}\nNext run: {nextRunAt}",
  "task.created_topic_link": "🔗 Scheduled runs will be posted here: {url}",
  "task.create_error": "🔴 Failed to create the scheduled task.",
  "task.blocked.expected_text":
    "⚠️ Finish the scheduled task setup first by sending the requested text, or use /abort to cancel.",
  "task.blocked.command_not_allowed":
    "⚠️ This command is not available while scheduled task setup is active.",
  "task.blocked.finish_or_abort_to_change_defaults":
    "⚠️ This task already captured the current 🎛️ Session Control defaults. Finish it as-is, or use /abort and start /task again if you want different defaults.",
  "task.blocked.only_defaults_before_prompt":
    "⚠️ Scheduled task setup is active. Before the final prompt, you can only change agent, model, or variant defaults; otherwise finish the setup or use /abort.",
  "task.list.title": "Scheduled tasks:",
  "task.list.empty": "📭 No scheduled tasks for this project in this chat.",
  "task.list.none": "not scheduled",
  "task.list.next_run": "Next run: {value}",
  "task.list.status": "Status: {value}",
  "task.list.prompt": "Prompt: {value}",
  "task.list.delete_button": "Delete #{index}",
  "task.list.deleted": "Scheduled task deleted",
  "task.list.delete_missing": "Scheduled task not found",
  "task.list.delete_error": "Failed to delete scheduled task",

  "cleanup.topic_use_general": "⚠️ Run /cleanup from the General topic.",
  "cleanup.requires_forum_general":
    "⚠️ /cleanup is available only in the General topic of a forum-enabled supergroup.",
  "cleanup.no_topics": "✅ No topic sessions to clean up.",
  "cleanup.result":
    "🧹 Cleanup complete. Checked: {inspected}, closed: {closed}, skipped: {skipped}, failed: {failed}.",

  "stop.no_active_session":
    "🛑 Agent was not started\n\nCreate a session with /new or select one via /sessions.",
  "stop.cancelled_interaction":
    "✅ Cancelled the current setup. You can now change defaults or start again.",
  "stop.in_progress":
    "🛑 Event stream stopped, sending abort signal...\n\nWaiting for agent to stop.",
  "stop.warn_unconfirmed":
    "⚠️ Event stream stopped, but server did not confirm abort.\n\nCheck /status and retry /abort in a few seconds.",
  "stop.warn_maybe_finished": "⚠️ Event stream stopped, but the agent may have already finished.",
  "stop.success": "✅ Agent action interrupted. No more messages from this run will be sent.",
  "stop.warn_still_busy":
    "⚠️ Signal sent, but agent is still busy.\n\nEvent stream is already disabled, so no intermediate messages will be sent.",
  "stop.warn_timeout":
    "⚠️ Abort request timeout.\n\nEvent stream is already disabled, retry /abort in a few seconds.",
  "stop.warn_local_only": "⚠️ Event stream stopped locally, but server-side abort failed.",
  "stop.error": "🔴 Failed to stop action.\n\nEvent stream is stopped, try /abort again.",

  "opencode_start.already_running_managed":
    "⚠️ OpenCode Server is already running\n\nPID: {pid}\nUptime: {seconds} seconds",
  "opencode_start.already_running_external":
    "✅ OpenCode Server is already running as an external process\n\nVersion: {version}\n\nThis server was not started by bot, so /opencode-stop cannot stop it.",
  "opencode_start.starting": "🔄 Starting OpenCode Server...",
  "opencode_start.start_error":
    "🔴 Failed to start OpenCode Server\n\nError: {error}\n\nCheck that OpenCode CLI is installed and available in PATH:\nopencode --version\nnpm install -g @opencode-ai/cli",
  "opencode_start.started_not_ready":
    "⚠️ OpenCode Server started, but is not responding\n\nPID: {pid}\n\nServer may still be starting. Try /status in a few seconds.",
  "opencode_start.success":
    "✅ OpenCode Server started successfully\n\nPID: {pid}\nVersion: {version}",
  "opencode_start.error":
    "🔴 An error occurred while starting server.\n\nCheck application logs for details.",
  "opencode_stop.external_running":
    "⚠️ OpenCode Server is running as an external process\n\nThis server was not started via /opencode-start.\nStop it manually or use /status to check state.",
  "opencode_stop.not_running": "⚠️ OpenCode Server is not running",
  "opencode_stop.stopping": "🛑 Stopping OpenCode Server...\n\nPID: {pid}",
  "opencode_stop.stop_error": "🔴 Failed to stop OpenCode Server\n\nError: {error}",
  "opencode_stop.success": "✅ OpenCode Server stopped successfully",
  "opencode_stop.error":
    "🔴 An error occurred while stopping server.\n\nCheck application logs for details.",

  "agent.changed_callback": "Agent changed: {name}",
  "agent.changed_message": "✅ Agent changed to: {name}",
  "agent.change_error_callback": "Failed to change agent",
  "agent.menu.current": "Current agent: {name}\n\nSelect agent:",
  "agent.menu.select": "Select agent:",
  "agent.menu.empty": "⚠️ No available agents",
  "agent.menu.error": "🔴 Failed to get agents list",

  "model.changed_callback": "Model changed: {name}",
  "model.changed_message": "✅ Model changed to: {name}",
  "model.change_error_callback": "Failed to change model",
  "model.menu.empty": "⚠️ No available models",
  "model.menu.select": "Select model:",
  "model.menu.current": "Current model: {name}\n\nSelect model:",
  "model.menu.favorites_title": "⭐ Favorites (Add models to favorites in OpenCode CLI)",
  "model.menu.favorites_empty": "— Empty.",
  "model.menu.recent_title": "🕘 Recent",
  "model.menu.recent_empty": "— Empty.",
  "model.menu.favorites_hint":
    "ℹ️ Add models to favorites in OpenCode CLI to keep them at the top.",
  "model.search.button": "🔎 Search models",
  "model.search.prompt": "Send a model search query.",
  "model.search.results_title": "Model search results for: {query}",
  "model.search.no_results": "No models found for: {query}",
  "model.search.search_again": "🔁 Search again",
  "model.search.error": "🔴 Failed to search models",
  "model.menu.error": "🔴 Failed to get models list",

  "messages.project_not_selected":
    "🏗 Project is not selected.\n\nFirst select a project with /projects.",
  "messages.session_not_selected": "📋 No session selected. Use /sessions or /new first.",
  "messages.session_project_mismatch":
    "⚠️ The current session belongs to a different project. Select the matching session first.",
  "messages.empty": "📭 No user messages found in this session.",
  "messages.fetch_error": "🔴 Failed to load session messages.",
  "messages.select": "Select a message:",
  "messages.select_page": "Select a message (page {page}):",
  "messages.inactive_callback": "This message menu is inactive",
  "messages.cancelled_callback": "Cancelled",
  "messages.page_empty_callback": "No messages on this page",
  "messages.button.prev_page": "⬅️ Prev",
  "messages.button.next_page": "Next ➡️",
  "messages.button.revert": "↩️ Revert here",
  "messages.button.fork": "🌿 Fork session",
  "messages.button.back": "⬅️ Back",
  "messages.button.cancel": "❌ Cancel",
  "messages.revert_success": "✅ Reverted session to message:\n\n{text}",
  "messages.revert_error": "🔴 Failed to revert the session.",
  "messages.fork_success": "✅ Forked a new session from message:\n\n{text}",
  "messages.fork_error": "🔴 Failed to fork a new session.",

  "variant.model_not_selected_callback": "Error: model is not selected",
  "variant.changed_callback": "Variant changed: {name}",
  "variant.changed_message": "✅ Variant changed to: {name}",
  "variant.change_error_callback": "Failed to change variant",
  "variant.select_model_first": "⚠️ Select a model first",
  "variant.menu.empty": "⚠️ No available variants",
  "variant.menu.current": "Current variant: {name}\n\nSelect variant:",
  "variant.menu.error": "🔴 Failed to get variants list",

  "context.button.confirm": "✅ Yes, compact context",
  "context.no_active_session": "⚠️ No active session. Create a session with /new",
  "context.confirm_text":
    '📊 Context compaction for session "{title}"\n\nThis will reduce context usage by removing old messages from history. Current task will not be interrupted.\n\nContinue?',
  "context.general_not_available":
    "⚠️ Context compaction is only available inside a session topic, not in General.",
  "context.general_not_available_callback": "Open a session topic first.",
  "context.callback_session_not_found": "Session not found",
  "context.callback_compacting": "Compacting context...",
  "context.progress": "⏳ Compacting context...",
  "context.error": "❌ Context compaction failed",
  "context.success": "✅ Context compacted successfully",
  "context.after_compaction": "✅ Context window after compaction is {context}",

  "permission.inactive_callback": "Permission request is inactive",
  "permission.processing_error_callback": "Processing error",
  "permission.no_active_request_callback": "Error: no active request",
  "permission.reply.once": "Allowed once",
  "permission.reply.always": "Always allowed",
  "permission.reply.reject": "Rejected",
  "permission.send_reply_error": "❌ Failed to send permission reply",
  "permission.blocked.expected_reply":
    "⚠️ Please answer the permission request first using the buttons above.",
  "permission.blocked.command_not_allowed":
    "⚠️ This command is not available until you answer the permission request.",
  "permission.header": "{emoji} Permission request: {name}\n\n",
  "permission.button.allow": "✅ Allow once",
  "permission.button.always": "🔓 Allow always",
  "permission.button.reject": "❌ Reject",
  "permission.name.bash": "Bash",
  "permission.name.edit": "Edit",
  "permission.name.write": "Write",
  "permission.name.read": "Read",
  "permission.name.webfetch": "Web Fetch",
  "permission.name.websearch": "Web Search",
  "permission.name.glob": "File Search",
  "permission.name.grep": "Content Search",
  "permission.name.list": "List Directory",
  "permission.name.task": "Task",
  "permission.name.lsp": "LSP",
  "permission.name.external_directory": "External Directory",

  "question.inactive_callback": "Poll is inactive",
  "question.processing_error_callback": "Processing error",
  "question.select_one_required_callback": "Select at least one option",
  "question.enter_custom_callback": "Send your custom answer as a message",
  "question.cancelled": "❌ Poll cancelled",
  "question.answer_already_received": "Answer already received, please wait...",
  "question.completed_no_answers": "✅ Poll completed (no answers)",
  "question.no_active_project": "❌ No active project",
  "question.no_active_request": "❌ No active request",
  "question.send_answers_error": "❌ Failed to send answers to agent",
  "question.multi_hint": "\n(You can select multiple options)",
  "question.button.submit": "✅ Done",
  "question.button.custom": "🔤 Custom answer",
  "question.button.cancel": "❌ Cancel",
  "question.use_custom_button_first":
    '⚠️ To send text, tap "Custom answer" for the current question first.',
  "question.summary.title": "✅ Poll completed!\n\n",
  "question.summary.question": "Question {index}:\n{question}\n\n",
  "question.summary.answer": "Answer:\n{answer}\n\n",

  "keyboard.agent_mode": "{emoji} {name} Agent",
  "keyboard.context": "📊 {used} / {limit} ({percent}%)",
  "keyboard.context_empty": "📊 Controls",
  "keyboard.general_defaults": "New Session Defaults:",
  "keyboard.general_defaults_info":
    "These defaults apply to newly created sessions in this group:\n• Agent\n• Model\n• Variant",
  "keyboard.variant": "💭 {name}",
  "keyboard.variant_default": "💡 Default",
  "keyboard.updated": "⌨️ Keyboard updated",
  "keyboard.dm.status": "/status",
  "keyboard.dm.help": "/help",
  "keyboard.dm.opencode_start": "/opencode_start",
  "keyboard.dm.opencode_stop": "/opencode_stop",

  "pinned.default_session_title": "new session",
  "pinned.unknown": "Unknown",
  "pinned.line.project": "Project: {project}",
  "pinned.line.model": "Model: {model}",
  "pinned.line.context": "Context: {used} / {limit} ({percent}%)",
  "pinned.line.cost": "Cost: {cost}",
  "subagent.completed": "Completed",
  "subagent.failed": "Failed",
  "subagent.working": "Working",
  "subagent.line.task": "Task: {task}",
  "subagent.line.agent": "Agent: {agent}",
  "pinned.files.title": "Files ({count}):",
  "pinned.files.item": "  {path}{diff}",
  "pinned.files.more": "  ... and {count} more",

  "tool.todo.overflow": "*({count} more tasks)*",
  "tool.file_header.write":
    "Write File/Path: {path}\n============================================================\n\n",
  "tool.file_header.edit":
    "Edit File/Path: {path}\n============================================================\n\n",

  "runtime.wizard.ask_token": "Enter Telegram bot token (get it from @BotFather).\n> ",
  "runtime.wizard.ask_language":
    "Select interface language.\nEnter the language number from the list or locale code.\nPress Enter to keep default language: {defaultLocale}\n{options}\n> ",
  "runtime.wizard.language_invalid":
    "Enter a language number from the list or a supported locale code.\n",
  "runtime.wizard.language_selected": "Selected language: {language}\n",
  "runtime.wizard.token_required": "Token is required. Please try again.\n",
  "runtime.wizard.token_invalid":
    "Token looks invalid (expected format <id>:<secret>). Please try again.\n",
  "runtime.wizard.ask_user_id":
    "Enter your Telegram User ID (you can get it from @userinfobot).\n> ",
  "runtime.wizard.user_id_invalid": "Enter a positive integer (> 0).\n",
  "runtime.wizard.ask_api_url":
    "Enter OpenCode API URL (optional).\nPress Enter to use default: {defaultUrl}\n> ",
  "runtime.wizard.ask_server_username":
    "Enter OpenCode server username (optional).\nPress Enter to use default: {defaultUsername}\n> ",
  "runtime.wizard.ask_server_password":
    "Enter OpenCode server password (optional, input hidden).\nPress Enter to skip.\n> ",
  "runtime.wizard.api_url_invalid": "Enter a valid URL (http/https) or press Enter for default.\n",
  "runtime.wizard.start": "OpenCode Telegram Group Topics Bot setup.\n",
  "runtime.wizard.saved": "Configuration saved:\n- {envPath}\n- {settingsPath}\n",
  "runtime.wizard.not_configured_starting":
    "Application is not configured yet. Starting wizard...\n",
  "runtime.wizard.tty_required":
    "Interactive wizard requires a TTY terminal. Run `opencode-telegram-group-topics-bot config` in an interactive shell.",

  "rename.no_session": "⚠️ No active session. Create or select a session first.",
  "rename.prompt": "📝 Enter new title for session:\n\nCurrent: {title}",
  "rename.empty_title": "⚠️ Title cannot be empty.",
  "rename.success": "✅ Session renamed to: {title}",
  "rename.error": "🔴 Failed to rename session.",
  "rename.cancelled": "❌ Rename cancelled.",
  "rename.inactive_callback": "Rename request is inactive",
  "rename.inactive": "⚠️ Rename request is not active. Run /rename again.",
  "rename.blocked.expected_name":
    "⚠️ Enter a new session name as text or tap Cancel in rename message.",
  "rename.blocked.command_not_allowed":
    "⚠️ This command is not available while rename is waiting for a new name.",
  "rename.button.cancel": "❌ Cancel",

  "commands.select": "Choose an OpenCode command:",
  "commands.empty": "📭 No OpenCode commands are available for this project.",
  "commands.fetch_error": "🔴 Failed to load OpenCode commands.",
  "commands.no_description": "No description",
  "commands.select_page": "Choose an OpenCode command ({current}/{total}):",
  "commands.button.execute": "✅ Execute",
  "commands.button.prev_page": "⬅️ Prev",
  "commands.button.next_page": "Next ➡️",
  "commands.button.cancel": "❌ Cancel",
  "commands.confirm":
    "Run {command}? Send a text reply to pass arguments, or tap Execute to run it as-is.",
  "commands.inactive_callback": "This command menu is inactive",
  "commands.cancelled_callback": "Cancelled",
  "commands.execute_callback": "Executing command...",
  "commands.executing": "⚡ Starting OpenCode command\n{command}",
  "commands.arguments_empty": "⚠️ Arguments cannot be empty. Send text or tap Execute.",
  "commands.execute_error": "🔴 Failed to execute OpenCode command.",

  "cmd.description.rename": "Rename current session",

  "cli.usage":
    "Usage:\n  opencode-telegram-group-topics-bot [start] [--mode sources|installed]\n  opencode-telegram-group-topics-bot status\n  opencode-telegram-group-topics-bot stop\n  opencode-telegram-group-topics-bot config [--mode sources|installed]\n\nNotes:\n  - No command defaults to `start`\n  - `config` defaults to installed mode unless `--mode sources` is provided",
  "cli.placeholder.status":
    "Command `status` is currently a placeholder. Real status checks will be added in service layer (Phase 5).",
  "cli.placeholder.stop":
    "Command `stop` is currently a placeholder. Real background process stop will be added in service layer (Phase 5).",
  "cli.placeholder.unavailable": "Command is unavailable.",
  "cli.error.prefix": "CLI error: {message}",
  "cli.args.unknown_command": "Unknown command: {value}",
  "cli.args.mode_requires_value": "Option --mode requires a value: sources|installed",
  "cli.args.invalid_mode": "Invalid mode value: {value}. Expected sources|installed",
  "cli.args.unknown_option": "Unknown option: {value}",
  "cli.args.mode_only_start": "Option --mode is supported only for the start and config commands",

  "legacy.models.fetch_error": "🔴 Failed to get models list. Check server status with /status.",
  "legacy.models.empty": "📋 No available models. Configure providers in OpenCode.",
  "legacy.models.header": "📋 Available models:\n\n",
  "legacy.models.no_provider_models": "  ⚠️ No available models\n",
  "legacy.models.env_hint": "💡 To use model in .env:\n",
  "legacy.models.error": "🔴 An error occurred while loading models list.",

  "stt.recognizing": "🎤 Recognizing audio...",
  "stt.recognized": "🎤 Recognized:\n{text}",
  "stt.not_configured":
    "🎤 Voice recognition is not configured.\n\nSet STT_API_URL and STT_API_KEY in .env to enable it.",
  "stt.error": "🔴 Failed to recognize audio: {error}",
  "stt.empty_result": "🎤 No speech detected in the audio message.",
} as const;

export type I18nKey = keyof typeof en;
export type I18nDictionary = Record<I18nKey, string>;
