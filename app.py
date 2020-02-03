import eel
import os
import buildmain as build
import bs4

build.createindex()

eel.init('')

@eel.expose
def speak(word):
    print(word)
    os.system("say "+bs4.BeautifulSoup(word, 'html.parser').find("p").text)

eel.start('index.html')
