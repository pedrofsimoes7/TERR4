import Link from "next/link";

export const metadata = {
  title: "Termos e Condições | TERR4",
};

export default function TermsPage() {
  return (
    <main className="bg-[#070706] px-6 pb-24 pt-40 text-white">
      <section className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-[#a79d8d]">
          TERR4
        </p>

        <h1 className="mt-4 text-5xl font-black tracking-[-0.04em] md:text-7xl">
          Termos e Condições
        </h1>

        <div className="mt-10 space-y-8 text-sm leading-7 text-[#c8c4be]/70">
          <section>
            <h2 className="text-2xl font-black text-white">1. Identificação</h2>
            <p className="mt-3">
              Este website é operado pela TERR4 Outdoor Gear. Para questões relacionadas com encomendas, produtos ou apoio ao cliente, podes contactar-nos através do email terr4geral@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">2. Produtos</h2>
            <p className="mt-3">
              A TERR4 disponibiliza produtos relacionados com rooftop tents e outdoor gear. As imagens, descrições, preços e disponibilidade podem ser atualizados sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">3. Preços e pagamentos</h2>
            <p className="mt-3">
              Os preços apresentados estão em euros. Os pagamentos são processados de forma segura através da Stripe. A encomenda apenas é considerada confirmada após confirmação do pagamento.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">4. Encomendas</h2>
            <p className="mt-3">
              Após a realização da encomenda, o cliente recebe uma confirmação por email. A TERR4 reserva-se o direito de cancelar encomendas em caso de erro de stock, erro de preço, suspeita de fraude ou impossibilidade de entrega.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">5. Envio e entrega</h2>
            <p className="mt-3">
              As condições de envio são combinadas conforme o produto, destino e disponibilidade logística. O prazo de entrega poderá variar consoante o tipo de produto.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">6. Garantia</h2>
            <p className="mt-3">
              Os produtos têm garantia de 12 meses contra defeitos de fabrico, salvo indicação diferente na página do produto. A garantia não cobre desgaste normal, utilização incorreta, acidentes, montagem incorreta ou má conservação.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">7. Devoluções</h2>
            <p className="mt-3">
              O cliente deve contactar a TERR4 antes de qualquer devolução. Produtos usados, danificados por utilização incorreta ou incompletos podem não ser aceites para devolução.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">8. Livro de reclamações</h2>
            <p className="mt-3">
              Quando aplicável, o consumidor pode recorrer ao Livro de Reclamações Eletrónico.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white">9. Privacidade</h2>
            <p className="mt-3">
              O tratamento de dados pessoais está descrito na nossa{" "}
              <Link href="/privacy" className="font-bold text-white underline">
                Política de Privacidade
              </Link>.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}