import eel
import os
import buildmain as build
import bs4

build.createindex()

eel.init("")

eel.start("index.html")