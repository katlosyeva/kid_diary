const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/user");
const Baby = require("../models/baby");
const Skill = require("../models/skill");
const Word = require("../models/word");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async function ({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-Mail is invalid." });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect.");
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.SECRET,

      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return { token: token, userId: user._id.toString() };
  },
  addBaby: async function ({ name }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (validator.isEmpty(name)) {
      errors.push({ message: "Name is invalid." });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Invalid user.");
      error.code = 401;
      throw error;
    }
    const baby = new Baby({
      name: name,
    });
    const addedBaby = await baby.save();
    user.babies.push(addedBaby);
    await user.save();
    return {
      ...addedBaby._doc,
      _id: addedBaby._id.toString(),
    };
  },
  addSkill: async function ({ _id, skill, date }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const errors = [];

    const searchedBaby = await Baby.findById(_id).populate("skills");
    if (!searchedBaby) {
      const error = new Error("Invalid baby.");
      error.code = 401;
      throw error;
    }
    const newSkill = new Skill({
      skill,
      date,
    });
    const addedSkill = await newSkill.save();

    searchedBaby.skills.push(addedSkill);

    await searchedBaby.save();

    return {
      ...addedSkill._doc,
      _id: addedSkill._id.toString(),
    };
  },
  addWord: async function ({ _id, word, date }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const errors = [];

    const searchedBaby = await Baby.findById(_id).populate("words");
    if (!searchedBaby) {
      const error = new Error("Invalid baby.");
      error.code = 401;
      throw error;
    }
    const newWord = new Word({
      word,
      date,
    });
    const addedWord = await newWord.save();

    searchedBaby.words.push(addedWord);

    await searchedBaby.save();

    return {
      ...addedWord._doc,
      _id: addedWord._id.toString(),
    };
  },
  getSkills: async function ({ _id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const errors = [];

    if (validator.isEmpty(_id)) {
      errors.push({ message: "You didn't provide a baby id." });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const searchedBaby = await Baby.findById(_id).populate("skills");
    if (!searchedBaby) {
      const error = new Error("Invalid baby.");
      error.code = 401;
      throw error;
    }

    return {
      skills: searchedBaby.skills.map((skill) => {
        return {
          _id: skill._id.toString(),
          skill: skill.skill,
          date: skill.date,
        };
      }),
    };
  },
  getWords: async function ({ _id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }
    const errors = [];

    if (validator.isEmpty(_id)) {
      errors.push({ message: "You didn't provide a baby id." });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const searchedBaby = await Baby.findById(_id).populate("words");
    if (!searchedBaby) {
      const error = new Error("Invalid baby.");
      error.code = 401;
      throw error;
    }

    return {
      words: searchedBaby.words.map((word) => {
        return {
          _id: word._id.toString(),
          word: word.word,
          date: word.date,
        };
      }),
    };
  },
};
