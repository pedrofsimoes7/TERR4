# Configuração Stripe da TERR4

Este projeto cria dois tipos de pagamento:

- produtos: PaymentIntent apresentado no checkout do site;
- alugueres: Checkout Session criada quando a TERR4 confirma a disponibilidade, seguida de um link enviado por email ao cliente.

## 1. Chave restrita de produção

No Stripe, em modo real, abra **Developers → API keys** e edite/crie uma chave restrita. Dê-lhe um nome claro, por exemplo `TERR4 Vercel Production`.

Permissões necessárias para o código atual:

| Recurso Stripe | Permissão | Utilização |
|---|---|---|
| Payment Intents | Write | Criar, consultar e cancelar pagamentos de produtos; confirmar pagamentos recebidos |
| Checkout Sessions | Write | Criar, consultar e expirar os links de pagamento dos alugueres |

Deixe os restantes recursos em **None**, salvo se outra integração desta mesma chave precisar deles. Não aplique uma restrição por endereço IP sem uma configuração própria para os endereços de saída do alojamento.

A chave começa por `rk_live_`. Só deve ser copiada para o armazenamento de segredos do Vercel. Não deve ser enviada por email/chat, colocada no código ou começar por `NEXT_PUBLIC_`.

## 2. Variáveis no Vercel

No projeto publicado, em **Settings → Environment Variables**, configure para **Production**:

```text
STRIPE_SECRET_KEY=rk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://terr4.pt
COMPANY_EMAIL=terr4geral@gmail.com
EMAIL_FROM=TERR4 Outdoor Gear <geral@terr4.pt>
```

`rk_live_`, `pk_live_` e `whsec_` são três valores diferentes. A chave pública e a chave restrita têm de pertencer à mesma conta Stripe e estar ambas em modo real.

Depois de guardar ou alterar uma variável, faça um novo deploy da versão do site que contém estas alterações.

## 3. Webhook

Em **Developers/Workbench → Webhooks**, crie ou abra o destino da conta TERR4:

```text
https://terr4.pt/api/stripe/webhook
```

Selecione estes eventos:

```text
payment_intent.succeeded
checkout.session.expired
```

Abra o destino criado e revele o **Signing secret**, que começa por `whsec_`. Esse valor deve ser guardado no Vercel como `STRIPE_WEBHOOK_SECRET`. O segredo de um webhook de teste não funciona no webhook de produção.

## 4. Base de dados

Antes de publicar o novo código, aplique as migrações Prisma no ambiente de produção:

```text
npx prisma migrate deploy
```

A migração nova regista separadamente se o cliente e a empresa receberam a notificação. Assim, uma repetição do webhook tenta novamente apenas o email que falhou.

## 5. Teste controlado

Primeiro faça o mesmo percurso num ambiente de teste Stripe com `rk_test_`, `pk_test_` e o `whsec_` desse destino de teste. Confirme:

1. compra de um produto com pagamento aprovado;
2. pedido de aluguer, email de decisão e confirmação de disponibilidade;
3. receção do link do aluguer e pagamento;
4. encomenda/reserva marcada como paga;
5. emails recebidos pelo cliente e em `COMPANY_EMAIL`;
6. expiração de um link de aluguer não pago.

Só depois faça um pagamento real controlado, de valor baixo, e reconcilie o registo do Stripe, a base de dados e os dois emails.
