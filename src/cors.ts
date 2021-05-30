import cors from "cors";

const whitelist = [`http://localhost:${Number(process.env.PORT || 3000)}`];

const corsOptionsDelegate: cors.CorsOptionsDelegate<cors.CorsRequest> = (req, cb) => {
  const allowed = whitelist.indexOf(req.headers['origin']!) !== -1 ? true : false;
  cb(allowed ? null : new Error("CORS failed"), {
    origin: allowed,
  });
}

export const corsWithOptions = cors(corsOptionsDelegate);