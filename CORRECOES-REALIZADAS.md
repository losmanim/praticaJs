# 📝 Correções e Melhorias do Projeto Portfólio Pessoal

Este documento descreve todas as correções e melhorias realizadas no projeto de portfólio pessoal, organizado de forma didática.

---

## 📋 Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Correções em HTML](#2-correções-em-html)
3. [Correções em CSS](#3-correções-em-css)
4. [Correções em JavaScript](#4-correções-em-javascript)
5. [Melhorias de Acessibilidade](#5-melhorias-de-acessibilidade)
6. [Boas Práticas Aplicadas](#6-boas-práticas-aplicadas)

---

## 1. Visão Geral do Projeto

### Estrutura de Arquivos
```
prática/
├── index.html          # Página principal
├── contatos.html       # Página de contatos
├── projetos.html       # Página de projetos
├── css/
│   ├── style.css       # Estilos principais
│   ├── contatos.css    # Estilos da página de contatos
│   └── projetos.css    # Estilos da página de projetos
├── javascript/
│   ├── script.js       # JavaScript principal (FAQ, calculadora, lightbox)
│   └── contatos.js     # Validação do formulário de contato
├── data/
│   └── projetos.json   # Dados dos projetos, serviços e FAQ
└── imagens/            # Imagens do site
```

---

## 2. Correções em HTML

### 2.1 Padronização de Identidade
**Problema:** O nome alternava entre "Jane Doe" e "João de Deus" em diferentes partes do site.

**Solução:** Padronizado para "João de Deus" em todos os arquivos:
- `<title>` de todas as páginas
- `<meta name="description">`
- `<meta name="author">`
- Atributos `alt` das imagens do logo
- Texto do footer (copyright)

### 2.2 Correção de Links Quebrados
**Problema:** Link para "Home" apontava para `index01.html` (arquivo inexistente).

**Correção:**
```html
<!-- ANTES (errado) -->
<a href="index01.html">Home</a>

<!-- DEPOIS (correto) -->
<a href="index.html">Home</a>
```

### 2.3 Correção de IDs com Espaços
**Problema:** ID com espaço é inválido em HTML5.

**Correção:**
```html
<!-- ANTES (inválido) -->
<img id="desenvolvedor web" src="...">

<!-- DEPOIS (válido) -->
<img id="desenvolvedor-web" src="...">
```

### 2.4 Hierarquia de Headings
**Problema:** Página não tinha `<h1>`, começava direto com `<h2>`.

**Solução:** Adicionado `<h1>` como título principal de cada página.

### 2.5 Correção de Tags Mal Fechadas no Footer
**Problema:** Tags `</a>` e `</i>` estavam na ordem errada.

**Correção:**
```html
<!-- ANTES (errado) -->
<a href="#"><i class="bi bi-envelope"></a></i>

<!-- DEPOIS (correto) -->
<a href="#" aria-label="E-mail"><i class="bi bi-envelope"></i></a>
```

### 2.6 Estrutura do Dropdown
**Problema:** Link `<a>` estava incorretamente dentro do ícone `<i>`.

**Correção:**
```html
<!-- ANTES (errado) -->
<button class="btn-projetos">
    <i class="bi bi-chevron-double-down">
        <a href="projetos.html">Projetos</a>
    </i>
</button>

<!-- DEPOIS (correto) -->
<button class="btn-projetos">
    <a href="projetos.html">Projetos</a>
    <i class="bi bi-chevron-double-down"></i>
</button>
```

### 2.7 Âncoras que Apontavam para IDs Inexistentes
**Problema:** Links internos apontavam para `#sobre`, `#servicos`, `#projetos` que não existiam.

**Solução:** 
- Criados os IDs correspondentes nas sections
- `id="servicos"` adicionado à section de serviços
- `id="projetos"` adicionado à section de projetos

### 2.8 Atributo `readonly` no Textarea
**Problema:** O textarea tinha `readonly` que impedia digitação.

**Correção:** Removido o atributo `readonly`:
```html
<!-- ANTES -->
<textarea readonly placeholder="Comece a digitar"></textarea>

<!-- DEPOIS -->
<textarea placeholder="Comece a digitar"></textarea>
```

### 2.9 Atributo `lang` Inconsistente
**Problema:** `contatos.html` usava `lang="pt"` enquanto outras usavam `lang="pt-BR"`.

**Correção:** Padronizado para `lang="pt-BR"` em todas as páginas.

### 2.10 Caminho CSS Incorreto
**Problema:** `contatos.html` usava `/css/contatos.css` (caminho absoluto).

**Correção:** Alterado para caminho relativo:
```html
<!-- ANTES -->
<link rel="stylesheet" href="/css/contatos.css">

<!-- DEPOIS -->
<link rel="stylesheet" href="css/contatos.css">
```

### 2.11 Links Externos sem Segurança
**Problema:** Links com `target="_blank"` sem `rel="noopener noreferrer"`.

**Correção:**
```html
<!-- ANTES -->
<a href="https://instagram.com" target="_blank">Instagram</a>

<!-- DEPOIS -->
<a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
```

### 2.12 Botão de Submit no Formulário de Orçamento
**Problema:** O formulário de orçamento não tinha botão de submit.

**Correção:** Adicionado botão:
```html
<button type="submit" class="cta">Calcular Orçamento</button>
```

---

## 3. Correções em CSS

### 3.1 Propriedades CSS Inválidas

#### `justify-content: justify`
```css
/* ANTES (inválido) */
justify-content: justify;

/* DEPOIS (válido) */
justify-content: space-between;
```

#### `padding: 0 auto`
```css
/* ANTES (inválido - auto não funciona em padding) */
padding: 0 auto;

/* DEPOIS (válido) */
padding: 0;
```

#### `box-shadow` sem cor
```css
/* ANTES (falta a cor) */
box-shadow: 1px 1px 1px 1px;

/* DEPOIS (com cor) */
box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
```

#### `box-shadow: inset` com sintaxe errada
```css
/* ANTES (sintaxe incorreta) */
box-shadow: inset 3px red;

/* DEPOIS (sintaxe correta) */
box-shadow: inset 0 0 3px red;
```

### 3.2 Seletor com Typo
```css
/* ANTES (typo: "min" em vez de "mim") */
#sobre-min h3 { ... }

/* DEPOIS (corrigido) */
#sobre-mim h3 { ... }
```

### 3.3 Grid Custom Conflitando com Bootstrap
**Problema:** O projeto definia `.col-1` a `.col-12` manualmente, conflitando com Bootstrap.

**Solução:** Comentado o grid customizado para usar apenas Bootstrap:
```css
/* Grid customizado comentado - conflita com Bootstrap
.col-1, .col-2, ... { width: 100%; }
.col-1 { width: 8.33%; }
...
*/
```

### 3.4 Uso Incorreto de `var()`
```css
/* ANTES (sintaxe errada) */
.cor01 { color: var(#462255); }

/* DEPOIS (correto - usar valor direto ou CSS custom properties) */
.cor01 { color: #462255; }

/* OU usar custom properties corretamente: */
:root { --cor01: #462255; }
.cor01 { color: var(--cor01); }
```

### 3.5 `display: contents` no Header
**Problema:** `display: contents` pode causar problemas de acessibilidade.

**Correção:**
```css
/* ANTES */
header { display: contents; }

/* DEPOIS */
header { display: flex; }
```

### 3.6 Typo em Nome de Classe
```css
/* ANTES (typo) */
.com-9 { ... }

/* DEPOIS (corrigido) */
.col-9 { ... }
```

---

## 4. Correções em JavaScript

### 4.1 Encapsulamento com IIFE
**Problema:** Variável `window.allProjects` poluía o escopo global.

**Solução:** Todo o código encapsulado em uma IIFE:
```javascript
// ANTES
window.allProjects = [];

// DEPOIS
(function() {
    let allProjects = [];
    // ... resto do código
})();
```

### 4.2 Prevenção de Listeners Duplicados
**Problema:** `initGalleryLightbox()` era chamada várias vezes, criando listeners duplicados.

**Solução:** Flag para controlar inicialização:
```javascript
let lightboxInitialized = false;

function initGalleryLightbox() {
    // ... setup do lightbox
    
    if (!lightboxInitialized) {
        closeBtn.addEventListener('click', closeLightbox);
        // ... outros listeners
        lightboxInitialized = true;
    }
}
```

### 4.3 Uso de `textContent` ao Invés de `innerHTML`
**Problema:** Uso de `innerHTML` com dados externos é vulnerável a XSS.

**Solução:** Criar elementos DOM manualmente:
```javascript
// ANTES (vulnerável a XSS)
container.innerHTML = `<p>${item.resposta}</p>`;

// DEPOIS (seguro)
const p = document.createElement('p');
p.textContent = item.resposta;
container.appendChild(p);
```

### 4.4 Delegação de Eventos no Lightbox
**Problema:** Índice da imagem era calculado incorretamente após re-renderização.

**Solução:** Event delegation com cálculo dinâmico:
```javascript
projectsContainer.addEventListener('click', function(e) {
    const link = e.target.closest('[data-lightbox]');
    if (!link) return;
    
    const allLinks = Array.from(document.querySelectorAll('[data-lightbox]'));
    currentIndex = allLinks.indexOf(link);
    // ...
});
```

### 4.5 Código do `readonly` Removido
**Problema:** Código desnecessário que removia `readonly` do textarea.

**Solução:** Removido já que o atributo foi retirado do HTML.

### 4.6 Documentação Didática
Adicionados comentários explicativos em `contatos.js` para fins educacionais.

---

## 5. Melhorias de Acessibilidade

### 5.1 Atributos `aria-label` em Ícones
```html
<a href="#" aria-label="E-mail"><i class="bi bi-envelope"></i></a>
<a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
```

### 5.2 Lightbox Acessível
```javascript
lightboxOverlay.setAttribute('role', 'dialog');
lightboxOverlay.setAttribute('aria-modal', 'true');
lightboxOverlay.setAttribute('aria-label', 'Galeria de imagens');

closeBtn.setAttribute('aria-label', 'Fechar galeria');
prevBtn.setAttribute('aria-label', 'Imagem anterior');
nextBtn.setAttribute('aria-label', 'Próxima imagem');
```

### 5.3 Gerenciamento de Foco
```javascript
// Ao abrir lightbox, foco vai para botão fechar
closeBtn.focus();

// Ao fechar, foco retorna ao elemento que abriu
if (lastFocusedElement) {
    lastFocusedElement.focus();
}
```

### 5.4 Atributo `title` no iframe do Mapa
```javascript
iframe.title = 'Mapa de localização em Lisboa';
```

---

## 6. Boas Práticas Aplicadas

### 6.1 Estrutura HTML Semântica
- `<header>` para o cabeçalho
- `<nav>` para navegação
- `<main>` para conteúdo principal
- `<section>` para seções temáticas
- `<footer>` para rodapé
- Hierarquia correta de headings (h1 → h2 → h3)

### 6.2 CSS Organizado
- Reset CSS no início
- Agrupamento lógico de estilos
- Uso de custom properties para cores
- Media queries para responsividade

### 6.3 JavaScript Moderno
- Encapsulamento com IIFE
- Event delegation quando apropriado
- Criação segura de elementos DOM
- Comentários documentando funções

### 6.4 Segurança
- `rel="noopener noreferrer"` em links externos
- Evitar `innerHTML` com dados externos
- Validação client-side no formulário

### 6.5 Performance
- `loading="lazy"` em imagens
- Carregamento assíncrono de dados JSON
- Animações suaves com CSS

---

## 📚 Referências para Estudo

1. **HTML Semântico:** [MDN - HTML elements reference](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element)
2. **CSS Flexbox:** [CSS-Tricks - A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
3. **CSS Grid:** [CSS-Tricks - A Complete Guide to CSS Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
4. **JavaScript ES6+:** [MDN - JavaScript Guide](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide)
5. **Acessibilidade Web:** [W3C - Web Accessibility Initiative](https://www.w3.org/WAI/)
6. **Bootstrap 5:** [Documentação Oficial](https://getbootstrap.com/docs/5.3/)

---

*Documento gerado como parte do curso "Avançado em Desenho e Programação de Websites" - Módulo 5: JavaScript/Ajax*
