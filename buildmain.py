import json, time, random

count = 0


def createindex():

    # getting input from build.json
    jsonfile = json.loads(open("build.json", "r+").read())

    # getting the index.html file
    indexhtml = open("index.html", "w+")

    # init the variable for the built portion of the page

    # Top portion of page
    top = """
    <html>
    <head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <style>
    div{text-align: center;}p{font-size: 4vw;}.grid{margin:0 auto;width:80%;height:80%;font-size:1rem}.row{display:flex}.box{background:tomato;margin:5px;color:white;font-weight:bold;flex:1 0 auto;position:relative;opacity:1;transition:.3s}.box:active{transform:scale(.9)}.box:hover{opacity:.8}.box:after{content:"";float:left;display:block;padding-top:100%}.box .inner{position:absolute;left:0;right:0;bottom:0;top:0;display:flex;align-items:center;justify-content:center}.grid{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}</style>
    <script src="/eel.js"></script>
    <script src="main.js"></script>
    </head>
    <body>

    <div class="grid" style="margin-top: -10%">
    <center><h1>Freespeech</h1></center>
    <center><h3>name of page</h3></center>
    <center><select id="voices"> </select> </center>
    <div id="content">
    """

    # Bottom portion of page
    bottom = """
    </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="jquery.textfill.min.js"></script>
    </body>
    </html>
    """

    color = "#34495E"
    redirectcolor = "#2ECC71"
    homecolor = "#3498DB"

    def create_page(page, start, pagename):
        global count

        built = ""
        for row in start:
            built += '<div class="row">'
            for box in start[row]:
                if "page" in box:
                    newpage = open(str(count) + ".html", "w+")
                    create_page(newpage, box["page"], box["name"])
                    if "image" in box:
                        built += f'<div class="box" style="background-color:{redirectcolor}"><a onclick="speakText(this);" href="{str(count)}.html" style="color:white"><div class="inner" style="display : block; padding-top:20%"><img src="{box["image"]}" style="width: 60%; height:60%;"><p data-spokenvalue="{box["text"]}">{box["name"]}"</p></div></a></div>"'

                    else:
                        built += f'<div class="box" style="background-color:{redirectcolor}"><a onclick="speakText(this);" href="{str(count)}.html" style="color:white"><div class="inner"><p data-spokenvalue="{box["text"] }">{box["name"]} "</p></div></a></div>"'
                    count += 1
                else:
                    if "home" in box:
                        built += f'<div class="box" style="border-radius: 25px; background-color:{homecolor};"><a href="index.html" style="color:white"><div class="inner"><p><i>Home</i></p></div></a></div>'
                    else:
                        if "image" in box:
                            built += f'<div class="box" style="background-color:{color}"><a onclick="speakText(this);"><div class="inner" style="display : block; padding-top:20%"><img src="{box["image"]}" style="width: 60%; height:60%;"><p data-spokenvalue="{box["text"]}">{box["name"]}</p></div></a></div>'
                        else:
                            built += f'<div class="box" style="background-color:{color}"><a onclick="speakText(this);"><div class="inner"><p data-spokenvalue="{box["text"]}"> {box["name"]} </p></div></a></div>'

            built += "</div>"

        page.write(top.replace("name of page", pagename) + built + bottom)

    create_page(indexhtml, jsonfile["page"], "Home")
