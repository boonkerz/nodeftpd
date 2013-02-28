exports = module.exports = (function(app) {
    var fs = require('fs');
    
    app.server.on('ftp:command_received', function(command, cd, output, session) {
        if (command === 'CWD') {
            var oldcwd = session.cwd;

            if (cd.substr(cd.length - 1) == '/') {
                cd = cd.substring(0, cd.length - 1);
            }

            if (cd.substr(0, 1) == '/') {
                session.cwd = cd;
            } else {
                if (session.cwd == '/') {
                    session.cwd += cd;
                } else {
                    session.cwd += '/' + cd;
                }
            }

            fs.readdir(session.cwd, function(err, files) {
                if (err) {
                    output.write(550, session.cwd + ': No such file or directory');
                    session.cwd = oldcwd;
                } else {
                    output.write(250, '"' + session.cwd + '" is the new working directory.');
                }
            
            });
        } 
    });
});