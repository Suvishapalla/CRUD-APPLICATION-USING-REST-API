var express=require('express')
var bodyParser=require('body-parser')
//var object=require('mongodb').object;
var app=express()
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const MongoClient=require('mongodb').MongoClient;
//connecting server file for AWT
let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('express');

const url='mongodb://127.0.0.1:27017';
const dbname='hospital_management';
let db

MongoClient.connect(url,{useUnifiedTopology:true},(err,client) =>{
    if(err) return console.log(err);
    db=client.db(dbname);
    console.log(`Connected Database:${url}`);
    console.log(`Database:${dbname}`);
})

//app.use(express.json());
//1.FETCHING HOSPITAL DETAILS
app.get('/hospitaldetails',middleware.checkToken,(req,res) =>{
    console.log('FETCHING HOSPITAL DETAILS FROM HOSPITAL_DETAILS');
    var data=db.collection('hospital').find().toArray().then(result => res.json(result));
})

//1.FETCHING VENTILATORS DETAILS
app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{
    console.log('FETCHING VENTILATORS DETAILS FROM VENTILATOR_DETAILS');
    var data=db.collection('ventillators').find().toArray().then(result=> res.json(result));
})

//2.SEARCHING VENTILATORS BY STATUS
app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventillators').find({"status" : status}).toArray().then(result => res.json(result));
})

//2.SEARCHING VENTILATORS BY HOSPITAL NAME
app.post('/searchventbyname',middleware.checkToken,(req,res) =>{
    var name=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventillators').find({'name':new RegExp(name,'i')}).toArray().then(result => res.json(result));
})

//3.SEARCHING HOSPITAL BY NAME
app.post('/searchbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var data=db.collection('hospital').find({'name':new RegExp(name,'i')}).toArray().then(result => res.json(result));
})


//4.UPDATE VENTILATORS DETAILS
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid={vId : req.body.vId};
    console.log(ventid);
    var newvalue={$set: {status:req.body.status}};
    db.collection('ventillators').updateOne(ventid,newvalue,function(err,result){
        res.send('1 document updated');
        if(err) throw err;
        //console.log('updated');
    })
})


//5.ADD VENTILATORS
app.post('/addventilatorbyuser',middleware.checkToken,(req,res)=>{
    var hId=req.body.hId;
    var vId=req.body.vId;
    var status=req.body.status;
    var name=req.body.name;
    var item=
    {
        hId:hId,vId:vId,status:status,name:name
    };
    db.collection('ventillator').insertOne(item,function(err,result){
        res.json('Item inserted');
    })
})


//6/DELETE VENTILATORS BY VENT ID
app.delete('/delete',middleware.checkToken,(req,res)=>{
    var myquery=req.query.vId;
    console.log(myquery);
    var myquery1={vId:myquery};
    db.collection('ventillators').deleteOne(myquery1,function(err,obj){
        res.json("Document deleted")
        if(err) throw err;
    })
})
app.listen(3000,function(){
    console.log('server started');
})
