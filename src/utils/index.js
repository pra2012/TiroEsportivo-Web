// Utilitários para a aplicação TiroEsportivo

/**
 * Cria URLs para páginas da aplicação
 * @param {string} pageName - Nome da página
 * @param {object} params - Parâmetros adicionais
 * @returns {string} URL da página
 */
export function createPageUrl(pageName, params = {}) {
  const baseUrls = {
    'Home': '/',
    'Dashboard': '/dashboard',
    'Comunidade': '/comunidade',
    'Acervo': '/acervo',
    'Atividades': '/atividades',
    'Resultados': '/resultados',
    'Analise': '/analise',
    'Perfil': '/perfil',
    'Gerenciar': '/gerenciar',
    'GerenciarUsuarios': '/gerenciar-usuarios',
    'GerenciarAnuncios': '/gerenciar-anuncios',
    'GerenciarParceiros': '/gerenciar-parceiros',
    'GerenciarCompeticoes': '/gerenciar-competicoes',
    'Cadastro': '/cadastro',
    'Login': '/login'
  };

  let url = baseUrls[pageName] || '/';
  
  // Adiciona parâmetros de query se fornecidos
  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    url += `?${searchParams.toString()}`;
  }
  
  return url;
}

/**
 * Formata datas para exibição no padrão brasileiro dd/mm/yyyy
 * @param {string} dateString - String de data ISO
 * @returns {string} Data formatada
 */
export function formatDate(dateString) {
  if (!dateString) return "Sem data";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch {
    return "Data inválida";
  }
}

// Exportar funções de formatação de data do dateUtils
export {
  formatDateBR,
  formatDateTimeBR,
  formatDateLongBR,
  formatDateRelative,
  convertBRToISO,
  convertISOToBR
} from './dateUtils';

/**
 * Limpa número de telefone para WhatsApp
 * @param {string} phone - Número de telefone
 * @returns {string} Número limpo
 */
export function cleanPhoneNumberForWhatsApp(phone) {
  return phone.replace(/\D/g, '');
}

/**
 * Gera link do WhatsApp
 * @param {string} phoneNumber - Número de telefone
 * @param {string} message - Mensagem padrão
 * @returns {string} URL do WhatsApp
 */
export function generateWhatsAppLink(phoneNumber, message) {
  const cleanNumber = cleanPhoneNumberForWhatsApp(phoneNumber);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Trunca texto para exibição
 * @param {string} text - Texto a ser truncado
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} Texto truncado
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} Se o email é válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Gera ID único simples
 * @returns {string} ID único
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

