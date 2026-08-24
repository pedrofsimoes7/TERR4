# Dashboard de gestão arquivada

Esta pasta guarda a antiga área de gestão, removida das rotas ativas em 24 de agosto de 2026.

Para a reativar no futuro, remover o sufixo `.disabled` dos ficheiros arquivados e repô-los nas respetivas pastas `src/app`, `src/components` e `src/lib/auth`; depois, restaurar a autenticação de administração em `src/proxy.ts` e rever a compatibilidade com o fluxo de aluguer atual.

As contas e os dados de administração na base de dados foram mantidos para facilitar uma futura reativação.
