var express = require("express");
var router = express.Router();
var path = require("path");

//require Model
var User = require.main.require("./models/user");
var Folder = require.main.require("./models/folder");
var TinDang = require.main.require("./models/tindang");
var DM_Cha = require.main.require("./models/dMChaModel");
var DM_Con = require.main.require("./models/dMConModel");

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

// router=====================================
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
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

//upload image profile
router.post("/profile/upload", upload.single("file"), function(req, res) {
  console.log(req.file.originalname);
  User.update(
    {
      email: req.session.email
    },
    {
      avatar: req.file.originalname
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
 * ?
 *
 */
//Get TinDang cho từng user
router.get("/tindang", function(req, res) {
  TinDang.find({ email_User: "111@gmail.com" }, function(err, tindang) {
    console.log("TCL: tindang", tindang);
    if (err) throw err;
    res.render("tindang", { tindang: tindang });
  });
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

//Create tindang
router.post("/tindang", function(req, res) {
  var tieuDe = req.body.tieuDe;
  var moTaChiTiet = req.body.moTaChiTiet;

  console.log("call to create tindang---------" + req.session.email);
  var email = "111@gmail.com";
  var newTinDang = TinDang({
    tieuDe: tieuDe,
    moTaChiTiet: moTaChiTiet,
    email_User: email
  });
  // save the user
  newTinDang.save(function(err, a) {
    if (err) {
      console.log("loi roi" + err);
      throw err;
    }
    console.log("Tin Đăng created!!" + a);
  });

  //chuyển router
  res.redirect("/tindang");
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

//xóa 1 tin đăng
router.get("/tindang/delete/:_idTinDang", function(req, res) {
  TinDang.remove({ _id: req.params._idTinDang }, function(err) {
    if (err) {
      console.log("Error in delete" + err);
    } else {
      //chuyển router
      res.redirect("/tindang");
    }
  });
});

//báo cáo 1 tin đăng...

/**
 * !bảng dm_cha : biến DM_Cha
 * TODO CRUD danh mục cha cho admin/user
 * ?view ở đâu
 */
// hiển thị dm cha
router.get("/dmchas", function(req, res) {
  DM_Cha.find({}, function(err, folders) {
    if (err) throw err;
    console.log(folders);
    res.render("dmcha", { lst_DMCha_R: folders });
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
        res.render("dmcha", { mes_DMCha_C: "Create DM cha Successfully" });
      } else {
        console.log("user exists");
        res.render("dmcha", { mes_DMCha_C: "DM cha already exists." });
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

/**
 * !bảng dm_con biến model:DM_Con
 * TODOS CRUD danh mục con cho admin/user
 * ?view ở đâu
 */

//  hiển thị dm con
router.get("/dmcons", function(req, res) {
  DM_Con.find({}, function(err, folders) {
    if (err) throw err;
    console.log(folders);
    res.render("dmcha", { lst_DMCon_R: folders });
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
          tenDMCha: req.body.tenDMCha,
          moTa: []
        });
        // save the dm con
        newDMCon.save(function(err) {
          if (err) throw err;
          console.log("DM con created!");
        });
        res.render("dmcha", { mes_DMCha_C: "Create DM cha Successfully" });
      } else {
        console.log("user exists");
        res.render("dmcha", { mes_DMCha_C: "DM cha already exists." });
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
              res.redirect("/dmcons");//
            }
          }
        );
      } else {
        res.render("dmcha", { mes_DMCha_U: "danh mục bị trùng" });//
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
      res.redirect("/dmchas");//
    }
  });
});
//user: sử dụng danh mục con

























//export
module.exports = router;
