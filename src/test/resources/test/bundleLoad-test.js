var assert = require('/lib/xp/testing');

var Files = Java.type('java.nio.file.Files');
var Paths = Java.type('java.nio.file.Paths');

var ROOT = Paths.get('build/resources/main').toAbsolutePath();

function listModules() {
    var modules = [];
    var stream = Files.walk(ROOT.resolve('lib/explorer'));
    try {
        var iterator = stream.iterator();
        while (iterator.hasNext()) {
            var file = iterator.next();
            var name = String(file.getFileName());
            if (Files.isRegularFile(file) && name.slice(-3) === '.js') {
                var relative = String(ROOT.relativize(file)).split('\\').join('/');
                modules.push('/' + relative.slice(0, -3));
            }
        }
    } finally {
        stream.close();
    }
    return modules.sort();
}

exports.testEveryBundledModuleLoads = function () {
    var modules = listModules();
    assert.assertTrue(modules.length > 100, 'expected the tsdown output in build/resources/main, found ' + modules.length + ' modules');
    var failures = [];
    modules.forEach(function (id) {
        try {
            require(id);
        } catch (e) {
            failures.push(id + ': ' + e);
        }
    });
    assert.assertEquals('', failures.join('\n'));
};

exports.testTraverseRuns = function () {
    var getPaths = require('/lib/explorer/object/getPaths').getPaths;
    assert.assertEquals(3, getPaths({a: {b: 1}}).length);
};
