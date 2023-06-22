// imprt the wasm binds for generating the solved crossword
import init, {
  new_dict_json,
  add_words_text_list,
  solve_nyt,
  solve_free,
} from "./crossword_wasm.js";
await init();

// make and fill the dictionary, stored in json format passed into the wasm
let dictionary = new_dict_json();
fetch_all_words(dictionary);

async function fetch_all_words() {
  let res = await fetch("all_words_list.txt");
  let text = await res.text();
  dictionary = add_words_text_list(dictionary, text);
}

///
///
/// STYLE SETTINGS
///
///

const styleColorDark = "#38A5c7";
const styleColorLight = "#9AC5CE";
const styleColorBright = "#B46FD1";

const styleAppPaddingPX = 10;

const styleHeaderHeightPX = 85;

// NEW NEW NEW
const setAppPaddingPx = 10;

const setHeaderHeightPx = 85;

const setMakeSelectorHSizePx = 200;
const setMakeSelectorVSizePx = 120;
const setMakeValidCellColor = "grey";

const setTitleSmallSizePx = 15;
const setTitleMedSizePx = 25;
const setTitleLargeSizePx = 50;

const setBorderMedWidthPx = 2;
const setBorderMedRadiusPx = 5;

const setWordleCorrect = "#069C5E";
const setWordleLocation = "#E8AE2C";
const setWordleWrong = "grey";

const setAboutSelectionWidth = 200;

///
///
/// CSS STYLES
///
///

const styleTitleSmall = {
  "text-align": "center",
  "line-height": `${setTitleSmallSizePx}px`,
  height: `${setTitleSmallSizePx}px`,
  "font-size": `${setTitleSmallSizePx * 0.9}px`,
  "font-weight": "bold",
};

const styleTitleMed = {
  "text-align": "center",
  "line-height": `${setTitleMedSizePx}px`,
  height: `${setTitleMedSizePx}px`,
  "font-size": `${setTitleMedSizePx * 0.9}px`,
  "font-weight": "bold",
};

const styleTitleLarge = {
  "text-align": "center",
  "line-height": `${setTitleLargeSizePx}px`,
  height: `${setTitleLargeSizePx}px`,
  "font-size": `${setTitleLargeSizePx * 0.9}px`,
  "font-weight": "bold",
};

/// a medium sized button stying
const styleButtonSmall = {
  all: "unset",
  padding: "3px",
  "font-size": "12px",
  "font-weight": "bold",
  "border-style": "solid",
  "border-width": `${setBorderMedWidthPx}px`,
  "border-radius": `${setBorderMedRadiusPx}px`,
  margin: "5px 7px",
};

/// a medium sized button stying
const styleButtonMedium = {
  all: "unset",
  padding: "7px",
  "font-size": "14px",
  "font-weight": "bold",
  "border-style": "solid",
  "border-width": `${setBorderMedWidthPx}px`,
  "border-radius": `${setBorderMedRadiusPx}px`,
  margin: "5px 7px",
};

/// gives back the styling for a square div
function styleBoxSquare(sizePx) {
  return {
    height: `${sizePx}px`,
    width: `${sizePx}px`,
  };
}

function styleBoxRec(height, width) {
  return {
    height: `${height}px`,
    width: `${width}px`,
  };
}

/// bordered box with centered text and white background
function styleBorderedBox() {
  return {
    width: `100% - ${setBorderMedWidthPx}px`,
    "background-color": "white",
    "text-align": "center",
    "border-style": "solid",
    "border-width": `${setBorderMedWidthPx}px`,
    "border-radius": `${setBorderMedRadiusPx}px`,
  };
}

/// styling for an individual cell of the game board
function styleCellBox(boxSizePx, boxCellNum, backgroundColor) {
  const cellMarginPercent = 0.03;
  const cellBoarderPx = 1;

  let cellArea = boxSizePx / boxCellNum;
  let margin = cellArea * cellMarginPercent * 0.5;
  let size = cellArea - 2 * margin - 2 * cellBoarderPx;

  return {
    display: "inline-block",
    margin: `${margin}px`,
    height: `${size}px`,
    width: `${size}px`,
    "border-style": "solid",
    "border-width": `${cellBoarderPx}px`,
    "border-radius": "5px",
    "background-color": backgroundColor,
    "font-size": `${size * 0.5}px`,
    "line-height": `${size}px`,
    "text-align": "center",
  };
}

function styleCellRow(boxSizePx, boxCellNum) {
  let height = boxSizePx / boxCellNum;
  return {
    "font-size": "0px",
    height: `${height}px`,
  };
}

function styleCellBoard(boxSizePx) {
  return {
    width: `${boxSizePx}px`,
    height: `${boxSizePx}px`,
    "font-size": "0px",
  };
}

function styleCellClueNum(boxSizePx, boxCellNum) {
  const cellMarginPercent = 0.03;
  const cellBoarderPx = 1;

  let cellArea = boxSizePx / boxCellNum;
  let margin = cellArea * cellMarginPercent * 0.5;
  let size = cellArea - 2 * margin - 2 * cellBoarderPx;
  let clueSize = size / 5;
  let fontSize = clueSize / 1.25;

  return {
    left: "-2px",
    "margin-top": "5px",
    height: `${clueSize}px`,
    width: `${clueSize}px`,
    "font-size": `${fontSize}px`,
    "line-height": `${fontSize}px`,
  };
}

function stylePAGE(height, width, isH, padding) {
  let base = {
    height: `${height}px`,
    width: `${width}px`,
    padding: padding,
  };
  if (isH) {
    return {
      ...base,
      display: "inline-flex",
    };
  } else {
    return {
      ...base,
      display: "block",
    };
  }
}

///
///
/// INITIAL SETTINGS
///
///

// sets all cells to not blocked
function makeInitBlockedCells(size) {
  let cells = [];
  for (let row = 0; row < size; row++) {
    let cellRow = [];
    for (let col = 0; col < size; col++) {
      cellRow.push(false);
    }
    cells.push(cellRow);
  }
  return cells;
}

const makeSettingMaxSize = 15;
const makeSettingMinSize = 3;
const makeSettingStartingSize = 11;

let starting_blocked;
if (makeSettingStartingSize == 11) {
  starting_blocked = starting_board_size11();
} else {
  starting_blocked = makeInitBlockedCells(makeSettingStartingSize);
}

// the starting state for the make page
const makeInitState = {
  boardSize: makeSettingStartingSize,
  ruleset: "nyt",
  playstyle: "standard",
  highlightButton: null,
  highlightCell: [null, null],
  making: false,
  message: null,
  render: true,
  blockedCells: starting_blocked,
};

const playInitState = {
  render: false,
  playstyle: null,
  solved_board: null,
  guessed_board: null,
  clue_numbers: null,
  h_clues: null,
  v_clues: null,
  select_h: true,
  current_word: null,
  button_hover: null,
  cell_hover: null,
  wordleGuess: [],
  wordleHguesses: [],
  wordleVguesses: [],
};

const aboutInitState = {
  render: false,
  prvPage: "make",
  selected: "About",
};

//let htmlTest = <h1>Error</h1>;
let aboutMakeHtml = <h1>Error</h1>;
getAboutMakeHtml();
let aboutPlayHtml = <h1>Error</h1>;
getAboutPlayHtml();
let aboutAboutHtml = <h1>Error</h1>;
getAboutAboutHtml();
let aboutCrossHtml = <h1>Error</h1>;
getAboutCrossHtml();
let aboutDictHtml = <h1>Error</h1>;
getAboutDictHtml();

async function getHtmlA(url) {
  let res = await fetch(url);
  let text = await res.text();
  return text;
}

// function getHtml(url) {

//   getHtmlA(url).then((text) => {
//     let html = {__html: text};
//     htmlTest = <div dangerouslySetInnerHTML={html} />;
//   });
// }

function getAboutMakeHtml() {
  let url = "./about/makeHTML.html";
  getHtmlA(url).then((text) => {
    let html = { __html: text };
    aboutMakeHtml = <div dangerouslySetInnerHTML={html} />;
  });
}
function getAboutPlayHtml() {
  let url = "./about/playHTML.html";
  getHtmlA(url).then((text) => {
    let html = { __html: text };
    aboutPlayHtml = <div dangerouslySetInnerHTML={html} />;
  });
}
function getAboutAboutHtml() {
  let url = "./about/aboutHTML.html";
  getHtmlA(url).then((text) => {
    let html = { __html: text };
    aboutAboutHtml = <div dangerouslySetInnerHTML={html} />;
  });
}
function getAboutCrossHtml() {
  let url = "./about/crossHTML.html";
  getHtmlA(url).then((text) => {
    let html = { __html: text };
    aboutCrossHtml = <div dangerouslySetInnerHTML={html} />;
  });
}
function getAboutDictHtml() {
  let url = "./about/dictionaryHTML.html";
  getHtmlA(url).then((text) => {
    let html = { __html: text };
    aboutDictHtml = <div dangerouslySetInnerHTML={html} />;
  });
}

///
///
/// APP START
///
///

function App() {
  //
  // app states
  //

  // appState stores all state information that is universal for all pages
  const [appState, setAppState] = React.useState({
    window_width: window.innerWidth,
    window_height: window.innerHeight,
  });

  // non style make changes for the make page
  const [makeState, setMakeState] = React.useState(makeInitState);

  const [playState, setPlayState] = React.useState(playInitState);

  const [aboutState, setAboutState] = React.useState(aboutInitState);

  //
  // App components
  //

  function Header() {
    const [headerStyle, setHeaderStyle] = React.useState({
      header: headerStyleInitHeader(),
      lButton: headerStyleInitLButton(),
      rButton: headerStyleInitRButton(),
    });

    //
    // header helpers
    //

    function headerHelpGohome() {
      window.location.href = "/";
    }

    //
    // header style
    //

    // style constants
    const headerStyleButtonRadius = "5px";

    function headerStyleInitHeader() {
      return {
        width: "100vw",
        height: `${styleHeaderHeightPX}px`,
      };
    }

    function headerStyleInitButton() {
      let size = styleHeaderHeightPX - styleAppPaddingPX;
      let sizeStr = `${size}px`;
      return {
        position: "absolute",
        height: sizeStr,
        width: sizeStr,
        "text-align": "center",
        "line-height": sizeStr,
        "background-color": styleColorBright,
        "border-radius": headerStyleButtonRadius,
        "margin-top": `${styleAppPaddingPX}px`,
      };
    }

    function headerStyleInitLButton() {
      let button = headerStyleInitButton();
      return {
        ...button,
        "margin-left": `${styleAppPaddingPX}px`,
      };
    }

    function headerStyleInitRButton() {
      let button = headerStyleInitButton();
      return {
        ...button,
        right: "0",
        "margin-right": `${styleAppPaddingPX}px`,
      };
    }

    return (
      <div id="appHeader" style={headerStyle.header}>
        <div
          id="left_button"
          style={headerStyle.lButton}
          onClick={headerHelpGohome}
        >
          home
        </div>
        <div id="right_button" onClick={aboutGoTo} style={headerStyle.rButton}>
          About
        </div>
      </div>
    );
  }

  function Make() {
    // return null if the make page should not render
    if (!makeState.render) {
      return null;
    }

    //
    // make components
    //

    function MakeCompTitle() {
      return (
        <div id="makeTitle" style={styleTitleLarge}>
          Make Your Crossword
        </div>
      );
    }

    /// this is the section where the user can change the game options
    function MakeCompSelectors() {
      //
      // components
      //

      /// area to change the size of the board
      function SelectorCompSize() {
        /// css for the button and size indicator
        let styleButtonConainer = {
          display: "flex",
        };

        /// css for the + and - buttons
        function styleButton(name) {
          let background = "white";
          if (makeState.highlightButton == name) {
            background = styleColorBright;
          }
          let styleButton = {
            ...styleButtonMedium,
            "background-color": background,
            margin: "auto",
            "margin-top": "0",
            height: "18px",
            width: "18px",
          };

          return styleButton;
        }

        /// css for the size indicator
        let styleNumber = {
          ...styleTitleSmall,
          "margin-top": "4px",
          "margin-left": "10px",
          "margin-right": "10px",
          //display: "inline",
          "font-size": "16px",
          "line-height": `${24 + 2 * 2}px`,
        };

        return (
          <div style={styleSelectorBox()}>
            <p style={styleTitleMed}>Board Size</p>
            <div style={styleButtonConainer}>
              <button
                onClick={selectorStateBoardMinus}
                onMouseEnter={selectorHighlightButton}
                onMouseOut={selectorUnhighlightButton}
                style={styleButton("-")}
                data-name="-"
              >
                -
              </button>
              <div style={styleNumber}>{makeState.boardSize}</div>
              <button
                onClick={selectorStateBoardPlus}
                onMouseEnter={selectorHighlightButton}
                onMouseOut={selectorUnhighlightButton}
                style={styleButton("+")}
                data-name="+"
              >
                +
              </button>
            </div>
          </div>
        );
      }

      /// ruleset selection box
      function SelectorCompRuleset() {
        return (
          <div style={styleSelectorBox()}>
            <p style={styleTitleMed}>Ruleset</p>
            <p
              onClick={selectorStateChageOption}
              onMouseOut={selectorUnhighlightButton}
              onMouseEnter={selectorHighlightButton}
              style={styleSelectButtonMed("nyt")}
              data-option="nyt"
              data-name="nyt"
            >
              NYT
            </p>
            <p
              onClick={selectorStateChageOption}
              onMouseOut={selectorUnhighlightButton}
              onMouseEnter={selectorHighlightButton}
              style={styleSelectButtonMed("free")}
              data-option="free"
              data-name="free"
            >
              Free
            </p>
          </div>
        );
      }

      /// playstyle selection box
      function SelectorCompPlaystyle() {
        return (
          <div style={styleSelectorBox()}>
            <p style={styleTitleMed}>Playstyle</p>
            <p
              onClick={selectorStateChageOption}
              onMouseOut={selectorUnhighlightButton}
              onMouseEnter={selectorHighlightButton}
              style={styleSelectButtonMed("standard")}
              data-option="standard"
              data-name="standard"
            >
              Standard
            </p>
            <p
              onClick={selectorStateChageOption}
              onMouseOut={selectorUnhighlightButton}
              onMouseEnter={selectorHighlightButton}
              style={styleSelectButtonMed("wordle")}
              data-option="wordle"
              data-name="wordle"
            >
              Wordle
            </p>
          </div>
        );
      }

      /// make board button
      function SelectorCompMake() {
        // css styling for the make button
        function styleButton() {
          // set background if highlighted
          let background = "white";
          if (makeState.highlightButton == "make") {
            background = styleColorBright;
          }

          // change styling for the different layouts
          let height;
          let width;
          if (isHorizontal()) {
            width = setMakeSelectorHSizePx - 20 - 2 * setBorderMedWidthPx;
            height = 75;
          } else {
            width = "";
            height = setMakeSelectorVSizePx - 20 - 2 * setBorderMedWidthPx;
          }

          return {
            ...styleButtonMedium,
            "background-color": background,
            margin: "0px 10px 10px 0px",
            "text-align": "center",
            "font-size": setTitleMedSizePx * 0.9,
            height: `${height}px`,
            width: `${width}px`,
          };
        }

        // if waiting for a filled out board then don't allow for another board request
        if (makeState.making) {
          return (
            <button
              onMouseOut={selectorUnhighlightButton}
              onMouseEnter={selectorHighlightButton}
              style={styleButton()}
              data-option="make"
              data-name="name"
            >
              Making Crossword!
            </button>
          );
        } else {
          return (
            <button
              onClick={make_solved_board}
              onMouseOut={selectorUnhighlightButton}
              onMouseEnter={selectorHighlightButton}
              style={styleButton()}
              data-option="make"
              data-name="make"
            >
              Make Crossword!
            </button>
          );
        }
      }

      //
      // selectors state change
      //

      /// sets the appropriate setting for the button presses and resets the board if there is a rule change
      function selectorStateChageOption(event) {
        let button = event.target;
        let option = button.dataset.option;

        if (option === "nyt" || option === "free") {
          setMakeState({
            ...makeState,
            blockedCells: newBlockedCells(makeState.boardSize),
            ruleset: option,
          });
        } else if (option === "standard" || option === "wordle") {
          setMakeState({
            ...makeState,
            playstyle: option,
          });
        }
      }

      /// subtract one from the board size if valid
      function selectorStateBoardMinus() {
        let current = makeState.boardSize;
        let newSize = current - 1;
        if (newSize < makeSettingMinSize) {
          newSize = makeSettingMinSize;
        }

        setMakeState({
          ...makeState,
          boardSize: newSize,
          blockedCells: newBlockedCells(newSize),
        });
      }

      /// add one to the board size if valid
      function selectorStateBoardPlus() {
        let current = makeState.boardSize;
        let newSize = current + 1;
        if (newSize > makeSettingMaxSize) {
          newSize = makeSettingMaxSize;
        }

        setMakeState({
          ...makeState,
          boardSize: newSize,
          blockedCells: newBlockedCells(newSize),
        });
      }

      //
      // Selectors helpers
      //

      /// returns a double arrayof size containing all false
      function newBlockedCells(size) {
        let cells = [];
        for (let row = 0; row < size; row++) {
          let cellRow = [];
          for (let col = 0; col < size; col++) {
            cellRow.push(false);
          }
          cells.push(cellRow);
        }
        return cells;
      }

      //
      // Selectors css styling
      //

      /// css styling for the standard button to use, checks if highlighted
      function styleSelectButtonMed(name) {
        let style = styleButtonMedium;
        if (
          name == makeState.highlightButton ||
          name == makeState.ruleset ||
          name == makeState.playstyle
        ) {
          style = {
            ...style,
            "background-color": styleColorBright,
          };
        }
        return style;
      }

      /// css styling for the box containing the different options
      function styleSelectorBox() {
        let height;
        let width;
        let margin;
        if (isHorizontal()) {
          margin = "0px 10px 10px 0px";
          height = "120px";
          width = setMakeSelectorHSizePx - 10;
        } else {
          margin = "0px 10px 10px 0px";
          height = setMakeSelectorVSizePx - 10;
          width = "300px";
        }
        return {
          ...styleBorderedBox(),
          height: height,
          width: width,
          margin: margin,
        };
      }

      /// css styling for the makeSelectors div
      function styleSelectors() {
        let isH = isHorizontal();
        let width;
        let height;
        if (isH) {
          width = setMakeSelectorHSizePx;
          height = 0;
        } else {
          width = 0;
          height = setMakeSelectorVSizePx;
        }

        return stylePAGE(height, width, !isH, "0px");
      }

      return (
        <div id="makeSelectors" style={styleSelectors()}>
          <SelectorCompSize />
          <SelectorCompRuleset />
          <SelectorCompPlaystyle />
          <SelectorCompMake />
        </div>
      );
    }

    /// this section displays the current state of the board
    function MakeCompBoard() {
      //
      // board components
      //

      function BoardCellRow(rowNum, size, styles) {
        let row = [];
        for (let n = 0; n < size; n++) {
          row.push(BoardCell(rowNum, n, styles[rowNum][n]));
        }
        return (
          <div style={styleCellRow(boardSizePX, makeState.size)}>{row}</div>
        );
      }

      function BoardCell(row, column, style) {
        return (
          <div
            onClick={boardStateBlocking}
            onMouseEnter={highlightCell}
            onMouseOut={unhighlightCell}
            data-row={row}
            data-column={column}
            style={style}
          />
        );
      }

      //
      // board state change
      //

      /// set the make state so the highlighted cell will be the events target row and column
      function highlightCell(event) {
        let row = event.target.dataset.row;
        let col = event.target.dataset.column;
        setMakeState({
          ...makeState,
          highlightCell: [row, col],
        });
      }

      /// set make state hilighted cell to [null, null]
      function unhighlightCell() {
        setMakeState({
          ...makeState,
          highlightCell: [null, null],
        });
      }

      /// validates and blocks out a cell or pair of cells when a cell is clicked
      function boardStateBlocking(event) {
        let cell = event.target;
        let row = cell.dataset.row;
        let column = cell.dataset.column;
        let board = makeState.blockedCells;

        // for the free ruleset no validation needed
        if (makeState.ruleset === "free") {
          // if blocked then unblock
          if (board[row][column]) {
            board[row][column] = false;
          }
          // if unblocked then block
          else {
            board[row][column] = true;
          }
        }
        // for the nyt ruleset
        else if (makeState.ruleset === "nyt") {
          // if blocked then remove block and generate the new valid board
          if (board[row][column]) {
            board[row][column] = false;
            let [mRow, mCol] = nytMirror(row, column);
            board[mRow][mCol] = false;

            nytValidateBoard(board, true);
          }
          // if not blocked then validate move and modify the blocking
          else {
            let valid = nytValidMove(row, column);
            if (!valid) {
              return;
            }

            board[row][column] = true;
            let [mRow, mCol] = nytMirror(row, column);
            board[mRow][mCol] = true;
          }
        }

        // update the state
        setMakeState({
          ...makeState,
          blockedCells: board,
        });
      }

      //
      // board helpers
      //

      // gernerate the row and cell elements
      let size = makeState.boardSize;
      let styles = cellStyles();
      let rows = [];
      for (let n = 0; n < size; n++) {
        rows.push(BoardCellRow(n, size, styles));
      }

      //
      // style
      //

      /// css styling in double array for all the cells
      function cellStyles() {
        let size = makeState.boardSize;
        let boxSize = boardSizePX() - 1;
        let rows = [];
        for (let r = 0; r < size; r++) {
          let row = [];
          for (let c = 0; c < size; c++) {
            let style = styleCellBox(boxSize, size, "white");
            // highlight in grey the valid cells
            if (makeState.ruleset == "nyt" && nytValidMove(r, c)) {
              // the cell that should be highlighted
              let hr = makeState.highlightCell[0];
              let hc = makeState.highlightCell[1];
              // find the sister cells to the row and column
              let sister = nytMirror(r, c);
              let sr = sister[0];
              let sc = sister[1];
              if (r == hr && c == hc) {
                style = {
                  ...style,
                  "background-color": styleColorBright,
                };
              } else if (sr == hr && sc == hc) {
                style = {
                  ...style,
                  "background-color": styleColorBright,
                };
              } else {
                style = {
                  ...style,
                  "background-color": setMakeValidCellColor,
                };
              }
            }

            // block out the cells in black
            if (makeState.blockedCells[r][c]) {
              style = {
                ...style,
                "background-color": "black",
              };
            }
            row.push(style);
          }
          rows.push(row);
        }
        return rows;
      }

      return <div style={styleCellBoard(boardSizePX())}>{rows}</div>;
    }

    /// this section displays a message if there is one, usually an error message if the server could not generate a solved board
    function MakeMessage() {
      if (makeState.message === null) {
        return null;
      }

      /// sets the message state to null, this will make the box not render on next render
      function messageNull() {
        setMakeState({
          ...makeState,
          message: null,
        });
      }

      /// css for the x button
      function styleMessageX() {
        let background = "white";
        if (makeState.highlightButton == "messageX") {
          background = styleColorBright;
        }
        let style = {
          ...styleButtonSmall,
          margin: "5px",
          height: "15px",
          width: "15px",
          "text-align": "center",
          float: "right",
          "background-color": background,
        };
        return style;
      }

      /// css for the message box
      function styleMessage() {
        let height = 300;
        let width = 300;

        let left = (window.innerWidth - width - 2 * setBorderMedWidthPx) / 2;
        let top = (window.innerHeight - height - 2 * setBorderMedWidthPx) / 2;
        let style = {
          ...styleBorderedBox(),
          position: "fixed",
          height: `${height}px`,
          width: `${width}px`,
          left: `${left}px`,
          top: `${top}px`,
          "font-size": "15px",
        };

        return style;
      }

      /// css for the text in the message
      let styleTextBox = {
        width: "100%",
        "margin-top": "40px",
      };

      return (
        <div style={styleMessage()}>
          <button
            style={styleMessageX()}
            onClick={messageNull}
            onMouseOut={selectorUnhighlightButton}
            onMouseEnter={selectorHighlightButton}
            data-name="messageX"
          >
            X
          </button>
          <div style={styleTextBox}>{makeState.message}</div>
        </div>
      );
    }

    //
    // make state change
    //

    /// sets the highlighted button state to the name of the event target
    function selectorHighlightButton(event) {
      let name = event.target.dataset.name;
      setMakeState({
        ...makeState,
        highlightButton: name,
      });
    }

    /// sets the highlighted button state to null
    function selectorUnhighlightButton() {
      setMakeState({
        ...makeState,
        highlightButton: null,
      });
    }

    //
    // make helpers
    //

    /// generate a solved board and update the states
    function make_solved_board() {
      setMakeState({
        ...makeState,
        making: true,
      });

      make_solved_board_async();
    }

    async function make_solved_board_async() {
      // turn blocked board into valid json for wasm
      let blockedCells = makeState.blockedCells;
      let blocked_board = JSON.stringify({
        bb: blockedCells,
      });

      let solved_string;
      if (makeState.ruleset == "nyt") {
        solved_string = solve_nyt(
          dictionary,
          blocked_board,
          5, //makeState.boardSize,
          2
        );
      } else {
        solved_string = solve_free(
          dictionary,
          blocked_board,
          5, //makeState.boardSize,
          2
        );
      }

      // solve_nyc takes a json dictionary, json blocked board, time in seconds per solve try, number of tries
      let solved_json = JSON.parse(solved_string);

      // solved will ether be a solution or an Error
      //   pub struct CrosswordSolution {
      //     board: Vec<Vec<char>>,
      //     clue_numbers: Vec<Vec<i32>>,
      //     vertical_words: Vec<WordClue>,
      //     horizontal_words: Vec<WordClue>,
      //   }

      // Error {
      //   err: String
      // }

      if (solved_json.board !== undefined) {
        // get the definitions for the vertical words
        await Promise.all(
          // await promise all runs the fetch requests in parellel but will block till they are all complete
          solved_json.vertical_words.map(async (wordClue) => {
            let path = `spelling_definitions/${wordClue.word}_definitions.json`;
            let res = await fetch(path);
            let defs = await res.json();
            if (defs.defs !== undefined) {
              // get a "random" definition from the list of defitions from the server
              let index = Math.floor(Math.random() * defs.defs.length);
              let def = defs.defs[index];
              wordClue.definition = def.def;
              wordClue.part_of_speech = def.pos;
            }
          })
        );

        await Promise.all(
          solved_json.horizontal_words.map(async (wordClue) => {
            let path = `spelling_definitions/${wordClue.word}_definitions.json`;
            let res = await fetch(path);
            let defs = await res.json();
            if (defs.defs !== undefined) {
              let index = Math.floor(Math.random() * defs.defs.length);
              let def = defs.defs[index];
              wordClue.definition = def.def;
              wordClue.part_of_speech = def.pos;
            }
          })
        );

        /// set the state
        setMakeState({
          ...makeState,
          making: false,
          render: false,
        });
        setPlayState(initNewPlay(solved_json, makeState.playstyle));
      } else if (solved_json.err !== undefined) {
        setMakeState({
          ...makeState,
          making: false,
          message: solved_json.err,
        });
      } else {
        setMakeState({
          ...makeState,
          making: false,
          message: "something went wrong :(",
        });
      }
    }

    // returns true if a block was placed on the given row and column would be valid given the current state
    function nytValidMove(row, column) {
      // create a copy of the blocked board to modify
      let board = JSON.parse(JSON.stringify(makeState.blockedCells));
      if (board[row] == undefined) {
        return false;
      }

      // add the blocking to the board
      board[row][column] = true;
      let [mRow, mColumn] = nytMirror(row, column);
      board[mRow][mColumn] = true;

      // check if the blocked board is valid
      return nytValidateBoard(board, true);
    }

    // mutates the given board to be valid and return true if there were no changes
    function nytValidateBoard(board, no_change) {
      let size = board.length;
      let found_invalid = false;
      let no_changes = no_change;
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          // if cell is not blocked out go to next cell
          if (!board[row][col]) {
            continue;
          }

          // look in all four directions if the return count is 0 or 3 the cell is valid in that direction
          let directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ];
          for (let i = 0; i < directions.length; i++) {
            let r_dir = directions[i][0];
            let c_dir = directions[i][1];

            let count = look(row, col, r_dir, c_dir, board);
            if (count != 0 && count != 3) {
              board[row][col] = false;
              board[size - 1 - row][size - 1 - col] = false;
              found_invalid = true;
              no_changes = false;
            }
          }

          // look in direction and return the count of cells in that direction that are not blocked or off the map count max 3
          function look(row, col, row_dir, col_dir, board) {
            // set the first cell to check
            let c_row = row + row_dir;
            let c_col = col + col_dir;
            let size = board.length;
            let count = 0;
            while (count < 3) {
              // if the check cell went out of bound break
              if (c_row < 0 || c_col < 0 || c_row === size || c_col == size) {
                break;
              }
              // if the check cell is blocked out
              if (board[c_row][c_col] === true) {
                break;
              }
              // update loop
              count++;
              c_row = c_row + row_dir;
              c_col = c_col + col_dir;
            }
            return count;
          }
        }
      }
      if (found_invalid) {
        nytValidateBoard(board, no_changes);
      }
      return no_changes;
    }

    // find the mirror row and column for the given row and column
    function nytMirror(row, column) {
      let size = makeState.boardSize;
      let mRow = size - row - 1;
      let mCol = size - column - 1;
      return [mRow, mCol];
    }

    //
    // make style
    //

    /// determine the maximum size in px the board could be in a horizontal layout
    function maxHSize() {
      // max width is the window width - 2*padding - selector size
      let maxWidth =
        window.innerWidth - 2 * setAppPaddingPx - setMakeSelectorHSizePx;
      // max height is the window height - header - title - bottom padding
      let maxHeight =
        window.innerHeight -
        setHeaderHeightPx -
        setTitleLargeSizePx -
        setAppPaddingPx;

      // return the most limiting size
      if (maxWidth < maxHeight) {
        return maxWidth;
      } else {
        return maxHeight;
      }
    }

    /// dertermine the maximun size a board could be in vertical layout in px
    function maxVSize() {
      // max width is the window width - 2*padding
      let maxWidth = window.innerWidth - 2 * setAppPaddingPx;
      // max height is the window height - header - title - selection -bottom padding
      let maxHeight =
        window.innerHeight -
        setHeaderHeightPx -
        setTitleLargeSizePx -
        setMakeSelectorVSizePx -
        setAppPaddingPx;

      if (maxWidth < maxHeight) {
        return maxWidth;
      } else {
        return maxHeight;
      }
    }

    /// finds the size of the board in pixels
    function boardSizePX() {
      if (isHorizontal()) {
        return maxHSize();
      } else {
        return maxVSize();
      }
    }

    /// gives back the layout of the make page
    function isHorizontal() {
      let maxHorizontalBoardSize = maxHSize();
      let maxVerticalBoardSize = maxVSize();

      // the layout and board size are whatever layout gives the largest board size
      if (maxHorizontalBoardSize >= maxVerticalBoardSize) {
        return true;
      } else {
        return false;
      }
    }

    //
    // make css
    //

    /// css styling for the whole make page including the title
    function styleContainer() {
      let height = window.innerHeight - setHeaderHeightPx;
      let width = window.innerWidth;

      let style = {
        ...styleBoxRec(height, width),
        "font-size": "0px",
      };

      return style;
    }

    /// css styling for the div containing the game board and the options section
    function styleBoardUx() {
      // the max width will always be the width of the page
      let width = window.innerWidth;
      // the max height will always be the hight of the page - the title - header
      let height = window.innerHeight - setHeaderHeightPx - setTitleLargeSizePx;

      // the padding left will at minimum be the app padding
      let padLeft;
      // the padding top will be a minimum of 0;
      let padUp;

      // get the size of the game board
      let boardSize = boardSizePX();

      // get the layout
      let isH = isHorizontal();
      if (isH) {
        // padd left is half the remainder of the width - the selector size -  the board size
        padLeft = (width - setMakeSelectorHSizePx - boardSize) / 2;
        // padd up is halp the remainder of the height -  the board size
        padUp = (height - boardSize) / 2;
      } else {
        // pad left is half the remainder of the width - the board size
        padLeft = (width - boardSize) / 2;
        // padd up is half the remainder of the width - the selector size -  the board size
        padUp = (height - setMakeSelectorVSizePx - boardSize) / 2;
      }

      let padding = `${padUp}px 0px 0px ${padLeft}px`;
      return stylePAGE(height, width, isH, padding);
    }

    return (
      <div id="make" style={styleContainer()}>
        <MakeCompTitle />
        <div id="makeUxContainer" style={styleBoardUx()}>
          <MakeCompSelectors />
          <MakeCompBoard />
        </div>
        <MakeMessage />
      </div>
    );
  }

  function Play() {
    if (!playState.render) {
      return null;
    }

    //
    // components
    //

    function Ux() {
      //
      // state changes
      //

      /// sets the button hover name in playState to the name of the event target
      function highlight(event) {
        let name = event.target.dataset.name;
        setPlayState({
          ...playState,
          button_hover: name,
        });
      }

      /// sets hover name in playState to null
      function unhighlight() {
        setPlayState({
          ...playState,
          button_hover: null,
        });
        //setBackground(name, 'white');
      }

      //
      // style
      //

      // take a standad button stying and if the state has the given name then make it highlighted
      function buttonStyle(name) {
        let style = styleButtonMedium;
        if (name == playState.button_hover) {
          style = {
            ...style,
            "background-color": styleColorBright,
          };
        }
        return style;
      }

      //
      // elements
      //

      function UxOptions() {
        let optionStyle = styleBorderedBox();
        optionStyle = {
          ...optionStyle,
          "margin-top": "2px",
        };

        return (
          <div style={optionStyle}>
            <button
              onClick={backToMake}
              onMouseOut={unhighlight}
              onMouseEnter={highlight}
              style={buttonStyle("uxBack")}
              data-name="uxBack"
            >
              Make
            </button>
            <button
              onClick={solveAll}
              onMouseOut={unhighlight}
              onMouseEnter={highlight}
              style={buttonStyle("uxSolve")}
              data-name="uxSolve"
            >
              Solve
            </button>
            <button
              onClick={removeIncorrectAll}
              onMouseOut={unhighlight}
              onMouseEnter={highlight}
              style={buttonStyle("uxRemove")}
              data-name="uxRemove"
            >
              Remove Wrong
            </button>
          </div>
        );
      }

      function UxLetters() {
        let [dir, wordI, charI] = playState.current_word;
        let word;
        if (dir === "h") {
          word = playState.h_clues[wordI];
        } else {
          word = playState.v_clues[wordI];
        }

        // get the base cell style
        let cellStyles = styleCellBox(
          getBoxSize() - 8,
          playState.solved_board.length,
          "white"
        );
        // chars holds the divs of the cells representing the current word
        let chars = [];
        for (let i = 0; i < word.spelling.length; i++) {
          let spelling = word.spelling[i];
          let row = spelling[1];
          let col = spelling[2];
          let char = playState.guessed_board[row][col];
          let cellStyle = cellStyles;
          if (charI == i) {
            // if the cell should be highlighted do that
            cellStyle = {
              ...cellStyle,
              "background-color": styleColorBright,
            };
          }
          chars.push(<div style={cellStyle}>{char}</div>);
        }

        // add some margin to the top of the box
        let letterStyle = styleBorderedBox();
        letterStyle = {
          ...letterStyle,
          "margin-top": "10px",
        };

        return <div style={letterStyle}>{chars}</div>;
      }

      function UxClue() {
        let [dir, wordI, charI] = playState.current_word;
        let word;
        if (dir === "h") {
          word = playState.h_clues[wordI];
        } else {
          word = playState.v_clues[wordI];
        }

        let clueStyle = styleBorderedBox();
        clueStyle = {
          ...clueStyle,
          "margin-top": "10px",
        };

        return (
          <div style={clueStyle}>
            <p>Part of Speech: {word.part_of_speech}</p>
            <p>Definition: {word.definition}</p>
            <div>
              <button
                onClick={solveWord}
                onMouseOut={unhighlight}
                onMouseEnter={highlight}
                data-name="uxSolveClue"
                style={buttonStyle("uxSolveClue")}
              >
                Solve Word
              </button>
              <button
                onClick={removeIncorrectWord}
                onMouseOut={unhighlight}
                onMouseEnter={highlight}
                data-name="uxRemoveClue"
                style={buttonStyle("uxRemoveClue")}
              >
                Remove Incorect Chars
              </button>
            </div>
          </div>
        );
      }

      function UxWordleGuess() {
        /// the area where the current guess is shown
        function Guess() {
          let word = getWordCurrent();
          let spelling = word.spelling;
          let cells = [];
          for (let i = 0; i < spelling.length; i++) {
            let cellStyle = styleCellBox(
              getBoxSize() - 8,
              playState.solved_board.length,
              "white"
            );
            if (playState.current_word[2] == i) {
              cellStyle = {
                ...cellStyle,
                "background-color": styleColorBright,
              };
            }

            let char = playState.wordleGuess[i];
            cells.push(<div style={cellStyle}>{char}</div>);
          }

          return <div>{cells}</div>;
        }

        /// the prevous guesses
        function Guesses() {
          let prvGuesses;
          let current = playState.current_word;
          if (current[0] == "h") {
            prvGuesses = playState.wordleHguesses[current[1]];
          } else {
            prvGuesses = playState.wordleVguesses[current[1]];
          }

          let prvGuessesElmt = [];
          for (let i = 0; i < prvGuesses.length; i++) {
            let guess = prvGuesses[i];
            let cells = [];
            for (let c = 0; c < guess.length; c++) {
              let cword = getWordCurrent();
              let loc = getWordCurrent().spelling;
              let color = wordleColor(guess[c], loc[c][1], loc[c][2]);

              let cellStyle = styleCellBox(
                getBoxSize() - 8 - 104,
                playState.guessed_board.length,
                color
              );
              cells.push(<div style={cellStyle}>{guess[c]}</div>);
            }

            let rowStyle = styleCellRow(
              getBoxSize() - 8 - 104,
              playState.solved_board.length
            );
            prvGuessesElmt.push(<div style={rowStyle}>{cells}</div>);
          }
          return prvGuessesElmt;
        }

        let style = {
          ...styleBorderedBox(),
          "margin-top": "10px",
        };

        return (
          <div style={style}>
            <Guess />
            <div style={styleTitleSmall}>Press Enter To Make Guess</div>
            {Guesses()}
          </div>
        );
      }

      let uxStyle = styleBoxSquare(getBoxSize());
      if (playState.playstyle == "standard") {
        return (
          <div style={uxStyle}>
            <UxOptions />
            <UxLetters />
            <UxClue />
          </div>
        );
      } else if (playState.playstyle == "wordle") {
        return (
          <div style={uxStyle}>
            <UxOptions />
            <UxWordleGuess />
          </div>
        );
      } else {
        return null;
      }
    }

    function Board() {
      /// changes the current word. if the cell is not the current cell the direction stays the same, if the cell if the direction changes
      function cellClick(event) {
        let target = event.target;
        let row = target.dataset.row;
        let col = target.dataset.column;

        // we keep the same direction exept if the cell clicked is the same as the currently selcected cell
        // or there is no word attached to that cell in that direction
        let direction = playState.dir;
        let current_word = playState.current_word;
        let found_indexes = getWordCharIndex(direction, row, col);
        // if there are no valid words for this direction
        if (found_indexes === null) {
          direction = change_dir(direction);
        }
        // if the same cell was clicked that you are already on
        else if (current_word[0] == direction && current_word[1] == found_indexes[0] && current_word[2] == found_indexes[1]) {
          direction = change_dir(direction);
        }

        // get the indexes again because if the direction changed then the indexes has changed aswell
        found_indexes = getWordCharIndex(direction, row, col);
        if (found_indexes === null) {
          return;
        }

        let found_word = getWord(direction, found_indexes[0]);
        let cleared_guess = clearedWordleGuess(found_word.spelling.length);

        setPlayState({
          ...playState,
          dir: direction,
          current_word: [direction, found_indexes[0], found_indexes[1]],
          wordleGuess: cleared_guess,
        });

        function change_dir(dir) {
          if (dir == 'h') {
            return 'v'
          } else {
            return 'h'
          }
        }
      }

      /// returns a double array of the correct cell styling for the current state
      function genCellStyles() {
        if (playState.playstyle == "standard") {
          let boxSizePx = getBoxSize();
          let boxCellNum = playState.solved_board.length;

          // generate and array of base cells
          let baseStyle = styleCellBox(boxSizePx - 1, boxCellNum, "white");
          let cellStyles = [];
          for (let r = 0; r < boxCellNum; r++) {
            let row = [];
            for (let c = 0; c < boxCellNum; c++) {
              let style = baseStyle;
              if (playState.solved_board[r][c] == "#") {
                style = {
                  ...style,
                  "background-color": "black",
                };
              }
              row.push(style);
            }
            cellStyles.push(row);
          }

          // highlight the cells of the current word
          let current = getWordCurrent();
          let bright = playState.current_word[2];
          for (let i = 0; i < current.spelling.length; i++) {
            let spelling = current.spelling[i];
            let r = spelling[1];
            let c = spelling[2];
            let color = styleColorDark;
            if (i == bright) {
              color = styleColorBright;
            }
            cellStyles[r][c] = {
              ...cellStyles[r][c],
              "background-color": color,
            };
          }

          return cellStyles;
        } else if (playState.playstyle == "wordle") {
          let boxSizePx = getBoxSize();
          let boxCellNum = playState.solved_board.length;

          // generate and array of base cells
          let baseStyle = styleCellBox(boxSizePx - 1, boxCellNum, "white");
          let cellStyles = [];
          for (let r = 0; r < boxCellNum; r++) {
            let row = [];
            for (let c = 0; c < boxCellNum; c++) {
              let style = baseStyle;
              let color = "black";
              let gChar = playState.guessed_board[r][c];
              if (gChar === "\u00a0") {
                color = "white";
              } else if (gChar != "\u00a0" && gChar != "#") {
                color = wordleColor(gChar, r, c);
              }

              style = {
                ...style,
                "background-color": color,
              };
              row.push(style);
            }
            cellStyles.push(row);
          }

          // highlight the cells of the current word
          let current = getWordCurrent();
          let bright = playState.current_word[2];
          for (let i = 0; i < current.spelling.length; i++) {
            let spelling = current.spelling[i];
            let r = spelling[1];
            let c = spelling[2];

            let gameColor = wordleColor(playState.guessed_board[r][c], r, c);
            let color = styleColorDark;
            if (i == bright) {
              color = styleColorBright;
            }

            let background = `radial-gradient(${gameColor}, ${color})`;
            cellStyles[r][c] = {
              ...cellStyles[r][c],
              background: background,
            };
          }

          return cellStyles;
        }
      }

      /// css for the letter in the cell, move it up so it is centered again
      function letterStyle(boxSizePx, boxCellNum) {
        const cellMarginPercent = 0.03;
        const cellBoarderPx = 1;

        let cellArea = boxSizePx / boxCellNum;
        let margin = cellArea * cellMarginPercent * 0.5;
        let size = cellArea - 2 * margin - 2 * cellBoarderPx;
        let clueSize = size / 5;

        let style = {
          "margin-top": `-${clueSize}px`,
        };

        return style;
      }

      /// creates all the cell and row elements for the board
      function genCellDivs() {
        let board = playState.guessed_board;
        let cellStyles = genCellStyles();
        let rows = [];
        let clueNumStyle = styleCellClueNum(
          getBoxSize(),
          playState.solved_board.length
        );
        for (let r = 0; r < board.length; r++) {
          let row = [];
          for (let c = 0; c < board.length; c++) {
            let clueNumber = "";
            if (playState.clue_numbers[r][c] > 0) {
              clueNumber = playState.clue_numbers[r][c];
            }
            row.push(
              <div
                onClick={cellClick}
                style={cellStyles[r][c]}
                data-row={r}
                data-column={c}
              >
                <div
                  onClick={cellClick}
                  style={clueNumStyle}
                  data-row={r}
                  data-column={c}
                >
                  {clueNumber}
                </div>
                <div
                  onClick={cellClick}
                  style={letterStyle(
                    getBoxSize(),
                    playState.solved_board.length
                  )}
                  data-row={r}
                  data-column={c}
                >
                  {board[r][c]}
                </div>
              </div>
            );
          }
          rows.push(
            <div
              style={styleCellRow(getBoxSize(), playState.solved_board.length)}
            >
              {row}
            </div>
          );
        }
        return rows;
      }

      return <div style={styleCellBoard(getBoxSize())}>{genCellDivs()}</div>;
    }

    //
    // state changes
    //

    /// makes all the guessed cells that are incorrect blank
    function removeIncorrectAll() {
      let guessed = playState.guessed_board;
      let correct = playState.solved_board;
      for (let r = 0; r < guessed.length; r++) {
        for (let c = 0; c < guessed.length; c++) {
          if (guessed[r][c] !== correct[r][c]) {
            guessed[r][c] = "\u00a0";
          }
        }
      }
      setPlayState({
        ...playState,
        guessed_board: guessed,
      });
    }

    /// makes any cell with the incorrect char blank that is in the current word
    function removeIncorrectWord() {
      let word = getWordCurrent();
      let guessed = playState.guessed_board;
      for (let i = 0; i < word.spelling.length; i++) {
        let spelling = word.spelling[i];
        let ch = spelling[0];
        let r = spelling[1];
        let c = spelling[2];
        if (guessed[r][c] != ch) {
          guessed[r][c] = "\u00a0";
        }
      }

      setPlayState({
        ...playState,
        guessed_board: guessed,
      });
    }

    /// makes the guessed board equal to the solved_board
    function solveAll() {
      let solved = playState.solved_board;
      let guessed = playState.guessed_board;
      for (let r = 0; r < solved.length; r++) {
        for (let c = 0; c < solved.length; c++) {
          guessed[r][c] = solved[r][c];
        }
      }
      setPlayState({
        ...playState,
        guessed_board: guessed,
      });
    }

    /// makes the chars correct for all the cells in the current word
    function solveWord() {
      let word = getWordCurrent();
      let guessed = playState.guessed_board;
      for (let i = 0; i < word.spelling.length; i++) {
        let spelling = word.spelling[i];
        let ch = spelling[0];
        let r = spelling[1];
        let c = spelling[2];
        guessed[r][c] = ch;
      }
      setPlayState({
        ...playState,
        guessed_board: guessed,
      });
    }

    //
    // nyt helpers
    //

    function wordleColor(char, row, col) {
      let solved = playState.solved_board;

      if (char == "\u00a0") {
        return "white";
      }

      // if the char matches the correct board return the correct color
      if (solved[row][col] == char) {
        return setWordleCorrect;
      }

      let foundChar = false;
      // check the horizontal word that goes through the location for the char
      let hWord = getWordCharIndex("h", row, col);
      let spelling = playState.h_clues[hWord[0]].spelling;
      for (let i = 0; i < spelling.length; i++) {
        let correctChar = spelling[i][0];
        if (correctChar == char) {
          foundChar = true;
        }
      }

      // check the vertical word
      let vWord = getWordCharIndex("v", row, col);
      let spellingV = playState.v_clues[vWord[0]].spelling;
      for (let i = 0; i < spellingV.length; i++) {
        let correctChar = spellingV[i][0];
        if (correctChar == char) {
          foundChar = true;
        }
      }

      // if the horizontal or vertical word contained the char then return the char in word color
      if (foundChar) {
        return setWordleLocation;
      }

      // if nothing else the coloring is the char not in word or not correct color
      return setWordleWrong;
    }

    /// reutrns the word stuct that is represented by the current word in the playState
    function getWordCurrent() {
      let current = playState.current_word;
      if (current[0] == "h") {
        return playState.h_clues[current[1]];
      } else {
        return playState.v_clues[current[1]];
      }
    }

    function getWord(dir, index) {
      if (dir == "h") {
        return playState.h_clues[index];
      } else {
        return playState.v_clues[index];
      }
    }

    /// return the word index and char index for the h_clues or v_clues for the given location
    function getWordCharIndex(dir, row, col) {
      let words;
      if (dir === "h") {
        words = playState.h_clues;
      } else {
        words = playState.v_clues;
      }
      for (let i = 0; i < words.length; i++) {
        let w = words[i];
        for (let c = 0; c < w.spelling.length; c++) {
          let loc = w.spelling[c];
          if (loc[1] == row && loc[2] == col) {
            return [i, c];
          }
        }
      }
      return null;
    }

    /// sets the app state back to make, renders make again and sets nyt to not render
    function backToMake() {
      setMakeState({
        ...makeState,
        render: true,
      });
      setPlayState({
        ...playState,
        render: false,
      });
    }

    function clearedWordleGuess(size) {
      let clearedGuess = [];
      for (let i = 0; i < size; i++) {
        clearedGuess.push("\u00a0");
      }
      return clearedGuess;
    }

    //
    // event listener
    //

    // listen for a key press and do the appropiate action
    React.useEffect(() => {
      function keyPressed(event) {
        let keyCode = event.keyCode;
        let char = event.key;
        if (keyCode < 65 || keyCode > 90) {
          // space is 32 and backspace is 8 enter is 13
          if (keyCode !== 32 && keyCode !== 8 && keyCode !== 13) {
            return;
          }
        }

        let current = playState.current_word;
        let dir = current[0];
        let wordI = current[1];
        let charI = current[2];

        let w;
        let row;
        let col;
        let newCharI = charI;
        if (dir == "h") {
          w = playState.h_clues[wordI];
          let s = w.spelling[charI];
          row = s[1];
          col = s[2];
        } else {
          w = playState.v_clues[wordI];
          let s = w.spelling[charI];
          row = s[1];
          col = s[2];
        }

        // if enter is pressed and the playstyle is wordle then add the guesses word to the guessed board
        if (keyCode === 13 && playState.playstyle == "wordle") {
          let guess = playState.wordleGuess;
          let word = getWordCurrent();
          let spelling = word.spelling;
          let board = playState.guessed_board;
          for (let i = 0; i < guess.length; i++) {
            let ch = guess[i];
            let r = spelling[i][1];
            let c = spelling[i][2];
            board[r][c] = ch;
          }

          // create a new array of blank spaces for the new guess
          let newGuess = clearedWordleGuess(word.spelling.length);
          // reset the letter index of the current word to 0 after adding a word
          let current = playState.current_word;
          current[2] = 0;

          let newPlay = {
            ...playState,
            guessed_board: board,
            wordleGuess: newGuess,
            current_word: current,
          };

          if (playState.current_word[0] == "h") {
            let guesses = playState.wordleHguesses;
            guesses[playState.current_word[1]].unshift(guess);
            while (guesses[playState.current_word[1]].length > 3) {
              guesses[playState.current_word[1]].pop();
            }
            setPlayState({
              ...newPlay,
              wordleHguesses: guesses,
            });
          } else {
            let guesses = playState.wordleVguesses;
            guesses[playState.current_word[1]].unshift(guess);
            while (guesses[playState.current_word[1]].length > 3) {
              guesses[playState.current_word[1]].pop();
            }
            setPlayState({
              ...newPlay,
              wordleVguesses: guesses,
            });
          }

          return;
        } else if (keyCode === 13) {
          return;
        }

        // handle backspace
        if (keyCode === 8) {
          // handle standard play backspace
          if (playState.playstyle == "standard") {
            // if char is a blank space
            if (playState.guessed_board[row][col] == "\u00a0") {
              let newI = charI;
              if (newI > 0) {
                newI = newI - 1;
              }
              let newCurrent = [dir, wordI, newI];
              setPlayState({
                ...playState,
                current_word: newCurrent,
              });
              return;
            }
            /// remove the char if cell has a char in it
            else {
              let newChar = "\u00a0";
              let newGuessed = playState.guessed_board;
              newGuessed[row][col] = newChar;
              setPlayState({
                ...playState,
                guessed_board: newGuessed,
              });
              return;
            }
          }
          /// hand wordle backspace
          else if (playState.playstyle == "wordle") {
            // if the current cell is empty then go back one
            if (playState.wordleGuess[charI] == "\u00a0") {
              let newI = charI;
              if (newI > 0) {
                newI = newI - 1;
              }
              let newCurrent = [dir, wordI, newI];
              setPlayState({
                ...playState,
                current_word: newCurrent,
              });
              return;
            } else {
              let guess = playState.wordleGuess;
              guess[charI] = "\u00a0";
              setPlayState({
                ...playState,
                wordleGuess: guess,
              });
              return;
            }
          }
        }

        if (charI < w.spelling.length - 1) {
          newCharI++;
        }

        // handle space
        if (keyCode === 32) {
          let newCurrent = [dir, wordI, newCharI];
          setPlayState({
            ...playState,
            current_word: newCurrent,
          });
          return;
        }

        let newCurrent = [dir, wordI, newCharI];
        if (playState.playstyle == "standard") {
          let guessed_board = playState.guessed_board;
          guessed_board[row][col] = char;

          setPlayState({
            ...playState,
            guessed_board: guessed_board,
            current_word: newCurrent,
          });
        } else if (playState.playstyle == "wordle") {
          let guess = playState.wordleGuess;
          guess[charI] = char;
          setPlayState({
            ...playState,
            current_word: newCurrent,
            wordleGuess: guess,
          });
        }
      }

      window.addEventListener("keydown", keyPressed);

      return (_) => {
        window.removeEventListener("keydown", keyPressed);
      };
    });

    //
    // style
    //

    /// returns the size in pixels of both the ux and board boxes
    function getBoxSize() {
      let maxWidth = window.innerWidth;
      let maxHeight = window.innerHeight - styleHeaderHeightPX;
      let workWidth = maxWidth - 2 * styleAppPaddingPX;
      let workHeight = maxHeight - styleAppPaddingPX;

      let boxH = workWidth / 2;
      //let boxHM = `${(workHeight - boxH) / 2}px ${styleAppPaddingPX}px ${styleAppPaddingPX}px ${styleAppPaddingPX}px`;
      if (workHeight < boxH) {
        boxH = workHeight;
        //boxHM = `0px ${styleAppPaddingPX}px ${styleAppPaddingPX}px ${((workWidth - (2 * boxH)) / 2) + styleAppPaddingPX}px `;
      }

      let boxV = workHeight / 2;
      //let boxVM = `0px ${styleAppPaddingPX}px ${styleAppPaddingPX}px ${((workWidth - boxV) / 2) + styleAppPaddingPX}px`;
      if (workWidth < boxV) {
        boxV = workWidth;
        //boxVM = `${(workHeight - (2 * boxV)) / 2}px ${styleAppPaddingPX}px ${styleAppPaddingPX}px ${styleAppPaddingPX}px`;
      }

      let boxSize = boxH;
      if (boxV > boxH) {
        boxSize = boxV;
      }

      return boxSize;
    }

    /// find the needed values and return the styling for the NYT page
    function nytStyle() {
      let maxWidth = window.innerWidth;
      let maxHeight = window.innerHeight - styleHeaderHeightPX;
      let workWidth = maxWidth - 2 * styleAppPaddingPX;
      let workHeight = maxHeight - styleAppPaddingPX;

      let boxH = workWidth / 2;
      let boxHM = `${
        (workHeight - boxH) / 2
      }px ${styleAppPaddingPX}px ${styleAppPaddingPX}px ${styleAppPaddingPX}px`;
      if (workHeight < boxH) {
        boxH = workHeight;
        boxHM = `0px ${styleAppPaddingPX}px ${styleAppPaddingPX}px ${
          (workWidth - 2 * boxH) / 2 + styleAppPaddingPX
        }px `;
      }

      let boxV = workHeight / 2;
      let boxVM = `0px ${styleAppPaddingPX}px ${styleAppPaddingPX}px ${
        (workWidth - boxV) / 2 + styleAppPaddingPX
      }px`;
      if (workWidth < boxV) {
        boxV = workWidth;
        boxVM = `${
          (workHeight - 2 * boxV) / 2
        }px ${styleAppPaddingPX}px ${styleAppPaddingPX}px ${styleAppPaddingPX}px`;
      }

      let isH = true;
      let boxSize = boxH;
      let padding = boxHM;
      if (boxV > boxH) {
        isH = false;
        boxSize = boxV;
        padding = boxVM;
      }

      return stylePAGE(maxHeight, maxWidth, isH, padding);
    }

    return (
      <div style={nytStyle()}>
        <Board />
        <Ux />
      </div>
    );
  }

  function About() {
    if (!aboutState.render) {
      return null;
    }

    function Selection() {
      // the button that should be highlighted
      let [aboutHighlight, setAboutHighlight] = React.useState(null);

      // the button element
      function AboutButton(name) {
        let style = styleButtonMedium;
        let background = "white";
        if (name == aboutHighlight || name == aboutState.selected) {
          background = styleColorBright;
        }
        style = {
          ...style,
          display: "block",
          margin: "auto",
          "margin-top": "10px",
          width: `${setAboutSelectionWidth * 0.75}px`,
          "background-color": background,
        };

        return (
          <button
            onClick={aboutButtonClick}
            onMouseEnter={aboutHighlightButton}
            onMouseOut={aboutUnhighlight}
            style={style}
            data-name={name}
          >
            {name}
          </button>
        );
      }

      function AboutBackButton() {
        let name = "Back";
        let style = styleButtonMedium;
        let background = styleColorLight;
        if (name == aboutHighlight) {
          background = styleColorBright;
        }
        style = {
          ...style,
          display: "block",
          margin: "auto",
          "margin-top": "10px",
          "margin-bottom": "50px",
          width: `${setAboutSelectionWidth * 0.75}px`,
          "background-color": background,
        };

        return (
          <button
            onClick={aboutGoBack}
            style={style}
            data-name={name}
            onMouseEnter={aboutHighlightButton}
            onMouseOut={aboutUnhighlight}
          >
            Go Back
          </button>
        );
      }

      function aboutGoBack() {
        if (aboutState.prvPage == "play") {
          setAboutState({
            ...aboutState,
            render: false,
          });
          setPlayState({
            ...playState,
            render: true,
          });
        } else {
          setAboutState({
            ...aboutState,
            render: false,
          });
          setMakeState({
            ...makeState,
            render: true,
          });
        }
      }

      // set so no button is highlighted
      function aboutUnhighlight() {
        setAboutHighlight(null);
      }

      // set so the hovered button is highlighted
      function aboutHighlightButton(event) {
        let name = event.target.dataset.name;
        setAboutHighlight(name);
      }

      // chang the about state so the appropriate section will be highlighted
      function aboutButtonClick(event) {
        let name = event.target.dataset.name;
        setAboutState({
          ...aboutState,
          selected: name,
        });
      }

      // css styling
      function style() {
        let style = styleBorderedBox();

        let width = setAboutSelectionWidth;
        let height = aboutInnerHeight();

        style = {
          ...style,
          height: `${height}px`,
          width: `${width}px`,
          "margin-left": `${setAppPaddingPx}px`,
          "margin-top": `${setAppPaddingPx}px`,
          display: "block",
        };

        return style;
      }

      // make all the buttons
      let buttonNames = ["About", "Make", "Play", "Crossword", "Dictionary"];
      let buttons = [];
      for (let i = 0; i < buttonNames.length; i++) {
        let name = buttonNames[i];
        buttons.push(AboutButton(name));
      }

      return (
        <div style={style()}>
          <AboutBackButton />
          {buttons}
        </div>
      );
    }

    function Info() {
      let info = <h1>Something Went Wrong</h1>;
      let sel = aboutState.selected;
      if (sel == "Make") {
        info = aboutMakeHtml;
      } else if (sel == "Play") {
        info = aboutPlayHtml;
      } else if (sel == "About") {
        info = aboutAboutHtml;
      } else if (sel == "Crossword") {
        info = aboutCrossHtml;
      } else if (sel == "Dictionary") {
        info = aboutDictHtml;
      }

      function style() {
        let style = styleBorderedBox();

        let height = aboutInnerHeight() - 2 * setAppPaddingPx;
        let width =
          aboutWidth() -
          5 * setAppPaddingPx -
          setAboutSelectionWidth -
          2 * setBorderMedWidthPx;
        style = {
          ...style,
          height: `${height}px`,
          width: `${width}px`,
          "margin-left": `${setAppPaddingPx - setBorderMedWidthPx}px`,
          "margin-top": `${setAppPaddingPx}px`,
          "text-align": "left",
          padding: `${setAppPaddingPx}px`,
          "overflow-y": "scroll",
        };

        return style;
      }

      return <div style={style()}>{info}</div>;
    }

    //
    // styling
    //
    function aboutInnerHeight() {
      return aboutHeight() - 2 * setAppPaddingPx - setBorderMedWidthPx;
    }

    function aboutHeight() {
      return window.innerHeight - 2 * setAppPaddingPx - setHeaderHeightPx;
    }

    function aboutWidth() {
      return window.innerWidth - 2 * setAppPaddingPx;
    }

    function style() {
      let style = styleBorderedBox();
      let width = aboutWidth();
      let height = aboutHeight();

      style = {
        ...style,
        height: `${height}px`,
        width: `${width}px`,
        "margin-left": `${setAppPaddingPx}px`,
        "margin-top": `${setAppPaddingPx}px`,
        display: "inline-flex",
      };

      return style;
    }
    return (
      <div style={style()}>
        <Selection />
        <Info />
      </div>
    );
  }

  //
  // App state changes
  //

  function aboutGoTo() {
    if (makeState.render) {
      setMakeState({
        ...makeState,
        render: false,
      });
      setAboutState({
        ...aboutState,
        render: true,
        prvPage: "make",
        selected: "Make",
      });

      return;
    } else if (playState.render) {
      setPlayState({
        ...playState,
        render: false,
      });
      setAboutState({
        ...aboutState,
        render: true,
        prvPage: "play",
        selected: "Play",
      });

      return;
    }
    return;
  }

  // updates the appState to represent the current window dimentions
  React.useEffect(() => {
    function appStateResizeWindow() {
      setAppState({
        ...appState,
        window_width: window.innerWidth,
        window_height: window.innerHeight,
      });
    }

    window.addEventListener("resize", appStateResizeWindow);

    return (_) => {
      window.removeEventListener("resize", appStateResizeWindow);
    };
  });

  //
  // App helpers
  //

  function initNewPlay(solution, playstyle) {
    // serever sends back a serialized version of this struct as a solved board
    // pub struct Solution {
    //     board: Vec<Vec<char>>,
    //     clue_numbers: Vec<Vec<i32>>,
    //     vertical_words: Vec<WordClue>,
    //     horizontal_words: Vec<WordClue>,
    // }

    // the wordclue type serialized into json format
    // pub struct WordClue {
    //     pub word: String,
    //     pub word_number: i32, // clue number
    //     pub spelling: Vec<(char, usize, usize)>, // char, row, column
    //     pub part_of_speech: String,
    //     pub definition: String,
    // }

    function emptyGuessed(size, correct) {
      let guessed = [];
      for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
          if (correct[i][j] === "#") {
            row.push("#");
          } else {
            row.push("\u00a0");
          }
        }
        guessed.push(row);
      }

      return guessed;
    }
    let dir = null;
    let current_word = null;
    let current_clue = null;

    let hGuesses = [];
    for (let i = 0; i < solution.horizontal_words.length; i++) {
      hGuesses.push([]);
      let clue = solution.horizontal_words[i];
      if (clue.word_number == 1) {
        dir = "h";
        current_word = ["h", i, 0];
        current_clue = clue;
      }
    }

    let vGuesses = [];
    for (let i = 0; i < solution.vertical_words.length; i++) {
      vGuesses.push([]);
      if (dir != null) {
        continue;
      }
      let clue = solution.vertical_words[i];
      if (clue.word_number == 1) {
        dir = "v";
        current_word = ["v", i, 0];
        current_clue = clue;
      }
    }

    let currentGuess = [];
    for (let i = 0; i < current_clue.spelling.length; i++) {
      currentGuess.push("\u00a0");
    }

    return {
      render: true,
      solved_board: solution.board,
      guessed_board: emptyGuessed(solution.board.length, solution.board),
      playstyle: playstyle,
      clue_numbers: solution.clue_numbers,
      v_clues: solution.vertical_words,
      h_clues: solution.horizontal_words,
      dir: dir,
      current_word: current_word, // the direction, index of the word, index for the letter
      highlight_word: null, // will be direction, word index, letter index
      wordleGuess: currentGuess,
      wordleVguesses: vGuesses,
      wordleHguesses: hGuesses,
    };
  }

  return (
    <div tabIndex={0}>
      <Header />
      <Make />
      <Play />
      <About />
    </div>
  );
}

function starting_board_size11() {
  let b1 = [
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    [false, false, false, false, true, true, true, false, false, false, false],
    [true, false, false, false, false, false, false, false, false, false, true],
    [true, true, true, true, false, false, false, true, true, true, true],
    [true, false, false, false, false, false, false, false, false, false, true],
    [false, false, false, false, true, true, true, false, false, false, false],
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
  ];
  let b2 = [
    [false, false, false, true, false, false, false, true, false, false, false],
    [
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    [
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    [true, false, false, false, true, false, false, false, true, true, true],
    [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
    ],
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    [
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    [true, true, true, false, false, false, true, false, false, false, true],
    [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
    ],
    [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
    ],
    [false, false, false, true, false, false, false, true, false, false, false],
  ];
  let b3 = [
    [false, false, false, false, true, false, false, false, false, true, true],
    [false, false, false, false, true, false, false, false, false, false, true],
    [
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    [false, false, false, false, false, false, true, true, false, false, false],
    [true, true, true, false, false, false, false, true, false, false, false],
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    [false, false, false, true, false, false, false, false, true, true, true],
    [false, false, false, true, true, false, false, false, false, false, false],
    [
      false,
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
    ],
    [true, false, false, false, false, false, true, false, false, false, false],
    [true, true, false, false, false, false, true, false, false, false, false],
  ];
  let b4 = [
    [false, false, false, true, false, false, false, true, false, false, false],
    [false, false, false, true, false, false, false, true, false, false, false],
    [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    [false, false, false, false, true, true, true, false, false, false, false],
    [true, false, false, false, false, false, false, false, false, false, true],
    [true, true, true, true, false, false, false, true, true, true, true],
    [true, false, false, false, false, false, false, false, false, false, true],
    [false, false, false, false, true, true, true, false, false, false, false],
    [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ],
    [false, false, false, true, false, false, false, true, false, false, false],
    [false, false, false, true, false, false, false, true, false, false, false],
  ];
  let b5 = [
    [true, false, false, false, false, true, false, false, false, false, true],
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    [false, false, false, true, false, false, false, true, false, false, false],
    [true, false, false, false, false, false, true, false, false, false, true],
    [true, true, true, false, false, false, false, false, true, true, true],
    [true, false, false, false, true, false, false, false, false, false, true],
    [false, false, false, true, false, false, false, true, false, false, false],
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    [
      false,
      false,
      false,
      false,
      false,
      true,
      false,
      false,
      false,
      false,
      false,
    ],
    [true, false, false, false, false, true, false, false, false, false, true],
  ];

  let boards = [b1, b2, b3, b4, b5];
  let rand_index = Math.floor(Math.random() * boards.length);
  return boards[rand_index];
}

// set body styling
let body = document.querySelector("body");
body.style.fontFamily = "sans-serif";
body.style.margin = "0";
body.style.display = "flex";
body.style.overflow = "hidden";
body.style.height = "100vh";
body.style.width = "100vw";
body.style.background = `linear-gradient(290deg, ${styleColorBright} 0%, ${styleColorDark} 10%, ${styleColorLight} 55%, white 100%)`;

ReactDOM.render(<App />, document.querySelector("body"));
