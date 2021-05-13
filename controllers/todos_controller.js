const user_model = require('../Model/todo_model');
const todo_model = require('../Model/todo_model');
const Model = todo_model.UserTodoModel;
const Schema = todo_model.UserTodoSchema;
const UserSchema = user_model.UserSchema;
const UserModel = user_model.UserModel;

const getHome = async function(request,response){
    
    if(request.isAuthenticated()){
        const found = await Model.find({username:request.session.passport.user});
        response.render('index.ejs',{info:found,title:"home"});
    }else{
        request.flash('error',"You're not authenticated");
       response.redirect('/api/users/login');
   }
}
const createTodo = async (request,response)=>{
    //console.log(typeof(request.body.todos)=="string");
    request.body.imp = request.body.imp.trim(); 
   if(request.body.date=="" || request.body.imp==""){
       response.render('create',{title:"create",msg:["please check the following"],errors:{date:"enter the date",imp:"enter the important event"},data:request.body,todolen:typeof(request.body.todos)=="string"?1:request.body.todos.length });
   }
   else{
       var data = request.body;
       //console.log(data);
       for(let i=0;i<data.todos.length;i++){
        data.todos[i] = data.todos[i].trim();
       }
       request.body.username = request.session.passport.user;

       try {
                const ModelObj = new Model(request.body);
                const found = await ModelObj.save();
                //console.log(found);
                response.status(200).redirect('/api');
       } catch (error) {
           console.log('error');
       }
   }
    
};
const getCreate = (request,response)=>{
    response.render('create.ejs',{title:"create",msg:[],data:{date:"",imp:""},errors:{date:"",imp:""},todolen:0});
};
const getAbout = (request,response)=>{
    response.render('about',{title:"about"});
};

const getTodosOfDay = async function(request,response){
    if(request.params.date=="init"){
        const date = (new Date()).toISOString().slice(0,10);
        const str = (date).substring(0,4)+(date).substring(5,7)+(date).substring(8,10);
        try {
            //console.log(str);
            const found = await Model.findOne({date:(str)});
            //console.log(found);
            if(found!=null){
                response.render('day.ejs',{title:"day",data:found,present:1});
            }
            else{
                response.render('day.ejs',{title:"day",msg:"No Todos for Today",present:0});
            }
        } catch (error) {
            console.log(error);
        }
    }else{
        try {
            const str = (request.params.date);
            //console.log(str);
            const found = await Model.findOne({date:(str),username:request.session.passport.user});
            //console.log(found);
            if(found==null)response.render('day.ejs',{title:"day",msg:"No Todos for Today",present:0});
            else{
                response.render('day.ejs',{title:"day",data:found,present:1});
            }
        } catch (error) {
            console.log(error);
        }
    }
    
};

const postTodoOfDay = async (request,response)=>{
    //console.log(request.body);
    const found = await Model.updateOne({ date:request.params.date,username:request.session.passport.user },
         {
            $push: {
            todos:request.body.item
            }
         });
    // console.log(found);
   response.status(200).json({msg:request.body.item});
}

const deleteTodoofDay = async function(request,response){
    const deletedata = request.body.data;
    //console.log(deletedata.trim());
    try {
        Model.updateOne(
            {username:request.session.passport.user,date:request.params.date},
            { $pull: {  todos: deletedata.trim() } },
            { multi: false },(err,item)=>{
                if(err)console.log(err);
                else{
                //console.log(item);
                response.status(200).json({msg:deletedata});
                }
            }
        );
    } catch (error) {
        console.log(error);
    }  
};

const deleteTodosOfDay = async function(request,response){
    try {
        const found = await Model.findOneAndRemove({date:request.params.date});
       // console.log(found);
        response.status(200).json("success");
    } catch (error) {
        console.log(error);
    }
};



module.exports.getHome = getHome;
module.exports.createTodo = createTodo;
module.exports.getCreate = getCreate;
module.exports.getAbout = getAbout;
module.exports.getTodosOfDay = getTodosOfDay;
module.exports.postTodoOfDay = postTodoOfDay;
module.exports.deleteTodoofDay = deleteTodoofDay;
module.exports.deleteTodosOfDay = deleteTodosOfDay;
