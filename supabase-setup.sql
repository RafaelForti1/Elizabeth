-- =============================================
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Tabela de fotos
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de mensagens
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ativar Row Level Security (RLS)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 4. Políticas: qualquer pessoa pode ler e inserir
CREATE POLICY "Leitura pública de fotos" ON photos FOR SELECT USING (true);
CREATE POLICY "Inserção pública de fotos" ON photos FOR INSERT WITH CHECK (true);

CREATE POLICY "Leitura pública de mensagens" ON messages FOR SELECT USING (true);
CREATE POLICY "Inserção pública de mensagens" ON messages FOR INSERT WITH CHECK (true);

-- 5. Ativar Realtime nas tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE photos;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
