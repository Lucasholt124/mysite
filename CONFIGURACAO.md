# Guia de Configuração - Impulsioneweb

Este guia contém instruções detalhadas para configurar todas as APIs e serviços necessários para o funcionamento completo do site da Impulsioneweb.

## 1. Configuração do Asaas (Pagamentos)

O Asaas é utilizado para processar pagamentos via PIX, boleto, cartão de crédito e débito.

### Passo a passo para obter a API do Asaas:

1. **Crie uma conta no Asaas**:
   - Acesse [https://www.asaas.com/](https://www.asaas.com/)
   - Clique em "Criar conta grátis"
   - Preencha os dados solicitados e conclua o cadastro

2. **Verifique sua conta**:
   - Complete o processo de verificação da conta fornecendo os documentos solicitados
   - Isso é necessário para poder receber pagamentos reais

3. **Obtenha sua chave de API**:
   - Faça login na sua conta Asaas
   - No menu lateral, vá em "Configurações" > "Integrações" > "API"
   - Clique em "Gerar novo token de acesso"
   - Dê um nome para o token (ex: "Site Impulsioneweb")
   - Copie o token gerado

4. **Configure o ambiente**:
   - Por padrão, o Asaas fornece um ambiente de sandbox para testes
   - Para testes, use o token do sandbox
   - Para produção, use o token do ambiente de produção

5. **Adicione o token ao arquivo .env**:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione a linha: `ASAAS_API_KEY=seu_token_de_acesso_asaas`

## 2. Configuração do Serviço de Email

O sistema utiliza SMTP para enviar emails de confirmação de contrato e pagamento.

### Opção 1: Configurar com Gmail

1. **Prepare sua conta Google**:
   - Acesse [https://myaccount.google.com/security](https://myaccount.google.com/security)
   - Ative a verificação em duas etapas (necessário para o próximo passo)
   - Vá para [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Selecione "App" como "Outro" e dê um nome (ex: "Impulsioneweb")
   - Copie a senha de 16 caracteres gerada

2. **Configure o arquivo .env**:
   \`\`\`
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=seu_email@gmail.com
   EMAIL_PASSWORD=sua_senha_de_app_gerada
   EMAIL_FROM=seu_email@gmail.com
   \`\`\`

### Opção 2: Configurar com serviço de email profissional (recomendado)

1. **Contrate um serviço de email**:
   - Opções recomendadas: [SendGrid](https://sendgrid.com/), [Mailgun](https://www.mailgun.com/), [Amazon SES](https://aws.amazon.com/ses/)
   - Ou use o serviço de email do seu provedor de hospedagem

2. **Obtenha as credenciais SMTP**:
   - Acesse o painel do seu serviço de email
   - Procure por "SMTP" ou "Integrações"
   - Anote o servidor SMTP, porta, usuário e senha

3. **Configure o arquivo .env**:
   \`\`\`
   EMAIL_HOST=smtp.seuservico.com
   EMAIL_PORT=587 (ou a porta fornecida)
   EMAIL_SECURE=false (use true para porta 465)
   EMAIL_USER=seu_usuario
   EMAIL_PASSWORD=sua_senha
   EMAIL_FROM=contato@impulsioneweb.com
   \`\`\`

## 3. Configuração do Projeto

1. **Clone o repositório**:
   \`\`\`bash
   git clone [URL_DO_REPOSITORIO]
   cd impulsioneweb
   \`\`\`

2. **Instale as dependências**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Crie o arquivo .env**:
   - Copie o arquivo `.env.example` para `.env`
   - Preencha todas as variáveis conforme instruções acima

4. **Execute o projeto em desenvolvimento**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Construa para produção**:
   \`\`\`bash
   npm run build
   \`\`\`

6. **Inicie o servidor de produção**:
   \`\`\`bash
   npm start
   \`\`\`

## 4. Verificação Final

Após configurar todas as APIs e serviços, faça os seguintes testes:

1. **Teste o formulário de contato**:
   - Preencha e envie o formulário de contato na página inicial
   - Verifique se o email é recebido no endereço configurado

2. **Teste o fluxo de contrato**:
   - Preencha o formulário de contrato
   - Verifique se os dados são salvos corretamente
   - Teste a assinatura do contrato

3. **Teste os métodos de pagamento**:
   - Teste cada método de pagamento (PIX, boleto, cartão)
   - No ambiente de sandbox do Asaas, você pode simular pagamentos
   - Verifique se os webhooks estão funcionando corretamente (se configurados)

## 5. Solução de Problemas

### Problemas com o Asaas:
- Verifique se o token de API está correto
- Confirme se está usando o ambiente correto (sandbox ou produção)
- Verifique os logs de erro no console do servidor

### Problemas com Email:
- Teste as credenciais SMTP em um cliente de email
- Verifique se a porta não está bloqueada pelo firewall
- Para Gmail, confirme se permitiu "apps menos seguros" ou está usando senha de app

### Outros problemas:
- Verifique os logs do servidor
- Confirme que todas as variáveis de ambiente estão configuradas
- Reinicie o servidor após alterações no arquivo .env

Para suporte adicional, entre em contato com o desenvolvedor.
