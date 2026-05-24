import { IncomingForm } from 'formidable'
import cloudinary from '../../../lib/cloudinary'
import { createClient } from '@supabase/supabase-js'

export const config = { api: { bodyParser: false } }

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const form = new IncomingForm({ keepExtensions: true, maxFileSize: 10 * 1024 * 1024 })

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })

    const file  = Array.isArray(files.file)   ? files.file[0]   : files.file
    const type  = Array.isArray(fields.type)  ? fields.type[0]  : fields.type   || 'horses'
    const id    = Array.isArray(fields.id)    ? fields.id[0]    : fields.id
    const stable= Array.isArray(fields.stable)? fields.stable[0]: fields.stable

    if (!file) return res.status(400).json({ error: 'No file provided' })

    const folder = `equimanager/${stable || 'default'}/${type}/${id || 'misc'}`

    const result = await cloudinary.uploader.upload(file.filepath, {
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      transformation: type === 'horses' ? [
        { width: 1200, height: 900, crop: 'limit' }
      ] : [],
    })

    return res.status(200).json({
      url:       result.secure_url,
      public_id: result.public_id,
      width:     result.width,
      height:    result.height,
      format:    result.format,
    })

  } catch (err) {
    console.error('Upload error:', err)
    return res.status(500).json({ error: err.message })
  }
}
