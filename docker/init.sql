-- Table: usuario
CREATE TABLE usuario (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    senha TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    rua TEXT NOT NULL,
    bairro TEXT NOT NULL,
    cidade TEXT NOT NULL
);

-- Table: forma_pagamento
CREATE TABLE forma_pagamento (
    id TEXT PRIMARY KEY,
    descricao TEXT NOT NULL UNIQUE
);

-- Table: tipo_produto
CREATE TABLE tipo_produto (
    id TEXT PRIMARY KEY,
    descricao TEXT NOT NULL UNIQUE
);

-- Table: produto
CREATE TABLE produto (
    id TEXT PRIMARY KEY,
    descricao TEXT NOT NULL,
    valor_unitario REAL NOT NULL,
    peso REAL NOT NULL,
    id_tipo TEXT NOT NULL,
    FOREIGN KEY (id_tipo) REFERENCES tipo_produto(id) ON DELETE CASCADE
);

-- Table: pedido
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

-- Table: pedido_produtos
CREATE TABLE pedido_produtos (
    id_pedido TEXT NOT NULL,
    id_produto TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    valor REAL NOT NULL,
    PRIMARY KEY (id_pedido, id_produto),
    FOREIGN KEY (id_pedido) REFERENCES pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES produto(id)
);

-- Table: change_log
CREATE TABLE change_log (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    changed_data JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function: log_changes
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO change_log (table_name, operation, changed_data)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        CASE
            WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
            ELSE row_to_json(NEW)
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for all tables
CREATE TRIGGER after_change_usuario
AFTER INSERT OR UPDATE OR DELETE ON usuario
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER after_change_forma_pagamento
AFTER INSERT OR UPDATE OR DELETE ON forma_pagamento
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER after_change_tipo_produto
AFTER INSERT OR UPDATE OR DELETE ON tipo_produto
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER after_change_produto
AFTER INSERT OR UPDATE OR DELETE ON produto
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER after_change_pedido
AFTER INSERT OR UPDATE OR DELETE ON pedido
FOR EACH ROW
EXECUTE FUNCTION log_changes();

CREATE TRIGGER after_change_pedido_produtos
AFTER INSERT OR UPDATE OR DELETE ON pedido_produtos
FOR EACH ROW
EXECUTE FUNCTION log_changes();


INSERT INTO forma_pagamento (id, descricao) VALUES
('1', 'Cartão de Crédito'),
('2', 'Cartão de Débito'),
('3', 'Boleto Bancário'),
('4', 'Pix'),
('5', 'Transferência Bancária');
