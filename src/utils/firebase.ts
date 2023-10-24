import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

import { serviceAccount } from '../config/firebase'

initializeApp({
  credential: cert(serviceAccount)
})

type DocumentId = string | number

export class FirebaseStorage {
  private readonly collection: string
  private readonly store: Firestore

  constructor(collection: string) {
    this.collection = collection
    this.store = getFirestore()
  }

  static makeId(id: DocumentId): string {
    if (typeof id === 'string') {
      return id
    }

    return id.toString()
  }

  async getDocument<T>(id: DocumentId): Promise<T | null> {
    const { collection, store } = this
    const ref = store.collection(collection).doc(FirebaseStorage.makeId(id))

    const doc = await ref.get()

    if (doc.exists) {
      return doc.data() as T
    }

    return null
  }

  async addDocument<T>(id: DocumentId , data: T): Promise<T> {
    const { collection, store } = this
    const ref = store.collection(collection).doc(FirebaseStorage.makeId(id))

    await ref.set(data)

    return data
  }

  async updateDocument<T>(id: DocumentId, data: Partial<T>): Promise<void> {
    const { collection, store } = this
    const ref = store.collection(collection).doc(FirebaseStorage.makeId(id))

    await ref.update(data as Partial<T>)
  }
}
