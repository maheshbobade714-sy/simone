var express = require('express');
var router = express.Router();
var mysql=require('mysql2');
var util=require('util');
var session=require('express-session');
var fileupload=require('express-fileupload');
var path=require('path');

router.use(express.static('public'));
var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'simone'
})
var exe=util.promisify(conn.query).bind(conn);
router.use(express.urlencoded({extended:true}));
router.use(session({
    secret:'A2ZITHUB',
    resave:false,
    saveUninitialized:true
}))
router.use(fileupload());

router.get('/', (req, res) => {
    // res.send(req.session);
    res.render('admin/login.ejs');
});

router.post('/login_check', async (req, res) => {
    var { username, password } = req.body;

    var sql = 'SELECT * FROM login WHERE username = ? AND password = ?';

    var data = await exe(sql, [username, password]);

    if (data.length > 0) {
        // session data store
        req.session.id=data[0].lid;
        req.session.name=data[0].name;
        res.redirect('/admin/dashboard');
    } else {
        res.redirect('/admin/');
    }
});
function logincheck(req,res,next){
    if(req.session.name){
      next();
    }else{
        res.redirect('/admin/')
    }
}

router.get('/dashboard', (req, res) => {
    // res.send( req.session.name);
    var name=req.session.name;

    res.render('admin/dashboard.ejs',{name:name});
});

router.get('/form', (req, res) => {
    res.render('admin/form.ejs');
});

router.get('/table', (req, res) => {
    res.render('admin/table.ejs');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/');
});

router.get('/service_add',(req,res)=>{
    res.render('admin/service_add.ejs');
})

router.post('/service_save',async(req,res)=>{
    // res.send(req.body);
    var {s_icons,s_title,s_desc}=req.body;
    var sql='insert into service(s_icons,s_title,s_desc)values(?,?,?)';
    var data=await exe(sql,[s_icons,s_title,s_desc]);
    // res.send('done');
    res.redirect('/admin/service_add');

})

router.get('/service_list',async(req,res)=>{
    var sql='select * from service';
    var data=await exe(sql);
    // res.send(data);
    res.render('admin/service_list.ejs', {service:data});
})

router.get('/work_add',(req,res)=>{
    res.render('admin/work_add.ejs'); 
})

router.post('/work_save',async(req,res)=>{
    // res.send(req.body);
    // res.send(req.files);
    var{w_title,w_desc}=req.body;
    // img
    var img=req.files.w_img;
    var imgname=req.files.w_img.name;
    var newname=Date.now()+imgname;
    var imgpath=path.join(__dirname,'../','public/img',newname);
    img.mv(imgpath,(err)=>{})
    var sql='insert into work(w_img,w_title,w_desc)values(?,?,?)';
    var data=await exe(sql,[newname,w_title,w_desc]);
    // res.send(imgpath);
    res.redirect('/admin/work_add');           
})

router.get('/work_list',async(req,res)=>{
    var sql='select * from work';
    var data=await exe(sql);
    res.render('admin/work_list.ejs',{data:data});
})

router.get('/education_add',(req, res) => {
    res.render('admin/education_add.ejs');
});

router.post('/education_save', async (req, res) => {

    var { e_title, e_desc, e_year, e_place } = req.body;

    var sql = `
        INSERT INTO education
        (e_title, e_desc, e_year, e_place)
        VALUES (?, ?, ?, ?)
    `;

    await exe(sql, [e_title, e_desc, e_year, e_place]);

    res.redirect('/admin/education_list');
});


router.get('/education_list', async (req, res) => {

    var sql = 'SELECT * FROM education';

    var data = await exe(sql);

    res.render('admin/education_list.ejs', {
        data: data
    });
});

router.get('/experience_add',(req, res) => {
    res.render('admin/experience_add.ejs');
});

// ================= EXPERIENCE =================

router.post('/experience_save', async (req, res) => {

    var { e_year, e_title, e_place, e_desc } = req.body;

    var sql = `
        INSERT INTO experience
        (e_year, e_title, e_place, e_desc)
        VALUES (?, ?, ?, ?)
    `;

    await exe(sql, [e_year, e_title, e_place, e_desc]);

    res.redirect('/admin/experience_list');
});


router.get('/experience_list', async (req, res) => {

    var sql = 'SELECT * FROM experience';

    var data = await exe(sql);

    res.render('admin/experience_list.ejs', {
        experience: data
    });
});


// ================= SKILL =================

router.get('/skill_add', (req, res) => {
    res.render('admin/skill_add.ejs');
});


router.post('/skill_save', async (req, res) => {

    var { s_title, s_percentage } = req.body;

    var sql = `
        INSERT INTO skill
        (s_title, s_percentage)
        VALUES (?, ?)
    `;

    await exe(sql, [s_title, s_percentage]);

    res.redirect('/admin/skill_list');
});


router.get('/skill_list', async (req, res) => {

    var sql = 'SELECT * FROM skill';

    var data = await exe(sql);

    res.render('admin/skill_list.ejs', {
        skill: data
    });
});


// ================= CLIENT =================

router.get('/client_add', (req, res) => {
    res.render('admin/client_add.ejs');
});


router.post('/client_save', async (req, res) => {

    var { c_name, c_desc } = req.body;

    var sql = `
        INSERT INTO client
        (c_name, c_desc)
        VALUES (?, ?)
    `;

    await exe(sql, [c_name, c_desc]);

    res.redirect('/admin/client_list');
});


router.get('/client_list', async (req, res) => {

    var sql = 'SELECT * FROM client';

    var data = await exe(sql);

    res.render('admin/client_list.ejs', {
        client: data
    });
});


// ================= CONTACT =================

router.get('/contact_list', async (req, res) => {

    var sql = 'SELECT * FROM contact';

    var data = await exe(sql);

    res.render('admin/contact_list.ejs', {
        contact: data
    });
}); 
module.exports = router;
