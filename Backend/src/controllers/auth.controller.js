import { decrypt } from '../utils/crypto.js'

const githubAuthCallback = (req, res) => {
   if (req.user) {
    req.session.user = {
      githubId: req.user.githubId,
      username: req.user.username,
      email: req.user.email,
      avatarUrl: req.user.avatarUrl,
    };
  }
    req.session.accessToken = decrypt(req.user.accessToken);
   res.redirect("http://localhost:5173/?login=success");
}


export default {githubAuthCallback};