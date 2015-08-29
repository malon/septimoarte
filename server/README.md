# NPM and GULP tasks


## Project Map:

root_project/
	|
	|--- webapp/
	|		|---- index.html
	|		|---- js/
	|		|---- img/
	|		└---- css/
	|				└---- images/
	|
	|--- server/
	|		└---- gulpfile.js 
	|		└---- gulp_tasks/
	|		└---- bower.json 
	|
	└--- backend/


## Commands: 

install dependences

```bash
npm install && bower install
```

Run server for dev

```bash
gulp
```

Build Project

```bash
gulp build
```

Claen build

```bash
gulp clean_build
```