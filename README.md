# 🌸 Pequena Elizabeth — Galeria de Fotos

Site expositor de fotos com mensagens de amor, integrado ao Supabase e deployado na Vercel.

---

## ✨ Funcionalidades

- **Galeria em mosaico** com lightbox ao clicar
- **Upload de fotos** com drag-and-drop (até 10MB)
- **Legenda opcional** por foto
- **Mural de mensagens** com nome e texto
- **Realtime** — novas fotos e mensagens aparecem automaticamente
- **Design elegante** com tipografia refinada

---

## 🚀 Configuração — Passo a Passo

### 1. Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **SQL Editor** e execute o conteúdo de `supabase-setup.sql`
3. Vá em **Storage** → Create bucket → Nome: `photos` → **Public bucket** ✓
4. Copie suas chaves em **Settings → API**:
   - `Project URL`
   - `anon public key`

### 2. Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 3. Rodar localmente

```bash
npm install
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy na Vercel

### Opção A — Via CLI

```bash
npm install -g vercel
vercel
```

Quando perguntar pelas variáveis de ambiente, adicione:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Opção B — Via GitHub (recomendado)

1. Suba o projeto no GitHub
2. Acesse [vercel.com](https://vercel.com) → **New Project** → Importe o repositório
3. Em **Environment Variables**, adicione as duas variáveis do Supabase
4. Clique em **Deploy** 🎉

---

## 📁 Estrutura

```
baby-gallery/
├── app/
│   ├── layout.tsx        # Layout raiz
│   ├── page.tsx          # Página principal
│   └── globals.css       # Estilos globais
├── components/
│   ├── PhotoGrid.tsx     # Galeria + lightbox
│   ├── UploadSection.tsx # Upload com drag-drop
│   └── MessageBoard.tsx  # Mural de mensagens
├── lib/
│   └── supabase.ts       # Cliente Supabase + tipos
├── supabase-setup.sql    # Script SQL de configuração
└── .env.local.example    # Exemplo de variáveis
```

---

## 🎨 Personalizações fáceis

- **Nome da bebê**: Edite `app/page.tsx` — altere "Pequena Elizabeth" pelo nome dela
- **Cores**: Edite `tailwind.config.js` e `app/globals.css`
- **Título da aba**: Edite `metadata` em `app/layout.tsx`
