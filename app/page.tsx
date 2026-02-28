'use client'

import { useEffect, useState } from 'react'
import { supabase, Photo, Message } from '@/lib/supabase'
import PhotoGrid from '@/components/PhotoGrid'
import MessageBoard from '@/components/MessageBoard'
import UploadSection from '@/components/UploadSection'

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    const [{ data: photosData }, { data: messagesData }] = await Promise.all([
      supabase.from('photos').select('*').order('uploaded_at', { ascending: false }),
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
    ])
    setPhotos(photosData || [])
    setMessages(messagesData || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    // Realtime subscriptions
    const photoSub = supabase
      .channel('photos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photos' }, (payload) => {
        setPhotos((prev) => [payload.new as Photo, ...prev])
      })
      .subscribe()

    const msgSub = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [payload.new as Message, ...prev])
      })
      .subscribe()

    return () => {
      photoSub.unsubscribe()
      msgSub.unsubscribe()
    }
  }, [])

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blush/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-rose/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />

        <div className="relative z-10 animate-fade-up">
          <p className="font-body text-xs tracking-[0.4em] text-mauve uppercase mb-6">✦ um álbum de amor ✦</p>
          <h1 className="font-display text-7xl md:text-9xl font-light text-warm leading-none mb-4">
            Pequena
            <br />
            <em className="text-rose">Elizabeth</em>
          </h1>
          <p className="font-body font-light text-mauve text-lg mt-8 max-w-md mx-auto leading-relaxed">
            Cada foto, um instante eternizado. Cada mensagem, um amor que transborda.
          </p>

          <div className="flex items-center justify-center gap-8 mt-12">
            <a href="#galeria" className="group flex items-center gap-2 font-body text-sm tracking-widest text-warm hover:text-rose transition-colors">
              <span>Ver Galeria</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <div className="w-px h-4 bg-mauve/30" />
            <a href="#mensagens" className="group flex items-center gap-2 font-body text-sm tracking-widest text-warm hover:text-rose transition-colors">
              <span>Mensagens</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blush to-transparent" />
      </section>

      {/* Upload */}
      <UploadSection onUploadSuccess={fetchData} />

      {/* Gallery */}
      <section id="galeria" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.4em] text-mauve uppercase mb-3">✦ memórias ✦</p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-warm">Galeria</h2>
        </div>
        <PhotoGrid photos={photos} loading={loading} />
      </section>

      {/* Messages */}
      <section id="mensagens" className="px-6 py-20 bg-warm/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.4em] text-mauve uppercase mb-3">✦ amor ✦</p>
            <h2 className="font-display text-5xl md:text-6xl font-light text-warm">Mensagens</h2>
            <p className="font-body font-light text-mauve mt-4">Deixe suas palavras carinhosas para ela guardar para sempre</p>
          </div>
          <MessageBoard messages={messages} onNewMessage={fetchData} />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-16 border-t border-blush/30 bg-warm/5">
        <p className="font-display text-2xl text-rose italic mb-2">feito com amor ♡</p>
        <p className="font-body text-xs text-mauve/60 tracking-widest uppercase mb-4">para durar para sempre</p>

        <div className="space-y-1">
          <p className="font-body text-sm text-warm font-light">Um presente de: <span className="font-medium">Rafa e Iza</span></p>
          <p className="font-body text-[10px] text-mauve/40 mt-6 tracking-wide">
            Desenvolvido com <span className="text-rose">♥</span> por <a href="https://rafaelforti.vercel.app" className="hover:text-rose transition-colors">Rafael Forti</a>
          </p>
        </div>
      </footer>
    </main>
  )
}
