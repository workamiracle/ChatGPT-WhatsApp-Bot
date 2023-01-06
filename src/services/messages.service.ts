import { APP_NAME } from "..";
import DataModel from "../models/data.model";
import { db } from "../configs/db.config";

function saveConversation(data: DataModel) {
  return new Promise((resolve, reject) => {
    const {
      last_message,
      message_id,
      conversation_id,
      sender_id,
      last_response,
      last_message_timestamp,
    } = data;

    db.run(
      `INSERT INTO messages (
    last_message,
    message_id,
    conversation_id,
    sender_id,
    last_response,
    last_message_timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        last_message,
        message_id,
        conversation_id,
        sender_id,
        last_response,
        last_message_timestamp,
      ],
      function (error) {
        if (error) {
          console.error(`[${APP_NAME}] failed to insert row: ` + error);
          reject(error);
        }
        resolve(this);
        console.log(
          `[${APP_NAME}] inserted a data with the ID: ${this.lastID}`
        );
      }
    );
  });
}

function getMessagesOfSender(sender_id: string) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM messages WHERE sender_id = ?`,
      [sender_id],
      (error: any, rows: any) => {
        if (error) {
          reject(error);
        }
        resolve(rows);
      }
    );
  });
}

function updateSingleMessageFromSender(
  sender_id: string,
  last_message: string,
  last_response: string,
  last_message_timestamp: string
) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE messages SET last_message = ?, last_response = ?, last_message_timestamp = ? WHERE sender_id = ?`,
      [last_message, last_response, last_message_timestamp, sender_id],
      (error: any) => {
        if (error) {
          reject(error);
        }
        resolve({
          last_message,
          last_response,
          last_message_timestamp,
          sender_id,
        });
      }
    );
  });
}

export { saveConversation, getMessagesOfSender, updateSingleMessageFromSender };