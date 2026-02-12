(function() {
    let allProjects = [];
    let lightboxInitialized = false;
    let lastFocusedElement = null;

    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initFAQAccordion();
        initBudgetCalculator();
        initDynamicProjects();
        initGalleryLightbox();
        initMap();
    });

    function initMobileMenu() {
        const toggleBtn = document.getElementById('menu-toggle');
        const nav = document.getElementById('main-nav');
        if (!toggleBtn || !nav) return;

        toggleBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            const isOpen = nav.classList.contains('active');
            toggleBtn.setAttribute('aria-expanded', isOpen);
        });

        // Fecha o menu ao clicar num link
        nav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function initFAQAccordion() {
        const faqContainer = document.getElementById('faq-container');
        if (!faqContainer) return;

        fetch('data/projetos.json')
            .then(response => response.json())
            .then(data => {
                if (data.faq && data.faq.length > 0) {
                    renderFAQ(data.faq, faqContainer);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar FAQ:', error);
                faqContainer.textContent = 'Erro ao carregar as perguntas frequentes.';
            });
    }

    function renderFAQ(faqData, container) {
        container.innerHTML = '';
        
        faqData.forEach((item, index) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            
            const questionDiv = document.createElement('div');
            questionDiv.className = 'faq-question';
            questionDiv.setAttribute('data-index', index);
            
            const questionSpan = document.createElement('span');
            questionSpan.textContent = item.pergunta;
            
            const icon = document.createElement('i');
            icon.className = 'bi bi-chevron-down faq-icon';
            
            questionDiv.appendChild(questionSpan);
            questionDiv.appendChild(icon);
            
            const answerDiv = document.createElement('div');
            answerDiv.className = 'faq-answer';
            
            const answerP = document.createElement('p');
            answerP.textContent = item.resposta;
            answerDiv.appendChild(answerP);
            
            faqItem.appendChild(questionDiv);
            faqItem.appendChild(answerDiv);
            container.appendChild(faqItem);
        });

        container.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.parentElement;
                const answer = faqItem.querySelector('.faq-answer');
                const icon = this.querySelector('.faq-icon');
                const isOpen = faqItem.classList.contains('active');

                container.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = '0';
                    item.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
                });

                if (!isOpen) {
                    faqItem.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }

    function initBudgetCalculator() {
        const calculatorForm = document.getElementById('budget-form');
        if (!calculatorForm) return;

        fetch('data/projetos.json')
            .then(response => response.json())
            .then(data => {
                if (data.servicos) {
                    populateServices(data.servicos);
                }
            })
            .catch(error => console.error('Erro ao carregar serviços:', error));

        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateBudget();
        });

        calculatorForm.addEventListener('change', calculateBudget);
    }

    function populateServices(servicos) {
        const servicesContainer = document.getElementById('services-checkboxes');
        if (!servicesContainer) return;

        servicesContainer.innerHTML = '';
        servicos.forEach((servico) => {
            const serviceDiv = document.createElement('div');
            serviceDiv.className = 'service-option';
            
            const label = document.createElement('label');
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = 'service';
            input.value = servico.preco;
            input.setAttribute('data-name', servico.nome);
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'service-name';
            nameSpan.textContent = servico.nome;
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'service-price';
            priceSpan.textContent = '€' + servico.preco;
            
            const descSmall = document.createElement('small');
            descSmall.className = 'service-desc';
            descSmall.textContent = servico.descricao;
            
            label.appendChild(input);
            label.appendChild(nameSpan);
            label.appendChild(priceSpan);
            label.appendChild(descSmall);
            serviceDiv.appendChild(label);
            servicesContainer.appendChild(serviceDiv);
        });
    }

    function calculateBudget() {
        const checkboxes = document.querySelectorAll('input[name="service"]:checked');
        const urgencySelect = document.getElementById('urgency');
        const pagesInput = document.getElementById('num-pages');
        const resultDiv = document.getElementById('budget-result');
        
        if (!resultDiv) return;

        let total = 0;
        const selectedServices = [];

        checkboxes.forEach(checkbox => {
            total += parseFloat(checkbox.value);
            selectedServices.push(checkbox.dataset.name);
        });

        if (urgencySelect) {
            const urgencyMultiplier = parseFloat(urgencySelect.value) || 1;
            total *= urgencyMultiplier;
        }

        if (pagesInput && pagesInput.value > 5) {
            const extraPages = parseInt(pagesInput.value) - 5;
            total += extraPages * 50;
        }

        resultDiv.innerHTML = '';
        
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'budget-summary';
        
        const title = document.createElement('h4');
        title.textContent = 'Resumo do Orçamento';
        summaryDiv.appendChild(title);
        
        if (selectedServices.length > 0) {
            const servicesLabel = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = 'Serviços selecionados:';
            servicesLabel.appendChild(strong);
            summaryDiv.appendChild(servicesLabel);
            
            const ul = document.createElement('ul');
            selectedServices.forEach(s => {
                const li = document.createElement('li');
                li.textContent = s;
                ul.appendChild(li);
            });
            summaryDiv.appendChild(ul);
        } else {
            const noServices = document.createElement('p');
            noServices.textContent = 'Nenhum serviço selecionado';
            summaryDiv.appendChild(noServices);
        }
        
        const totalDiv = document.createElement('div');
        totalDiv.className = 'budget-total';
        
        const totalStrong = document.createElement('strong');
        totalStrong.textContent = 'Total Estimado:';
        
        const totalValue = document.createElement('span');
        totalValue.className = 'total-value';
        totalValue.textContent = '€' + total.toFixed(2);
        
        totalDiv.appendChild(totalStrong);
        totalDiv.appendChild(totalValue);
        summaryDiv.appendChild(totalDiv);
        
        const note = document.createElement('p');
        note.className = 'budget-note';
        note.textContent = '*Este é um valor estimado. O orçamento final será definido após análise detalhada do projeto.';
        summaryDiv.appendChild(note);
        
        resultDiv.appendChild(summaryDiv);
    }

    function initDynamicProjects() {
        const projectsContainer = document.getElementById('projects-grid');
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        if (!projectsContainer) return;

        fetch('data/projetos.json')
            .then(response => response.json())
            .then(data => {
                if (data.projetos) {
                    allProjects = data.projetos;
                    renderProjects(data.projetos, projectsContainer);
                    initFilters(filterButtons, projectsContainer);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar projetos:', error);
                projectsContainer.textContent = 'Erro ao carregar os projetos.';
            });
    }

    function renderProjects(projects, container) {
        container.innerHTML = '';
        
        if (projects.length === 0) {
            const noProjects = document.createElement('p');
            noProjects.className = 'no-projects';
            noProjects.textContent = 'Nenhum projeto encontrado nesta categoria.';
            container.appendChild(noProjects);
            return;
        }

        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-category', project.categoria);
            projectCard.style.animationDelay = `${index * 0.1}s`;
            
            const projectImageDiv = document.createElement('div');
            projectImageDiv.className = 'project-image';
            
            const img = document.createElement('img');
            img.src = project.imagem;
            img.alt = project.titulo;
            img.loading = 'lazy';
            
            const overlayDiv = document.createElement('div');
            overlayDiv.className = 'project-overlay';
            
            const link = document.createElement('a');
            link.href = project.imagemFull;
            link.className = 'view-project';
            link.setAttribute('data-lightbox', 'projects');
            
            const eyeIcon = document.createElement('i');
            eyeIcon.className = 'bi bi-eye';
            link.appendChild(eyeIcon);
            link.appendChild(document.createTextNode(' Ver Projeto'));
            
            overlayDiv.appendChild(link);
            projectImageDiv.appendChild(img);
            projectImageDiv.appendChild(overlayDiv);
            
            const projectInfoDiv = document.createElement('div');
            projectInfoDiv.className = 'project-info';
            
            const h3 = document.createElement('h3');
            h3.textContent = project.titulo;
            
            const p = document.createElement('p');
            p.textContent = project.descricao;
            
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'project-tags';
            
            project.tecnologias.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.textContent = tech;
                tagsDiv.appendChild(tag);
            });
            
            projectInfoDiv.appendChild(h3);
            projectInfoDiv.appendChild(p);
            projectInfoDiv.appendChild(tagsDiv);
            
            projectCard.appendChild(projectImageDiv);
            projectCard.appendChild(projectInfoDiv);
            container.appendChild(projectCard);
        });

        initGalleryLightbox();
    }

    function initFilters(buttons, container) {
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filter = this.dataset.filter;
                let filteredProjects;

                if (filter === 'all') {
                    filteredProjects = allProjects;
                } else {
                    filteredProjects = allProjects.filter(p => p.categoria === filter);
                }

                container.style.opacity = '0';
                setTimeout(() => {
                    renderProjects(filteredProjects, container);
                    container.style.opacity = '1';
                }, 300);
            });
        });
    }

    function initGalleryLightbox() {
        // Só inicializa se houver projetos na página
        const projectsContainer = document.getElementById('projects-grid');
        if (!projectsContainer) return;
        
        let lightboxOverlay = document.getElementById('lightbox-overlay');
        
        if (!lightboxOverlay) {
            lightboxOverlay = document.createElement('div');
            lightboxOverlay.id = 'lightbox-overlay';
            lightboxOverlay.className = 'lightbox-overlay';
            lightboxOverlay.setAttribute('role', 'dialog');
            lightboxOverlay.setAttribute('aria-modal', 'true');
            lightboxOverlay.setAttribute('aria-label', 'Galeria de imagens');
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'lightbox-content';
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'lightbox-close';
            closeBtn.setAttribute('aria-label', 'Fechar galeria');
            closeBtn.textContent = '×';
            
            const prevBtn = document.createElement('button');
            prevBtn.className = 'lightbox-prev';
            prevBtn.setAttribute('aria-label', 'Imagem anterior');
            const prevIcon = document.createElement('i');
            prevIcon.className = 'bi bi-chevron-left';
            prevBtn.appendChild(prevIcon);
            
            const img = document.createElement('img');
            img.src = '';
            img.alt = '';
            img.className = 'lightbox-image';
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'lightbox-next';
            nextBtn.setAttribute('aria-label', 'Próxima imagem');
            const nextIcon = document.createElement('i');
            nextIcon.className = 'bi bi-chevron-right';
            nextBtn.appendChild(nextIcon);
            
            contentDiv.appendChild(closeBtn);
            contentDiv.appendChild(prevBtn);
            contentDiv.appendChild(img);
            contentDiv.appendChild(nextBtn);
            lightboxOverlay.appendChild(contentDiv);
            document.body.appendChild(lightboxOverlay);
        }

        const lightboxImage = lightboxOverlay.querySelector('.lightbox-image');
        const closeBtn = lightboxOverlay.querySelector('.lightbox-close');
        const prevBtn = lightboxOverlay.querySelector('.lightbox-prev');
        const nextBtn = lightboxOverlay.querySelector('.lightbox-next');
        
        let currentIndex = 0;
        let images = [];

        // Usa a variável projectsContainer já declarada no início da função
        if (projectsContainer) {
            projectsContainer.addEventListener('click', function(e) {
                const link = e.target.closest('[data-lightbox]');
                if (!link) return;
                
                e.preventDefault();
                lastFocusedElement = link;
                
                const allLinks = Array.from(document.querySelectorAll('[data-lightbox]'));
                images = allLinks.map(l => l.href);
                currentIndex = allLinks.indexOf(link);
                
                showImage(currentIndex);
                lightboxOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                closeBtn.focus();
            });
        }

        function showImage(index) {
            lightboxImage.src = images[index];
            prevBtn.style.display = index === 0 ? 'none' : 'block';
            nextBtn.style.display = index === images.length - 1 ? 'none' : 'block';
        }

        function closeLightbox() {
            lightboxOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (lastFocusedElement) {
                lastFocusedElement.focus();
                lastFocusedElement = null;
            }
        }

        if (!lightboxInitialized) {
            closeBtn.addEventListener('click', closeLightbox);
            
            lightboxOverlay.addEventListener('click', function(e) {
                if (e.target === lightboxOverlay) closeLightbox();
            });

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    showImage(currentIndex);
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentIndex < images.length - 1) {
                    currentIndex++;
                    showImage(currentIndex);
                }
            });

            document.addEventListener('keydown', function(e) {
                if (!lightboxOverlay.classList.contains('active')) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    currentIndex--;
                    showImage(currentIndex);
                }
                if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
                    currentIndex++;
                    showImage(currentIndex);
                }
            });
            
            lightboxInitialized = true;
        }
    }

    function initMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        // Limpa o container
        mapContainer.innerHTML = '';
        mapContainer.style.height = '400px';
        mapContainer.style.borderRadius = '10px';

        // Coordenadas de Lisboa
        const lisboaLat = 38.7222524;
        const lisboaLng = -9.1393366;

        // Inicializa o mapa
        const map = L.map('map').setView([lisboaLat, lisboaLng], 13);

        // Adiciona camada do OpenStreetMap (open source)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Adiciona marcador em Lisboa
        const marker = L.marker([lisboaLat, lisboaLng]).addTo(map);
        marker.bindPopup('<b>Luiz Antonio</b><br>Estudante de Desenvolvimento Web<br>Lisboa, Portugal').openPopup();

        // Adiciona informações abaixo do mapa
        const infoDiv = document.createElement('div');
        infoDiv.className = 'map-info';
        infoDiv.style.marginTop = '15px';
        infoDiv.style.padding = '15px';
        infoDiv.style.backgroundColor = '#f8f9fa';
        infoDiv.style.borderRadius = '8px';

        infoDiv.innerHTML = `
            <p style="margin: 5px 0;"><i class="bi bi-geo-alt" style="color: #e74c3c;"></i> <strong>Lisboa, Portugal</strong></p>
            <p style="margin: 5px 0;"><i class="bi bi-clock" style="color: #3498db;"></i> Seg - Sex: 9h - 18h</p>
            <p style="margin: 5px 0;"><i class="bi bi-envelope" style="color: #27ae60;"></i> luizantonio@email.com</p>
        `;

        mapContainer.parentNode.insertBefore(infoDiv, mapContainer.nextSibling);
    }
})();
