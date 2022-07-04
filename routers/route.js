const todoController = require('../controllers/todos_controller');
const userController = require('../controllers/users_controller');
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.route('/').get(checkAuthentication,todoController.getHome);
router.route('/create').post(checkAuthentication,todoController.createTodo)
                       .get(checkAuthentication,todoController.getCreate);
router.route('/about').get(checkAuthentication,todoController.getAbout);
router.route('/day/:date').get(checkAuthentication,todoController.getTodosOfDay);
router.route('/addtodo/:date').put(checkAuthentication,todoController.postTodoOfDay);
router.route('/deltodo/:date').put(checkAuthentication,todoController.deleteTodoofDay);
router.route('/del/:date').delete(checkAuthentication,todoController.deleteTodosOfDay);
router.route('/users/login').get(userController.getLogin)
                            .post(loginValidator,passport.authenticate('local',{failureRedirect:'/api/users/login',successRedirect:'/api',failureFlash:true}),(err,req,res,next)=>{
                                if(err)next(err);
                            });

router.route('/users/register').get(userController.getRegister)
                               .post(userController.postRegister);

router.route('/users/logout').get(checkAuthentication,userController.Logout);


function loginValidator(req, res, next){
    //validate 
    if(req.body.username.trim()=="" || req.body.password.trim()==""){
        res.render('login',{title:"login",err:["fill all the entries"],username:req.body.username,password:req.body.password});
    }
    else {
          next();
        }
 }     
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        req.flash('error',"You're not Authenticated");
        res.redirect("/api/users/login");
    }
}
module.exports = router;
