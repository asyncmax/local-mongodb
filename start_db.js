"use strict";

const npath = require("path");
const spawn = require("child_process").spawn;
const mkdirp = require("mkdirp");

const MONGO_DBPATH = npath.join(__dirname, "_test/mongo/db");
const MONGO_LOGPATH = npath.join(__dirname, "_test/mongo/log/mongod.log");
const MONGO_PORT = 27777;

function startMongoDB({dbpath, logpath, port=27777}) {
  let mongod;

  if (process.platform === "win32")
    mongod = npath.join(__dirname, "./win32/mongod.exe");
  else if (process.platform === "darwin")
    mongod = npath.join(__dirname, "./osx/mongod");
  else
    throw Error("Unsupported platform: " + process.platform);

  mkdirp.sync(dbpath);

  let args = [
    "--dbpath", dbpath,
    "--port", port
  ];

  if (logpath) {
    mkdirp.sync(npath.dirname(logpath));
    args = args.concat(["--logpath", logpath]);
  }

  const child = spawn(mongod, args, {
    stdio: "inherit"
  });

  child.on("exit", code => {
    console.log("MongoDB terminated with exit code: %d", code);
  });

  return child;
}

const mongodb = startMongoDB({
  dbpath: MONGO_DBPATH,
  logpath: MONGO_LOGPATH,
  port: MONGO_PORT
});

console.log("Running MongoDB as a child process, pid = %d", mongodb.pid);
