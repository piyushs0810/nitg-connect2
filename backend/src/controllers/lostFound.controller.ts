import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase.js";

const collection = db.collection("lostFound");

export const getAllItems = async () => {
  const snapshot = await collection
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getItemById = async (id: string) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  };
};

export const createItem = async (data: any) => {
  const newItem = {
    title: data.title,
    description: data.description,
    location: data.location,
    type: data.type,
    image: data.image || null,
    createdAt: FieldValue.serverTimestamp(),
  };

  const docRef = await collection.add(newItem);
  const saved = await docRef.get();

  return {
    id: saved.id,
    ...saved.data(),
  };
};

export const updateItem = async (id: string, data: any) => {
  const updateData: any = {};

  if (data.title) updateData.title = data.title;
  if (data.description) updateData.description = data.description;
  if (data.location) updateData.location = data.location;
  if (data.type) updateData.type = data.type;
  if (data.image !== undefined) updateData.image = data.image;

  updateData.updatedAt = FieldValue.serverTimestamp();

  await collection.doc(id).update(updateData);

  const updated = await collection.doc(id).get();
  return {
    id: updated.id,
    ...updated.data(),
  };
};

export const deleteItem = async (id: string) => {
  await collection.doc(id).delete();
};