export const SELLER_TERMS = [
  {
    title: '1 - Comissao sobre vendas',
    text: 'A plataforma MachoCar retera 50% (cinquenta por cento) do valor bruto de cada veiculo vendido a titulo de "taxa de felicidade do sistema". O vendedor recebera os 50% restantes em ate 180 dias uteis, podendo ser pago em vales-presente de postos de gasolina parceiros.',
  },
  {
    title: '2 - Requisito do mecanico',
    text: 'Todo veiculo anunciado devera ser revisado por um mecanico que seja, comprovadamente, sobrinho(a) do proprietario do estabelecimento. Primos de segundo grau serao aceitos apenas mediante carta notariada reconhecendo a amizade familiar.',
  },
  {
    title: '3 - Fotos obrigatorias',
    text: 'Pelo menos uma foto do anuncio deve ter sido tirada na chuva para "autenticar a pintura". Fotos com arco-iris ao fundo receberao destaque premium gratuito por 3 horas.',
  },
  {
    title: '4 - Uso do nome',
    text: 'A MachoCar reserva-se o direito de usar o seu primeiro nome em campanhas de marketing, slogans e tatuagens corporativas sem aviso previo. O vendedor declara que o nome nao causa vergonha alheia.',
  },
  {
    title: '5 - Cheiro do veiculo',
    text: 'O veiculo deve cheirar a "carro novo" ou, alternativamente, a "pinheiros da floresta". Cheiro de hamburguer resultara em suspensao temporaria da conta por 7 dias. Odores nao catalogados serao avaliados por nosso Comite de Aromas, reunido nas terceiras quintas-feiras do mes.',
  },
  {
    title: '6 - Negociacao',
    text: 'E vedado ao vendedor aceitar qualquer proposta de valor sem antes gritar "FECHADO!" tres vezes em voz alta, independentemente do local onde se encontre (reunioes de trabalho, missas, consultas medicas). O descumprimento acarreta multa de R$ 1,00.',
  },
  {
    title: '7 - Suporte ao comprador',
    text: 'O vendedor compromete-se a enviar uma mensagem de "bom dia" com figurinha de cafe ao comprador durante os primeiros 30 dias apos a venda. A ausencia de figurinha implica devolucao de 0,5% da comissao retida.',
  },
  {
    title: '8 - Alteracoes nos termos',
    text: 'A MachoCar pode alterar estes termos a qualquer momento, inclusive retroativamente. As atualizacoes serao comunicadas via pombo-correio, ou, na sua ausencia, via pressentimento.',
  },
] as const;

export type SellerTerm = typeof SELLER_TERMS[number];
