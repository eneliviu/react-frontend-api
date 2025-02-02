import log from "loglevel";

if (process.env.NODE_ENV === "production") {
    log.setLevel("error"); // Only log errors in production
} else {
    log.setLevel("debug"); // Log everything in development
}

export default log;
