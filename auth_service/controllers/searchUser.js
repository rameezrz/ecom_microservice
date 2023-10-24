const { searchUser } = require("@rameezrz/db-search");

const findUser = async (req, res) => {
  try {
    const query = req.params.search;
    await searchUser(process.env.MONGO_DB_URI, query)
      .then((users) => {
        res.status(200).json({
          success: true,
          message: "Found matching users",
          users,
        });
      })
      .catch((error) => {
        return res.status(404).json({
          success: false,
          message: error,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error... ${error.message}`,
    });
  }
};

module.exports = { findUser };
