window.addEventListener("load", function() {
    
    // Helper: Selects the best German voice
    const getGermanVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(v => v.lang === 'de-DE' && v.name.includes('Google')) || 
               voices.find(v => v.lang === 'de-DE');
    };

    // Helper: Speaks a single word and returns a promise
    const speakWord = (text, element) => {
        return new Promise((resolve) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'de-DE';
            utterance.rate = 0.9;
            utterance.voice = getGermanVoice();
            
            // Highlight the word being spoken
            if (element) element.style.backgroundColor = '#ffeb3b';
            
            utterance.onend = () => {
                if (element) element.style.backgroundColor = 'transparent';
                // Wait for the requested 1 seconds (1000ms) after speech ends
                setTimeout(resolve, 1000);
            };
            
            window.speechSynthesis.speak(utterance);
        });
    };

    setTimeout(() => {
        // 1. Create the master button
        const btn = document.createElement("button");
        btn.innerText = "🔊 Read all with 2s pause";
        btn.style.cssText = "position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px; cursor: pointer; background: #f0f0f0; border: 1px solid #ccc; border-radius: 4px;";
        
        btn.onclick = async function() {
            window.speechSynthesis.cancel();
            const germanWords = document.querySelectorAll("td.de");
            for (const cell of germanWords) {
                await speakWord(cell.innerText, cell);
            }
        };
        document.body.appendChild(btn);

        // 2. Make individual words clickable
        document.querySelectorAll('td.de').forEach(item => {
            item.style.cursor = "pointer";
            item.style.textDecoration = "underline";
            item.title = "Click to hear pronunciation";
            
            item.addEventListener("click", async function() {
                window.speechSynthesis.cancel();
                await speakWord(this.innerText, this);
            });
        });
    }, 500);
});