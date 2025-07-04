import express from 'express';
import passport from 'passport';
import session from 'express-session';
import authController from '../controllers/auth.controller.js';
import '../config/passport.config.js';

const router = express.Router();

router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

router.use(passport.initialize());
router.use(passport.session());

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email', 'repo']}));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/'}),
    authController.githubAuthCallback
)

router.get("/auth/me", (req, res) => {
 if (!req.session?.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  res.json(req.session.user);
});

router.post('/auth/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out" });
    });
  });
});


export default router; 