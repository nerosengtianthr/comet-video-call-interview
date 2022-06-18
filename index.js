const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const {
  RtcTokenBuilder,
  RtcRole,
  RtmTokenBuilder,
  RtmRole,
} = require("agora-access-token");
const Agora = require("agora-access-token");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

const nocache = (_, resp, next) => {
  resp.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  resp.header("Expires", "-1");
  resp.header("Pragma", "no-cache");
  next();
};

app.options("*", cors());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "./frontend/build")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});
app.get("/rtctoken/:id", nocache, (req, resp) => {
  resp.header("Access-Control-Allow-Origin", "*");
  const appID = "ccc5d0224154494fa5a907516c9ce012";
  const appCertificate = "dd6b7bf8d16f4f9299a68e170cf2b9e6";
  const expirationTimeInSeconds = 36000;
  const uid = Math.floor(Math.random() * 100000);
  const role = Agora.RtcRole.PUBLISHER;
  const channel = req.params.id;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;

  const token = Agora.RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channel,
    uid,
    role,
    expirationTimestamp
  );
  resp.send({ uid, token });
});
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
