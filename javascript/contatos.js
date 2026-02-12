/**
 * contatos.js - Script de Validação do Formulário de Contato
 * 
 * Este script implementa validação client-side para o formulário de contato,
 * proporcionando feedback visual imediato ao usuário.
 * 
 * Funcionalidades:
 * - Validação em tempo real (blur e input)
 * - Feedback visual com cores (verde = válido, vermelho = erro)
 * - Mensagens de erro personalizadas
 * - Mensagem de sucesso após envio
 * 
 * Estrutura HTML esperada:
 * - Os inputs devem estar dentro de um elemento container (form)
 * - Cada input é seguido pelo seu label, permitindo inserção de erros após o input
 * - IDs esperados: name, telefone, email, message, contactForm
 */

// Aguarda o DOM estar completamente carregado antes de executar o código
// Isso garante que todos os elementos HTML estejam disponíveis para manipulação
document.addEventListener('DOMContentLoaded', function() {
    
    // Obtém referência ao formulário de contato
    const form = document.getElementById('contactForm');
    
    // Verifica se o formulário existe na página antes de continuar
    // Isso evita erros em páginas que não têm o formulário
    if (form) {
        
        // === SELEÇÃO DE ELEMENTOS ===
        // Obtém referências a todos os campos do formulário
        const nameInput = document.getElementById('name');
        const telefoneInput = document.getElementById('telefone');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // === FUNÇÕES UTILITÁRIAS PARA MENSAGENS DE ERRO ===
        
        /**
         * Cria um elemento span para exibir mensagem de erro
         * @param {string} message - Texto da mensagem de erro
         * @returns {HTMLElement} - Elemento span configurado
         */
        function createErrorElement(message) {
            const error = document.createElement('span');
            error.className = 'error-message';
            error.textContent = message;
            // Estilos inline para garantir consistência visual
            error.style.cssText = 'color: #e74c3c; font-size: 14px; display: block; margin-top: 5px;';
            return error;
        }

        /**
         * Remove mensagem de erro existente de um campo
         * @param {HTMLElement} input - Campo de input
         * 
         * NOTA: Esta função usa parentNode para localizar o container do input.
         * Se a estrutura HTML mudar para usar containers .form-field,
         * substitua: input.parentNode por input.closest('.form-field')
         */
        function removeError(input) {
            const existingError = input.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            // Remove a borda de erro/sucesso
            input.style.borderColor = '';
        }

        /**
         * Exibe mensagem de erro para um campo
         * @param {HTMLElement} input - Campo de input
         * @param {string} message - Mensagem de erro a exibir
         * 
         * NOTA: Usa parentNode.insertBefore para inserir o erro após o input.
         * Se usar containers .form-field, considere usar:
         * input.closest('.form-field').appendChild(error)
         */
        function showError(input, message) {
            // Remove erro anterior antes de mostrar novo
            removeError(input);
            // Aplica borda vermelha para indicar erro
            input.style.borderColor = '#e74c3c';
            const error = createErrorElement(message);
            // Insere a mensagem de erro logo após o input
            input.parentNode.insertBefore(error, input.nextSibling);
        }

        /**
         * Exibe indicação visual de campo válido
         * @param {HTMLElement} input - Campo de input
         */
        function showSuccess(input) {
            removeError(input);
            // Aplica borda verde para indicar sucesso
            input.style.borderColor = '#27ae60';
        }

        // === FUNÇÕES DE VALIDAÇÃO ===
        // Cada função retorna null se válido, ou uma mensagem de erro se inválido
        
        /**
         * Valida o campo nome
         * Regras: obrigatório, mínimo 3 caracteres, apenas letras e espaços
         */
        function validateName(value) {
            if (!value.trim()) {
                return 'O nome é obrigatório';
            }
            if (value.trim().length < 3) {
                return 'O nome deve ter pelo menos 3 caracteres';
            }
            // Regex: permite letras (incluindo acentuadas) e espaços
            if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
                return 'O nome deve conter apenas letras';
            }
            return null; // Válido
        }

        /**
         * Valida o campo telefone
         * Regras: obrigatório, formato numérico (9-15 dígitos)
         */
        function validatePhone(value) {
            if (!value.trim()) {
                return 'O telefone é obrigatório';
            }
            // Remove caracteres de formatação para validar apenas números
            const phoneClean = value.replace(/[\s\-\(\)]/g, '');
            // Aceita números com código do país (+) e entre 9-15 dígitos
            if (!/^\+?[0-9]{9,15}$/.test(phoneClean)) {
                return 'Insira um número de telefone válido';
            }
            return null;
        }

        /**
         * Valida o campo e-mail
         * Regras: obrigatório, formato de e-mail válido
         */
        function validateEmail(value) {
            if (!value.trim()) {
                return 'O e-mail é obrigatório';
            }
            // Regex básica para validação de e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Insira um e-mail válido';
            }
            return null;
        }

        /**
         * Valida o campo mensagem
         * Regras: obrigatório, mínimo 10 caracteres
         */
        function validateMessage(value) {
            if (!value.trim()) {
                return 'A mensagem é obrigatória';
            }
            if (value.trim().length < 10) {
                return 'A mensagem deve ter pelo menos 10 caracteres';
            }
            return null;
        }

        /**
         * Função genérica que aplica validação a um input
         * @param {HTMLElement} input - Campo a validar
         * @param {Function} validator - Função de validação a aplicar
         * @returns {boolean} - true se válido, false se inválido
         */
        function validateInput(input, validator) {
            const error = validator(input.value);
            if (error) {
                showError(input, error);
                return false;
            } else {
                showSuccess(input);
                return true;
            }
        }

        // === CONFIGURAÇÃO DE EVENT LISTENERS ===
        // Adiciona validação em tempo real para cada campo
        
        // Validação do campo Nome
        if (nameInput) {
            // blur: valida quando o usuário sai do campo
            nameInput.addEventListener('blur', () => validateInput(nameInput, validateName));
            // input: revalida enquanto digita (apenas se já tem erro)
            nameInput.addEventListener('input', () => {
                if (nameInput.parentNode.querySelector('.error-message')) {
                    validateInput(nameInput, validateName);
                }
            });
        }

        // Validação do campo Telefone
        if (telefoneInput) {
            telefoneInput.addEventListener('blur', () => validateInput(telefoneInput, validatePhone));
            telefoneInput.addEventListener('input', () => {
                if (telefoneInput.parentNode.querySelector('.error-message')) {
                    validateInput(telefoneInput, validatePhone);
                }
            });
        }

        // Validação do campo E-mail
        if (emailInput) {
            emailInput.addEventListener('blur', () => validateInput(emailInput, validateEmail));
            emailInput.addEventListener('input', () => {
                if (emailInput.parentNode.querySelector('.error-message')) {
                    validateInput(emailInput, validateEmail);
                }
            });
        }

        // Validação do campo Mensagem
        if (messageInput) {
            messageInput.addEventListener('blur', () => validateInput(messageInput, validateMessage));
            messageInput.addEventListener('input', () => {
                if (messageInput.parentNode.querySelector('.error-message')) {
                    validateInput(messageInput, validateMessage);
                }
            });
        }

        // === SUBMISSÃO DO FORMULÁRIO ===
        form.addEventListener('submit', function(e) {
            // Previne o envio padrão do formulário para validar primeiro
            e.preventDefault();
            
            // Flag para rastrear se todos os campos são válidos
            let isValid = true;
            
            // Valida todos os campos
            if (nameInput && !validateInput(nameInput, validateName)) isValid = false;
            if (telefoneInput && !validateInput(telefoneInput, validatePhone)) isValid = false;
            if (emailInput && !validateInput(emailInput, validateEmail)) isValid = false;
            if (messageInput && !validateInput(messageInput, validateMessage)) isValid = false;
            
            // Se todos os campos são válidos, processa o formulário
            if (isValid) {
                // Coleta os dados do formulário em um objeto
                const formData = {
                    nome: nameInput.value,
                    telefone: telefoneInput.value,
                    email: emailInput.value,
                    mensagem: messageInput.value
                };
                
                // Log para debug - em produção, enviaria para um servidor
                console.log('Dados do formulário:', formData);
                
                // Exibe mensagem de sucesso
                showSuccessMessage();
                
                // Limpa o formulário
                form.reset();
                
                // Remove as bordas de validação de todos os campos
                [nameInput, telefoneInput, emailInput, messageInput].forEach(input => {
                    if (input) input.style.borderColor = '';
                });
            }
        });

        /**
         * Exibe mensagem de sucesso após envio do formulário
         * A mensagem desaparece automaticamente após 5 segundos
         */
        function showSuccessMessage() {
            // Remove mensagem de sucesso anterior se existir
            const existingMessage = document.querySelector('.success-message');
            if (existingMessage) existingMessage.remove();
            
            // Cria e configura o elemento da mensagem
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.innerHTML = `
                <div style="
                    background-color: #27ae60;
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                    margin-top: 20px;
                    animation: fadeIn 0.5s ease;
                ">
                    <i class="bi bi-check-circle" style="font-size: 40px; display: block; margin-bottom: 10px;"></i>
                    <h3 style="margin: 0 0 10px 0;">Mensagem enviada com sucesso!</h3>
                    <p style="margin: 0;">Entrarei em contacto em breve.</p>
                </div>
            `;
            
            // Adiciona a mensagem após o formulário
            form.parentNode.appendChild(successDiv);
            
            // Remove a mensagem após 5 segundos com fade out
            setTimeout(() => {
                successDiv.style.opacity = '0';
                successDiv.style.transition = 'opacity 0.5s ease';
                setTimeout(() => successDiv.remove(), 500);
            }, 5000);
        }
    }
});
