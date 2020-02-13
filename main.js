

var editmode = false;
var synth = window.speechSynthesis;
var voices = [];

    function editMode() {

        if(editmode) {

            editmode = false;

            document.getElementById("content").contentEditable = "false";

            var divs = document.getElementsByClassName('box'), len = divs.length;

            for (var i=0; i<len; i++) {
                if(divs[i].textContent == "") {
                    divs[i].parentNode.removeChild(divs[i]);
                }
            }

        } else {

            editmode = true;

            $( ".row" ).append( '<div class="box"><a onclick="eel.speak(this.innerHTML);"><div class="inner"><p>Placeholder</p></div></a></div>' );
            document.getElementById("content").contentEditable = "true";
        }

    }


    function populateVoiceList() {
      voices = synth.getVoices();

      for(i = 0; i < voices.length ; i++) {
        var option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

        if(voices[i].default) {
          option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        document.getElementById("voices").appendChild(option);
      }
    }

    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = populateVoiceList;
    }
    function Speak(textToSpeak) {
        var utterThis = new SpeechSynthesisUtterance(textToSpeak.getElementsByTagName("p")[0].dataset.spokenvalue);
        var selectedOption = document.querySelector('select').selectedOptions[0].getAttribute('data-name');
        for(i = 0; i < voices.length ; i++) {
            if(voices[i].name === selectedOption) {
                utterThis.voice = voices[i];
            }
        }
       synth.speak(utterThis);
    }