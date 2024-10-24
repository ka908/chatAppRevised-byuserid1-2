const express = require("express");
const route = express.Router();
const db = require("../db/database");

const chatsandmessages = async (req, res) => {
  try {
    const { tx_name, rx_name, chatsandmessages } = req.body;
    const data = await db("chatsandmessages").insert({
      tx_name,
      rx_name,
      chatsandmessages,
    });
    return res.json({ msg: data });
  } catch (e) {
    return res.status(500).json({ msg: `${e.code}` });
  }
};
const getchatsandmessages = async (req, res) => {
  try {
    const { tx_name, rx_name } = req.body;
    const data1 = await db("chatsandmessages").select("*").where({
      tx_name: tx_name,
      rx_name: rx_name,
    });
    const data2 = await db("chatsandmessages")
      .select("tx_name")
      .count("* as message_count")
      .groupBy("tx_name")
      .where({
        tx_name: tx_name,
      });

    const data3 = await db("chatsandmessages")
      .select("rx_name")
      .count("* as message_count")
      .groupBy("rx_name")
      .where({
        rx_name: rx_name,
      });
    return res.json({ msg1: data1, msg2: data2, msg3: data3 });
  } catch (e) {
    return res.status(500).json({ msg: `${e.code}` });
  }
};
route.get("/getchatsandmessages", getchatsandmessages);
route.post("/chatsandmessages", chatsandmessages);

module.exports = route;
