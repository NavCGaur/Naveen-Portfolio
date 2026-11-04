import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import { LeadScoreResult } from "./lead-scoring";

export interface LeadDocument {
  _id?: ObjectId;
  conversationId?: string;
  source: "agency_form" | "chat_widget" | "email_reply" | "contact_form";
  createdAt: Date;
  updatedAt: Date;
  name?: string;
  email: string;
  company?: string;
  website?: string;
  budget?: string;
  message?: string;
  leadType: "agency" | "direct" | "unknown";
  leadScore: LeadScoreResult;
  status:
    | "new"
    | "ai_engaging"
    | "awaiting_prospect"
    | "qualified"
    | "booking_requested"
    | "call_confirmed"
    | "converted"
    | "lost"
    | "archived";
  bookingRequest: {
    status: "not_requested" | "requested" | "awaiting_naveen" | "confirmed" | "cancelled";
    preferredDates?: string[];
    timezone?: string;
    requestedAt?: Date;
    confirmedAt?: Date;
    calBookingId?: string | null;
  };
  followUp: {
    count: number;
    maxAllowed: number;
    lastSentAt?: Date | null;
    stopped: boolean;
    stopReason?: string | null;
  };
  humanTakeover: boolean;
  aiPaused: boolean;
  aiSummary?: string;
  lastActivity: Date;
  emailThreadId?: string;
}

export async function getLeadsCollection() {
  const db = await getDb();
  const collection = db.collection<LeadDocument>("leads");
  // Ensure index
  await collection.createIndex({ email: 1 });
  await collection.createIndex({ lastActivity: -1 });
  await collection.createIndex({ conversationId: 1 });
  return collection;
}

export async function findLeadByEmail(email: string): Promise<LeadDocument | null> {
  const collection = await getLeadsCollection();
  return collection.findOne({ email: email.toLowerCase().trim() });
}

export async function findLeadByConversationId(conversationId: string): Promise<LeadDocument | null> {
  const collection = await getLeadsCollection();
  return collection.findOne({ conversationId });
}

export async function upsertLead(data: Partial<LeadDocument> & { email: string }): Promise<LeadDocument> {
  const collection = await getLeadsCollection();
  const normalizedEmail = data.email.toLowerCase().trim();
  const now = new Date();

  const existing = await collection.findOne({ email: normalizedEmail });

  if (existing) {
    const updated: Partial<LeadDocument> = {
      ...data,
      email: normalizedEmail,
      updatedAt: now,
      lastActivity: now,
    };
    if (data.leadScore && (!existing.leadScore || data.leadScore.numeric > existing.leadScore.numeric)) {
      updated.leadScore = data.leadScore;
    }
    await collection.updateOne({ _id: existing._id }, { $set: updated });
    return { ...existing, ...updated };
  } else {
    const newDoc: LeadDocument = {
      source: data.source || "chat_widget",
      createdAt: now,
      updatedAt: now,
      name: data.name || "",
      email: normalizedEmail,
      company: data.company || "",
      website: data.website || "",
      budget: data.budget || "",
      message: data.message || "",
      leadType: data.leadType || "unknown",
      leadScore: data.leadScore || { numeric: 0, label: "cold", reasons: [] },
      status: data.status || "new",
      bookingRequest: data.bookingRequest || {
        status: "not_requested",
      },
      followUp: {
        count: 0,
        maxAllowed: 2,
        lastSentAt: null,
        stopped: false,
        stopReason: null,
      },
      humanTakeover: false,
      aiPaused: false,
      aiSummary: data.aiSummary || "",
      lastActivity: now,
      conversationId: data.conversationId,
      emailThreadId: data.emailThreadId,
    };
    const result = await collection.insertOne(newDoc as any);
    return { ...newDoc, _id: result.insertedId };
  }
}
