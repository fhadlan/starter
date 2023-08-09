const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
// const jwt = require("jsonwebtoken");

// const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  /**
     * const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new BadRequestError("Silahkan isi field yang diperlukan");
    } check di controller, optional

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const tempUser = {
      name,
      email,
      password: hashedPassword,
    }; ---->>pindahkan proses hashing langsung ke model sebelum data disimpan di database

    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    ); -->pindahkan ke model juga sehingga controller bersih

     */

  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Silahkan isi email dan password");
  }

  //cek user
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("email atau password salah");
  }

  //compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("email atau password salah");
  }

  //buat token
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
