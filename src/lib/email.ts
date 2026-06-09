import { resend } from "@/lib/resend";

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
    subject: "Pagamento confirmado — TERR4",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h1>Pagamento confirmado</h1>
        <p>Olá ${customerName},</p>
        <p>Confirmámos o pagamento da tua encomenda.</p>
        <p><strong>Encomenda:</strong> ${orderId}</p>
        <p><strong>Total:</strong> €${(total / 100).toFixed(2)}</p>
        <p>A nossa equipa irá preparar o envio e receberás novas atualizações quando a encomenda for processada.</p>
        <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
        <p style="font-size:14px;color:#666;">TERR4 Outdoor Gear</p>
        <div style="margin-top:32px;text-align:center;">
            <img
              src="${process.env.NEXT_PUBLIC_APP_URL}/images/terr4-logo-assets/terr4-logo-black-transparent.png"
              alt="TERR4 Outdoor Gear"
              style="width:160px;height:auto;display:inline-block;"
            />
          </div>
      </div>
    `,
  });

  return result.data?.id;
}

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
    subject: "Confirma a tua conta!",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h1>Confirma a tua conta</h1>

        <p>Olá ${customerName || "cliente"},</p>

        <p>
          Obrigado por criares conta na TERR4. Para ativares a tua conta, confirma o teu email no botão abaixo.
        </p>

        <p style="margin:30px 0;">
          <a
            href="${verificationUrl}"
            style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:bold;"
          >
            Confirmar email
          </a>
        </p>

        <p style="font-size:14px;color:#666;">
          Este link expira em 24 horas.
        </p>

        <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />

        <p style="font-size:14px;color:#666;">
          TERR4 Outdoor Gear
        </p>
        
        <div style="margin-top:32px;text-align:center;">
            <img
              src="${process.env.NEXT_PUBLIC_APP_URL}/images/terr4-logo-assets/terr4-logo-black-transparent.png"
              alt="TERR4 Outdoor Gear"
              style="width:160px;height:auto;display:inline-block;"
            />
          </div>
      </div>
    `,
  });

  return result.data?.id;
}