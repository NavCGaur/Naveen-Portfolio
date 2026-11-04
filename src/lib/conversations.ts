import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  emailMessageId?: string | null;
}

export interface ConversationDocument {
  _id: string; // conversationId UUID string
  leadId?: ObjectId | null;
  channel: "chat" | "email";
  sessionToken: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export async function getConversationsCollection() {
  const db = await getDb();
  const collection = db.collection<ConversationDocument>("conversations");
  await collection.createIndex({ sessionToken: 1 });
  await collection.createIndex({ leadId: 1 });
  return collection;
}

export async function getConversationById(conversationId: string): Promise<ConversationDocument | null> {
  const collection = await getConversationsCollection();
  return collection.findOne({ _id: conversationId });
}

export async function getOrCreateConversation(
  conversationId: string,
  sessionToken: string,
  channel: "chat" | "email" = "chat"
): Promise<ConversationDocument> {
  const collection = await getConversationsCollection();
  const existing = await collection.findOne({ _id: conversationId });
  if (existing) {
    return existing;
  }

  const now = new Date();
  const doc: ConversationDocument = {
    _id: conversationId,
    leadId: null,
    channel,
    sessionToken,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(doc as any);
  return doc;
}

export async function appendMessageToConversation(
  conversationId: string,
  message: ChatMessage
): Promise<void> {
  const collection = await getConversationsCollection();
  await collection.updateOne(
    { _id: conversationId },
    {
      $push: { messages: message },
      $set: { updatedAt: new Date() },
    }
  );
}

export async function linkConversationToLead(
  conversationId: string,
  leadId: ObjectId
): Promise<void> {
  const collection = await getConversationsCollection();
  await collection.updateOne(
    { _id: conversationId },
    {
      $set: { leadId, updatedAt: new Date() },
    }
  );
}
