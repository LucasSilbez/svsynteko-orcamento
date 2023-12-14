async function getProdutosFromAPI() {
    const response = await fetch('https://svsyntekoapi.000webhostapp.com/');
    const data = await response.json();
    console.log('Dados da API:', data);
    return data;
}

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

popularSelectFromAPI("laminados");
popularSelectFromAPI("rodapes");
popularSelectFromAPI("acessorios");

async function gerarOrcamento() {
    const laminadoId = document.getElementById("laminados").value;
    const quantidadeLaminadoTotal = parseFloat(document.getElementById("metragemTotal").value);
    const metragemLinear = parseFloat(document.getElementById("metragemLinear").value);

    const rodapeId = document.getElementById("rodapes").value;

    const produtosAPI = await getProdutosFromAPI();

    const precoLaminado = produtosAPI.laminados.find(produto => produto.id == laminadoId)["preco total caixa"];
    const precoRodape = produtosAPI.rodapes.find(produto => produto.id == rodapeId)["preco total barra"];
    const valorCmRodape = produtosAPI.rodapes.find(produto => produto.id == rodapeId)["cm"];


    const metragemPorCaixa = produtosAPI.laminados.find(produto => produto.id == laminadoId)["metragem embalagem / Cx"];
    let quantidadeCaixas = quantidadeLaminadoTotal / metragemPorCaixa;
    quantidadeCaixas = Math.ceil(quantidadeCaixas);


    const quantidadeManta = Math.ceil(quantidadeLaminadoTotal / 10);


    let quantidadeCola1_5kg = 0;
    let quantidadeCola5kg = 0;

    const rodapeSelecionado = produtosAPI.rodapes.find(produto => produto.id == rodapeId);
    if (rodapeSelecionado && !rodapeSelecionado.cordao) {
        const rendimentoPorCola1_5kg = 20;


        quantidadeCola1_5kg = Math.ceil(metragemLinear / rendimentoPorCola1_5kg);


        if (metragemLinear > 40) {

            quantidadeCola5kg = 1;
            quantidadeCola1_5kg = 0;
        }
    }


    const quantidadePacotePregos = 1;


    const custoManta = quantidadeManta * produtosAPI.acessorios.find(produto => produto.nome == "Manta acrílica 2mm")["preco"];
    const custoCola1_5kg = quantidadeCola1_5kg * produtosAPI.acessorios.find(produto => produto.nome == "Cola para rodapé Persipisos 1.5kg")["preco"];
    const custoCola5kg = quantidadeCola5kg * produtosAPI.acessorios.find(produto => produto.nome == "Cola para rodapé Persipisos 5kg")["preco"];
    const custoPacotePregos = quantidadePacotePregos * produtosAPI.acessorios.find(produto => produto.nome == "Pacote Pregos")["preco"];


    const tamanhoBarra = produtosAPI.rodapes.find(produto => produto.id == rodapeId)["tamanho da barra"];
    let quantidadeBarras = metragemLinear / tamanhoBarra;
    quantidadeBarras = Math.ceil(quantidadeBarras);
    const custoRodapes = quantidadeBarras * precoRodape;


    const custoLaminados = quantidadeCaixas * precoLaminado;


    const quantidadePerfilRedutor = parseFloat(document.getElementById("quantidadePerfilRedutor").value);
    const precoPerfilRedutor = produtosAPI.acessorios.find(produto => produto.nome === "Perfil")["preco"];
    const custoPerfilRedutor = quantidadePerfilRedutor * precoPerfilRedutor;


    const cordaoId = produtosAPI.rodapes.find(produto => produto.nome === "Eucafloor Cordão Estilo")?.id;
    const quantidadeCordao = parseFloat(document.getElementById("quantidadeCordao").value);
    const precoCordao = produtosAPI.rodapes.find(produto => produto.id == cordaoId)["preco total barra"];
    const custoCordao = quantidadeCordao * precoCordao;


    const custoMaoDeObra = 25 * quantidadeLaminadoTotal;


    const custoMaoDeObraCordao = metragemLinear * valorCmRodape;

    const custoFrete = 224;


    const subtotal = custoLaminados + custoRodapes + custoManta + custoCola1_5kg + custoCola5kg + custoPacotePregos + custoMaoDeObra + custoMaoDeObraCordao + custoFrete + custoPerfilRedutor + custoCordao;

    const totalLucro = subtotal * 1.35;

    const lucro = totalLucro - subtotal;


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
            <td>${produtosAPI.acessorios.find(produto => produto.nome === "Perfil").nome}</td>
            <td>${quantidadePerfilRedutor.toFixed(0)}</td>
            <td>${custoPerfilRedutor.toFixed(2)}</td>
        </tr>
        <tr>
            <td>${produtosAPI.rodapes.find(produto => produto.nome === "Eucafloor Cordão Estilo").nome}</td>
            <td>${quantidadeCordao.toFixed(0)}</td>
            <td>${custoCordao.toFixed(2)}</td>
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
