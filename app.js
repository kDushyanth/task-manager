const express = require('express');
const bodpParser = require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');
const session = require('express-session');
const expresslayouts = require('express-ejs-layouts');
const mongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('connect-flash');
const passportlocal = require('passport-local');
const LocalStrategy = passportlocal.Strategy;
var dotenv = require('dotenv');
const routes = require('./routers/route');
const cors = require('cors');
dotenv.config({ path:'./config/config.env' });

const app = express();
const user_model = require('./Model/user_model');
const todo_model = require('./Model/todo_model');
const UserTodoModel = todo_model.UserTodoModel;
const UserTodoSchema = todo_model.UserTodoSchema;
const UserSchema = user_model.UserSchema;
const UserModel = user_model.UserModel;
const port = process.env.PORT || 3000;

todo_model.connectfunc();
app.use(cors());
app.use(expresslayouts);
app.set('view engine','ejs');
app.use(bodpParser.urlencoded({extended:true}));
app.use(bodpParser.json());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24*5
    },
    store:new mongoStore({ mongooseConnection: mongoose.connection,collection:"sessions" })
}));
app.use(express.static('public'));
app.use(flash());
app.use((req,res,next)=>{
        res.locals.success_msg = req.flash('success');
        res.locals.error_msg = req.flash('error');
        res.locals.username = req.flash('username');
        res.locals.password = req.flash('password');
        next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({passReqToCallback:true},
    async function(request,username,password,done){
       
        try {
            
            const user = await UserModel.findOne({username:username});
            if(!user){
                    request.flash("username",request.body.username);
                    request.flash("password",request.body.password);
                    return done(null,false,{message:"Invalid user name or password"});
            }else{
                const validp = validPassword(password,user.hash,user.salt);
                if(!validp)
                {
                    request.flash("username",request.body.username);
                    request.flash("password",request.body.password);
                    return done(null,false,{message:"Invalid user name or password"});

                }
                else{
                    return done(null,user);
                }
            }
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser(function(user,done){
    done(null,user.username);
});
passport.deserializeUser(async function(username,done){
    try {
        const UserTodos = await UserTodoModel.find({username:username});
        done(null,UserTodos);
    } catch (error) {
        done(error);
    }
});
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        req.flash('error',"You're not Authenticated");
        res.redirect("/api/users/login");
    }
}
app.get('/',(req,res)=>{
    if(req.isAuthenticated()){
        res.redirect('/api');
    }else{
        req.flash('error',"Login");
        res.redirect("/api/users/login");
    }
});
app.use('/api',routes);
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

app.listen(port,()=>{
    console.log(`listening at port ${port}`);
});

