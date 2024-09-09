use std::collections::HashMap;
use serde::Serialize;

#[derive(Serialize, Debug)]
pub struct Waveform(pub HashMap<String, Vec<f64>>);

impl Default for Waveform {
    fn default() -> Self {
        Waveform::new()
    }
}

impl Waveform {
    pub fn new() -> Self {
        Waveform(HashMap::new())
    }

    pub fn insert(&mut self, key: String, value: Vec<f64>) {
        self.0.insert(key, value);
    }

    pub fn get(&self, key: &str) -> Option<&Vec<f64>> {
        self.0.get(key)
    }

    pub fn get_mut(&mut self, key: &str) -> Option<&mut Vec<f64>> {
        self.0.get_mut(key)
    }

    pub fn retain<F>(&mut self, f: F)
    where
        F: FnMut(&String, &mut Vec<f64>) -> bool
    {
        self.0.retain(f);
    }
}

impl From<HashMap<String, Vec<f64>>> for Waveform {
    fn from(map: HashMap<String, Vec<f64>>) -> Self {
        Waveform(map)
    }
}

impl From<Waveform> for HashMap<String, Vec<f64>> {
    fn from(waveform: Waveform) -> Self {
        waveform.0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_new() {
        let waveform = Waveform::new();
        assert!(waveform.0.is_empty());
    }

    #[test]
    fn test_insert_and_get() {
        let mut waveform = Waveform::new();
        let key = "test_key".to_string();
        let value = vec![1.0, 2.0, 3.0];

        waveform.insert(key.clone(), value.clone());

        assert_eq!(waveform.get(&key), Some(&value));
        assert_eq!(waveform.get("non_existent_key"), None);
    }

    #[test]
    fn test_from_hashmap() {
        let mut map = HashMap::new();
        map.insert("key1".to_string(), vec![1.0, 2.0]);
        map.insert("key2".to_string(), vec![3.0, 4.0]);

        let waveform: Waveform = map.clone().into();

        assert_eq!(waveform.0, map);
    }

    #[test]
    fn test_into_hashmap() {
        let mut waveform = Waveform::new();
        waveform.insert("key1".to_string(), vec![1.0, 2.0]);
        waveform.insert("key2".to_string(), vec![3.0, 4.0]);

        let map: HashMap<String, Vec<f64>> = waveform.into();

        assert_eq!(map.get("key1"), Some(&vec![1.0, 2.0]));
        assert_eq!(map.get("key2"), Some(&vec![3.0, 4.0]));
    }

    #[test]
    fn test_serialize() {
        let mut waveform = Waveform::new();
        waveform.insert("key".to_string(), vec![1.0, 2.0]);

        let serialized = serde_json::to_string(&waveform).unwrap();
        let expected = r#"{"key":[1.0,2.0]}"#;

        assert_eq!(serialized, expected);
    }

    #[test]
    fn test_multiple_inserts() {
        let mut waveform = Waveform::new();
        waveform.insert("key1".to_string(), vec![1.0, 2.0]);
        waveform.insert("key1".to_string(), vec![3.0, 4.0]);

        assert_eq!(waveform.get("key1"), Some(&vec![3.0, 4.0]));
    }

    #[test]
    fn test_empty_vec() {
        let mut waveform = Waveform::new();
        waveform.insert("empty".to_string(), vec![]);

        assert_eq!(waveform.get("empty"), Some(&vec![]));
    }

    #[test]
    fn test_large_dataset() {
        let mut waveform = Waveform::new();
        let large_vec: Vec<f64> = (0..1000000).map(|i| i as f64).collect();

        waveform.insert("large".to_string(), large_vec.clone());

        assert_eq!(waveform.get("large"), Some(&large_vec));
    }

    #[test]
    fn test_retain() {
        let mut waveform = Waveform::new();
        waveform.insert("key1".to_string(), vec![1.0, 2.0]);
        waveform.insert("key2".to_string(), vec![3.0, 4.0, 5.0]);
        waveform.insert("key3".to_string(), vec![5.0, 6.0, 7.0]);

        waveform.retain(|_, values| values.len() > 2);

        assert_eq!(waveform.get("key1"), None);
        assert_eq!(waveform.get("key2"), Some(&vec![3.0, 4.0, 5.0]));
        assert_eq!(waveform.get("key3"), Some(&vec![5.0, 6.0, 7.0]));
    }
}
