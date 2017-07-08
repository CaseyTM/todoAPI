const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bodyParser = require('body-parser');
const validator = require('express-validator');

mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost:27017/todoAssessment");

const toDoSchema = ({
	title:{type:String,required:true,unique:true},
	order:{type:Number},
	completed:{type:Boolean}
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const Todo = mongoose.model("Todo", toDoSchema);

app.use('/static', express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html");
});

// put routes here
app.post("/api/todos",function(req,res){
	let todo = new Todo({
		title:req.body.title,
		order:req.body.order,
		completed:req.body.completed
	});

	todo.save().then(function(Todo){
	console.log("data successfully saved");
	}).catch(function(err){
		res.send("errors");
	});
});

app.get("/api/todos",function(req,res){
	Todo.find().then(function(todos){
		if(todos){
			res.setHeader('Content-Type','application/json');
			res.status(200).json(todos);
		}else {
			res.send("nothing found");
		}
	}).catch(function(err){
			console.log(err);
	});
});

app.get("/api/todos/:id",function(req,res){
	Todo.findOne({_id:req.params.id}).then(function(todo){
		if(todo){
			res.setHeader('Content-Type','application/json');
			res.status(200).json(todo);
		}else {
			res.send("nothing found");
		}
	}).catch(function(err){
		console.log(err);
	});
});

app.put("/api/todos/:id",function(req,res){
	Todo.updateOne({_id:req.params.id}).then(function(todo){
		if(todo){
			res.setHeader('Content-Type','application/json');
			res.status(200).json(todo);
		}else {
			res.send("nothing found");
		}
	}).catch(function(err){
		console.log(err);
	});
});

app.delete("/api/todos/:id",function(req,res){
	Todo.deleteOne({_id:req.params.id}).then(function(todo){
		if(todo){
			res.setHeader('Content-Type','application/json');
			res.status(200).json(todo);	
		}else {
			res.send("unsuccessful")
		}
	}).catch(function(err){
		console.log(err);
	})
});

app.patch("/api/todos/:id",function(req,res){
	Todo.updateOne({_id:req.params.id},{$set:req.body}).then(function(update){
		if(update){
			res.setHeader('Content-Type','application/json');
			res.status(200).json(update);
			console.log(res.json())	
		}else {
			res.send("noooope didnt work brah")
		}
	}).catch(function(err){
		console.log(err)
	})
});

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/')
});
