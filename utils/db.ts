import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIRESTORE_PROJECT_ID,
      clientEmail: process.env.FIRESTORE_CLIENT_EMAIL,
      privateKey: process.env.FIRESTORE_PRIVATE_KEY,
    }),
  })
}

const db = getFirestore()

export default db
