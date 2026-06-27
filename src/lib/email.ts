import { resend } from "@/lib/resend";

// Email do negócio (avisos internos + para onde vão as respostas dos clientes)
const ADMIN_EMAIL = "terr4geral@gmail.com";

const COLORS = {
  text: "#1a1714",
  textSoft: "#6b6358",
  heading: "#0f0e0c",
  border: "#e7e2d8",
  bg: "#f4f1ea",
  card: "#ffffff",
  rust: "#c46a2d",
  green: "#2d4a2d",
  dark: "#111111",
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://terr4.pt";

// ── Helpers ─────────────────────────────────────────────────────────
function formatDatePT(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/**
 * Estrutura base, fundo claro e limpo. Tabelas + estilos inline para
 * compatibilidade com Gmail, Outlook, Apple Mail, etc.
 */
function baseEmail({
  preheader,
  heading,
  bodyHtml,
}: {
  preheader: string;
  heading: string;
  bodyHtml: string;
}) {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TERR4</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:0 0 24px;">
              <img src="${APP_URL}/images/terr4-logo-assets/terr4-logo-black-transparent.png"
                   alt="TERR4 Outdoor Gear" width="120"
                   style="display:block;width:120px;height:auto;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:${COLORS.card};border:1px solid ${COLORS.border};border-radius:16px;padding:40px;">
              <h1 style="margin:0 0 20px;font-size:23px;line-height:1.3;font-weight:700;color:${COLORS.heading};font-family:Arial,Helvetica,sans-serif;">${heading}</h1>
              <div style="font-size:15px;line-height:1.7;color:${COLORS.text};font-family:Arial,Helvetica,sans-serif;">
                ${bodyHtml}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 0;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:${COLORS.text};font-family:Arial,Helvetica,sans-serif;">TERR4 Outdoor Gear</p>
              <p style="margin:0 0 12px;font-size:13px;line-height:1.6;color:${COLORS.textSoft};font-family:Arial,Helvetica,sans-serif;">
                Tendas de tejadilho e equipamento para campismo e roadtrips. Feito em Portugal.
              </p>
              <p style="margin:0;font-size:13px;font-family:Arial,Helvetica,sans-serif;">
                <a href="mailto:${ADMIN_EMAIL}" style="color:${COLORS.rust};text-decoration:none;font-weight:700;">${ADMIN_EMAIL}</a>
                <span style="color:${COLORS.textSoft};"> &nbsp;·&nbsp; </span>
                <a href="${APP_URL}" style="color:${COLORS.textSoft};text-decoration:none;">terr4.pt</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Botão call-to-action */
function button(label: string, url: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 6px;">
      <tr>
        <td align="center" style="border-radius:999px;background-color:${COLORS.dark};">
          <a href="${url}"
             style="display:inline-block;padding:14px 30px;font-size:13px;font-weight:700;letter-spacing:0.5px;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;border-radius:999px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`;
}

/** Caixa de detalhes */
function detailBox(rows: { label: string; value: string }[]) {
  const inner = rows
    .map(
      (r, i) => `
      <tr>
        <td style="padding:${i === 0 ? "0" : "10px"} 0 0;font-size:14px;color:${COLORS.textSoft};font-family:Arial,Helvetica,sans-serif;">${r.label}</td>
        <td align="right" style="padding:${i === 0 ? "0" : "10px"} 0 0;font-size:14px;font-weight:700;color:${COLORS.heading};font-family:Arial,Helvetica,sans-serif;">${r.value}</td>
      </tr>`
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;background-color:${COLORS.bg};border-radius:12px;padding:20px 22px;">
      ${inner}
    </table>`;
}

// ════════════════════════════════════════════════════════════════════
// CLIENTE — pagamento confirmado
// ════════════════════════════════════════════════════════════════════
export async function sendOrderPaidEmail({
  customerName,
  customerEmail,
  orderId,
  total,
}: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  total: number;
}) {
  const html = baseEmail({
    preheader: "Confirmámos o pagamento da tua encomenda.",
    heading: "Pagamento confirmado",
    bodyHtml: `
      <p style="margin:0 0 16px;">Olá ${customerName},</p>
      <p style="margin:0 0 4px;">Recebemos e confirmámos o pagamento da tua encomenda. Vamos começar a prepará-la para envio.</p>
      ${detailBox([
        { label: "Encomenda", value: orderId },
        { label: "Total", value: formatEuros(total) },
      ])}
      <p style="margin:0;">Avisamos-te assim que a encomenda seguir viagem. Obrigado pela confiança.</p>
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "Pagamento confirmado",
    html,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// CLIENTE — confirmação de conta
// ════════════════════════════════════════════════════════════════════
export async function sendCustomerVerificationEmail({
  customerName,
  customerEmail,
  verificationUrl,
}: {
  customerName: string;
  customerEmail: string;
  verificationUrl: string;
}) {
  const html = baseEmail({
    preheader: "Falta um passo para ativares a tua conta TERR4.",
    heading: "Confirma a tua conta",
    bodyHtml: `
      <p style="margin:0 0 16px;">Olá ${customerName || "e bem-vindo"},</p>
      <p style="margin:0 0 4px;">Obrigado por criares conta na TERR4. Falta só confirmar o teu email para ativares tudo.</p>
      ${button("Confirmar email", verificationUrl)}
      <p style="margin:16px 0 0;font-size:13px;color:${COLORS.textSoft};">Este link é válido durante 24 horas. Se não foste tu a criar esta conta, ignora este email.</p>
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "Confirma a tua conta",
    html,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// CLIENTE — pedido de aluguer recebido
// ════════════════════════════════════════════════════════════════════
export async function sendRentalRequestEmail({
  customerName,
  customerEmail,
  productName,
  startDate,
  endDate,
  total,
  deposit,
}: {
  customerName: string;
  customerEmail: string;
  productName: string;
  startDate: Date;
  endDate: Date;
  total: number;
  deposit: number;
}) {
  const html = baseEmail({
    preheader: `Recebemos o teu pedido de aluguer da ${productName}.`,
    heading: "Recebemos o teu pedido",
    bodyHtml: `
      <p style="margin:0 0 16px;">Olá ${customerName},</p>
      <p style="margin:0 0 4px;">Recebemos o teu pedido de aluguer da <strong style="color:${COLORS.heading};">${productName}</strong>. Vamos verificar a disponibilidade e entrar em contacto contigo muito em breve.</p>
      ${detailBox([
        { label: "Datas", value: `${formatDatePT(startDate)} a ${formatDatePT(endDate)}` },
        { label: "Total do aluguer", value: formatEuros(total) },
        { label: "Caução (devolvida)", value: formatEuros(deposit) },
      ])}
      <p style="margin:0;font-size:13px;color:${COLORS.textSoft};">O pagamento é feito após a confirmação. A recolha e a devolução são da responsabilidade do cliente, e a caução é devolvida após verificação do estado do material.</p>
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "Recebemos o teu pedido de aluguer",
    html,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// CLIENTE — aluguer aprovado
// ════════════════════════════════════════════════════════════════════
export async function sendRentalApprovedEmail({
  customerName,
  customerEmail,
  productName,
  startDate,
  endDate,
}: {
  customerName: string;
  customerEmail: string;
  productName: string;
  startDate: Date;
  endDate: Date;
}) {
  const html = baseEmail({
    preheader: `A tua reserva da ${productName} está confirmada.`,
    heading: "A tua reserva está confirmada",
    bodyHtml: `
      <p style="margin:0 0 16px;">Olá ${customerName},</p>
      <p style="margin:0 0 4px;">Boas notícias. A tua reserva da <strong style="color:${COLORS.heading};">${productName}</strong> foi aprovada e está garantida para as datas escolhidas.</p>
      ${detailBox([
        { label: "Datas", value: `${formatDatePT(startDate)} a ${formatDatePT(endDate)}` },
      ])}
      <p style="margin:0 0 16px;">Vamos combinar contigo os detalhes da recolha. O pagamento e a caução são tratados no momento da entrega.</p>
      <p style="margin:0;font-size:13px;color:${COLORS.textSoft};">Se tiveres alguma questão, basta responder a este email.</p>
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "A tua reserva está confirmada",
    html,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// CLIENTE — aluguer rejeitado
// ════════════════════════════════════════════════════════════════════
export async function sendRentalRejectedEmail({
  customerName,
  customerEmail,
  productName,
  startDate,
  endDate,
}: {
  customerName: string;
  customerEmail: string;
  productName: string;
  startDate: Date;
  endDate: Date;
}) {
  const html = baseEmail({
    preheader: "Sobre o teu pedido de aluguer na TERR4.",
    heading: "Sobre o teu pedido",
    bodyHtml: `
      <p style="margin:0 0 16px;">Olá ${customerName},</p>
      <p style="margin:0 0 4px;">Infelizmente não temos disponibilidade da <strong style="color:${COLORS.heading};">${productName}</strong> para as datas de ${formatDatePT(startDate)} a ${formatDatePT(endDate)}.</p>
      <p style="margin:16px 0 0;">Gostaríamos muito de te ajudar a planear a próxima aventura. Experimenta outras datas no nosso site.</p>
      ${button("Ver outras datas", `${APP_URL}/alugueres`)}
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "Sobre o teu pedido de aluguer",
    html,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// CLIENTE — aluguer cancelado
// ════════════════════════════════════════════════════════════════════
export async function sendRentalCancelledEmail({
  customerName,
  customerEmail,
  productName,
  startDate,
  endDate,
}: {
  customerName: string;
  customerEmail: string;
  productName: string;
  startDate: Date;
  endDate: Date;
}) {
  const html = baseEmail({
    preheader: "A tua reserva foi cancelada.",
    heading: "A tua reserva foi cancelada",
    bodyHtml: `
      <p style="margin:0 0 16px;">Olá ${customerName},</p>
      <p style="margin:0 0 4px;">A tua reserva da <strong style="color:${COLORS.heading};">${productName}</strong> para as datas de ${formatDatePT(startDate)} a ${formatDatePT(endDate)} foi cancelada.</p>
      <p style="margin:16px 0 0;">Se foi engano, ou se quiseres remarcar para outras datas, fala connosco. Teremos todo o gosto em ajudar.</p>
      ${button("Fazer nova reserva", `${APP_URL}/alugueres`)}
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "A tua reserva foi cancelada",
    html,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// CLIENTE — reserva de stock recebida (produto sem stock)
// ════════════════════════════════════════════════════════════════════
export async function sendStockReservationEmail({
  customerName,
  customerEmail,
  productName,
}: {
  customerName: string;
  customerEmail: string;
  productName: string;
}) {
  const html = baseEmail({
    preheader: `Registámos o teu interesse na ${productName}.`,
    heading: "Estás na lista",
    bodyHtml: `
      <p style="margin:0 0 16px;">Olá ${customerName},</p>
      <p style="margin:0 0 4px;">Registámos o teu interesse na <strong style="color:${COLORS.heading};">${productName}</strong>. De momento este produto está esgotado, mas a tua reserva está garantida.</p>
      ${detailBox([
        { label: "Produto", value: productName },
        { label: "Estado", value: "Em lista de espera" },
      ])}
      <p style="margin:0;">Assim que houver stock, recebes um email automático a avisar. Serás dos primeiros a saber, e não precisas de fazer mais nada.</p>
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "A tua reserva está registada",
    html,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// CLIENTE — produto voltou a ter stock (aviso automático)
// ════════════════════════════════════════════════════════════════════
export async function sendBackInStockEmail({
  customerName,
  customerEmail,
  productName,
  productSlug,
}: {
  customerName: string;
  customerEmail: string;
  productName: string;
  productSlug: string;
}) {
  const html = baseEmail({
    preheader: `A ${productName} já está disponível.`,
    heading: "Já está disponível",
    bodyHtml: `
      <p style="margin:0 0 16px;">Olá ${customerName},</p>
      <p style="margin:0 0 4px;">A <strong style="color:${COLORS.heading};">${productName}</strong> que reservaste voltou a estar disponível. Garante a tua antes que esgote novamente.</p>
      ${button("Ver produto", `${APP_URL}/shop/${productSlug}`)}
      <p style="margin:16px 0 0;font-size:13px;color:${COLORS.textSoft};">Recebeste este email porque reservaste este produto no nosso site.</p>
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: `Já está disponível: ${productName}`,
    html,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// INTERNO — nova reserva de stock (-> terr4geral)
// ════════════════════════════════════════════════════════════════════
export async function sendAdminNewReservationEmail({
  customerName,
  customerEmail,
  productName,
}: {
  customerName: string;
  customerEmail: string;
  productName: string;
}) {
  const html = baseEmail({
    preheader: `Nova reserva de ${productName}.`,
    heading: "Nova reserva de stock",
    bodyHtml: `
      <p style="margin:0 0 4px;">Um cliente reservou um produto que está esgotado. Quando repuseres o stock no painel, ele será avisado automaticamente.</p>
      ${detailBox([
        { label: "Produto", value: productName },
        { label: "Cliente", value: customerName },
        { label: "Email", value: customerEmail },
      ])}
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: ADMIN_EMAIL,
    replyTo: customerEmail,
    subject: `Nova reserva (sem stock): ${productName}`,
    html,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// INTERNO — novo pedido de aluguer (-> terr4geral)
// ════════════════════════════════════════════════════════════════════
export async function sendAdminNewRentalEmail({
  customerName,
  customerEmail,
  customerPhone,
  productName,
  startDate,
  endDate,
  total,
}: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  productName: string;
  startDate: Date;
  endDate: Date;
  total: number;
}) {
  const rows = [
    { label: "Produto", value: productName },
    { label: "Cliente", value: customerName },
    { label: "Email", value: customerEmail },
  ];
  if (customerPhone) rows.push({ label: "Telefone", value: customerPhone });
  rows.push({ label: "Datas", value: `${formatDatePT(startDate)} a ${formatDatePT(endDate)}` });
  rows.push({ label: "Total", value: formatEuros(total) });

  const html = baseEmail({
    preheader: `Novo pedido de aluguer de ${customerName}.`,
    heading: "Novo pedido de aluguer",
    bodyHtml: `
      <p style="margin:0 0 4px;">Há um novo pedido de aluguer à espera de aprovação.</p>
      ${detailBox(rows)}
      ${button("Ver no painel", `${APP_URL}/admin/rentals`)}
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: ADMIN_EMAIL,
    replyTo: customerEmail,
    subject: `Novo pedido de aluguer: ${customerName}`,
    html,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// INTERNO — nova encomenda paga (-> terr4geral)
// ════════════════════════════════════════════════════════════════════
export async function sendAdminNewOrderEmail({
  customerName,
  customerEmail,
  orderId,
  total,
}: {
  customerName: string;
  customerEmail: string;
  orderId: string;
  total: number;
}) {
  const html = baseEmail({
    preheader: `Nova encomenda de ${customerName}.`,
    heading: "Nova encomenda paga",
    bodyHtml: `
      <p style="margin:0 0 4px;">Foi paga uma nova encomenda na loja.</p>
      ${detailBox([
        { label: "Encomenda", value: orderId },
        { label: "Cliente", value: customerName },
        { label: "Email", value: customerEmail },
        { label: "Total", value: formatEuros(total) },
      ])}
      ${button("Ver no painel", `${APP_URL}/admin/orders`)}
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: ADMIN_EMAIL,
    replyTo: customerEmail,
    subject: `Nova encomenda: ${customerName}`,
    html,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// INTERNO — stock baixo (-> terr4geral)
// ════════════════════════════════════════════════════════════════════
export async function sendAdminLowStockEmail({
  productName,
  stock,
}: {
  productName: string;
  stock: number;
}) {
  const html = baseEmail({
    preheader: `${productName} está com pouco stock.`,
    heading: "Stock a acabar",
    bodyHtml: `
      <p style="margin:0 0 4px;">O produto <strong style="color:${COLORS.heading};">${productName}</strong> está com apenas <strong style="color:${COLORS.heading};">${stock} unidade${stock === 1 ? "" : "s"}</strong> em stock. Pode ser boa altura para repor.</p>
      ${button("Gerir produtos", `${APP_URL}/admin/products`)}
    `,
  });

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: ADMIN_EMAIL,
    subject: `Stock a acabar: ${productName}`,
    html,
  });
  return result.data?.id;
}


// ════════════════════════════════════════════════════════════════════
// INTERNO — nova mensagem de contacto (-> terr4geral)
// ════════════════════════════════════════════════════════════════════
export async function sendContactEmail({
  customerName,
  customerEmail,
  vehicle,
  message,
}: {
  customerName: string;
  customerEmail: string;
  vehicle?: string;
  message: string;
}) {
  const rows = [
    { label: "Nome", value: customerName },
    { label: "Email", value: customerEmail },
  ];
  if (vehicle) rows.push({ label: "Veículo", value: vehicle });
 
  const html = baseEmail({
    preheader: `Nova mensagem de ${customerName}.`,
    heading: "Nova mensagem de contacto",
    bodyHtml: `
      <p style="margin:0 0 4px;">Recebeste uma nova mensagem através do formulário de contacto do site.</p>
      ${detailBox(rows)}
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:${COLORS.textSoft};">Mensagem:</p>
      <p style="margin:0;padding:16px 18px;background-color:${COLORS.bg};border-radius:12px;white-space:pre-wrap;">${message}</p>
    `,
  });
 
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: ADMIN_EMAIL,
    replyTo: customerEmail,
    subject: `Nova mensagem de contacto: ${customerName}`,
    html,
  });
  return result.data?.id;
}
 

// ════════════════════════════════════════════════════════════════════
// CLIENTE (marketing) — produto em promoção
// ════════════════════════════════════════════════════════════════════
export async function sendPromotionEmail({
  customerName,
  customerEmail,
  productName,
  productSlug,
  oldPrice,
  newPrice,
  discountPercent,
  saleEndsAt,
}: {
  customerName: string;
  customerEmail: string;
  productName: string;
  productSlug: string;
  oldPrice: number; // em cêntimos
  newPrice: number; // em cêntimos
  discountPercent: number;
  saleEndsAt?: Date | null;
}) {
  const rows = [
    { label: "Produto", value: productName },
    { label: "Preço normal", value: formatEuros(oldPrice) },
    { label: "Preço em promoção", value: formatEuros(newPrice) },
    { label: "Poupas", value: `${discountPercent}%` },
  ];
  if (saleEndsAt) {
    rows.push({ label: "Até", value: formatDatePT(saleEndsAt) });
  }
 
  const html = baseEmail({
    preheader: `${productName} está com ${discountPercent}% de desconto.`,
    heading: `${discountPercent}% de desconto na ${productName}`,
    bodyHtml: `
      <p style="margin:0 0 16px;">Olá ${customerName || "aventureiro"},</p>
      <p style="margin:0 0 4px;">Temos uma novidade para ti: a <strong style="color:${COLORS.heading};">${productName}</strong> está em promoção. É a altura certa para garantir a tua.</p>
      ${detailBox(rows)}
      ${button("Aproveitar promoção", `${APP_URL}/shop/${productSlug}`)}
      <p style="margin:16px 0 0;font-size:13px;color:${COLORS.textSoft};">Recebeste este email porque autorizaste novidades e promoções da TERR4.</p>
    `,
  });
 
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: `${discountPercent}% de desconto na ${productName}`,
    html,
  });
  return result.data?.id;
}
 
// ════════════════════════════════════════════════════════════════════
// CLIENTE (marketing) — produto novo lançado
// ════════════════════════════════════════════════════════════════════
export async function sendNewProductEmail({
  customerName,
  customerEmail,
  productName,
  productSlug,
  price,
  shortDescription,
}: {
  customerName: string;
  customerEmail: string;
  productName: string;
  productSlug: string;
  price?: number | null; // em cêntimos
  shortDescription?: string;
}) {
  const html = baseEmail({
    preheader: `Novidade na TERR4: ${productName}.`,
    heading: `Novidade: ${productName}`,
    bodyHtml: `
      <p style="margin:0 0 16px;">Olá ${customerName || "aventureiro"},</p>
      <p style="margin:0 0 4px;">Acabámos de lançar um novo produto e queremos que sejas dos primeiros a conhecer: a <strong style="color:${COLORS.heading};">${productName}</strong>.</p>
      ${shortDescription ? `<p style="margin:14px 0 0;color:${COLORS.textSoft};">${shortDescription}</p>` : ""}
      ${price ? detailBox([{ label: "Preço", value: formatEuros(price) }]) : ""}
      ${button("Ver produto", `${APP_URL}/shop/${productSlug}`)}
      <p style="margin:16px 0 0;font-size:13px;color:${COLORS.textSoft};">Recebeste este email porque autorizaste novidades e promoções da TERR4.</p>
    `,
  });
 
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: `Novidade na TERR4: ${productName}`,
    html,
  });
  return result.data?.id;
}
 