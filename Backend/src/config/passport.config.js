import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/user.models.js";
import { encrypt } from "../utils/crypto.js";
import dotenv from "dotenv";

dotenv.config();

// Only store minimal user ID in session
passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.authenticate('github',{
    scope : ['repo','admin:repo_hook']
})

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const encryptedAccessToken = encrypt(accessToken);

        let user = await User.findOne({ githubId: profile.id });

        const email = profile.emails?.[0]?.value || profile._json.email;
        const avatarUrl = profile.photos?.[0]?.value || profile._json.avatar_url;

        if (!user) {
          user = await User.create({
            githubId: profile.id,
            username: profile.username,
            accessToken: encryptedAccessToken,
            email,
            avatarUrl,
          });
        } else {
          user.accessToken = encryptedAccessToken;
          user.email = user.email || email;
          user.avatarUrl = user.avatarUrl || avatarUrl;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
