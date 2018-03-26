var fs = require('fs');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.config('clean.all', [
        't.js',
        'lib'
    ]);

    grunt.registerTask('shader', 'Merge shader', function () {
        var includeDir = './include/';
        var includes = {};
        fs.readdirSync(includeDir).forEach(function (fileName) {
            if (fileName.endsWith('.fs') || fileName.endsWith('.vs')) {
                var name = fileName.substr(0, fileName.length - 3);
                var code = fs.readFileSync(includeDir + fileName, { encoding: 'utf8' });
                includes[name] = code;
            }
        });
        var shaders = [];
        [
            'sprite',
        ].forEach(function (name) {
            var vertexShader = fs.readFileSync('./include/' + name + '_vertex.vs', { encoding: 'utf8' });
            var fragmentShader = fs.readFileSync('./include/' + name + '_fragment.fs', { encoding: 'utf8' });
            vertexShader = replaceInclude(vertexShader);
            fragmentShader = replaceInclude(fragmentShader);
            fs.writeFileSync('./output/' + name + '_vertex.vs', vertexShader);
            fs.writeFileSync('./output/' + name + '_fragment.fs', fragmentShader);
            shaders.push('var ' + name.toUpperCase() + "_VERTEX_SHADER = '" + vertexShader.split('\n').join('\\n') + "';");
            shaders.push('var ' + name.toUpperCase() + "_FRAGMENT_SHADER = '" + fragmentShader.split('\n').join('\\n') + "';\n");
        });
        fs.writeFileSync('./Shader.js', shaders.join('\n'));

        function replaceInclude(code) {
            var codeLines = code.split('\n');
            codeLines.forEach(function (line, index) {
                var match = line.match(/^([\s]*)#include[\s]*<([\S]*)>/);
                if (match) {
                    var space = match[1];
                    var includeFileName = match[2];
                    var includeCode = includes[includeFileName];
                    if (includeCode) {
                        codeLines[index] = includeCode.split('\n').map(function (line) {
                            return space + line;
                        }).join('\n');
                    }
                }
            });
            return codeLines.join('\n');
        }
    });
    
}