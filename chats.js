const express = require("express");
const route = express.Router();
const db = require("../db/database");

const chatApi = async (req, res) => {
  try {
    const { user_id1, user_id2 } = req.body;
    // Check if a chat already exists between these two users (in any order)
    const [existingChat] = await db("chats").where(function () {
      this.where({ user_id1, user_id2 }).orWhere({
        user_id1: user_id2,
        user_id2: user_id1,
      });
    });
    if (existingChat) {
      return res
        .status(400)
        .json({ msg: "Chat already exists", chat: existingChat });
    }
    // Create a new chat if it doesn't exist
    const chatId = await db("chats").insert({ user_id1, user_id2 });
    return res.json({ msg: "Chat created", chatId });
  } catch (e) {
    return res.status(500).json("thers is an issue");
  }
};
// Check or create chat function
async function getOrCreateChat(user_id1, user_id2) {
  // Ensure IDs are always in ascending order (avoid duplicate chat pairs)
  const [chat] = await knex("chats")
    .where({
      user_id1: Math.min(user_id1, user_id2),
      user_id2: Math.max(user_id1, user_id2),
    })
    .select("id");

  // If chat exists, return the chat ID
  if (chat) return chat.id;

  // Create a new chat if it doesn't exist
  const [newChatId] = await knex("chats").insert(
    {
      user_id1: Math.min(user_id1, user_id2),
      user_id2: Math.max(user_id1, user_id2),
    },
    ["id"] // Return the ID of the new chat
  );
  return newChatId;
}
// Function to send a message in a chat
async function sendMessage(req, res) {
  try {
    const { sender_id, receiver_id, content } = req.body;

    // Get or create chat between two users
    const chat_id = await getOrCreateChat(sender_id, receiver_id);

    // Insert the message in the messages table
    await knex("messages").insert({
      chat_id,
      sender_id,
      content,
    });

    res.status(200).json({ msg: "Message sent!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

route.post("/chatApi", chatApi);
module.exports = route;
