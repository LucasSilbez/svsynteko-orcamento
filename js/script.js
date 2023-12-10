// Seu JSON de produtos
const produtos = {
    "laminados": [
        {
            "id": 1,
            "nome": "Eucafloor Prime colado",
            "metragem embalagem / Cx": 2.14,
            "preco total caixa": 87.57
        },
        {
            "id": 2,
            "nome": "Eucafloor Prime Click ",
            "metragem embalagem / Cx": 2.36,
            "preco total caixa": 106.74
        },
        {
            "id": 3,
            "nome": "Eucafloor Evidence Click 2G",
            "metragem embalagem / Cx": 2.36,
            "preco total caixa": 116.97
        },
        {
            "id": 4,
            "nome": "Eucafloor New Elegance Click 2G",
            "metragem embalagem / Cx": 2.77,
            "preco total caixa": 163.77
        },
        {
            "id": 5,
            "nome": "Eucafloor Gran Elegance",
            "metragem embalagem / Cx": 2.41,
            "preco total caixa": 150.00
        }
    ],
    "rodapes": [
        {
            "id": 22,
            "nome": "Rodapé Estilo 5cm",
            "tamanho da barra": 2.40,
            "preco total barra": 16,
            "cm": 10
        },
        {
            "id": 6,
            "nome": "Eucafloor rodapé Acqua 15 cm com Friso cores",
            "tamanho da barra": 2.44,
            "preco total barra": 143.45,
            "cm": 15
        },
        {
            "id": 7,
            "nome": "Eucafloor Rodapé Acqua 15 cm com Friso Branco",
            "tamanho da barra": 2.44,
            "preco total barra": 75.00,
            "cm": 15
        },
        {
            "id": 8,
            "nome": "Eucafloor Rodapé Acqua 20 cm s/ friso Branco",
            "tamanho da barra": 2.44,
            "preco total barra": 130.00,
            "cm": 20
        },
        {
            "id": 9,
            "nome": "Eucafloor Rodapé Acqua 5,5 cm",
            "tamanho da barra": 2.44,
            "preco total barra": 42.00,
            "cm": 10
        },
        {
            "id": 10,
            "nome": "Eucafloor Rodapé Acqua 11 cm s/ friso Branco",
            "tamanho da barra": 2.44,
            "preco total barra": 59.10,
            "cm": 11
        },
        {
            "id": 11,
            "nome": "Eucafloor Rodapé Acqua 7 cm s/ friso Branco",
            "tamanho da barra": 2.44,
            "preco total barra": 43.55,
            "cm": 10
        },
        {
            "id": 12,
            "nome": "Eucafloor Rodapé Acqua 7 cm com friso Branco",
            "tamanho da barra": 2.44,
            "preco total barra": 43.55,
            "cm": 10
        },
        {
            "id": 13,
            "nome": "Eucafloor Rodapé Estilo 5cm",
            "tamanho da barra": 2.40,
            "preco total barra": 16.00,
            "cm": 10
        },
        {
            "id": 14,
            "nome": "Eucafloor Rodapé Estilo 7cm ",
            "tamanho da barra": 2.40,
            "preco total barra": 20.60,
            "cm": 10
        },
        {
            "id": 15,
            "nome": "Eucafloor Cordão Estilo",
            "tamanho da barra": 2.40,
            "preco total barra": 13.90,
            "cm": 10,
            "cordao": true
        },
        {
            "id": 16,
            "nome": "Eucafloor Rodapé Estilo 10 cm ( apenas branco)",
            "tamanho da barra": 2.40,
            "preco total barra": 35.71,
            "cm": 10
        }
    ],
    "acessorios": [
        {
            "id": 17,
            "nome": "Manta acrílica 2mm",
            "preco": 40.00
        },
        {
            "id": 18,
            "nome": "Pacote Pregos",
            "preco": 15.00
        },
        {
            "id": 19,
            "nome": "Cola para rodapé Persipisos 1.5kg",
            "preco": 26.00
        },
        {
            "id": 20,
            "nome": "Cola para rodapé Persipisos 5kg",
            "preco": 85.00
        },
        {
            "id": 21,
            "nome": "Perfil redutor",
            "preco": 40.00
        }
    ]
};

// Função para popular o select com base no tipo de produto
function popularSelect(tipoProduto) {
    const selectElement = document.getElementById(tipoProduto);
    const produtosDoTipo = produtos[tipoProduto];

    produtosDoTipo.forEach((produto) => {
        const option = document.createElement("option");
        option.value = produto.id;
        option.text = produto.nome;
        selectElement.appendChild(option);
    });
}

// Chamadas para popular os selects
popularSelect("laminados");
popularSelect("rodapes");
popularSelect("acessorios");


function gerarOrcamento() {
    // Obter os valores selecionados
    const laminadoId = document.getElementById("laminados").value;
    const quantidadeLaminadoTotal = parseFloat(document.getElementById("metragemTotal").value);
    const metragemLinear = parseFloat(document.getElementById("metragemLinear").value);

    const rodapeId = document.getElementById("rodapes").value;

    // Calcular o custo dos produtos selecionados
    const precoLaminado = produtos.laminados.find(produto => produto.id == laminadoId)["preco total caixa"];
    const precoRodape = produtos.rodapes.find(produto => produto.id == rodapeId)["preco total barra"];
    const valorCmRodape = produtos.rodapes.find(produto => produto.id == rodapeId)["cm"];

    // Calcular a quantidade de caixas de laminado
    const metragemPorCaixa = produtos.laminados.find(produto => produto.id == laminadoId)["metragem embalagem / Cx"];
    let quantidadeCaixas = quantidadeLaminadoTotal / metragemPorCaixa;
    quantidadeCaixas = Math.ceil(quantidadeCaixas);

    // Calcular a quantidade de manta acrílica 2mm
    const quantidadeManta = Math.ceil(quantidadeLaminadoTotal / 10);

    // Calcular a quantidade de cola para rodapé
    let quantidadeCola1_5kg = 0;
    let quantidadeCola5kg = 0;

    const rodapeSelecionado = produtos.rodapes.find(produto => produto.id == rodapeId);
    if (rodapeSelecionado && !rodapeSelecionado.cordao) {
        const rendimentoPorCola1_5kg = 20;

        // Calcular a quantidade necessária de cola de 1.5kg
        quantidadeCola1_5kg = Math.ceil(metragemLinear / rendimentoPorCola1_5kg);

        // Se a metragem linear for superior a 60, calcular as colas necessárias
        if (metragemLinear > 40) {
            // Calcular a quantidade de colas de 5kg
            quantidadeCola5kg = 1;
            quantidadeCola1_5kg = 0;
        }
    }



    // Calcular a quantidade de pacotes de pregos (sempre adicionar 1)
    const quantidadePacotePregos = 1;

    // Calcular o custo dos acessórios
    const custoManta = quantidadeManta * produtos.acessorios.find(produto => produto.nome == "Manta acrílica 2mm")["preco"];
    const custoCola1_5kg = quantidadeCola1_5kg * produtos.acessorios.find(produto => produto.nome == "Cola para rodapé Persipisos 1.5kg")["preco"];
    const custoCola5kg = quantidadeCola5kg * produtos.acessorios.find(produto => produto.nome == "Cola para rodapé Persipisos 5kg")["preco"];
    const custoPacotePregos = quantidadePacotePregos * produtos.acessorios.find(produto => produto.nome == "Pacote Pregos")["preco"];

    // Calcular a quantidade de barras de rodapé e o custo
    const tamanhoBarra = produtos.rodapes.find(produto => produto.id == rodapeId)["tamanho da barra"];
    let quantidadeBarras = metragemLinear / tamanhoBarra;
    quantidadeBarras = Math.ceil(quantidadeBarras);
    const custoRodapes = quantidadeBarras * precoRodape;

    // Calcular o custo dos laminados
    const custoLaminados = quantidadeCaixas * precoLaminado;

    // Calcular o custo do perfil redutor
    const quantidadePerfilRedutor = parseFloat(document.getElementById("quantidadePerfilRedutor").value);
    const precoPerfilRedutor = produtos.acessorios.find(produto => produto.nome === "Perfil redutor")["preco"];
    const custoPerfilRedutor = quantidadePerfilRedutor * precoPerfilRedutor;

    // Outros custos
    const custoMaoDeObra = 25 * quantidadeLaminadoTotal; // Custo da mão de obra multiplicado pela metragem total

    // Calcular o custo da mão de obra do cordão
    const custoMaoDeObraCordao = metragemLinear * valorCmRodape; // Multiplicar pela quantidade de centímetros

    const custoFrete = 224;

    // Calcular o total corrigido
    const subtotal = custoLaminados + custoRodapes + custoManta + custoCola1_5kg + custoCola5kg + custoPacotePregos + custoMaoDeObra + custoMaoDeObraCordao + custoFrete + custoPerfilRedutor;

    const totalLucro = subtotal * 1.35;

    const lucro = totalLucro - subtotal;

    // Exibir o resultado na tabela
    const tabelaOrcamento = document.getElementById("tabelaOrcamento");
    tabelaOrcamento.innerHTML = `
    <table id="resultadoOrcamento">
        <tr>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Subtotal</th>
        </tr>
        
        <tr>
            <td>Caixas de ${produtos.laminados.find(produto => produto.id == laminadoId).nome}</td>
            <td>${quantidadeCaixas.toFixed(0)}</td>
            <td>${custoLaminados.toFixed(2)}</td>
        </tr>
        <tr>
            <td>${produtos.rodapes.find(produto => produto.id == rodapeId).nome} (${produtos.rodapes.find(produto => produto.id == rodapeId).cm} cm)</td>
            <td>${quantidadeBarras.toFixed(0)}</td>
            <td>${custoRodapes.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Manta acrílica 2mm</td>
            <td>${quantidadeManta}</td>
            <td>${custoManta.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Cola para rodapé (1.5kg)</td>
            <td>${quantidadeCola1_5kg}</td>
            <td>${custoCola1_5kg.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Cola para rodapé (5kg)</td>
            <td>${quantidadeCola5kg}</td>
            <td>${custoCola5kg.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Pacote de pregos</td>
            <td>${quantidadePacotePregos}</td>
            <td>${custoPacotePregos.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Mão de obra</td>
            <td>Para ${quantidadeLaminadoTotal.toFixed(0)}m²</td>
            <td>${custoMaoDeObra.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Mão de obra rodapé/cordão</td>
            <td>Para ${metragemLinear.toFixed(0)}ml</td>
            <td>${custoMaoDeObraCordao.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Frete</td>
            <td>1</td>
            <td>${custoFrete.toFixed(2)}</td>
        </tr>
        <tr>
            <td>${produtos.acessorios.find(produto => produto.nome === "Perfil redutor").nome}</td>
            <td>${quantidadePerfilRedutor.toFixed(0)}</td>
            <td>${custoPerfilRedutor.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Lucro</td>
            <td>35%</td>
            <td>${lucro.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="2"><strong>Total</strong></td>
            <td>${totalLucro.toFixed(2)}</td>
        </tr>
        </table>
    `;
    tabelaOrcamento.style.display = 'block';
}
