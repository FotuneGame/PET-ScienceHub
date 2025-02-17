import GitHub  from "passport-github2";



export const gitHubStrategy = new GitHub.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    callbackURL: (process.env.URL_BASE_INGRESS || "") + (process.env.GITHUB_URL_CALLBACK || "")
  },
  async function(accessToken:any, refreshToken:any, profile:any, done:any) {
    return done(null, profile);
  }
);