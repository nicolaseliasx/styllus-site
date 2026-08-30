export const siteConfig = {
  phone: "5548991885129",
  whatsappBase: "https://api.whatsapp.com/send",
  messages: {
    trial:
      "Olá! Gostaria de agendar uma aula experimental na Styllus Fitness Center.",
    annual:
      "Olá! Tenho interesse no plano anual de 12x de R$ 89,90 da Styllus.",
    monthly:
      "Olá! Tenho interesse no plano mensal de R$ 109,90 sem fidelidade da Styllus.",
    general:
      "Olá! Gostaria de conhecer melhor a Styllus Fitness Center, seus planos, horários e estrutura.",
  },
};

export function whatsappUrl(messageKey = "general") {
  const message =
    siteConfig.messages[messageKey] || siteConfig.messages.general;
  return `${siteConfig.whatsappBase}?phone=${siteConfig.phone}&text=${encodeURIComponent(message)}`;
}
