

var Speech = function() {

    const artyom = new Artyom()
    window.isSpeaking = false
    window.lastSpeech = ""

    window.synthesizeSpeech = function(s) {
        if (s === ' ') {
            return;
        }
        artyom.say(s, {
            onStart:function() {
                //console.log("Text is being synthesized")
            },
            onEnd:function() {
                //console.log("Text has completed synthesis")
            }
        })
    }

    this.recognizeSpeech = function() {
        var dictation = artyom.newDictation({
            continuous:true,
            onResult:function(text) {
                window.recognizedSpeech = text
                if(text != "") { 
                    document.getElementById("speechView").innerHTML = `<h1>${text}</h1>` 
                    window.isSpeaking = true
                    window.lastSpeech = text
                } else {
                    window.isSpeaking = false
                    //window.lastSpeech = ""
                }
            },
            onStart:function() {
                console.log("Starting speech Recognition")
            },
            onEnd:function() {
                console.log("Ending speech Recognition")
            }
        })
        dictation.start()
    }
}