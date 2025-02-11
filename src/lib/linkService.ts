import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Link {
  id?: string;
  shortCode: string;
  url: string;
  createdAt: Date;
  clicks: number;
}

const COLLECTION_NAME = 'links';

export const linkService = {
  // Obtener todos los links
  async getLinks(): Promise<Link[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Link)
    );
  },

  // Añadir un nuevo link
  async addLink(shortCode: string, url: string): Promise<Link> {
    const newLink = {
      shortCode,
      url,
      createdAt: new Date(),
      clicks: 0,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newLink);
    return {
      id: docRef.id,
      ...newLink,
    };
  },

  // Actualizar un link
  async updateLink(id: string, data: Partial<Link>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
  },

  // Eliminar un link
  async deleteLink(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Incrementar el contador de clicks
  async incrementClicks(shortCode: string): Promise<void> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('shortCode', '==', shortCode)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = doc(db, COLLECTION_NAME, querySnapshot.docs[0].id);
      const currentClicks = querySnapshot.docs[0].data().clicks || 0;
      await updateDoc(docRef, {
        clicks: currentClicks + 1,
      });
    }
  },

  // Obtener un link por su código corto
  async getLinkByShortCode(shortCode: string): Promise<Link | null> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('shortCode', '==', shortCode)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data(),
    } as Link;
  },
};
