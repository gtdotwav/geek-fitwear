import { Resend } from 'resend';
import type { Order } from './supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'GreekFit <pedidos@greekfw.com>';

export async function sendOrderConfirmation(order: Order) {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E6DFD2;">
          <strong style="color: #1A1A1A;">${item.product_name}</strong><br/>
          <span style="color: #6F6A5F; font-size: 13px;">
            Tamanho ${item.size}${item.variant === 'com-logo' ? ' · Com Logo' : item.variant === 'sem-logo' ? ' · Sem Logo' : ''}
            · Qtd: ${item.quantity}
          </span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E6DFD2; text-align: right; color: #1A1A1A;">
          R$ ${(item.unit_price * item.quantity).toFixed(2).replace('.', ',')}
        </td>
      </tr>`
    )
    .join('');

  const addr = order.shipping_address;
  const addressHtml = `${addr.street}, ${addr.number}${addr.complement ? ` - ${addr.complement}` : ''}<br/>
    ${addr.neighborhood} · ${addr.city}/${addr.state}<br/>
    CEP ${addr.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #F5F1E8; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">

    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-weight: 200; font-size: 28px; color: #1A1A1A; letter-spacing: 0.05em; margin: 0;">
        GreekFit
      </h1>
      <p style="color: #C2A27C; font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; margin-top: 8px;">
        Confirmação de Pedido
      </p>
    </div>

    <!-- Greeting -->
    <div style="margin-bottom: 32px;">
      <p style="color: #1A1A1A; font-size: 15px; line-height: 1.8;">
        Olá, <strong>${order.customer_name.split(' ')[0]}</strong>!
      </p>
      <p style="color: #6F6A5F; font-size: 14px; line-height: 1.8;">
        Seu pagamento foi confirmado. Seu pedido já está sendo preparado com o cuidado que cada peça GreekFit merece.
      </p>
    </div>

    <!-- Order ID -->
    <div style="background: #E6DFD2; padding: 16px 20px; margin-bottom: 32px;">
      <p style="margin: 0; color: #6F6A5F; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">
        Pedido
      </p>
      <p style="margin: 4px 0 0; color: #1A1A1A; font-size: 16px; font-weight: 300; letter-spacing: 0.02em;">
        #${(order.id || '').substring(0, 8).toUpperCase()}
      </p>
    </div>

    <!-- Items -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      ${itemsHtml}
    </table>

    <!-- Totals -->
    <div style="margin-bottom: 32px;">
      <div style="display: flex; justify-content: space-between; padding: 6px 0;">
        <span style="color: #6F6A5F; font-size: 13px;">Subtotal</span>
        <span style="color: #1A1A1A; font-size: 13px;">R$ ${order.subtotal.toFixed(2).replace('.', ',')}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 6px 0;">
        <span style="color: #6F6A5F; font-size: 13px;">Frete</span>
        <span style="color: ${order.shipping_cost === 0 ? '#A88F6A' : '#1A1A1A'}; font-size: 13px;">
          ${order.shipping_cost === 0 ? 'Grátis' : `R$ ${order.shipping_cost.toFixed(2).replace('.', ',')}`}
        </span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 1px solid #1A1A1A; margin-top: 8px;">
        <span style="color: #1A1A1A; font-size: 16px; font-weight: 400;">Total</span>
        <span style="color: #1A1A1A; font-size: 16px; font-weight: 400;">R$ ${order.total.toFixed(2).replace('.', ',')}</span>
      </div>
    </div>

    <!-- Shipping -->
    <div style="background: #E6DFD2; padding: 16px 20px; margin-bottom: 32px;">
      <p style="margin: 0 0 4px; color: #6F6A5F; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">
        Entrega
      </p>
      <p style="margin: 0; color: #1A1A1A; font-size: 13px; line-height: 1.7;">
        ${addressHtml}
      </p>
    </div>

    <!-- Track link -->
    <div style="text-align: center; margin-bottom: 40px;">
      <a href="https://greekfw.com/pedido/${order.id}"
         style="display: inline-block; background: #1A1A1A; color: #F5F1E8; padding: 14px 32px; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none;">
        Acompanhar Pedido
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; border-top: 1px solid #E6DFD2; padding-top: 24px;">
      <p style="color: #6F6A5F; font-size: 11px; line-height: 1.8;">
        Dúvidas? Responda este email ou fale conosco pelo WhatsApp.
      </p>
      <p style="color: #A88F6A; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; margin-top: 16px;">
        GreekFit · Vista o Sol.
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: order.customer_email,
      subject: `GreekFit — Pedido #${(order.id || '').substring(0, 8).toUpperCase()} confirmado`,
      html,
    });

    if (error) {
      console.error('[email] send error:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('[email] exception:', e);
    return false;
  }
}

export async function sendShippingNotification(order: Order, trackingCode: string) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #F5F1E8; font-family: 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 24px;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-weight: 200; font-size: 28px; color: #1A1A1A; letter-spacing: 0.05em; margin: 0;">GreekFit</h1>
      <p style="color: #C2A27C; font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; margin-top: 8px;">
        Seu pedido foi enviado!
      </p>
    </div>
    <p style="color: #1A1A1A; font-size: 15px; line-height: 1.8;">
      Olá, <strong>${order.customer_name.split(' ')[0]}</strong>!
    </p>
    <p style="color: #6F6A5F; font-size: 14px; line-height: 1.8;">
      Suas peças GreekFit estão a caminho. Use o código abaixo para rastrear:
    </p>
    <div style="background: #E6DFD2; padding: 16px 20px; margin: 24px 0; text-align: center;">
      <p style="margin: 0; color: #6F6A5F; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">Rastreio</p>
      <p style="margin: 4px 0 0; color: #1A1A1A; font-size: 18px; font-weight: 400; letter-spacing: 0.05em;">${trackingCode}</p>
    </div>
    <div style="text-align: center;">
      <a href="https://greekfw.com/pedido/${order.id}" style="display: inline-block; background: #1A1A1A; color: #F5F1E8; padding: 14px 32px; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none;">
        Acompanhar Pedido
      </a>
    </div>
    <div style="text-align: center; border-top: 1px solid #E6DFD2; padding-top: 24px; margin-top: 40px;">
      <p style="color: #A88F6A; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;">GreekFit · Vista o Sol.</p>
    </div>
  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: order.customer_email,
      subject: `GreekFit — Pedido #${(order.id || '').substring(0, 8).toUpperCase()} enviado!`,
      html,
    });
  } catch (e) {
    console.error('[email] shipping notification error:', e);
  }
}
