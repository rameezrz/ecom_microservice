const userLogout = async (req, res) => {
    try {
      
        delete res.cookie("jwtuser")
  
      // You can also send additional user information in the response if needed
      res.json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: `Internal server error... ${error.message}`,
        });
    }
  };
  
  module.exports = {
    userLogout,
  };