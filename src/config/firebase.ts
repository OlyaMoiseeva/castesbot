import { ServiceAccount } from 'firebase-admin/app'

export const serviceAccount: ServiceAccount = {
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_KEY?.split(String.raw`\n`).join('\n'),
  projectId: process.env.NODE_ENV === 'production' ? 'castesbot' : 'castesbotdev',
}
