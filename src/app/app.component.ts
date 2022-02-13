import { AfterViewInit, ChangeDetectorRef, Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DOCUMENT } from '@angular/common';
import { AppService } from './app.service';

type LETTER_TYPE = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

type LETTER_STATE_TYPE = 'unknown' | 'absent' | 'present' | 'correct';

interface Word {
  letters: string;
}

interface Letter {
  symbol: LETTER_TYPE;
}

interface LetterLockedState {
  locked: boolean;
}

interface LetterState {
  state: LETTER_STATE_TYPE;
}

interface LetterAndState {
  symbol: LETTER_TYPE;
  state: LETTER_STATE_TYPE;
}

const DEFAULT_REGEXP = '[ABCDEFGHIJKLMNOPQRSTUVWXYZ]';

const DEFAULT_REGEXPS =  [
  DEFAULT_REGEXP,
  DEFAULT_REGEXP,
  DEFAULT_REGEXP,
  DEFAULT_REGEXP,
  DEFAULT_REGEXP,
];

const ALL_LETTERS: Letter[] = [
  { symbol: 'A' },
  { symbol: 'B' },
  { symbol: 'C' },
  { symbol: 'D' },
  { symbol: 'E' },
  { symbol: 'F' },
  { symbol: 'G' },
  { symbol: 'H' },
  { symbol: 'I' },
  { symbol: 'J' },
  { symbol: 'K' },
  { symbol: 'L' },
  { symbol: 'M' },
  { symbol: 'N' },
  { symbol: 'O' },
  { symbol: 'P' },
  { symbol: 'Q' },
  { symbol: 'R' },
  { symbol: 'S' },
  { symbol: 'T' },
  { symbol: 'U' },
  { symbol: 'V' },
  { symbol: 'W' },
  { symbol: 'X' },
  { symbol: 'Y' },
  { symbol: 'Z' }
];

const LETTER_STATES: LetterState[] = [
  { state: 'unknown' },
  { state: 'absent' },
  { state: 'present' },
  { state: 'correct' }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('main')
  mainElement: any;

  public debug = false;

  private allWords: Word[] = [];
  public candidateWords: Word[] = [];

  public letterAndStateArrayArray: LetterAndState[][];

  public availableLettersArray: Letter[][];
  public chosenLetters: Letter[];
  public chosenLettersLocked: LetterLockedState[];

  public letterStatesArrays: LetterState[][];
  public chosenLetterStates: LetterState[];

  public mustHaveLetters: string[] = [];
  public regexps: string[];

  constructor(
    private appService: AppService,
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone,
    private httpClient: HttpClient
  ) {
    this.appService.messageFromExtension.subscribe((message: any) => {
      this.ngZone.run(() => {
        switch (message.command) {
          case 'colorTheme':
            this.adjustTheme();
            break;
        }
      });
    });
    this.reset();
  }

  ngOnInit(): void {
    this.httpClient.get<Word[]>('assets/words/words.json').subscribe(words => {
      this.allWords = words.map((word) => {
        return { letters: word.letters.toUpperCase() };
      });
      this.candidateWords = JSON.parse(JSON.stringify(this.allWords));
    });
  }

  ngAfterViewInit(): void {
    this.adjustTheme();
  }

  reset() {
    this.letterAndStateArrayArray = [];

    this.availableLettersArray = [
      [...ALL_LETTERS],
      [...ALL_LETTERS],
      [...ALL_LETTERS],
      [...ALL_LETTERS],
      [...ALL_LETTERS]
    ];

    this.availableLettersArray = JSON.parse(JSON.stringify(this.availableLettersArray));

    this.chosenLetters = [
      this.availableLettersArray[0][0],
      this.availableLettersArray[1][20],
      this.availableLettersArray[2][17],
      this.availableLettersArray[3][4],
      this.availableLettersArray[4][8]
    ];

    this.chosenLettersLocked = [
      { locked: false },
      { locked: false },
      { locked: false },
      { locked: false },
      { locked: false }
    ];

    this.letterStatesArrays = [
      [...LETTER_STATES],
      [...LETTER_STATES],
      [...LETTER_STATES],
      [...LETTER_STATES],
      [...LETTER_STATES]
    ];

    this.letterStatesArrays = JSON.parse(JSON.stringify(this.letterStatesArrays));

    this.chosenLetterStates = [
      this.letterStatesArrays[0][0],
      this.letterStatesArrays[1][0],
      this.letterStatesArrays[2][0],
      this.letterStatesArrays[3][0],
      this.letterStatesArrays[4][0],
    ];

    this.mustHaveLetters = [];

    this.regexps = JSON.parse(JSON.stringify(DEFAULT_REGEXPS));

    this.candidateWords = JSON.parse(JSON.stringify(this.allWords));
  }

  cannotComputeRegexps() {
    return this.chosenLetterStates.some((letterState) => letterState.state === 'unknown');
  }

  computeRegexps() {
    this.chosenLetterStates.forEach((letterState, index) => {
      const letter = this.chosenLetters[index];
      if (letterState.state === 'absent') {
        this.regexps.forEach((re, jindex) => {
          this.regexps[jindex] = re.replace(this.chosenLetters[index].symbol.toUpperCase(), '');
        });
        this.availableLettersArray.forEach((availableLetters, jindex) => {
          const foundAt = availableLetters.findIndex((letterChoice) => letterChoice.symbol === letter.symbol);
          if (foundAt !== -1) {
            availableLetters.splice(foundAt, 1);
          }
        });
      }
      if (letterState.state === 'present') {
        this.regexps[index] = this.regexps[index].replace(letter.symbol.toUpperCase(), '');
      }
    });

    this.letterAndStateArrayArray.push(
      this.chosenLetters.map((letter, index) => {
        const state = this.chosenLetterStates[index].state;
        switch (this.chosenLetterStates[index].state) {
          case 'absent':
            // Reset
            this.chosenLetterStates[index] = { state: 'unknown' };
            break;
          case 'present':
            this.mustHaveLetters.push(letter.symbol);
            // Reset
            this.chosenLetterStates[index] = { state: 'unknown' };
            break;
          case 'correct':
            this.regexps[index] = letter.symbol;
            // Lock
            this.chosenLettersLocked[index].locked = true;
            break;
        }
        const letterAndState = {
          symbol: this.chosenLetters[index].symbol,
          state
        };
        return letterAndState;
      })
    );

    const regexp = new RegExp(this.regexps.join(''));
    this.candidateWords = this.allWords.filter((word) => {
      if (!regexp.test(word.letters)) {
        return false;
      }
      if (this.mustHaveLetters.length > 0) {
        return this.mustHaveLetters.every((letter) => word.letters.split('').includes(letter));
      }
      return true;
    });
  }

  adjustTheme() {
    let theme = 'md-light-indigo';
    if (document.body.classList.contains('vscode-light')) {
      theme = 'md-light-indigo';
    } else if (document.body.classList.contains('vscode-dark')) {
      theme = 'md-dark-indigo';
    }
    const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
    if (themeLink) {
        themeLink.href = theme + '.css';
    }
  }
}
