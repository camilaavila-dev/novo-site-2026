/**
 * HTML/CSS STATIC DOM PARSER & AUDIT HELPERS
 * Leonardo Arruda 2026+ E2E Testing Track
 */

/**
 * Extrai todos os blocos de JSON-LD de um arquivo HTML
 */
function extractJsonLd(html) {
  const regex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      blocks.push(parsed);
    } catch (err) {
      blocks.push({ error: err.message, raw: match[1] });
    }
  }
  return blocks;
}

/**
 * Extrai todas as variáveis CSS definidas em :root
 */
function extractCssVariables(cssText) {
  const rootRegex = /:root\s*\{([\s\S]*?)\}/gi;
  const vars = {};
  let rootMatch;
  while ((rootMatch = rootRegex.exec(cssText)) !== null) {
    const declarations = rootMatch[1].split(';');
    for (const decl of declarations) {
      const parts = decl.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        if (key.startsWith('--')) {
          vars[key] = val;
        }
      }
    }
  }
  return vars;
}

/**
 * Validação da regra de espaço antes de <br>
 * Regra do Workspace: Ao utilizar tags <br> em textos que podem ter seu display
 * alterado para none no celular (ex: h1 br, h2 br), sempre insira um espaço antes da tag.
 * Exemplo inválido: <h2>Quatro pilares.<br>Um patrimônio</h2>
 * Exemplo válido: <h2>Quatro pilares. <br>Um patrimônio</h2>
 */
function auditSpaceBeforeBr(htmlContent) {
  // Extrai títulos h1, h2, h3 onde o CSS mobile aplica display: none nas tags <br>
  const headingRegex = /<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  const violations = [];
  let headingMatch;

  while ((headingMatch = headingRegex.exec(htmlContent)) !== null) {
    const level = headingMatch[1];
    const innerHtml = headingMatch[2];
    const badBrRegex = /([^\s>])<br\s*\/?>/gi;
    let match;

    while ((match = badBrRegex.exec(innerHtml)) !== null) {
      const charBefore = match[1];
      const startIdx = Math.max(0, match.index - 25);
      const endIdx = Math.min(innerHtml.length, match.index + 35);
      violations.push({
        level: `h${level}`,
        index: match.index,
        charBefore,
        snippet: innerHtml.substring(startIdx, endIdx).replace(/\s+/g, ' ').trim()
      });
    }
  }

  return {
    isValid: violations.length === 0,
    violationCount: violations.length,
    violations
  };
}

/**
 * Extrai todos os links <a href="..."> de um documento HTML
 */
function extractLinks(html) {
  const linkRegex = /<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    links.push({
      href: match[1],
      text: match[2].replace(/<[^>]*>/g, '').trim(),
      rawTag: match[0]
    });
  }
  return links;
}

/**
 * Extrai todas as imagens e verifica se há uso de filtros SVG proibidos
 * (feColorMatrix / feComponentTransfer aplicados a tags <img> ou logotipos para tentar limpar fundos)
 */
function auditImageTransparency(html) {
  // Isola texturas de fundo analógicas (background-image: url("data:image/svg+xml..."))
  const sanitized = html.replace(/background-image:\s*url\([^)]+\)/gi, '');

  // Procura feColorMatrix ou feComponentTransfer aplicados diretamente no HTML ou em filtros de imagem
  const forbiddenFilters = /feColorMatrix|feComponentTransfer/gi;
  const hasForbiddenFilter = forbiddenFilters.test(sanitized);

  const imgRegex = /<img\b[^>]*src=["']([^"']*)["'][^>]*>/gi;
  const images = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    images.push(match[1]);
  }

  return {
    hasForbiddenFilter,
    images
  };
}

function hasElementWithId(html, id) {
  const regex = new RegExp(`id=["']${id}["']`, 'i');
  return regex.test(html);
}

function hasElementWithClass(html, className) {
  const regex = new RegExp(`class=["'][^"']*\\b${className}\\b[^"']*["']`, 'i');
  return regex.test(html);
}

function extractSectionHeadings(html) {
  const headingRegex = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      raw: match[2],
      cleanText: match[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    });
  }
  return headings;
}

module.exports = {
  extractJsonLd,
  extractCssVariables,
  auditSpaceBeforeBr,
  extractLinks,
  auditImageTransparency,
  hasElementWithId,
  hasElementWithClass,
  extractSectionHeadings
};
