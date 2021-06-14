const {
  okResponse,
  badRequestError,
  to,
  unverifiedError,
  loginResponse,
} = require("../../../global_functions");
const User = require("../../models/userModel");
const Category = require("../../models/categoryModel");

const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SignUp = async (req, res) => {
  console.log("body data" + req.body);
  let { email, password, fullName, userName, category } = req.body;

  const userProfileImage =
    "https://res.cloudinary.com/hmwv9zdrw/image/upload/v1600970783/user_vopbzk.png";



  //email and password validation before inserting user
  // if (!validator.isEmail(email || ""))
  //   return badRequestError(res, "Enter a valid email address");
  if (password === "") return badRequestError(res, "password can not be empty");

  let [error, result] = await to(User.query().where("email", email).first());
  if (error) console.log(error);
  if (result) {
    console.log(result);
    return badRequestError(res, " email already exists");
  }

  // password = await bcrypt.hash(password, 10); //hashing password on validating email and pass


  let [err, user_inserted] = await to(
    User.query()
      .insert({ email: email, fullName: fullName, password: password, userName: userName })
      .returning("*")
  );
  if (err) { badRequestError(res, "unable to insert user"); }

  else {
    delete user_inserted.password;

    console.log("USER's detail ", user_inserted.userId);

    console.log("USER's detail ", user_inserted.userId);

    return okResponse(res, { user: user_inserted }, "user inserted successfully");
  }
};


const CategoryPri = async (req, res) => {
  var flag = 0;
  let { userId } = req.user;
  console.log("userId " + userId);

  for (let item of req.body) {
    let [errorCat, cat_inserted] = await to(
      Category.query()
        .insert({ userId: userId, category: item.category, catImage: item.image })
        .returning("*")
    );
    if (errorCat) {
      console.log(" error  " + errorCat);
      flag = 0;
    }
    // badRequestError(res, errorCat,"unable to insert category");

    else {
      console.log(" Category details  " + cat_inserted.category);
      flag = 1;
      //return okResponse(res,{categories: cat_inserted}, "user inserted successfully");
    }
  }



  if (flag == 1)
    return okResponse(res, "category inserted successfully");
  else {
    badRequestError(res, "unable to insert category");

  }
};




const Login = async (req, res) => {
  let access_token;
  console.log(req.body);
  let { email, password } = req.body;
  // if (!validator.isEmail(email || ""))
  //   return badRequestError(res, "Enter a valid email address ");
  if (password === "") return unverifiedError(res, "password field is empty");
  let [incorrect, user_returned] = await to(
    User.query().findOne("email", email).throwIfNotFound()
  );
  console.log("user_returned  " + user_returned)
  if (incorrect) return badRequestError(res, "email does not exists");

  //Checking whether email is verified
  if (user_returned.email === email) {
    //checking password
    if (password === user_returned.password) {
      //Generating JWT token on correct password for USER type


      access_token = await jwt.sign(
        { email, userId: user_returned.userId, name: user_returned.userName },
        "secret123",
        {
          expiresIn: "24h",
        }
      );

      res.setHeader("Authorization", access_token);
      res.setHeader("access-control-expose-headers", "authorization");

      delete user_returned.password;
      return okResponse(res, { user: user_returned, token: access_token }, "loged in successfully");
    }
    //Error returned when password is invalid
    return unverifiedError(res, "invalid password");
  }

}




// Change user password
const ChangePassword = async (req, res) => {
  let { new_password, old_password, email } = req.body;
  if (!email) return badRequestError(res, "email field is empty");
  if (!new_password || !old_password)
    return badRequestError(res, "password field is empty");

  let [error, user_detail] = await to(
    Users.query()
      .findOne("email", email)
      .returning("password")
      .throwIfNotFound()
  );
  if (user_detail) {
    //checking old password entered by user
    if (await bcrypt.compare(old_password, user_detail.password)) {
      //if matched then hashing new password
      let new_hashed_password = await bcrypt.hash(new_password, 10);
      let [err, password_updated] = await to(
        Users.query()
          .where("email", email)
          .update({ password: new_hashed_password })
          .throwIfNotFound()
      );
      if (password_updated)
        return okResponse(res, undefined, "password changed successfully");
    } else {
      return badRequestError(res, "old password did not match");
    }
  }
};

//ignore only for testing
const UploadImage = async (req, res) => {
  console.log("body data" + req.body);
  let { userId } = req.user;
  let { image } = req.body;

  const userProfileImage =
    "https://res.cloudinary.com/hmwv9zdrw/image/upload/v1600970783/user_vopbzk.png";





  let [err, user_inserted] = await to(
    User.query()
      .patch({ image: image }).where('userId', userId)
      .returning("*")
  );
  if (err) { badRequestError(res, "unable to insert user"); }

  else {


    return okResponse(res, { user: user_inserted }, "user inserted successfully");
  }
};
const Delete = async (req, res) => {
  let { userId } = req.body;
  let [error, deleted] = await to(Users.query().where("userId", userId).delete().throwIfNotFound());
  if (error) badRequestError(res, "unable to delete");
  okResponse(res, deleted, "delete successfull");
};

module.exports = {
  SignUp,
  Delete,
  Login,
  ChangePassword,
  CategoryPri,
  UploadImage
};


