use super::{dictionary::Dictionary, err::Error};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, HashSet, VecDeque};

#[derive(Serialize, Deserialize)]
pub struct BlockedBoard {
    pub bb: Vec<Vec<bool>>,
}

#[derive(Clone, Debug)]
pub struct Solver<'a> {
    cells: HashMap<CellLocation, Cell>,
    update: VecDeque<WordPlacement<'a>>,
    to_add: Vec<WordPlacement<'a>>,
    added: Vec<(WordPlacement<'a>, usize)>,
}

#[derive(Debug, Clone, PartialEq)]
struct WordPlacement<'a> {
    cells: Vec<CellLocation>,
    possible_words: Vec<&'a String>,
    direction: Dir,
}

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct CellLocation {
    row: usize,
    col: usize,
}

#[derive(Clone, Debug)]
pub struct Cell {
    blocked: bool,
    chars: HashSet<char>,
}

#[derive(Debug, Clone, PartialEq)]
enum Dir {
    V,
    H,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrosswordSolution {
    board: Vec<Vec<char>>,
    clue_numbers: Vec<Vec<i32>>,
    vertical_words: Vec<WordClue>,
    horizontal_words: Vec<WordClue>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WordClue {
    pub word: String,
    pub word_number: i32,                    // clue number
    pub spelling: Vec<(char, usize, usize)>, // char, row, column
    pub part_of_speech: String,
    pub definition: String,
}

/// validate and create a solved crossword for the given parameters, will trie the numer of times given where every try has the alloted time
pub fn validate_and_solve_timed_tries(
    blocked_board: &mut Vec<Vec<bool>>,
    min_word_length: u32,
    min_connection_length: u32,
    dict: &Dictionary,
    time_sec: u64,
    tries: usize,
) -> Result<CrosswordSolution, Error> {
    //log(&"blocked board".to_string());
    //log(&blocked_board);
    let mut cells = HashMap::new();
    let mut solver = init_crossword::init_solver(
        blocked_board,
        min_word_length,
        min_connection_length,
        &mut cells,
    )?;
    for i in 0..tries {
        let mut solver_clone = solver.clone();
        let solved_err = match solver_clone.solve_timed(dict, time_sec) {
            Ok(_) => {
                solver = solver_clone;
                break;
            }
            Err(e) => e,
        };
        if solved_err != Error::TimeOut || i == tries - 1 {
            return Err(solved_err);
        }
    }

    let solution = CrosswordSolution::from_solver(&mut solver, blocked_board)?;
    Ok(solution)
}

#[allow(dead_code)]
fn log<T: std::fmt::Debug>(val: &T) {
    let msg = format!("{:?}", val);
    use wasm_bindgen::JsValue;
    web_sys::console::log_1(&JsValue::from(msg));
}

impl CrosswordSolution {
    pub fn to_json(&self) -> String {
        match serde_json::to_string_pretty(&self) {
            Ok(solution) => solution,
            Err(_) => Error::FailedToConvertToJson.to_json(),
        }
    }

    fn block_unused(solver: &mut Solver, blocked: &mut Vec<Vec<bool>>) {
        for (r, row) in blocked.iter_mut().enumerate() {
            'cell_search: for (c, is_blocked) in row.iter_mut().enumerate() {
                if *is_blocked {
                    continue 'cell_search;
                }
                let mut found = false;
                for (plcmt, _) in &solver.added {
                    for loc in &plcmt.cells {
                        if loc.row == r && loc.col == c {
                            continue 'cell_search;
                        }
                    }
                    found = true;
                }
                if found {
                    if let Some(cell) = solver.cells.get_mut(&CellLocation::rc(r, c)) {
                        cell.blocked = true;
                    }
                    *is_blocked = true;
                }
            }
        }
    }

    /// tries to create a valid solution from a solver
    fn from_solver(
        solver: &mut Solver,
        blocked: &mut Vec<Vec<bool>>,
    ) -> Result<CrosswordSolution, Error> {
        CrosswordSolution::block_unused(solver, blocked);
        let size = blocked.len();
        // fill the chars vectors with the correct letters
        let mut chars = vec![vec!['!'; size]; size];
        for (location, cell) in &solver.cells {
            if cell.chars.len() > 1 && !cell.blocked {
                return Err(Error::SolutionErrHashTooBig);
            }
            if cell.blocked {
                chars[location.row][location.col] = '#';
                continue;
            } else {
                chars[location.row][location.col] = cell.chars.clone().drain().next().unwrap();
            }
        }

        // find all the clue numbers for the crossword positions
        let mut clue_numbers = vec![vec![0; size]; size];
        let mut clue_num = 1;
        for (r, column) in blocked.iter().enumerate() {
            for (c, _) in column.iter().enumerate() {
                let mut found_start = false;
                let location = CellLocation::rc(r, c);
                for (placement, _) in &solver.added {
                    if placement.cells[0] == location {
                        found_start = true;
                    }
                }
                if found_start {
                    clue_numbers[r][c] = clue_num;
                    clue_num += 1;
                }
            }
        }

        // go throgh every word placement and create a word clue for it then add it to the approprate vector
        let mut v_words = Vec::new();
        let mut h_words = Vec::new();
        for (w, _) in &solver.added {
            // find the spelling to look up in the dictionary and the spelling with locations for the solution
            let word_indexes = &w.cells;
            let mut spelling = String::new();
            let mut clue_spelling = Vec::new();
            for i in word_indexes {
                let char = chars[i.row][i.col];
                spelling.push(char);
                let row = i.row;
                let col = i.col;
                clue_spelling.push((char, row, col));
            }

            // part of speech for the clue
            let part_of_speech = "Part of speech not fetched.".to_string();
            // definition for the clue
            let definition = "Definition not fetched.".to_string();

            // count the clue numbers untill we get to the start of the word placement
            let first_placement = w.cells.iter().next().unwrap();
            let clue_num = clue_numbers[first_placement.row][first_placement.col];

            let clue = WordClue {
                word: spelling,
                word_number: clue_num,
                part_of_speech: part_of_speech,
                definition: definition,
                spelling: clue_spelling,
            };

            match w.direction {
                Dir::H => h_words.push(clue),
                Dir::V => v_words.push(clue),
            }
        }

        v_words.sort_by(|a, b| a.word_number.cmp(&b.word_number));
        h_words.sort_by(|a, b| a.word_number.cmp(&b.word_number));

        let solution = CrosswordSolution {
            board: chars,
            clue_numbers,
            vertical_words: v_words,
            horizontal_words: h_words,
        };

        Ok(solution)
    }
}

impl<'a> Solver<'a> {
    fn solve_timed(
        &mut self,
        dict: &'a Dictionary,
        allowed_time_seconds: u64,
    ) -> Result<(), Error> {
        let start_time = js_sys::Date::new_0();
        // empty update
        self.empty_update(dict)?;
        let mut prv_solvers: Vec<Solver> = Vec::new();
        'solve: loop {
            let current_time = js_sys::Date::new_0();
            // check to add length
            if self.to_add.len() == 0 {
                return Ok(());
            }
            // check time
            if Solver::elapsed_time_sec(&start_time, &current_time) > allowed_time_seconds {
                return Err(Error::TimeOut);
            }
            // sort to add by number of words
            self.sort_to_add();
            // shuffle words
            self.shuffle_to_add_placement();
            // try to add word
            let mut add_error = match self.add_word(0, dict) {
                Ok(old_solver) => {
                    prv_solvers.push(old_solver);
                    continue 'solve;
                }
                Err(e) => e,
            };
            while add_error == Error::CouldNotAddWord {
                // get the previous state
                let prv_state = match prv_solvers.pop() {
                    Some(solver) => solver,
                    None => return Err(Error::NoSolutionsPossible),
                };

                // set the solver back and return the index for the added word
                let index = match self.step_back(prv_state) {
                    Ok(i) => i,
                    Err(e) => return Err(e),
                };

                // try to add the next word
                match self.add_word(index + 1, dict) {
                    Ok(old_solver) => {
                        prv_solvers.push(old_solver);
                        continue 'solve;
                    }
                    Err(e) => add_error = e,
                }
            }
            return Err(add_error);
        }
    }

    /// resets the solver to the state given, returns the index of the last added word
    fn step_back(&mut self, prv_solver: Solver<'a>) -> Result<usize, Error> {
        let (p, word_index) = match self.added.pop() {
            Some(s) => s,
            None => return Err(Error::NoSolutionsPossible),
        };
        *self = prv_solver;
        self.to_add.push(p);
        Ok(word_index)
    }

    /// try to add the last word placement in the to_add vector to the added vector
    /// if sucsessful then returns the solver state before adding word missing the placement
    fn add_word(
        &mut self,
        possible_word_index: usize,
        dict: &'a Dictionary,
    ) -> Result<Solver<'a>, Error> {
        let placement = self.to_add.pop().unwrap();
        let old_state = self.clone();

        for (i, word) in placement.possible_words.iter().enumerate() {
            if i < possible_word_index {
                continue;
            }
            if self.already_added(word) {
                continue;
            }

            let new_char_hashes = Solver::single_char_hash(word);
            for (i, hash) in new_char_hashes.into_iter().enumerate() {
                if let Some(cell) = self.cells.get_mut(&placement.cells[i]) {
                    cell.chars = hash;
                    self.move_to_update(&placement.cells[i]);
                }
            }

            if let Ok(_) = self.empty_update(dict) {
                self.added.push((placement, i));
                return Ok(old_state);
            } else {
                *self = old_state.clone();
                continue;
            }
        }
        *self = old_state;
        self.to_add.push(placement);
        Err(Error::CouldNotAddWord)
    }

    /// check if a word is already added
    fn already_added(&self, word: &String) -> bool {
        for (placement, word_index) in &self.added {
            let search_word = placement.possible_words[*word_index];
            if word == search_word {
                return true;
            }
        }
        false
    }

    /// shuffle the possible words in the last to_add word placement
    fn shuffle_to_add_placement(&mut self) {
        let i = self.to_add.len() - 1;
        let shuffle = &mut self.to_add[i].possible_words;
        js_shuffle(shuffle);
    }

    /// least amount of words at the end of to add vec
    fn sort_to_add(&mut self) {
        // shufffle from most words to least
        self.to_add
            .sort_unstable_by(|a, b| b.possible_words.len().cmp(&a.possible_words.len()));
    }

    fn elapsed_time_sec(start: &js_sys::Date, end: &js_sys::Date) -> u64 {
        let start_seconds =
            (start.get_hours() * 3600) + (start.get_minutes() * 60) + start.get_seconds();
        let end_seconds = (end.get_hours() * 3600) + (end.get_minutes() * 60) + end.get_seconds();
        if start_seconds > end_seconds {
            return ((end_seconds + 86_400) - start_seconds) as u64;
        } else {
            return (end_seconds - start_seconds) as u64;
        }
    }

    /// empty the update queue by finding all possible words for the placements and then moving appropriate placements from the to_add to update
    fn empty_update(&mut self, dict: &'a Dictionary) -> Result<(), Error> {
        while self.update.len() > 0 {
            let mut placement = self.update.pop_front().unwrap();
            let possible_chars = self.possible_chars(&placement)?;
            if let Some((words, new_hashes)) = dict.look_up_possible(&possible_chars) {
                placement.possible_words = words; // update the possible words
                                                  // update the hashes
                for (i, (hash, change)) in new_hashes.into_iter().enumerate() {
                    if !change {
                        continue; // if no chagnge in hash there is no need to adjust anything
                    }
                    let cell_location = &placement.cells[i];
                    if let Some(cell) = self.cells.get_mut(cell_location) {
                        cell.chars = hash; // update the hash for the corrisponding cell
                    } else {
                        return Err(Error::SomethingWentWrong); // should never reach this
                    }
                    self.move_to_update(cell_location);
                }
                self.to_add.push(placement); // this placement is now updated and is added back to the to_add vector
            } else {
                // if no words are found add the placement back to the update vector and then error
                self.update.push_front(placement);
                return Err(Error::NoWordsFound);
            }
        }
        Ok(())
    }

    /// create a vector of hashsets that each only contain one letter representing a string
    fn single_char_hash(word: &String) -> Vec<HashSet<char>> {
        let mut hash = Vec::with_capacity(word.len());
        for char in word.chars() {
            let mut new = HashSet::new();
            new.insert(char);
            hash.push(new);
        }
        hash
    }

    /// gets a vector of the possible chars for the given word placement
    fn possible_chars(&self, placement: &WordPlacement) -> Result<Vec<&HashSet<char>>, Error> {
        let mut possible = Vec::with_capacity(placement.cells.len());
        for location in &placement.cells {
            match self.cells.get(location) {
                Some(cell) => possible.push(&cell.chars),
                None => return Err(Error::SomethingWentWrong), // should never get a None value here
            }
        }
        Ok(possible)
    }

    /// finds all the words that are attached to the cell location in the to_add vector and move them to the update vec
    fn move_to_update(&mut self, cell_location: &CellLocation) {
        let mut i = 0;
        while i < self.to_add.len() {
            if self.to_add[i].cells.contains(cell_location) {
                self.update.push_back(self.to_add.swap_remove(i));
                return; // can return early here because there can only be two words attached to a cell, the other is the word being worked on
            }
            i += 1;
        }
    }
}

impl CellLocation {
    /// gives back a cell location for given row and column
    fn rc(row: usize, col: usize) -> CellLocation {
        CellLocation { row, col }
    }
}

/// very basic shuffle using the js_sys math random function
fn js_shuffle<T>(shuffle: &mut Vec<T>) {
    let mut i = 0;
    while i < shuffle.len() {
        let swap_i = (js_sys::Math::random() * shuffle.len() as f64) as usize;
        shuffle.swap(i, swap_i);
        i += 1;
    }
}

mod init_crossword {
    use std::collections::{HashMap, HashSet, VecDeque};

    use super::{Cell, CellLocation, Dir, Error, Solver, WordPlacement};

    /// Take a blocked board, min word len, min conn len, and a mutable ref to an empty Vec<Cell>.
    /// Validates board and returns a Solver type or an Error
    pub fn init_solver<'a>(
        blocked_board: &mut Vec<Vec<bool>>,
        min_word_length: u32,
        min_connection_length: u32,
        cells: &'a mut HashMap<CellLocation, Cell>,
    ) -> Result<Solver<'a>, Error> {
        // validate board size and shape
        validate_board_size(&blocked_board, min_word_length)?;
        // create the hashmap containing all the cells
        *cells = find_cells(&blocked_board);
        // create the update queue finding all the valid wordplacements, propagate error if invalid placement is found
        let update = find_words(cells, min_word_length, min_connection_length)?;
        // make the solver
        let solver = Solver {
            cells: cells.clone(),
            update,
            to_add: Vec::new(),
            added: Vec::new(),
        };

        Ok(solver)
    }

    fn find_words(
        cells: &HashMap<CellLocation, Cell>,
        min_word_length: u32,
        min_connection_length: u32,
    ) -> Result<VecDeque<WordPlacement>, Error> {
        // find the starts of the words
        let mut word_starts = Vec::new();
        for (location, cell) in cells {
            if cell.blocked {
                continue; // can not be start of word is cell is blocked
            }
            // identify if the cell is the start of a word
            for dir in [Dir::H, Dir::V] {
                // a word start is at the edge of the board or if the preceding cell is blocked
                let mut start = false;
                if dir == Dir::H && location.col == 0 {
                    start = true;
                }
                if dir == Dir::V && location.row == 0 {
                    start = true;
                }
                if dir == Dir::H && location.col > 0 {
                    let neighbor_location = CellLocation::rc(location.row, location.col - 1);
                    if let Some(up_neighbor) = cells.get(&neighbor_location) {
                        if up_neighbor.blocked {
                            start = true;
                        }
                    }
                }
                if dir == Dir::V && location.row > 0 {
                    let neighbor_location = CellLocation::rc(location.row - 1, location.col);
                    if let Some(up_neighbor) = cells.get(&neighbor_location) {
                        if up_neighbor.blocked {
                            start = true;
                        }
                    }
                }
                if start {
                    word_starts.push((location, dir.clone()));
                }
            }
        }

        // fill out the full words and check the lengths
        let mut full_words = VecDeque::new();
        for (start_loc, dir) in word_starts {
            let mut word_cells = vec![start_loc.clone()];
            let mut current_location = start_loc.clone();
            'char_loop: loop {
                let next_location = if dir == Dir::H {
                    CellLocation::rc(current_location.row, current_location.col + 1)
                } else {
                    CellLocation::rc(current_location.row + 1, current_location.col)
                };
                if let Some(found) = cells.get(&next_location) {
                    if found.blocked {
                        break 'char_loop; // if next is blocked the word has ended
                    } else {
                        word_cells.push(next_location.clone());
                        current_location = next_location.clone();
                    }
                } else {
                    break 'char_loop;
                }
            }

            if word_cells.len() < min_connection_length as usize {
                return Err(Error::InvalidWordConnLen);
            }

            if word_cells.len() >= min_word_length as usize {
                let placement = WordPlacement {
                    cells: word_cells,
                    possible_words: Vec::new(),
                    direction: dir,
                };
                full_words.push_back(placement);
            }
        }

        Ok(full_words)
    }

    fn find_cells(board: &Vec<Vec<bool>>) -> HashMap<CellLocation, Cell> {
        let mut cells = HashMap::new();
        for (r, column) in board.iter().enumerate() {
            for (c, blocked) in column.iter().enumerate() {
                let location = super::CellLocation { row: r, col: c };
                let cell = Cell {
                    blocked: *blocked,
                    chars: full_hashset(),
                };
                cells.insert(location, cell);
            }
        }
        cells
    }

    /// checks that the board size is big enough for the minimum word length and that the board is a square shape
    fn validate_board_size(board: &Vec<Vec<bool>>, min_word_length: u32) -> Result<(), Error> {
        let height = board.len();
        if height < min_word_length as usize {
            return Err(Error::InvalidBoardSize);
        }
        for row in board {
            if row.len() != height {
                return Err(Error::InvalidBoardShape);
            }
        }
        Ok(())
    }

    fn full_hashset() -> HashSet<char> {
        let letters = vec![
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
            'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        ];
        HashSet::from_iter(letters.iter().cloned())
    }
}
