'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase } from '@/lib/supabase'

interface Props {
  onUploadSuccess: () => void
}

export default function UploadSection({ onUploadSuccess }: Props) {
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setSuccess(false)
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError(null)

    try {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: storageError } = await supabase.storage
        .from('photos')
        .upload(path, file, { contentType: file.type })

      if (storageError) throw storageError

      const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(path)

      const { error: dbError } = await supabase.from('photos').insert({
        storage_path: path,
        url: publicUrl,
        caption: caption.trim() || null,
      })

      if (dbError) throw dbError

      setSuccess(true)
      setFile(null)
      setPreview(null)
      setCaption('')
      onUploadSuccess()
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar foto')
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="px-6 py-16 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <p className="font-body text-xs tracking-[0.4em] text-mauve uppercase mb-3">✦ compartilhe ✦</p>
        <h2 className="font-display text-4xl font-light text-warm">Enviar uma Foto</h2>
      </div>

      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-rose bg-rose/5' : 'border-blush hover:border-rose hover:bg-rose/5'
        } ${preview ? 'pb-0' : ''}`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded-2xl" />
          </div>
        ) : (
          <div className="py-6">
            <div className="text-5xl mb-4 animate-float">🌸</div>
            <p className="font-display text-2xl text-warm font-light">
              {isDragActive ? 'Solte aqui!' : 'Arraste uma foto'}
            </p>
            <p className="font-body text-sm text-mauve mt-2">ou clique para selecionar · até 10MB</p>
          </div>
        )}
      </div>

      {preview && (
        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Adicione uma legenda carinhosa... (opcional)"
            className="w-full px-5 py-3 rounded-2xl border border-blush bg-white/60 font-body text-sm text-warm placeholder-mauve/50 focus:outline-none focus:border-rose transition-colors"
          />
          <div className="flex gap-3">
            <button
              onClick={() => { setFile(null); setPreview(null) }}
              className="flex-1 py-3 rounded-2xl border border-blush font-body text-sm text-mauve hover:border-rose hover:text-rose transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 py-3 rounded-2xl bg-rose text-cream font-body text-sm tracking-widest hover:bg-mauve transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Enviando...' : 'Enviar ✦'}
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 text-center animate-fade-up">
          <p className="font-display text-2xl text-rose italic">Foto enviada com amor! 🌸</p>
        </div>
      )}
      {error && (
        <p className="mt-4 text-center font-body text-sm text-red-400">{error}</p>
      )}
    </section>
  )
}
