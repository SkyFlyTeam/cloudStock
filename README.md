<img src="BannerSkyFly.png" style="margin-left: auto; margin-right: auto;">

### Orientadores:

- Prof. Walmir Duque
- Prof. Claudio Lima

<p align="center">
    <a href="#sobre">Sobre o projeto</a>  |  
    <a href="#demostracao">Demostração</a>  |  
    <a href="#tecnologias">Tecnologias utilizadas</a>  |  
    <a href="#backlog">Backlog do produto</a>  |  
    <a href="#autores">Autores</a>
</p>

<br>

<span id="sobre">

# 🔎 Sobre o projeto

O Cloud Stock é um sistema de controle de estoque desenvolvida para facilitar a gestão de produtos, fornecedores e movimentações de estoque. Com funcionalidades como cadastro de itens, controle de entradas e saídas, geração de relatórios e alertas automáticos, o sistema oferece suporte completo para decisões estratégicas e organização eficiente do estoque de uma empresa.

## 🔎 O que a Cloud Stock resolve?

A Cloud Stock tem como objetivo resolver problemas relacionados ao gerenciamento de estoque ineficiente, reduzindo erros humanos e otimizando o acompanhamento do inventário.

<br> 

## 📅 Entrega de Sprints

Sprint | Previsão | Status | Relatório
|------|--------|------|------|
|Kick Off | 26/08/2024 a 30/08/2024 | ✔️ Concluída | -
|01 | 09/09/2024 a 29/09/2024 | ✔️ Concluída | [ver relatório](https://github.com/SkyFlyTeam/cloudStock/tree/sprint1) 
|02|  30/09/2024 a 20/10/2024|  ✔️ Concluída | [ver relatório](https://github.com/SkyFlyTeam/cloudStock/tree/sprint2) 
|03| 21/10/2024 a 10/11/2024 |  a fazer |
|04| 11/11/2024 a 01/12/2024 | a fazer |
|Feira de Soluções| 12/12 | a fazer |

<br>

<span id="tecnologias">

# 🛠️ Tecnologias Utilizadas

As seguintes ferramentas, linguagens, bibliotecas e tecnologias foram usadas na construção do projeto:

![Typescript](https://img.shields.io/badge/TypeScript-20232A?style=for-the-badge&logo=typescript&logoColor=007ACC)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node%20js-20232A?style=for-the-badge&logo=nodedotjs&logoColor=339933)
![Docker](https://img.shields.io/badge/docker-20232A?style=for-the-badge&logo=docker&logoColor=87CEEB)
![HTML5](https://img.shields.io/badge/html5-20232A?style=for-the-badge&logo=html5&logoColor=FF6347)
![MySQL](https://img.shields.io/badge/mysql-20232A?style=for-the-badge&logo=mysql&logoColor=4682B4)
![CSS3](https://img.shields.io/badge/css3-20232A?style=for-the-badge&logo=css3&logoColor=4682B4)
![Figma](https://img.shields.io/badge/figma-20232A?style=for-the-badge&logo=figma&logoColor=800000)
![Discord](https://img.shields.io/badge/Discord-20232A?style=for-the-badge&logo=discord&logoColor=61DAFB)
![Jira](https://img.shields.io/badge/Jira-20232A?style=for-the-badge&logo=Jira&logoColor=4169E1)

<br> 

<span id="backlog">

# 🧾 Backlog do produto

Rank | Prioridade | User Story | Estimativa | Sprint | Requisito
|----|----|----------|----|----|----|
| 1 | Alta | Eu como funcionário gostaria de cadastrar os produtos e suas propriedades para saber o que tem no estoque.  | 6 | 1 | 02
| 2 | Alta | Eu como gerente gostaria de cadastrar os locais, fornecedores e setores de cada produto para melhor gestão do estoque. | 4 | 1 | 04
| 3 | Alta | Eu como gerente gostaria de realizar a compra de produtos para alimentar o meu sistema.  | 6 | 2 | 05 
| 4 | Alta | Eu como funcionário gostaria de realizar a venda de produtos para auxiliar no sistemas de venda  | 4 | 2 | 05
| 5 | Alta | Eu como gerente gostaria de ter registros da entrada e saída de produtos para não perder a sincronia do sistema e estoque.| 4 | 2 | 05
| 6 | Alta | Eu como funcionário gostaria de acessar onde está localizado um produto para poder direcionar um comprador.| 2 | 2 | 04
| 7 | Alta | Eu como administrador gostaria de ter três níveis de acesso diferente para atribuições individualizadas.| 7 | 2 | 01
| 8 | Alta | Eu como gerente gostaria de definir o estoque mínimo de cada produto para que não haja falta de produtos.  | 4 | 3 | 10
| 9 | Alta | Eu como gerente e funcionário gostaria que sejam emitidos alertas de estoque baixo para controle de reposição. | 6 | 3 | 08
| 10 | Alta | Eu como gerente e funcionário desejo que a plataforma emita avisos assim que um produto esteja próximo da data de validade para que eu possa substituir esses produtos por itens com validade mais longa e evitar perdas. | 4 | 3 | 09
| 11 | Alta | Eu como gerente gostaria de possuir relatórios detalhados sobre o status do estoque, histórico de compras e movimentação para possuir o total controle do estoque.  | 9 | 4 | 06
| 12 | Alta | Eu como gerente gostaria de que hajam métricas de venda e perdas para planejar a compra de produtos de interesse.  | 7 | 4 | 07
| 13 | Média | Eu como gerente gostaria de ver um histórico de compras e alterações no sistema para auditar os registros de entrada e saída dos itens da loja. | 5 | 4 | 09
| 14 | Média | Eu como administrador gostaria de cadastrar novos usuários junto de suas respectivas funções para alimentar minha plataforma. | 3 | 4 | 01
| 15 | Baixa | Eu como funcionário gostaria de filtrar os produtos para melhor organização.| 2 | 4 | 03

### Requisitos Funcionais
- 01: Cadastro de Usuários: Diferenciar níveis de acesso (administrador, gerente, funcionário). 
- 02: Cadastro de Produtos: Incluindo código, nome, descrição, marca, modelo, categoria, quantidade, preço de custo e venda, unidade de medida, localização no estoque, fornecedor, imagem do produto, peso, dimensões, validade e setor de armazenagem. 
- 03: Cadastro de Categorias: Organização hierárquica dos produtos, facilitando a navegação.  Cadastro de Local, Fornecedor e Setor: Registro dos locais de armazenamento, fornecedores e Setores.
- 04: Cadastro de Local, Fornecedor e Setor: Registro dos locais de armazenamento, fornecedores e Setores.
- 05: Movimentação de Estoque: Registros de entrada e saída de produtos com controle de responsável e data. 
- 06: Relatórios de Estoque: Relatórios detalhados sobre o status do estoque, histórico de compras, e movimentações. 
- 07: Análise de Tendências: Ferramentas de análise para prever demandas futuras e planejar compras. 
- 08: Alertas de Baixo Estoque: Notificações automáticas para itens com estoque abaixo do nível mínimo. 
- 09: Notificações de Expiração: Avisos para produtos próximos da data de validade. 
- 10: Histórico de Compras e Auditoria: Registro de compras e logs de alterações no sistema.
- 11: Definir o estoque mínimo

### Requisitos Não Funcionais
- Manual do Usuário: Documento claro e detalhado para auxiliar os usuários. 
- Usabilidade: Interface intuitiva, fácil navegação e design responsivo adaptável a diferentes dispositivos. 
- Guia de Instalação: Instruções claras para a instalação do sistema em diferentes ambientes.


<br>

<span id="demostracao">

# 💻 Demonstração

Apresentação das funcionalidades desenvolvidas até o momento:

[![SprintReview2](https://i9.ytimg.com/vi/eyDyj7bAfGM/mqdefault.jpg?sqp=CJD72LgG-oaymwEmCMACELQB8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGDYgXChlMA8=&rs=AOn4CLA0ROuTqxKhA0yjHv6yfVB8hL920w)](https://youtu.be/eyDyj7bAfGM)

<br>

## 🔎 Instalação e utilização
### Configuração do backend
Dentro da pasta "backend" crie um novo arquivo chamado .env e dentro dele coloque as configurações do seu banco de dados da seguinte forma:
```
DB_NAME: 'Nome do Schema a ser usado'
DB_USER: 'Usuário de conexão do banco'
DB_PASSWORD: 'Senha de conexão do banco referente ao usuário'
DB_HOST: 'ip do banco de dados'
```

Após configurar estes arquivos digite o seguinte comando dentro da pasta para instalar o backend:
```node 
npm install
```

E por fim para iniciar o backend digite o comando:
```node
npm start
```

### Configuração do frontend
Dentro da pasta "frontend" execute o seguinte comando para instalação do frontend:
```node
npm install
```

E por fim para iniciar o frontend digite o seguinte comando:
```npm
npm start
```

<span id="autores">

# 👥 Autores


|    Função     | Nome                                  |                                                                                                                                                      LinkedIn & GitHub                                                                                                                                                      |
| :-----------: | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  Product Owner  | Brenno Rosa Lyrio de Oliveira               |   [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/brennolyrio/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/BrennoLyrio)   |
| Scrum Master  | André Salerno |      [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/andresalerno/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/andresalerno)     |
| Team Member   | Eric Lourenço Mendes da Silva      |         [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)]() [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/ericloumendes)        |
|  Team Member  | Gustavo Muraoka Silva                 |         [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/gustavo-muraoka-4256721ba/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/gustavomuraoka)        |
|  Team Member  | Sarah Montuani Batagioti               |   [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/sarahbatagioti/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/SarahBatagioti)   |
|  Team Member  | Karen de Cássia Gonçalves     |           [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/karen-cgonçalves) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/karengoncalves8)   |
| Team Master |   Marianne Valério Nunes         |     [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)]() [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/Marianne10)              |
|  Team Member  | Guilherme dos Santos Benedito               |   [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/guilherme-benedito/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/gui-benedito)   |
|  Team Member  | Arthur Johannes Rodrigues Peres y Peres              |   [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/ajperes/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/ajperes)   |

![image 6](https://github.com/andresalerno/projeto_api/assets/105525498/a7ca2b45-b638-4ae3-a1aa-d4b533acc6ab)
