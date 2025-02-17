import passport from "passport";
import { gitHubStrategy } from "./github";
import { googleStrategy } from "./google";



passport.use("github", gitHubStrategy);
passport.use("google", googleStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user:any, done) => done(null, user));

export default passport;