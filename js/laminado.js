// Substitua a constante produtos por uma função que busca os dados da API
async function getProdutosFromAPI() {
    const response = await fetch('https://svsyntekoapi.000webhostapp.com/');
    const data = await response.json();
    console.log('Dados da API:', data);
    return data;
}

// Função para popular o select com base no tipo de produto
async function popularSelectFromAPI(tipoProduto) {
    const selectElement = document.getElementById(tipoProduto);
    const produtosDoTipo = await getProdutosFromAPI();

    produtosDoTipo[tipoProduto].forEach((produto) => {
        const option = document.createElement("option");
        option.value = produto.id;
        option.text = produto.nome;
        selectElement.appendChild(option);
    });
}

// Chamadas para popular os selects
popularSelectFromAPI("laminados");
popularSelectFromAPI("rodapes");
popularSelectFromAPI("acessorios");

async function gerarOrcamento() {
    // Obtenha os valores selecionados
    const laminadoId = document.getElementById("laminados").value;
    const quantidadeLaminadoTotal = parseFloat(document.getElementById("metragemTotal").value);
    const metragemLinear = parseFloat(document.getElementById("metragemLinear").value);

    const rodapeId = document.getElementById("rodapes").value;

    // Obtenha os dados da API
    const produtosAPI = await getProdutosFromAPI();

    // Calcular o custo dos produtos selecionados usando os dados da API
    const precoLaminado = produtosAPI.laminados.find(produto => produto.id == laminadoId)["preco total caixa"];
    const precoRodape = produtosAPI.rodapes.find(produto => produto.id == rodapeId)["preco total barra"];
    const valorCmRodape = produtosAPI.rodapes.find(produto => produto.id == rodapeId)["cm"];

    // Calcular a quantidade de caixas de laminado
    const metragemPorCaixa = produtosAPI.laminados.find(produto => produto.id == laminadoId)["metragem embalagem / Cx"];
    let quantidadeCaixas = quantidadeLaminadoTotal / metragemPorCaixa;
    quantidadeCaixas = Math.ceil(quantidadeCaixas);

    // Calcular a quantidade de manta acrílica 2mm
    const quantidadeManta = Math.ceil(quantidadeLaminadoTotal / 10);

    // Calcular a quantidade de cola para rodapé
    let quantidadeCola1_5kg = 0;
    let quantidadeCola5kg = 0;

    const rodapeSelecionado = produtosAPI.rodapes.find(produto => produto.id == rodapeId);
    if (rodapeSelecionado && !rodapeSelecionado.cordao) {
        const rendimentoPorCola1_5kg = 20;

        // Calcular a quantidade necessária de cola de 1.5kg
        quantidadeCola1_5kg = Math.ceil(metragemLinear / rendimentoPorCola1_5kg);

        // Se a metragemLinear for superior a 60, calcular as colas necessárias
        if (metragemLinear > 40) {
            // Calcular a quantidade de colas de 5kg
            quantidadeCola5kg = 1;
            quantidadeCola1_5kg = 0;
        }
    }

    // Calcular a quantidade de pacotes de pregos (sempre adicionar 1)
    const quantidadePacotePregos = 1;

    // Calcular o custo dos acessórios
    const custoManta = quantidadeManta * produtosAPI.acessorios.find(produto => produto.nome == "Manta acrílica 2mm")["preco"];
    const custoCola1_5kg = quantidadeCola1_5kg * produtosAPI.acessorios.find(produto => produto.nome == "Cola para rodapé Persipisos 1.5kg")["preco"];
    const custoCola5kg = quantidadeCola5kg * produtosAPI.acessorios.find(produto => produto.nome == "Cola para rodapé Persipisos 5kg")["preco"];
    const custoPacotePregos = quantidadePacotePregos * produtosAPI.acessorios.find(produto => produto.nome == "Pacote Pregos")["preco"];

    // Calcular a quantidade de barras de rodapé e o custo
    const tamanhoBarra = produtosAPI.rodapes.find(produto => produto.id == rodapeId)["tamanho da barra"];
    let quantidadeBarras = metragemLinear / tamanhoBarra;
    quantidadeBarras = Math.ceil(quantidadeBarras);
    const custoRodapes = quantidadeBarras * precoRodape;

    // Calcular o custo dos laminados
    const custoLaminados = quantidadeCaixas * precoLaminado;

    // Calcular o custo do perfil redutor
    const quantidadePerfilRedutor = parseFloat(document.getElementById("quantidadePerfilRedutor").value);
    const precoPerfilRedutor = produtosAPI.acessorios.find(produto => produto.nome === "Perfil redutor")["preco"];
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
            <td>Caixas de ${produtosAPI.laminados.find(produto => produto.id == laminadoId).nome}</td>
            <td>${quantidadeCaixas.toFixed(0)}</td>
            <td>${custoLaminados.toFixed(2)}</td>
        </tr>
        <tr>
            <td>${produtosAPI.rodapes.find(produto => produto.id == rodapeId).nome} (${produtosAPI.rodapes.find(produto => produto.id == rodapeId).cm} cm)</td>
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
            <td>Para ${valorCmRodape.toFixed(0)}cm</td>
            <td>${custoMaoDeObraCordao.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Frete</td>
            <td>1</td>
            <td>${custoFrete.toFixed(2)}</td>
        </tr>
        <tr>
            <td>${produtosAPI.acessorios.find(produto => produto.nome === "Perfil redutor").nome}</td>
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
