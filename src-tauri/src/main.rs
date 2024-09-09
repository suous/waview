#![cfg_attr(
	all(not(debug_assertions), target_os = "windows"),
	windows_subsystem = "windows"
)]

mod cmd;
mod menu;
mod model;
mod utils;

fn main() {
	tauri::Builder::default()
		.menu(menu::custom_menu("waview"))
		.on_menu_event(menu::handle_menu_event)
		.invoke_handler(tauri::generate_handler![cmd::handle_file, cmd::open_folder])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
