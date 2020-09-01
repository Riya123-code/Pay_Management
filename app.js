var fs=require('fs');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var fileupload = require('express-fileupload');
var ejs = require('ejs');
var flash = require('req-flash');
var router=express.Router();
const { body, validationResult } = require("express-validator");





var db=mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database :'prison',
	insecureAuth : true,
	port : 3308
}); 
db.connect((err) =>{
	if(!err)
		console.log('db successes');
		else
	console.log('mysql connected failed' + JSON.stringify(err,undefined,2));
});
var app=express();
app.use(express.static(__dirname+'/public'));
//app.locals.points="7878";
app.locals.points ='3444';
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
// app.set('views',__dirname+'/views');
// app.engine('html',require('ejs').renderFile);
app.set('views','views');
app.set('view engine','ejs');

app.get('/', function(request, response) {
	response.render('index', {});
});


app.post('/home', function(request, response) {
	var username = request.body.username;
	var password = request.body.userpassword;
	if (username && password) {
		db.query('SELECT * FROM login WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				//request.session.loggedin = true;
				//request.session.username = username;
				response.render('home.ejs',{home:results});
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/employee',function(request,response){
	response.render('employee',{});
});
app.get('/search',function(request,response){
	response.render('search',{});
});
app.get('/searchid',function(request,response){
	response.render('searchid',{});
});
app.post('/dispid',function(request,response){
	var eid = request.body.id;
	let query='select * from employee where e_id='+eid;
	db.query(query,(err,result)=>{
		if(err) throw err;
	response.render('dispid',{
		title : "salary",
		data : result
	});
});

});
app.get('/searchname',function(request,response){
	response.render('searchname',{});
});
app.post('/dispname',function(request,response){
	var ename = request.body.name;
	console.log(ename);
	db.query('SELECT * FROM employee WHERE e_name = ? ', [ename], function(error, results, fields) {
	
		if(error) throw error;
		console.log(results);
	response.render('dispname',{
		title : "salary",
		data : results
	});
});

});
app.get('/searchaddress',function(request,response){
	response.render('searchaddress',{});
});
app.post('/dispaddress',function(request,response){
	var address = request.body.address;
	console.log(address);
	db.query('SELECT * FROM employee WHERE e_address = ? ', [address], function(error, results, fields) {
	
		if(error) throw error;
		console.log(results);
	response.render('dispaddress',{
		title : "salary",
		data : results
	});
});

});
app.get('/searchage',function(request,response){
	response.render('searchage',{});
});
app.post('/dispage',function(request,response){
	var eage = request.body.age;
	console.log(eage);
	let query='SELECT * FROM employee WHERE e_age='+eage;
	
	db.query(query,(err,result)=>{
		if(err) throw err;
		console.log(result);
	response.render('dispage',{
		title : "salary",
		data : result
	});
});

});
app.get('/insert',function(request,response){
	response.render('e_insert',{
		title : "",
		error: [],
		data: {
			name: ""
		}
	});
});

app.post('/addemployee',[
    body("name", "Name Should Conatain only Letters")
      .trim()
      .isAlpha(),
    body("age", "age Should Conatain only integers")
      .trim()
      .isDecimal(),
     
    body("email", "Email is Not Valid")
      .trim()
      .normalizeEmail()
      .isEmail(),
     
    body("address")
      .escape()
      .isString()
      .isLength({ min: 6 })
      .withMessage("Address is Too Short")
  ],
  (request,response) => {
	const error = validationResult(request)
	console.log(request.body)
	if(!error.isEmpty()){
		return response.render("e_insert",{
			title : "",
			error: error.array(),
			data: request.body
			//(error).isEmpty
		})
	}else
	address=request.body.address;
	ename=request.body.name;
	eage=request.body.age;
	eid=request.body.id;
	email=request.body.email;
	var res=[];
		                                                                                                                    
			db.query('insert into employee values (?,?,?,?,?)', [address,ename,eage,null, email] , function(error, results, fields) {
				 if(error)console.log("error");
				 response.redirect("/view");
			
});
});
	
		

app.get('/delete',function(request,response){
	let query="SELECT e_id,e_name FROM employee";
	db.query(query,(err,result)=>{
		if(err) throw err;
	
	response.render("e_delete",{
		title : "PAY",
		displays : result
	});
});
});

app.post("/deleteemp" ,function(req,res){

	cid=req.body.id;
	db.query('SELECT * FROM employee WHERE e_id = ?', [cid], function(error, results, fields) {
		if (results.length > 0) {
			//request.session.loggedin = true;
			//request.session.username = username;
			db.query('DELETE FROM employee WHERE e_id= ?', [cid] , function(error, results, fields) {
				if(error)console.log("error");
			  // res.render('display.html',{displays:results});
		res.redirect("/view");
			})
		}		 else {
			res.send('employee with that id does not exist');
		}			
	});
} 
);
	
app.get('/view',function(req,res){

		let query="SELECT * FROM employee";
		db.query(query,(err,result)=>{
			if(err) throw err;
		
		res.render("display",{
			title : "PAY",
			displays : result
		});
	});
})


app.get('/salary',function(request,response){
	response.render('salary',{});
});

app.get('/s_insert',function(request,response){
	let query="SELECT e_id FROM employee";
	db.query(query,(err,result)=>{
		if(err) throw err;
	
	response.render("salary_insert",{
		title : "PAY",
		displays : result
	});
});
});
app.post('/addsalary',function(request,response){
	bsid=request.body.bsid;
	eid=request.body.e_id;
	basic_salary=request.body.TextBox3;
	inflation=request.body.TextBox4;
	travelling_allowance=request.body.travelling_allowance;
	house_rent=request.body.house_rent;
	provident_fund=request.body.provident_fund;
	incometax=request.body.incometax;
	pay_date=request.body.pay_date;
	final_amount=request.body.final_amount;

	var res=[];
		                                                                                                                    
			db.query('insert into salary values (?,?,?,?,?,?,?,?,?,?)', [null,eid,basic_salary,inflation, travelling_allowance,house_rent,provident_fund,incometax,pay_date,final_amount] , function(error, results, fields) {
				 if(error) throw error;
				response.render('salary',{salary:results});
			
});
});
app.get('/s_view',function(req,res){

	let query="SELECT * FROM salary";
	db.query(query,(err,result)=>{
		if(err) throw err;
	
	res.render("s_view",{
		title : "salary",
		s_view : result
	});
});
})
app.get('/s_delete',function(request,response){
	let query="SELECT bsid,e_id FROM salary";
	db.query(query,(err,result)=>{
		if(err) throw err;
	
	response.render("salary_delete",{
		title : "PAY",
		displays : result
	});
});
});
app.post("/deletesalary" ,function(req,res){

	cid=req.body.id;
	db.query('DELETE FROM salary WHERE bsid = ?', [cid] , function(error, results, fields) {
		if(error)console.log("error");
	  // res.render('display.html',{displays:results});
res.redirect("/s_view");
	})
})
app.get("/pay_search",function(req,res)
{
		res.render('pay_search',{});
	});
	

	app.get("/employee-salary",function(req,res){
		let query='select * from employee,salary where employee.e_id=salary.e_id and employee.e_age>21 and salary.final_amount>17000';
		db.query(query,(err,result)=>{
			if(err) throw err;
			console.log(result)
		res.render('disppay_search',{
			title : "salary",
			data : result
		});
	});
	
	});
	app.post("/deleteemp" ,function(req,res){

		cid=req.body.id;
		db.query('SELECT * FROM employee WHERE e_id = ?', [cid], function(error, results, fields) {
			if (results.length > 0) {
				//request.session.loggedin = true;
				//request.session.username = username;
				db.query('DELETE FROM employee WHERE e_id= ?', [cid] , function(error, results, fields) {
					if(error)console.log("error");
				  // res.render('display.html',{displays:results});
			res.redirect("/view");
				})
			}		 else {
				res.send('employee with that id does not exist');
			}			
		});
	} 
	);
		
	
app.get('/update',function(request,response){
	response.render('e_update',{});
});
app.post('/updated',function(req,res)
{
	const cid = req.body.id;
	let query="SELECT * FROM employee WHERE e_id= " + cid;
	db.query(query,(err,result)=>{
		if(err) throw err;
	console.log(result)
	res.render("updatee",{
		title : "salary",
		data : result[0]
	});
});

})
app.post("/updateemp" ,function(request,res){
	cid=request.body.id;
	address=request.body.address;
	ename=request.body.name;
	eage=request.body.age;
	email=request.body.email;

	let query="UPDATE `employee` SET `e_address` = '"+ address +"', `e_name` = '"+ ename +"', `e_age` = '"+ eage +"' ,`e_email` = '"+ email +"' WHERE `employee`.`e_id` ='"+ cid +"' ";
	db.query(query,(err,result)=>{
		if (err) throw err;
		res.redirect("/view");

	})
	
	
})
app.get('/loan',function(request,response){
	response.render('loan',{});
});
app.get('/loan_take',function(request,response){
	let query="SELECT e_id FROM employee";
	db.query(query,(err,result)=>{
		if(err) throw err;
	
	response.render("loan_take",{
		title : "PAY",
		displays : result
	});
});
});

	app.post('/addloan',function(request,response){

	l_id=request.body.lid;
	e_id=request.body.e_id;
	loan_amt=request.body.loan_amt;
	installment_amt=0;
	//remaining=request.body.remaining;
	dates=request.body.date;

	db.query('insert into loans values (?,?,?,?,?,?)', [null,e_id,loan_amt,installment_amt ,loan_amt,dates], function(error, results, fields) {
		if(error) throw error;
	   response.render('loan',{salary:results});
	});

});
app.get('/loan_pay',function(request,response){
	let query="SELECT l_id,e_id FROM loans";
	db.query(query,(err,result)=>{
		if(err) throw err;
	
	response.render("loan_pay",{
		title : "PAY",
		displays : result
	});
});
});

app.post('/payloan',function(request,response){

	l_id=request.body.lid;
	e_id=request.body.eid;
//	loan_amt=request.body.loan_amt;
	installment_amt=1200;
	//remaining=request.body.remaining;
	dates=request.body.date;
	db.query('SELECT remaining FROM loans WHERE e_id=?',[e_id],function(error,results,fields){
		if(error) throw error;
 remainings=results;
 console.log(remainings);
 db.query('UPDATE loans SET remaining=(remaining-installment_amt)  WHERE e_id=?',[e_id],function(error,results,fields){
	if(error) throw error;
	dates=request.body.date;

	db.query('UPDATE loans SET date=date WHERE e_id=?',[e_id],function(error,results,fields){
		if(error) throw error;
	db.query('select l_id,e_id,loan_amt,installment_amt,date,remaining from loans where e_id=?',[e_id],function(error,results,fields){
		if(error) throw error;
		response.render("loan_disp",{
			title : "salary",
			loan_disp : results
		});

	})
 })


	})
	});
	
	
	
	});
app.listen('3000',()=>{
	console.log('server started on 3000');
});