// pages/api/qa-data.js
import { getQAData } from '../../lib/qaDataLoader.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const qaData = await getQAData();
    return res.status(200).json(qaData);
  } catch (error) {
    console.error('Error loading QA data:', error);
    return res.status(500).json({
      error: 'No QA data is available right now. Try again later.',
    });
  }
}
