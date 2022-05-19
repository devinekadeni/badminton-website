import type { NextApiRequest, NextApiResponse } from 'next'
import db from '../../utils/db'

const addMemberList = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { name, tier } = JSON.parse(req.body)

    const result = await db.collection('member').add({
      name,
      tier,
    })

    res.json({ code: 'SUCCESS', data: result })
  } catch (err) {
    console.log('ERROR', err)
    res.status(500).json({ code: 'ERROR' })
  }
}

const updateMemberDetail = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { name, tier, id } = JSON.parse(req.body)

    const result = await db.collection('member').doc(id).update({ name, tier })

    res.json({ code: 'SUCCESS', data: result })
  } catch (err) {
    console.log('ERROR ', err)
    res.status(500).json({ code: 'ERROR' })
  }
}

const getMemberList = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const entries = await db.collection('member').get()
    const entriesData = entries.docs.map((entry) => ({ ...entry.data(), id: entry.id }))

    res.json({ code: 'SUCCESS', data: entriesData })
  } catch (err) {
    console.log('ERROR ', err)
    res.status(500).json({ code: 'ERROR', data: null })
  }
}

const deleteMemberDetail = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = JSON.parse(req.body)
    const result = await db.collection('member').doc(id).delete()

    res.json({ code: 'SUCCESS', data: result })
  } catch (err) {
    console.log('ERROR ', err)
    res.status(500).json({ code: 'ERROR', data: null })
  }
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    addMemberList(req, res)
  } else if (req.method === 'PUT') {
    updateMemberDetail(req, res)
  } else if (req.method === 'DELETE') {
    deleteMemberDetail(req, res)
  } else if (req.method === 'GET') {
    getMemberList(req, res)
  }
}

export default handler
