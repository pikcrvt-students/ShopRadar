// Importē mongoose bibliotēku darbam ar MongoDB
const mongoose = require('mongoose');

// Izveido lietotāja (user) shēmu
const userSchema = new mongoose.Schema(
  {
    // Lietotājvārds
    username: {
      type: String,        // Datu tips - teksts
      required: true,      // Obligāts lauks
      trim: true,          // Noņem liekās atstarpes sākumā un beigās
      minlength: 3,        // Minimālais garums - 3 simboli
      maxlength: 50        // Maksimālais garums - 50 simboli
    },

    // E-pasta adrese
    email: {
      type: String,        // Datu tips - teksts
      required: true,      // Obligāts lauks
      unique: true,        // Katram lietotājam jābūt unikālam e-pastam
      trim: true,          // Noņem liekās atstarpes
      lowercase: true      // Automātiski pārveido uz mazajiem burtiem
    },

    // Parole
    password: {
      type: String,        // Datu tips - teksts
      required: true       // Obligāts lauks
    }
  },
  {
    // Automātiski pievieno createdAt un updatedAt laukus
    timestamps: true
  }
);

// Eksportē modeli "User", lai to varētu izmantot citos failos
module.exports = mongoose.model('User', userSchema);