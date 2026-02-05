import { FieldValue } from "firebase-admin/firestore";

import { db } from "../config/firebase.js";

const collection = db.collection("marketplaceListings");

export interface MarketplaceListing {
  id: string;
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  seller?: string;
  contact?: string;
  image?: string | null;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
  [key: string]: unknown;
}

export interface MarketplacePayload {
  title: string;
  description: string;
  price: number;
  category: string;
  seller?: string;
  contact?: string;
  image?: string | null;
}

const mapDoc = (
  doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
): MarketplaceListing => ({
  id: doc.id,
  ...(doc.data() as Record<string, unknown>),
});

export const getAllListings = async (): Promise<MarketplaceListing[]> => {
  const snapshot = await collection.orderBy("createdAt", "desc").get();
  return snapshot.docs.map(mapDoc);
};

export const getListingById = async (
  id: string
): Promise<MarketplaceListing | null> => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) return null;
  return mapDoc(doc);
};

export const createListing = async (
  payload: MarketplacePayload
): Promise<MarketplaceListing> => {
  const docRef = await collection.add({
    title: payload.title,
    description: payload.description,
    price: payload.price,
    category: payload.category,
    seller: payload.seller || "Anonymous",
    contact: payload.contact || null,
    image: payload.image ?? null,
    createdAt: FieldValue.serverTimestamp(),
  });

  const saved = await docRef.get();
  return mapDoc(saved);
};

export const updateListing = async (
  id: string,
  updates: Partial<MarketplacePayload>
): Promise<MarketplaceListing> => {
  const updateData: Record<string, unknown> = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.seller !== undefined) updateData.seller = updates.seller;
  if (updates.contact !== undefined) updateData.contact = updates.contact;
  if (updates.image !== undefined) updateData.image = updates.image;

  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields provided to update");
  }

  updateData.updatedAt = FieldValue.serverTimestamp();

  const docRef = collection.doc(id);
  await docRef.update(updateData);

  const updated = await docRef.get();
  if (!updated.exists) {
    throw new Error("Listing not found");
  }

  return mapDoc(updated);
};

export const deleteListing = async (id: string): Promise<void> => {
  await collection.doc(id).delete();
};
