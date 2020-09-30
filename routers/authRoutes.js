const passport = require("passport");

module.exports = (app) => {
  // slack oauth callback
  app.get(
    "/auth/slack/callback",
    passport.authenticate("slack"),
    async (req, res) => {
      try {
        res.redirect("/");
      } catch (e) {
        console.log(e);
        console.log("slack oauth err:");
      }
    }
  );
  // slack oauth
  app.get("/auth/slack", passport.authenticate("slack"));

  // logout
  app.get("/", (req, res) => {
    res.send({ user: req.user });
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
