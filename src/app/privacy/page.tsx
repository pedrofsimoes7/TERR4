export const metadata = {
  title: "Política de Privacidade | TERR4",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#070706] px-6 pb-24 pt-40 text-white">
      <section className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
          TERR4
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-[-0.04em] md:text-7xl">
          Política de Privacidade
        </h1>

        <div className="mt-10 space-y-8 text-sm leading-7 text-[#c8c4be]/70">
          <section>
            <h2 className="text-2xl font-black text-white">1. Responsável pelo tratamento</h2>
            <p className="mt-3">
              A TERR4 Outdoor Gear é responsável pelo tratamento dos dados pessoais recolhidos através deste website. Contacto: terr4geral@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">2. Dados recolhidos</h2>
            <p className="mt-3">
              Podemos recolher nome, email, telefone, morada, dados de encomenda, dados de conta e informações necessárias para processar compras, pagamentos, entregas e apoio ao cliente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">3. Finalidades</h2>
            <p className="mt-3">
              Os dados são usados para criar contas, processar encomendas, confirmar pagamentos, enviar comunicações transacionais, responder a pedidos de contacto e melhorar o serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">4. Pagamentos</h2>
            <p className="mt-3">
              Os pagamentos são processados pela Stripe. A TERR4 não guarda dados completos de cartões bancários.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">5. Emails automáticos</h2>
            <p className="mt-3">
              Podemos enviar emails relacionados com confirmação de conta, encomendas, pagamentos e apoio ao cliente. Estes emails são necessários para o funcionamento do serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">6. Conservação dos dados</h2>
            <p className="mt-3">
              Os dados são conservados apenas durante o período necessário para cumprir as finalidades descritas, obrigações legais, fiscais e de segurança.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">7. Direitos do utilizador</h2>
            <p className="mt-3">
              O utilizador pode solicitar acesso, retificação, apagamento, limitação ou oposição ao tratamento dos seus dados, através do email terr4geral@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">8. Cookies</h2>
            <p className="mt-3">
              O website pode usar cookies essenciais para funcionamento da loja, autenticação, carrinho e segurança. Cookies não essenciais poderão depender de consentimento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">9. Alterações</h2>
            <p className="mt-3">
              Esta política pode ser atualizada sempre que necessário. A versão publicada no website é a versão em vigor.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}