use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent, Wry};

pub fn custom_menu(#[allow(unused)] app_name: &str) -> Menu {
	let mut menu = Menu::new();
	#[cfg(target_os = "macos")]
	{
		use tauri::AboutMetadata;
		menu = menu.add_submenu(Submenu::new(
			app_name,
			Menu::new()
				.add_native_item(MenuItem::About(
					app_name.to_string(),
					AboutMetadata::default(),
				))
				.add_native_item(MenuItem::Separator)
				.add_item(
					CustomMenuItem::new("preference", "Preference").accelerator("CmdOrCtrl+,"),
				)
				.add_native_item(MenuItem::Separator)
				.add_native_item(MenuItem::Services)
				.add_native_item(MenuItem::Separator)
				.add_native_item(MenuItem::Hide)
				.add_native_item(MenuItem::HideOthers)
				.add_native_item(MenuItem::ShowAll)
				.add_native_item(MenuItem::Separator)
				.add_native_item(MenuItem::Quit),
		));
	}

	let file_menu = Menu::new()
		.add_item(CustomMenuItem::new("open", "Open").accelerator("CmdOrCtrl+O"))
		.add_item(CustomMenuItem::new("display", "Display").accelerator("CmdOrCtrl+D"))
		.add_item(CustomMenuItem::new("split", "Split").accelerator("CmdOrCtrl+N"));
	menu = menu.add_submenu(Submenu::new("File", file_menu));

	#[cfg(target_os = "macos")]
	{
		menu = menu.add_submenu(Submenu::new(
			"View",
			Menu::new().add_native_item(MenuItem::EnterFullScreen),
		));
	}

	let mut window_menu = Menu::new();
	#[cfg(not(target_os = "macos"))]
	{
		window_menu = window_menu
			.add_item(CustomMenuItem::new("preference", "Preference").accelerator("CmdOrCtrl+,"));
	}
	window_menu = window_menu.add_native_item(MenuItem::Minimize);
	#[cfg(target_os = "macos")]
	{
		window_menu = window_menu.add_native_item(MenuItem::Zoom);
		window_menu = window_menu.add_native_item(MenuItem::Separator);
	}
	window_menu = window_menu.add_native_item(MenuItem::CloseWindow);
	menu = menu.add_submenu(Submenu::new("Window", window_menu));

	menu
}

macro_rules! emit {
	($event:expr, $name:expr) => {{
		$event.window().emit($name, None::<()>).unwrap()
	}};
}

pub fn handle_menu_event(event: WindowMenuEvent<Wry>) {
	match event.menu_item_id() {
		"preference" => emit!(event, "main-open-preference"),
		"open" => emit!(event, "main-open-files"),
		"display" => emit!(event, "main-toggle-display-files"),
		"split" => emit!(event, "main-split-waveforms"),
		_ => {}
	}
}
