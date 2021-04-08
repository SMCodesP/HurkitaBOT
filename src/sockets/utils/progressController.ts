import firebaseAdmin from '../../lib/firebaseAdmin'
import Progress from '../../web/structures/entities/Progress'

import * as admin from 'firebase-admin'

class ProgressController {
  progress: Map<string, Progress>

  constructor() {
    this.progress = new Map()
  }

  get() {
    return this.progress
  }

  add(socket_id: string, user_progress: Progress) {
    this.progress.set(socket_id, user_progress)
  }

  async remove(socket_id: string) {
    const user_progress = this.progress.get(socket_id)
    if (user_progress) {
      const { firestore } = firebaseAdmin()
      const watchProgress = await firestore
        .collection('watch')
        .where('videoId', '==', user_progress.videoId)
        .where('userId', '==', user_progress.userId)
        .limit(1)
        .get()

      if (watchProgress.empty) {
        await firestore.collection('watch').add({
          ...user_progress,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        })
      } else {
        await firestore
          .collection('watch')
          .doc(watchProgress.docs[0].id)
          .update({
            ...user_progress,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          })
      }
      this.progress.delete(socket_id)
    }
  }
}

export default new ProgressController()
