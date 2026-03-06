Bases de dados MySQL  - Criação de base de dados e inserção de dados em tabelas a serem visualizadas numa página de administrador

Criação de views personalizadas para apresentação de informações específicas

# Guia Completo: MySQL e Views Personalizadas

## 1. Bases de Dados MySQL - Criação e Inserção de Dados

### Passo 1: Conexão ao MySQL
```bash
# Conectar via terminal
mysql -u root -p

# Ou via phpMyAdmin (interface web)
http://localhost/phpmyadmin
```
## 2. Criação de Views Personalizadas

### O que são Views?
Views são tabelas virtuais baseadas em consultas SQL que simplificam o acesso aos dados e garantem segurança.

### Passo 1: Criar Views Úteis

#### View 1: Resumo de Projetos por Cliente
```sql
CREATE VIEW vw_resumo_projetos_cliente AS
SELECT 
    u.id as cliente_id,
    u.nome as cliente_nome,
    u.email as cliente_email,
    COUNT(p.id) as total_projetos,
    SUM(p.orcamento) as valor_total,
    AVG(p.orcamento) as valor_medio,
    COUNT(CASE WHEN p.status = 'concluido' THEN 1 END) as projetos_concluidos,
    COUNT(CASE WHEN p.status = 'em_progresso' THEN 1 END) as projetos_ativos
FROM utilizadores u
LEFT JOIN projetos p ON u.id = p.cliente_id
WHERE u.perfil = 'utilizador'
GROUP BY u.id, u.nome, u.email;
```

#### View 2: Dashboard de Tarefas
```sql
CREATE VIEW vw_dashboard_tarefas AS
SELECT 
    p.nome as projeto_nome,
    t.titulo as tarefa_titulo,
    u.nome as responsavel_nome,
    t.prioridade,
    t.status as tarefa_status,
    t.data_vencimento,
    DATEDIFF(t.data_vencimento, CURDATE()) as dias_para_vencimento,
    CASE 
        WHEN DATEDIFF(t.data_vencimento, CURDATE()) < 0 THEN 'Atrasada'
        WHEN DATEDIFF(t.data_vencimento, CURDATE()) <= 3 THEN 'Urgente'
        ELSE 'Normal'
    END as urgencia
FROM tarefas t
JOIN projetos p ON t.projeto_id = p.id
JOIN utilizadores u ON t.responsavel_id = u.id
WHERE t.status != 'concluida';
```

#### View 3: Produtividade por Utilizador
```sql
CREATE VIEW vw_produtividade_utilizador AS
SELECT 
    u.id,
    u.nome,
    COUNT(t.id) as total_tarefas,
    COUNT(CASE WHEN t.status = 'concluida' THEN 1 END) as tarefas_concluidas,
    ROUND(
        (COUNT(CASE WHEN t.status = 'concluida' THEN 1 END) * 100.0) / 
        NULLIF(COUNT(t.id), 0), 
        2
    ) as taxa_conclusao,
    COUNT(CASE WHEN t.status = 'em_progresso' THEN 1 END) as tarefas_em_progresso,
    COUNT(CASE WHEN t.prioridade = 'alta' AND t.status != 'concluida' THEN 1 END) as tarefas_urgentes
FROM utilizadores u
LEFT JOIN tarefas t ON u.id = t.responsavel_id
WHERE u.perfil = 'utilizador'
GROUP BY u.id, u.nome;
```

#### View 4: Relatório Financeiro
```sql
CREATE VIEW vw_relatorio_financeiro AS
SELECT 
    MONTH(p.data_inicio) as mes,
    YEAR(p.data_inicio) as ano,
    COUNT(p.id) as numero_projetos,
    SUM(p.orcamento) as valor_orcado,
    SUM(CASE WHEN p.status = 'concluido' THEN p.orcamento ELSE 0 END) as valor_faturado,
    ROUND(
        (SUM(CASE WHEN p.status = 'concluido' THEN p.orcamento ELSE 0 END) * 100.0) / 
        NULLIF(SUM(p.orcamento), 0), 
        2
    ) as taxa_realizacao
FROM projetos p
WHERE p.data_inicio >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY YEAR(p.data_inicio), MONTH(p.data_inicio)
ORDER BY ano DESC, mes DESC;
```

### Passo 2: Utilizar Views na Aplicação

#### Página de Relatórios com Views
```php
<?php
// relatorios.php
require_once 'config.php';

// Buscar dados das views
$resumo_clientes = $conn->query("SELECT * FROM vw_resumo_projetos_cliente ORDER BY valor_total DESC");
$dashboard_tarefas = $conn->query("SELECT * FROM vw_dashboard_tarefas WHERE urgencia = 'Urgente'");
$produtividade = $conn->query("SELECT * FROM vw_produtividade_utilizador ORDER BY taxa_conclusao DESC");
$financeiro = $conn->query("SELECT * FROM vw_relatorio_financeiro LIMIT 6");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Relatórios - Views Personalizadas</title>
    <style>
        .relatorio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 20px 0; }
        .relatorio-section { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .progress-bar { width: 100%; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #28a745, #20c997); transition: width 0.3s; }
        .urgente { color: #dc3545; font-weight: bold; }
        .metric { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    </style>
</head>
<body>
    <h1>Relatórios e Análises</h1>
    
    <div class="relatorio-grid">
        <!-- Clientes mais valiosos -->
        <div class="relatorio-section">
            <h2>Top Clientes</h2>
            <?php while ($cliente = $resumo_clientes->fetch_assoc()): ?>
            <div class="metric">
                <span><?php echo $cliente['cliente_nome']; ?></span>
                <span>€<?php echo number_format($cliente['valor_total'], 2); ?></span>
            </div>
            <?php endwhile; ?>
        </div>

        <!-- Tarefas urgentes -->
        <div class="relatorio-section">
            <h2>Tarefas Urgentes</h2>
            <?php while ($tarefa = $dashboard_tarefas->fetch_assoc()): ?>
            <div class="metric">
                <span class="urgente"><?php echo $tarefa['tarefa_titulo']; ?></span>
                <span><?php echo $tarefa['dias_para_vencimento']; ?> dias</span>
            </div>
            <?php endwhile; ?>
        </div>

        <!-- Produtividade -->
        <div class="relatorio-section">
            <h2>Produtividade da Equipe</h2>
            <?php while ($utilizador = $produtividade->fetch_assoc()): ?>
            <div class="metric">
                <span><?php echo $utilizador['nome']; ?></span>
                <span><?php echo $utilizador['taxa_conclusao']; ?>%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: <?php echo $utilizador['taxa_conclusao']; ?>%"></div>
            </div>
            <?php endwhile; ?>
        </div>

        <!-- Relatório financeiro -->
        <div class="relatorio-section">
            <h2>Desempenho Financeiro</h2>
            <?php while ($mes = $financeiro->fetch_assoc()): ?>
            <div class="metric">
                <span><?php echo date('M/Y', mktime(0, 0, 0, $mes['mes'], 1, $mes['ano'])); ?></span>
                <span><?php echo $mes['taxa_realizacao']; ?>%</span>
            </div>
            <?php endwhile; ?>
        </div>
    </div>
</body>
</html>
```

## Melhores Práticas

### 1. Segurança
- Use parâmetros preparados para evitar SQL Injection
- Limite o acesso direto às tabelas, use views
- Implemente autenticação e autorização adequadas

### 2. Performance
- Crie índices nas colunas frequentemente pesquisadas
- Use views apenas para consultas complexas e repetitivas
- Monitore o desempenho das views

### 3. Manutenção
- Documente todas as views e seus propósitos
- Use nomes descritivos (vw_ prefixo para views)
- Revise e otimize periodicamente

### 4. Backup
- Faça backup regular da base de dados
- Teste restauração periodicamente
- Mantenha scripts de criação versionados

Este guia fornece uma base completa para criar e gerir bases de dados MySQL com views personalizadas para apresentação de informações específicas numa página de administrador.