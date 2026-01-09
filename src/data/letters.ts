import AJson from './letters/A.json';
import BJson from './letters/B.json';
import CJson from './letters/C.json';
import DJson from './letters/D.json';
import EJson from './letters/E.json';
import FJson from './letters/F.json';
import GJson from './letters/G.json';
import HJson from './letters/H.json';
import IJson from './letters/I.json';
import JJson from './letters/J.json';
import LJson from './letters/L.json';
import MJson from './letters/M.json';
import NJson from './letters/N.json';
import OJson from './letters/O.json';
import PJson from './letters/P.json';
import QJson from './letters/Q.json';
import RJson from './letters/R.json';
import SJson from './letters/S.json';
import TJson from './letters/T.json';
import UJson from './letters/U.json';
import WJson from './letters/W.json';
import XJson from './letters/X.json';
import YJson from './letters/Y.json';
import ZJson from './letters/Z.json';

export type SongImagePosition = 'top' | 'left' | 'right' | 'background';

export interface SongLayout {
  image?: any; // main song illustration, if different from the action image
  imagePosition?: SongImagePosition;
  imageWidth?: number;
  imageHeight?: number;
  textAlign?: 'left' | 'center';
  cardBackgroundColor?: string;
}

export interface LetterContent {
  letter: string;
  story: string;
  songAudio: any;
  lyrics: string;
  actionImage: any;
  actionDescription: string;
   songArtwork?: any;
  songLayout: SongLayout;
}

// Helper to create a LetterContent from JSON and asset requires
function createLetterContent(
  json: any,
  songAudio: any,
  actionImage: any,
  songArtwork?: any,
  overrides?: Partial<LetterContent>,
): LetterContent {
  return {
    letter: json.letter,
    story: overrides?.story ?? json.story ?? `Storie vir ${json.letter} kom nog hier.`,
    songAudio,
    lyrics: json.lyrics,
    actionImage,
    songArtwork,
    actionDescription: json.actionDescription,
    songLayout: {
      imagePosition: 'top',
      textAlign: 'center',
      cardBackgroundColor: '#FFF5E6',
      ...(overrides?.songLayout ?? {}),
    },
  };
}

export const LETTERS: Record<string, LetterContent> = {
  A: createLetterContent(
    AJson,
    require('../../songs/A.wav'),
    require('../../actions/A.png'),
    require('../../artwork/A/A.png'),
    {
      // A uses the existing letter-a-action illustration
      actionImage: require('../../assets/images/letter-a-action.png'),
    },
  ),
  B: createLetterContent(
    BJson,
    require('../../songs/B.wav'),
    require('../../actions/B.png'),
    require('../../artwork/B/B.png'),
  ),
  C: createLetterContent(
    CJson,
    require('../../songs/C-K.wav'),
    require('../../actions/C-K.png'),
    require('../../artwork/C/C.png'),
  ),
  D: createLetterContent(
    DJson,
    require('../../songs/D.wav'),
    require('../../actions/D.png'),
    require('../../artwork/D/D.png'),
  ),
  E: createLetterContent(
    EJson,
    require('../../songs/E.wav'),
    require('../../actions/E.png'),
    require('../../artwork/E/E.png'),
  ),
  F: createLetterContent(
    FJson,
    require('../../songs/F-V.wav'),
    require('../../actions/F-V.png'),
    require('../../artwork/F/F.png'),
  ),
  G: createLetterContent(
    GJson,
    require('../../songs/G.wav'),
    require('../../actions/G.png'),
    require('../../artwork/G/G.png'),
  ),
  H: createLetterContent(
    HJson,
    require('../../songs/H.wav'),
    require('../../actions/H.png'),
    require('../../artwork/H/H.png'),
  ),
  I: createLetterContent(
    IJson,
    require('../../songs/I.wav'),
    require('../../actions/I.png'),
    require('../../artwork/I/I.png'),
  ),
  J: createLetterContent(
    JJson,
    require('../../songs/J.wav'),
    require('../../actions/J.png'),
    require('../../artwork/J/J.png'),
  ),
  L: createLetterContent(
    LJson,
    require('../../songs/L.wav'),
    require('../../actions/L.png'),
    require('../../artwork/L/L.png'),
  ),
  M: createLetterContent(
    MJson,
    require('../../songs/M.wav'),
    require('../../actions/M.png'),
    require('../../artwork/M/M.png'),
  ),
  N: createLetterContent(
    NJson,
    require('../../songs/N.wav'),
    require('../../actions/N.png'),
    require('../../artwork/N/N.png'),
  ),
  O: createLetterContent(
    OJson,
    require('../../songs/O.wav'),
    require('../../actions/O.png'),
    require('../../artwork/O/O.png'),
  ),
  P: createLetterContent(
    PJson,
    require('../../songs/P.wav'),
    require('../../actions/P.png'),
    require('../../artwork/P/P.png'),
  ),
  Q: createLetterContent(
    QJson,
    require('../../songs/Q.wav'),
    require('../../actions/Q.png'),
    require('../../artwork/Q/Q.png'),
  ),
  R: createLetterContent(
    RJson,
    require('../../songs/R.wav'),
    require('../../actions/R.png'),
    require('../../artwork/R/R.png'),
  ),
  S: createLetterContent(
    SJson,
    require('../../songs/S.wav'),
    require('../../actions/S.png'),
    undefined, // artwork/S is currently empty
  ),
  T: createLetterContent(
    TJson,
    require('../../songs/T.wav'),
    require('../../actions/T.png'),
    require('../../artwork/T/T.png'),
  ),
  U: createLetterContent(
    UJson,
    require('../../songs/U.wav'),
    require('../../actions/U.png'),
    require('../../artwork/U/U.png'),
  ),
  W: createLetterContent(
    WJson,
    require('../../songs/W.wav'),
    require('../../actions/W.png'),
    require('../../artwork/W/W.png'),
  ),
  X: createLetterContent(
    XJson,
    require('../../songs/X.wav'),
    require('../../actions/X.png'),
    undefined, // artwork/X is currently empty
  ),
  Y: createLetterContent(
    YJson,
    require('../../songs/Y.wav'),
    require('../../actions/Y.png'),
    require('../../artwork/Y/Y.png'),
  ),
  Z: createLetterContent(
    ZJson,
    require('../../songs/Z.wav'),
    require('../../actions/Z.png'),
    require('../../artwork/Z/Z.png'),
  ),

  // Map grouped letters to the same content where appropriate (e.g. C/K, F/V, Y/ei).
  K: createLetterContent(
    CJson,
    require('../../songs/C-K.wav'),
    require('../../actions/C-K.png'),
    require('../../artwork/C/C.png'),
  ),
  V: createLetterContent(
    FJson,
    require('../../songs/F-V.wav'),
    require('../../actions/F-V.png'),
    require('../../artwork/F/F.png'),
  ),
};

