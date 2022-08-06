- [1. Introduction](#1-introduction)
	- [1.1. Getting Started](#11-Getting-Started)
	- [1.2. File Structure](#12-File-Structure)
		- [1.2.1. assets](#121-assets)
		- [1.2.2. pages](#122-pages)
		- [1.2.3. styles](#123-styles)
		- [1.2.4. API.jsx](#124-API)
		- [1.2.5. App.jsx](#125-App)
- [2. State & Authentication](#2-State-&-Authentication)

# 1. Introduction
This branch of Free Speech AAC is being written in SolidJS with the backend being written in ExpressJS using MongoDB as the database. [Check out the server portion of the project here](https://github.com/merkie/freespeech-server). This README is going to (hopefully) walk you through everything you need to know about contributing to and understanding this project. It also should be noted that this is a guide for developers, not end users. Free Speech AAC is still in its infancy, user documentation will be created soon.

## 1.1. Getting Started
Start by cloning the project to the directory of your choice and cd'ing into the project. Run an npm install to initialize the project.

```shell
git clone https://github.com/merkie/freespeech-experimental freespeech && cd freespeech && npm i
```

Then, run the start script to start the Vite server on port 3000.

```shell
npm start
```
Vite will reload any changes you make by default.

## 1.2. File Structure
```
📦 freespeech
 ┣ 📂 src
 ┃ ┗ 📂 assets
 ┃ ┗ 📂 pages
 ┃ ┗ 📂 styles
 ┃ ┗ 🎯 index.jsx
 ┃ ┗ 📄 API.jsx
 ┗ ┗ 📄 App.jsx
```
These are all the files you need to worry about, all other files are config files or files that dont necessarily pertain to the overall function of the application. ```index.jsx``` is the entry point of the application.

### 1.2.1 assets
This is a pretty self-explanitory directory. I'll have a detailed list of all the Assets used by the app, but for now It's empty besides a favicon. 

### 1.2.2 pages
Here's where all the pages and their components can be found. 
```
📂 pages
 ┣ 📂 app (https...com/)
 ┣ 📂 portal (https...com/login, /signup)
 ┣ 📂 settings (https...com/settings)
 ┗ 📂 shared-components
```
The app folder contains all the components for the actual application page of Free Speech AAC. The portal folder contains all the components for the login/signup pages. The settings folder contains all the components for the settings screen of the application. And lastly, the shared-components folder contains some shared components that are utilized by two or more different pages.

# 2. State & Authentication

- [1. Introduction](#1-introduction)
	- [1.1. Getting Started](#11-Getting-Started)
	- [1.2. File Structure](#12-File-Structure)
		- [1.2.1. assets](#121-assets)
		- [1.2.2. pages](#122-pages)
		- [1.2.3. styles](#123-styles)
		- [1.2.4. API.jsx](#124-API)
		- [1.2.5. App.jsx](#125-App)
- [2. State & Authentication](#2-State-&-Authentication)

# 1. Introduction
This branch of Free Speech AAC is being written in SolidJS with the backend being written in ExpressJS using MongoDB as the database. [Check out the server portion of the project here](https://github.com/merkie/freespeech-server). This README is going to (hopefully) walk you through everything you need to know about contributing to and understanding this project. It also should be noted that this is a guide for developers, not end users. Free Speech AAC is still in its infancy, user documentation will be created soon.

## 1.1. Getting Started
Start by cloning the project to the directory of your choice and cd'ing into the project. Run an npm install to initialize the project.

```shell
git clone https://github.com/merkie/freespeech-experimental freespeech && cd freespeech && npm i
```

Then, run the start script to start the Vite server on port 3000.

```shell
npm start
```
Vite will reload any changes you make by default.

## 1.2. File Structure
```
📦 freespeech
 ┣ 📂 src
 ┃ ┗ 📂 assets
 ┃ ┗ 📂 pages
 ┃ ┗ 📂 styles
 ┃ ┗ 🎯 index.jsx
 ┃ ┗ 📄 API.jsx
 ┗ ┗ 📄 App.jsx
```
These are all the files you need to worry about, all other files are config files or files that dont necessarily pertain to the overall function of the application. ```index.jsx``` is the entry point of the application.

### 1.2.1 assets
This is a pretty self-explanitory directory. I'll have a detailed list of all the Assets used by the app, but for now It's empty besides a favicon. 

### 1.2.2 pages
Here's where all the pages and their components can be found. 
```
📂 pages
 ┣ 📂 app (https...com/)
 ┣ 📂 portal (https...com/login, /signup)
 ┣ 📂 settings (https...com/settings)
 ┗ 📂 shared-components
```
The app folder contains all the components for the actual application page of Free Speech AAC. The portal folder contains all the components for the login/signup pages. The settings folder contains all the components for the settings screen of the application. And lastly, the shared-components folder contains some shared components that are utilized by two or more different pages.

# 2. State & Authentication

- [1. Introduction](#1-introduction)
	- [1.1. Getting Started](#11-Getting-Started)
	- [1.2. File Structure](#12-File-Structure)
		- [1.2.1. assets](#121-assets)
		- [1.2.2. pages](#122-pages)
		- [1.2.3. styles](#123-styles)
		- [1.2.4. API.jsx](#124-API)
		- [1.2.5. App.jsx](#125-App)
- [2. State & Authentication](#2-State-&-Authentication)

# 1. Introduction
This branch of Free Speech AAC is being written in SolidJS with the backend being written in ExpressJS using MongoDB as the database. [Check out the server portion of the project here](https://github.com/merkie/freespeech-server). This README is going to (hopefully) walk you through everything you need to know about contributing to and understanding this project. It also should be noted that this is a guide for developers, not end users. Free Speech AAC is still in its infancy, user documentation will be created soon.

## 1.1. Getting Started
Start by cloning the project to the directory of your choice and cd'ing into the project. Run an npm install to initialize the project.

```shell
git clone https://github.com/merkie/freespeech-experimental freespeech && cd freespeech && npm i
```

Then, run the start script to start the Vite server on port 3000.

```shell
npm start
```
Vite will reload any changes you make by default.

## 1.2. File Structure
```
📦 freespeech
 ┣ 📂 src
 ┃ ┗ 📂 assets
 ┃ ┗ 📂 pages
 ┃ ┗ 📂 styles
 ┃ ┗ 🎯 index.jsx
 ┃ ┗ 📄 API.jsx
 ┗ ┗ 📄 App.jsx
```
These are all the files you need to worry about, all other files are config files or files that dont necessarily pertain to the overall function of the application. ```index.jsx``` is the entry point of the application.

### 1.2.1 assets
This is a pretty self-explanitory directory. I'll have a detailed list of all the Assets used by the app, but for now It's empty besides a favicon. 

### 1.2.2 pages
Here's where all the pages and their components can be found. 
```
📂 pages
 ┣ 📂 app (https...com/)
 ┣ 📂 portal (https...com/login, /signup)
 ┣ 📂 settings (https...com/settings)
 ┗ 📂 shared-components
```
The app folder contains all the components for the actual application page of Free Speech AAC. The portal folder contains all the components for the login/signup pages. The settings folder contains all the components for the settings screen of the application. And lastly, the shared-components folder contains some shared components that are utilized by two or more different pages.

# 2. State & Authentication

- [1. Introduction](#1-introduction)
	- [1.1. Getting Started](#11-Getting-Started)
	- [1.2. File Structure](#12-File-Structure)
		- [1.2.1. assets](#121-assets)
		- [1.2.2. pages](#122-pages)
		- [1.2.3. styles](#123-styles)
		- [1.2.4. API.jsx](#124-API)
		- [1.2.5. App.jsx](#125-App)
- [2. State & Authentication](#2-State-&-Authentication)

# 1. Introduction
This branch of Free Speech AAC is being written in SolidJS with the backend being written in ExpressJS using MongoDB as the database. [Check out the server portion of the project here](https://github.com/merkie/freespeech-server). This README is going to (hopefully) walk you through everything you need to know about contributing to and understanding this project. It also should be noted that this is a guide for developers, not end users. Free Speech AAC is still in its infancy, user documentation will be created soon.

## 1.1. Getting Started
Start by cloning the project to the directory of your choice and cd'ing into the project. Run an npm install to initialize the project.

```shell
git clone https://github.com/merkie/freespeech-experimental freespeech && cd freespeech && npm i
```

Then, run the start script to start the Vite server on port 3000.

```shell
npm start
```
Vite will reload any changes you make by default.

## 1.2. File Structure
```
📦 freespeech
 ┣ 📂 src
 ┃ ┗ 📂 assets
 ┃ ┗ 📂 pages
 ┃ ┗ 📂 styles
 ┃ ┗ 🎯 index.jsx
 ┃ ┗ 📄 API.jsx
 ┗ ┗ 📄 App.jsx
```
These are all the files you need to worry about, all other files are config files or files that dont necessarily pertain to the overall function of the application. ```index.jsx``` is the entry point of the application.

### 1.2.1 assets
This is a pretty self-explanitory directory. I'll have a detailed list of all the Assets used by the app, but for now It's empty besides a favicon. 

### 1.2.2 pages
Here's where all the pages and their components can be found. 
```
📂 pages
 ┣ 📂 app (https...com/)
 ┣ 📂 portal (https...com/login, /signup)
 ┣ 📂 settings (https...com/settings)
 ┗ 📂 shared-components
```
The app folder contains all the components for the actual application page of Free Speech AAC. The portal folder contains all the components for the login/signup pages. The settings folder contains all the components for the settings screen of the application. And lastly, the shared-components folder contains some shared components that are utilized by two or more different pages.

# 2. State & Authentication

