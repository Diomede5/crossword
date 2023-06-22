use super::err::Error;
use serde::{Deserialize, Serialize};
use std::{collections::{HashMap, HashSet}, hash::BuildHasherDefault};
use fxhash::FxHasher;

type FxHashMap<K, V> = HashMap<K, V, BuildHasherDefault<FxHasher>>;

#[derive(Serialize, Deserialize)]
pub struct Dictionary {
    root: DictNode,
}

#[derive(Serialize, Deserialize)]
struct DictNode {
    is_word: Option<String>,
    nodes: FxHashMap<char, DictNode>,
}

#[derive(Serialize, Deserialize, PartialEq, Clone)]
pub struct WordDef {
    pos: String,
    def: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct WordDefs {
    pub spelling: String,
    pub defs: Vec<WordDef>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Word {
    pub spelling: String,
    pub pos: String,
    pub def: String,
}

#[derive(Serialize, Deserialize)]
pub struct Words {
    pub words: Vec<Word>,
}

impl Dictionary {

    /// new empty dictionary
    pub fn new() -> Dictionary {
        Dictionary {
            root: DictNode::new(),
        }
    }

    /// insert a word into the dictionary, unchecked if word already in dictionary
    pub fn insert(&mut self, spelling: &str) {
        let mut current_node = &mut self.root;
        let mut current_spelling = String::new();

        for c in spelling.chars() {
            current_spelling.push(c);
            current_node = current_node.nodes.entry(c).or_insert(DictNode::new())
        }

        current_node.is_word = Some(spelling.to_string());
    }

    /// returns all possible words that the Vec<HashSet<char>> could represent and the limited hashsets
    pub fn look_up_possible(
        &self,
        possible_chars: &Vec<&HashSet<char>>,
    ) -> Option<(Vec<&String>, Vec<(HashSet<char>, bool)>)> {
        let mut new_hashes: Vec<HashSet<char>> =
            vec![HashSet::with_capacity(26); possible_chars.len()];
        let mut found_words = Vec::new();

        find(
            &self.root.nodes,
            possible_chars,
            0,
            &mut new_hashes,
            &mut found_words,
        );

        if found_words.len() < 1 {
            return None;
        }

        // compair the new hash set to the old ones, if they are differnt then return true with that new hashset
        let mut final_hashes = Vec::new();
        let mut i = 0;
        for hash in new_hashes {
            if hash.len() < possible_chars[i].len() {
                final_hashes.push((hash, true));
            } else {
                final_hashes.push((hash, false));
            }
            i = i + 1;
        }

        return Some((found_words, final_hashes));

        fn find<'a>(
            nodes: &'a FxHashMap<char, DictNode>,
            chars: &Vec<&HashSet<char>>,
            index: usize,
            new_chars: &mut Vec<HashSet<char>>,
            found_words: &mut Vec<&'a String>,
        ) {
            // enter the next layer of the trie
            for c in chars[index] {
                if let Some(next_node) = nodes.get(c) {
                    if index == chars.len() - 1 {
                        let spelling = match &next_node.is_word {
                            Some(s) => s,
                            None => return,
                        };
                        found_words.push(spelling);
                        // update the new hashsets to contain the chars from the found spelling
                        for (found_i, found_c) in spelling.char_indices() {
                            new_chars[found_i].insert(found_c);
                        }
                        return;
                    }
                    find(&next_node.nodes, chars, index + 1, new_chars, found_words);
                }
            }

            return;
        }
    }

    /// tries to convert dictionary to json format
    pub fn to_json(&self) -> Result<String, Error> {
        match serde_json::to_string_pretty(&self) {
            Ok(json) => Ok(json),
            Err(_) => Err(Error::FailedToConvertToJson),
        }
    }
}

impl DictNode {
    fn new() -> DictNode {
        DictNode {
            is_word: None,
            nodes: FxHashMap::default(),
        }
    }
}
