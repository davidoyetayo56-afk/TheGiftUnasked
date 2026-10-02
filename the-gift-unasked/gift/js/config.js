/* ===========================================================
   THE GIFT UNASKED — easy configuration
   Edit filenames here. Put image files in /assets/images/
   =========================================================== */
window.GU = window.GU || {};
GU.config = {
  imageDir: 'assets/images/',

  // The eight visuals, in story order. Rename freely.
  images: [
    'scene-01.jpg', 'scene-02.jpg', 'scene-03.jpg', 'scene-04.jpg',
    'scene-05.jpg', 'scene-06.jpg', 'scene-07.jpg', 'scene-08.jpg'
  ],

  // Which of the eight images (1–8) sits behind each of the 12 chapters.
  chapterImage: [1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 8],

  // Optional audio in /assets/audio/. Missing files are fine:
  // a quiet synthesised room tone is used instead.
  audioDir: 'assets/audio/',
  ambient: [
    { file: 'ambient-wind.mp3', volume: 0.16 },
    { file: 'ambient-room.mp3', volume: 0.10 },
    { file: 'ambient-low.mp3',  volume: 0.08 }
  ],
  pageTurn: { file: 'page-turn.mp3', volume: 0.25 },

  // Narration character profiles (browser voices vary; these tune them).
  voices: {
    poet: { rate: 0.88, pitch: 0.85, volume: 1 },
    theo: { rate: 0.90, pitch: 0.98, volume: 1 }
  },
  // Voice-name hints, tried in order. Add names from your own browser here.
  voiceHints: {
    poet: ['Daniel', 'Google UK English Male', 'Alex', 'Fred', 'Arthur', 'Oliver', 'Guy', 'Ryan'],
    theo: ['Oliver', 'George', 'Thomas', 'Ryan', 'Aaron', 'Alex', 'Daniel', 'James', 'Mark']
  },

  shareText: 'Why did You make me at all? A philosophical dialogue between dust and doctrine.'
};
