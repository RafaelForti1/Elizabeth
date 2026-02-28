'use client'

import { useState } from 'react'
import { supabase, Message } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Props {
  messages: Message[]
  onNewMessage: () => void
}

export default function MessageBoard({ messages, onNewMessage }: Props) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Revelar mensagens apenas em 03/03/2026
  const revealDate = new Date('2026-03-03T00:00:00')
  const isRevealed = new Date() >= revealDate

  async function handleSubmit() {
    if (!name.trim() || !content.trim()) return
    setSending(true)
    setError(null)

    const { error: err } = await supabase.from('messages').insert({
      author_name: name.trim(),
      content: content.trim(),
    })

    if (err) {
      setError('Erro ao enviar mensagem. Tente novamente.')
    } else {
      setSuccess(true)
      setName('')
      setContent('')
      onNewMessage()
      setTimeout(() => setSuccess(false), 3000)
    }
    setSending(false)
  }

  return (
    <div className="space-y-12">
      {/* Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blush/50 shadow-sm transition-all duration-500 hover:shadow-md">
        <h3 className="font-display text-2xl font-light text-warm mb-6">Deixe sua mensagem ♡</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            maxLength={60}
            className="w-full px-5 py-3 rounded-2xl border border-blush bg-white/80 font-body text-sm text-warm placeholder-mauve/50 focus:outline-none focus:border-rose transition-colors"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva algo lindo para ela..."
            rows={4}
            maxLength={500}
            className="w-full px-5 py-3 rounded-2xl border border-blush bg-white/80 font-body text-sm text-warm placeholder-mauve/50 focus:outline-none focus:border-rose transition-colors resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-mauve/50">{content.length}/500</span>
            <button
              onClick={handleSubmit}
              disabled={sending || !name.trim() || !content.trim()}
              className="px-8 py-3 rounded-2xl bg-warm text-cream font-body text-sm tracking-widest hover:bg-rose transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95 transition-transform"
            >
              {sending ? 'Enviando...' : 'Enviar com amor ✦'}
            </button>
          </div>
        </div>

        {success && (
          <p className="mt-4 font-display text-xl text-rose italic animate-fade-up">
            Mensagem enviada! Ela vai adorar. 🌸
          </p>
        )}
        {error && <p className="mt-4 font-body text-sm text-red-400">{error}</p>}
      </div>

      {/* Locked message if not yet 03/03 */}
      {!isRevealed && messages.length > 0 && (
        <div className="bg-rose/10 border border-rose/20 rounded-3xl p-6 text-center animate-pulse">
          <p className="font-display text-lg text-mauve italic">
            🔒 {messages.length} mensagens carinhosas guardadas...
          </p>
          <p className="font-body text-xs text-rose mt-1 tracking-widest uppercase">
            Serão reveladas apenas no dia 03/03
          </p>
        </div>
      )}

      {/* Messages list */}
      {messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-blush/30 transition-all duration-500 ${!isRevealed ? 'grayscale opacity-60 scale-95 blur-[2px]' : 'hover:border-rose/30'}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blush to-rose flex items-center justify-center text-cream font-display text-sm font-light">
                      {isRevealed ? msg.author_name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <span className="font-body font-medium text-warm text-sm">
                      {isRevealed ? msg.author_name : 'Alguém especial'}
                    </span>
                  </div>
                  <p className="font-display text-lg font-light text-warm/80 italic leading-relaxed">
                    {isRevealed ? `"${msg.content}"` : '"Uma mensagem de amor protegida..."'}
                  </p>
                </div>
              </div>
              <p className="font-body text-xs text-mauve/40 mt-3">
                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          ))}
        </div>
      )}

      {messages.length === 0 && (
        <div className="text-center py-10">
          <p className="font-display text-3xl text-mauve/30 italic">Seja o primeiro a escrever para ela ♡</p>
        </div>
      )}
    </div>
  )
}
