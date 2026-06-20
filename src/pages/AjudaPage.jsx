const STEPS = [
  {
    n: 1, title: 'Criar um bolão', subtitle: 'Qualquer pessoa pode criar o seu', color: 'from-brblue to-[#1a56d6]',
    icon: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    body: [
      <>Na aba <strong>Bolões</strong>, clique em <strong>"Criar novo bolão"</strong>.</>,
      <>Preencha o <strong>nome</strong> do bolão e o <strong>valor de cada palpite</strong> (em R$) — esse é o valor que cada pessoa "aposta" a cada jogo que palpita.</>,
      <>Defina também a <strong>Senha de Admin</strong>: ela é sua e só sua — é o que permite cadastrar jogos e lançar o placar oficial depois. Guarde bem, pois sem ela ninguém (nem você) consegue editar o bolão de outro dispositivo.</>,
      <>Ao criar, você já entra automaticamente como administrador daquele bolão neste navegador.</>,
    ],
  },
  {
    n: 2, title: 'Público ou privado?', subtitle: 'Você escolhe quem pode ver e entrar', color: 'from-brgold to-[#e8c55e]',
    icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>,
    body: [
      <><strong>Público:</strong> aparece para qualquer pessoa que abrir o site, na aba "Bolões". Qualquer um pode entrar e palpitar sem senha.</>,
      <><strong>Privado:</strong> ative o botão "Bolão privado (com senha)" na criação e defina uma senha de entrada (diferente da senha de admin). Combine essa senha com a sua turma — sem ela, ninguém entra.</>,
    ],
  },
  {
    n: 3, title: 'Entrar em um bolão privado', subtitle: 'Como um convidado acessa', color: 'from-brred to-[#f02020]',
    icon: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>,
    body: [
      <>Na aba <strong>Bolões</strong>, os privados aparecem com um ícone de cadeado 🔒 no canto do card.</>,
      <>Ao clicar, vai pedir a <strong>senha de entrada</strong> (a que o criador combinou com a turma — não é a senha de admin).</>,
      <>Depois de digitar certo uma vez, o navegador "lembra" e não pede de novo, a menos que os dados do navegador sejam limpos.</>,
    ],
  },
  {
    n: 4, title: 'Cadastrar um jogo', subtitle: 'Só quem administra aquele bolão pode', color: 'from-brgreen to-[#14a862]',
    icon: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    body: [
      <>Vá na aba <strong>Admin</strong>. Lá aparecem só os bolões que você administra neste navegador.</>,
      <>Dentro do card do seu bolão, escolha o <strong>time da casa</strong>, <strong>visitante</strong>, a <strong>fase</strong> da competição e a <strong>data/hora limite</strong> para os palpites daquele jogo.</>,
      <>Clique em <strong>"Cadastrar Jogo neste Bolão"</strong> — o jogo passa a aparecer para todos os participantes daquele bolão específico, e de nenhum outro.</>,
    ],
  },
  {
    n: 5, title: 'Palpitar', subtitle: 'O que cada participante faz', color: 'from-brblue to-[#1a56d6]',
    icon: <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />,
    body: [
      <>Dentro do bolão, clique em <strong>"Palpitar"</strong> no jogo desejado, digite seu nome e o placar que você imagina que vai acontecer.</>,
      <><strong>Só vale o placar exato</strong> — quem acerta em cheio leva o valor de todos os outros palpites daquele jogo.</>,
      <>Depois do prazo definido, ninguém mais consegue palpitar ou alterar o que já enviou.</>,
      <>Acompanhe seus bolões na aba <strong>Meus Bolões</strong> — lá aparecem todos onde você já registrou pelo menos um palpite.</>,
    ],
  },
  {
    n: 6, title: 'Resultado final', subtitle: 'Quem ganha e como', color: 'from-brgold to-[#e8c55e]',
    icon: <><path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0012 0V2z" /></>,
    body: [
      <>O administrador do bolão insere o <strong>placar oficial</strong> depois que o jogo termina, na aba Admin.</>,
      <>O sistema compara automaticamente: quem acertou o placar exato aparece destacado em <strong>dourado com um troféu</strong> na lista de palpiteiros.</>,
      <>Se ninguém acertar, aparece "Nenhum Ganhador" — combine com a turma o que fazer com o valor (acumular para o próximo jogo, por exemplo).</>,
    ],
  },
];

export default function AjudaPage() {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="glass rounded-[20px] shadow-md text-center p-6 sm:p-7">
        <div className="font-display text-2xl sm:text-[32px] tracking-wide text-brblue">COMO FUNCIONA O BOLÃO</div>
        <div className="text-[13px] text-muted mt-1">Siga o passo a passo para criar e jogar com a sua galera</div>
      </div>

      {STEPS.map((s) => (
        <div key={s.n} className="glass rounded-[20px] shadow-md p-4 sm:p-5">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className={`w-8 h-8 rounded-[9px] bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px]">{s.icon}</svg>
            </div>
            <div className="min-w-0">
              <div className="font-display text-base sm:text-lg tracking-wide truncate-1">{s.n}. {s.title}</div>
              <div className="text-[11px] text-muted truncate-1">{s.subtitle}</div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 text-[13px] text-slate-600 leading-relaxed">
            {s.body.map((p, i) => <div key={i}>{p}</div>)}
          </div>
        </div>
      ))}
    </div>
  );
}
