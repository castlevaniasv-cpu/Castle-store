const WHATSAPP = "5588981550733";

const itens = {
  cash: [
    { nome: "200 Cash", preco: 0.20, valor: 200, img: "https://i.imgur.com/K5C6uHc.png" },
    { nome: "500 Cash", preco: 0.50, valor: 500, img: "https://i.imgur.com/K5C6uHc.png" },
    { nome: "1k Cash", preco: 1.00, valor: 1000, img: "https://i.imgur.com/K5C6uHc.png" },
    { nome: "5k Cash", preco: 5.00, valor: 5000, img: "https://i.imgur.com/K5C6uHc.png" },
    { nome: "10k Cash", preco: 10.00, valor: 10000, img: "https://i.imgur.com/K5C6uHc.png" },
    { nome: "15k Cash", preco: 15.00, valor: 15000, img: "https://i.imgur.com/K5C6uHc.png" },
    { nome: "20k Cash", preco: 20.00, valor: 20000, img: "https://i.imgur.com/K5C6uHc.png" },
    { nome: "30k Cash", preco: 30.00, valor: 30000, img: "https://i.imgur.com/K5C6uHc.png" }
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

const cupons = { CASTLE10:10, VIP5:5, VIP15:15, CASTLEVAL15:15, NATAL10:10, ANO2025:10, PROMO5:5, PROMO10:10, PROMO15:15, PROMO20:20 };

let carrinho = {};
let cupomAtivo = null;
let descontoAtivo = 0;

function openTab(id, el) {
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  el.classList.add("active");
}

function render() {
  for (let aba in itens) {
    let html = "";
    itens[aba].forEach(i => {
      html += `
      <div class="item">
        <div class="item-info">
          <img src="${i.img}">
          <div><strong>${i.nome}</strong><br>R$ ${i.preco.toFixed(2).replace(".", ",")}</div>
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
  Object.values(itens).flat().forEach(i => carrinho[i.nome] = 0);
}

function alterar(item, v) {
  carrinho[item] = Math.max(carrinho[item] + v, 0);
  document.getElementById("q-" + item).innerText = carrinho[item];
  atualizar();
}

function aplicarCupom() {
  let c = cupom.value.toUpperCase();
  if (!cupons[c]) {
    msgCupom.innerText = "❌ Cupom inválido";
    msgCupom.style.color = "#ff3333";
    cupomAtivo = null;
    descontoAtivo = 0;
  } else {
    cupomAtivo = c;
    descontoAtivo = cupons[c];
    msgCupom.innerText = `✅ Cupom aplicado: -${descontoAtivo}%`;
    msgCupom.style.color = "#33ff33";
  }
  atualizar();
}

function atualizar() {
  let total = 0;
  let lista = [];
  let totalCash = 0;

  Object.values(itens).flat().forEach(i => {
    if (carrinho[i.nome] > 0) {
      total += i.preco * carrinho[i.nome];
      if (i.valor) totalCash += i.valor * carrinho[i.nome];
      lista.push(`${carrinho[i.nome]}x ${i.nome}`);
    }
  });

  if (totalCash > 0) lista.push(`💰 Total Cash: ${totalCash.toLocaleString("pt-BR")}`);
  if (cupomAtivo) total -= total * (descontoAtivo / 100);

  resumo.innerText = lista.length ? lista.join(", ") : "Nenhum item";
  totalEl.innerText = "Total: R$ " + total.toFixed(2).replace(".", ",");
}

function comprar() {
  let nick = nickInput.value.trim();
  if (!nick) return alert("Digite seu nick!");

  // Número do pedido
  const pedido = "CASTLE-" + Math.floor(100000 + Math.random() * 900000);

  // Data e hora
  const agora = new Date();
  const data = agora.toLocaleDateString("pt-BR");
  const hora = agora.toLocaleTimeString("pt-BR");

  let msg = `🧾 Pedido #${pedido}\n`;
  msg += `📅 Data: ${data} ⏰ ${hora}\n\n`;
  msg += `👤 Nick: ${nick}\n\n`;
  msg += `📦 Itens:\n`;

  let totalSemDesconto = 0;
  let temItem = false;

  Object.values(itens).flat().forEach(i => {
    if (carrinho[i.nome] > 0) {
      temItem = true;
      totalSemDesconto += i.preco * carrinho[i.nome];
      msg += `• ${carrinho[i.nome]}x ${i.nome}\n`;
    }
  });

  if (!temItem) return alert("Adicione pelo menos um item ao carrinho!");

  let totalComDesconto = totalSemDesconto;

  if (cupomAtivo) {
    totalComDesconto -= totalSemDesconto * (descontoAtivo / 100);
    msg += `\n🏷️ Cupom: ${cupomAtivo} (-${descontoAtivo}%)\n`;
  }

  msg += `\n💰 Total sem desconto: R$ ${totalSemDesconto.toFixed(2).replace(".", ",")}`;
  msg += `\n💸 Total com desconto: R$ ${totalComDesconto.toFixed(2).replace(".", ",")}`;

  window.open(
    `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  window.nickInput = document.getElementById("nick");
  window.resumo = document.getElementById("resumo");
  window.totalEl = document.getElementById("total");
  window.msgCupom = document.getElementById("msgCupom");
  render();
  atualizar();
});