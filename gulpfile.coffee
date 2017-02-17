gulp = require 'gulp'
connect = require 'gulp-connect'
stylus = require 'gulp-stylus'
coffee = require 'gulp-coffee'
# uglify = require 'gulp-uglify'
# clean = require 'gulp-clean'

gulp.task 'connect', ->
    connect.server
        port: 1337
        livereload: on
        root: './dist'        

gulp.task 'stylus', ->
    gulp.src 'stylus/*.styl'
        .pipe stylus set: ['compress']
        .pipe gulp.dest 'dist/css'
        .pipe do connect.reload

gulp.task 'coffee', ->
    gulp.src 'coffee/*.coffee'
        .pipe do coffee
        .pipe gulp.dest 'dist/js'
        .pipe do connect.reload

gulp.task 'watch', ->       
    gulp.watch 'stylus/*.styl', ['stylus']
    gulp.watch 'coffee/*.coffee', ['coffee']

gulp.task 'default', ['stylus','coffee','connect','watch']


