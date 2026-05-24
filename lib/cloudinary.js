import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default cloudinary

// Folder structure:
// equimanager/{stable_id}/horses/{horse_id}/photos
// equimanager/{stable_id}/horses/{horse_id}/documents
// equimanager/{stable_id}/grooms/{groom_id}/avatar
// equimanager/{stable_id}/documents
// equimanager/{stable_id}/transactions/receipts

export const cloudinaryFolders = {
  horsePhoto:   (stableId, horseId) => `equimanager/${stableId}/horses/${horseId}/photos`,
  horseDocs:    (stableId, horseId) => `equimanager/${stableId}/horses/${horseId}/documents`,
  groomAvatar:  (stableId, groomId) => `equimanager/${stableId}/grooms/${groomId}/avatar`,
  stableDocs:   (stableId)          => `equimanager/${stableId}/documents`,
  receipts:     (stableId)          => `equimanager/${stableId}/transactions/receipts`,
}

export async function deleteCloudinaryAsset(publicId) {
  return cloudinary.uploader.destroy(publicId)
}

export async function getSignedUploadUrl(folder, transformation = {}) {
  const timestamp = Math.round(Date.now() / 1000)
  const params = { timestamp, folder, ...transformation }
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET)
  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    folder,
  }
}

// Client-side: upload file using unsigned preset
export async function uploadFile(file, folder, onProgress) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'equimanager_unsigned')
  formData.append('folder', folder)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`)
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onload = () => {
      const res = JSON.parse(xhr.responseText)
      if (xhr.status === 200) resolve(res)
      else reject(new Error(res.error?.message || 'Upload failed'))
    }
    xhr.onerror = () => reject(new Error('Upload failed'))
    xhr.send(formData)
  })
}

export function cloudinaryUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  })
}
