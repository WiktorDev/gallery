const fs = require('fs');
const express = require('express');
var bodyParser = require("body-parser");
var multer = require('multer');
const session = require('express-session');
const flash = require('express-flash');
var upload = multer();
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/photos'));
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(flash());
app.use(session({
    secret: 'rwreqrewqrqw',
    resave: true,
    saveUninitialized: true
}));

app.get('/', function (req, res) {
  console.log(getDirectories("./photos"))
    res.render('index',{
        dir: getDirectories("./photos")
    })
})

app.get('/:dir', function (req, res) {
    fs.readdir('./photos/'+req.params.dir, function (err, files) {
        if (err) {
            return res.send('Unable to scan directory: ' + err);
        } 
        res.render('gallery', {
            image: files,
            dir: req.params.dir
        })
    });
})

app.get('/admin/adddir', function (req, res) {
    res.render('adddir')
})

app.get('/admin/addimages', function (req, res) {
  res.render('addimages', {
    folders: getDirectories("./photos")
  })
})
app.post('/addimage', upload.array('files', 10), function(req, res) {



});

app.post('/addcategory', function (req, res) {
  var dir = './photos/'+req.body.name;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    req.flash('success', 'Katalog o nazwie ' + req.body.name + ' zostal pomyslnie utworzony!')
    res.redirect('/admin/adddir')
  }else{
    req.flash('error', 'Ten katalog juz istnieje!')
    res.redirect('/admin/adddir')
  }
})


function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
      return fs.statSync(path+'/'+file).isDirectory();
    });
}

app.listen(3000, function () {
    console.log("3000")
})