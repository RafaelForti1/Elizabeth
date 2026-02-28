'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Photo } from '@/lib/supabase'

interface Props {
  photos: Photo[]
  loading: boolean
}

export default function PhotoGrid({ photos, loading }: Props) {
  const [selected, setSelected] = useState<Photo | null>(null)

  if (loading) {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="skeleton rounded-2xl break-inside-avoid"
            style={{ height: `${200 + (i % 3) * 80}px` }}
          />
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-4xl text-mauve/40 italic">Ainda sem fotos...</p>
        <p className="font-body text-mauve/40 text-sm mt-2">Seja o primeiro a compartilhar um momento!</p>
      </div>
    )
  }

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500"
            style={{ animationDelay: `${i * 50}ms` }}
            onClick={() => setSelected(photo)}
          >
            <div className="relative overflow-hidden">
              <Image
                src={photo.url}
                alt={photo.caption || 'Foto'}
                width={400}
                height={400}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                style={{ aspectRatio: 'auto' }}
                unoptimized
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-warm/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {photo.caption && (
                <p className="absolute bottom-3 left-3 right-3 text-cream font-body text-xs italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {photo.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-warm/90 backdrop-blur-sm p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-cream/70 hover:text-cream font-body text-sm tracking-widest transition-colors"
            >
              FECHAR ✕
            </button>
            <Image
              src={selected.url}
              alt={selected.caption || 'Foto'}
              width={1200}
              height={900}
              className="w-full h-full object-contain rounded-xl shadow-2xl"
              unoptimized
            />
            {selected.caption && (
              <p className="text-center font-display text-xl italic text-cream/80 mt-4">{selected.caption}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
