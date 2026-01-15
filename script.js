// CONFIGURAÇÕES
const WHATSAPP = "5588981550733";

// DADOS DOS PRODUTOS
const itens = {
    cash: [
        { nome: "5k Cash", preco: 7.50, img: "https://i.imgur.com/K5C6uHc.png" },
        { nome: "10k Cash", preco: 13.00, img: "https://i.imgur.com/K5C6uHc.png" },
        { nome: "15k Cash", preco: 17.00, img: "https://i.imgur.com/K5C6uHc.png" },
        { nome: "20k Cash", preco: 20.00, img: "https://i.imgur.com/K5C6uHc.png" },
        { nome: "30k Cash", preco: 30.00, img: "https://i.imgur.com/K5C6uHc.png" }
    ],
    vip: [
        { nome: "VIP Vital", preco: 10, img: "https://i.imgur.com/VRsnWvp.png" },
        { nome: "VIP Gama", preco: 20, img: "https://i.imgur.com/VRsnWvp.png" },
        { nome: "VIP Beta", preco: 40, img: "https://i.imgur.com/VRsnWvp.png" },
        { nome: "VIP Alfa", preco: 60, img: "https://i.imgur.com/VRsnWvp.png" }
    ],
    perm: [
        { nome: "Baú 1", preco: 20, img: "https://i.imgur.com/MT9HwCW.png" },
        { nome: "Baú 2", preco: 20, img: "https://i.imgur.com/MT9HwCW.png" },
        { nome: "Baú 3", preco: 20, img: "https://i.imgur.com/MT9HwCW.png" },
        { nome: "Baú 4", preco: 20, img: "https://i.imgur.com/MT9HwCW.png" },
        { nome: "Baú 5", preco: 20, img: "https://i.imgur.com/MT9HwCW.png" }
    ],
    chaves: [
        { nome: "Chave Vital", preco: 1.90, img: "https://i.postimg.cc/BbVGLw8c/file-00000000e7a071f6a0116608a976475e.png" },
        { nome: "Chave Gama", preco: 4.00, img: "https://i.postimg.cc/BbVGLw8c/file-00000000e7a071f6a0116608a976475e.png" },
        { nome: "Chave Beta", preco: 6.00, img: "https://i.postimg.cc/BbVGLw8c/file-00000000e7a071f6a0116608a976475e.png" },
        { nome: "Chave Alfa", preco: 8.00, img: "https://i.postimg.cc/BbVGLw8c/file-00000000e7a071f6a0116608a976475e.png" }
    ]
};

// CUPONS
const cupons = {
    CASTLE10: 10, VIP5: 5, VIP15: 15, CASTLEVAL15: 15,
    NATAL10: 10, ANO2025: 10, PROMO5: 5, PROMO10: 10,
    PROMO15: 15, PROMO20: 20
};

let carrinho = {};
let cupomAtivo = null;
let descontoAtivo = 0;

// TABS
function openTab(id, el) {
    document.querySelectorAll(".section").forEach(s => s.style.display = "none");
    document.getElementById(id).style.display = "block";
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    el.classList.add("active");
}

// RENDER
function render() {
    for (let aba in itens) {
        let html = "";
        itens[aba].forEach(i => {
            html += `
            <div class="item">
                <div class="item-info">
                    <img src="${i.img}">
                    <div>
                        <strong>${i.nome}</strong><br>
                        R$ ${i.preco.toFixed(2).replace(".", ",")}
                    </div>
                </div>
                <div class="controls">
                    <button class="minus" onclick="alterar('${i.nome}', -1)">-</button>
                    <span id="q-${i.nome}">0</span>
                    <button class="plus" onclick="alterar('${i.nome}', 1)">+</button>
                </div>
            </div>`;
        });
        document.getElementById(aba).innerHTML = html;
    }

    for (let aba in itens) {
        itens[aba].forEach(i => carrinho[i.nome] = 0);
    }
}

// ALTERAR
function alterar(item, v) {
    carrinho[item] = Math.max(carrinho[item] + v, 0);
    document.getElementById("q-" + item).innerText = carrinho[item];
    atualizar();
}

// CUPOM
function aplicarCupom() {
    let c = document.getElementById("cupom").value.toUpperCase();
    let msg = document.getElementById("msgCupom");

    if (!cupons[c]) {
        msg.innerText = "❌ Cupom inválido";
        msg.style.color = "#ff3333";
        cupomAtivo = null;
        descontoAtivo = 0;
    } else {
        cupomAtivo = c;
        descontoAtivo = cupons[c];
        msg.innerText = `✅ Cupom aplicado: -${descontoAtivo}%`;
        msg.style.color = "#33ff33";
    }
    atualizar();
}

// ATUALIZAR
function atualizar() {
    let total = 0;
    let lista = [];

    for (let item in carrinho) {
        if (carrinho[item] > 0) {
            let preco = Object.values(itens).flat().find(x => x.nome === item).preco;
            total += preco * carrinho[item];
            lista.push(`${carrinho[item]}x ${item}`);
        }
    }

    if (cupomAtivo) total -= total * (descontoAtivo / 100);

    document.getElementById("resumo").innerText = lista.length ? lista.join(", ") : "Nenhum item";
    document.getElementById("total").innerText = "Total: R$ " + total.toFixed(2).replace(".", ",");
}

// COMPRAR
function comprar() {
    let nick = document.getElementById("nick").value.trim();
    if (!nick) return alert("Digite seu nick!");

    let total = 0;
    let temItem = false;

    // GERA ID DO PEDIDO
    const pedidoId = "CASTLE-" + Date.now().toString().slice(-6);

    let msg = `🧾 Pedido #${pedidoId}%0A`;
    msg += `👤 Nick: ${nick}%0A%0A📦 Itens:%0A`;

    for (let item in carrinho) {
        if (carrinho[item] > 0) {
            temItem = true;
            let preco = Object.values(itens).flat().find(x => x.nome === item).preco;
            total += preco * carrinho[item];
            msg += `• ${carrinho[item]}x ${item}%0A`;
        }
    }

    // BLOQUEIA SE NÃO TIVER ITEM
    if (!temItem) {
        return alert("Adicione pelo menos um item ao carrinho!");
    }

    const totalSemDesconto = total;
    let totalComDesconto = total;

    // CUPOM
    if (cupomAtivo) {
        totalComDesconto -= totalComDesconto * (descontoAtivo / 100);
        msg += `%0A🏷️ Cupom: ${cupomAtivo} (-${descontoAtivo}%)%0A`;
    }

    msg += `%0A💰 Total sem desconto: R$ ${totalSemDesconto.toFixed(2).replace(".", ",")}%0A`;
    msg += `💸 Total com desconto: R$ ${totalComDesconto.toFixed(2).replace(".", ",")}`;

    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
    render();
    atualizar();
});