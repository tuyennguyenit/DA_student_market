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

/**
 * router
 */
//Home
router.get("/", function(req, res) {
  console.log("call to index...");
  if (req.session.email == null) {
    res.render("login");
  } else {
    Folder.find({ email: req.session.email }, function(err, folders) {
      if (err) throw err;

      // object of all the users
      console.log(folders);
      res.render("folders", { folders: folders });
    });
  }
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

// router
router.get("/login", function(req, res) {
  res.render("login");
});
router.get("/signup", function(req, res) {
  res.render("signup");
});
router.get("/index1", function(req, res) {
  res.render("index1");
});

//End router

//Sign In
router.post("/signin", function(req, res) {
  console.log("call to signin post");
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

/**
 * !bảng users: biến User
 */
//get profile
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

//upload image profile
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

//edit profile
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
  res.render("error", { message: "Login to continue" });
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
//get tinDang theo loại cho tất cả user
//get tinDang theo tìm kiếm
//get tindang theo sap xep

//!Create tindang
router.post("/tindang",upload.single("file"), function(req, res) {
  var tieuDe = req.body.tieuDe;
  var moTaChiTiet = req.body.moTaChiTiet;
  var thoiHan='Không Thời Hạn'
  if(req.body.thoiHan !==''){
    thoiHan= req.body.thoiHan
  }

  var tinh=req.body.tinh;
  var huyen=req.body.huyen;
  var xa=req.body.xa;
  var soNha=req.body.soNha;
  var diaChi=soNha+','+xa+','+huyen+','+tinh
  var email = "111@gmail.com";

  var dateTime = Date()
  date = dateTime.split(' ', 4).join(' ');
  var newTinDang = TinDang({
    tieuDe: tieuDe,
    moTaChiTiet: moTaChiTiet,
    email_User: email,
    anh1: req.file.filename,
    dmcha:req.body.dmcha,

    dmCon:req.body.dmCon,
    diaChi:diaChi,  
    gia:req.body.gia,     
    loaiTinDang: req.body.loaiTinDang,
    trangThai:"hiện",
    daDuyet:"Chưa Duyệt", 
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
//!-lấy địa chỉ- tên tỉnh
router.get('/gettinhs', function(req, res){
  request('https://thongtindoanhnghiep.co/api/city', function (error, response, items) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(items)
      res.render('resviews/gettinhs',{obj:info.LtsItem})
    }
  })
});
//!-lấy địa chỉ -quận huyện
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
//!-lấy địa chỉ phường xã
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




//sửa 1 tin đăng
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
  DM_Cha.find({}, function(err, folders) {
    if (err) throw err;
    res.render("danhmuc", { lst_DMCha_R: folders });
  });
});

// admin: thêm danh mục cha
router.post("/dmcha", function(req, res) {
  console.log("call to create dmcha");
  var tenDMCha = req.body.tenDMCha;
  DM_Cha.findOne({ tenDMCha: tenDMCha }, function(err, dmcha) {
    if (err) throw err;
    else {
      if (dmcha == null) {
        var newDMCha = DM_Cha({
          tenDMCha: tenDMCha
        });
        // save the dm cha
        newDMCha.save(function(err) {
          if (err) throw err;
          console.log("DM cha created!");
        });
        res.redirect('/dmchas')
      } else {
        console.log("user exists");
        res.render("danhmuc", { mes_DMCha_C: "DM cha already exists." });
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
        res.render("dmcha", { mes_DMCha_U: "danh mục bị trùng" });
      }
    }
  });
});

// admin: xóa dm cha
router.get("/dmcha/delete/:id_DMCha", function(req, res) {
  DM_Cha.remove({ _id: req.params.id_DMCha }, function(err) {
    if (err) {
      console.log("Error in delete" + err);
    } else {
      res.redirect("/dmchas");
    }
  });
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
    console.log(folders);
    res.render("danhmuc", { lst_DMCon_R: folders });
  });
});
//?hiển thị danh mục con theo danh mục cha
router.get("/dmcons/:tencha", function(req, res) {
  var tencha= req.params.tencha
  DM_Con.find({tenDMCha:tencha}, function(err, folders) {
    if (err) throw err;
    console.log(folders);
    res.render("danhmuc", { lst_DMCon_R: folders });
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
        res.render("danhmuc", { mes_DMCon_C: "DM cha already exists." });
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
        res.render("danhmuc", { mes_DMCha_U: "danh mục bị trùng" });//
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
