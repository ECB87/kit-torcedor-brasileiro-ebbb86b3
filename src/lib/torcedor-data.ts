export type Category = "vestuario" | "festa" | "barulho" | "decoracao";

export interface TorcedorItem {
  id: string;
  name: string;
  qty: number;
  short: string;
  full: string;
  category: Category;
  icon: string; // lucide icon name
  price: number;
}

export const TORCEDOR_ITEMS: TorcedorItem[] = [
  { id: "oculos", name: "Óculos Temático Copa", qty: 1, short: "Lente perfurada verde e amarela com proteção UV.", full: "Armação leve, lente perfurada estilo torcida com filtro UV400. Confortável para uso prolongado em estádios e festas.", category: "vestuario", icon: "Glasses", price: 25 },
  { id: "bandeira", name: "Bandeira do Brasil 150x90cm", qty: 1, short: "Poliéster reforçado, costura dupla, tamanho oficial.", full: "Bandeira grande 150x90cm em poliéster de gramatura alta, costura dupla nas bordas e ilhós para hasteamento.", category: "decoracao", icon: "Flag", price: 45 },
  { id: "confete", name: "Pistola de Confete Temática", qty: 1, short: "Confetes biodegradáveis verde-amarelos, sem pólvora.", full: "Pistola com mecanismo de mola — sem pólvora. Recarga de confete biodegradável nas cores da bandeira.", category: "festa", icon: "PartyPopper", price: 35 },
  { id: "vuvuzela", name: "Vuvuzela Clássica da Copa", qty: 1, short: "Plástico ABS atóxico, som potente e marcante.", full: "Vuvuzela em ABS reforçado, som agudo de até 120dB. Acabamento brilhante nas cores do Brasil.", category: "barulho", icon: "Megaphone", price: 28 },
  { id: "pintura", name: "Pintura Facial Brasil", qty: 1, short: "Hipoalergênica, remove com água, segura para crianças.", full: "Bastões cremosos verde e amarelo, fórmula hipoalergênica testada dermatologicamente. Sai facilmente com água e sabão.", category: "vestuario", icon: "Palette", price: 22 },
  { id: "calendario", name: "Calendário Oficial Copa 2026", qty: 1, short: "Tabela completa de jogos para acompanhar.", full: "Calendário impresso com todos os jogos, horários (BRT), grupos e tabela do mata-mata da Copa 2026.", category: "decoracao", icon: "Calendar", price: 18 },
  { id: "bastoes", name: "Bastões Infláveis (par)", qty: 2, short: "Bate-bate rítmico reutilizável.", full: "Par de bastões infláveis para o tradicional bate-bate. Material durável, recarregáveis com ar.", category: "barulho", icon: "Wand2", price: 30 },
  { id: "bandana", name: "Bandana Multifuncional", qty: 1, short: "Microfibra esportiva com secagem rápida.", full: "Bandana tubular em microfibra leve. Pode ser usada como faixa, lenço, máscara ou pulseira.", category: "vestuario", icon: "Shirt", price: 25 },
  { id: "pulseira", name: "Pulseira de Torcida", qty: 1, short: "Silicone elástico resistente ao suor.", full: "Pulseira em silicone hipoalergênico com gravação 'Brasil 2026'. Ajuste único, confortável.", category: "vestuario", icon: "CircleDot", price: 15 },
  { id: "tatuagens", name: "Tatuagens Temporárias (2 cartelas)", qty: 2, short: "Aplica com água, remove com álcool.", full: "Duas cartelas com vários símbolos: bandeira, escudos, frases e bola. Duram até 5 dias na pele.", category: "festa", icon: "Sparkles", price: 20 },
  { id: "lenco", name: "Lenço Temático de Cetim", qty: 1, short: "Estampa elegante e multifuncional.", full: "Lenço quadrado em cetim com estampa da bandeira. Use no pescoço, cabelo ou bolso.", category: "vestuario", icon: "Scissors", price: 28 },
  { id: "apito", name: "Apito Metálico de Torcedor", qty: 1, short: "Alumínio leve com cordão verde-amarelo.", full: "Apito em alumínio anodizado, som penetrante de árbitro. Vem com cordão trançado verde e amarelo.", category: "barulho", icon: "Bell", price: 18 },
];

export const REVIEWS = [
  { name: "Guilherme Silva", city: "Belo Horizonte - MG", rating: 5, date: "25/05/2026", text: "Kit espetacular! Chegou em 3 dias. A bandeira é enorme e o material é excelente. Meus filhos adoraram a pintura facial e o óculos.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
  { name: "Mariana Alencar", city: "São Paulo - SP", rating: 5, date: "22/05/2026", text: "Comprei 3 kits para a família toda. Agora todo mundo tem seu óculos e vuvuzela. Os bastões e a pistola de confete vão fazer a festa!", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop" },
  { name: "Rodrigo Costa", city: "Porto Alegre - RS", rating: 5, date: "19/05/2026", text: "Custo-benefício impressionante. Comprar separado custaria o dobro. O calendário da Copa já está na parede da sala!", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop" },
  { name: "Beatriz Santos", city: "Salvador - BA", rating: 4, date: "15/05/2026", text: "Chegou tudo bem embalado. A bandana é super confortável e o lenço de cetim é lindo! Ansiosa para os jogos começarem.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
];

export const FAQS = [
  { q: "Qual é o prazo de entrega para minha região?", a: "Sul, Sudeste e Centro-Oeste: 2 a 5 dias úteis. Norte e Nordeste: 4 a 7 dias úteis. Você recebe o código de rastreio por e-mail assim que o pedido é despachado." },
  { q: "Os itens são seguros para crianças?", a: "Sim. Plásticos atóxicos livres de BPA, tinta facial hipoalergênica testada dermatologicamente e pistola com mecanismo de mola (sem pólvora)." },
  { q: "Como funciona a garantia?", a: "Garantia de 7 dias incondicional. Não gostou por qualquer motivo? Devolução de 100% do valor pago, sem burocracia." },
  { q: "Quais formas de pagamento são aceitas?", a: "PIX, cartão de crédito em até 12x sem juros e pagamento na entrega (dinheiro, débito ou crédito)." },
  { q: "Como rastrear meu pedido?", a: "Após o despacho, você recebe o código de rastreamento por e-mail. O envio é feito via Sedex Expresso dos Correios." },
];

export const ALERTS = [
  { name: "Lucas", city: "Curitiba", uf: "PR", pack: "1 Kit Torcedor", mins: 2 },
  { name: "Patrícia", city: "Recife", uf: "PE", pack: "2 Kits Torcedor", mins: 6 },
  { name: "Carlos", city: "Goiânia", uf: "GO", pack: "1 Kit Torcedor", mins: 9 },
  { name: "Juliana", city: "Florianópolis", uf: "SC", pack: "3 Kits Torcedor", mins: 12 },
  { name: "Felipe", city: "Fortaleza", uf: "CE", pack: "1 Kit Torcedor", mins: 4 },
  { name: "Aline", city: "Manaus", uf: "AM", pack: "2 Kits Torcedor", mins: 8 },
];

export const CATEGORY_META: Record<Category | "all", { label: string; color: string; bg: string }> = {
  all:        { label: "Todos",            color: "#0a1f0e", bg: "#FFCC00" },
  vestuario:  { label: "Roupas e Estilo",  color: "#ffffff", bg: "#002868" },
  festa:      { label: "Festa",            color: "#0a1f0e", bg: "#FFCC00" },
  barulho:    { label: "Som",              color: "#ffffff", bg: "#dc2626" },
  decoracao:  { label: "Decoração",        color: "#ffffff", bg: "#006633" },
};
