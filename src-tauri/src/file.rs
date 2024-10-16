use csv::ReaderBuilder;
use std::collections::HashMap;
use std::error::Error;
use std::io::Read;

pub type Waveform = HashMap<String, Vec<f64>>;

const COMPRESSION_HEADERS: [([u8; 2], bool); 4] = [
	([0x1F, 0x8B], true),  // GZIP
	([0x78, 0x01], false), // ZLIB0
	([0x78, 0x9C], false), // ZLIB1
	([0x78, 0xDA], false), // ZLIB2
];

fn decompress(bytes: &[u8]) -> Option<Vec<u8>> {
	COMPRESSION_HEADERS
		.iter()
		.find(|(header, _)| bytes.starts_with(header))
		.and_then(|(_, is_gzip)| {
			let mut decoder: Box<dyn Read> = if *is_gzip {
				Box::new(flate2::read::MultiGzDecoder::new(bytes))
			} else {
				Box::new(flate2::read::ZlibDecoder::new(bytes))
			};
			let mut buffer = Vec::new();
			decoder.read_to_end(&mut buffer).ok()?;
			Some(buffer)
		})
}

fn read_file(path: &str) -> Option<Vec<u8>> {
	std::fs::read(path)
		.ok()
		.and_then(|file| decompress(&file).or(Some(file)))
}

pub fn dir_or_parent(path: &str) -> Option<&str> {
	let path = std::path::Path::new(path);
	path.is_dir()
		.then_some(path)
		.or_else(|| path.parent())
		.and_then(|p| p.to_str())
}

pub fn read_csv_to_waveform(path: &str) -> Result<Waveform, Box<dyn Error>> {
	let csv_data = read_file(path).ok_or("Failed to read file")?;
	let mut reader = ReaderBuilder::new()
		.has_headers(true)
		.flexible(true)
		.from_reader(csv_data.as_slice());

	let headers: Vec<String> = reader
		.headers()?
		.iter()
		.map(str::trim)
		.map(String::from)
		.collect();

	let mut waveform: Waveform = headers
		.iter()
		.map(|header| (header.clone(), Vec::new()))
		.collect();

	for result in reader.records() {
		let record = result?;
		for (header, field) in headers.iter().zip(record.iter()) {
			if let Ok(value) = field.trim().parse::<f64>() {
				waveform.get_mut(header).unwrap().push(value);
			}
		}
	}

	waveform.retain(|_, values| !values.is_empty());
	Ok(waveform)
}

#[cfg(test)]
mod tests {
	use super::*;
	use std::io::Write;

	fn generate_temp_csv_file() -> std::path::PathBuf {
		let temp_dir = std::env::temp_dir();
		let temp_file = temp_dir.join("test.csv");
		let mut file = std::fs::File::create(&temp_file).unwrap();
		file.write_all(b"time,value\n0,1\n1,2\n2,3").unwrap();
		temp_file
	}

	fn generate_temp_gziped_csv_file() -> std::path::PathBuf {
		let temp_dir = std::env::temp_dir();
		let temp_file = temp_dir.join("test.csv.gz");
		let mut file = std::fs::File::create(&temp_file).unwrap();
		file.write_all(b"time,value\n0,1\n1,2\n2,3").unwrap();
		temp_file
	}

	#[test]
	fn test_read_file_not_found() {
		let file_path = "nonexistent.csv";
		assert!(read_file(file_path).is_none());
	}

	#[test]
	fn test_read_csv_to_waveform() {
		let temp_file = generate_temp_csv_file();
		let waveform = read_csv_to_waveform(&temp_file.to_str().unwrap()).unwrap();
		assert_eq!(waveform.get("time"), Some(&vec![0.0, 1.0, 2.0]));
		assert_eq!(waveform.get("value"), Some(&vec![1.0, 2.0, 3.0]));
	}

	#[test]
	fn test_read_gziped_csv_to_waveform() {
		let temp_file = generate_temp_gziped_csv_file();
		let waveform = read_csv_to_waveform(&temp_file.to_str().unwrap()).unwrap();
		assert_eq!(waveform.get("time"), Some(&vec![0.0, 1.0, 2.0]));
		assert_eq!(waveform.get("value"), Some(&vec![1.0, 2.0, 3.0]));
	}
}
