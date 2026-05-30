import type { I18nDictionary } from "./en.js";

export const de: I18nDictionary = {
  "cmd.description.status": "Server- und Sitzungsstatus",
  "cmd.description.new": "Neue Sitzung erstellen",
  "cmd.description.abort": "Aktuelle Aktion abbrechen",
  "cmd.description.stop": "Aktuelle Aktion stoppen",
  "cmd.description.sessions": "Sitzungen auflisten",
  "cmd.description.messages": "Sitzungsnachrichten durchsuchen",
  "cmd.description.last": "Neueste Sitzungsnachricht anzeigen",
  "cmd.description.tts": "Audioantworten umschalten",
  "cmd.description.projects": "Projekte auflisten",
  "cmd.description.task": "Geplante Aufgabe erstellen",
  "cmd.description.tasklist": "Geplante Aufgaben anzeigen",
  "cmd.description.commands": "Benutzerdefinierte Befehle",
  "cmd.description.model": "Modell auswählen",
  "cmd.description.agent": "Agent auswählen",
  "cmd.description.cleanup": "Veraltete Themen schließen",
  "cmd.description.opencode_start": "OpenCode-Server starten",
  "cmd.description.opencode_stop": "OpenCode-Server stoppen",
  "cmd.description.help": "Hilfe",
  "cmd.description.open": "Projekt durch Ordner-Auswahl hinzufügen",

  "callback.unknown_command": "Unbekannter Befehl",
  "callback.processing_error": "Verarbeitungsfehler",

  "error.load_agents": "❌ Agentenliste konnte nicht geladen werden",
  "error.load_models": "❌ Modellliste konnte nicht geladen werden",
  "error.load_variants": "❌ Variantenliste konnte nicht geladen werden",
  "error.context_button": "❌ Kontext-Button konnte nicht verarbeitet werden",
  "error.generic": "🔴 Etwas ist schiefgelaufen.",

  "interaction.blocked.expired": "⚠️ Diese Interaktion ist abgelaufen. Bitte starte sie erneut.",
  "interaction.blocked.expected_callback":
    "⚠️ Bitte benutze für diesen Schritt die Inline-Buttons oder tippe auf Abbrechen.",
  "interaction.blocked.expected_text": "⚠️ Bitte sende für diesen Schritt eine Textnachricht.",
  "interaction.blocked.expected_command": "⚠️ Bitte sende für diesen Schritt einen Befehl.",
  "interaction.blocked.command_not_allowed":
    "⚠️ Dieser Befehl ist in diesem Schritt nicht verfügbar.",
  "interaction.blocked.finish_current":
    "⚠️ Schließe zuerst die aktuelle Interaktion ab (antworten oder abbrechen), dann öffne ein anderes Menü.",

  "inline.blocked.expected_choice":
    "⚠️ Wähle eine Option über die Inline-Buttons oder tippe auf Abbrechen.",
  "inline.blocked.command_not_allowed":
    "⚠️ Dieser Befehl ist nicht verfügbar, solange das Inline-Menü aktiv ist.",

  "question.blocked.expected_answer":
    "⚠️ Beantworte die aktuelle Frage über Buttons, Eigene Antwort oder Abbrechen.",
  "question.blocked.command_not_allowed":
    "⚠️ Dieser Befehl ist erst verfügbar, wenn der aktuelle Frage-Flow abgeschlossen ist.",

  "inline.button.cancel": "❌ Abbrechen",
  "inline.inactive_callback": "Dieses Menü ist inaktiv",
  "inline.cancelled_callback": "Abgebrochen",

  "common.unknown": "unbekannt",
  "common.unknown_error": "unbekannter Fehler",

  "start.welcome":
    "👋 Willkommen beim OpenCode Telegram Group Topics Bot!\n\nNutze Befehle:\n/projects — Projekt auswählen\n/sessions — Sitzungsliste\n/new — neue Sitzung\n/status — Status\n/help — Hilfe\n\nNutze die unteren Buttons, um Modus, Modell und Variante zu wählen.",
  "help.keyboard_hint":
    "💡 Nutze die unteren Buttons für Modus, Modell, Variante und Kontextaktionen.",
  "help.text":
    "📖 **Hilfe**\n\n/status - Serverstatus prüfen\n/sessions - Sitzungsliste\n/new - Neue Sitzung erstellen\n/help - Hilfe",

  "bot.thinking": "💭 Denke...",
  "bot.project_not_selected":
    "🏗 Projekt ist nicht ausgewählt.\n\nWähle zuerst ein Projekt mit /projects.",
  "bot.creating_session": "🔄 Erstelle eine neue Sitzung...",
  "bot.create_session_error":
    "🔴 Sitzung konnte nicht erstellt werden. Versuche /new oder prüfe den Serverstatus mit /status.",
  "bot.session_created": "✅ Sitzung erstellt: {title}",
  "bot.session_busy":
    "⏳ Deine letzte Anfrage wird noch verarbeitet, deshalb wurde diese neue nicht gestartet.\n\nWarum das passiert ist: OpenCode erlaubt pro Sitzung nur einen aktiven Lauf gleichzeitig.\nWas du tun kannst: warte auf die aktuelle Antwort oder nutze /abort, wenn es festhängt, und sende die Nachricht dann erneut.",
  "bot.session_queued":
    "📝 Deine Nachricht wurde für diese Sitzung in die Warteschlange gestellt.\n\nPosition in der Warteschlange: {position}\nWas als Nächstes passiert: Sie startet automatisch, sobald der aktuelle Lauf fertig ist.",
  "bot.session_queue_started":
    "▶️ Die nächste Nachricht aus der Warteschlange für diese Sitzung wird jetzt gestartet.\n\nEingeplante Nachricht:\n{preview}",
  "bot.session_reset_project_mismatch":
    "⚠️ Die aktive Sitzung passt nicht zum ausgewählten Projekt und wurde daher zurückgesetzt. Nutze /sessions zur Auswahl oder /new, um eine neue Sitzung zu erstellen.",
  "bot.prompt_send_error":
    "⚠️ Ich konnte diese Nachricht nicht an OpenCode senden.\n\nWahrscheinliche Ursache: eine vorübergehende Verbindungsstörung zwischen Bot und OpenCode-Server.\nWas du tun kannst: sende die Nachricht erneut. Wenn es weiter passiert, nutze /status und prüfe, ob OpenCode erreichbar ist.",
  "bot.prompt_send_error_session_not_found":
    "⚠️ Ich konnte diese Nachricht nicht senden, weil die aktive Sitzung nicht mehr verfügbar ist.\n\nWarum das passiert ist: die Sitzung wurde möglicherweise zurückgesetzt, gewechselt oder gelöscht.\nWas du tun kannst: wähl eine Sitzung mit /sessions oder erstelle eine neue mit /new und sende die Nachricht dann erneut.",
  "bot.session_error": "🔴 OpenCode meldete einen Fehler: {message}",
  "bot.session_retry":
    "🔁 {message}\n\nDer Provider liefert bei wiederholten Versuchen immer wieder denselben Fehler. Mit /abort abbrechen.",
  "bot.unknown_command":
    "⚠️ Unbekannter Befehl: {command}. Nutze /help, um verfügbare Befehle zu sehen.",
  "bot.photo_downloading": "⏳ Lade Foto herunter...",
  "bot.photo_too_large": "⚠️ Foto ist zu groß (max. {maxSizeMb}MB)",
  "bot.photo_model_no_image":
    "⚠️ Das aktuelle Modell unterstützt keine Bildeingabe. Sende nur Text.",
  "bot.photo_download_error": "🔴 Foto konnte nicht heruntergeladen werden",
  "bot.photo_no_caption":
    "💡 Tipp: Füge eine Bildunterschrift hinzu, um zu beschreiben, was du mit diesem Foto tun möchtest.",
  "bot.file_downloading": "⏳ Lade Datei herunter...",
  "bot.file_too_large": "⚠️ Datei ist zu groß (max. {maxSizeMb}MB)",
  "bot.file_download_error": "🔴 Datei konnte nicht heruntergeladen werden",
  "bot.model_no_pdf": "⚠️ Das aktuelle Modell unterstützt keine PDF-Eingabe. Sende nur Text.",
  "bot.text_file_too_large": "⚠️ Textdatei ist zu groß (max. {maxSizeKb}KB)",

  "status.header_running": "🟢 OpenCode-Server läuft",
  "status.health.healthy": "OK",
  "status.health.unhealthy": "Nicht OK",
  "status.line.health": "Status: {health}",
  "status.line.version": "Version: {version}",
  "status.line.managed_yes": "Vom Bot verwaltet: Ja",
  "status.line.managed_no": "Vom Bot verwaltet: Nein",
  "status.line.pid": "PID: {pid}",
  "status.line.uptime_sec": "Betriebszeit: {seconds} s",
  "status.line.mode": "Agent: {mode}",
  "status.line.model": "Modell: {model}",
  "status.line.tts": "TTS-Antworten: {tts}",
  "status.tts.on": "Ein",
  "status.tts.off": "Aus",
  "status.agent_not_set": "nicht gesetzt",
  "status.project_selected": "🏗 Projekt: {project}",
  "status.project_not_selected": "🏗 Projekt: nicht ausgewählt",
  "status.project_hint": "Nutze /projects, um ein Projekt auszuwahlen",
  "status.session_selected": "📋 Aktuelle Sitzung: {title}",
  "status.session_not_selected": "📋 Aktuelle Sitzung: nicht ausgewählt",
  "status.session_hint": "Nutze /sessions zur Auswahl oder /new zum Erstellen",
  "status.server_unavailable":
    "🔴 OpenCode-Server ist nicht verfügbar\n\nNutze /opencode_start, um den Server zu starten.",

  "tts.enabled": "🔊 Audioantworten global aktiviert.",
  "tts.not_configured":
    "⚠️ Audioantworten sind nicht verfugbar. Setze zuerst `TTS_API_URL` und `TTS_API_KEY`.",
  "tts.disabled": "🔇 Audioantworten global deaktiviert.",
  "tts.failed": "⚠️ Audioreply konnte nicht erzeugt werden.",

  "projects.empty":
    "📭 Keine Projekte gefunden.\n\nÖffne ein Verzeichnis in OpenCode und erstelle mindestens eine Sitzung, dann erscheint es hier.",
  "projects.select": "Projekt auswählen:",
  "projects.select_with_current": "Projekt auswählen:\n\nAktuell: 🏗 {project}",
  "projects.page_indicator": "Seite {current}/{total}",
  "projects.prev_page": "⬅️ Zurück",
  "projects.next_page": "Weiter ➡️",
  "projects.fetch_error":
    "🔴 OpenCode-Server ist nicht verfügbar oder beim Laden der Projekte ist ein Fehler aufgetreten.",
  "projects.page_load_error": "Diese Seite konnte nicht geladen werden. Bitte versuche es erneut.",
  "projects.selected":
    "✅ Projekt ausgewählt: {project}\n\n📋 Sitzung wurde zurückgesetzt. Nutze /sessions oder /new für dieses Projekt.",
  "projects.select_error": "🔴 Projekt konnte nicht ausgewählt werden.",
  "projects.locked.topic_scope":
    "⚠️ Dieses Thema ist an seinen eigenen Projekt-/Sitzungsbereich gebunden. Wechsle Projekte nur im General-Thema, bevor du Themen erstellst.",
  "projects.locked.group_project":
    "⚠️ Diese Gruppe ist bereits für folgendes Projekt konfiguriert: {project}. Erstelle eine neue Gruppe, wenn du in einem anderen Repository arbeiten willst.",
  "projects.locked.callback": "Projektwechsel ist für diese Gruppe gesperrt.",

  "open.back": "⬆️ Hoch",
  "open.roots": "📋 Zurück zur Auswahl",
  "open.prev_page": "⬅️ Zurück",
  "open.next_page": "Weiter ➡️",
  "open.select_current": "✅ Diesen Ordner wählen",
  "open.select_root": "📂 Stammverzeichnis zum Durchsuchen wählen:",
  "open.access_denied": "⛔ Zugriff verweigert: Pfad liegt außerhalb erlaubter Verzeichnisse",
  "open.scan_error": "🔴 Verzeichnis kann nicht durchsucht werden: {error}",
  "open.open_error": "🔴 Verzeichnisbrowser konnte nicht geöffnet werden.",
  "open.selected":
    "✅ Projekt hinzugefügt: {project}\n\n📋 Verwende /sessions oder /new zum Arbeiten.",
  "open.select_error": "🔴 Projekt konnte nicht hinzugefügt werden.",
  "open.no_subfolders": "📭 Keine Unterordner",
  "open.subfolder_count": "{count} Unterordner",
  "open.subfolders_count": "{count} Unterordner",

  "sessions.project_not_selected":
    "🏗 Projekt ist nicht ausgewählt.\n\nWähle zuerst ein Projekt mit /projects.",
  "sessions.empty": "📭 Keine Sitzungen gefunden.\n\nErstelle eine neue Sitzung mit /new.",
  "sessions.select": "Sitzung auswählen:",
  "sessions.select_page": "Sitzung auswählen (Seite {page}):",
  "sessions.fetch_error":
    "🔴 OpenCode-Server ist nicht verfügbar oder beim Laden der Sitzungen ist ein Fehler aufgetreten.",
  "sessions.select_project_first": "🔴 Projekt ist nicht ausgewählt. Nutze /projects.",
  "sessions.page_empty_callback": "Auf dieser Seite gibt es keine Sitzungen",
  "sessions.page_load_error_callback":
    "Diese Seite kann nicht geladen werden. Bitte versuche es erneut.",
  "sessions.button.prev_page": "⬅️ Zurück",
  "sessions.button.next_page": "Weiter ➡️",
  "sessions.topic_locked":
    "⚠️ Dieses Thema ist an seine aktuelle Sitzung gebunden. Verwende /new im General-Thema, um ein weiteres Thema zu erstellen.",
  "sessions.general_overview": "Übersicht der Themen-Sitzungen:",
  "sessions.general_item": "• {topic} (Thread #{thread}) - {status}",
  "sessions.general_empty": "Noch keine Sitzungs-Themen. Verwende /new, um eins zu erstellen.",
  "sessions.bound_topic_link": "🔗 Thema für diese Sitzung: {url}",
  "sessions.created_topic_link": "✅ Thema für diese Sitzung erstellt: {url}",
  "sessions.loading_context": "⏳ Lade Kontext und letzte Nachrichten...",
  "sessions.selected": "✅ Sitzung ausgewählt: {title}",
  "sessions.select_error": "🔴 Sitzung konnte nicht ausgewählt werden.",
  "sessions.preview.empty": "Keine neuen Nachrichten.",
  "sessions.preview.title": "Letzte Nachrichten:",
  "sessions.preview.you": "Du:",
  "sessions.preview.agent": "Agent:",
  "sessions.resume.assistant_title": "Letzte Agentennachricht:",
  "sessions.resume.last_turn_title": "Letzte sichtbare Nachricht:",

  "last.title": "Neueste Nachricht:",
  "last.session_not_selected": "📋 Keine Sitzung ausgewählt. Nutze zuerst /sessions oder /new.",
  "last.empty": "Keine aktuellen sichtbaren Nachrichten in dieser Sitzung.",
  "last.fetch_error": "🔴 Die neueste Sitzungsnachricht konnte nicht geladen werden.",

  "new.project_not_selected":
    "🏗 Projekt ist nicht ausgewählt.\n\nWähle zuerst ein Projekt mit /projects.",
  "new.created": "✅ Neue Sitzung erstellt: {title}",
  "new.topic_only_in_general":
    "⚠️ Führe /new im General-Thema aus, um ein eigenes Sitzungs-Thema zu erstellen.",
  "new.requires_forum_general":
    "⚠️ /new benötigt das General-Thema in einer forum-fähigen Supergruppe.",
  "new.topic_created": "✅ Sitzungs-Thema ist bereit: {title}",
  "new.general_created": "✅ Neue OpenCode-Sitzung und Gruppenthema erstellt.",
  "new.topic_create_error":
    "🔴 Sitzungs-Thema konnte nicht erstellt werden. Prüfe Forum-Berechtigungen und versuche es erneut.",
  "new.topic_create_no_rights":
    '🔴 Ich kann in dieser Gruppe keine Foren-Themen erstellen. Bitte gib dem Bot die Berechtigung "Themen verwalten" und versuche dann /new erneut.',
  "new.general_open_link": "🔗 Thema öffnen: {url}",
  "new.create_error":
    "🔴 OpenCode-Server ist nicht verfügbar oder beim Erstellen der Sitzung ist ein Fehler aufgetreten.",

  "task.project_not_selected":
    "🏗 Projekt ist nicht ausgewählt.\n\nWähle zuerst ein Projekt mit /projects.",
  "task.output_topic_blocked":
    "⚠️ Prompts sind in Scheduled Task Output deaktiviert. Nutze 🎛️ Session Control, um Projekte, Sessions und geplante Aufgaben zu verwalten.",
  "task.output_topic_commands_only":
    "⚠️ Die meisten Befehle sind in Scheduled Task Output deaktiviert. Nutze 🎛️ Session Control, um Projekte, Sessions und geplante Aufgaben zu verwalten.",
  "task.schedule_prompt":
    "Sende den Zeitplan für diese Aufgabe. Beispiele: `jeden Werktag um 09:00` oder `morgen um 18:30`.\n\nNachdem der Zeitplan erkannt wurde, kannst du Agent- und Modell-Standards aus 🎛️ Session Control noch ändern, bevor du den finalen Prompt sendest.",
  "task.schedule_parsing": "⏳ Der Zeitplan wird noch analysiert. Warte auf die Vorschau.",
  "task.schedule_preview":
    "Zeitplan erkannt.\n\nZusammenfassung: {summary}\nNächster Lauf: {nextRunAt}",
  "task.prompt_prompt":
    "Sende den Prompt für diese geplante Aufgabe. Du kannst Agent, Modell oder Variante aus 🎛️ Session Control noch ändern; die Aufgabe verwendet die Standardwerte, die aktiv sind, wenn du den finalen Prompt sendest.",
  "task.schedule_error":
    "⚠️ Dieser Zeitplan konnte nicht verstanden werden: {message}\n\nSende eine klarere Beschreibung.",
  "task.created":
    "✅ Geplante Aufgabe erstellt.\n\nZeitplan: {summary}\nNächster Lauf: {nextRunAt}",
  "task.created_topic_link": "🔗 Geplante Ausführungen werden hier gesendet: {url}",
  "task.create_error": "🔴 Die geplante Aufgabe konnte nicht erstellt werden.",
  "task.blocked.expected_text":
    "⚠️ Schließe zuerst die Einrichtung der geplanten Aufgabe ab oder nutze /abort zum Abbrechen.",
  "task.blocked.command_not_allowed":
    "⚠️ Dieser Befehl ist während der Einrichtung einer geplanten Aufgabe nicht verfügbar.",
  "task.blocked.finish_or_abort_to_change_defaults":
    "⚠️ Diese Aufgabe hat die aktuellen Standardwerte aus 🎛️ Session Control bereits übernommen. Schließe sie so ab oder nutze /abort und starte /task neu, wenn du andere Standardwerte möchtest.",
  "task.blocked.only_defaults_before_prompt":
    "⚠️ Die Einrichtung der geplanten Aufgabe ist aktiv. Vor dem finalen Prompt kannst du nur Agent-, Modell- oder Varianten-Standards ändern; sonst schließe die Einrichtung ab oder nutze /abort.",
  "task.list.title": "Geplante Aufgaben:",
  "task.list.empty": "📭 Keine geplanten Aufgaben für dieses Projekt in diesem Chat.",
  "task.list.none": "nicht geplant",
  "task.list.next_run": "Nächster Lauf: {value}",
  "task.list.status": "Status: {value}",
  "task.list.prompt": "Prompt: {value}",
  "task.list.delete_button": "Löschen #{index}",
  "task.list.deleted": "Geplante Aufgabe gelöscht",
  "task.list.delete_missing": "Geplante Aufgabe nicht gefunden",
  "task.list.delete_error": "Geplante Aufgabe konnte nicht gelöscht werden",

  "cleanup.topic_use_general": "⚠️ Führe /cleanup im General-Thema aus.",
  "cleanup.requires_forum_general":
    "⚠️ /cleanup ist nur im General-Thema einer forum-fähigen Supergruppe verfügbar.",
  "cleanup.no_topics": "✅ Keine Themen-Sitzungen zum Aufräumen.",
  "cleanup.result":
    "🧹 Aufräumen abgeschlossen. Geprüft: {inspected}, geschlossen: {closed}, übersprungen: {skipped}, fehlgeschlagen: {failed}.",

  "stop.no_active_session":
    "🛑 Agent wurde nicht gestartet\n\nErstelle eine Sitzung mit /new oder wähle eine über /sessions aus.",
  "stop.cancelled_interaction":
    "✅ Die aktuelle Einrichtung wurde abgebrochen. Du kannst jetzt Standardwerte ändern oder neu starten.",
  "stop.in_progress":
    "🛑 Event-Stream gestoppt, sende Abbruchsignal...\n\nWarte darauf, dass der Agent stoppt.",
  "stop.warn_unconfirmed":
    "⚠️ Event-Stream gestoppt, aber der Server hat den Abbruch nicht bestätigt.\n\nPrüfe /status und versuche /abort in ein paar Sekunden erneut.",
  "stop.warn_maybe_finished":
    "⚠️ Event-Stream gestoppt, aber der Agent konnte bereits fertig sein.",
  "stop.success":
    "✅ Agent-Aktion unterbrochen. Von diesem Lauf werden keine weiteren Nachrichten gesendet.",
  "stop.warn_still_busy":
    "⚠️ Signal gesendet, aber der Agent ist noch beschäftigt.\n\nDer Event-Stream ist bereits deaktiviert, daher werden keine Zwischenmeldungen gesendet.",
  "stop.warn_timeout":
    "⚠️ Timeout beim Abbruch.\n\nDer Event-Stream ist bereits deaktiviert, versuche /abort in ein paar Sekunden erneut.",
  "stop.warn_local_only":
    "⚠️ Event-Stream lokal gestoppt, aber serverseitiger Abbruch ist fehlgeschlagen.",
  "stop.error":
    "🔴 Aktion konnte nicht gestoppt werden.\n\nEvent-Stream ist gestoppt, versuche /abort erneut.",

  "opencode_start.already_running_managed":
    "⚠️ OpenCode-Server läuft bereits\n\nPID: {pid}\nBetriebszeit: {seconds} Sekunden",
  "opencode_start.already_running_external":
    "✅ OpenCode-Server läuft bereits als externer Prozess\n\nVersion: {version}\n\nDieser Server wurde nicht vom Bot gestartet, daher kann /opencode-stop ihn nicht stoppen.",
  "opencode_start.starting": "🔄 Starte OpenCode-Server...",
  "opencode_start.start_error":
    "🔴 OpenCode-Server konnte nicht gestartet werden\n\nFehler: {error}\n\nPrüfe, ob OpenCode CLI installiert und im PATH verfügbar ist:\nopencode --version\nnpm install -g @opencode-ai/cli",
  "opencode_start.started_not_ready":
    "⚠️ OpenCode-Server gestartet, aber reagiert nicht\n\nPID: {pid}\n\nDer Server startet möglicherweise noch. Versuche /status in ein paar Sekunden.",
  "opencode_start.success":
    "✅ OpenCode-Server erfolgreich gestartet\n\nPID: {pid}\nVersion: {version}",
  "opencode_start.error":
    "🔴 Beim Starten des Servers ist ein Fehler aufgetreten.\n\nSiehe Anwendungslogs für Details.",
  "opencode_stop.external_running":
    "⚠️ OpenCode-Server läuft als externer Prozess\n\nDieser Server wurde nicht über /opencode-start gestartet.\nStoppe ihn manuell oder nutze /status, um den Zustand zu prüfen.",
  "opencode_stop.not_running": "⚠️ OpenCode-Server läuft nicht",
  "opencode_stop.stopping": "🛑 Stoppe OpenCode-Server...\n\nPID: {pid}",
  "opencode_stop.stop_error": "🔴 OpenCode-Server konnte nicht gestoppt werden\n\nFehler: {error}",
  "opencode_stop.success": "✅ OpenCode-Server erfolgreich gestoppt",
  "opencode_stop.error":
    "🔴 Beim Stoppen des Servers ist ein Fehler aufgetreten.\n\nSiehe Anwendungslogs für Details.",

  "agent.changed_callback": "Modus geändert: {name}",
  "agent.changed_message": "✅ Modus geändert zu: {name}",
  "agent.change_error_callback": "Agent konnte nicht geändert werden",
  "agent.menu.current": "Aktueller Agent: {name}\n\nAgent auswählen:",
  "agent.menu.select": "Agent auswählen:",
  "agent.menu.empty": "⚠️ Keine verfügbaren Agenten",
  "agent.menu.error": "🔴 Agentenliste konnte nicht geladen werden",

  "model.changed_callback": "Modell geändert: {name}",
  "model.changed_message": "✅ Modell geändert zu: {name}",
  "model.change_error_callback": "Modell konnte nicht geändert werden",
  "model.menu.empty": "⚠️ Keine verfügbaren Modelle",
  "model.menu.select": "Modell auswählen:",
  "model.menu.current": "Aktuelles Modell: {name}\n\nModell auswählen:",
  "model.menu.favorites_title":
    "⭐ Favoriten (Füge Modelle in OpenCode CLI zu den Favoriten hinzu)",
  "model.menu.favorites_empty": "— Leer.",
  "model.menu.recent_title": "🕘 Zuletzt verwendet",
  "model.menu.recent_empty": "— Leer.",
  "model.menu.favorites_hint":
    "ℹ️ Füge Modelle in OpenCode CLI zu den Favoriten hinzu, damit sie oben angezeigt werden.",
  "model.search.button": "🔎 Modelle suchen",
  "model.search.prompt": "Sende eine Suchanfrage fuer Modelle.",
  "model.search.results_title": "Modellsuchergebnisse fuer: {query}",
  "model.search.no_results": "Keine Modelle gefunden fuer: {query}",
  "model.search.search_again": "🔁 Erneut suchen",
  "model.search.error": "🔴 Modellsuche fehlgeschlagen",
  "model.menu.error": "🔴 Modellliste konnte nicht geladen werden",

  "messages.project_not_selected":
    "🏗 Projekt ist nicht ausgewaehlt.\n\nWaehle zuerst ein Projekt mit /projects.",
  "messages.session_not_selected":
    "📋 Keine Sitzung ausgewaehlt. Verwende zuerst /sessions oder /new.",
  "messages.session_project_mismatch":
    "⚠️ Die aktuelle Sitzung gehoert zu einem anderen Projekt. Waehle zuerst die passende Sitzung.",
  "messages.empty": "📭 Keine Benutzernachrichten in dieser Sitzung gefunden.",
  "messages.fetch_error": "🔴 Sitzungsnachrichten konnten nicht geladen werden.",
  "messages.select": "Waehle eine Nachricht:",
  "messages.select_page": "Waehle eine Nachricht (Seite {page}):",
  "messages.inactive_callback": "Dieses Nachrichtenmenue ist nicht mehr aktiv",
  "messages.cancelled_callback": "Abgebrochen",
  "messages.page_empty_callback": "Keine Nachrichten auf dieser Seite",
  "messages.button.prev_page": "⬅️ Zurueck",
  "messages.button.next_page": "Weiter ➡️",
  "messages.button.revert": "↩️ Hierhin zuruecksetzen",
  "messages.button.fork": "🌿 Sitzung forken",
  "messages.button.back": "⬅️ Zurueck",
  "messages.button.cancel": "❌ Abbrechen",
  "messages.revert_success": "✅ Sitzung auf diese Nachricht zurueckgesetzt:\n\n{text}",
  "messages.revert_error": "🔴 Sitzung konnte nicht zurueckgesetzt werden.",
  "messages.fork_success": "✅ Neue Sitzung von dieser Nachricht abgespalten:\n\n{text}",
  "messages.fork_error": "🔴 Neue Sitzung konnte nicht abgespalten werden.",

  "variant.model_not_selected_callback": "Fehler: Modell ist nicht ausgewählt",
  "variant.changed_callback": "Variante geändert: {name}",
  "variant.changed_message": "✅ Variante geändert zu: {name}",
  "variant.change_error_callback": "Variante konnte nicht geändert werden",
  "variant.select_model_first": "⚠️ Zuerst ein Modell auswählen",
  "variant.menu.empty": "⚠️ Keine verfügbaren Varianten",
  "variant.menu.current": "Aktuelle Variante: {name}\n\nVariante auswählen:",
  "variant.menu.error": "🔴 Variantenliste konnte nicht geladen werden",

  "context.button.confirm": "✅ Ja, Kontext komprimieren",
  "context.no_active_session": "⚠️ Keine aktive Sitzung. Erstelle eine Sitzung mit /new",
  "context.confirm_text":
    '📊 Kontext-Komprimierung für Sitzung "{title}"\n\nDadurch wird die Kontextnutzung reduziert, indem alte Nachrichten aus dem Verlauf entfernt werden. Die aktuelle Aufgabe wird nicht unterbrochen.\n\nFortfahren?',
  "context.general_not_available":
    "⚠️ Kontext-Kompaktierung ist nur innerhalb eines Sitzungs-Themas verfügbar, nicht im General-Thema.",
  "context.general_not_available_callback": "Öffne zuerst ein Sitzungs-Thema.",
  "context.callback_session_not_found": "Sitzung nicht gefunden",
  "context.callback_compacting": "Komprimiere Kontext...",
  "context.progress": "⏳ Komprimiere Kontext...",
  "context.error": "❌ Kontext-Komprimierung fehlgeschlagen",
  "context.success": "✅ Kontext erfolgreich komprimiert",
  "context.after_compaction": "✅ Kontextfenster nach der Komprimierung: {context}",

  "permission.inactive_callback": "Berechtigungsanfrage ist inaktiv",
  "permission.processing_error_callback": "Verarbeitungsfehler",
  "permission.no_active_request_callback": "Fehler: keine aktive Anfrage",
  "permission.reply.once": "Einmal erlaubt",
  "permission.reply.always": "Immer erlaubt",
  "permission.reply.reject": "Abgelehnt",
  "permission.send_reply_error": "❌ Antwort auf Berechtigungsanfrage konnte nicht gesendet werden",
  "permission.blocked.expected_reply":
    "⚠️ Bitte beantworte zuerst die Berechtigungsanfrage mit den Buttons oben.",
  "permission.blocked.command_not_allowed":
    "⚠️ Dieser Befehl ist erst verfügbar, wenn du die Berechtigungsanfrage beantwortet hast.",
  "permission.header": "{emoji} Berechtigungsanfrage: {name}\n\n",
  "permission.button.allow": "✅ Einmal erlauben",
  "permission.button.always": "🔓 Immer erlauben",
  "permission.button.reject": "❌ Ablehnen",
  "permission.name.bash": "Bash",
  "permission.name.edit": "Bearbeiten",
  "permission.name.write": "Schreiben",
  "permission.name.read": "Lesen",
  "permission.name.webfetch": "Web-Abruf",
  "permission.name.websearch": "Web-Suche",
  "permission.name.glob": "Dateisuche",
  "permission.name.grep": "Inhaltssuche",
  "permission.name.list": "Verzeichnis auflisten",
  "permission.name.task": "Task",
  "permission.name.lsp": "LSP",
  "permission.name.external_directory": "Externes Verzeichnis",

  "question.inactive_callback": "Umfrage ist inaktiv",
  "question.processing_error_callback": "Verarbeitungsfehler",
  "question.select_one_required_callback": "Wähle mindestens eine Option",
  "question.enter_custom_callback": "Sende deine eigene Antwort als Nachricht",
  "question.cancelled": "❌ Umfrage abgebrochen",
  "question.answer_already_received": "Antwort bereits erhalten, bitte warten...",
  "question.completed_no_answers": "✅ Umfrage abgeschlossen (keine Antworten)",
  "question.no_active_project": "❌ Kein aktives Projekt",
  "question.no_active_request": "❌ Keine aktive Anfrage",
  "question.send_answers_error": "❌ Antworten konnten nicht an den Agenten gesendet werden",
  "question.multi_hint": "\n(Du kannst mehrere Optionen auswählen)",
  "question.button.submit": "✅ Fertig",
  "question.button.custom": "🔤 Eigene Antwort",
  "question.button.cancel": "❌ Abbrechen",
  "question.use_custom_button_first":
    '⚠️ Um Text zu senden, tippe zuerst bei der aktuellen Frage auf "Eigene Antwort".',
  "question.summary.title": "✅ Umfrage abgeschlossen!\n\n",
  "question.summary.question": "Frage {index}:\n{question}\n\n",
  "question.summary.answer": "Antwort:\n{answer}\n\n",

  "keyboard.agent_mode": "{emoji} {name} Agent",
  "keyboard.context": "📊 {used} / {limit} ({percent}%)",
  "keyboard.context_empty": "📊 Steuerung",
  "keyboard.general_defaults": "Neue Sitzungs-Standards:",
  "keyboard.general_defaults_info":
    "Diese Standardwerte gelten für neu erstellte Sitzungen in dieser Gruppe:\n• Agent\n• Modell\n• Variante",
  "keyboard.variant": "💭 {name}",
  "keyboard.variant_default": "💡 Standard",
  "keyboard.updated": "⌨️ Tastatur aktualisiert",
  "keyboard.dm.status": "/status",
  "keyboard.dm.help": "/help",
  "keyboard.dm.opencode_start": "/opencode_start",
  "keyboard.dm.opencode_stop": "/opencode_stop",

  "pinned.default_session_title": "neue Sitzung",
  "pinned.unknown": "Unbekannt",
  "pinned.line.project": "Projekt: {project}",
  "pinned.line.model": "Modell: {model}",
  "pinned.line.context": "Kontext: {used} / {limit} ({percent}%)",
  "pinned.line.cost": "Kosten: {cost}",
  "subagent.completed": "Abgeschlossen",
  "subagent.failed": "Fehlgeschlagen",
  "subagent.working": "Arbeitet",
  "subagent.line.task": "Aufgabe: {task}",
  "subagent.line.agent": "Agent: {agent}",
  "pinned.files.title": "Dateien ({count}):",
  "pinned.files.item": "  {path}{diff}",
  "pinned.files.more": "  ... und {count} mehr",

  "tool.todo.overflow": "*({count} weitere Aufgaben)*",
  "tool.file_header.write":
    "Datei/Pfad schreiben: {path}\n============================================================\n\n",
  "tool.file_header.edit":
    "Datei/Pfad bearbeiten: {path}\n============================================================\n\n",

  "runtime.wizard.ask_token": "Telegram-Bot-Token eingeben (von @BotFather).\n> ",
  "runtime.wizard.ask_language":
    "Oberflächensprache auswählen.\nGib die Sprach-Nummer aus der Liste oder den Locale-Code ein.\nDrücke Enter, um die Standardsprache beizubehalten: {defaultLocale}\n{options}\n> ",
  "runtime.wizard.language_invalid":
    "Gib eine Sprach-Nummer aus der Liste oder einen unterstützten Locale-Code ein.\n",
  "runtime.wizard.language_selected": "Ausgewählte Sprache: {language}\n",
  "runtime.wizard.token_required": "Token ist erforderlich. Bitte versuche es erneut.\n",
  "runtime.wizard.token_invalid":
    "Token sieht ungültig aus (erwartetes Format <id>:<secret>). Bitte versuche es erneut.\n",
  "runtime.wizard.ask_user_id":
    "Gib deine Telegram User ID ein (du bekommst sie bei @userinfobot).\n> ",
  "runtime.wizard.user_id_invalid": "Gib eine positive ganze Zahl ein (> 0).\n",
  "runtime.wizard.ask_api_url":
    "OpenCode API URL eingeben (optional).\nEnter drücken für Standard: {defaultUrl}\n> ",
  "runtime.wizard.ask_server_username":
    "Benutzernamen des OpenCode-Servers eingeben (optional).\nEnter drücken für Standard: {defaultUsername}\n> ",
  "runtime.wizard.ask_server_password":
    "Passwort des OpenCode-Servers eingeben (optional, Eingabe verborgen).\nEnter drücken zum Überspringen.\n> ",
  "runtime.wizard.api_url_invalid":
    "Gib eine gültige URL (http/https) ein oder drücke Enter für Standard.\n",
  "runtime.wizard.start": "OpenCode Telegram Group Topics Bot Einrichtung.\n",
  "runtime.wizard.saved": "Konfiguration gespeichert:\n- {envPath}\n- {settingsPath}\n",
  "runtime.wizard.not_configured_starting":
    "Anwendung ist noch nicht konfiguriert. Starte Assistent...\n",
  "runtime.wizard.tty_required":
    "Der interaktive Assistent erfordert ein TTY-Terminal. Führe `opencode-telegram-group-topics-bot config` in einer interaktiven Shell aus.",

  "rename.no_session": "⚠️ Keine aktive Sitzung. Erstelle oder wähle zuerst eine Sitzung.",
  "rename.prompt": "📝 Neuen Titel für die Sitzung eingeben:\n\nAktuell: {title}",
  "rename.empty_title": "⚠️ Titel darf nicht leer sein.",
  "rename.success": "✅ Sitzung umbenannt in: {title}",
  "rename.error": "🔴 Sitzung konnte nicht umbenannt werden.",
  "rename.cancelled": "❌ Umbenennen abgebrochen.",
  "rename.inactive_callback": "Umbenennen-Anfrage ist inaktiv",
  "rename.inactive": "⚠️ Umbenennen-Anfrage ist nicht aktiv. Starte /rename erneut.",
  "rename.blocked.expected_name":
    "⚠️ Sende den neuen Sitzungsnamen als Text oder tippe in der Umbenennen-Nachricht auf Abbrechen.",
  "rename.blocked.command_not_allowed":
    "⚠️ Dieser Befehl ist nicht verfügbar, solange beim Umbenennen auf einen neuen Namen gewartet wird.",
  "rename.button.cancel": "❌ Abbrechen",

  "commands.select": "Wähle einen OpenCode-Befehl:",
  "commands.empty": "📭 Für dieses Projekt sind keine OpenCode-Befehle verfügbar.",
  "commands.fetch_error": "🔴 OpenCode-Befehle konnten nicht geladen werden.",
  "commands.no_description": "Keine Beschreibung",
  "commands.select_page": "Wähle einen OpenCode-Befehl ({current}/{total}):",
  "commands.button.execute": "✅ Ausführen",
  "commands.button.prev_page": "⬅️ Zurück",
  "commands.button.next_page": "Weiter ➡️",
  "commands.button.cancel": "❌ Abbrechen",
  "commands.confirm":
    "{command} ausführen? Sende eine Textantwort für Argumente oder tippe auf Ausführen, um den Befehl direkt zu starten.",
  "commands.inactive_callback": "Dieses Befehlsmenü ist inaktiv",
  "commands.cancelled_callback": "Abgebrochen",
  "commands.execute_callback": "Befehl wird ausgeführt...",
  "commands.executing": "⚡ OpenCode-Befehl wird gestartet\n{command}",
  "commands.arguments_empty":
    "⚠️ Argumente dürfen nicht leer sein. Sende Text oder tippe auf Ausführen.",
  "commands.execute_error": "🔴 OpenCode-Befehl konnte nicht ausgeführt werden.",

  "cmd.description.rename": "Aktuelle Sitzung umbenennen",

  "cli.usage":
    "Verwendung:\n  opencode-telegram-group-topics-bot [start] [--mode sources|installed]\n  opencode-telegram-group-topics-bot status\n  opencode-telegram-group-topics-bot stop\n  opencode-telegram-group-topics-bot config [--mode sources|installed]\n\nHinweise:\n  - Ohne Befehl wird standardmäßig `start` verwendet\n  - `config` nutzt standardmäßig den Modus `installed`, außer `--mode sources` wird gesetzt",
  "cli.placeholder.status":
    "Befehl `status` ist derzeit ein Platzhalter. Echte Statusprüfungen werden in der Service-Schicht hinzugefügt (Phase 5).",
  "cli.placeholder.stop":
    "Befehl `stop` ist derzeit ein Platzhalter. Ein echter Stop des Hintergrundprozesses wird in der Service-Schicht hinzugefügt (Phase 5).",
  "cli.placeholder.unavailable": "Befehl ist nicht verfügbar.",
  "cli.error.prefix": "CLI-Fehler: {message}",
  "cli.args.unknown_command": "Unbekannter Befehl: {value}",
  "cli.args.mode_requires_value": "Option --mode erfordert einen Wert: sources|installed",
  "cli.args.invalid_mode": "Ungültiger Wert für --mode: {value}. Erwartet sources|installed",
  "cli.args.unknown_option": "Unbekannte Option: {value}",
  "cli.args.mode_only_start": "Option --mode wird nur für die Befehle start und config unterstützt",

  "legacy.models.fetch_error":
    "🔴 Modellliste konnte nicht geladen werden. Prüfe den Serverstatus mit /status.",
  "legacy.models.empty": "📋 Keine verfügbaren Modelle. Konfiguriere Provider in OpenCode.",
  "legacy.models.header": "📋 Verfügbare Modelle:\n\n",
  "legacy.models.no_provider_models": "  ⚠️ Keine verfügbaren Modelle\n",
  "legacy.models.env_hint": "💡 Um ein Modell in .env zu nutzen:\n",
  "legacy.models.error": "🔴 Beim Laden der Modellliste ist ein Fehler aufgetreten.",

  "stt.recognizing": "🎤 Erkenne Audio...",
  "stt.recognized": "🎤 Erkannt:\n{text}",
  "stt.not_configured":
    "🎤 Spracherkennung ist nicht konfiguriert.\n\nSetze STT_API_URL und STT_API_KEY in .env, um sie zu aktivieren.",
  "stt.error": "🔴 Audio konnte nicht erkannt werden: {error}",
  "stt.empty_result": "🎤 Keine Sprache in der Audionachricht erkannt.",

  "start.welcome_dm":
    "👋 Der DM-Modus ist auf Bot-/Serverstatus und Steuerbefehle beschränkt.\n\nNutze einen Gruppen-Topic-Thread für Projekt-/Sitzungsarbeit.",
  "status.global_overview": "📈 Globaler Überblick",
  "status.global_projects": "Projekte: {count}",
  "status.global_sessions": "Sitzungen: {count}",
  "dm.restricted.command":
    "⚠️ Sitzungs-Steuerbefehle sind im DM deaktiviert. Nutze einen Gruppen-Topic-Thread für Projekt-/Sitzungsarbeit.",
  "dm.restricted.prompt":
    "⚠️ Prompts sind im DM deaktiviert. Nutze einen Gruppen-Topic-Thread, um OpenCode-Aufgaben auszuführen.",
  "help.dm.title": "DM-Steuerbefehle",
  "help.dm.command_start": "DM-Modus-Hinweise anzeigen",
  "help.dm.hint": "Nutze Gruppen-Topic-Threads für Projekt-/Sitzungsarbeit.",
  "status.dm.title": "DM-Statusübersicht",
  "status.dm.hint": "Nutze Gruppen-Topic-Threads, um OpenCode-Sitzungen auszuführen.",
  "group.general.prompts_disabled":
    "⚠️ Prompts sind im General-Thema deaktiviert. Verwende /new, um ein eigenes Sitzungs-Thema zu erstellen.",
  "topic.unbound":
    "⚠️ Dieses Thema ist keiner Sitzung zugeordnet. Gehe zum General-Thema und führe /new aus.",
  "cmd.description.skills": "Skills catalog",
  "topic.worktree_missing":
    "⚠️ This topic is linked to a worktree that is no longer available. Switch to Session Control, choose an available worktree, and create a new topic.",
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
};
