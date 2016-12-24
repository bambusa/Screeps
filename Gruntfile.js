module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'be0schwarz@gmail.com',
                password: '9FWrwHRwVGTg',
                branch: 'default',
                ptr: false
            },
            dist: {
                src: ['gruntfiles/*.js']
            }
        }
    });
}