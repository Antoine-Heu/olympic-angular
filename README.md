# Dashboard des Jeux Olympiques

This project is a web application developped with Angular to visualize performances of 
countries at the olympic games using interactives charts and a details page.

# OlympicGamesStarter

This project was generated with 

[Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.
[Node.js] version 16 or superior
Don't forget to install your node_modules before starting (`npm install`).

# Installation

Clone the project from github and intall dependencies : 

## Clone the repository

git clone <https://github.com/Antoine-Heu/olympic-angular.git>

## Install dependencies

npm install

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application 
will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` 
directory.

# Architecture

The projet follows a modular and well-structured achitecture:

## pages

Contains the components corresponding to the different pages of the application

## header

A component that is applied everywhere in the application.

## core

### services 
Angular services for handling APU calls and data management.

### models
Typescript interfaces for structuring data.

# Applied Angular Best Practices

This project follows Angular recommendations to ensure maintainability and performance:

- Using Angular services for HTTP calls (OlympicService).
- Using RxJS and observables for asynchronous data management.
- Unsubscribing from observables to prevent memory leaks.
- Strict typing: Removing any by using TypeScript interfaces.

