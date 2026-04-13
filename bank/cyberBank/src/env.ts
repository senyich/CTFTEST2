const Env = {
    DEBUG: process.env.DEBUG ?? "true",
    DB_USER: process.env.DB_USER ?? "user",
    DB_PASS: process.env.DB_PASS ?? "default",
    DB_NAME: process.env.DB_NAME ?? "name",
    SESSION_SECRET: process.env.SESSION_SECRET ?? "default",
    REACT_HOST: process.env.REACT_HOST ?? "http://localhost",
}

export default Env;