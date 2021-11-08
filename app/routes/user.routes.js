const { authJwt, verifydata, verifySignUp } = require("../middlewares");
const controller = require("../controllers/user.controller");
const { verify } = require("jsonwebtoken");

const URLUSERS = "/api/users";
const URLROLES = "/api/roles";

module.exports = function(app) {

  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(URLROLES + '/list'
    //,[authJwt.verifyToken]
    ,controller.getRoles);

  app.get(URLROLES + '/id/:roleId'
   // ,[authJwt.verifyToken]
    ,controller.getRole);

  app.get(URLROLES + '/name/:roleName'
    //,[authJwt.verifyToken]
    ,controller.getRoleByName);

  /**
   * Get single USER by ID
   */
  app.get(URLUSERS + '/username/:username' 
    //,[authJwt.verifyToken] 
    ,controller.getOneByUsername);


  app.get(URLUSERS + '/id/:userId' 
  //,[authJwt.verifyToken] 
  ,controller.getOne);

  /**
   * Get all USER records
   */
  app.get(URLUSERS + '/list' 
    //,[authJwt.verifyToken] 
    ,controller.all);

    app.get(URLUSERS + '/roles/id/:userId',
    //[authJwt.verifyToken],
    controller.oneJoined)

  app.get(URLUSERS + '/roles/list',
    //[authJwt.verifyToken],
    controller.allJoined)
  /**
   * Get all preliminary user records
   */
  app.get(URLUSERS + "preliminary" ,[authJwt.verifyToken] ,controller.allPreliminary);

  /**
  * Create user record
  */
  app.post(URLUSERS, [authJwt.verifyToken,verifySignUp.checkDuplicateUsernameOrEmail,verifySignUp.checkRolesExisted] ,controller.create);

  /**
   * Update user record
   */
  app.put(URLUSERS , [authJwt.verifyToken] , controller.create);

  /**
   * Delete user record
   */
  app.delete(URLUSERS,[authJwt.verifyToken],controller.delete);

};
