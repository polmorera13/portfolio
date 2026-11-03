/* Conexión de la página con el sistema de respuestas.
   La web ya no usa Supabase: las respuestas van a la API propia (api.polmorera.es),
   que guarda en /data/vestadium.json con las mismas reglas que vestadium_respuestas.sql.
   Para volver a Supabase: borra apiBase y rellena supabaseUrl y supabaseAnonKey
   (nunca la service_role key) y aplica supabase/vestadium_respuestas.sql. */
window.VESTADIUM_CONFIG = {
  apiBase: 'https://api.polmorera.es',
  supabaseUrl: '',
  supabaseAnonKey: ''
};
