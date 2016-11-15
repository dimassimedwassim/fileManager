var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var routes = require('./routes');
var users = require('./routes/users');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'files')));
app.use('/', routes);
app.use('/users', users);

app.post('/generate', function (req, res) {

    name = req.body.name;
    size = parseInt(req.body.size);
    var i = 0;
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    fs.writeFile('files/' + name, '');
    for (i; i < size; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        fs.appendFile('files/' + name, chars.substring(rnum, rnum + 1));
    }


});

app.post('/compress', function (req, res) {
    var multiparty = require('multiparty');
    var form = new multiparty.Form();
    var lz4 = require('lz4');


    file = req.body.file;
    console.log(file);
    form.parse(req, function (err, fields, files) {
        // Each element of the object is an array
        console.log("form parsed");
        // yamlfiles is an array anyway
        var yamlfiles = files.yamlfiles;
        // username is just a text field, so the 0th element is username

        // files is a single file, so the 0th element is my key
        var key = files.file[0];


        var zlib = require("zlib");
        var gzip = zlib.createGzip();


        var method = fields.method[0];
        console.log(method);
        switch (method) {
            case 'lz4' :
                var input = fs.readFileSync(key.path);
                var output = lz4.encode(input);

                fs.writeFileSync('compressed/' + key.originalFilename + '.lz4', output);
                res.send('file compressed !!');
                break;
            case 'gzip':
                var inp = fs.createReadStream(key.path);
                var out = fs.createWriteStream('compressed/' + key.originalFilename + '.gz');
                try {
                    inp.pipe(gzip).pipe(out);
                    res.send('file compressed !!');
                }catch(exp ){

                }
                break;      
        }




    });

});
/// catch 404 and forwardin to error handler


app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
