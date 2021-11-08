const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const assert = require("assert");

var bcrypt = require("bcryptjs");
const { ObjectId } = require("bson");

exports.allPreliminary = async (req, res) => {
  try {
    User.find({ status: "PRELIMINARY" }, (err, users) => {
      res.json(users);
    })
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

exports.all = async (req, res) => {
  try {
    User.find({}, (err, users) => {
      res.status(200).json(users);
    })
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}

exports.allJoined = async (req, res) => {

  const aggregate = [{$unwind: "$roles"}, {$lookup: {
    from: "roles",
    localField: "roles",
    foreignField: "_id",
    as: "rolesData"
  }}, {$sort: {
    "rolesData.name": 1
  }}, {$unwind: "$rolesData"}, {$group: {
    _id: "$_id",
    rolesData: {
      $push: "$rolesData"
    }
  }}, {$lookup: {
    from: 'users',
    localField: '_id',
    foreignField: '_id',
    as: 'userData'
  }}];

  
  try{
    //const coll = db.user;
    User.aggregate(aggregate, (cmdErr, result) => {
      assert.equal(null, cmdErr);
      if(cmdErr) {
        console.error(cmdErr);
        return res.sendStatus(500);
      }
      return res.status(200).json(result);      
    });
  }
  catch(e){
    console.error(e);
    return res.sendStatus(500);
  }
}

exports.oneJoined = async (req, res) => {

  if(!req.params.userId) {
    res.sendStatus(400);
  }
  const aggregate = [{$match: {
    _id: ObjectId(req.params.userId)
  }}, {$unwind: "$roles"}, {$lookup: {
    from: "roles",
    localField: "roles",
    foreignField: "_id",
    as: "rolesData"
  }}, {$sort: {
    "rolesData.name": 1
  }}, {$unwind: "$rolesData"}, {$group: {
    _id: "$_id",
    rolesData: {
      $push: "$rolesData"
    }
  }}, {$lookup: {
    from: 'users',
    localField: '_id',
    foreignField: '_id',
    as: 'userData'
  }}];

  
  try{
    //const coll = db.user;
    User.aggregate(aggregate, (cmdErr, result) => {
      assert.equal(null, cmdErr);
      if(cmdErr) {
        console.error(cmdErr);
        return res.sendStatus(500);
      }
      return res.status(200).json(result);      
    });
  }
  catch(e){
    console.error(e);
    return res.sendStatus(500);
  }
}

exports.getOneByUsername = async (req, res) => {
  try {
    const rp = req.params;
    var qery = { username: rp.username };
    User.find( qery , (err, user) => {
      return res.status(200).json(user);
    })
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

exports.getOne = async (req, res) => {
  try {
    User.find( { _id: ObjectId(req.params.userId) } , (err, user) => {
      return res.status(200).json(user);
    })
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

exports.delete = async (req, res) => {
  try {
    User.delete( { username: req.body.username }, (err, users) => {
     return  res.status(200).json(users);
    })
  } catch (e) {
    console.error(e);
    return res.sendStatus(500);
  }
}

exports.getRoles = async (req, res) => {
  try{
    Role.find({}, (err,roles) => {
      res.status(200).json(roles);
    })
  } 
  catch (err) {
    console.error(e);
    return res.sendStatus(500);
  }
};

exports.getRole = async (req, res) => {
  try{
    Role.find( { _id: ObjectId(req.params.roleId) } , (err, role) => {
      res.status(200).json(role);
    })
  } 
  catch (err) {
    console.error(e);
    return res.sendStatus(500);
  }
};

exports.getRoleByName = async (req, res) => {
  try{
    Role.find( { name: req.params.roleName } , (err, role) => {
      res.status(200).json(role);
    })
  } 
  catch (err) {
    console.error(e);
    return res.sendStatus(500);
  }
};

/**
 * create new user record
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.create = async (req, res) => {
  try {
    var user = new User({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8),
      email: req.body.email,
      roles: req.body.roles,
    });

    if (req.body.roles) {
      Role.find( 
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = [role._id];
      });
    }

    if (req.method == 'POST') {

      user.save((err, usr) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(usr);
      });
    }
    else if (req.method == 'PUT') {
      var qry = { _id: req.body._id };
      var body = req.body;
      
      user.save (qry, body, (err, data) => {
        if (err) throw err;
        console.log("1 document updated");
        return res.status(200).json(data);
      })
    }
  } catch (err) {
    return res.status(500).send(err);
  }
}

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

