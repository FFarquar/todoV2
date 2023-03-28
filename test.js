//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// a new schema
const itemsSchema = new mongoose.Schema({
  name: String
});
const Item_m = mongoose.model("Item", itemsSchema);

//custom list schema
const listScehma = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
})

const list_m = mongoose.model("List", listScehma);

let db;

addDefaultItems();

//mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];



async function addDefaultItems() {

  
  //const db = await mongoose.connect('mongodb://127.0.0.1:27017/todoListDB');
  //db = await mongoose.connect('mongodb://127.0.0.1:27017/todoListDB');
  db = await mongoose.connect('mongodb+srv://DD_1:DD_1_PW@cluster1.eiy6kz9.mongodb.net/test')


  console.log("Connected");

    //checkign to see if there are any todos already, if so, dont add them
    let foundTodos = false;

    await Item_m.find({})
    .then(function (todos) {
      
      if (todos.length > 0) {
        console.log("Not adding any more todos");
        foundTodos = true;
      } else {
        console.log("Addng more todos");
      }
      console.log("Todos length = " + todos.length);
    })
    .catch(function (err) {
        console.log(err);
    });


    if (foundTodos === false) {
      //new mongoose documents
      const item_d_1 = new Item_m ({
        name: "Buy food"
      });
      
      const item_d_2 = new Item_m ({
        name: "Cook food"
      });
      
      const item_d_3 = new Item_m ({
        name: "Eat really very bad food"
      });

      const defaultItems = [item_d_1, item_d_2, item_d_3];
    // console.log("About to insert many...");
      await Item_m.insertMany(defaultItems);
      console.log("have inserted many...");      
    }



    //searching for the todos in the DB and showign in the console. Not really needed
    await Item_m.find({})
    .then(function (todos) {
      //mongoose.connection.close();
      todos.forEach(element => {
        console.log(element.name)
      });

    })
    .catch(function (err) {
        console.log(err);
    });

/*     await mongoose.connection.close();
    console.log("Connection closed..."); */
 
}

function returnDefaultItemsForNewList(listName) {

  const list_d_1 = new list_m ({
    name: "Buy food for new list " + listName
  });
  
  const list_d_2 = new list_m ({
    name: "Cook food for new list " + listName
  });
  
  const list_d_3 = new list_m ({
    name: "Eat really very bad food for new list " + listName
  });

  const list = new list_m({
    name: listName,
    items:  [list_d_1, list_d_2, list_d_3]
  })
  return list;
  
}

app.get("/", function(req, res) {

  //find all the todos
  Item_m.find()
    .then(function (todos) {
    res.render("list", {listTitle: "Today", newListItems: todos});
    console.log("When rendering Todos, found this many in the DB..." + todos.length);
  })
  .catch(function (err) {
      console.log(err);
  });
});

/* async function addNewTodo(todo) {
      //new mongoose documents
      const newTodo = new Item_m ({
        name: todo
      });
  //console.log("adding new item...");      

  if ( todo != "") {
    await Item_m.create(newTodo);    
    console.log("have added new item...");      
  }else {
    console.log("todo is blank, not adding it...");      
  }
};
 */

/* async function addNewThingToAList(listName, itemText) {

  //listName is the name of the list to be added too
  //itemText is the text that is to be added



  if (listName != "Today") {
    //if the list isn't today, use the generic List  model

    console.log("about to add genericList...");      
    const listItem = new list_m({name:itemText});
    const genericList = new list_m ({name: listName, items: [listItem]});
    console.log("genericList created...");

    if (genericList != "") {

      await list_m.create(genericList);    //this line is crashing
      console.log("have added new generic item...");      
    }else {
      console.log("new generic item is blank, not adding it...");      
    }


  } else {
    //if the list is Today, use the item model
    //new mongoose document using the Item model

    console.log("adding default Today...");      
    const newToday = new Item_m ({name: itemText});
    console.log("created the newToday object...");      

    if ( newToday != "") {
      await Item_m.create(newToday);    
      console.log("have added new Today item...");      
    }else {
      console.log("new Today is blank, not adding it...");      
    }

  }


//console.log("adding new item...");      

}; */

async function addNewThingToAList(listName, itemText) {

  //listName is the name of the list to be added too
  //itemText is the text that is to be added



  if (listName != "Today") {

    console.log("Creating listsDB collection...");      

   // const database = client.db("sample_mflix");
    const listsDB = db.collection("lists");

    // create a filter for a list to update
    const filter = { name: listName };

    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };

    const listItem = new list_m({name:itemText});
    const genericList = new list_m ({name: listName, items: [listItem]});

    const result = await listsDB.updateOne(filter, genericList, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );


    //if the list isn't today, use the generic List  model



    console.log("about to add genericList...");      
    //const listItem = new list_m({name:itemText});
    //const genericList = new list_m ({name: listName, items: [listItem]});
    console.log("genericList created...");

    if (genericList != "") {

      await list_m.create(genericList);    //this line is crashing
      console.log("have added new generic item...");      
    }else {
      console.log("new generic item is blank, not adding it...");      
    }
 

  } else {
    //if the list is Today, use the item model
    //new mongoose document using the Item model

    console.log("adding default Today...");      
    const newToday = new Item_m ({name: itemText});
    console.log("created the newToday object...");      

    if ( newToday != "") {
      await Item_m.create(newToday);    
      console.log("have added new Today item...");      
    }else {
      console.log("new Today is blank, not adding it...");      
    }

  }


//console.log("adding new item...");      

};

/*app.post("/", function(req, res){

  const item = req.body.newItem;

  console.log("adding ..." + item);      
  addNewTodo(item);
  res.redirect("/");
  
  //not handling work items at this time
   if (req.body.list === "Work") {  
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
 
});
*/
app.post("/", function(req, res){

  const item = req.body.newItem;
  const list = req.body.list;

  console.log("List to add to = " + list);
  console.log("Item text = " + item);
  

  addNewThingToAList(list,item);

  if (list !="Today") {
      res.redirect("/"+list);  
  } else {
    res.redirect("/");  
  }

  
});

/*  app.post("/delete", function(req, res){
  
  const item = req.body.checkbox;
  console.log("deleting ..." + item);
  
  deleteTodo(item);
  //Item_m.deleteOne({_id: item});
  Item_m.findByIdAndDelete({_id: item});
  res.redirect("/");
  
}); */
/* async function deleteTodo(itemID) {
  await Item_m.deleteOne({_id: itemID});
}; */

app.post("/delete", async(req, res) =>{
  
  const item = req.body.checkbox;
  console.log("deleting ..." + item);
  
  const data = await Item_m.findByIdAndRemove(item);

  if(data){
    res.redirect('/');
  } 
  
});

//app.get('/category/:todoType', async(req, res) =>{
 app.get('/:customListName', async(req, res) =>{
  customListName = req.params.customListName;

  console.log("CustomListName ..." + customListName);;


  try {
    let listReturn = await list_m.findOne({name: customListName})  
  //  console.log("Findone worked... ");
    if (!listReturn) {
      console.log("nothing found");

      ///Write default items to database
      await list_m.insertMany(returnDefaultItemsForNewList(customListName));
      res.redirect("/" + customListName);
    } else {

      console.log("Stuff found");
      res.render("list", {listTitle: customListName, newListItems: listReturn.items});  
      
    }
    
  } catch (error) {
    console.log("Findone didnt work ");
    console.log(error);
  }

/*   await list_m.find({name: customListName})
  .then(async function (customListFound) {

    customListFound.forEach(element => {
      console.log("Items found in the list from the find " + element.items)
    });

    if (customListFound.length > 0) {
      console.log("Items for list " + customListName + " found. Not adding default items");
      console.log("These items found in the list " + customListFound.name);
      //res.render("list", {listTitle: customListName, newListItems: lists.items});
      
    } else {

      //create a new list
      console.log("Addng Default items for list " + customListName);

      ///Write default items to database
      await list_m.insertMany(returnDefaultItemsForNewList(customListName));
      //console.log("Default items returned " + returnDefaultItemsForNewList(customListName));
      res.redirect("/" + customListName);
    }
    
  })
  .catch(function (err) {
      console.log(err);
  }); */


});



/* app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
}); */

app.get("/about", function(req, res){
  res.render("about");
});

/* app.listen(3000, function() {
  console.log("Server started on port 3000");
});
 */
app.listen(process.env.PORT || 3000, function(){
  console.log("server is running on port "+ process.env.PORT)
})

///////////////////////////////////////////////////
//All this code is to ensure the connection to the database is closed when the app stops running
//For what ever reason.
/* process.stdin.resume();//so the program will not close instantly

 function exitHandler(options, exitCode) {

  //Checking to see if the Database connection has been closed....
  console.log("DB ready state " + db.connection.readyState);

  if (db.connection.readyState === 1) {
    console.log("Closing connection...");
    db.connection.close();

    //waiting for the connection to be closed before continuing
    do {
      console.log("Closing connection... Ready state = " + db.connection.readyState + " " + Date.now());
    } while (db.connection.readyState != 1);
  }

    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true})); */

//End of code that handles shut down of the application
/////////////////////////////////////////////////