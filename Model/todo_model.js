const mongoose = require('mongoose');

const UserTodoSchema = new mongoose.Schema({
                                        date:String,
                                        username:String,
                                        imp:String,
                                        todos:[String]
                                    });



const UserTodoModel = mongoose.model('todo',UserTodoSchema);

const conn = async function(){
    try {
        const connected = await mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,useUnifiedTopology:true});
        console.log("connected");
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = {UserTodoSchema:UserTodoSchema,UserTodoModel:UserTodoModel,connectfunc:conn};
