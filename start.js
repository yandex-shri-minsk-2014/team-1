var exec = require('child_process').exec

console.log('Installing node_modules ...')
exec('npm install', function() {

  console.log('Node_modules was installed')
  console.log('Installing bower components ...')
  exec('bower install', function() {

    console.log('Bower components were installed ...')
    console.log('Run gulp ...')
<<<<<<< HEAD
    exec('npm make run', function() {
=======
    exec('gulp', function() {
>>>>>>> origin/deploy

      console.log('Gulp was made')
      console.log('Started server')
      exec('node server.js');
    });
  })
})