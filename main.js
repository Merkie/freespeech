

var editmode = false;

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
