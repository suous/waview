use std::io::Read;
use std::error::Error;
use csv::{ReaderBuilder};
use std::collections::HashMap;

pub type Waveform = HashMap<String, Vec<f64>>;

const COMPRESSION_HEADERS: [([u8; 2], bool); 4] = [
    ([0x1F, 0x8B], true),  // GZIP
    ([0x78, 0x01], false), // ZLIB0
    ([0x78, 0x9C], false), // ZLIB1
    ([0x78, 0xDA], false), // ZLIB2
];

fn is_compressed(bytes: &[u8]) -> bool {
    COMPRESSION_HEADERS.iter().any(|(header, _)| bytes.starts_with(header))
}

fn decompress(bytes: &[u8]) -> Option<Vec<u8>> {
    COMPRESSION_HEADERS.iter().find(|(header, _)| bytes.starts_with(header)).and_then(|(_, is_gzip)| {
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
	let file = std::fs::read(path).ok()?;
	match is_compressed(&file) {
		true => decompress(&file),
		false => Some(file),
	}
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
        .has_headers(false)
        .flexible(true)
        .from_reader(csv_data.as_slice());

    let mut waveform = Waveform::new();
    let mut records = reader.records();

    if let Some(Ok(keys)) = records.next() {
        for key in keys.iter() {
            waveform.insert(key.to_string(), Vec::new());
        }

        for record in records {
            let record = record?;
            for (i, field) in record.iter().enumerate() {
                if let Some(values) = waveform.get_mut(keys.get(i).unwrap_or_default()) {
                    if let Ok(value) = field.parse::<f64>() {
                        values.push(value);
                    }
                }
            }
        }
        waveform.retain(|_, values| !values.is_empty());
    }
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
