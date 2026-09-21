var express=require('express');
var router=express.Router();
var mysql=require('mysql2');
var util=require('util');


router.use(express.static('public'));
var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'simone'
})
var exe=util.promisify(conn.query).bind(conn);


router.get('/',(req,res)=>{
    res.render('web/index.ejs');
})

router.get('/about',(req,res)=>{
    res.render('web/about.ejs');
})

router.get('/services',async(req,res)=>{
    var sql='select * from service';
    var data=await exe(sql);
    res.render('web/services.ejs', {service:data});
})
router.get('/resume', async (req, res) => {

    var education_sql = 'SELECT * FROM education';
    var experience_sql = 'SELECT * FROM experience';
    var skill_sql = 'SELECT * FROM skill';

    var education = await exe(education_sql);
    var experience = await exe(experience_sql);
    var skill = await exe(skill_sql);

    res.render('web/resume.ejs', {
        education: education,
        experience: experience,
        skill: skill
    });

});

router.get('/portfolio',async(req,res)=>{
    var sql='select * from work';
    var data=await exe(sql);
    res.render('web/portfolio.ejs', {work:data});
})

router.get('/clients',async(req,res)=>{
    var sql='select * from client';
    var data=await exe(sql);
    res.render('web/clients.ejs', {client:data});
})

router.get('/contact',(req,res)=>{
    res.render('web/contact.ejs');
})

module.exports=router;