function requirelogin(req,res,next){
    if(!req.session.userid) return res.render('redirect',{message:{success:false,body:"You must be logged in to do that!"},url:"/login",time:3000});
    next();
}

function notrequirelogin(req,res,next){
    if(req.session.userid) return res.render('redirect',{message:{success:false,body:"You must be not logged in to do that!"},url:"/",time:3000});
    next();
}


module.exports = {requirelogin,notrequirelogin};