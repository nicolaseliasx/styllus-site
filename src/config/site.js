export const siteConfig = {
  phone: "5548991885129",
  whatsappBase: "https://api.whatsapp.com/send",
  messages: {
    trial:
      "Olá! Gostaria de agendar uma aula experimental na Styllus Fitness Center.",
    plans:
      "Olá! Gostaria de conhecer os planos e as condições atuais da Styllus Fitness Center.",
    general:
      "Olá! Gostaria de conhecer melhor a Styllus Fitness Center, seus planos, horários e estrutura.",
  },
};

export function whatsappUrl(messageKey = "general") {
  const message =
    siteConfig.messages[messageKey] || siteConfig.messages.general;
  return `${siteConfig.whatsappBase}?phone=${siteConfig.phone}&text=${encodeURIComponent(message)}`;
}
