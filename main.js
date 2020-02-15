// enable JavaScript strict mode
"use strict";

// object to access the speechSynthesis API
const SPEECH_SYNTHESIS = window.speechSynthesis;

// editMode is off by default
let editMode = false;

// voices gets populated in populateVoices()
let voices = [];

/**
 * Automatically run this function to initialize speechSynthesis functionality.
 */
(function init() {
	// populate the voice select element with speechSynthesisVoices once the window has loaded
	window.onload = populateVoiceList;
	
	// if there isn't a onvoiceschanged function bound, bind it to populateVoiceList
	if (SPEECH_SYNTHESIS.onvoiceschanged !== undefined) 
		SPEECH_SYNTHESIS.onvoiceschanged = populateVoiceList;
})();

/**
 * Use speechSynthesis to read a string of text.
 * 
 * @param {String} el the element that contains that is to be spoken
 */
function speakText(el) {
	// create a SpeechSynthesisUtterance to speak the element's spokenvalue attribute
	let utterThis = new SpeechSynthesisUtterance(el.getElementsByTagName("p")[0].dataset.spokenvalue);
	
	// get the voice name that we have selected on the webpage
	let selectedVoice = document.getElementById("voices").selectedOptions[0].getAttribute("data-name");

	// find the Voice object that corresponds to the voice name
	voices.forEach(function(voice) {
		// set the Utterance object's voice to the voice that we have selected
		if (voice.name === selectedVoice)
			utterThis.voice = voice;
	});
	
	// call the speechSynthesis API to speak
	SPEECH_SYNTHESIS.speak(utterThis);
}

/**
 * Turn off edit mode if it was on, and turn it on if it was off.
 */
function toggleEditMode() {
	// if editMode was already on
    if (editMode) {
		// turn off editMode
		editMode = false;

		// turn off editing ability of content div
        document.getElementById("content").contentEditable = false;

		// get all box elements
        let boxes = document.getElementsByClassName("box");

		// remove all box elements that have no text
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].textContent == "") {
				boxes[i].parentNode.removeChild(boxes[i]);
            }
        }
	} 
	// if editMode was off
	else {
		// turn on editMode
		editMode = true;

		// add a new box element
		$(".row").append('<div class="box"><a onclick="eel.speak(this.innerHTML);"><div class="inner"><p>Placeholder</p></div></a></div>');
		
		// allow the content div to be edited
        document.getElementById("content").contentEditable = true;
    }
}

/**
 * Populate the select element with the various voice options available to it 
 * through speechSynthesis.
 */
function populateVoiceList() {
	// get all the available voices from the speechSynthesis API
	voices = SPEECH_SYNTHESIS.getVoices();

	// loop through every voice
	voices.forEach(function(voice) {
		// create a new option element
		let option = document.createElement("option");

		// set the option text to be the voice's name and language
		option.textContent = voice.name + " (" + voice.lang + ")";

		// if the voice is the default voice, mark it as the default in the option
		if (voice.default) 
			option.textContent += ' -- DEFAULT';

		// set the language and name attributes for each voice option
		option.setAttribute("data-lang", voice.lang);
		option.setAttribute("data-name", voice.name);

		// add the new voice option to the 
		document.getElementById("voices").appendChild(option);
	});
}