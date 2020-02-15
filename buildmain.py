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
    div{text-align: center;}.grid{margin:0 auto;width:90%;height:80%;font-size:1rem;}.row{display:flex}.box{background:tomato;margin:5px;color:black;font-weight:bold;flex:1 0 auto;position:relative;opacity:1;transition:.3s;box-shadow: 0px 0px 20px rgba(0, 0, 0, .2);}.box:active{transform:scale(.9)}.box:hover{opacity:.8}.box:after{content:"";float:left;display:block;padding-top:100%}.box{color:#241C41;} .inner{position:absolute;left:0;right:0;bottom:0;top:0;display:flex;align-items:center;justify-content:center}.grid{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}</style>
    <script src="/eel.js"></script>
    <script src="main.js"></script>
    </head>
    <body style="background-color: #f5f5f5; color: #241C41">

    <div class="grid">
    <center><h1>Freespeech</h1></center>
    <center><h3>name of page</h3></center>
    <center><select id="voices"> </select> </center>
    <div id="content" style="padding-top: 5%;">
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

    color = "#F9FAF9"

    # Accent Colors
    aRed = "#FF9AA2"
    aBlush = "#FFB7B2"
    aPeach = "#FFDAC1"
    aPear = "#E2F0CB"
    aMint = "#B5EAD7"
    aViolet = "#C7CEEA"

    def create_page(page, start, pagename):
        global count

        built = ""
        for row in start:
            built += '<div class="row">'

            for box in start[row]:

                setcolor = color

                if "accent" in box:
                    if box["accent"].lower() == "red":
                        setcolor = aRed
                    if box["accent"].lower() == "blush":
                        setcolor = aBlush
                    if box["accent"].lower() == "peach":
                        setcolor = aPeach
                    if box["accent"].lower() == "pear":
                        setcolor = aPear
                    if box["accent"].lower() == "mint":
                        setcolor = aMint
                    if box["accent"].lower() == "violet":
                        setcolor = aViolet

                if "page" in box:
                    newpage = open(str(count) + ".html", "w+")
                    create_page(newpage, box["page"], box["name"])
                    if "image" in box:
                        built += f'<div class="box" style="background-color:{setcolor}"><a onclick="speakText(this);" href="{str(count)}.html" style="color:white"><div class="inner" style="display : block; padding-top:20%"><p data-spokenvalue="{box["text"]}">{box["name"]}"</p><img src="{box["image"]}" style="width: 60%; height:60%;"></div></a></div>"'

                    else:
                        built += f'<div class="box" style="background-color:{setcolor}"><a onclick="speakText(this);" href="{str(count)}.html" style="color:white"><div class="inner"><p data-spokenvalue="{box["text"] }">{box["name"]} "</p></div></a></div>"'
                    count += 1
                else:
                    if "home" in box:
                        built += f'<div class="box" style="border-radius: 25px; background-color:{setcolor};"><a href="index.html" style="color:white"><div class="inner"><p><i>Home</i></p></div></a></div>'
                    else:
                        if "image" in box:
                            built += f'<div class="box" style="background-color:{setcolor}"><a onclick="speakText(this);"><div class="inner" style="display : block; padding-top:20%"><img src="{box["image"]}" style="width: 60%; height:60%;"><p data-spokenvalue="{box["text"]}">{box["name"]}</p></div></a></div>'
                        else:
                            built += f'<div class="box" style="background-color:{setcolor}"><a onclick="speakText(this);"><div class="inner"><p data-spokenvalue="{box["text"]}"> {box["name"]} </p></div></a></div>'

            built += "</div>"

        page.write(top.replace("name of page", pagename) + built + bottom)

    create_page(indexhtml, jsonfile["page"], "Home")
