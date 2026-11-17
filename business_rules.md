# Regras de negócio — Simulador de Fogueira

## Objetivo

Definir como a intensidade da chama deve responder às interações do usuário. A aplicação representa uma simulação visual; seus valores não correspondem a temperatura, potência ou comportamento de uma fogueira real.

## Regras

### RN-01 — Limites de intensidade

A intensidade da chama deve permanecer entre **0 e 100**, inclusive. Zero representa a chama em repouso, e 100 representa sua intensidade máxima. Nenhuma interação pode ultrapassar esses limites.

### RN-02 — Aumento enquanto a ação estiver ativa

Enquanto o usuário mantiver uma ação válida pressionada sobre o controle da chama, a intensidade deve aumentar continuamente. O aumento deve parar ao atingir 100.

### RN-03 — Redução após a ação

Quando a ação for encerrada, a intensidade deve diminuir gradualmente até chegar a zero. A redução não pode deixar a intensidade negativa.

### RN-04 — Independência da taxa de quadros

O aumento e a redução da intensidade devem depender do tempo decorrido, não da quantidade de quadros renderizados. Assim, a duração da interação produz resultado equivalente em dispositivos com diferentes taxas de atualização.

### RN-05 — Formas de interação

A ação de aumentar a chama deve poder ser realizada por mouse, toque ou teclado. Para teclado, manter a tecla **Espaço** pressionada deve equivaler a manter o controle acionado.

### RN-06 — Encerramento seguro da ação

A ação deve ser considerada encerrada quando o usuário soltar o controle, cancelar o toque, sair da área de interação ou quando a janela perder o foco. Isso evita que a chama continue aumentando após uma interrupção da entrada.

### RN-07 — Uma ação ativa por vez

A simulação deve considerar no máximo uma ação ativa por vez. Entradas simultâneas não devem acelerar o aumento da intensidade; a chama segue a mesma regra de progressão.

### RN-08 — Consistência entre estado e apresentação

A representação visual da chama deve refletir a intensidade atual: intensidades maiores devem aparentar uma chama mais intensa, e intensidade zero deve corresponder ao estado de repouso.

### RN-09 — Sem persistência na versão inicial

A intensidade é temporária e não precisa ser salva. Ao iniciar ou recarregar a aplicação, a simulação deve começar com intensidade zero.

## Parâmetros iniciais sugeridos

As taxas abaixo são valores iniciais para calibrar a experiência e podem ser ajustadas sem alterar as regras acima:

- Aumento: **30 pontos de intensidade por segundo** enquanto a ação estiver ativa.
- Redução: **20 pontos de intensidade por segundo** após o encerramento da ação.
- Intensidade inicial: **0**.
- Intensidade máxima: **100**.

## Critérios de aceite

- Manter a ação por mais tempo resulta em intensidade maior, até o limite de 100.
- Soltar ou interromper a ação inicia a redução gradual até zero.
- A intensidade nunca fica abaixo de zero nem acima de 100.
- Mouse, toque e Espaço produzem o mesmo comportamento de progressão.
- Entradas simultâneas não aumentam a velocidade de progressão.
- Recarregar a aplicação reinicia a intensidade em zero.
