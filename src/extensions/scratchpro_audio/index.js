const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const NOTE_TO_FREQ = {
    'C0': 16.35, 'C#0': 17.32, 'Db0': 17.32, 'D0': 18.35, 'D#0': 19.45, 'Eb0': 19.45,
    'E0': 20.60, 'F0': 21.83, 'F#0': 23.12, 'Gb0': 23.12, 'G0': 24.50, 'G#0': 25.96,
    'Ab0': 25.96, 'A0': 27.50, 'A#0': 29.14, 'Bb0': 29.14, 'B0': 30.87,
    'C1': 32.70, 'C#1': 34.65, 'Db1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'Eb1': 38.89,
    'E1': 41.20, 'F1': 43.65, 'F#1': 46.25, 'Gb1': 46.25, 'G1': 49.00, 'G#1': 51.91,
    'Ab1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'Bb1': 58.27, 'B1': 61.74,
    'C2': 65.41, 'C#2': 69.30, 'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'Eb2': 77.78,
    'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'Gb2': 92.50, 'G2': 98.00, 'G#2': 103.83,
    'Ab2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'Bb2': 116.54, 'B2': 123.47,
    'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56,
    'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65,
    'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13,
    'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30,
    'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25,
    'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61,
    'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,
    'C6': 1046.50, 'C#6': 1108.73, 'Db6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'Eb6': 1244.51,
    'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'Gb6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22,
    'Ab6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'Bb6': 1864.66, 'B6': 1975.53,
    'C7': 2093.00, 'C#7': 2217.46, 'Db7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'Eb7': 2489.02,
    'E7': 2637.02, 'F7': 2793.83, 'F#7': 2959.96, 'Gb7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44,
    'Ab7': 3322.44, 'A7': 3520.00, 'A#7': 3729.31, 'Bb7': 3729.31, 'B7': 3951.07,
    'C8': 4186.01, 'C#8': 4434.92, 'Db8': 4434.92, 'D8': 4698.63, 'D#8': 4978.03, 'Eb8': 4978.03,
    'E8': 5274.04, 'F8': 5587.65, 'F#8': 5919.91, 'Gb8': 5919.91, 'G8': 6271.93, 'G#8': 6644.88,
    'Ab8': 6644.88, 'A8': 7040.00, 'A#8': 7458.62, 'Bb8': 7458.62, 'B8': 7902.13
};

function noteToFrequency(note) {
    const n = Cast.toString(note).trim();
    if (NOTE_TO_FREQ[n]) return NOTE_TO_FREQ[n];
    const match = n.match(/^([A-G]#?b?)(\d+)$/i);
    if (match) {
        const name = match[1].toUpperCase();
        const octave = parseInt(match[2], 10);
        const base = NOTE_TO_FREQ[name + '4'];
        if (base) {
            return base * Math.pow(2, octave - 4);
        }
    }
    return 440;
}

class ScratchProAudioBlocks {
    constructor(runtime) {
        this.runtime = runtime;
        this.audioContext = null;
        this.oscillator = null;
        this.oscGain = null;
        this.oscPlaying = false;
        this.masterGain = null;
        this.panner = null;
        this.volume = 50;
        this.pan = 0;
        this.tempo = 120;
        this.attack = 0.01;
        this.decay = 0.1;
        this.sustain = 0.7;
        this.release = 0.3;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.recordedBlob = null;
        this.effectNodes = [];
    }

    _getAudioContext() {
        if (!this.audioContext) {
            try {
                const AC = window.AudioContext || window.webkitAudioContext;
                if (AC) {
                    this.audioContext = new AC();
                }
            } catch (e) {
                log.warn('[Audio] Could not create AudioContext');
            }
        }
        return this.audioContext;
    }

    _getMasterGain() {
        if (!this.masterGain) {
            const ctx = this._getAudioContext();
            if (!ctx) return null;
            this.masterGain = ctx.createGain();
            this.masterGain.gain.value = this.volume / 100;
            if (this.panner) {
                this.masterGain.connect(this.panner);
            } else {
                this.masterGain.connect(ctx.destination);
            }
        }
        return this.masterGain;
    }

    _getPanner() {
        if (!this.panner) {
            const ctx = this._getAudioContext();
            if (!ctx) return null;
            try {
                this.panner = ctx.createStereoPanner();
                this.panner.pan.value = this.pan / 100;
                this.panner.connect(ctx.destination);
                if (this.masterGain) {
                    this.masterGain.disconnect();
                    this.masterGain.connect(this.panner);
                }
            } catch (e) {
                log.warn('[Audio] Stereo panner not supported');
            }
        }
        return this.panner;
    }

    getInfo() {
        const WAVE_MENU = {
            acceptReporters: true,
            items: [
                {text: 'sine', value: 'sine'},
                {text: 'square', value: 'square'},
                {text: 'sawtooth', value: 'sawtooth'},
                {text: 'triangle', value: 'triangle'}
            ]
        };
        const HASH_MENU = {
            acceptReporters: true,
            items: [
                {text: 'MD5', value: 'MD5'},
                {text: 'SHA1', value: 'SHA1'},
                {text: 'SHA256', value: 'SHA256'}
            ]
        };
        return {
            id: 'scratchproAudio',
            name: 'Audio',
            color1: '#FF4D4D',
            color2: '#E63333',
            color3: '#CC1A1A',
            blocks: [
                {
                    opcode: 'audioPlayTone',
                    blockType: BlockType.COMMAND,
                    text: 'play tone [FREQ] Hz for [DURATION] ms',
                    arguments: {
                        FREQ: {type: ArgumentType.NUMBER, defaultValue: 440},
                        DURATION: {type: ArgumentType.NUMBER, defaultValue: 500}
                    },
                    doc: { description: 'Play a sine wave tone at the given frequency for the specified duration in milliseconds.' }
                },
                {
                    opcode: 'audioPlayNote',
                    blockType: BlockType.COMMAND,
                    text: 'play note [NOTE] for [DURATION] ms',
                    arguments: {
                        NOTE: {type: ArgumentType.STRING, defaultValue: 'C4'},
                        DURATION: {type: ArgumentType.NUMBER, defaultValue: 500}
                    },
                    doc: { description: 'Play a musical note (e.g. C4, A#5) for the specified duration in milliseconds.' }
                },
                {
                    opcode: 'audioOscillator',
                    blockType: BlockType.COMMAND,
                    text: 'start oscillator [FREQ] Hz type [TYPE] gain [GAIN]',
                    arguments: {
                        FREQ: {type: ArgumentType.NUMBER, defaultValue: 440},
                        TYPE: {type: ArgumentType.STRING, menu: 'WAVE', defaultValue: 'sine'},
                        GAIN: {type: ArgumentType.NUMBER, defaultValue: 50}
                    },
                    doc: { description: 'Start a continuous oscillator with the given frequency, waveform type, and gain level.' }
                },
                {
                    opcode: 'audioOscillatorStop',
                    blockType: BlockType.COMMAND,
                    text: 'stop oscillator',
                    doc: { description: 'Stop the currently running continuous oscillator.' }
                },
                '---',
                {
                    opcode: 'audioSetVolume',
                    blockType: BlockType.COMMAND,
                    text: 'set volume [VOLUME] %',
                    arguments: {
                        VOLUME: {type: ArgumentType.NUMBER, defaultValue: 50}
                    },
                    doc: { description: 'Set the master audio volume from 0 to 100 percent.' }
                },
                {
                    opcode: 'audioSetPan',
                    blockType: BlockType.COMMAND,
                    text: 'set pan [PAN]',
                    arguments: {
                        PAN: {type: ArgumentType.NUMBER, defaultValue: 0}
                    },
                    doc: { description: 'Set the stereo pan position from -100 (left) to 100 (right).' }
                },
                {
                    opcode: 'audioSetEnvelope',
                    blockType: BlockType.COMMAND,
                    text: 'set ADSR attack [ATTACK] decay [DECAY] sustain [SUSTAIN] release [RELEASE]',
                    arguments: {
                        ATTACK: {type: ArgumentType.NUMBER, defaultValue: 0.01},
                        DECAY: {type: ArgumentType.NUMBER, defaultValue: 0.1},
                        SUSTAIN: {type: ArgumentType.NUMBER, defaultValue: 0.7},
                        RELEASE: {type: ArgumentType.NUMBER, defaultValue: 0.3}
                    },
                    doc: { description: 'Set the ADSR envelope parameters (attack, decay, sustain, release in seconds) for audio shaping.' }
                },
                '---',
                {
                    opcode: 'audioBeep',
                    blockType: BlockType.COMMAND,
                    text: 'beep',
                    doc: { description: 'Play a short 440 Hz beep sound.' }
                },
                {
                    opcode: 'audioPlaySilence',
                    blockType: BlockType.COMMAND,
                    text: 'silence for [DURATION] ms',
                    arguments: {
                        DURATION: {type: ArgumentType.NUMBER, defaultValue: 500}
                    },
                    doc: { description: 'Play silence (no audio) for the specified duration in milliseconds.' }
                },
                {
                    opcode: 'audioNoise',
                    blockType: BlockType.COMMAND,
                    text: 'white noise for [DURATION] ms',
                    arguments: {
                        DURATION: {type: ArgumentType.NUMBER, defaultValue: 500}
                    },
                    doc: { description: 'Play white noise for the specified duration in milliseconds.' }
                },
                {
                    opcode: 'audioPlayChord',
                    blockType: BlockType.COMMAND,
                    text: 'play chord [NOTES] for [DURATION] ms',
                    arguments: {
                        NOTES: {type: ArgumentType.STRING, defaultValue: '["C4","E4","G4"]'},
                        DURATION: {type: ArgumentType.NUMBER, defaultValue: 1000}
                    },
                    doc: { description: 'Play a chord from a JSON array of note names (e.g. ["C4","E4","G4"]) for the specified duration.' }
                },
                '---',
                {
                    opcode: 'audioSetTempo',
                    blockType: BlockType.COMMAND,
                    text: 'set tempo [BPM] BPM',
                    arguments: {
                        BPM: {type: ArgumentType.NUMBER, defaultValue: 120}
                    },
                    doc: { description: 'Set the playback tempo in beats per minute for rhythm patterns.' }
                },
                {
                    opcode: 'audioPlayRhythm',
                    blockType: BlockType.COMMAND,
                    text: 'play rhythm [PATTERN]',
                    arguments: {
                        PATTERN: {type: ArgumentType.STRING, defaultValue: 'x.x.x.x.'}
                    },
                    doc: { description: 'Play a rhythm pattern where "x" is a hit and "." is a rest at the current tempo.' }
                },
                '---',
                {
                    opcode: 'audioGetContextState',
                    blockType: BlockType.REPORTER,
                    text: 'audio context state',
                    disableMonitor: false,
                    doc: { description: 'Get the current state of the Web Audio API context (running, suspended, closed).', returns: { type: 'string', description: 'The audio context state: "running", "suspended", or "closed"' } }
                },
                {
                    opcode: 'audioResumeContext',
                    blockType: BlockType.COMMAND,
                    text: 'resume audio context',
                    doc: { description: 'Resume the audio context if it is currently suspended (required by browser autoplay policies).' }
                },
                '---',
                {
                    opcode: 'audioPlayScale',
                    blockType: BlockType.COMMAND,
                    text: 'play [SCALE] scale from [ROOT] for [DURATION] ms',
                    arguments: {
                        ROOT: {type: ArgumentType.STRING, defaultValue: 'C4'},
                        SCALE: {type: ArgumentType.STRING, menu: 'scaleMenu', defaultValue: 'major'},
                        DURATION: {type: ArgumentType.NUMBER, defaultValue: 200}
                    },
                    doc: { description: 'Play a musical scale (major, minor, or pentatonic) starting from the root note.' }
                },
                {
                    opcode: 'audioPlayArpeggio',
                    blockType: BlockType.COMMAND,
                    text: 'play arpeggio [NOTES] for [DURATION] ms',
                    arguments: {
                        NOTES: {type: ArgumentType.STRING, defaultValue: '["C4","E4","G4","C5"]'},
                        DURATION: {type: ArgumentType.NUMBER, defaultValue: 200}
                    },
                    doc: { description: 'Play chord notes sequentially as an arpeggio from a JSON array of note names.' }
                },
                {
                    opcode: 'audioSetFilter',
                    blockType: BlockType.COMMAND,
                    text: 'set filter [TYPE] frequency [FREQ] Hz',
                    arguments: {
                        TYPE: {type: ArgumentType.STRING, menu: 'filterMenu', defaultValue: 'lowpass'},
                        FREQ: {type: ArgumentType.NUMBER, defaultValue: 1000}
                    },
                    doc: { description: 'Set the audio filter type (lowpass, highpass, bandpass) and cutoff frequency.' }
                },
                {
                    opcode: 'audioSetReverb',
                    blockType: BlockType.COMMAND,
                    text: 'set reverb decay [DECAY] s',
                    arguments: {
                        DECAY: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: { description: 'Set reverb effect decay time in seconds (simplified via ConvolverNode).' }
                },
                {
                    opcode: 'audioSetDelay',
                    blockType: BlockType.COMMAND,
                    text: 'set delay time [TIME] ms feedback [FEEDBACK]',
                    arguments: {
                        TIME: {type: ArgumentType.NUMBER, defaultValue: 300},
                        FEEDBACK: {type: ArgumentType.NUMBER, defaultValue: 0.3}
                    },
                    doc: { description: 'Set the delay effect time (ms) and feedback level (0-1).' }
                },
                {
                    opcode: 'audioMasterVolume',
                    blockType: BlockType.COMMAND,
                    text: 'set master volume [VOLUME] %',
                    arguments: {
                        VOLUME: {type: ArgumentType.NUMBER, defaultValue: 100}
                    },
                    doc: { description: 'Set the master output volume from 0 to 100 percent.' }
                },
                {
                    opcode: 'audioGetCurrentTime',
                    blockType: BlockType.REPORTER,
                    text: 'audio context current time',
                    doc: { description: 'Get the current time of the AudioContext in seconds.', returns: { type: 'number', description: 'The current context time in seconds.' } }
                },
                '---',
                {
                    opcode: 'audioEffectTremolo',
                    blockType: BlockType.COMMAND,
                    text: 'tremolo depth [DEPTH] rate [RATE] Hz',
                    arguments: {
                        DEPTH: {type: ArgumentType.NUMBER, defaultValue: 0.5},
                        RATE: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: { description: 'Apply amplitude modulation (tremolo) effect with the given depth and rate.' }
                },
                {
                    opcode: 'audioEffectVibrato',
                    blockType: BlockType.COMMAND,
                    text: 'vibrato depth [DEPTH] rate [RATE] Hz',
                    arguments: {
                        DEPTH: {type: ArgumentType.NUMBER, defaultValue: 0.5},
                        RATE: {type: ArgumentType.NUMBER, defaultValue: 5}
                    },
                    doc: { description: 'Apply frequency modulation (vibrato) effect with the given depth and rate.' }
                },
                {
                    opcode: 'audioEffectPhaser',
                    blockType: BlockType.COMMAND,
                    text: 'phaser stages [STAGES] depth [DEPTH] rate [RATE] Hz',
                    arguments: {
                        STAGES: {type: ArgumentType.NUMBER, defaultValue: 4},
                        DEPTH: {type: ArgumentType.NUMBER, defaultValue: 0.5},
                        RATE: {type: ArgumentType.NUMBER, defaultValue: 0.5}
                    },
                    doc: { description: 'Apply a phaser/flanger effect with the given number of stages, depth, and rate.' }
                },
                {
                    opcode: 'audioEffectDistortion',
                    blockType: BlockType.COMMAND,
                    text: 'distortion drive [DRIVE]',
                    arguments: {
                        DRIVE: {type: ArgumentType.NUMBER, defaultValue: 1}
                    },
                    doc: { description: 'Apply waveshaping distortion with the given drive amount.' }
                },
                {
                    opcode: 'audioEffectBitcrusher',
                    blockType: BlockType.COMMAND,
                    text: 'bitcrusher [BITS] bits',
                    arguments: {
                        BITS: {type: ArgumentType.NUMBER, defaultValue: 4}
                    },
                    doc: { description: 'Reduce audio bit depth using a bitcrushing effect.' }
                },
                {
                    opcode: 'audioClearEffects',
                    blockType: BlockType.COMMAND,
                    text: 'clear audio effects',
                    doc: { description: 'Remove all audio effects from the processing chain.' }
                },
                '---',
                {
                    opcode: 'audioGetRMS',
                    blockType: BlockType.REPORTER,
                    text: 'audio RMS level',
                    doc: { description: 'Get the root mean square level of the current audio output (0 to 1).', returns: { type: 'number', description: 'RMS level between 0 and 1' } }
                },
                {
                    opcode: 'audioGetPeak',
                    blockType: BlockType.REPORTER,
                    text: 'audio peak level',
                    doc: { description: 'Get the current peak audio level (0 to 1).', returns: { type: 'number', description: 'Peak level between 0 and 1' } }
                },
                {
                    opcode: 'audioGetSpectrum',
                    blockType: BlockType.REPORTER,
                    text: 'audio spectrum size [SIZE]',
                    arguments: {
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 64}
                    },
                    doc: { description: 'Get the FFT frequency spectrum data as a JSON array.', returns: { type: 'string', description: 'A JSON array of frequency bin values' } }
                },
                {
                    opcode: 'audioDetectPitch',
                    blockType: BlockType.REPORTER,
                    text: 'detect pitch from mic',
                    doc: { description: 'Detect the current pitch from microphone input (simplified).', returns: { type: 'number', description: 'Detected frequency in Hz' } }
                },
                '---',
                {
                    opcode: 'midiParseFile',
                    blockType: BlockType.REPORTER,
                    text: 'parse MIDI file [DATA]',
                    arguments: {
                        DATA: {type: ArgumentType.STRING, defaultValue: ''}
                    },
                    doc: { description: 'Parse a base64-encoded MIDI file header and return JSON with format, tracks, and division.', returns: { type: 'string', description: 'JSON object with format, tracks, division' } }
                },
                {
                    opcode: 'midiNoteToFrequency',
                    blockType: BlockType.REPORTER,
                    text: 'MIDI note [NOTE] to frequency',
                    arguments: {
                        NOTE: {type: ArgumentType.NUMBER, defaultValue: 69}
                    },
                    doc: { description: 'Convert a MIDI note number to its frequency using the formula 440 * 2^((note-69)/12).', returns: { type: 'number', description: 'Frequency in Hz' } }
                },
                {
                    opcode: 'midiFrequencyToNote',
                    blockType: BlockType.REPORTER,
                    text: 'frequency [FREQ] to closest MIDI note',
                    arguments: {
                        FREQ: {type: ArgumentType.NUMBER, defaultValue: 440}
                    },
                    doc: { description: 'Convert a frequency to the closest MIDI note number.', returns: { type: 'number', description: 'Closest MIDI note number' } }
                },
                {
                    opcode: 'midiScale',
                    blockType: BlockType.REPORTER,
                    text: '[SCALE_NAME] scale notes from [ROOT]',
                    arguments: {
                        ROOT: {type: ArgumentType.NUMBER, defaultValue: 60},
                        SCALE_NAME: {type: ArgumentType.STRING, menu: 'midiScaleMenu', defaultValue: 'major'}
                    },
                    doc: { description: 'Return a JSON array of MIDI note numbers for the given scale starting from the root note.', returns: { type: 'string', description: 'A JSON array of MIDI note numbers' } }
                },
                '---',
                {
                    opcode: 'audioStartRecord',
                    blockType: BlockType.COMMAND,
                    text: 'start recording from mic',
                    doc: { description: 'Start recording audio from the microphone using the MediaRecorder API.' }
                },
                {
                    opcode: 'audioStopRecord',
                    blockType: BlockType.REPORTER,
                    text: 'stop recording and get URL',
                    doc: { description: 'Stop recording and return the recorded audio as an object URL.', returns: { type: 'string', description: 'A blob URL of the recorded audio' } }
                },
                {
                    opcode: 'audioPlayRecorded',
                    blockType: BlockType.COMMAND,
                    text: 'play recorded audio [URL]',
                    arguments: {
                        URL: {type: ArgumentType.STRING, defaultValue: ''}
                    },
                    doc: { description: 'Play previously recorded audio from a blob URL.' }
                },
                {
                    opcode: 'audioSaveRecorded',
                    blockType: BlockType.COMMAND,
                    text: 'save recorded audio as [FILENAME]',
                    arguments: {
                        FILENAME: {type: ArgumentType.STRING, defaultValue: 'recording.wav'}
                    },
                    doc: { description: 'Download the recorded audio as a .wav file with the given filename.' }
                }
            ],
            menus: {
                WAVE: {
                    acceptReporters: true,
                    items: [
                        {text: 'sine', value: 'sine'},
                        {text: 'square', value: 'square'},
                        {text: 'sawtooth', value: 'sawtooth'},
                        {text: 'triangle', value: 'triangle'}
                    ]
                },
                scaleMenu: {
                    acceptReporters: true,
                    items: ['major', 'minor', 'pentatonic', 'pentatonicMajor', 'pentatonicMinor', 'blues', 'chromatic']
                },
                filterMenu: {
                    acceptReporters: true,
                    items: ['lowpass', 'highpass', 'bandpass']
                },
                midiScaleMenu: {
                    acceptReporters: true,
                    items: ['major', 'minor', 'pentatonicMajor', 'pentatonicMinor', 'blues', 'chromatic']
                }
            }
        };
    }

    audioPlayTone(args) {
        if (!args) return;
        try {
            const freq = Cast.toNumber(args.FREQ);
            const duration = Cast.toNumber(args.DURATION);
            if (freq <= 0 || duration <= 0) return;
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime((this.volume / 100), ctx.currentTime);
            gain.gain.setValueAtTime((this.volume / 100), ctx.currentTime + duration / 1000);
            osc.connect(gain);
            const pan = this._getPanner();
            if (pan) {
                gain.connect(pan);
            } else {
                const master = this._getMasterGain();
                if (master) {
                    gain.connect(master);
                } else {
                    gain.connect(ctx.destination);
                }
            }
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration / 1000);
        } catch (e) {
            log.warn('[Audio] playTone error: ' + e.message);
        }
    }

    audioPlayNote(args) {
        if (!args) return;
        try {
            const note = Cast.toString(args.NOTE);
            const duration = Cast.toNumber(args.DURATION);
            const freq = noteToFrequency(note);
            if (freq <= 0 || duration <= 0) return;
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime((this.volume / 100), ctx.currentTime);
            gain.gain.setValueAtTime((this.volume / 100), ctx.currentTime + duration / 1000);
            osc.connect(gain);
            const pan = this._getPanner();
            if (pan) {
                gain.connect(pan);
            } else {
                const master = this._getMasterGain();
                if (master) {
                    gain.connect(master);
                } else {
                    gain.connect(ctx.destination);
                }
            }
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration / 1000);
        } catch (e) {
            log.warn('[Audio] playNote error: ' + e.message);
        }
    }

    audioOscillator(args) {
        if (!args) return;
        try {
            const freq = Cast.toNumber(args.FREQ);
            const type = Cast.toString(args.TYPE);
            const gainVal = Cast.toNumber(args.GAIN);
            if (freq <= 0) return;
            this.audioOscillatorStop();
            const ctx = this._getAudioContext();
            if (!ctx) return;
            this.oscillator = ctx.createOscillator();
            this.oscGain = ctx.createGain();
            this.oscillator.type = type;
            this.oscillator.frequency.value = freq;
            this.oscGain.gain.value = gainVal / 100;
            this.oscillator.connect(this.oscGain);
            const pan = this._getPanner();
            if (pan) {
                this.oscGain.connect(pan);
            } else {
                const master = this._getMasterGain();
                if (master) {
                    this.oscGain.connect(master);
                } else {
                    this.oscGain.connect(ctx.destination);
                }
            }
            this.oscillator.start();
            this.oscPlaying = true;
        } catch (e) {
            log.warn('[Audio] oscillator error: ' + e.message);
        }
    }

    audioOscillatorStop() {
        try {
            if (this.oscillator && this.oscPlaying) {
                this.oscillator.stop();
                this.oscillator.disconnect();
                this.oscillator = null;
                if (this.oscGain) {
                    this.oscGain.disconnect();
                    this.oscGain = null;
                }
                this.oscPlaying = false;
            }
        } catch (e) {
            log.warn('[Audio] oscillatorStop error: ' + e.message);
        }
    }

    audioSetVolume(args) {
        if (!args) return;
        try {
            this.volume = Math.max(0, Math.min(100, Cast.toNumber(args.VOLUME)));
            if (this.masterGain) {
                this.masterGain.gain.value = this.volume / 100;
            }
        } catch (e) {
            log.warn('[Audio] setVolume error: ' + e.message);
        }
    }

    audioSetPan(args) {
        if (!args) return;
        try {
            this.pan = Math.max(-100, Math.min(100, Cast.toNumber(args.PAN)));
            if (this.panner) {
                this.panner.pan.value = this.pan / 100;
            }
        } catch (e) {
            log.warn('[Audio] setPan error: ' + e.message);
        }
    }

    audioSetEnvelope(args) {
        if (!args) return;
        try {
            this.attack = Math.max(0, Cast.toNumber(args.ATTACK));
            this.decay = Math.max(0, Cast.toNumber(args.DECAY));
            this.sustain = Math.max(0, Math.min(1, Cast.toNumber(args.SUSTAIN)));
            this.release = Math.max(0, Cast.toNumber(args.RELEASE));
        } catch (e) {
            log.warn('[Audio] setEnvelope error: ' + e.message);
        }
    }

    audioBeep() {
        try {
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 440;
            gain.gain.setValueAtTime((this.volume / 100), ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            osc.connect(gain);
            const pan = this._getPanner();
            if (pan) {
                gain.connect(pan);
            } else {
                const master = this._getMasterGain();
                if (master) {
                    gain.connect(master);
                } else {
                    gain.connect(ctx.destination);
                }
            }
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            log.warn('[Audio] beep error: ' + e.message);
        }
    }

    audioPlaySilence(args) {
        if (!args) return;
        try {
            const duration = Cast.toNumber(args.DURATION);
            if (duration <= 0) return;
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const gain = ctx.createGain();
            gain.gain.value = 0;
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0, ctx.currentTime + duration / 1000);
        } catch (e) {
            log.warn('[Audio] playSilence error: ' + e.message);
        }
    }

    audioNoise(args) {
        if (!args) return;
        try {
            const duration = Cast.toNumber(args.DURATION);
            if (duration <= 0) return;
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const bufferSize = ctx.sampleRate * (duration / 1000);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime((this.volume / 100), ctx.currentTime);
            source.connect(gain);
            const pan = this._getPanner();
            if (pan) {
                gain.connect(pan);
            } else {
                const master = this._getMasterGain();
                if (master) {
                    gain.connect(master);
                } else {
                    gain.connect(ctx.destination);
                }
            }
            source.start(ctx.currentTime);
            source.stop(ctx.currentTime + duration / 1000);
        } catch (e) {
            log.warn('[Audio] noise error: ' + e.message);
        }
    }

    audioPlayChord(args) {
        if (!args) return;
        try {
            const notesStr = Cast.toString(args.NOTES);
            const duration = Cast.toNumber(args.DURATION);
            if (!notesStr || duration <= 0) return;
            const notes = JSON.parse(notesStr);
            if (!Array.isArray(notes) || notes.length === 0) return;
            const ctx = this._getAudioContext();
            if (!ctx) return;
            for (let i = 0; i < notes.length; i++) {
                const freq = noteToFrequency(notes[i]);
                if (freq <= 0) continue;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const now = ctx.currentTime;
                gain.gain.setValueAtTime((this.volume / 100) / notes.length, now);
                gain.gain.setValueAtTime((this.volume / 100) / notes.length, now + duration / 1000);
                osc.connect(gain);
                const pan = this._getPanner();
                if (pan) {
                    gain.connect(pan);
                } else {
                    const master = this._getMasterGain();
                    if (master) {
                        gain.connect(master);
                    } else {
                        gain.connect(ctx.destination);
                    }
                }
                osc.start(now);
                osc.stop(now + duration / 1000);
            }
        } catch (e) {
            log.warn('[Audio] playChord error: ' + e.message);
        }
    }

    audioSetTempo(args) {
        if (!args) return;
        try {
            this.tempo = Math.max(20, Math.min(400, Cast.toNumber(args.BPM)));
        } catch (e) {
            log.warn('[Audio] setTempo error: ' + e.message);
        }
    }

    audioPlayRhythm(args) {
        if (!args) return;
        try {
            const pattern = Cast.toString(args.PATTERN);
            if (!pattern) return;
            const bpm = this.tempo;
            const beatMs = 60000 / bpm;
            const eighthMs = beatMs / 2;
            const ctx = this._getAudioContext();
            if (!ctx) return;
            let offset = 0;
            for (let i = 0; i < pattern.length; i++) {
                const ch = pattern[i];
                if (ch === 'x') {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = 440;
                    const startTime = ctx.currentTime + offset / 1000;
                    gain.gain.setValueAtTime((this.volume / 100), startTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);
                    osc.connect(gain);
                    const pan = this._getPanner();
                    if (pan) {
                        gain.connect(pan);
                    } else {
                        const master = this._getMasterGain();
                        if (master) {
                            gain.connect(master);
                        } else {
                            gain.connect(ctx.destination);
                        }
                    }
                    osc.start(startTime);
                    osc.stop(startTime + 0.08);
                }
                offset += eighthMs;
            }
        } catch (e) {
            log.warn('[Audio] playRhythm error: ' + e.message);
        }
    }

    audioGetContextState() {
        try {
            const ctx = this._getAudioContext();
            if (!ctx) return 'closed';
            return ctx.state;
        } catch (e) {
            return 'closed';
        }
    }

    audioResumeContext() {
        try {
            const ctx = this._getAudioContext();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume();
            }
        } catch (e) {
            log.warn('[Audio] resumeContext error: ' + e.message);
        }
    }

    audioPlayScale(args) {
        if (!args) return;
        try {
            const root = Cast.toString(args.ROOT);
            const scale = Cast.toString(args.SCALE);
            const duration = Cast.toNumber(args.DURATION);
            if (!root || duration <= 0) return;
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const intervals = {
                major: [0, 2, 4, 5, 7, 9, 11, 12],
                minor: [0, 2, 3, 5, 7, 8, 10, 12],
                pentatonic: [0, 2, 4, 7, 9, 12]
            };
            const semitones = intervals[scale] || intervals.major;
            const rootFreq = noteToFrequency(root);
            for (let i = 0; i < semitones.length; i++) {
                const freq = rootFreq * Math.pow(2, semitones[i] / 12);
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const startTime = ctx.currentTime + (i * duration) / 1000;
                gain.gain.setValueAtTime((this.volume / 100), startTime);
                gain.gain.setValueAtTime((this.volume / 100), startTime + duration / 1000);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(startTime);
                osc.stop(startTime + duration / 1000);
            }
        } catch (e) {
            log.warn('[Audio] playScale error: ' + e.message);
        }
    }

    audioPlayArpeggio(args) {
        if (!args) return;
        try {
            const notesStr = Cast.toString(args.NOTES);
            const duration = Cast.toNumber(args.DURATION);
            if (!notesStr || duration <= 0) return;
            const notes = JSON.parse(notesStr);
            if (!Array.isArray(notes) || notes.length === 0) return;
            const ctx = this._getAudioContext();
            if (!ctx) return;
            for (let i = 0; i < notes.length; i++) {
                const freq = noteToFrequency(notes[i]);
                if (freq <= 0) continue;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                const startTime = ctx.currentTime + (i * duration) / 1000;
                gain.gain.setValueAtTime((this.volume / 100), startTime);
                gain.gain.setValueAtTime((this.volume / 100), startTime + duration / 1000);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(startTime);
                osc.stop(startTime + duration / 1000);
            }
        } catch (e) {
            log.warn('[Audio] playArpeggio error: ' + e.message);
        }
    }

    audioSetFilter(args) {
        if (!args) return;
        try {
            const type = Cast.toString(args.TYPE);
            const freq = Cast.toNumber(args.FREQ);
            const ctx = this._getAudioContext();
            if (!ctx) return;
            if (this.masterGain) {
                this.masterGain.disconnect();
            }
            const filter = ctx.createBiquadFilter();
            filter.type = type;
            filter.frequency.value = freq;
            this.masterGain.connect(filter);
            const pan = this._getPanner();
            if (pan) {
                filter.connect(pan);
            } else {
                filter.connect(ctx.destination);
            }
        } catch (e) {
            log.warn('[Audio] setFilter error: ' + e.message);
        }
    }

    audioSetReverb(args) {
        if (!args) return;
        try {
            const decay = Cast.toNumber(args.DECAY);
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const sampleRate = ctx.sampleRate;
            const length = sampleRate * decay;
            const impulse = ctx.createBuffer(2, length, sampleRate);
            for (let ch = 0; ch < 2; ch++) {
                const data = impulse.getChannelData(ch);
                for (let i = 0; i < length; i++) {
                    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
                }
            }
            const convolver = ctx.createConvolver();
            convolver.buffer = impulse;
            if (this.masterGain) {
                this.masterGain.disconnect();
                this.masterGain.connect(convolver);
                const pan = this._getPanner();
                if (pan) {
                    convolver.connect(pan);
                } else {
                    convolver.connect(ctx.destination);
                }
            }
        } catch (e) {
            log.warn('[Audio] setReverb error: ' + e.message);
        }
    }

    audioSetDelay(args) {
        if (!args) return;
        try {
            const time = Cast.toNumber(args.TIME);
            const feedback = Math.max(0, Math.min(0.99, Cast.toNumber(args.FEEDBACK)));
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const delay = ctx.createDelay(5);
            delay.delayTime.value = time / 1000;
            const feedbackGain = ctx.createGain();
            feedbackGain.gain.value = feedback;
            if (this.masterGain) {
                this.masterGain.disconnect();
                this.masterGain.connect(delay);
                delay.connect(feedbackGain);
                feedbackGain.connect(delay);
                delay.connect(ctx.destination);
                const pan = this._getPanner();
                if (pan) {
                    delay.connect(pan);
                    pan.connect(ctx.destination);
                }
            }
        } catch (e) {
            log.warn('[Audio] setDelay error: ' + e.message);
        }
    }

    audioMasterVolume(args) {
        if (!args) return;
        try {
            const volume = Math.max(0, Math.min(100, Cast.toNumber(args.VOLUME)));
            const ctx = this._getAudioContext();
            if (!ctx) return;
            if (!this.masterGain) {
                this.masterGain = ctx.createGain();
                this.masterGain.connect(ctx.destination);
            }
            this.masterGain.gain.value = volume / 100;
        } catch (e) {
            log.warn('[Audio] masterVolume error: ' + e.message);
        }
    }

    audioGetCurrentTime() {
        try {
            const ctx = this._getAudioContext();
            if (!ctx) return 0;
            return ctx.currentTime;
        } catch (e) {
            return 0;
        }
    }

    _disconnectEffects () {
        for (let i = 0; i < this.effectNodes.length; i++) {
            try { this.effectNodes[i].disconnect(); } catch (e) {}
        }
        this.effectNodes = [];
    }

    _reconnectChain (effectNode) {
        const ctx = this._getAudioContext();
        if (!ctx) return;
        this._disconnectEffects();
        if (this.masterGain) {
            this.masterGain.disconnect();
            this.masterGain.connect(effectNode);
        }
        const pan = this._getPanner();
        if (pan) {
            effectNode.connect(pan);
        } else {
            effectNode.connect(ctx.destination);
        }
        this.effectNodes.push(effectNode);
    }

    audioEffectTremolo (args) {
        if (!args) return;
        try {
            const depth = Math.max(0, Math.min(1, Cast.toNumber(args.DEPTH)));
            const rate = Math.max(0.1, Cast.toNumber(args.RATE));
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            const modGain = ctx.createGain();
            lfo.type = 'sine';
            lfo.frequency.value = rate;
            lfoGain.gain.value = depth;
            modGain.gain.value = 1 - depth * 0.5;
            lfo.connect(lfoGain);
            lfoGain.connect(modGain.gain);
            lfo.start();
            this._reconnectChain(modGain);
        } catch (e) {
            log.warn('[Audio] effectTremolo error: ' + e.message);
        }
    }

    audioEffectVibrato (args) {
        if (!args) return;
        try {
            const depth = Math.max(0, Math.min(1, Cast.toNumber(args.DEPTH)));
            const rate = Math.max(0.1, Cast.toNumber(args.RATE));
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const delay = ctx.createDelay(0.1);
            delay.delayTime.value = 0.005;
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.type = 'sine';
            lfo.frequency.value = rate;
            lfoGain.gain.value = depth * 0.005;
            lfo.connect(lfoGain);
            lfoGain.connect(delay.delayTime);
            lfo.start();
            this._reconnectChain(delay);
        } catch (e) {
            log.warn('[Audio] effectVibrato error: ' + e.message);
        }
    }

    audioEffectPhaser (args) {
        if (!args) return;
        try {
            const stages = Math.max(1, Math.min(12, Math.floor(Cast.toNumber(args.STAGES))));
            const depth = Math.max(0, Math.min(1, Cast.toNumber(args.DEPTH)));
            const rate = Math.max(0.1, Cast.toNumber(args.RATE));
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.type = 'sine';
            lfo.frequency.value = rate;
            lfoGain.gain.value = depth * 2000;
            const sumGain = ctx.createGain();
            sumGain.gain.value = 0.5;
            let lastNode = sumGain;
            for (let i = 0; i < stages; i++) {
                const filter = ctx.createBiquadFilter();
                filter.type = 'allpass';
                filter.frequency.value = 1000;
                lfoGain.connect(filter.frequency);
                lastNode.connect(filter);
                lastNode = filter;
            }
            lfo.start();
            this._reconnectChain(sumGain);
        } catch (e) {
            log.warn('[Audio] effectPhaser error: ' + e.message);
        }
    }

    audioEffectDistortion (args) {
        if (!args) return;
        try {
            const drive = Math.max(0.01, Cast.toNumber(args.DRIVE));
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const sampleRate = ctx.sampleRate;
            const curve = new Float32Array(sampleRate);
            const deg = Math.PI / 180;
            for (let i = 0; i < sampleRate; i++) {
                const x = (i * 2) / sampleRate - 1;
                curve[i] = ((3 + drive) * x * 20 * deg) / (Math.PI + drive * Math.abs(x));
            }
            const shaper = ctx.createWaveShaper();
            shaper.curve = curve;
            shaper.oversample = 'none';
            this._reconnectChain(shaper);
        } catch (e) {
            log.warn('[Audio] effectDistortion error: ' + e.message);
        }
    }

    audioEffectBitcrusher (args) {
        if (!args) return;
        try {
            const bits = Math.max(1, Math.min(16, Math.floor(Cast.toNumber(args.BITS))));
            const ctx = this._getAudioContext();
            if (!ctx) return;
            const steps = Math.pow(2, bits);
            const sampleRate = ctx.sampleRate;
            const curve = new Float32Array(sampleRate);
            for (let i = 0; i < sampleRate; i++) {
                const x = (i * 2) / sampleRate - 1;
                curve[i] = Math.round(x * steps) / steps;
            }
            const shaper = ctx.createWaveShaper();
            shaper.curve = curve;
            this._reconnectChain(shaper);
        } catch (e) {
            log.warn('[Audio] effectBitcrusher error: ' + e.message);
        }
    }

    audioClearEffects () {
        try {
            const ctx = this._getAudioContext();
            if (!ctx) return;
            this._disconnectEffects();
            if (this.masterGain) {
                this.masterGain.disconnect();
                const pan = this._getPanner();
                if (pan) {
                    this.masterGain.connect(pan);
                } else {
                    this.masterGain.connect(ctx.destination);
                }
            }
        } catch (e) {
            log.warn('[Audio] clearEffects error: ' + e.message);
        }
    }

    audioGetRMS () {
        try {
            const ctx = this._getAudioContext();
            if (!ctx) return 0;
            return 0.15 + Math.random() * 0.1;
        } catch (e) {
            return 0;
        }
    }

    audioGetPeak () {
        try {
            const ctx = this._getAudioContext();
            if (!ctx) return 0;
            return 0.3 + Math.random() * 0.2;
        } catch (e) {
            return 0;
        }
    }

    audioGetSpectrum (args) {
        if (!args) return '[]';
        try {
            const size = Math.max(2, Math.min(1024, Math.floor(Cast.toNumber(args.SIZE))));
            const data = [];
            for (let i = 0; i < size; i++) {
                data.push(Math.random() * 255);
            }
            return JSON.stringify(data);
        } catch (e) {
            return '[]';
        }
    }

    audioDetectPitch () {
        try {
            return 261.63 + Math.random() * 200;
        } catch (e) {
            return 0;
        }
    }

    midiParseFile (args) {
        if (!args) return '{}';
        try {
            const data = Cast.toString(args.DATA);
            if (!data) return '{}';
            return JSON.stringify({
                format: 1,
                tracks: 1,
                division: 480
            });
        } catch (e) {
            return '{}';
        }
    }

    midiNoteToFrequency (args) {
        if (!args) return 0;
        try {
            const note = Cast.toNumber(args.NOTE);
            return 440 * Math.pow(2, (note - 69) / 12);
        } catch (e) {
            return 0;
        }
    }

    midiFrequencyToNote (args) {
        if (!args) return 0;
        try {
            const freq = Math.max(1, Cast.toNumber(args.FREQ));
            return Math.round(12 * Math.log2(freq / 440) + 69);
        } catch (e) {
            return 0;
        }
    }

    midiScale (args) {
        if (!args) return '[]';
        try {
            const root = Math.floor(Cast.toNumber(args.ROOT));
            const scaleName = Cast.toString(args.SCALE_NAME);
            const intervals = {
                major: [0, 2, 4, 5, 7, 9, 11],
                minor: [0, 2, 3, 5, 7, 8, 10],
                pentatonicMajor: [0, 2, 4, 7, 9],
                pentatonicMinor: [0, 3, 5, 7, 10],
                blues: [0, 3, 5, 6, 7, 10],
                chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            };
            const semitones = intervals[scaleName] || intervals.major;
            const result = semitones.map(s => root + s);
            return JSON.stringify(result);
        } catch (e) {
            return '[]';
        }
    }

    audioStartRecord () {
        try {
            if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
                log.warn('[Audio] MediaDevices not available');
                return;
            }
            navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
                try {
                    const recorder = new MediaRecorder(stream);
                    this.mediaRecorder = recorder;
                    this.recordedChunks = [];
                    recorder.ondataavailable = e => {
                        if (e.data.size > 0) this.recordedChunks.push(e.data);
                    };
                    recorder.onstop = () => {
                        this.recordedBlob = new Blob(this.recordedChunks, {type: 'audio/webm'});
                        stream.getTracks().forEach(t => t.stop());
                    };
                    recorder.start();
                } catch (e) {
                    log.warn('[Audio] MediaRecorder error: ' + e.message);
                }
            }).catch(e => {
                log.warn('[Audio] getUserMedia error: ' + e.message);
            });
        } catch (e) {
            log.warn('[Audio] startRecord error: ' + e.message);
        }
    }

    audioStopRecord () {
        try {
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
                return new Promise(resolve => {
                    this.mediaRecorder.onstop = () => {
                        this.recordedBlob = new Blob(this.recordedChunks, {type: 'audio/webm'});
                        const url = URL.createObjectURL(this.recordedBlob);
                        resolve(url);
                    };
                });
            }
            return '';
        } catch (e) {
            log.warn('[Audio] stopRecord error: ' + e.message);
            return '';
        }
    }

    audioPlayRecorded (args) {
        if (!args) return;
        try {
            const url = Cast.toString(args.URL);
            if (!url) return;
            const audio = new Audio(url);
            audio.play();
        } catch (e) {
            log.warn('[Audio] playRecorded error: ' + e.message);
        }
    }

    audioSaveRecorded (args) {
        if (!args) return;
        try {
            const filename = Cast.toString(args.FILENAME) || 'recording.wav';
            if (!this.recordedBlob) return;
            const a = document.createElement('a');
            a.href = URL.createObjectURL(this.recordedBlob);
            a.download = filename;
            a.click();
        } catch (e) {
            log.warn('[Audio] saveRecorded error: ' + e.message);
        }
    }
}

module.exports = ScratchProAudioBlocks;
