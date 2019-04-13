var express = require("express");
var router = express.Router();
var path = require("path");
const request = require('request');
var fs = require('fs');


//require Model
var User = require.main.require("./models/user");
var Folder = require.main.require("./models/folder");
var TinDang = require.main.require("./models/tindang");
var DM_Cha = require.main.require("./models/dMChaModel");
var DM_Con = require.main.require("./models/dMConModel");
var BC_Tin=require.main.require("./models/baocaoTinModel");
var UserTheoDoi= require.main.require("./models/userTheoDoiModel");
var TinDangTheoDoi=require.main.require("./models/tinDangTheoDoiModel");
// Connect to DB
var dbConfig = require.main.require("./db");
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
mongoose.connect(dbConfig.url, { useMongoClient: true });
var session = require("express-session");
// router
router.get("/login1", function(req, res) {
  res.render("login");
});
router.get("/login-register", function(req, res) {
  res.render("login-register");
});
router.get("/signup", function(req, res) {
  res.render("signup");
});
router.get("/index1", function(req, res) {
  res.render("index1");
});
router.get("/loginloi", function(req, res) {
  res.render("login", { message: "Login Failed" });
});


router.get('/404',function(req,res){
  res.render('404');
})
router.get('/505',function(req,res){
  res.render('505');
})
router.get('/test0',function(req,res){
  res.render('tindang1')
})
/**
 * !USER
 */
//user:lấy thông tin cá nhân 
router.get('/info',function(req,res){
  if (req.session.email != null) {
    User.find({ email: req.session.email }, function(err, user) {
      if (err) res.render('500');
      res.render("user", { user: user });
    });
  } else {
    res.render("404", { message: "Login to continue" });
  }
})
//user: lấy thông tin cá nhân của user khác
router.post('/info',function(req,res){
    User.find({ email: req.body.email_User }, function(err, user) {
      if (err) res.render('500');
      res.render("user_khac", { user: user });
    });
})

//admin:lấy thông tin cá nhân 
router.get('/admin/info',function(req,res){
  if (req.session.admin != null) {
    User.find({ email: req.session.email }, function(err, user) {
      if (err) res.render('500');
      res.render("admin_info", { user: user });
    });
  } else {
    res.render("404", { message: "Login to continue" });
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
        res.redirect('/info');
    });
  } else {
    res.render("404", { message: "Login to continue" });
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
        res.redirect('/admin/info');
    });
  } else {
    res.render("404", { message: "Login to continue" });
  }
})
//user:đổi pass
router.post('/info/editpass',function(req,res){
  if (req.session.email != null) {
   
    var email=req.session.email
    var passOld=req.body.passOld
    var passNew=req.body.passNew
   
    User.update(
      { email: email, password:passOld },
      {
        password:passNew
      },
       function(err, user) {
      
        if (err) res.render('500');
        if(user.n==1){
          res.render("user", { mespass: "đổi thành công" }); //n là số dòng update thành công
        }
        else
        res.render('user',{mespass:"đổi thất bại"});
    });
  } else {
    res.render("404", { message: "Login to continue" });
  }
})
//!admin:đổi pass
router.post('/admin/info/editpass',function(req,res){
  if (req.session.email != null) {
   
    var email=req.session.email
    var passOld=req.body.passOld
    var passNew=req.body.passNew
   
    User.update(
      { email: email, password:passOld },
      {
        password:passNew
      },
       function(err, user) {
      
        if (err) res.render('500');
        if(user.n==1){
          res.render("/admin_info", { mespass: "đổi thành công" }); //n là số dòng update thành công
        }
        else
        res.render('admin_info',{mespass:"đổi thất bại"});
    });
  } else {
    res.render("404", { message: "Login to continue" });
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
  res.render("404", { message: "Login to continue" });
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
  res.render("404", { message: "Login to continue" });
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
  res.render("404", { message: "Login to continue" });
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
          res.redirect('/tdtheodois');
     }
    }
   });
  }else
  res.render("404", { message: "Login to continue" });
  });


// router.post('/info/tindadang',function(req,res){
//   if (req.session.email != null) {
//     User.find({ email: req.session.email }, function(err, user) {
//       if (err) res.render('500');
//       res.render("user", { user: user });
//     });
//   } else {
//     res.render("404", { message: "Login to continue" });
//   }
// })
/**
 * !KHÁCH
 */

router.get('/gallery',function(req,res){
  DM_Cha.find({},function(err,folders){
    res.render('gallery1',{ folders: folders });
  })
})
//lấy toàn bộ tin đăng cho theo danh mục cha
router.get('/gallery/:id_DMCha',function(req,res){
  var id_DMCha=req.params.id_DMCha
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      if (err) throw err;
      TinDang.find({dmcha:id_DMCha,daDuyet:"1"}, function(err, tindang) {
      res.render("galleryChird1", { folders: folders,tindang:tindang,id_DMCha:id_DMCha});
      })
    });
  })
})
//phân trang thường theo danh mục cha
router.get('/gallery/:id_DMCha/:page', (req, res, next) => {
    var id_DMCha=req.params.id_DMCha
    let perPage = 1;
    let page = req.params.page || 1;
    DM_Cha.findOne({_id:id_DMCha},function(err,cha){
      DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
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
    });    
  }) 
})

//sắp xếp tăng dần theo ngày đăng=> chỉ cần dựa vào id .sort({_id:1})
router.get('/gallery/:id_DMCha/indate/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 1;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
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
  });    
}) 
})
//sắp xếp giảm dần theo ngày đăng
router.get('/gallery/:id_DMCha/descdate/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 3;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
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
  });    
}) 
})
//sắp xếp tăng theo giá
router.get('/gallery/:id_DMCha/ingia/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 1;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
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
  });    
}) 
})
//sắp xếp giảm theo giá
router.get('/gallery/:id_DMCha/descgia/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 1;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
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
  });    
}) 
})

//sắp theo tin bán
router.get('/gallery/:id_DMCha/tinban/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 1;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1",loaiTinDang:"tinban"}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
        TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1",loaiTinDang:"tinban"}).count((err, count) => {
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
  });    
}) 
})
//sắp xếp theo tin mua
router.get('/gallery/:id_DMCha/tinmua/:page', (req, res, next) => {
  var id_DMCha=req.params.id_DMCha
  let perPage = 1;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1",loaiTinDang:"tinmua"}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
        TinDang.find({dmcha:id_DMCha,daDuyet:"1",trangThai:"1",loaiTinDang:"tinmua"}).count((err, count) => {
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
  });    
}) 
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
  let perPage = 1;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
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
  });    
}) 
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
  var huyen=query.huyen
  var xa=query.xa
  var loaiTinDang=query.loaiTinDang

  let perPage = 9;
  let page = req.params.page || 1;
  DM_Cha.findOne({_id:id_DMCha},function(err,cha){
    DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
      TinDang.find({dmCon:id_DMCon,daDuyet:"1",trangThai:"1"}).skip((perPage * page) - perPage) .limit(perPage) .exec((err, tindang) => {
        TinDang.find({dmCon:id_DMCon,daDuyet:"1",trangThai:"1"}).count((err, count) => {
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
    if (err)  res.redirect('/404')
    else{
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
  })
})






/**
 * router
 */
//Home
router.get("/", function(req, res) {
    TinDang.find({ }, function(err, folders) {
      if (err) throw err;
      res.render("tindang", { folders: folders });
    });
  
});

//Logout
router.get("/signout", function(req, res) {
  console.log("call to index...");
  req.session.destroy();
  res.render("login");
});

//Sign Up
router.post("/signup", function(req, res) {
  console.log("call to signup post");
  var un = req.body.email;
  var pwd = req.body.password;

  User.findOne({ email: un }, function(err, user) {
    if (err) throw err;
    else {
      if (user == null) {
        var newUser = User({
          email: req.body.email,
          password: req.body.password,
          name: "1",
          avatar: "1"
        });
        // save the user
        newUser.save(function(err) {
          if (err) throw err;
          console.log("User created!");
        });
        res.render("signup", { message1: "Create User Successfully. Please " });
      } else {
        console.log("user exists");
        res.render("signup", { message2: "User already exists." });
      }
    }
  });
});



//Sign In
router.post("/signin", function(req, res) {
  var un = req.body.email;
  var pwd = req.body.password;
  var exists = User.findOne({ email: un, password: pwd }, function(err, user) {
    if (err) throw err;
    else {
      if (user == null) {
        res.render("login", { message: "Login Failed" });
      } else {
        req.session.email = un;
        console.log("user exists");

        Folder.find({ email: un }, function(err, folders) {
          if (err) throw err;

          // object of all the users
          console.log(folders);
          res.render("folders", { folders: folders });
        });
      }
    }
  });
});
//?login
router.post("/login", function(req, res) {
  var un = req.body.email;
  var pwd = req.body.password;
  var exists = User.findOne({ email: un, password: pwd ,trangThai:"1"}, function(err, user) {
    if (err) throw err;
    else {
      if (user == null) {
        res.render("login-register", { mesLog: "Login Failed" });
      } else {
        //kiểm tra có phải là admin ko
        if(user.loaiTaiKhoan=="3"){
          req.session.email = un;
          req.session.admin = un;
          res.redirect('/gallery')
        } else{
          req.session.email = un;
          res.redirect('/gallery')
        }
        
      }
    }
  });
});


/**
 * !bảng users: biến User
 */
//?get profile
router.get("/profile", function(req, res) {
  console.log("call to folders.." + req.session.email);
  if (req.session.email != null) {
    User.find({ email: req.session.email }, function(err, user) {
      if (err) throw err;

      // object of all the users
      console.log(user);
      res.render("user", { user: user });
    });
  } else {
    res.render("error", { message: "Login to continue" });
  }
});

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
router.post("/profile/upload", upload.single("file"), function(req, res) {
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

          res.render("user", { user: user });
        });
      }
    }
  );
});
//!xóa upload file cũ đi
//? user đổi ảnh
router.post("/info/editavatar", upload.single("file"), function(req, res) {
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

          res.render("user", { mespass: "đổi ảnh thành công"  });
        });
      }
    }
  );
});
//? admin đổi ảnh
router.post("/admin/info/editavatar", upload.single("file"), function(req, res) {
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

          res.render("admin_info", { mespass: "đổi ảnh thành công"  });
        });
      }
    }
  );
});


//? XÓA edit profile
router.post("/profile/edit", function(req, res) {
  var pass = req.body.password,
    name = req.body.name;
  User.update(
    {
      email: req.session.email
    },
    {
      password: pass,
      name: name
    },
    function(err, folders) {
      if (err) {
        return res.status(500).json(err);
      } else {
        User.find({ email: req.session.email }, function(err, user) {
          if (err) throw err;

          res.render("user", { user: user });
        });
      }
    }
  );
});
//admin: xem tất cả các user thành viên
router.get("/admin/users",function(req,res){
  User.find({},function(req,items){
    //xử lý dữ liệu loại tài khoản, trang thái
    for(i=0;i<items.length;i++){
      if(items[i].loaiTaiKhoan==="1") items[i].loaiTaiKhoan="User-Thường"
      if(items[i].loaiTaiKhoan==="3") items[i].loaiTaiKhoan="ADMIN"
      if(items[i].trangThai==="1") items[i].trangThai="active"
      if(items[i].trangThai==="0") items[i].trangThai="lock"
    }
    res.render("admin_users",{users:items})
  })
})
//admin: xóa tài khoản thành viên
router.get('/admin/users/delete/:_id', function(req, res) {
 
   User.remove({ _id:req.params._id }, function(err) {
    if (err) {
          console.log("Error in delete"+err);  
    }
    else {
        res.redirect('/admin/users')           
    }
    });
})
//admin: khóa tài khoản thành viên
//admin: set tài khoản admin
router.post('/admin/users/edit', function(req, res) {
 var loaiTaiKhoan=req.body.loaiTaiKhoan;
 var trangThai=req.body.trangThai
  User.update({
     _id:req.body._id
}, {
  loaiTaiKhoan:loaiTaiKhoan,
  trangThai:trangThai
}, function (err, folders) {
    if (err) {
        return res.status(500).json(err);
    } else {
     //chuyển router
      res.redirect('/admin/users')
    }
}

);
});


////?
//Get Folders
router.get("/folders", function(req, res) {
  console.log("call to folders.." + req.session.email);
  if (req.session.email != null) {
    Folder.find({ email: req.session.email }, function(err, folders) {
      if (err) throw err;

      // object of all the users
      console.log(folders);
      res.render("folders", { folders: folders });
    });
  } else {
    res.render("error", { message: "Login to continue" });
  }
});

//Create Folders
router.post("/folders", function(req, res) {
  var name = req.body.folderName;
  var describe = req.body.folderDescribe;
  if (req.session.email != null) {
    console.log("call to create folders---------" + req.session.email);
    var email = req.session.email[0];
    var newFolder = Folder({
      name: name,
      email: email,
      created: Date(),
      tasks: [],
      describe: describe,
      members: []
    });
    // save the user
    newFolder.save(function(err) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("Folder created!!");
    });

    //chuyển router
    res.redirect("/folders");
  } else {
    res.render("error", { message: "Login to continue" });
  }
});

//Delete Folder
router.get("/folders/delete/:folderName", function(req, res) {
  console.log("call to tasks.." + req.params.folderName);

  if (req.session.email != null) {
    Folder.remove(
      { email: req.session.email, name: req.params.folderName },
      function(err) {
        if (err) {
          console.log("Error in delete" + err);
        } else {
          //chuyển router
          res.redirect("/folders");
        }
      }
    );
  } else {
    res.redirect("error", { message: "Login to continue" });
  }
});

//edit Folder
router.get("/folders/edit", function(req, res) {
  var query = require("url").parse(req.url, true).query;

  Folder.update(
    {
      email: req.session.email,
      name: query.folderName
    },
    {
      describe: query.folderDescribe
    },
    function(err, folders) {
      if (err) {
        return res.status(500).json(err);
      } else {
        //chuyển router
        res.redirect("/folders");
      }
    }
  );
});

//Get Tasks of a folders
router.get("/folders/:folderName?", function(req, res) {
  if (req.session.email != null) {
    console.log("call to tasks.." + req.params.folderName);

    Folder.findOne(
      { email: req.session.email, name: req.params.folderName },
      function(err, folder) {
        if (err) throw err;
        console.log(folder);
        res.render("tasks", { folder: folder });
      }
    );
  } else {
    res.render("error", { message: "Login to continue" });
  }
});

//Create Tasks
router.post("/tasks/:foldername", function(req, res) {
  if (req.session.email != null) {
    var email = req.session.email;
    console.log(
      "call to create tasks.." + req.params.foldername + req.body.taskName
    );

    Folder.findOneAndUpdate(
      { email: req.session.email, name: req.params.foldername },
      {
        $push: {
          tasks: {
            tname: req.body.taskName,
            progress: "0",
            _idUserMember: req.body._idUserMember,
            _idUserReviewer: req.body._idUserReviewer,
            priority: req.body.priority
          }
        }
      },
      { new: true },
      function(err, folder) {
        if (err) {
          console.log("Error on task save " + err);
          throw err;
        }
        // we have the updated user returned to us
        console.log("Updated " + folder);
        res.render("tasks", { folder: folder });
      }
    );
  } else {
    res.render("error", { message: "Login to continue" });
  }
});

//edit Tasks
router.post("/tasks/edit/:foldername/:_idtask", function(req, res) {
  if (req.session.email != null) {
    var email = req.session.email;
    console.log("call to edit tasks.." + req.params.foldername);

    Folder.update(
      {
        email: req.session.email,
        name: req.params.foldername,
        "tasks._id": req.params._idtask
      },
      {
        "tasks.$.tname": req.body.taskName,
        "tasks.$.progress": req.body.progress,
        "tasks.$._idUserMember": req.body._idUserMember,
        "tasks.$._idUserReviewer": req.body._idUserReviewer,
        "tasks.$.priority": req.body.priority
      },
      { new: true },
      function(err, folder) {
        if (err) {
          console.log("Error on task save " + err);
          throw err;
        }

        //getLoadTasks(req,res)
        //load lại data folder
        Folder.findOne(
          { email: req.session.email, name: req.params.foldername },
          function(err, folder) {
            if (err) throw err;
            console.log("lan 2" + folder);
            res.render("tasks", { folder: folder });
          }
        );
      }
    );
  } else {
    res.render("error", { message: "Login to continue" });
  }
});

//Delete tasks
router.get("/folders/delete/:folderName/:taskName", function(req, res) {
  if (req.session.email != null) {
    var temail = req.session.email;
    console.log(
      "call to delte tasks......" +
        temail +
        req.params.folderName +
        req.params.taskName
    );

    Folder.findOneAndUpdate(
      { email: temail, name: req.params.folderName },
      { $pull: { tasks: { tname: req.params.taskName } } },
      { new: true },
      function(err, folder) {
        if (err) {
          console.log("Error on task save " + err);
          throw err;
        }
        // we have the updated user returned to us
        console.log("Updated " + folder);
        res.render("tasks", { folder: folder });
      }
    );
  } else {
    res.render("error", { message: "Login to continue" });
  }
});

// router.get('/folders/delete/:folderName/:taskName', function (req, res) {
//   if(req.session.email!=null){
//     var temail =req.session.email;
//     var task=req.params.taskName
//     Folder.remove({
//       email:temail, name:req.params.folderName,tasks:task
//   }, function (err, folder) {
//       if (err) {
//           return res.status(500).json(err);
//       } else {
//         res.render('tasks', {folder:folder});
//       }
//   })
//   }
// });

//add members vào folder
router.post("/members/add/:foldername", function(req, res) {
  if (req.session.email != null) {
    var email = req.session.email;
    console.log(
      "call to create tasks.." + req.params.foldername + req.body.taskName
    );

    Folder.findOneAndUpdate(
      { email: req.session.email, name: req.params.foldername },
      {
        $push: { members: { mName: req.body.mName, address: req.body.address } }
      },
      { new: true },
      function(err, folder) {
        if (err) {
          console.log("Error on member add  " + err);
          throw err;
        }
        // we have the updated user returned to us
        console.log("Updated " + folder);
        res.render("tasks", { folder: folder });
      }
    );
  } else {
    res.render("error", { message: "Login to continue" });
  }
});

//Delete member
router.get("/members/delete/:folderName/:id", function(req, res) {
  if (req.session.email != null) {
    var temail = req.session.email;
    console.log("call to delte members......" + temail + req.params.folderName);
    Folder.findOneAndUpdate(
      { email: temail, name: req.params.folderName },
      { $pull: { members: { _id: req.params.id } } },
      { new: true },
      function(err, folder) {
        if (err) {
          console.log("Error on task save " + err);
          throw err;
        }
        // we have the updated user returned to us
        console.log("Updated " + folder);
        res.render("tasks", { folder: folder });
      }
    );
  } else {
    res.render("error", { message: "Login to continue" });
  }
});

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
  res.render("404", { mes: "Login to continue" });
}
});
//get TinDang cho tất cả user
router.get("/tindangs", function(req, res) {
  TinDang.find({}, function(err, tindang) {
    console.log("TCL: tindang", tindang);
    if (err) throw err;
    res.render("tindang", { tindang: tindang });
  });
});
//admin:get TinDang chưa duyệt cho tất cả cho admin
router.get("/admin/tindangs", function(req, res) {
  TinDang.find({daDuyet:"0"}, function(err, tindang) {
    if (err) throw err;
    res.render("admin_tindang", { tindang: tindang });
  });
});
//post tinDang theo dm cha cho tất cả user 
//?nếu dùng post: thì cho gửi params có dấu
//?nếu dùng get : thì phải sửa lại cấu trúc là truyền bằng id
router.post("/tindangs/dmcha", function(req, res) {
  TinDang.find({dmcha:req.body.tencha}, function(err, tindang) {
    if (err) throw err;
    res.render("tindang", { tindang: tindang });
  });
});
//get tinDang dmcon cho tất cả user
router.post("/tindangs/dmcon", function(req, res) {
  TinDang.find({dmcon:req.body.tencon}, function(err, tindang) {
    if (err) throw err;
    res.render("tindang", { tindang: tindang });
  });
});
//get tinDang theo tìm kiếm
//get tindang theo sap xep

//!Create tindang
router.post("/tindang",upload.any(), function(req, res) {
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
  var email = "111@gmail.com";

  var dateTime = Date()
  date = dateTime.split(' ', 4).join(' ');
  var newTinDang = TinDang({
    tieuDe: tieuDe,
    moTaChiTiet: moTaChiTiet,
    email_User: email,
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
      console.log("loi roi" + err);
      throw err;
    }
    console.log("Tin Đăng created!!" + a);
  });
  res.redirect("/tindang");
});
//!-lấy danh mục cha
router.get("/getdmchas", function(req, res) {
  DM_Cha.find({}, function(err, cha) {
				
        res.render("resviews/getdmcha", { lst_DMCon_R: cha });
  });
});
//!-lấy danh mục con 
router.get("/getdmcons/:tencha", function(req, res) {
  var tencha= req.params.tencha
  DM_Cha.findOne({_id:tencha}, function(err, cha) {
    if(cha!=null){
      DM_Con.find({tenDMCha:cha.tenDMCha}, function(err, folders) {
        res.render("resviews/getdmcon", { lst_DMCon_R: folders });
        })
    }
    else
    res.render("resviews/getdmcon")
   
  });
});
//!-lấy địa chỉ-full tên tỉnh
router.get('/gettinhs', function(req, res){
  request('https://thongtindoanhnghiep.co/api/city', function (error, response, items) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(items)
      res.render('resviews/gettinhs',{obj:info.LtsItem})
    }
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
    else res.render('resviews/getqh');
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
    res.render('resviews/getphuongxa')
  })
});




//user:sửa 1 tin đăng
router.post("/tindang/edit", function(req, res) {
  TinDang.update(
    {
      email: req.session.email,
      _id: req.body._idTinDang
    },
    {
      tieuDe: req.body.tieuDe,
      moTaChiTiet: req.body.moTaChiTiet
    },
    function(err, folders) {
      if (err) {
        return res.status(500).json(err);
      } else {
        //chuyển router
        res.redirect("/tindang");
      }
    }
  );
});

//admin: duyệt 1 tin đăng
router.post("/admin/tindang/edit", function(req, res) {

  TinDang.update(
    {
      _id: req.body._id
    },
    {
      daDuyet:req.body.duyet
    },
    function(err, folders) {
      if (err) {
        return res.status(500).json(err);
      } else {
        //chuyển router
        res.redirect("/admin/tindangs");
      }
    }
  );
});
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
              console.log("Error in delete" + err);
            } else {
              res.redirect("/tindang");
            }
          });
        })
      })
    });
  }) 
});
//test xoa
router.get('/testxoaanh',function(req,res){
   var link='public/upload/'+'1553662541612-aa.gif' ;
  fs.unlink(link, function (err) {})
})
//xóa 1 tin đăng => xóa ảnh upload
router.get("/tindang/delete/:_idTinDang", function(req, res) {
  TinDang.findOne({_id:req.params._idTinDang},function(err,item){
    //xóa ảnh
    var link='public/upload/'+item.anh1;
    fs.unlink(link, function (err) {
      //xóa tin đăng
      TinDang.remove({ _id: req.params._idTinDang }, function(err) {
        if (err) {
          console.log("Error in delete" + err);
        } else {
          res.redirect("/tindang");
        }
      });
    });
  })
  
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
  res.render("404", { message: "Login to continue" });
 
});

// admin: thêm danh mục cha
router.post("/dmcha",upload.single("file"), function(req, res) {
 
  var tenDMCha = req.body.tenDMCha;
  DM_Cha.findOne({ tenDMCha: tenDMCha }, function(err, dmcha) {
    if (err) throw err;
    else {
      if (dmcha == null) {
        var newDMCha = DM_Cha({
          tenDMCha: tenDMCha,
          anh1:req.file.filename
        });
        // save the dm cha
        newDMCha.save(function(err) {
          if (err) throw err;
          console.log("DM cha created!");
        });
        res.redirect('/dmchas')
      } else {
        console.log("user exists");
        res.render("danhmuc_cha", { mes_DMCha_C: "DM cha already exists." });
      }
    }
  });
});

// admin: sửa danh mục cha
router.post("/dmcha/edit", function(req, res) {
  var tenDMCha = req.body.tenDMCha;
  var id_DMCha = req.body.id_DMCha;
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
});

// admin: xóa dm cha
router.get("/dmcha/delete/:id_DMCha", function(req, res) {
  DM_Cha.findOne({_id:req.params.id_DMCha},function(err,item){
    var link='public/upload/'+item.anh1;
    fs.unlink(link, function (err) {
      DM_Cha.remove({ _id: req.params.id_DMCha }, function(err) {
        if (err) {
          console.log("Error in delete" + err);
        } else {
          res.redirect("/dmchas");
        }
      });
    });
  })
});

//user: sử dụng danh mục cha
router.get("/dmchas", function(req, res) {
  DM_Cha.find({}, function(err, folders) {
    if (err) throw err;
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
  DM_Con.find({}, function(err, folders) {
    if (err) throw err;
    DM_Cha.find({}, function(err, folders1) {
      if (err) throw err;
      res.render("danhmuc_con", { lst_DMCha_R: folders1,lst_DMCon_R: folders });
    });
  });
});
//?hiển thị danh mục con theo danh mục cha
router.get("/dmcons/:tencha", function(req, res) {
  var tencha= req.params.tencha
  DM_Con.find({tenDMCha:tencha}, function(err, folders) {
    if (err) throw err;
    console.log(folders);
    res.render("danhmuc_con", { lst_DMCon_R: folders });
  });
});
// admin: thêm danh mục
router.post("/dmcon", function(req, res) {
  var tenDMCon = req.body.tenDMCon;
  DM_Con.findOne({ tenDMCon: tenDMCon }, function(err, dmcon) {
    if (err) throw err;
    else {
      if (dmcon == null) {
        var newDMCon = DM_Con({
          tenDMCon: tenDMCon,
          tenDMCha: req.body.tenDMCha
        });
        // save the dm con
        newDMCon.save(function(err) {
          if (err) throw err;
          console.log("DM con created!");
        });
        res.redirect('/dmcons');
      } else {
        console.log("user exists");
        res.render("danhmuc_con", { mes_DMCon_C: "DM cha already exists." });
      }
    }
  });
});
// admin: sửa tên danh mục con
router.post("/dmcon/edit", function(req, res) {
  var tenDMCon = req.body.tenDMCon;
  var id_DMCon = req.body.id_DMCon;
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
              return res.status(500).json(err);
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
});
// admin: xóa dm con
router.get("/dmcon/delete/:id_DMCon", function(req, res) {
  DM_Con.remove({ _id: req.params.id_DMCon }, function(err) {
    if (err) {
      console.log("Error in delete" + err);
    } else {
      res.redirect("/dmcons");//
    }
  });
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
    trangThai:'chưa duyệt',
    tieuDe:tieuDe
  });
  newbcTin.save(function(err, a) {
    if (err) {
      throw err;
    }
  });
  res.redirect("/bctindangs");
});
//hiển thị tất cả báo cáo cho 1 id tin đăng


//admin: hiển thị tất cả các báo cáo
router.get('/bctindangs', function(req, res) { 
 
  BC_Tin.find({}, function(err, items) {
 if (err) throw err;
 res.render('bctindang', {lst_BCTin:items}); 
});
});

//admin: update trạng thái báo cáo
router.post('/bctindang/edit', function(req, res) {
  BC_Tin.update({
     _id:req.body.id_BCTin    
}, {
  trangThai:req.body.trangThai
}, function (err, folders) {
    if (err) {
        return res.status(500).json(err);
    } else {
     //chuyển router
      res.redirect('/bctindangs') 
    }
})
});
//admin: xóa báo cáo
router.get("/bctindang/delete/:id_bctindang", function(req, res) {
  BC_Tin.remove({ _id: req.params.id_bctindang }, function(err) {
    if (err) {
    } else {
      res.redirect("/bctindangs");//
    }
  });
});
//admin: xoá tất cả các báo cáo có trạng thái=duyệt-Sai

/**
 * ! bảng usertheodois  -biến:UserTheoDoi -view :
 *  TODOS CRUD user theo dõi cho user
 *  ?view
 */
//user: hiển thị tất cả các user theo dõi theo từng user
router.get("/usertheodois", function(req, res) {
        UserTheoDoi.find({email_User:"111@gmail.com"}, function(err, folders) {
          if (err) throw err;
          res.render("usertheodoi", { userTheoDoi: folders });
        });
  });

//user: theo dõi 1 user => kiểm tra trùng
router.post('/usertheodoi', function(req, res) {
  var email = "111@gmail.com";
  var id_UserTheoDoi =req.body.id_UserTheoDoi;
   
  UserTheoDoi.findOne({ id_UserTheoDoi: id_UserTheoDoi,email_User:email }, function(err, user) {
    if (err) throw err;
    else
    {
     if(user==null)
     {
        var newUser = UserTheoDoi({
            email_User: email,
            id_UserTheoDoi: id_UserTheoDoi              
        });
         newUser.save(function(err) {
         if (err) throw err;
         });
         res.redirect('/usertheodois');
     }
     else
     {  
          res.redirect('/usertheodois');
     }
    }
  });
  });
  
//user: xóa theo dõi 1 user
router.get('/usertheodoi/delete/:IDName', function(req, res) {
  var email="111@gmail.com"

   UserTheoDoi.remove({ email_User: email, _id:req.params.IDName }, function(err) {
    if (err) {
    }
    else {
    res.redirect('/usertheodois')        
    }
    });
});


 /**
  * !bảng  tintheodois -biến: TinDangTheoDoi ,-view:
  * TODOS CRUD tin đăng theo dõi cho user
  * ?view
  */
//user: hiển thị tất cả các tin đăng theo dõi theo từng user
router.get("/tdtheodois", function(req, res) {
  TinDangTheoDoi.find({email_User:"111@gmail.com"}, function(err, folders) {
    if (err) throw err;
    res.render("tdtheodoi", { tdTheoDoi: folders });
  });
});
//user: theo dõi 1 tin đăng
router.post('/tdtheodoi', function(req, res) {
  var email = "111@gmail.com";
  var id_TinDangTheoDoi =req.body.id_tdTheoDoi;
   
  TinDangTheoDoi.findOne({ id_TinDangTheoDoi: id_TinDangTheoDoi,email_User:email }, function(err, user) {
    if (err) throw err;
    else
    {
     if(user==null)
     {
        var newUser = TinDangTheoDoi({
            email_User: email,
            id_TinDangTheoDoi: id_TinDangTheoDoi              
        });
         newUser.save(function(err) {
         if (err) throw err;
         });
         res.redirect('/tdtheodois');
     }
     else
     {  
          res.redirect('/tdtheodois');
     }
    }
  });
  });
//user: xóa theo dõi 1 tin đăng
router.get('/tdtheodoi/delete/:IDName', function(req, res) {
  var email="111@gmail.com"

   TinDangTheoDoi.remove({ email_User: email, _id:req.params.IDName }, function(err) {
    if (err) {
    }
    else {
    res.redirect('/tdtheodois')        
    }
    });
});























//export
module.exports = router;
