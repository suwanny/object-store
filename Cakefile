

{exec}  = require 'child_process'
spawn   = require('child_process').spawn
Async   = require 'async'
glob    = require 'glob'
fs      = require 'fs'

# Helper functions
run_command = (command) ->
  console.log "run: #{command}"
  exec command, (err, stdout, stderr) ->
    throw err if err
    output = stdout + stderr
    console.log output if output.length > 0

run = (command, callback) ->
  console.log "run: #{command}"
  exec command, (err, stdout, stderr) ->
    callback(err, stdout + stderr)


# Cake tasks
task 'init', 'Initialize the app', ->
  run_command 'npm install'

task 'build', 'Build project from src/*.coffee', ->
  run_command 'node_modules/coffee-script/bin/coffee --lint -c -o lib/ src/'

task 'b', 'Build project from app/*.coffee to lib_app/*.js', ->
  invoke 'build'

task 'compile', 'Build project', ->
  invoke 'build'

task 'test', 'Run unit tests with mocha', ->
  invoke 'build'
  run_command 'node_modules/.bin/mocha -R spec --recursive spec'

# cleanup js in app, db, config .. 
task 'clean', 'Remove compiled files', ->
  tasks = []
  tasks.push((callback) -> glob("lib/**/*.js", callback))

  Async.series tasks, (err, lists) ->
    files = []
    files = files.concat(list) for list in lists
    fs.unlinkSync(item) for item in files








