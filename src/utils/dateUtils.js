import { format, parseISO, isValid } from "date-fns";
import { pt } from "date-fns/locale";

/**
 * Formatar data para o padrão brasileiro dd/mm/yyyy
 * @param {string|Date} date - Data para formatar
 * @returns {string} Data formatada em dd/mm/yyyy
 */
export const formatDateBR = (date) => {
  if (!date) return '';
  
  try {
    let dateObj;
    
    if (typeof date === 'string') {
      // Se for string, tentar fazer parse
      dateObj = parseISO(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '';
    }
    
    // Verificar se a data é válida
    if (!isValid(dateObj)) {
      return '';
    }
    
    return format(dateObj, 'dd/MM/yyyy', { locale: pt });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return '';
  }
};

/**
 * Formatar data e hora para o padrão brasileiro dd/mm/yyyy HH:mm
 * @param {string|Date} date - Data para formatar
 * @returns {string} Data formatada em dd/mm/yyyy HH:mm
 */
export const formatDateTimeBR = (date) => {
  if (!date) return '';
  
  try {
    let dateObj;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '';
    }
    
    if (!isValid(dateObj)) {
      return '';
    }
    
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: pt });
  } catch (error) {
    console.error('Erro ao formatar data e hora:', error);
    return '';
  }
};

/**
 * Formatar data para exibição mais amigável (ex: "15 de janeiro de 2024")
 * @param {string|Date} date - Data para formatar
 * @returns {string} Data formatada por extenso
 */
export const formatDateLongBR = (date) => {
  if (!date) return '';
  
  try {
    let dateObj;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '';
    }
    
    if (!isValid(dateObj)) {
      return '';
    }
    
    return format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: pt });
  } catch (error) {
    console.error('Erro ao formatar data por extenso:', error);
    return '';
  }
};

/**
 * Formatar data relativa (ex: "há 2 dias", "ontem", "hoje")
 * @param {string|Date} date - Data para formatar
 * @returns {string} Data formatada de forma relativa
 */
export const formatDateRelative = (date) => {
  if (!date) return '';
  
  try {
    let dateObj;
    
    if (typeof date === 'string') {
      dateObj = parseISO(date);
    } else if (date instanceof Date) {
      dateObj = date;
    } else {
      return '';
    }
    
    if (!isValid(dateObj)) {
      return '';
    }
    
    const now = new Date();
    const diffInDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Hoje';
    } else if (diffInDays === 1) {
      return 'Ontem';
    } else if (diffInDays < 7) {
      return `Há ${diffInDays} dias`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? 'Há 1 semana' : `Há ${weeks} semanas`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return months === 1 ? 'Há 1 mês' : `Há ${months} meses`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return years === 1 ? 'Há 1 ano' : `Há ${years} anos`;
    }
  } catch (error) {
    console.error('Erro ao formatar data relativa:', error);
    return '';
  }
};

/**
 * Converter data do formato brasileiro dd/mm/yyyy para ISO (yyyy-mm-dd)
 * @param {string} dateBR - Data no formato dd/mm/yyyy
 * @returns {string} Data no formato ISO yyyy-mm-dd
 */
export const convertBRToISO = (dateBR) => {
  if (!dateBR) return '';
  
  try {
    const parts = dateBR.split('/');
    if (parts.length !== 3) return '';
    
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } catch (error) {
    console.error('Erro ao converter data BR para ISO:', error);
    return '';
  }
};

/**
 * Converter data do formato ISO (yyyy-mm-dd) para brasileiro dd/mm/yyyy
 * @param {string} dateISO - Data no formato yyyy-mm-dd
 * @returns {string} Data no formato dd/mm/yyyy
 */
export const convertISOToBR = (dateISO) => {
  if (!dateISO) return '';
  
  try {
    const date = parseISO(dateISO);
    if (!isValid(date)) return '';
    
    return formatDateBR(date);
  } catch (error) {
    console.error('Erro ao converter data ISO para BR:', error);
    return '';
  }
};

