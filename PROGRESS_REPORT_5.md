# Progress Report 5: Speech Features Implementation

**Date:** February 2, 2026  
**Duration:** Week 5  
**Status:** ✅ Completed  

---

## 🎯 Objective
Implement speech-to-text (voice input) and text-to-speech (audio output) features to make the translator more accessible and interactive.

## 📋 Tasks Completed

### 1. Speech-to-Text (Voice Input) Implementation

#### Frontend Integration - Web Speech API
- **What We Did:**
  - Integrated browser's native Web Speech API
  - Added microphone button to input area
  - Implemented real-time speech recognition
  - No external libraries needed for frontend

- **Implementation:**
  ```typescript
  // Speech Recognition Setup
  const recognition = new (window as any).webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = sourceLang; // Dynamic based on selected language

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    setInputText(transcript);
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error:', event.error);
    setError('Speech recognition failed. Please try again.');
  };
  ```

#### Microphone Button UI
- **Features:**
  - Icon changes when recording (red dot animation)
  - Tooltip showing "Click to speak"
  - Visual feedback during recording
  - Disabled state when not available

- **Browser Compatibility Check:**
  ```typescript
  const isSpeechRecognitionAvailable = () => {
    return 'webkitSpeechRecognition' in window || 
           'SpeechRecognition' in window;
  };
  ```

#### Language-Specific Recognition
- **Challenge:** Different languages need different recognition settings
- **Solution:** Dynamically set recognition language
  ```typescript
  const startRecording = () => {
    recognition.lang = getLanguageCode(sourceLang); // e.g., 'hi-IN', 'en-US'
    recognition.start();
  };
  ```

- **Language Code Mapping:**
  ```typescript
  const SPEECH_LANG_CODES = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'bn': 'bn-IN',
    'te': 'te-IN',
    'mr': 'mr-IN',
    'ta': 'ta-IN',
    // ... other languages
  };
  ```

### 2. Text-to-Speech (Audio Output) Implementation

#### Backend TTS Service
- **Technology:** gTTS (Google Text-to-Speech)
- **Implementation:**
  ```python
  from gtts import gTTS
  import io
  from flask import send_file

  @app.route('/api/tts', methods=['POST'])
  def text_to_speech():
      data = request.json
      text = data.get('text')
      lang = data.get('lang', 'en')
      
      # Generate speech
      tts = gTTS(text=text, lang=lang, slow=False)
      
      # Create audio buffer
      audio_buffer = io.BytesIO()
      tts.write_to_fp(audio_buffer)
      audio_buffer.seek(0)
      
      # Return audio file
      return send_file(
          audio_buffer,
          mimetype='audio/mp3',
          as_attachment=False
      )
  ```

#### Frontend TTS Integration
- **Features:**
  - Speaker icon button on output area
  - Play audio directly in browser
  - Optional download button
  - Loading state during audio generation

- **Implementation:**
  ```typescript
  const playAudio = async () => {
    setLoadingTTS(true);
    try {
      const response = await fetch('http://localhost:5002/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: outputText,
          lang: targetLang
        })
      });
      
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      setError('Text-to-speech failed');
    } finally {
      setLoadingTTS(false);
    }
  };
  ```

#### Multi-Language TTS Support
- **Supported Languages:** All 18 languages
- **Natural Pronunciation:** gTTS provides native pronunciation for each language
- **Voice Quality:** Clear and understandable for educational purposes

### 3. User Interface Enhancements

#### Voice Input Button
- **Design:**
  ```tsx
  <button 
    className="voice-button"
    onClick={startRecording}
    disabled={!isSpeechAvailable || isRecording}
  >
    {isRecording ? (
      <MicIcon className="recording-animation" />
    ) : (
      <MicIcon />
    )}
  </button>
  ```

- **CSS Animation:**
  ```css
  .recording-animation {
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  ```

#### Speaker Button
- **Design:**
  ```tsx
  <button 
    className="speaker-button"
    onClick={playAudio}
    disabled={!outputText || loadingTTS}
  >
    {loadingTTS ? (
      <LoadingSpinner />
    ) : (
      <SpeakerIcon />
    )}
  </button>
  ```

#### Visual Feedback
- **Recording Indicator:**
  - Red dot animation
  - "Listening..." text
  - Waveform animation (optional)

- **Audio Playing Indicator:**
  - Speaker icon animation
  - "Playing..." text
  - Progress bar (optional)

### 4. Error Handling

#### Speech Recognition Errors
- **No Microphone Permission:**
  ```typescript
  if (event.error === 'not-allowed') {
    setError('Microphone access denied. Please enable microphone permissions.');
  }
  ```

- **No Speech Detected:**
  ```typescript
  if (event.error === 'no-speech') {
    setError('No speech detected. Please try again.');
  }
  ```

- **Network Error:**
  ```typescript
  if (event.error === 'network') {
    setError('Network error. Please check your internet connection.');
  }
  ```

#### TTS Errors
- **Text Too Long:**
  ```python
  if len(text) > 5000:
      return jsonify({
          'error': 'Text too long for TTS (max 5000 characters)'
      }), 400
  ```

- **Unsupported Language:**
  ```python
  if lang not in SUPPORTED_TTS_LANGUAGES:
      return jsonify({
          'error': f'Language {lang} not supported for TTS'
      }), 400
  ```

### 5. Performance Optimizations

#### Audio Caching
- **Problem:** Same text generates audio repeatedly
- **Solution:** Cache generated audio files
  ```python
  import hashlib
  from werkzeug.contrib.cache import SimpleCache

  cache = SimpleCache()

  def get_tts_audio(text, lang):
      # Generate cache key
      cache_key = hashlib.md5(f"{text}_{lang}".encode()).hexdigest()
      
      # Check cache
      cached_audio = cache.get(cache_key)
      if cached_audio:
          return cached_audio
      
      # Generate audio
      tts = gTTS(text=text, lang=lang)
      audio_buffer = io.BytesIO()
      tts.write_to_fp(audio_buffer)
      audio_buffer.seek(0)
      
      # Cache for 1 hour
      cache.set(cache_key, audio_buffer.getvalue(), timeout=3600)
      
      return audio_buffer
  ```

#### Lazy Loading
- **Web Speech API:** Only initialize when user clicks microphone button
- **Audio Element:** Create on-demand, not on page load

### 6. Accessibility Features

#### Keyboard Support
- **Shortcuts Added:**
  - `Ctrl+M`: Start/stop voice recording
  - `Ctrl+P`: Play audio output
  - `Space`: Stop recording (when recording)

#### Screen Reader Support
- **ARIA Labels:**
  ```tsx
  <button
    aria-label="Start voice input"
    aria-pressed={isRecording}
  >
    <MicIcon />
  </button>
  ```

#### Visual Indicators
- **Color-blind Friendly:**
  - Not just red/green for recording state
  - Icon changes in addition to color
  - Text labels alongside icons

## 🛠️ Technologies Used

| Technology | Version | Purpose | Where Used |
|-----------|---------|---------|------------|
| Web Speech API | Native | Speech-to-text | Frontend voice input |
| gTTS | 2.5.0 | Text-to-speech | Backend audio generation |
| Audio API | Native | Audio playback | Frontend audio player |
| Blob API | Native | Audio file handling | Frontend audio management |
| URL.createObjectURL | Native | Audio URL creation | Frontend audio playback |

## 🎯 Where We Used What

1. **Web Speech API** - Used for:
   - Capturing voice input
   - Converting speech to text
   - Language-specific recognition
   - Real-time transcription

2. **gTTS** - Used for:
   - Converting text to natural speech
   - Supporting 18 languages
   - Generating MP3 audio files
   - Providing pronunciation guide

3. **Browser Audio API** - Used for:
   - Playing generated audio
   - Controlling playback
   - Audio element management

4. **Blob/File API** - Used for:
   - Handling audio binary data
   - Creating downloadable audio
   - Memory management

## 💡 Challenges Faced

### Challenge 1: Browser Compatibility for Speech Recognition
- **Problem:** Web Speech API only available in Chrome/Edge, not Firefox/Safari
- **Solution:** 
  - Detect browser support
  - Show/hide microphone button based on availability
  - Provide fallback message
- **Code:**
  ```typescript
  if (!('webkitSpeechRecognition' in window)) {
    setMicrophoneAvailable(false);
    console.log('Speech recognition not supported in this browser');
  }
  ```
- **Lesson Learned:** Always check browser compatibility for modern APIs

### Challenge 2: Microphone Permission Handling
- **Problem:** Users need to grant microphone permission
- **Solution:** 
  - Clear permission request message
  - Handle permission denied gracefully
  - Provide instructions to enable permissions
- **Implementation:**
  ```typescript
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(() => {
      // Permission granted
      startRecognition();
    })
    .catch((error) => {
      setError('Microphone access is required for voice input');
    });
  ```
- **Lesson Learned:** User permissions require clear UI communication

### Challenge 3: gTTS Rate Limiting
- **Problem:** Too many TTS requests caused temporary blocks
- **Solution:** 
  - Implemented caching
  - Added rate limiting on backend
  - Debounce TTS requests
- **Code:**
  ```python
  from flask_limiter import Limiter

  limiter = Limiter(app, key_func=get_remote_address)

  @app.route('/api/tts', methods=['POST'])
  @limiter.limit("10 per minute")
  def text_to_speech():
      # TTS logic
  ```
- **Lesson Learned:** External services need rate limiting protection

### Challenge 4: Audio Playback Issues on Mobile
- **Problem:** Audio autoplay blocked on mobile browsers
- **Solution:** 
  - Require user interaction (button click)
  - Show "tap to play" message
  - Use native audio controls on mobile
- **Implementation:**
  ```typescript
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Use native audio element with controls
    audio.controls = true;
  }
  ```
- **Lesson Learned:** Mobile browsers have stricter autoplay policies

### Challenge 5: Language Code Mismatches
- **Problem:** Web Speech API uses different codes than gTTS (e.g., 'hi-IN' vs 'hi')
- **Solution:** Created mapping between systems
- **Code:**
  ```typescript
  const WEB_SPEECH_TO_GTTS = {
    'hi-IN': 'hi',
    'en-US': 'en',
    'bn-IN': 'bn',
    // ... mappings
  };
  ```
- **Lesson Learned:** API integration requires careful code mapping

### Challenge 6: Real-time Transcription Display
- **Problem:** Should we show interim results or final only?
- **Solution:** 
  - Show interim results in gray
  - Update to black when final
  - Provides better UX with immediate feedback
- **Implementation:**
  ```typescript
  recognition.onresult = (event) => {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    const isFinal = event.results[current].isFinal;
    
    setInputText(transcript);
    setIsInterim(!isFinal);
  };
  ```
- **Lesson Learned:** Interim results improve perceived responsiveness

## 📊 Deliverables

✅ Speech-to-text functionality (Web Speech API)  
✅ Microphone button with recording animation  
✅ Language-specific speech recognition (18 languages)  
✅ Text-to-speech functionality (gTTS)  
✅ Audio playback in browser  
✅ Speaker button on output area  
✅ Audio caching for performance  
✅ Browser compatibility detection  
✅ Microphone permission handling  
✅ Error handling for speech features  
✅ Mobile browser support  
✅ Keyboard shortcuts (Ctrl+M, Ctrl+P)  

## 🧪 Testing Performed

### Manual Testing
- ✅ Tested voice input in all 18 languages
- ✅ Verified audio output quality
- ✅ Checked microphone permission flow
- ✅ Tested on different browsers
- ✅ Verified mobile functionality
- ✅ Tested with poor internet connection
- ✅ Verified error handling

### Browser Testing
- ✅ Chrome (full support)
- ✅ Edge (full support)
- ⚠️ Firefox (no Web Speech API support)
- ⚠️ Safari (limited support)
- ✅ Mobile Chrome
- ⚠️ Mobile Safari (limited)

## 📈 Progress Metrics

- **Time Spent:** 2-3 days
- **Features Implemented:** 2 major (STT, TTS)
- **Lines of Code:** ~200 lines (frontend + backend)
- **Languages Supported:** 18
- **Browser Compatibility:** 70% (Chrome/Edge fully supported)

## 🔄 Next Steps

- [ ] Add offline speech recognition (if possible)
- [ ] Implement custom TTS voices
- [ ] Add audio waveform visualization
- [ ] Support longer audio generation

---

**Key Takeaway:** Speech features significantly enhance accessibility and make the translator more interactive. Browser APIs like Web Speech API provide powerful functionality without additional dependencies, though browser compatibility must be carefully considered. Audio caching is essential for performance when dealing with TTS services.
