"use strict";

const MongoClient = require("mongodb").MongoClient;
const test = require("tape");

const MONGO_PORT = 27777;

let db, docs;

test("connecting to mongod", t => {
  MongoClient.connect(`mongodb://localhost:${MONGO_PORT}/hello`).then(_db => {
    t.pass("MongoDB connection");
    db = _db;
  }).then(t.end, t.end);
});

test("prepare", t => {
  docs = db.collection("documents");
  docs.remove({}).then(res => {
    t.ok(res.result.ok);
  }).then(t.end, t.end);
});

test("create", t => {
  docs.insertMany([
    {_id: 1, a: 111},
    {_id: 2, a: 222},
    {_id: 3, a: 333}
  ]).then(res => {
    t.equal(res.insertedCount, 3);
  }).then(t.end, t.end);
});

test("read", t => {
  docs.find({_id: {$in: [1, 2, 3]}}).toArray().then(res => {
    t.deepEqual(res, [
      {_id: 1, a: 111},
      {_id: 2, a: 222},
      {_id: 3, a: 333}
    ]);
  }).then(t.end, t.end);
});

test("shutting down mongod", t => {
  db.close();
  t.end();
});
