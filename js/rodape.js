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

popularSelectFromAPI("rodapes");
popularSelectFromAPI("acessorios");


async function gerarOrcamentoRodape() {
    
    const metragemLinearOriginal = parseFloat(document.getElementById("metragemLinear").value);

    let increasePercentage = 0.15; // Aumento padrão é de 15%

    if (document.getElementById("increase10Percent").checked) {
        increasePercentage = 0.10; 
    }

    const metragemLinear = Math.ceil(metragemLinearOriginal * (1 + increasePercentage));

    const rodapeId = document.getElementById("rodapes").value;

    const produtosAPI = await getProdutosFromAPI();

    const precoRodape = produtosAPI.rodapes.find(produto => produto.id == rodapeId)["preco total barra"];
    const valorCmRodape = produtosAPI.rodapes.find(produto => produto.id == rodapeId)["cm"];

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


   
    const custoCola1_5kg = quantidadeCola1_5kg * produtosAPI.acessorios.find(produto => produto.nome == "Cola para rodapé Persipisos 1.5kg")["preco"];
    const custoCola5kg = quantidadeCola5kg * produtosAPI.acessorios.find(produto => produto.nome == "Cola para rodapé Persipisos 5kg")["preco"];


    const quantidadePacotePregos = 1;

    const custoPacotePregos = quantidadePacotePregos * produtosAPI.acessorios.find(produto => produto.nome == "Pacote Pregos")["preco"];

    const tamanhoBarra = produtosAPI.rodapes.find(produto => produto.id == rodapeId)["tamanho da barra"];
    let quantidadeBarras = metragemLinear / tamanhoBarra;
    quantidadeBarras = Math.ceil(quantidadeBarras);
    const custoRodapes = quantidadeBarras * precoRodape;


    const cordaoId = produtosAPI.rodapes.find(produto => produto.nome === "Eucafloor Cordão Estilo")?.id;
    let quantidadeCordao = parseFloat(document.getElementById("quantidadeCordao").value);
    if (isNaN(quantidadeCordao)) {
        quantidadeCordao = 0;
    }
    const precoCordao = produtosAPI.rodapes.find(produto => produto.id == cordaoId)["preco total barra"];
    const custoCordao = quantidadeCordao * precoCordao;


    const custoMaoDeObraCordao = metragemLinear * valorCmRodape;

    const custoFrete = 224;

    const subtotal = custoRodapes +  custoPacotePregos +
                       custoMaoDeObraCordao + custoFrete + custoCordao + custoCola1_5kg + custoCola5kg;

    const totalLucro = subtotal * 1.35;

    const lucro = totalLucro - subtotal;

    const cartao = totalLucro * 1.12;

    const tabelaOrcamento = document.getElementById("tabelaOrcamento");
    tabelaOrcamento.innerHTML = `
    <div id="tableContainer">
    <table id="resultadoOrcamento">
        <tr>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Subtotal</th>
        </tr>
        
        <tr>
            <td>${produtosAPI.rodapes.find(produto => produto.id == rodapeId).nome} (${produtosAPI.rodapes.find(produto => produto.id == rodapeId).cm} cm)</td>
            <td>${quantidadeBarras.toFixed(0)}</td>
            <td>${custoRodapes.toFixed(2)}</td>
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
            <td>Mão de obra rodapé</td>
            <td>Para ${valorCmRodape.toFixed(0)}cm</td>
            <td>${custoMaoDeObraCordao.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Frete</td>
            <td>1</td>
            <td>${custoFrete.toFixed(2)}</td>
        </tr>
        <tr>
            <td>${produtosAPI.rodapes.find(produto => produto.nome === "Eucafloor Cordão Estilo").nome}</td>
            <td>${quantidadeCordao.toFixed(0)}</td>
            <td>${custoCordao.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Subtotal</td>
            <td>-</td>
            <td>${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Lucro</td>
            <td>35%</td>
            <td>${lucro.toFixed(2)}</td>
        </tr>
        <tr id="total">
            <td colspan="2"><strong>Total</strong></td>
            <td>${totalLucro.toFixed(2)}</td>
        </tr>
        <tr>
            <td>Total no cartão</td>
            <td>Juros 12%</td>
            <td>${cartao.toFixed(2)}</td>
        </tr>
        </table>
        </div>
    `;
    tabelaOrcamento.style.display = 'block';
}
