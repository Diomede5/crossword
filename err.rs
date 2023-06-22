#[derive(Debug, PartialEq, Clone)]
#[allow(unused)]
pub enum Error {
    NoWordsFound,
    InvalidBoardShape,
    InvalidBoardSize,
    InvalidWordConnLen,
    CouldNotAddWord,
    NoSolutionsPossible,
    SolutionErrHashTooBig,
    NoPrvState,
    SomethingWentWrong,
    TimeOut,
    CouldNotLookUpWord,
    FailedToConvertToJson,
    FailedToConvertFromJson,
}

impl Error {
    pub fn details(&self) -> &str {
        match *self {
            Error::InvalidBoardShape => "invalid board shape found: board shape is not square",
            Error::InvalidBoardSize => "invalid board size found: minimum word lenght is larger than size of board",
            Error::InvalidWordConnLen => "invalid connection length: potential word was found with a length shorter than allow length",
            Error::NoWordsFound => "no words found: no possible words found for given word placement",
            Error::CouldNotAddWord => "could not add word: could not add any of the possible words for a word placement",
            Error::NoSolutionsPossible => "no sulutions possible: can not generate a valid solved crossword",
            Error::SomethingWentWrong => "something whent wrong: unkown error",
            Error::NoPrvState => "no prevous state: no prevous states to step back for",
            Error::SolutionErrHashTooBig => "can't make solution: cell vector contained a hash with more than 1 char in it",
            Error::TimeOut => "timeout: could not find a solution in the allowed time",
            Error::CouldNotLookUpWord => "Could not look up word: the solution generated had a spelling in it that was not in the dictionary",
            Error::FailedToConvertToJson => "failed to convert to json: could not convert solution or error struct to json",
            Error::FailedToConvertFromJson => "failed to convert from json: json version of the blocked board could not be converted",
        }
    }

    pub fn to_json(&self) -> String {
        let json = format!("{{ \"err\": \"{}\" }}", self.details());
        json
    }
}

impl std::error::Error for Error {
    fn description(&self) -> &str {
        self.details()
    }
}

use core::fmt;
impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.details())
    }
}
