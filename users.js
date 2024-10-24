const express = require("express");
const route = express.Router();
const db = require("../db/database");

const userApi = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // if (password.length < 6) throw "password must be min 6 charaters";
    const chat1Data = await db("users").insert({
      name,
      email,
      password,
    });
    return res.json({ msg: `record inserted` });
  } catch (e) {
    return res.status(500).json("thers is an issue");
  }
};
route.post("/userApi", userApi);
module.exports = route;
