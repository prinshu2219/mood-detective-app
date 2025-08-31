# Content Package

This package contains all the content and assets for the Mood Detective application.

## Structure

### Text Content (`src/strings.en.json`)

- **Welcome**: Landing page content and call-to-action
- **Characters**: Character profiles and dialogue for Luna, Tom, Maya, and Rex
- **Story**: Educational narrative broken into intro, how-it-works, and challenge sections
- **Sentences**: 40 example sentences (10 each for happy, sad, angry, neutral moods)
- **Game**: Game instructions, scoring, and feedback messages
- **MLPeek**: Machine learning comparison page content
- **Certificate**: Certificate generation content and formatting
- **UI**: Common UI strings and labels

### Emojis (`src/emojis.ts`)

- **Mood Emojis**: Primary and variant emojis for each emotion category
- **Character Emojis**: Emoji representations of each character
- **Game Emojis**: Icons for scoring, feedback, and navigation
- **Background Emojis**: Decorative elements for UI enhancement

### Assets (`../frontend/public/assets/`)

- **Characters**: SVG illustrations of Luna, Tom, Maya, and Rex
- **Backgrounds**: Decorative cloud backgrounds and shapes
- **Icons**: Mood basket icons for drag-and-drop game

## Usage

```typescript
import { strings, getContent, formatString, getMoodEmoji } from 'content';

// Get specific content
const welcomeTitle = strings.welcome.title;
const lunaDialogue = strings.characters.luna.dialogue[0];

// Get nested content with helper
const gameInstructions = getContent('game.instructions');

// Format strings with placeholders
const roundText = formatString(strings.game.round, { number: 1, total: 5 });

// Get mood emoji
const happyEmoji = getMoodEmoji('HAPPY');
```

## Content Guidelines

- **Kid-Friendly**: All content is written for 6th-grade reading level
- **Educational**: Focus on teaching sentiment analysis concepts
- **Engaging**: Use friendly, encouraging language throughout
- **Accessible**: Clear, simple instructions and feedback
- **Consistent**: Maintain character personalities and tone

## Character Profiles

- **Luna**: Main AI guide, detective theme, encouraging and knowledgeable
- **Tom**: Happy helper, enthusiastic about positive emotions
- **Maya**: Thoughtful friend, helps with neutral emotions and critical thinking
- **Rex**: Emotion explorer, handles sad and angry emotions with care
