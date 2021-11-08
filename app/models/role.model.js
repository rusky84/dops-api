const mongoose = require("mongoose");

const Role = mongoose.model(
  "Role",
  new mongoose.Schema(
    {
      name: String,
      descr: String ?? '',
    }, 
    { 
      timestamps: true 
    }
  )
);

module.exports = Role;