import Google from "passport-google-oauth20";



export const googleStrategy = new Google.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: (process.env.URL_BASE_INGRESS || "") + (process.env.GOOGLE_URL_CALLBACK || "")
},
async function(accessToken:any, refreshToken:any, profile:any, done:any) {
    return done(null, profile);
});