import type { I18nDictionary } from "./en.js";

export const es: I18nDictionary = {
  "cmd.description.status": "Estado del servidor y de la sesión",
  "cmd.description.new": "Crear una sesión nueva",
  "cmd.description.abort": "Abortar la acción actual",
  "cmd.description.stop": "Detener la acción actual",
  "cmd.description.sessions": "Listar sesiones",
  "cmd.description.messages": "Explorar mensajes de la sesion",
  "cmd.description.last": "Mostrar el último mensaje de la sesión",
  "cmd.description.tts": "Alternar respuestas de audio",
  "cmd.description.projects": "Listar proyectos",
  "cmd.description.task": "Crear una tarea programada",
  "cmd.description.tasklist": "Listar tareas programadas",
  "cmd.description.commands": "Comandos personalizados",
  "cmd.description.model": "Seleccionar modelo",
  "cmd.description.agent": "Seleccionar agente",
  "cmd.description.cleanup": "Cerrar temas obsoletos",
  "cmd.description.opencode_start": "Iniciar servidor OpenCode",
  "cmd.description.opencode_stop": "Detener servidor OpenCode",
  "cmd.description.help": "Ayuda",
  "cmd.description.open": "Añadir proyecto navegando directorios",

  "callback.unknown_command": "Comando desconocido",
  "callback.processing_error": "Error de procesamiento",

  "error.load_agents": "❌ No se pudo cargar la lista de agentes",
  "error.load_models": "❌ No se pudo cargar la lista de modelos",
  "error.load_variants": "❌ No se pudo cargar la lista de variantes",
  "error.context_button": "❌ No se pudo procesar el botón de contexto",
  "error.generic": "🔴 Algo salió mal.",

  "interaction.blocked.expired": "⚠️ Esta interacción ha expirado. Por favor, iníciala de nuevo.",
  "interaction.blocked.expected_callback":
    "⚠️ Para este paso, usa los botones en línea o toca Cancelar.",
  "interaction.blocked.expected_text": "⚠️ Para este paso, envía un mensaje de texto.",
  "interaction.blocked.expected_command": "⚠️ Para este paso, envía un comando.",
  "interaction.blocked.command_not_allowed":
    "⚠️ Este comando no está disponible en el paso actual.",
  "interaction.blocked.finish_current":
    "⚠️ Termina primero la interacción actual (responde o cancela) y después abre otro menú.",

  "inline.blocked.expected_choice":
    "⚠️ Elige una opción usando los botones en línea o toca Cancelar.",
  "inline.blocked.command_not_allowed":
    "⚠️ Este comando no está disponible mientras el menú en línea está activo.",

  "question.blocked.expected_answer":
    "⚠️ Responde la pregunta actual usando botones, Respuesta personalizada o Cancelar.",
  "question.blocked.command_not_allowed":
    "⚠️ Este comando no está disponible hasta que se complete el flujo de la pregunta actual.",

  "inline.button.cancel": "❌ Cancelar",
  "inline.inactive_callback": "Este menú está inactivo",
  "inline.cancelled_callback": "Cancelado",

  "common.unknown": "desconocido",
  "common.unknown_error": "error desconocido",

  "start.welcome":
    "👋 ¡Bienvenido a OpenCode Telegram Group Topics Bot!\n\nUsa los comandos:\n/projects — seleccionar proyecto\n/sessions — lista de sesiones\n/new — sesión nueva\n/status — estado\n/help — ayuda\n\nUsa los botones inferiores para elegir modo, modelo y variante.",
  "help.keyboard_hint":
    "💡 Usa los botones inferiores para modo del agente, modelo, variante y acciones de contexto.",
  "help.text":
    "📖 **Ayuda**\n\n/status - Ver estado del servidor\n/sessions - Lista de sesiones\n/new - Crear una sesión nueva\n/help - Ayuda",

  "bot.thinking": "💭 Pensando...",
  "bot.project_not_selected":
    "🏗 No hay un proyecto seleccionado.\n\nPrimero selecciona un proyecto con /projects.",
  "bot.creating_session": "🔄 Creando una sesión nueva...",
  "bot.create_session_error":
    "🔴 No se pudo crear la sesión. Prueba /new o revisa el estado del servidor con /status.",
  "bot.session_created": "✅ Sesión creada: {title}",
  "bot.session_busy":
    "⏳ Tu solicitud anterior todavía está en ejecución, por eso esta nueva no se inició.\n\nPor qué pasó: OpenCode acepta solo una ejecución activa por sesión.\nQué hacer: espera la respuesta actual, o usa /abort si parece bloqueada, y luego envía el mensaje de nuevo.",
  "bot.session_queued":
    "📝 Tu mensaje quedó en cola para esta sesión.\n\nPosición en la cola: {position}\nQué pasará ahora: se iniciará automáticamente cuando termine la ejecución actual.",
  "bot.session_queue_started":
    "▶️ Se está iniciando el siguiente mensaje en cola para esta sesión.\n\nMensaje en cola:\n{preview}",
  "bot.session_reset_project_mismatch":
    "⚠️ La sesión activa no coincide con el proyecto seleccionado, así que se reinició. Usa /sessions para elegir una o /new para crear una nueva.",
  "bot.prompt_send_error":
    "⚠️ No pude entregar este mensaje a OpenCode.\n\nCausa probable: un problema temporal de conexión entre el bot y el servidor OpenCode.\nQué hacer: envía el mensaje otra vez. Si sigue pasando, ejecuta /status y verifica que OpenCode esté accesible.",
  "bot.prompt_send_error_session_not_found":
    "⚠️ No pude entregar este mensaje porque la sesión activa ya no está disponible.\n\nPor qué pasó: la sesión pudo haberse reiniciado, cambiado o eliminado.\nQué hacer: selecciona una sesión con /sessions o crea una nueva con /new, y vuelve a enviar el mensaje.",
  "bot.session_error": "🔴 OpenCode devolvió un error: {message}",
  "bot.session_retry":
    "🔁 {message}\n\nEl proveedor devuelve el mismo error en intentos repetidos. Usa /abort para detenerlo.",
  "bot.unknown_command":
    "⚠️ Comando desconocido: {command}. Usa /help para ver los comandos disponibles.",
  "bot.photo_downloading": "⏳ Descargando foto...",
  "bot.photo_too_large": "⚠️ La foto es demasiado grande (max {maxSizeMb}MB)",
  "bot.photo_model_no_image":
    "⚠️ El modelo actual no admite entrada de imagen. Enviaré solo texto.",
  "bot.photo_download_error": "🔴 No se pudo descargar la foto",
  "bot.photo_no_caption":
    "💡 Consejo: agrega un pie de foto para describir que quieres hacer con esta foto.",
  "bot.file_downloading": "⏳ Descargando archivo...",
  "bot.file_too_large": "⚠️ El archivo es demasiado grande (max {maxSizeMb}MB)",
  "bot.file_download_error": "🔴 No se pudo descargar el archivo",
  "bot.model_no_pdf": "⚠️ El modelo actual no admite entrada PDF. Enviaré solo texto.",
  "bot.text_file_too_large": "⚠️ El archivo de texto es demasiado grande (max {maxSizeKb}KB)",

  "status.header_running": "🟢 OpenCode Server está en ejecución",
  "status.health.healthy": "Saludable",
  "status.health.unhealthy": "No saludable",
  "status.line.health": "Estado: {health}",
  "status.line.version": "Versión: {version}",
  "status.line.managed_yes": "Administrado por el bot: Sí",
  "status.line.managed_no": "Administrado por el bot: No",
  "status.line.pid": "PID: {pid}",
  "status.line.uptime_sec": "Tiempo activo: {seconds} s",
  "status.line.mode": "Agente: {mode}",
  "status.line.model": "Modelo: {model}",
  "status.line.tts": "Respuestas TTS: {tts}",
  "status.tts.on": "Activadas",
  "status.tts.off": "Desactivadas",
  "status.agent_not_set": "no configurado",
  "status.project_selected": "🏗 Proyecto: {project}",
  "status.project_not_selected": "🏗 Proyecto: no seleccionado",
  "status.project_hint": "Usa /projects para seleccionar un proyecto",
  "status.session_selected": "📋 Sesión actual: {title}",
  "status.session_not_selected": "📋 Sesión actual: no seleccionada",
  "status.session_hint": "Usa /sessions para elegir una o /new para crear una",
  "status.server_unavailable":
    "🔴 OpenCode Server no está disponible\n\nUsa /opencode_start para iniciar el servidor.",

  "tts.enabled": "🔊 Respuestas de audio activadas globalmente.",
  "tts.not_configured":
    "⚠️ Las respuestas de audio no estan disponibles. Configura primero `TTS_API_URL` y `TTS_API_KEY`.",
  "tts.disabled": "🔇 Respuestas de audio desactivadas globalmente.",
  "tts.failed": "⚠️ No se pudo generar la respuesta de audio.",

  "projects.empty":
    "📭 No se encontraron proyectos.\n\nAbre un directorio en OpenCode y crea al menos una sesión; entonces aparecerá aquí.",
  "projects.select": "Selecciona un proyecto:",
  "projects.select_with_current": "Selecciona un proyecto:\n\nActual: 🏗 {project}",
  "projects.page_indicator": "Página {current}/{total}",
  "projects.prev_page": "⬅️ Anterior",
  "projects.next_page": "Siguiente ➡️",
  "projects.fetch_error":
    "🔴 OpenCode Server no está disponible u ocurrió un error al cargar los proyectos.",
  "projects.page_load_error": "No se puede cargar esta página. Inténtalo de nuevo.",
  "projects.selected":
    "✅ Proyecto seleccionado: {project}\n\n📋 La sesión se reinició. Usa /sessions o /new para este proyecto.",
  "projects.select_error": "🔴 No se pudo seleccionar el proyecto.",
  "projects.locked.topic_scope":
    "⚠️ Este tema está vinculado a su propio ámbito de proyecto/sesión. Cambia de proyecto solo desde General antes de crear temas.",
  "projects.locked.group_project":
    "⚠️ Este grupo ya está configurado para el proyecto: {project}. Crea un grupo nuevo si quieres trabajar en otro repositorio.",
  "projects.locked.callback": "El cambio de proyecto está bloqueado para este grupo.",

  "open.back": "⬆️ Subir",
  "open.roots": "📋 Volver a raíces",
  "open.prev_page": "⬅️ Anterior",
  "open.next_page": "Siguiente ➡️",
  "open.select_current": "✅ Seleccionar esta carpeta",
  "open.select_root": "📂 Selecciona un directorio raíz para explorar:",
  "open.access_denied": "⛔ Acceso denegado: la ruta está fuera de los directorios permitidos",
  "open.scan_error": "🔴 No se puede explorar el directorio: {error}",
  "open.open_error": "🔴 No se pudo abrir el explorador de directorios.",
  "open.selected":
    "✅ Proyecto añadido: {project}\n\n📋 Usa /sessions o /new para empezar a trabajar.",
  "open.select_error": "🔴 No se pudo añadir el proyecto.",
  "open.no_subfolders": "📭 Sin subcarpetas",
  "open.subfolder_count": "{count} subcarpeta",
  "open.subfolders_count": "{count} subcarpetas",

  "sessions.project_not_selected":
    "🏗 No hay un proyecto seleccionado.\n\nPrimero selecciona un proyecto con /projects.",
  "sessions.empty": "📭 No se encontraron sesiones.\n\nCrea una sesión nueva con /new.",
  "sessions.select": "Selecciona una sesión:",
  "sessions.select_page": "Selecciona una sesión (página {page}):",
  "sessions.fetch_error":
    "🔴 OpenCode Server no está disponible u ocurrió un error al cargar las sesiones.",
  "sessions.select_project_first": "🔴 No hay un proyecto seleccionado. Usa /projects.",
  "sessions.page_empty_callback": "No hay sesiones en esta página",
  "sessions.page_load_error_callback": "No se puede cargar esta página. Inténtalo de nuevo.",
  "sessions.button.prev_page": "⬅️ Anterior",
  "sessions.button.next_page": "Siguiente ➡️",
  "sessions.topic_locked":
    "⚠️ Este tema está vinculado a su sesión actual. Usa /new en General para crear otro tema.",
  "sessions.general_overview": "Resumen de sesiones por tema:",
  "sessions.general_item": "• {topic} (hilo #{thread}) - {status}",
  "sessions.general_empty": "Aún no hay temas de sesión. Usa /new para crear uno.",
  "sessions.bound_topic_link": "🔗 Tema de esta sesión: {url}",
  "sessions.created_topic_link": "✅ Tema creado para esta sesión: {url}",
  "sessions.loading_context": "⏳ Cargando contexto y los últimos mensajes...",
  "sessions.selected": "✅ Sesión seleccionada: {title}",
  "sessions.select_error": "🔴 No se pudo seleccionar la sesión.",
  "sessions.preview.empty": "No hay mensajes recientes.",
  "sessions.preview.title": "Mensajes recientes:",
  "sessions.preview.you": "Tú:",
  "sessions.preview.agent": "Agente:",
  "sessions.resume.assistant_title": "Último mensaje del agente:",
  "sessions.resume.last_turn_title": "Último mensaje visible:",

  "last.title": "Último mensaje:",
  "last.session_not_selected": "📋 No hay una sesión seleccionada. Usa /sessions o /new primero.",
  "last.empty": "No hay mensajes visibles recientes en esta sesión.",
  "last.fetch_error": "🔴 No se pudo cargar el último mensaje de la sesión.",

  "new.project_not_selected":
    "🏗 No hay un proyecto seleccionado.\n\nPrimero selecciona un proyecto con /projects.",
  "new.created": "✅ Sesión nueva creada: {title}",
  "new.topic_only_in_general":
    "⚠️ Ejecuta /new desde el tema General para crear un tema de sesión dedicado.",
  "new.requires_forum_general":
    "⚠️ /new requiere el tema General en un supergrupo con foros habilitados.",
  "new.topic_created": "✅ El tema de sesión está listo: {title}",
  "new.general_created": "✅ Se creó una nueva sesión de OpenCode y un tema de grupo.",
  "new.topic_create_error":
    "🔴 No se pudo crear el tema de sesión. Verifica permisos de foro e inténtalo de nuevo.",
  "new.topic_create_no_rights":
    "🔴 No puedo crear temas del foro en este grupo. Otorga al bot el permiso de gestionar temas (Manage Topics) y vuelve a ejecutar /new.",
  "new.general_open_link": "🔗 Abrir tema: {url}",
  "new.create_error":
    "🔴 OpenCode Server no está disponible u ocurrió un error al crear la sesión.",

  "task.project_not_selected":
    "🏗 No hay un proyecto seleccionado.\n\nPrimero selecciona un proyecto con /projects.",
  "task.output_topic_blocked":
    "⚠️ Los prompts están desactivados en Scheduled Task Output. Usa 🎛️ Session Control para gestionar proyectos, sesiones y tareas programadas.",
  "task.output_topic_commands_only":
    "⚠️ La mayoría de los comandos están desactivados en Scheduled Task Output. Usa 🎛️ Session Control para gestionar proyectos, sesiones y tareas programadas.",
  "task.schedule_prompt":
    "Envía el horario para esta tarea. Ejemplos: `cada día laboral a las 09:00` o `mañana a las 18:30`.\n\nDespués de analizar el horario, todavía puedes cambiar los valores de agente y modelo de 🎛️ Session Control antes de enviar el prompt final.",
  "task.schedule_parsing": "⏳ Todavía estoy interpretando el horario. Espera la vista previa.",
  "task.schedule_preview":
    "Horario interpretado.\n\nResumen: {summary}\nPróxima ejecución: {nextRunAt}",
  "task.prompt_prompt":
    "Envía el prompt para esta tarea programada. Aún puedes cambiar el agente, modelo o variante de 🎛️ Session Control; la tarea usará los valores activos cuando envíes el prompt final.",
  "task.schedule_error":
    "⚠️ No pude interpretar ese horario: {message}\n\nEnvía una descripción más clara.",
  "task.created":
    "✅ Tarea programada creada.\n\nHorario: {summary}\nPróxima ejecución: {nextRunAt}",
  "task.created_topic_link": "🔗 Las ejecuciones programadas se publicarán aquí: {url}",
  "task.create_error": "🔴 No se pudo crear la tarea programada.",
  "task.blocked.expected_text":
    "⚠️ Termina primero la configuración de la tarea programada o usa /abort para cancelarla.",
  "task.blocked.command_not_allowed":
    "⚠️ Este comando no está disponible mientras la configuración de la tarea programada está activa.",
  "task.blocked.finish_or_abort_to_change_defaults":
    "⚠️ Esta tarea ya guardó los valores actuales de 🎛️ Session Control. Termínala así, o usa /abort y vuelve a iniciar /task si quieres otros valores.",
  "task.blocked.only_defaults_before_prompt":
    "⚠️ La configuración de la tarea programada está activa. Antes del prompt final solo puedes cambiar los valores de agente, modelo o variante; si no, termina la configuración o usa /abort.",
  "task.list.title": "Tareas programadas:",
  "task.list.empty": "📭 No hay tareas programadas para este proyecto en este chat.",
  "task.list.none": "sin programación",
  "task.list.next_run": "Próxima ejecución: {value}",
  "task.list.status": "Estado: {value}",
  "task.list.prompt": "Prompt: {value}",
  "task.list.delete_button": "Eliminar #{index}",
  "task.list.deleted": "Tarea programada eliminada",
  "task.list.delete_missing": "No se encontró la tarea programada",
  "task.list.delete_error": "No se pudo eliminar la tarea programada",

  "cleanup.topic_use_general": "⚠️ Ejecuta /cleanup desde el tema General.",
  "cleanup.requires_forum_general":
    "⚠️ /cleanup solo está disponible en el tema General de un supergrupo con foros habilitados.",
  "cleanup.no_topics": "✅ No hay temas de sesión para limpiar.",
  "cleanup.result":
    "🧹 Limpieza completa. Revisados: {inspected}, cerrados: {closed}, omitidos: {skipped}, fallidos: {failed}.",

  "stop.no_active_session":
    "🛑 El agente no se inició\n\nCrea una sesión con /new o selecciona una con /sessions.",
  "stop.cancelled_interaction":
    "✅ Se canceló la configuración actual. Ahora puedes cambiar los valores o empezar de nuevo.",
  "stop.in_progress":
    "🛑 Flujo de eventos detenido; enviando señal de aborto...\n\nEsperando a que el agente se detenga.",
  "stop.warn_unconfirmed":
    "⚠️ Flujo de eventos detenido, pero el servidor no confirmó el aborto.\n\nRevisa /status y vuelve a intentar /abort en unos segundos.",
  "stop.warn_maybe_finished":
    "⚠️ Flujo de eventos detenido, pero el agente podría haber terminado ya.",
  "stop.success":
    "✅ Acción del agente interrumpida. No se enviarán más mensajes de esta ejecución.",
  "stop.warn_still_busy":
    "⚠️ Señal enviada, pero el agente sigue ocupado.\n\nEl flujo de eventos ya está deshabilitado, así que no se enviarán mensajes intermedios.",
  "stop.warn_timeout":
    "⚠️ Tiempo de espera agotado al solicitar el aborto.\n\nEl flujo de eventos ya está deshabilitado; vuelve a intentar /abort en unos segundos.",
  "stop.warn_local_only":
    "⚠️ Flujo de eventos detenido localmente, pero el aborto en el servidor falló.",
  "stop.error":
    "🔴 No se pudo detener la acción.\n\nEl flujo de eventos está detenido; prueba /abort otra vez.",

  "opencode_start.already_running_managed":
    "⚠️ OpenCode Server ya está en ejecución\n\nPID: {pid}\nTiempo activo: {seconds} segundos",
  "opencode_start.already_running_external":
    "✅ OpenCode Server ya está en ejecución como un proceso externo\n\nVersión: {version}\n\nEste servidor no fue iniciado por el bot, por lo que /opencode-stop no puede detenerlo.",
  "opencode_start.starting": "🔄 Iniciando OpenCode Server...",
  "opencode_start.start_error":
    "🔴 No se pudo iniciar OpenCode Server\n\nError: {error}\n\nRevisa que OpenCode CLI esté instalado y disponible en PATH:\nopencode --version\nnpm install -g @opencode-ai/cli",
  "opencode_start.started_not_ready":
    "⚠️ OpenCode Server se inició, pero no responde\n\nPID: {pid}\n\nEl servidor puede estar iniciando. Prueba /status en unos segundos.",
  "opencode_start.success":
    "✅ OpenCode Server iniciado correctamente\n\nPID: {pid}\nVersión: {version}",
  "opencode_start.error":
    "🔴 Ocurrió un error al iniciar el servidor.\n\nRevisa los logs de la aplicación para más detalles.",
  "opencode_stop.external_running":
    "⚠️ OpenCode Server está en ejecución como un proceso externo\n\nEste servidor no fue iniciado con /opencode-start.\nDeténlo manualmente o usa /status para revisar el estado.",
  "opencode_stop.not_running": "⚠️ OpenCode Server no está en ejecución",
  "opencode_stop.stopping": "🛑 Deteniendo OpenCode Server...\n\nPID: {pid}",
  "opencode_stop.stop_error": "🔴 No se pudo detener OpenCode Server\n\nError: {error}",
  "opencode_stop.success": "✅ OpenCode Server detenido correctamente",
  "opencode_stop.error":
    "🔴 Ocurrió un error al detener el servidor.\n\nRevisa los logs de la aplicación para más detalles.",

  "agent.changed_callback": "Modo cambiado: {name}",
  "agent.changed_message": "✅ Modo cambiado a: {name}",
  "agent.change_error_callback": "No se pudo cambiar el agente",
  "agent.menu.current": "Agente actual: {name}\n\nSelecciona el agente:",
  "agent.menu.select": "Selecciona el agente:",
  "agent.menu.empty": "⚠️ No hay agentes disponibles",
  "agent.menu.error": "🔴 No se pudo obtener la lista de agentes",

  "model.changed_callback": "Modelo cambiado: {name}",
  "model.changed_message": "✅ Modelo cambiado a: {name}",
  "model.change_error_callback": "No se pudo cambiar el modelo",
  "model.menu.empty": "⚠️ No hay modelos disponibles",
  "model.menu.select": "Selecciona el modelo:",
  "model.menu.current": "Modelo actual: {name}\n\nSelecciona el modelo:",
  "model.menu.favorites_title": "⭐ Favoritos (Agrega modelos a favoritos en OpenCode CLI)",
  "model.menu.favorites_empty": "— Vacío.",
  "model.menu.recent_title": "🕘 Recientes",
  "model.menu.recent_empty": "— Vacío.",
  "model.menu.favorites_hint":
    "ℹ️ Agrega modelos a favoritos en OpenCode CLI para mantenerlos arriba de la lista.",
  "model.search.button": "🔎 Buscar modelos",
  "model.search.prompt": "Envia una consulta de busqueda de modelos.",
  "model.search.results_title": "Resultados de modelos para: {query}",
  "model.search.no_results": "No se encontraron modelos para: {query}",
  "model.search.search_again": "🔁 Buscar otra vez",
  "model.search.error": "🔴 Error al buscar modelos",
  "model.menu.error": "🔴 No se pudo obtener la lista de modelos",

  "messages.project_not_selected":
    "🏗 No hay un proyecto seleccionado.\n\nPrimero selecciona un proyecto con /projects.",
  "messages.session_not_selected": "📋 No hay sesion seleccionada. Usa /sessions o /new primero.",
  "messages.session_project_mismatch":
    "⚠️ La sesion actual pertenece a otro proyecto. Primero selecciona la sesion correcta.",
  "messages.empty": "📭 No se encontraron mensajes del usuario en esta sesion.",
  "messages.fetch_error": "🔴 Error al cargar los mensajes de la sesion.",
  "messages.select": "Selecciona un mensaje:",
  "messages.select_page": "Selecciona un mensaje (pagina {page}):",
  "messages.inactive_callback": "Este menu de mensajes ya no esta activo",
  "messages.cancelled_callback": "Cancelado",
  "messages.page_empty_callback": "No hay mensajes en esta pagina",
  "messages.button.prev_page": "⬅️ Anterior",
  "messages.button.next_page": "Siguiente ➡️",
  "messages.button.revert": "↩️ Revertir aqui",
  "messages.button.fork": "🌿 Bifurcar sesion",
  "messages.button.back": "⬅️ Atras",
  "messages.button.cancel": "❌ Cancelar",
  "messages.revert_success": "✅ La sesion se revirtio a este mensaje:\n\n{text}",
  "messages.revert_error": "🔴 No se pudo revertir la sesion.",
  "messages.fork_success": "✅ Se bifurco una nueva sesion desde este mensaje:\n\n{text}",
  "messages.fork_error": "🔴 No se pudo bifurcar una nueva sesion.",

  "variant.model_not_selected_callback": "Error: no hay un modelo seleccionado",
  "variant.changed_callback": "Variante cambiada: {name}",
  "variant.changed_message": "✅ Variante cambiada a: {name}",
  "variant.change_error_callback": "No se pudo cambiar la variante",
  "variant.select_model_first": "⚠️ Selecciona un modelo primero",
  "variant.menu.empty": "⚠️ No hay variantes disponibles",
  "variant.menu.current": "Variante actual: {name}\n\nSelecciona la variante:",
  "variant.menu.error": "🔴 No se pudo obtener la lista de variantes",

  "context.button.confirm": "✅ Sí, compactar contexto",
  "context.no_active_session": "⚠️ No hay una sesión activa. Crea una sesión con /new",
  "context.confirm_text":
    '📊 Compactación de contexto para la sesión "{title}"\n\nEsto reducirá el uso de contexto eliminando mensajes antiguos del historial. La tarea actual no se interrumpirá.\n\n¿Continuar?',
  "context.general_not_available":
    "⚠️ La compactación de contexto solo está disponible dentro de un tema de sesión, no en General.",
  "context.general_not_available_callback": "Primero abre un tema de sesión.",
  "context.callback_session_not_found": "Sesión no encontrada",
  "context.callback_compacting": "Compactando contexto...",
  "context.progress": "⏳ Compactando contexto...",
  "context.error": "❌ La compactación de contexto falló",
  "context.success": "✅ Contexto compactado correctamente",
  "context.after_compaction": "✅ La ventana de contexto tras la compactación es {context}",

  "permission.inactive_callback": "La solicitud de permisos está inactiva",
  "permission.processing_error_callback": "Error de procesamiento",
  "permission.no_active_request_callback": "Error: no hay una solicitud activa",
  "permission.reply.once": "Permitido una vez",
  "permission.reply.always": "Siempre permitido",
  "permission.reply.reject": "Rechazado",
  "permission.send_reply_error": "❌ No se pudo enviar la respuesta de permisos",
  "permission.blocked.expected_reply":
    "⚠️ Primero responde a la solicitud de permisos usando los botones de arriba.",
  "permission.blocked.command_not_allowed":
    "⚠️ Este comando no está disponible hasta que respondas a la solicitud de permisos.",
  "permission.header": "{emoji} Solicitud de permisos: {name}\n\n",
  "permission.button.allow": "✅ Permitir una vez",
  "permission.button.always": "🔓 Permitir siempre",
  "permission.button.reject": "❌ Rechazar",
  "permission.name.bash": "Bash",
  "permission.name.edit": "Editar",
  "permission.name.write": "Escribir",
  "permission.name.read": "Leer",
  "permission.name.webfetch": "Obtener web",
  "permission.name.websearch": "Buscar en la web",
  "permission.name.glob": "Buscar archivos",
  "permission.name.grep": "Buscar contenido",
  "permission.name.list": "Listar directorio",
  "permission.name.task": "Tarea",
  "permission.name.lsp": "LSP",
  "permission.name.external_directory": "Directorio externo",

  "question.inactive_callback": "La encuesta está inactiva",
  "question.processing_error_callback": "Error de procesamiento",
  "question.select_one_required_callback": "Selecciona al menos una opción",
  "question.enter_custom_callback": "Envía tu respuesta personalizada como mensaje",
  "question.cancelled": "❌ Encuesta cancelada",
  "question.answer_already_received": "Respuesta ya recibida, espera...",
  "question.completed_no_answers": "✅ Encuesta completada (sin respuestas)",
  "question.no_active_project": "❌ No hay un proyecto activo",
  "question.no_active_request": "❌ No hay una solicitud activa",
  "question.send_answers_error": "❌ No se pudieron enviar las respuestas al agente",
  "question.multi_hint": "\n(Puedes seleccionar varias opciones)",
  "question.button.submit": "✅ Listo",
  "question.button.custom": "🔤 Respuesta personalizada",
  "question.button.cancel": "❌ Cancelar",
  "question.use_custom_button_first":
    '⚠️ Para enviar texto, primero toca "Respuesta personalizada" para la pregunta actual.',
  "question.summary.title": "✅ ¡Encuesta completada!\n\n",
  "question.summary.question": "Pregunta {index}:\n{question}\n\n",
  "question.summary.answer": "Respuesta:\n{answer}\n\n",

  "keyboard.agent_mode": "{emoji} Agente {name}",
  "keyboard.context": "📊 {used} / {limit} ({percent}%)",
  "keyboard.context_empty": "📊 Controles",
  "keyboard.general_defaults": "Valores por defecto de sesión:",
  "keyboard.general_defaults_info":
    "Estos valores se aplican a las sesiones nuevas creadas en este grupo:\n• Agente\n• Modelo\n• Variante",
  "keyboard.variant": "💭 {name}",
  "keyboard.variant_default": "💡 Predeterminado",
  "keyboard.updated": "⌨️ Teclado actualizado",
  "keyboard.dm.status": "/status",
  "keyboard.dm.help": "/help",
  "keyboard.dm.opencode_start": "/opencode_start",
  "keyboard.dm.opencode_stop": "/opencode_stop",

  "pinned.default_session_title": "sesión nueva",
  "pinned.unknown": "Desconocido",
  "pinned.line.project": "Proyecto: {project}",
  "pinned.line.model": "Modelo: {model}",
  "pinned.line.context": "Contexto: {used} / {limit} ({percent}%)",
  "pinned.line.cost": "Costo: {cost}",
  "subagent.completed": "Completado",
  "subagent.failed": "Fallido",
  "subagent.working": "Trabajando",
  "subagent.line.task": "Tarea: {task}",
  "subagent.line.agent": "Agente: {agent}",
  "pinned.files.title": "Archivos ({count}):",
  "pinned.files.item": "  {path}{diff}",
  "pinned.files.more": "  ... y {count} más",

  "tool.todo.overflow": "*({count} tareas más)*",
  "tool.file_header.write":
    "Escribir archivo/ruta: {path}\n============================================================\n\n",
  "tool.file_header.edit":
    "Editar archivo/ruta: {path}\n============================================================\n\n",

  "runtime.wizard.ask_token": "Introduce el token del bot de Telegram (obtenlo de @BotFather).\n> ",
  "runtime.wizard.ask_language":
    "Selecciona el idioma de la interfaz.\nIntroduce el número del idioma de la lista o el código de locale.\nPulsa Enter para mantener el idioma por defecto: {defaultLocale}\n{options}\n> ",
  "runtime.wizard.language_invalid":
    "Introduce un número de idioma de la lista o un código de locale compatible.\n",
  "runtime.wizard.language_selected": "Idioma seleccionado: {language}\n",
  "runtime.wizard.token_required": "El token es obligatorio. Inténtalo de nuevo.\n",
  "runtime.wizard.token_invalid":
    "El token parece inválido (se espera el formato <id>:<secret>). Inténtalo de nuevo.\n",
  "runtime.wizard.ask_user_id":
    "Introduce tu Telegram User ID (puedes obtenerlo de @userinfobot).\n> ",
  "runtime.wizard.user_id_invalid": "Introduce un entero positivo (> 0).\n",
  "runtime.wizard.ask_api_url":
    "Introduce la URL de la API de OpenCode (opcional).\nPulsa Enter para usar el valor por defecto: {defaultUrl}\n> ",
  "runtime.wizard.ask_server_username":
    "Introduce el nombre de usuario del servidor de OpenCode (opcional).\nPulsa Enter para usar el valor por defecto: {defaultUsername}\n> ",
  "runtime.wizard.ask_server_password":
    "Introduce la contraseña del servidor de OpenCode (opcional, entrada oculta).\nPulsa Enter para omitirla.\n> ",
  "runtime.wizard.api_url_invalid":
    "Introduce una URL válida (http/https) o pulsa Enter para usar el valor por defecto.\n",
  "runtime.wizard.start": "Configuración de OpenCode Telegram Group Topics Bot.\n",
  "runtime.wizard.saved": "Configuración guardada:\n- {envPath}\n- {settingsPath}\n",
  "runtime.wizard.not_configured_starting":
    "La aplicación aún no está configurada. Iniciando el asistente...\n",
  "runtime.wizard.tty_required":
    "El asistente interactivo requiere un terminal TTY. Ejecuta `opencode-telegram-group-topics-bot config` en una shell interactiva.",

  "rename.no_session": "⚠️ No hay una sesión activa. Crea o selecciona una sesión primero.",
  "rename.prompt": "📝 Introduce un nuevo título para la sesión:\n\nActual: {title}",
  "rename.empty_title": "⚠️ El título no puede estar vacío.",
  "rename.success": "✅ Sesión renombrada a: {title}",
  "rename.error": "🔴 No se pudo renombrar la sesión.",
  "rename.cancelled": "❌ Cambio de nombre cancelado.",
  "rename.inactive_callback": "La solicitud de cambio de nombre está inactiva",
  "rename.inactive":
    "⚠️ La solicitud de cambio de nombre no está activa. Ejecuta /rename otra vez.",
  "rename.blocked.expected_name":
    "⚠️ Introduce el nuevo nombre de la sesión como texto o toca Cancelar en el mensaje de cambio de nombre.",
  "rename.blocked.command_not_allowed":
    "⚠️ Este comando no está disponible mientras el cambio de nombre espera un nuevo nombre.",
  "rename.button.cancel": "❌ Cancelar",

  "commands.select": "Elige un comando de OpenCode:",
  "commands.empty": "📭 No hay comandos de OpenCode disponibles para este proyecto.",
  "commands.fetch_error": "🔴 No se pudieron cargar los comandos de OpenCode.",
  "commands.no_description": "Sin descripción",
  "commands.select_page": "Elige un comando de OpenCode ({current}/{total}):",
  "commands.button.execute": "✅ Ejecutar",
  "commands.button.prev_page": "⬅️ Anterior",
  "commands.button.next_page": "Siguiente ➡️",
  "commands.button.cancel": "❌ Cancelar",
  "commands.confirm":
    "¿Ejecutar {command}? Envía una respuesta de texto para pasar argumentos o toca Ejecutar para lanzarlo tal cual.",
  "commands.inactive_callback": "Este menú de comandos está inactivo",
  "commands.cancelled_callback": "Cancelado",
  "commands.execute_callback": "Ejecutando comando...",
  "commands.executing": "⚡ Iniciando comando de OpenCode\n{command}",
  "commands.arguments_empty":
    "⚠️ Los argumentos no pueden estar vacíos. Envía texto o toca Ejecutar.",
  "commands.execute_error": "🔴 No se pudo ejecutar el comando de OpenCode.",

  "cmd.description.rename": "Renombrar la sesión actual",

  "cli.usage":
    "Uso:\n  opencode-telegram-group-topics-bot [start] [--mode sources|installed]\n  opencode-telegram-group-topics-bot status\n  opencode-telegram-group-topics-bot stop\n  opencode-telegram-group-topics-bot config [--mode sources|installed]\n\nNotas:\n  - Sin comando, el valor por defecto es `start`\n  - `config` usa el modo `installed` por defecto salvo que se indique `--mode sources`",
  "cli.placeholder.status":
    "El comando `status` es actualmente un marcador de posición. Las comprobaciones reales de estado se agregarán en la capa de servicio (Fase 5).",
  "cli.placeholder.stop":
    "El comando `stop` es actualmente un marcador de posición. La detención real del proceso en segundo plano se agregará en la capa de servicio (Fase 5).",
  "cli.placeholder.unavailable": "El comando no esta disponible.",
  "cli.error.prefix": "Error de CLI: {message}",
  "cli.args.unknown_command": "Comando desconocido: {value}",
  "cli.args.mode_requires_value": "La opción --mode requiere un valor: sources|installed",
  "cli.args.invalid_mode": "Valor de --mode inválido: {value}. Se espera sources|installed",
  "cli.args.unknown_option": "Opción desconocida: {value}",
  "cli.args.mode_only_start": "La opción --mode solo se admite para los comandos start y config",

  "legacy.models.fetch_error":
    "🔴 No se pudo obtener la lista de modelos. Revisa el estado del servidor con /status.",
  "legacy.models.empty": "📋 No hay modelos disponibles. Configura los proveedores en OpenCode.",
  "legacy.models.header": "📋 Modelos disponibles:\n\n",
  "legacy.models.no_provider_models": "  ⚠️ No hay modelos disponibles\n",
  "legacy.models.env_hint": "💡 Para usar el modelo en .env:\n",
  "legacy.models.error": "🔴 Ocurrió un error al cargar la lista de modelos.",

  "stt.recognizing": "🎤 Reconociendo audio...",
  "stt.recognized": "🎤 Reconocido:\n{text}",
  "stt.not_configured":
    "🎤 El reconocimiento de voz no está configurado.\n\nConfigura STT_API_URL y STT_API_KEY en .env para habilitarlo.",
  "stt.error": "🔴 No se pudo reconocer el audio: {error}",
  "stt.empty_result": "🎤 No se detectó voz en el mensaje de audio.",

  "start.welcome_dm":
    "👋 El modo de DM está limitado a comandos de estado/control del bot y servidor.\n\nUsa un hilo de tema en grupo para trabajar con proyectos y sesiones.",
  "status.global_overview": "📈 Resumen global",
  "status.global_projects": "Proyectos: {count}",
  "status.global_sessions": "Sesiones: {count}",
  "dm.restricted.command":
    "⚠️ Los comandos de control de sesión están deshabilitados en DM. Usa un hilo de tema en grupo para trabajar con proyectos/sesiones.",
  "dm.restricted.prompt":
    "⚠️ Los prompts están deshabilitados en DM. Usa un hilo de tema en grupo para ejecutar tareas de OpenCode.",
  "help.dm.title": "Comandos de control en DM",
  "help.dm.command_start": "mostrar guía del modo DM",
  "help.dm.hint": "Usa hilos de tema en grupo para trabajo de proyecto/sesión.",
  "status.dm.title": "Resumen de estado en DM",
  "status.dm.hint": "Usa hilos de tema en grupo para ejecutar sesiones de OpenCode.",
  "group.general.prompts_disabled":
    "⚠️ Los prompts están deshabilitados en el tema General. Usa /new para crear un tema de sesión dedicado.",
  "topic.unbound":
    "⚠️ Este tema no está vinculado a ninguna sesión. Ve al tema General y ejecuta /new.",
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
