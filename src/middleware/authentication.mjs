import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const _authentication = async (Authorization, secret, req, _res) => {
  const tokenRegex = /Bearer (.+)/;
  const secretIn = secret;
  const secretSign = secret;

  const auth = req.header("Authorization");
  let isAuthenticated = false;
  if (auth) {
    const parsed_auth = auth.match(tokenRegex);
    if (parsed_auth) {
      const [_, token] = parsed_auth;
      try {
        const { user_id, secret } = await jwt.verify(token, secretSign);
        isAuthenticated =
          secret === secretIn &&
          (await Authorization.findOne({
            user_id: mongoose.Types.ObjectId(user_id),
            token: token,
          }));

        const context = req.context || {};
        req.context = { ...context, isAuthenticated, userId: user_id };
      } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
          req.context = { ...req.context, isAuthenticated: false };
          //nothing
        } else throw err;
      }
    }
  }
  if (!req.context) {
    const context = req.context || {};
    req.context = { ...context, isAuthenticated: false, userId: null };
  }
};

const authentication = (Authorization, secret) => (req, res, next) => {
  _authentication(Authorization, secret, req, res).then(next);
};

export default authentication;
