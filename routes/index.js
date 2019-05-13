var express = require("express");
var router = express.Router();
var path = require("path");
const request = require('request');
var fs = require('fs');
var nodemailer = require("nodemailer");

//require Model
var User = require.main.require("./models/user");
var Folder = require.main.require("./models/folder");
var TinDang = require.main.require("./models/tindang");
var DM_Cha = require.main.require("./models/dMChaModel");
var DM_Con = require.main.require("./models/dMConModel");
var BC_Tin=require.main.require("./models/baocaoTinModel");
var UserTheoDoi= require.main.require("./models/userTheoDoiModel");
var TinDangTheoDoi=require.main.require("./models/tinDangTheoDoiModel");
var Mail=require.main.require("./models/mail")
var Carousel=require.main.require("./models/carousel")
var GopY=require.main.require("./models/gopy")
// Connect to DB
var dbConfig = require.main.require("./db");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
mongoose.connect(dbConfig.url, { useMongoClient: true });
var session = require("express-session");
// router


router.get("/login-register", function(req, res) {
  res.render("login-register");
});
router.get("/register", function(req, res) {
  res.render("login-register1");
});


router.get("/loginloi", function(req, res) {
  res.render("login", { message: "Login Failed" });
});

router.get("/blog", function(req, res) {
  res.render("blog");
});
router.get("/blog/noiquy", function(req, res) {
  if(req.session.email){  
    res.render("blog_noiquy",{sess:"1"});					
    }else
    res.render("blog_noiquyt")
});
router.get("/blog/hangcam", function(req, res) {
  if(req.session.email){  
    res.render("blog_hangcam",{sess:"1"});					
    }else
    res.render("blog_hangcam")
});
router.get("/blog/meomuaban",function(req,res){
  if(req.session.email){  
    res.render("blog_meomuaban",{sess:"1"});					
    }else
    res.render("blog_meomuaban")
})
router.get("/blog/muabanantoan",function(req,res){
  if(req.session.email){  
    res.render("blog_muabanantoan",{sess:"1"});					
    }else
    res.render("blog_muabanantoan")
})

router.get("/contact", function(req, res) {
  if(req.session.email){  
  res.render("contact",{sess:"1"});					
  }else
  res.render("contact")
});


router.get('/404',function(req,res){
  if(req.session.email){  
    res.render("404",{sess:"1"});					
    }else
    res.render("404")
})
router.get('/505',function(req,res){
  if(req.session.email){  
    res.render("505",{sess:"1"});					
    }else
    res.render("505")
})
router.get('/jsoff',function(req,res){
  if(req.session.email){  
    res.render("js_off",{sess:"1"});					
    }else
    res.render("js_off")
})
/**
 * Regex
 */
var Regex_email=/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
var Regex_pass=/^[a-z0-9_-]{6,18}$/
var Regex_Name=/^[a-z0-9_-]{3,16}$/
var Regex_day=/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
var Regex_sDT=/^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/
var Regex_Anh=/^(.*\.(?!(png|jpg|gif)$))?[^.]*$/
/**
 * !USER
 */
//user:lấy thông tin cá nhân 

router.get('/info',function(req,res){
  var email=req.session.email
   if (req.session.admin != null) {
       User.find({ email: req.session.email }, function(err, user) {
      if (err) res.render('500');
      res.render("admin_info", { user: user,sess:"1" });
    });
   }else{
        if (email != null) {
      User.find({ email: req.session.email }, function(err, user) {
        if (err) res.render('500');
        res.render("user", { user: user,sess:"1" });
      });
      } else {
        res.render("401", { message: "Login to continue" });
      }
   }
 
})
//user: lấy thông tin cá nhân của user khác
router.post('/info',function(req,res){
  var email=req.body.email_User
  if(req.session.email){
    if(req.session.email!==email){
      User.find({ email:email }, function(err, user) {
        if (err) res.render('500');
        if(user){
          res.render("user_khac", { user: user,email_User:email,sess:"1" });
        } else
        res.render('404');  
      });
    }else{
      res.redirect("info")
    }
  }else{
    User.find({ email:email }, function(err, user) {
      if (err) res.render('500');
      if(user){
        res.render("user_khac", { user: user,email_User:email });
      } else
      res.render('404');  
    });
  }
   
})
router.post('/info11',function(req,res){
  var id=req.body.idz
	console.log("TCL: idz", id)
    User.find({ _id:id }, function(err, user) {
			console.log("TCL: user", user[0].email)
      if (err) res.render('500');
      if(user){
        res.render("user_khac", { user: user,email_User:user[0].email });
      } else
      res.render('404');  
    });
})

//admin:lấy thông tin cá nhân 
router.get('/admin/info',function(req,res){
  if (req.session.admin != null) {
    User.find({ email: req.session.email }, function(err, user) {
      if (err) res.render('500');
        if(user){
          res.render("admin_info", { user: user });
        }else
        res.render('404'); 
    });
  } else {
    res.render("401", { message: "Login to continue" });
  }  
})

//user:sửa thông tin cá nhân cơ bản
router.post('/info/editbasic',function(req,res){
  if (req.session.email != null) {
    var name= req.body.name
    var email=req.session.email
    var sDT=req.body.sDT
    var gioiTinh=req.body.gioiTinh
    var ngaySinh=req.body.ngaySinh
    var diaChi=req.body.diaChi
    User.update(
      { email: email },
      {
      name:name,sDT:sDT,gioiTinh:gioiTinh,ngaySinh:ngaySinh,diaChi:diaChi
      },
       function(err, user) {
        if (err) res.render('500');
        res.render('user',{mesok:"đổi thông tin thành công!"});
    });
  } else {
    res.render("401", { message: "Login to continue" });
  }
})
//admin:sửa thông tin cá nhân cơ bản
router.post('/admin/info/editbasic',function(req,res){
  if (req.session.email != null) {
    var name= req.body.name
    var email=req.session.email
    var sDT=req.body.sDT
    var gioiTinh=req.body.gioiTinh
    var ngaySinh=req.body.ngaySinh
    var diaChi=req.body.diaChi
    User.update(
      { email: email },
      {
      name:name,sDT:sDT,gioiTinh:gioiTinh,ngaySinh:ngaySinh,diaChi:diaChi
      },
       function(err, user) {
        if (err) res.render('500');
        res.render('admin_info',{mesok:"đổi thành công!"});
    });
  } else {
    res.render("401", { message: "Login to continue" });
  }
})
//user:đổi pass
router.post('/info/editpass',function(req,res){
  if (req.session.email != null) {
   
    var email=req.session.email
    var passOld=req.body.passOld
    var passNew=req.body.passNew
    if( Regex_pass.exec(passNew)!=null){
      User.update(
        { email: email, password:passOld },
        {
          password:passNew
        },
         function(err, user) {
        
          if (err) res.render('500');
          if(user.n==1){
            res.render("user", { mesok: "đổi thành công!" }); //n là số dòng update thành công
          }
          else
          res.render('user',{mespass:"mật khẩu cũ không khớp,đổi thất bại"});
      });
    }else  res.render('user',{mespass:"vui lòng nhập đúng định dạng mật khẩu,mật khẩu phải có từ 6 ký tự trở lên"});
  
  } else {
    res.render("401", { message: "Login to continue" });
  }
})
//!admin:đổi pass
router.post('/admin/info/editpass',function(req,res){
  if (req.session.email != null) {
   
    var email=req.session.email
    var passOld=req.body.passOld
    var passNew=req.body.passNew
    if( Regex_pass.exec(passNew)!=null){
      User.update(
        { email: email, password:passOld },
        {
          password:passNew
        },
         function(err, user) {
        
          if (err) res.render('500');
          if(user.n==1){
            res.render("admin_info", { mesok: "đổi thành công" }); //n là số dòng update thành công
          }
          else
          res.render('admin_info',{mespass:"mật khẩu cũ không khớp,đổi thất bại"});
      });
    } else  res.render('admin_info',{mespass:"vui lòng nhập đúng định dạng mật khẩu,mật khẩu phải có từ 6 ký tự trở lên"});
  } else {
    res.render("401", { message: "Login to continue" });
  }
})


//user:Tin đang đăng
router.get('/info/tindadang',function(req,res){
  var email=req.session.email
  if(email!=null){
    TinDang.find({ email_User: email }, function(err, tindang) {
      if (err) res.render('500');
      if(tindang.n!==0){
        res.render('user_info_tindadang',{tindang:tindang});
      }else    
      res.render('user_info_tindadang',{mes:"không có tin  nào"});
    })
  }
  else
  res.render("401", { message: "Login to continue" });
})
//user khác:xem tin đang đăng của user khác
router.post('/info/khac/tindadang',function(req,res){
  var email=req.body.email_User
    TinDang.find({ email_User: email }, function(err, tindang) {
      if (err) res.render('500');
      if(tindang.n!==0){
        User.find({ email:email }, function(err, user) {
          res.render('user_khac_tindang',{user:user,tindang:tindang,email_User:email});
        })
      }else    
      res.render('404',{mes:"không có tin  nào"});
    })
})
//tin chờ duyệt
router.get('/info/tinchoduyet',function(req,res){
  var email=req.session.email
  if(email!=null){
    TinDangTheoDoi.find({email_User:email}, function(err, listIDTin) {
      if (err) throw err;
      for(i=0;i<listIDTin.length;i++){
        TinDang.find({ email_User: email,daDuyet:"0" }, function(err, tindang) {
      if (err) res.render('500');
      if(tindang.n!==0){
        res.render('user_info_tinchoduyet',{tindang:tindang});
      }else    
      res.render('user_info_tinchoduyet',{mes:"không có tin  nào"});
    })
      }
    });
  }
  else
  res.render("401", { message: "Login to continue" });
})

//!tin theo dõi (lưu tin)
//lấy tin theo dõi theo user
router.get('/info/tindaluu',function(req,res){
  var email=req.session.email
  if(email!=null){
    TinDangTheoDoi.find({email_User:email}, function(err, listIDTin) {
      if (err) throw err;
        res.render('user_info_tintheodoi',{listIDTin:listIDTin})
    }); 
  }
  else
  res.render("401", { message: "Login to continue" });
})
//user: xóa tin mà mình theo dõi
router.get('/info/delete/tindaluu/:id',function(req,res){
  var email=req.session.email
  if(email!=null){
    TinDangTheoDoi.remove({email_User:email,_id:req.params.id}, function(err, listIDTin) {
      if (err) render('500');
      res.redirect('/info/tindaluu')
    }); 
  }
  else
  res.render("401", { message: "Login to continue" });
})
//user: theo dõi 1 tin đăng
router.post('/tindaluu', function(req, res) {
  var email = req.session.email;
  var id_TinDangTheoDoi =req.body.id;
  var tieuDe =req.body.tieuDe;
  var nguoiDang =req.body.nguoiDang;
  if(email!=null){  
  TinDangTheoDoi.findOne({ id_TinDangTheoDoi: id_TinDangTheoDoi,email_User:email }, function(err, user) {
    if (err) throw err;
    else
    {
     if(user==null)
     {
        var newUser = TinDangTheoDoi({
            email_User: email,
            id_TinDangTheoDoi: id_TinDangTheoDoi,
            tieuDe:tieuDe,
            nguoiDang:nguoiDang              
        });
         newUser.save(function(err) {
         if (err) throw err;
         });
         res.redirect('/info/tindaluu');
     }
     else
     {  
          res.redirect('/info/tindaluu');
     }
    }
   });
  }else
  res.render("401", { message: "Login to continue" });
  });



/**
 * !KHÁCH
 */


router.get('/gallery',function(req,res){
  DM_Cha.find({},function(err,folders){
    //lấy carousel
    Carousel.find({},function(req,items){
     
      res.render('gallery1',{ folders: folders,slide:items });
    })
  })
})
//search
router.get('/search',function(req,res){
  DM_Cha.find({},function(err,folders){
    res.render('search',{ folders: folders });
  })
})
//lấy toàn bộ tin đăng cho theo danh mục cha
router.get('/gallery/:id_DMCha',function(req,res){
  var id_DMCha=req.params.id_DMCha
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    if(typeof(cha)!=="undefined"){
      DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
        if (err) res.render('500');
        if(typeof(folders)!=="undefined"){
          TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai: "1"}, function(err, tindang) {
            res.render("galleryChird1", { folders: folders,tindang:tindang,id_DMCha:id_DMCha});
            })
        } else
            res.render("404");
      });
    } else  res.render("404");
  })
  
})
//phân trang thường theo danh mục cha
router.get('/gallery/:id_DMCha/:page', (req, res, next) => {
    var id_DMCha=req.params.id_DMCha
    let perPage = 9;
    let page = req.params.page || 1;
    DM_Cha.findOne({_id:id_DMCha},function(err,cha){
      if(typeof(cha)!=="undefined"){
      DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
        if(typeof(folders)!=="undefined"){
        TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1"}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
          TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1"}).count((err, count) => {
            if (err) return next(err);
            res.render('galleryChird1', {
              id_DMCha:id_DMCha,
              folders:folders,
              current: page,
              tindang:tindang,
              id_DMCha:id_DMCha,
              pages: Math.ceil(count / perPage),
              loaiTrang:0
            })
          })
      })
    } else res.render('404')
    }); 
   } else res.render('404')
  }) ;
})

//sắp xếp tăng dần theo ngày đăng=> chỉ cần dựa vào id .sort({_id:1})
router.get('/gallery/:id_DMCha/indate/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 9;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    if(typeof(cha)!=="undefined"){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      if(typeof(cha)!=="undefined"){
      TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1"}).sort({_id:1}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
        TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1"}).count((err, count) => {
          if (err) return next(err);
          res.render('galleryChird1', {
            id_DMCha:id_DMCha,
            folders:folders,
            current: page,
            tindang:tindang,
            id_DMCha:id_DMCha,
            pages: Math.ceil(count / perPage),
            loaiTrang:2
          })
        })
    })
  }else res.render("404")  
  });
 }else res.render("404")  
}); 
})
//sắp xếp giảm dần theo ngày đăng
router.get('/gallery/:id_DMCha/descdate/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 9;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    if(typeof(cha)!=="undefined"){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      if(typeof(folders)!=="undefined"){
      TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1"}).sort({_id:-1}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
        TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1"}).count((err, count) => {
          if (err) return next(err);
          res.render('galleryChird1', {
            id_DMCha:id_DMCha,
            folders:folders,
            current: page,
            tindang:tindang,
            id_DMCha:id_DMCha,
            pages: Math.ceil(count / perPage),
            loaiTrang:3
          })
        })
    })
  }else res.render("404")  
  });  
}else res.render("404")  
}) ;
})
//sắp xếp tăng theo giá
router.get('/gallery/:id_DMCha/ingia/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 9;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    if(typeof(cha)!=="undefined"){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      if(typeof(folders)!=="undefined"){
      TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1"}).sort({gia:1}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
        TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1"}).count((err, count) => {
          if (err) return next(err);
          res.render('galleryChird1', {
            id_DMCha:id_DMCha,
            folders:folders,
            current: page,
            tindang:tindang,
            id_DMCha:id_DMCha,
            pages: Math.ceil(count / perPage),
            loaiTrang:4
          })
        })
    })
  }else res.render("404")  
  });
}else res.render("404")      
}) ;
})
//sắp xếp giảm theo giá
router.get('/gallery/:id_DMCha/descgia/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 9;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    if(typeof(cha)!=="undefined"){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      if(typeof(folders)!=="undefined"){
      TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1"}).sort({gia:-1}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
        TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1"}).count((err, count) => {
          if (err) return next(err);
          res.render('galleryChird1', {
            id_DMCha:id_DMCha,
            folders:folders,
            current: page,
            tindang:tindang,
            id_DMCha:id_DMCha,
            pages: Math.ceil(count / perPage),
            loaiTrang:5
          })
        })
    })
  }else res.render("404")  
  });
}else res.render("404")      
}) ;
})

//sắp theo tin bán
router.get('/gallery/:id_DMCha/tinban/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 9;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    if(typeof(cha)!=="undefined"){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      if(typeof(folders)!=="undefined"){
      TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1",loaiTinDang:"1"}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
        TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1",loaiTinDang:"1"}).count((err, count) => {
          if (err) return next(err);
          res.render('galleryChird1', {
            id_DMCha:id_DMCha,
            folders:folders,
            current: page,
            tindang:tindang,
            id_DMCha:id_DMCha,
            pages: Math.ceil(count / perPage),
            loaiTrang:6
          })
        })
    })
  }else res.render("404")  
  }); 
}else res.render("404")     
}) ;
})
//sắp xếp theo tin mua
router.get('/gallery/:id_DMCha/tinmua/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 9;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    if(typeof(cha)!=="undefined"){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      if(typeof(folders)!=="undefined"){
      TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1",loaiTinDang:"0"}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
        TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1",loaiTinDang:"0"}).count((err, count) => {
          if (err) return next(err);
          res.render('galleryChird1', {
            id_DMCha:id_DMCha,
            folders:folders,
            current: page,
            tindang:tindang,
            id_DMCha:id_DMCha,
            pages: Math.ceil(count / perPage),
            loaiTrang:7
          })
        })
    })
  }else res.render("404")  
  });   
}else res.render("404")   
}) ;
})
// router.get('/gallery/:id_DMCha/:id_DMCon',function(req,res){
//   var id_DMCha=req.params.id_DMCha
//   DM_Cha.findOne({_id:id_DMCha},function(err,cha){
//     DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
//       TinDang.find({dmCon:req.params.id_DMCon}, function(err, tindang) {
// 				console.log("TCL: tindang", tindang)
//         if (err) throw err;
//         res.render("galleryChird1", {  folders: folders,tindang: tindang,id_DMCha:id_DMCha });
//       });
//     })
//   })   
// })
//theo loai danh muc con
router.get('/gallery/:id_DMCha/:id_DMCon/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 9;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    if(typeof(cha)!=="undefined"){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      if(typeof(folders)!=="undefined"){
      TinDang.find({dmCon:req.params.id_DMCon,daDuyet:"1",trangThai:"1"}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
        TinDang.find({dmCon:req.params.id_DMCon,daDuyet:"1",trangThai:"1"}).count((err, count) => {
          if (err) return next(err);
          res.render('galleryChird1', {
            id_DMCha:id_DMCha,
            folders:folders,
            current: page,
            tindang:tindang,
            id_DMCon:req.params.id_DMCon,
            pages: Math.ceil(count / perPage),
            loaiTrang:1
          })
        })
    }) 
  }else res.render("404")  
  }); 
}else res.render("404")     
}) ;
})
/**
 * !Tìm Kiếm
 * todos tìm kiếm bài đăng dựa theo các tiêu chí: dm,tỉnh thành,loại tin
 * ? dùng session lưu lại kq để cho dễ về sau
 */
router.get('/search/baidang', (req, res, next) => {
  //lay thong tin
  var query = require('url').parse(req.url,true).query;
  var id_DMCha=query.dmcha
  var id_DMCon=query.dmCon
  var tinh=query.tinh
 
  var loaiTinDang=query.loaiTinDang

  let perPage = 9;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      TinDang.find({dmCon:id_DMCon,daDuyet:"1",trangThai:"1",tinh:tinh,loaiTinDang:loaiTinDang}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
        TinDang.find({dmCon:id_DMCon,daDuyet:"1",trangThai:"1",tinh:tinh,loaiTinDang:loaiTinDang}).count((err, count) => {
          if (err) return next(err);
          res.render('galleryChird1', {
            id_DMCha:id_DMCha,
            folders:folders,
            current: page,
            tindang:tindang,
            id_DMCon:req.params.id_DMCon,
            pages: Math.ceil(count / perPage),
            loaiTrang:"timkiem"
          })
        })
    }) 
  });    
}) 
})

//chi tiết 1 tin đăng
router.get('/chitiettd/:idTinDang',function(req,res){
  var id= req.params.idTinDang
  TinDang.findOne({_id:id},function(err,item){
	
    if (typeof(item)!=="undefined") {
		
      
           //?hiện tên quận huyện xã
           var linkxa='https://thongtindoanhnghiep.co/api/ward/'+item.xa
           request(linkxa, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var info = JSON.parse(body)			
              item.diaChi=item.diaChi+","+info.QuanHuyenTitle+","+info.Title+",Tỉnh"+info.TinhThanhTitle
              if(item.loaiTinDang==="1") item.loaiTinDang="Tin Bán"
              else item.loaiTinDang="Tin Mua";
              if(item.thoiHan===",") item.thoiHan="Không Thời Hạn"
              
              //tìm các báo cáo tin đăng này
              BC_Tin.find({id_TinDang:id}, function(err, items1) {
              if (err) throw err;
              res.render('chitiettd', {lst_BCTin:items1,tindang:item}); 
              })   
           };
          })
    }
    else{
      res.render("404")
    };   
  })
})


/**
 * router
 */
//Home
router.get("/", function(req, res) {
    res.redirect("/gallery")
});

//Logout
router.get("/signout", function(req, res) {
  req.session.destroy();
  res.render("login-register");
});
//gửi mail tự động
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tuyennvhtam@gmail.com',
    pass: 'One23456!'
  }
});


//Sign Up
router.post("/signup", function(req, res) {
  var un = req.body.email;
  var pwd = req.body.password;
  var name=req.body.name

  if(Regex_email.exec(un)!==null && Regex_pass.exec(pwd)!=null && Regex_Name.exec(name)!=null){
    User.findOne({ email: un }, function(err, user) {
      if (err) throw err;
      else {
        if (user == null) {
          var newUser = User({
            email: req.body.email,
            password: req.body.password,
            name: name,
            avatar: "avdefault.jpg",
            diaChi:"chưa cập nhật",
            sDT:"chưa cập nhật",
            ngaySinh:"chưa cập nhật",
            gioiTinh:"chưa cập nhật",
            loaiTaiKhoan:"1",
            trangThai:"0"
          });
          // save the user
          User.create(newUser,function(err,doc) {
            if (err) throw err;
            var yes="https://raovatsv.herokuapp.com/users/xacnhan/1/"+doc._id;
            var no="https://raovatsv.herokuapp.com/users/xacnhan/0/"+doc._id;
              var mailOptions = {
                from: 'tuyennvhtam@gmail.com',
                to: un,
                subject: 'XÁC NHẬN ĐĂNG KÝ TẠI RAO VẶT SINH VIÊN',
                text: '',
                html:'<p>Hi,bạn hoặc ai đó đã vào web rao vặt sinh viên đăng kí tài khoản .Nếu là bạn xin vui lòng kich hoạt tài khoản tại:' +'<br>'+yes+'<br>'+
                '.Nếu không vui lòng chọn:'+no+'để bỏ qua email này </p>'
              
              };
              transporter.sendMail(mailOptions,function(error,info){
                if(error){
                    return console.log("ko gui dc mail"+error);
                }
                console.log("Message sent:"+info.response)
              });
              res.render("login-register1", { message1: "Tạo tài khoản thành công ,vui lòng vào email để kích hoạt tài khoản" });
          });
         
  
        } else {
          res.render("login-register1", { message2: "Tạo tài khoản thất bại,mail hoặc tên người dùng đã tồn tại." });
        }
      }
    });
  } else
  res.render("login-register1", { message2: "email hoặc mật khẩu không hợp lệ" });    
});
//xác nhận mail có tạo tài khoản thành viên
router.get('/users/xacnhan/:kk/:_id', function(req, res) {
  var trangThai="1";
  if(req.params.kk!="0") trangThai="4";
   User.update({
      _id:req.params._id,trangThai:"0"
 }, {
   trangThai:trangThai
 }, function (err, folders) {
     if (err) {
         return res.render(500);
     } else {
       if(typeof(folders)!=="undefined"){
        res.render("login-register", { message1: "xác nhận thành công ,vui lòng đăng nhập" })
       } else res.render("404")
      
     }
 }
 );
 });

 //lấy lại mật khẩu
 router.post("/laylaipass",function(req,res){
 var email=req.body.email;
 User.findOne({email:email},function(err,user){
      if(err) res.render("500")
      else{
        if(user!=null){
          //gửi mail
          var mailOptions = {
            from: 'tuyennvhtam@gmail.com',
            to: email,
            subject: 'LÂY LẠI MẬT KHẨU ĐĂNG NHẬP TẠI WEB RAO VẶT SINH VIÊN',
            text: 'Hi,bạn hoặc ai đó đã vào web rao vặt sinh viên để lấy lại mật khẩu .Mật khẩu của bạn là:'+ user.password
            +'     nếu không vui lòng bỏ qua email này'
          };
          transporter.sendMail(mailOptions,function(error,info){
            if(error){
              res.render("login-register", { message2: "email bạn nhập không đúng ,vui lòng kiểm tra lại" });
            }
            console.log("Message sent:"+info.response)
          });
          res.render("login-register", { message1: "lấy mật khẩu thành công ,vui lòng vào email để lấy lại mật khẩu" });
        }else{
          res.render("login-register", { message2: "email bạn nhập không đúng ,vui lòng kiểm tra lại" });
        }
      }
  })
 })

//!login
router.post("/login", function(req, res) {
  var un = req.body.email;
  var pwd = req.body.password;
  if(Regex_email.exec(un)!==null && Regex_pass.exec(pwd)!=null){
    var exists = User.findOne({ email: un, password: pwd ,trangThai:"1"}, function(err, user) {
      if (err) throw err;
      else {
        if (user == null) {
          res.render("login-register", { mesLog: "Sai email tài Khoản hoặc mật khẩu" });
        } else {
          //kiểm tra có phải là admin ko
          if(user.loaiTaiKhoan=="3"){
            req.session.email = un;
            req.session.admin = un;
            req.session.ID=user._id
            req.session.US=user
            res.redirect('/admin/info')
          } else{
            req.session.email = un;
            req.session.ID=user._id
            req.session.US=user
           
          

            res.redirect('/info')
          }
          
        }
      }
    });
  }else{
    res.render("login-register", { mesLog: "vui lòng nhập chính xác các trường!" });  
  }
});


/**
 * !bảng users: biến User
 */
//?get profile
// router.get("/profile", function(req, res) {
//   console.log("call to folders.." + req.session.email);
//   if (req.session.email != null) {
//     User.find({ email: req.session.email }, function(err, user) {
//       if (err) throw err;

//       // object of all the users
//       console.log(user);
//       res.render("user", { user: user });
//     });
//   } else {
//     res.render("error", { message: "Login to continue" });
//   }
// });

//upload file
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/upload"); //đường đẫn
  },
  filename: function(req, file, cb) {
    cb(null, Date.now()+'-'+file.originalname);
    //file originalname:tên mặc định trước upload
  }
});
var upload = multer({ storage: storage });

//? upload image profile
// router.post("/profile/upload", upload.single("file"), function(req, res) {
//   User.update(
//     {
//       email: req.session.email
//     },
//     {
//       avatar: req.file.filename //filename:tên sau khi upload có kèm theo date.now()
      
//     },
//     function(err, folders) {
//       if (err) {
//         return res.status(500).json(err);
//       } else {
//         User.find({ email: req.session.email }, function(err, user) {
//           if (err) throw err;

//           res.render("user", { user: user });
//         });
//       }
//     }
//   );
// });
//!xóa upload file cũ đi
//! user đổi ảnh
router.post("/info/editavatar", upload.single("file"), function(req, res) {
  User.findOne({email: req.session.email},function(err,item){
    if(item){
      if(Regex_Anh.exec(req.file.filename)==null){
        var link='public/upload/'+item.avatar;
        fs.unlink(link, function (err) {
        User.update(
          {
            email: req.session.email
          },
          {
            avatar: req.file.filename //filename:tên sau khi upload có kèm theo date.now()
            
          },
          function(err, folders) {
            if (err) {
              return res.status(500).json(err);
            } else {
              User.find({ email: req.session.email }, function(err, user) {
                if (err) throw err;
      
                res.render("user", { mesok: "đổi ảnh thành công"  });
              });
            }
          }
        );
        })
      } else  res.render("user", { mespass: "vui lòng chọn ảnh có định dạng ảnh được hổ trợ jpg,png,gif"  });
    
    } else  res.render("401")
  })
 
});
//! admin đổi ảnh
router.post("/admin/info/editavatar", upload.single("file"), function(req, res) {
  User.findOne({email: req.session.email},function(err,item){
    if(item){
      if(Regex_Anh.exec(req.file.filename)==null){
        var link='public/upload/'+item.avatar;
        fs.unlink(link, function (err) {
          User.update(
            {
              email: req.session.email
            },
            {
              avatar: req.file.filename //filename:tên sau khi upload có kèm theo date.now()
              
            },
            function(err, folders) {
              if (err) {
                return res.status(500).json(err);
              } else {
                User.find({ email: req.session.email }, function(err, user) {
                  if (err) throw err;
        
                  res.render("admin_info", { mesok: "đổi ảnh thành công"  });
                });
              }
            }
          );
        })
      } else  res.render("user", { mespass: "vui lòng chọn ảnh có định dạng ảnh được hổ trợ jpg,png,gif"  });
    }else  res.render("401")
  })
});


//? XÓA edit profile
// router.post("/profile/edit", function(req, res) {
//   var pass = req.body.password,
//     name = req.body.name;
//   User.update(
//     {
//       email: req.session.email
//     },
//     {
//       password: pass,
//       name: name
//     },
//     function(err, folders) {
//       if (err) {
//         return res.status(500).json(err);
//       } else {
//         User.find({ email: req.session.email }, function(err, user) {
//           if (err) throw err;

//           res.render("user", { user: user });
//         });
//       }
//     }
//   );
// });

//admin: xem tất cả các user thành viên
router.get("/admin/users",function(req,res){
  if(req.session.admin){
  User.find({},function(req,items){
    //xử lý dữ liệu loại tài khoản, trang thái
    for(i=0;i<items.length;i++){
      if(items[i].loaiTaiKhoan==="1") items[i].loaiTaiKhoan="User-Thường"
      if(items[i].loaiTaiKhoan==="3") items[i].loaiTaiKhoan="ADMIN"
      if(items[i].trangThai==="1") items[i].trangThai="active"
      if(items[i].trangThai==="2") items[i].trangThai="lock"
      if(items[i].trangThai==="0") items[i].trangThai="unconfirmed"
    }
    res.render("admin_users",{users:items})
  })
} else res.render("403")
})
//admin: xóa tài khoản thành viên
router.get('/admin/users/delete/:_id', function(req, res) {
  if(req.session.admin){
   User.remove({ _id:req.params._id }, function(err) {
    if (err) {
         res.render("500") 
    }
    else {
        res.redirect('/admin/users')           
    }
    });
  } else res.render("403")
})
//admin: khóa tài khoản thành viên
//admin: set tài khoản admin
router.post('/admin/users/edit', function(req, res) {
  if(req.session.admin){
 var loaiTaiKhoan=req.body.loaiTaiKhoan;
 var trangThai=req.body.trangThai
  User.update({
     _id:req.body._id
}, {
  loaiTaiKhoan:loaiTaiKhoan,
  trangThai:trangThai
}, function (err, folders) {
    if (err) {
        return res.render("500");
    } else {
     //chuyển router
      res.redirect('/admin/users')
    }
}

);
  } else res.render("403")
})


/**
 * !bảng tindang: biến TinDang -view: tindang.ejs
 * TODO CRUD tin đăng cho USER
 * TODO CRUD tin đăng cho ADMIN
 * ?
 */
//Get TinDang cho từng user
router.get("/tindang", function(req, res) {
  if (req.session.email != null) {
    var email = req.session.email;
  TinDang.find({ email_User: email }, function(err, tindang) {
    if (err) throw err;
        //chọn danh mục cha
        DM_Cha.find({}, function(err, folders) {
          //chọn tỉnh
          request('https://thongtindoanhnghiep.co/api/city', function (error, response, items) {
            if (!error && response.statusCode == 200) {
              var info = JSON.parse(items)
              res.render("tindang", { tindang: tindang,lst_DMCha_R: folders,obj:info.LtsItem });
            }
          })
         
        });
  });
}else {
  res.render("401", { mes: "Login to continue" });
}
});
// //get TinDang cho tất cả user
// router.get("/tindangs", function(req, res) {
//   TinDang.find({}, function(err, tindang) {
//     console.log("TCL: tindang", tindang);
//     if (err) throw err;
//     res.render("tindang", { tindang: tindang });
//   });
// });

//admin:get TinDang chưa duyệt cho tất cả cho admin
router.get("/admin/tindangs/chuaduyet", function(req, res) {
  if (req.session.admin != null) {
  TinDang.find({daDuyet:"0"}, function(err, tindang) {
    if (err) throw err;
    res.render("admin_tindang_chuaduyet", { tindang: tindang });
  });
}else res.render("403")
});
//admin:get TinDang đã duyệt cho admin
router.get("/admin/tindangs/daduyet", function(req, res) {
  if (req.session.admin != null) {
  TinDang.find({daDuyet:"1"}, function(err, tindang) {
    if (err) throw err;
    res.render("admin_tindang_daduyet", { tindang: tindang });
  });
}else res.render("403")
})

//post tinDang theo dm cha cho tất cả user 
//?nếu dùng post: thì cho gửi params có dấu
//?nếu dùng get : thì phải sửa lại cấu trúc là truyền bằng id
router.post("/tindangs/dmcha", function(req, res) {
  if (req.session.admin != null) {
  TinDang.find({dmcha:req.body.tencha}, function(err, tindang) {
    if (err) throw err;
    res.render("tindang", { tindang: tindang });
  });
}else res.render("403")
});
//get tinDang dmcon cho tất cả user
router.post("/tindangs/dmcon", function(req, res) {
  if (req.session.admin != null) {
  TinDang.find({dmcon:req.body.tencon}, function(err, tindang) {
    if (err) throw err;
    res.render("tindang", { tindang: tindang });
  });
}else res.render("403")
});
//get tinDang theo tìm kiếm
//get tindang theo sap xep

//!Create tindang
router.post("/tindang",upload.any(), function(req, res) {
 if(req.session.email){
  var tieuDe = req.body.tieuDe;
  var moTaChiTiet = req.body.moTaChiTiet;
  var thoiHan='0'
  if(req.body.thoiHan !==''){
    thoiHan= req.body.thoiHan
  }

  var tinh=req.body.tinh;
  var huyen=req.body.huyen;
  var xa=req.body.xa;
  var diaChi=req.body.soNha;
  var email = req.session.email;
  var id_User=req.session.ID;
  var dateTime = Date()
  date = dateTime.split(' ', 4).join(' ');
  if( Regex_Anh.exec(req.files[0].filename)==null && Regex_Anh.exec(req.files[1].filename)==null && Regex_Anh.exec(req.files[2].filename)==null ){
  var newTinDang = TinDang({
    tieuDe: tieuDe,
    moTaChiTiet: moTaChiTiet,
    email_User: email,
    id_User:id_User,
    anh1: req.files[0].filename,
    anh2: req.files[1].filename,
    anh3: req.files[2].filename,
    dmcha:req.body.dmcha,

    dmCon:req.body.dmCon,
    tinh:tinh,huyen:huyen,xa:xa,
    diaChi:diaChi,  
    gia:req.body.gia,     
    loaiTinDang: req.body.loaiTinDang,
    trangThai:"1",
    daDuyet:"0", 
    thoiGianDang:date,
    thoiHan:thoiHan
  });
  newTinDang.save(function(err, a) {
    if (err) {
      res.render("500")
    }
  });
  res.redirect("/info/tinchoduyet");
  } else res.render("tindang",{mesno:"vui lòng chọn 3 ảnh có định dạng ảnh được hổ trợ jpg,png" })
} else res.render("401")
});
//!-lấy danh mục cha
router.get("/getdmchas", function(req, res) {
  DM_Cha.find({}, function(err, cha) {
				if(typeof(cha)!=="undefined"){
          res.render("resviews/getdmcha", { lst_DMCon_R: cha });
        }else  res.render("500")
  });
});
//!-lấy danh mục con 
router.get("/getdmcons/:tencha", function(req, res) {
  var tencha= req.params.tencha
  DM_Cha.findOne({_id:tencha}, function(err, cha) {
    if(typeof(cha)!=="undefined"){
      DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
        res.render("resviews/getdmcon", { lst_DMCon_R: folders });
        })
    }
    else
    res.render("500")
   
  });
});
//!-lấy địa chỉ-full tên tỉnh
router.get('/gettinhs', function(req, res){
  request('https://thongtindoanhnghiep.co/api/city', function (error, response, items) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(items)
      res.render('resviews/gettinhs',{obj:info.LtsItem})
    } else res.render("500")
  })
});
//!-lấy địa chỉ -full quận huyện
router.get('/getqhs/:idH', function(req, res){
      var link='https://thongtindoanhnghiep.co/api/city/'+req.params.idH+'/district'
      request(link, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
     res.render('resviews/getqh',{obj:info})
    }
    else res.render('500');
  })
});
//!-lấy địa chỉ -full phường xã
router.get('/getphuongxas/:idP', function(req, res){
  console.log("TCL: phuongxa")
      var link='https://thongtindoanhnghiep.co/api/district/'+req.params.idP+'/ward'
      request(link, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
     res.render('resviews/getphuongxa',{obj:info})
    }
    else
    res.render('500')
  })
});




//?user:sửa 1 tin đăng
router.post("/tindang/edit", function(req, res) {
  TinDang.update(
    {
      email_User: req.session.email,
      _id: req.body._idTinDang
    },
    {
      tieuDe: req.body.tieuDe,
      moTaChiTiet: req.body.moTaChiTiet
    },
    function(err, folders) {
      if (err) {
        return res.render("500")
      } else {
        //chuyển router
        res.redirect("/tindang");
      }
    }
  );
});
//user: chỉnh sửa trạng thái bài đăng
router.post("/tindang/trangthai/edit", function(req, res) {
  if(req.session.email){
  TinDang.update(
    {
      email_User: req.session.email,
      _id: req.body._idTinDang
    },
    {
      trangThai: req.body.trangThai  
    },
    function(err, folders) {
      if (err) {
        return res.render("500")
      } else {
        //chuyển router
        res.redirect("/info/tindadang");
      }
    }
  );
  } else res.render("401")
});

//admin: duyệt 1 tin đăng
router.post("/admin/tindang/edit", function(req, res) {

  var daDuyet=req.body.duyet
  var mess=""
  if(daDuyet=="0"){
    mess="Bài đăng của bạn không được duyệt do phi phạm quy định"
  } else{
    mess="Bài đăng của bạn đã được duyệt, có thể xem tại "+"http://127.0.0.1:3000/chitiettd/"+req.body._id
  }
  TinDang.update(
    {
      _id: req.body._id
    },
    {
      daDuyet:daDuyet
    },
    function(err, folders) {
     
      console.log(folders)
      if (err) return res.status(500).json(err);
        //gửi mail cho user
        var dateTime = Date()
        date = dateTime.split(' ', 4).join(' ');
        var newMail = Mail({
          id_UserGui:"ADMIN",
          id_UserNhan:req.body.id_User,
          tieuDe:"Thông Báo",
          noiDung:mess,
          thoigianGui:date,
          thoiGianDoc:"0",
          daXoa1:"0",  
          daXoa2:"0"    
        });
        // save the user
        newMail.save(function(err) {
          res.redirect("/admin/tindangs/chuaduyet");       
    }
  );
  });
})
//admin:xóa 1 tin đăng
router.get("/admin/tindang/delete/:_idTinDang", function(req, res) {
  TinDang.findOne({_id:req.params._idTinDang},function(err,item){
    //xóa ảnh
    var link='public/upload/'+item.anh1;
    var link1='public/upload/'+item.anh2;
    var link2='public/upload/'+item.anh3;

    fs.unlink(link, function (err) {
      fs.unlink(link1,function(err){
        fs.unlink(link2,function(err){
          //xóa tin đăng
          TinDang.remove({ _id: req.params._idTinDang }, function(err) {
            if (err) {
            } else {
              //gửi mail
              var mess="rất tiếc chúng tôi đã xóa bài đăng của bạn do vi phạm quy định"
              var dateTime = Date()
              date = dateTime.split(' ', 4).join(' ');
              var newMail = Mail({
                id_UserGui:"ADMIN",
                id_UserNhan:item.id_User,
                tieuDe:"Thông Báo",
                noiDung:mess,
                thoigianGui:date,
                thoiGianDoc:"0",
                daXoa1:"0",  
                daXoa2:"0"    
              });
              // save the user
              newMail.save(function(err) {
                res.redirect("/admin/tindangs/chuaduyet");   
              })            
            }
          })
        })
      })
    })
  }) 
})

//xóa 1 tin đăng => xóa ảnh upload
router.get("/tindang/delete/:_idTinDang", function(req, res) {
  if( req.session.email){
  TinDang.findOne({_id:req.params._idTinDang,email_User:req.session.email},function(err,item){
    if(typeof(item)!=="undefined"){
    //xóa ảnh
    var link='public/upload/'+item.anh1;
    fs.unlink(link, function (err) {
      //xóa tin đăng
      TinDang.remove({ _id: req.params._idTinDang }, function(err) {
        if (err) {
          console.log("Error in delete" + err);
        } else {
          res.redirect("/info/tindadang");
        }
      });
    });
  } else res.render("404")
  })
} else res.render("401")
});

//báo cáo 1 tin đăng...

/**
 * !bảng dm_cha : biến DM_Cha -view:danhmuc
 * TODO CRUD danh mục cha cho admin/user
 * ?view ở đâu
 */
// hiển thị dm cha cho admin
router.get("/dmchas", function(req, res) {
  if(req.session.admin!=null){
    DM_Cha.find({}, function(err, folders) {
      if (err) throw err;
      res.render("danhmuc_cha", { lst_DMCha_R: folders });
    });
  } else
  res.render("403", { message: "Login to continue" });
 
});

// admin: thêm danh mục cha
router.post("/dmcha",upload.single("file"), function(req, res) {
  if(req.session.admin){
  var tenDMCha = req.body.tenDMCha;
  DM_Cha.findOne({ tenDMCha: tenDMCha }, function(err, dmcha) {
    if (err) res.render("500")
    else {
      if (dmcha == null) {
        var newDMCha = DM_Cha({
          tenDMCha: tenDMCha,
          anh1:req.file.filename
        });
        // save the dm cha
        newDMCha.save(function(err) {
        
          if (err) res.render("500")
        });
        res.redirect('/dmchas')
      } else {
        res.render("danhmuc_cha", { mes_DMCha_C: "DM cha đã tồn tại." });
      }
    }
  });
} else res.render("403")
});

// admin: sửa danh mục cha
router.post("/dmcha/edit", function(req, res) {
  var tenDMCha = req.body.tenDMCha;
  var id_DMCha = req.body.id_DMCha;
  if(req.session.admin){
  DM_Cha.findOne({ tenDMCha: tenDMCha }, function(err, dmcha) {
    if (err) throw err;
    else {
      if (dmcha == null) {
        DM_Cha.update(
          {
            _id: id_DMCha
          },
          {
            tenDMCha: tenDMCha
          },
          function(err, folders) {
            if (err) {
              return res.status(500).json(err);
            } else {
              //chuyển router
              res.redirect("/dmchas");
            }
          }
        );
      } else {
        res.render("dmcha_cha", { mes_DMCha_U: "danh mục bị trùng" });
      }
    }
  });
}else res.render("403")
});

// admin: xóa dm cha
router.get("/dmcha/delete/:id_DMCha", function(req, res) {
  if(req.session.admin){
  DM_Cha.findOne({_id:req.params.id_DMCha},function(err,item){
    var link='public/upload/'+item.anh1;
    fs.unlink(link, function (err) {
      DM_Cha.remove({ _id: req.params.id_DMCha }, function(err) {
        if (err) {
          res.render(500)
        } else {
          res.redirect("/dmchas");
        }
      });
    });
  })
} else res.render("403")
});

//user: sử dụng danh mục cha
router.get("/dmchas", function(req, res) {
  DM_Cha.find({}, function(err, folders) {
    if (err) res.render(500);
    res.render("tindang", { lst_DMCha_R: folders });
  });
});
/**
 * !bảng dm_con biến model:DM_Con ,view:danhmuc
 * TODOS CRUD danh mục con cho admin/user
 * ?view ở danhmuc
 */

//  hiển thị tất cả dm con
router.get("/dmcons", function(req, res) {
  if(req.session.admin){
  DM_Con.find({}, function(err, folders) {
    if (err) res.render(500);
    DM_Cha.find({}, function(err, folders1) {
      if (err) res.render(500);
      res.render("danhmuc_con", { lst_DMCha_R: folders1,lst_DMCon_R: folders });
    });
  });
} else res.render("403")
});
//?hiển thị danh mục con theo danh mục cha
router.get("/dmcons/:tencha", function(req, res) {
  if(req.session.admin){
  var tencha= req.params.tencha
  DM_Con.find({tenDMCha:tencha}, function(err, folders) {
    if (err) res.render(500);
    res.render("danhmuc_con", { lst_DMCon_R: folders });
  });
} else res.render("403")
});
// admin: thêm danh mục
router.post("/dmcon", function(req, res) {
  var tenDMCon = req.body.tenDMCon;
  if(req.session.admin){
  DM_Con.findOne({ tenDMCon: tenDMCon }, function(err, dmcon) {
    if (err) res.render(500);
    else {
      if (dmcon == null) {
        var newDMCon = DM_Con({
          tenDMCon: tenDMCon,
          tenDMCha: req.body.tenDMCha
        });
        // save the dm con
        newDMCon.save(function(err) {
          if (err) res.render(500);
        });
        res.redirect('/dmcons');
      } else {
        res.render("danhmuc_con", { mes_DMCon_C: "DM cha already exists." });
      }
    }
  });
} else res.render("403")
});
// admin: sửa tên danh mục con
router.post("/dmcon/edit", function(req, res) {
  var tenDMCon = req.body.tenDMCon;
  var id_DMCon = req.body.id_DMCon;
  if(req.session.admin){
  DM_Con.findOne({ tenDMCon: tenDMCon }, function(err, dmcon) {
    if (err) throw err;
    else {
      if (dmcon == null) {
        DM_Con.update(
          {
            _id: id_DMCon
          },
          {
            tenDMCon: tenDMCon
          },
          function(err, folders) {
            if (err) {
              return res.render(500);
            } else {
              //chuyển router
              res.redirect("/dmcons");
            }
          }
        );
      } else {
        res.render("danhmuc_con", { mes_DMCha_U: "danh mục bị trùng" });//
      }
    }
  });
} else res.render("403")
});
// admin: xóa dm con
router.get("/dmcon/delete/:id_DMCon", function(req, res) {
  if(req.session.admin){
  DM_Con.remove({ _id: req.params.id_DMCon }, function(err) {
    if (err) {
      res.render(500);
    } else {
      res.redirect("/dmcons");//
    }
  });
} else res.render("403")
});
//user: sử dụng danh mục con

/**
 * !bảng baocaotins : biến BC_Tin ,view:bctindang
 * TODOS CRUD báo cáo tin đăng cho user
 * TODOS thể hiện duyệt báo cáo admin
 * ?trạng thái: đã duyệt ,chưa duyệt
 */

//user: thêm 1 báo cáo
router.post("/bctindang", function(req, res) {
  var noiDungBaoCao=req.body.noiDungBaoCao
  var id_TinDang=req.body.id_TinDang
  var sDT=req.body.sDT
  var email=req.body.email
  var tieuDe=req.body.tieuDe
  var newbcTin = BC_Tin({
    noiDungBaoCao:noiDungBaoCao,
    id_TinDang:id_TinDang,
    sDT:sDT,
    email:email,
    trangThai:'0',
    tieuDe:tieuDe
  });
  newbcTin.save(function(err, a) {
    if (err) {
      res.render(500);
    }
  });
  res.redirect("/chitiettd/"+id_TinDang);
});
//hiển thị tất cả báo cáo cho 1 id tin đăng


//admin: hiển thị tất cả các báo cáo
router.get('/bctindangs', function(req, res) { 
 if(req.session.admin){
  BC_Tin.find({trangThai:"0"}, function(err, items) {
 if (err) res.render(500);
 res.render('admin_bctindang', {lst_BCTin:items}); 
});
 } else res.render("403")
});

//admin: update trạng thái báo cáo
router.post('/bctindang/edit', function(req, res) {
  if(req.session.admin){
  BC_Tin.update({
     _id:req.body.id_BCTin    
}, {
  trangThai:req.body.trangThai
}, function (err, folders) {
    if (err) {
        return res.render(500);
    } else {
     //chuyển router
      res.redirect('/bctindangs') 
    }
})
} else res.render("403")
});
//admin: xóa báo cáo
router.get("/bctindang/delete/:id_bctindang", function(req, res) {
  if(req.session.admin){
  BC_Tin.remove({ _id: req.params.id_bctindang }, function(err) {
    if (err) {
      res.render(500);
    } else {
      res.redirect("/bctindangs");//
    }
  });
} else res.render("403")
});
//admin: xoá tất cả các báo cáo có trạng thái=duyệt-Sai

/**
 * ! bảng usertheodois  -biến:UserTheoDoi -view :
 *  TODOS CRUD user theo dõi cho user
 *  ?view
 */
//user: hiển thị tất cả các user theo dõi theo từng user
router.get("/usertheodois", function(req, res) {
  if(req.session.email){
    UserTheoDoi.find({email_User:req.session.email}, function(err, folders) {
      if (err) res.render(500);
      res.render("user_info_theodoi", { userTheoDoi: folders });
    });
    } 
    else{
      res.render("401")
    }     
 });

 //user khác: hiển thị tất cả user theo dõi của từng user
 router.post("/usertheodois", function(req, res) {
   
  if(req.body.id){
    UserTheoDoi.find({id:req.body.id}, function(err, folders) {
      if (err) res.render(500);
      res.render("user_khac_nguoitheodoi", { userTheoDoi: folders });
    });
    } 
    else{
      res.render("404")
    }     
 });

//user: theo dõi 1 user => kiểm tra trùng
router.post('/usertheodoi', function(req, res) {
  if(req.session.email){
    var email = req.session.email;
    var id=req.session.US._id
    var id_UserTheoDoi =req.body.id_UserTheoDoi;
    var name =req.body.name;
    var sDT =req.body.sDT;
    var mail=req.body.mail;
   // var id=req.body.id
    UserTheoDoi.findOne({ id_UserTheoDoi: id_UserTheoDoi,email_User:email }, function(err, user) {
      if (err) res.render(500);
      else
      {
       if(user==null)
       {
          var newUser = UserTheoDoi({
              email_User: email,
              id_UserTheoDoi: id_UserTheoDoi ,
              name:name,
              sDT:sDT,
              mail:mail,
              id:id             
          });
           newUser.save(function(err) {
           if (err) res.render(500);
           });
           res.redirect('/usertheodois');
       }
       else
       {  
            res.redirect('/usertheodois');
       }
      }
    });
  }
  else{
    res.render("401")
  } 
});
  
//user: xóa theo dõi 1 user
router.get('/usertheodoi/delete/:IDName', function(req, res) {
  if(req.session.email){
    var email=req.session.email
    UserTheoDoi.remove({ email_User: email, _id:req.params.IDName }, function(err) {
      if (err) {
        res.render(500);
      }
      else {
      res.redirect('/usertheodois')        
      }
      });
  }
  else
  {  
       res.render("401")
  }
});


 /**
  * !bảng  tintheodois -biến: TinDangTheoDoi ,-view:
  * TODOS CRUD tin đăng theo dõi cho user
  * ?view
  */
//user: hiển thị tất cả các tin đăng theo dõi theo từng user
router.get("/tdtheodois", function(req, res) {
  if(req.session.email){
  TinDangTheoDoi.find({email_User:req.session.email}, function(err, folders) {
    if (err) res.render(500);
    res.render("tdtheodoi", { tdTheoDoi: folders });
  });
} else res.render("401")
});
//user: theo dõi 1 tin đăng
router.post('/tdtheodoi', function(req, res) {
  if(req.session.email){
  var email = req.session.email;
  var id_TinDangTheoDoi =req.body.id_tdTheoDoi;
   
  TinDangTheoDoi.findOne({ id_TinDangTheoDoi: id_TinDangTheoDoi,email_User:email }, function(err, user) {
    if (err) res.render(500);
    else
    {
     if(user==null)
     {
        var newUser = TinDangTheoDoi({
            email_User: email,
            id_TinDangTheoDoi: id_TinDangTheoDoi              
        });
         newUser.save(function(err) {
         if (err) res.render(500);
         });
         res.redirect('/tdtheodois');
     }
     else
     {  
          res.redirect('/tdtheodois');
     }
    }
  });
} else res.render("401")
  });
//user: xóa theo dõi 1 tin đăng
router.get('/tdtheodoi/delete/:IDName', function(req, res) {
  if(req.session.email){
  var email=req.session.email

   TinDangTheoDoi.remove({ email_User: email, _id:req.params.IDName }, function(err) {
    if (err) {
      res.render(500);
    }
    else {
    res.redirect('/tdtheodois')        
    }
    });
  } else res.render("401")
});

//!chat

router.get('/chat',(req,res)=>{
  res.render('chat')
})
router.get('/chati',(req,res)=>{
  res.render('chat/index')
})


//!mail
router.get('/mail',function(req,res){
  res.render('mail')
})
router.get('/mail_create',function(req,res){
  //lấy id người theo dõi
  if(req.session.email){
    UserTheoDoi.find({email_User:req.session.email}, function(err, folders) {
      if (err) res.render("500")
      res.render('mail_create',{ userTheoDoi: folders })
    });
    } 
    else{
      res.render("401")
    }     
})
//tao mail
router.post('/guimail', function(req, res) {
  if (req.session.ID != null) {
  var dateTime = Date()
  date = dateTime.split(' ', 4).join(' ');
  var idUserNhan=req.body.id_UserNhan
  //kiểm tra id người nhận có tồn tại
    User.findOne({_id:idUserNhan},function(err,iuser){
      if(iuser){
        var newMail = Mail({
          id_UserGui:req.session.ID,
          id_UserNhan:idUserNhan,
          nameUserGui:req.session.US.name,
          nameUserNhan:iuser.name,
          tieuDe:req.body.tieuDe,
          noiDung:req.body.noiDung,
          thoigianGui:date,
          thoiGianDoc:"0",
          daXoa1:"0",  
          daXoa2:"0"    
        });
        // save the user
        newMail.save(function(err) {
        if (err) res.render("500")});
        //res.render('mail',{"mesGuiMail" :"Gui mail thanh cong "});
        res.redirect("/mails_dagui")
      }
    
    })
  } else{
    res.render("401", { mes: "Login to continue" });
  }
})
// //?hiển thị mail (mal đến , mail đã gửi , thùng rác)
// router.get('/mails/:id', function(req, res) {
// 	if(session.ID!==null){

//   }
//   var id=req.params.id;
//   Mail.find({id_UserNhan:id,daXoa2:"0"}, function(err, mailden) {
//     Mail.find({id_UserGui:id,daXoa1:"0"}, function(err, mailgui) {
//       Mail.find({$or : [
//         {id_UserNhan:id,daXoa2:"1"},
//         {id_UserGui:id,daXoa1:"1"},
//     ]}, function(err, thungrac) {
//         if (err) throw err;
//         res.render('mail', {mailden:mailden,mailgui:mailgui,thungrac:thungrac});
//       });
//     })
//   });
// });
//mail : đến
router.get('/mails_den', function(req, res) {
	if(req.session.ID!==null){
    var id=req.session.ID;
    Mail.find({id_UserNhan:id,daXoa2:"0"}, function(err, mailden) {
			console.log("TCL: mailden", mailden)
      Mail.find({id_UserGui:id,daXoa1:"0"}, function(err, mailgui) {
        Mail.find({$or : [
          {id_UserNhan:id,daXoa2:"1"},
          {id_UserGui:id,daXoa1:"1"},
      ]}, function(err, thungrac) {
          if (err) res.render("500");
          res.render('mail_den', {mailden:mailden,mailgui:mailgui,thungrac:thungrac});
        });
      })
    });
  } else{
    res.render("401", { mes: "Login to continue" });
  }
});
//mail: đã gửi
router.get('/mails_dagui', function(req, res) {
	if(req.session.ID!==null){
    var id=req.session.ID;
  Mail.find({id_UserNhan:id,daXoa2:"0"}, function(err, mailden) {
    Mail.find({id_UserGui:id,daXoa1:"0"}, function(err, mailgui) {
      Mail.find({$or : [
        {id_UserNhan:id,daXoa2:"1"},
        {id_UserGui:id,daXoa1:"1"},
    ]}, function(err, thungrac) {
        if (err) res.render("500");
        res.render('mail_dagui', {mailden:mailden,mailgui:mailgui,thungrac:thungrac});
      });
    })
  });
  }else{
    res.render("401", { mes: "Login to continue" });
  }
  
});
//mail: thùng rác
router.get('/mails_thungrac', function(req, res) {
	if(req.session.ID!==null){
    var id=req.session.ID;
    Mail.find({id_UserNhan:id,daXoa2:"0"}, function(err, mailden) {
      Mail.find({id_UserGui:id,daXoa1:"0"}, function(err, mailgui) {
        Mail.find({$or : [
          {id_UserNhan:id,daXoa2:"1"},
          {id_UserGui:id,daXoa1:"1"},
      ]}, function(err, thungrac) {
          if (err) res.render("500");
          res.render('mail_thungrac', {mailden:mailden,mailgui:mailgui,thungrac:thungrac});
        });
      })
    });
  }else{
    res.render("401", { mes: "Login to continue" });
  }
});


//đọc mail

router.get("/mail/read/:id",function(req,res){
  var dateTime = Date()
  date = dateTime.split(' ', 4).join(' ');
  if(req.session.ID!==null){
  Mail.update({ _id:req.params.id},{
    thoiGianDoc:date
  }, function (err, folders) {
        if (err) {
            return res.render("500");
        } else {
          res.redirect('/mails_den')
        }
      }
    );
  } else res.render("401", { mes: "Login to continue" });
})

//?hiển thị mail đến
router.get('/mails/:id_UserNhan', function(req, res) { 
  if(req.session.ID!==null){
  Mail.find({id_UserNhan:req.params.id_UserNhan}, function(err, items) {
    if (err) res.render("500");
    res.render('mail', {mails:items});
  });
}else res.render("401", { mes: "Login to continue" });
});

//?hiển thị mail đã gửi
router.get('/mails/:id_UserGui', function(req, res) { 
  if(req.session.ID!==null){
  Mail.find({id_UserGui:req.params.id_UserGui}, function(err, items) {
    if (err) res.render("500");
    res.render('mail', {mails:items});
  });
}else res.render("401", { mes: "Login to continue" });
});
//đưa mail den vào thùng rác
router.get('/mail/editden_vao/:id', function(req, res) {
  if(req.session.ID!==null){
  Mail.update({ _id:req.params.id},{
  daXoa2:"1"
}, function (err, folders) {
    if (err) {
        return res.render("500")
    } else {
      res.redirect('/mails_den')
    }
  }
  );
}else res.render("401", { mes: "Login to continue" });
});
//đưa mail gui vào thùng rác
router.get('/mail/editgui_vao/:id', function(req, res) {
  if(req.session.ID!==null){
  Mail.update({ _id:req.params.id},{
  daXoa1:"3"
}, function (err, folders) {
    if (err) {
        return res.render("500");
    } else {
      res.redirect('/mails_dagui')
    }
  }
  );
}else res.render("401", { mes: "Login to continue" });
});

//đưa mail den ra thùng rác
router.get('/mail/edit_ra/:id', function(req, res) {
  if(req.session.ID!=null){
    Mail.update({ _id:req.params.id,id_UserNhan:req.session.ID},{
      daXoa2:"0"
    }, function (err, folders) {
        if (err) {
            return res.render("500");
        } else {
          res.redirect('/mails_thungrac')
        }
      }
    );
  }
  else{
    res.render("401", { message: "Login to continue" })
  }

});


//đưa mail den  thùng rác xóa hẳn 
router.get('/mail/edit_xoa/:id', function(req, res) {
  if(req.session.ID!=null){
    Mail.update({ _id:req.params.id},{
      daXoa2:"3"
    }, function (err, folders) {
        if (err) {
            return res.render("500");;
        } else {
          res.redirect('/mails_thungrac')
        }
      }
      );
  } else{
    res.render("401", { message: "Login to continue" })
  }
});
//đưa mail gui thùng rác xóa hẳn 
router.get('/mail/editgui_xoa/:id', function(req, res) {
  Mail.update({ _id:req.params.id},{
  daXoa1:"3"
}, function (err, folders) {
    if (err) {
        return res.render("500");
    } else {
      res.redirect('/mails_thungrac')
    }
  }
  );
});

//admin:xóa mail 60 ngày
router.get('/admin/mail/delete', function(req, res) {
  Mail.remove({ daXoa1:"3",daXoa2:"3"
}, function (err, folders) {
    if (err) {
        return res.render("500");
    } else {
      res.redirect('/mails')
    }
  }
  );
});
//user gửi mail cho người bất kì khi vào xem trang ng khác
router.post("/user/khac/mail", function(req,res){
  //var email=req.body.email_User
  var id=req.body.id
  if(req.session.email){
    User.find({ email: req.session.email }, function(err, user) {
      res.render("user_mail_nguoitheodoi",{id_UserNhan:id,user: user,email_User:req.session.email })
    })
    } else
  res.render("401")
})

//admin: carosel 
//xem carosel
router.get("/admin/carousel",function(req,res){
  if(req.session.admin){
  Carousel.find({},function(req,items){
    res.render("admin_carousel",{items:items})
  })
} else res.render("403")
})
//user xem carousel
router.get("/slide",function(req,res){
  if(req.session.admin){
  Carousel.find({},function(req,items){
    res.render("template/slide",{slide:items})
  })
} else res.render("403")
})
//thêm 1 ảnh
router.post('/admin/carousel/create',upload.single("file"), function(req, res) {
  if(req.session.admin){
      var newcarousel = Carousel({
          carouselIMG1:req.file.filename,
          theH4:req.body.theH4,
          theH2:req.body.theH2,
          theP:req.body.theP,
          theLink:req.body.theLink,
          theA:req.body.theA,
          viTri:req.body.vt        
         });
       
         newcarousel.save(function(err) {
         if (err) res.render("500");   
        // res.render('admin_carousel',{items:items});    
         });
         res.redirect("/admin/carousel");
    
        } else res.render("403")
  });
//sửa
router.post("/admin/carousel/edit", function(req, res) {
  if(req.session.admin){
  Carousel.update(
    {
      _id: req.body.id
    },
    {
      theH4:req.body.theH4,
      theH2:req.body.theH2,
      theP:req.body.theP,
      theLink:req.body.theLink,
      theA:req.body.theA      
    },
    function(err, folders) {
      if (err) {
        return res.render("500");
      } else {
        res.redirect("/admin/carousel");
      }
    }
  );
} else res.render("403")
});
  
//xóa
router.get("/admin/carousel/delete/:id", function(req, res) {
  if(req.session.admin){
  Carousel.findOne({_id:req.params.id},function(err,item){
    var link='public/upload/'+item.carouselIMG1;
    fs.unlink(link, function (err) {
      Carousel.remove({ _id: req.params.id }, function(err) {
        if (err) {
          res.render("500");
        } else {
          res.redirect("/admin/carousel");
        }
      });
    });
  })
} else res.render("403")
});

//!góp ý báo cáo
//user gửi góp ý báo cáo
router.post('/gopy', function(req, res) {
  
  var ho = req.body.ho;
  var ten =req.body.ten;
  var diaChiMail=req.body.diaChiMail
  var tieuDe=req.body.tieuDe
  var gopY=req.body.gopY
         var newUser = GopY({ 
           ho:ho,
          ten:ten,
          diaChiMail:diaChiMail,
          tieuDe:tieuDe,
          gopY:gopY
                
        });
         // save the user
         newUser.save(function(err) {
         if (err) res.render("500");
         });
         res.render("contact",{mes:"cám ơn các bạn đã góp ý , chúng tôi sẽ xử lý sớm nhất!"})
       
  });
  
  //admin lấy thông tin báo cáo
  router.get('/gopy', function(req, res) { 
    if(req.session.admin){

    GopY.find({}, function(err, items) {
   if (err) res.render("500") ;
   else res.render('admin_gopy', {items:items});
 });
}else res.render("403")
 });
 
 

  //admin xóa thông tin báo cáo đã xữ lý

  router.get('/gopy/delete/:id', function(req, res) {
    if(req.session.admin){
     GopY.remove({ _id:req.params.id }, function(err) {
      if (err) {
           res.render("500")  
      }
      else {
        //chuyển router
      res.redirect('/admin_gopy')
              
      }
      });
    }else res.render("403")
  });
  


























//export
module.exports = router;
