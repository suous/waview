use crate::utils::{dir_or_parent, read_csv_to_waveform};
use crate::model::Waveform;

#[tauri::command]
pub async fn read_csv(path: &str) -> Result<Waveform, String> {
	read_csv_to_waveform(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn open_folder(path: &str) -> Result<String, String> {
	let path = dir_or_parent(path).ok_or("Invalid path")?;
	let err = Err(format!("Failed to open {}", path));

	#[cfg(target_os = "macos")]
	{
		std::process::Command::new("open")
			.arg(path)
			.spawn()
			.map_or(err, |_| Ok(path.to_string()))
	}

	#[cfg(target_os = "windows")]
	{
		std::process::Command::new("explorer")
			.arg(path)
			.spawn()
			.map_or(err, |_| Ok(path.to_string()))
	}

	#[cfg(target_os = "linux")]
	{
		std::process::Command::new("xdg-open")
			.arg(path)
			.spawn()
			.map_or(err, |_| Ok(path.to_string()))
	}
}
