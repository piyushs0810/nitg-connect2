import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase.js";

const noticesCollection = db.collection("notices");

export const getAllNotices = async () => {
  const snapshot = await noticesCollection
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getNoticeById = async (id: string) => {
  const doc = await noticesCollection.doc(id).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  };
};

export const createNotice = async (data: any) => {
  const docRef = await noticesCollection.add({
    title: data.title,
    content: data.content,
    category: data.category,
    author: data.author || "NIT Goa",
    createdAt: FieldValue.serverTimestamp(),
  });

  // 🔑 fetch again to avoid timestamp crash
  const saved = await docRef.get();

  return {
    id: saved.id,
    ...saved.data(),
  };
};

export const updateNotice = async (id: string, data: any) => {
  await noticesCollection.doc(id).update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });

  const updated = await noticesCollection.doc(id).get();
  return {
    id: updated.id,
    ...updated.data(),
  };
};

export const deleteNotice = async (id: string) => {
  await noticesCollection.doc(id).delete();
};