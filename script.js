// ===============================
// ESTADO INICIAL
// ===============================

let pedido = JSON.parse(localStorage.getItem("pedido")) || [];
let cnpjCliente = localStorage.getItem("cnpj") || "";

// Se já tiver CNPJ salvo, entra direto
if (cnpjCliente) {
    document.getElementById("cadastro").classList.add("hidden");
    document.getElementById("sistema").classList.remove("hidden");
    document.getElementById("cnpjExibido").innerText = cnpjCliente;
    atualizarLista();
}

// ===============================
// VALIDAÇÃO DE CNPJ REAL
// ===============================

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,'');

    if (cnpj.length != 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0,tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) return false;

    return true;
}

// ===============================
// LOGIN
// ===============================

function entrar() {
    let cnpj = document.getElementById("cnpj").value.trim();

    if (!validarCNPJ(cnpj)) {
        alert("CNPJ inválido.");
        return;
    }

    cnpjCliente = cnpj;
    localStorage.setItem("cnpj", cnpjCliente);

    document.getElementById("cadastro").classList.add("hidden");
    document.getElementById("sistema").classList.remove("hidden");
    document.getElementById("cnpjExibido").innerText = cnpjCliente;
}

// ===============================
// ADICIONAR PRODUTO
// ===============================

function adicionar(nome, preco, idInput) {

    let grades = parseInt(document.getElementById(idInput).value);

    if (!grades || grades <= 0) {
        alert("Informe a quantidade de grades.");
        return;
    }

    let pecas = grades * 15;
    let total = pecas * preco;

    pedido.push({
        nome,
        precoUnitario: preco,
        grades,
        pecas,
        total
    });

    localStorage.setItem("pedido", JSON.stringify(pedido));

    atualizarLista();
    document.getElementById(idInput).value = 0;
}

// ===============================
// REMOVER ITEM
// ===============================

function remover(index) {
    pedido.splice(index, 1);
    localStorage.setItem("pedido", JSON.stringify(pedido));
    atualizarLista();
}

// ===============================
// ATUALIZAR CARRINHO
// ===============================

function atualizarLista() {

    let lista = document.getElementById("lista");
    lista.innerHTML = "";

    let totalGeral = 0;

    pedido.forEach((item, index) => {

        totalGeral += item.total;

        lista.innerHTML += `
            <div style="margin-bottom:10px;">
                <strong>${item.nome}</strong><br>
                ${item.grades} grade(s) | ${item.pecas} peças<br>
                R$ ${item.total.toLocaleString("pt-BR")} 
                <button onclick="remover(${index})">X</button>
            </div>
        `;
    });

    document.getElementById("totalPedido").innerText =
        "Total: R$ " + totalGeral.toLocaleString("pt-BR");
}

// ===============================
// SIMULAÇÃO ENVIO BLING
// ===============================

function enviarPedido() {

    if (pedido.length === 0) {
        alert("Adicione produtos ao pedido.");
        return;
    }

    let totalGeral = pedido.reduce((acc, item) => acc + item.total, 0);

    let pedidoSimulado = {
        cnpj: cnpjCliente,
        data: new Date().toLocaleString("pt-BR"),
        itens: pedido,
        total: totalGeral
    };

    console.log("===== PEDIDO ENVIADO PARA BLING (SIMULAÇÃO) =====");
    console.log(JSON.stringify(pedidoSimulado, null, 2));

    alert("Pedido enviado com sucesso para o Bling (SIMULAÇÃO).");

    // Salvar histórico
    let historico = JSON.parse(localStorage.getItem("historicoPedidos")) || [];
    historico.push(pedidoSimulado);
    localStorage.setItem("historicoPedidos", JSON.stringify(historico));

    // Limpar carrinho
    pedido = [];
    localStorage.removeItem("pedido");
    atualizarLista();
}