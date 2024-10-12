mod cmd;
mod file;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
	tauri::Builder::default()
		.plugin(tauri_plugin_fs::init())
		.plugin(tauri_plugin_dialog::init())
		.invoke_handler(tauri::generate_handler![cmd::read_csv, cmd::open_folder])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
