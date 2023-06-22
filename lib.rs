mod dictionary;
use crossword::BlockedBoard;
use dictionary::*;
mod crossword;
mod err;
use err::*;

use serde_json;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
/// creates a new instance of a dictionary and return the json version
pub fn new_dict_json() -> String {
    let dict = Dictionary::new();
    let json = dict.to_json();
    match json {
        Ok(d) => d,
        Err(e) => e.to_json(),
    }
}

#[wasm_bindgen]
pub fn add_words_text_list(dict_json: &str, words: &str) -> String {
    if let Ok(mut d) = serde_json::from_str::<Dictionary>(dict_json) {
        for word in words.lines() {
            let w = word.trim();
            d.insert(w);
        }

        return match d.to_json() {
            Ok(json) => json,
            Err(_) => dict_json.to_string(),
        };
    }
    dict_json.to_string()
}

#[wasm_bindgen]
pub fn solve_nyt(dict_json: &str, blocked_board_json: &str, time_secs: u32, tries: u32) -> String {
    let (dict,mut blocked) = match try_dict_blocked(dict_json, blocked_board_json) {
        Ok(ok) => ok,
        Err(e) => return e.to_json(),
    };

    let solution =
        crossword::validate_and_solve_timed_tries(&mut blocked.bb, 3, 3, &dict, time_secs as u64, tries as usize);
    return match solution {
        Ok(s) => s.to_json(),
        Err(e) => e.to_json(),
    };
}

#[wasm_bindgen]
pub fn solve_free(dict_json: &str, blocked_board_json: &str, time_secs: u32, tries: u32) ->  String {
    let (dict,mut blocked) = match try_dict_blocked(dict_json, blocked_board_json) {
        Ok(ok) => ok,
        Err(e) => return e.to_json(),
    };


    let solution =
        crossword::validate_and_solve_timed_tries(&mut blocked.bb, 3, 1, &dict, time_secs as u64, tries as usize);
    return match solution {
        Ok(s) => s.to_json(),
        Err(e) => e.to_json(),
    };
}

fn try_dict_blocked(dict_json: &str, blocked_board_json: &str) -> Result<(Dictionary, BlockedBoard), Error> {
    let dict = match serde_json::from_str::<Dictionary>(dict_json) {
        Ok(d) => d,
        Err(_) => return Err(Error::FailedToConvertToJson),
    };

    let blocked = match serde_json::from_str::<crossword::BlockedBoard>(blocked_board_json) {
        Ok(bb) => bb,
        Err(_) => return Err(Error::FailedToConvertToJson),
    };

    Ok((dict, blocked))
}
