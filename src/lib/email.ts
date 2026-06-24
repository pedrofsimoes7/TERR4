import { resend } from "@/lib/resend";

// Email do negócio (avisos internos + para onde vão as respostas dos clientes)
const ADMIN_EMAIL = "terr4geral@gmail.com";

// ── Helpers partilhados ─────────────────────────────────────────────
function formatDatePT(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function emailFooter() {
  return `
    <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
    <p style="font-size:14px;color:#666;">TERR4 Outdoor Gear</p>
    <div style="margin-top:32px;text-align:center;">
      <img
        src="${process.env.NEXT_PUBLIC_APP_URL}/images/terr4-logo-assets/terr4-logo-black-transparent.png"
        alt="TERR4 Outdoor Gear"
        style="width:160px;height:auto;display:inline-block;"
      />
      <p style="margin-top:14px;font-size:13px;color:#888;">
        <a href="mailto:${ADMIN_EMAIL}" style="color:#c46a2d;text-decoration:none;">${ADMIN_EMAIL}</a>
      </p>
    </div>
  `;
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
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "Pagamento confirmado — TERR4",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h1>Pagamento confirmado</h1>
        <p>Olá ${customerName},</p>
        <p>Confirmámos o pagamento da tua encomenda.</p>
        <p><strong>Encomenda:</strong> ${orderId}</p>
        <p><strong>Total:</strong> €${(total / 100).toFixed(2)}</p>
        <p>A nossa equipa irá preparar o envio e receberás novas atualizações quando a encomenda for processada.</p>
        ${emailFooter()}
      </div>
    `,
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
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "Confirma a tua conta!",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h1>Confirma a tua conta</h1>
        <p>Olá ${customerName || "cliente"},</p>
        <p>Obrigado por criares conta na TERR4. Para ativares a tua conta, confirma o teu email no botão abaixo.</p>
        <p style="margin:30px 0;">
          <a href="${verificationUrl}"
            style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:bold;">
            Confirmar email
          </a>
        </p>
        <p style="font-size:14px;color:#666;">Este link expira em 24 horas.</p>
        ${emailFooter()}
      </div>
    `,
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
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "Pedido de aluguer recebido",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h1>Pedido de aluguer recebido</h1>
        <p>Olá ${customerName},</p>
        <p>Recebemos o teu pedido de aluguer da <strong>${productName}</strong>. Vamos confirmar a disponibilidade e entrar em contacto contigo brevemente.</p>
        <div style="margin:24px 0;padding:20px;background:#f6f4ef;border-radius:12px;">
          <p style="margin:0 0 8px;"><strong>Datas:</strong> ${formatDatePT(startDate)} a ${formatDatePT(endDate)}</p>
          <p style="margin:0 0 8px;"><strong>Total do aluguer:</strong> €${(total / 100).toFixed(2)}</p>
          <p style="margin:0;"><strong>Caução (devolvida):</strong> €${(deposit / 100).toFixed(2)}</p>
        </div>
        <p style="font-size:14px;color:#666;">O pagamento é feito após confirmação. A recolha e devolução são feitas pelo cliente. A caução é devolvida após verificação do estado do material.</p>
        ${emailFooter()}
      </div>
    `,
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
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "Reserva confirmada",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h1>Reserva confirmada</h1>
        <p>Olá ${customerName},</p>
        <p>Boas notícias! A tua reserva da <strong>${productName}</strong> foi confirmada.</p>
        <div style="margin:24px 0;padding:20px;background:#f6f4ef;border-radius:12px;">
          <p style="margin:0;"><strong>Datas:</strong> ${formatDatePT(startDate)} a ${formatDatePT(endDate)}</p>
        </div>
        <p>Vamos combinar contigo os detalhes da recolha. O pagamento e a caução são tratados no momento da entrega.</p>
        <p style="font-size:14px;color:#666;">Qualquer dúvida, responde a este email.</p>
        ${emailFooter()}
      </div>
    `,
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
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "Sobre o teu pedido de aluguer",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h1>Pedido de aluguer</h1>
        <p>Olá ${customerName},</p>
        <p>Infelizmente não temos disponibilidade da <strong>${productName}</strong> para as datas de ${formatDatePT(startDate)} a ${formatDatePT(endDate)}.</p>
        <p>Podes tentar outras datas no nosso site — teremos todo o gosto em ajudar-te a planear a próxima aventura.</p>
        <p style="margin:30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/alugueres"
            style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:bold;">
            Ver outras datas
          </a>
        </p>
        ${emailFooter()}
      </div>
    `,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// CLIENTE — aluguer cancelado (reserva aprovada que foi cancelada)
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
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    replyTo: ADMIN_EMAIL,
    subject: "Reserva cancelada — TERR4",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h1>Reserva cancelada</h1>
        <p>Olá ${customerName},</p>
        <p>A tua reserva da <strong>${productName}</strong> para as datas de ${formatDatePT(startDate)} a ${formatDatePT(endDate)} foi cancelada.</p>
        <p>Se isto foi engano ou quiseres remarcar, fala connosco — estamos aqui para ajudar.</p>
        <p style="margin:30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/alugueres"
            style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:bold;">
            Fazer nova reserva
          </a>
        </p>
        ${emailFooter()}
      </div>
    `,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// INTERNO — novo pedido de aluguer (→ terr4geral)
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
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: ADMIN_EMAIL,
    replyTo: customerEmail,
    subject: `Novo pedido de aluguer — ${customerName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h1>Novo pedido de aluguer</h1>
        <p>Há um novo pedido de aluguer à espera de aprovação.</p>
        <div style="margin:24px 0;padding:20px;background:#f6f4ef;border-radius:12px;">
          <p style="margin:0 0 8px;"><strong>Produto:</strong> ${productName}</p>
          <p style="margin:0 0 8px;"><strong>Cliente:</strong> ${customerName}</p>
          <p style="margin:0 0 8px;"><strong>Email:</strong> ${customerEmail}</p>
          ${customerPhone ? `<p style="margin:0 0 8px;"><strong>Telefone:</strong> ${customerPhone}</p>` : ""}
          <p style="margin:0 0 8px;"><strong>Datas:</strong> ${formatDatePT(startDate)} a ${formatDatePT(endDate)}</p>
          <p style="margin:0;"><strong>Total:</strong> €${(total / 100).toFixed(2)}</p>
        </div>
        <p style="margin:30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/rentals"
            style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:bold;">
            Ver no admin
          </a>
        </p>
        ${emailFooter()}
      </div>
    `,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// INTERNO — nova encomenda paga (→ terr4geral)
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
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: ADMIN_EMAIL,
    replyTo: customerEmail,
    subject: `Nova encomenda — ${customerName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h1>Nova encomenda</h1>
        <p>Foi paga uma nova encomenda na loja.</p>
        <div style="margin:24px 0;padding:20px;background:#f6f4ef;border-radius:12px;">
          <p style="margin:0 0 8px;"><strong>Encomenda:</strong> ${orderId}</p>
          <p style="margin:0 0 8px;"><strong>Cliente:</strong> ${customerName}</p>
          <p style="margin:0 0 8px;"><strong>Email:</strong> ${customerEmail}</p>
          <p style="margin:0;"><strong>Total:</strong> €${(total / 100).toFixed(2)}</p>
        </div>
        <p style="margin:30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/orders"
            style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:bold;">
            Ver no admin
          </a>
        </p>
        ${emailFooter()}
      </div>
    `,
  });
  return result.data?.id;
}

// ════════════════════════════════════════════════════════════════════
// INTERNO — stock baixo (→ terr4geral)
// ════════════════════════════════════════════════════════════════════
export async function sendAdminLowStockEmail({
  productName,
  stock,
}: {
  productName: string;
  stock: number;
}) {
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: ADMIN_EMAIL,
    subject: `Stock baixo — ${productName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h1>Stock baixo</h1>
        <p>O produto <strong>${productName}</strong> está com apenas <strong>${stock} unidade${stock === 1 ? "" : "s"}</strong> em stock.</p>
        <p>Pode ser boa altura para repor.</p>
        <p style="margin:30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/products"
            style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:bold;">
            Gerir produtos
          </a>
        </p>
        ${emailFooter()}
      </div>
    `,
  });
  return result.data?.id;
}