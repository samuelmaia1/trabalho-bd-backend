CREATE TABLE usuario (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    senha TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    rua TEXT NOT NULL,
    bairro TEXT NOT NULL,
    cidade TEXT NOT NULL
);

-- Tabela: forma_pagamento
CREATE TABLE forma_pagamento (
    id TEXT PRIMARY KEY,
    descricao TEXT NOT NULL UNIQUE
);

-- Tabela: tipo_produto
CREATE TABLE tipo_produto (
    id TEXT PRIMARY KEY,
    descricao TEXT NOT NULL UNIQUE
);

-- Tabela: produto
CREATE TABLE produto (
    id TEXT PRIMARY KEY,
    descricao TEXT NOT NULL,
    valor_unitario REAL NOT NULL,
    peso REAL NOT NULL,
    id_tipo TEXT NOT NULL,
    FOREIGN KEY (id_tipo) REFERENCES tipo_produto(id)
);

-- Tabela: pedido
CREATE TABLE pedido (
    id TEXT PRIMARY KEY,
    id_usuario TEXT NOT NULL,
    valor_produtoa REAL NOT NULL,
    valor_frete REAL NOT NULL,
    valor_total REAL NOT NULL,
    data DATE NOT NULL,
    id_forma_pagamento TEXT NOT NULL,
    endereco_entrega TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_forma_pagamento) REFERENCES forma_pagamento(id)
);

-- Tabela: pedido_produtos
CREATE TABLE pedido_produtos (
    id_pedido TEXT NOT NULL,
    id_produto TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    valor REAL NOT NULL,
    PRIMARY KEY (id_pedido, id_produto),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id),
    FOREIGN KEY (id_produto) REFERENCES produto(id)
);