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
        { nome: "Chave Vital", preco: 1.90, img: "https://bright-lime-guxcq9fajo.edgeone.app/file_00000000e7a071f6a0116608a976475e.png" },
        { nome: "Chave Gama", preco: 4.00, img: "https://bright-lime-guxcq9fajo.edgeone.app/file_00000000e7a071f6a0116608a976475e.png" },
        { nome: "Chave Beta", preco: 6.00, img: "https://bright-lime-guxcq9fajo.edgeone.app/file_00000000e7a071f6a0116608a976475e.png" },
        { nome: "Chave Alfa", preco: 8.00, img: "https://bright-lime-guxcq9fajo.edgeone.app/file_00000000e7a071f6a0116608a976475e.png" }
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

    let msg = `🛒 Pedido de Compra%0A👤 Nick: ${nick}%0A%0A📦 Itens:%0A`;
    let total = 0;

    for (let item in carrinho) {
        if (carrinho[item] > 0) {
            let preco = Object.values(itens).flat().find(x => x.nome === item).preco;
            total += preco * carrinho[item];
            msg += `• ${carrinho[item]}x ${item}%0A`;
        }
    }

    if (cupomAtivo) total -= total * (descontoAtivo / 100);
    msg += `%0A💵 Total: R$ ${total.toFixed(2).replace(".", ",")}`;

    window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank");
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
    render();
    atualizar();
});    atualizar();
}

/**
 * Aplica um cupom de desconto
 */
function aplicarCupom() {
    let cupomInput = document.getElementById("cupom").value.toUpperCase();
    let msgElement = document.getElementById("msgCupom");
    
    if (!cupomInput.trim()) {
        msgElement.innerText = "❌ Digite um cupom";
        msgElement.style.color = "#ff3333";
        cupomAtivo = null;
        descontoAtivo = 0;
        atualizar();
        return;
    }
    
    if (!cupons[cupomInput]) {
        msgElement.innerText = "❌ Cupom inválido ou expirado";
        msgElement.style.color = "#ff3333";
        cupomAtivo = null;
        descontoAtivo = 0;
        atualizar();
        return;
    }
    
    cupomAtivo = cupomInput;
    descontoAtivo = cupons[cupomInput];
    msgElement.innerText = `✅ Cupom aplicado: -${descontoAtivo}%`;
    msgElement.style.color = "#33ff33";
    atualizar();
}

/**
 * Atualiza o resumo e total do carrinho
 */
function atualizar() {
    let total = 0;
    let lista = [];
    let cashTotal = 0;
    
    // Calcula o total e monta a lista
    for (let item in carrinho) {
        if (carrinho[item] > 0) {
            // Calcula cash total se for um item de cash
            if (item.includes("Cash")) {
                let cashValue = parseInt(item);
                cashTotal += cashValue * carrinho[item];
            } else {
                lista.push(`${carrinho[item]}x ${item}`);
            }
            
            // Encontra o preço do item
            let precoItem = Object.values(itens).flat().find(x => x.nome === item).preco;
            total += precoItem * carrinho[item];
        }
    }
    
    // Adiciona cash total à lista se houver
    if (cashTotal > 0) {
        lista.unshift(`${cashTotal}k Cash`);
    }
    
    // Aplica desconto do cupom
    if (cupomAtivo) {
        total -= total * (descontoAtivo / 100);
    }
    
    // Atualiza a interface
    document.getElementById("resumo").innerText = lista.length ? lista.join(", ") : "Nenhum item";
    document.getElementById("total").innerText = "Total: R$ " + total.toFixed(2).replace(".", ",");
}

/**
 * Realiza a compra via WhatsApp
 */
function comprar() {
    let nick = document.getElementById("nick").value.trim();
    
    // Validação do nick
    if (!nick) {
        alert("Por favor, digite seu nick no servidor!");
        document.getElementById("nick").focus();
        return;
    }
    
    // Verifica se há itens no carrinho
    let carrinhoVazio = true;
    for (let item in carrinho) {
        if (carrinho[item] > 0) {
            carrinhoVazio = false;
            break;
        }
    }
    
    if (carrinhoVazio) {
        alert("Selecione pelo menos um item para comprar!");
        return;
    }
    
    // Monta a mensagem para o WhatsApp
    let mensagem = `🛒 Pedido de Compra – Loja%0A%0A`;
    
    // Adiciona o nick
    mensagem += `👤 Nick: ${nick}%0A%0A`;
    
    // Adiciona os itens à mensagem
    mensagem += `📦 Itens Solicitados:%0A`;
    
    let cashTotal = 0;
    let cashItems = [];
    let otherItems = [];
    
    // Separa itens de cash e outros itens
    for (let item in carrinho) {
        if (carrinho[item] > 0) {
            // Calcula cash total se for um item de cash
            if (item.includes("Cash")) {
                let cashValue = parseInt(item.replace("k Cash", "").replace(" Cash", ""));
                cashTotal += cashValue * carrinho[item];
            } else {
                otherItems.push(`${carrinho[item]}x ${item}`);
            }
        }
    }
    
    // Adiciona cash total à lista se houver
    if (cashTotal > 0) {
        mensagem += `• 💰 ${cashTotal.toLocaleString('pt-BR')} de Cash%0A`;
    }
    
    // Adiciona outros itens
    otherItems.forEach(item => {
        mensagem += `• ${item}%0A`;
    });
    
    // Adiciona cupom se houver
    if (cupomAtivo) {
        mensagem += `%0A🎟 Cupom Aplicado: ${cupomAtivo}%0A`;
    }
    
    // Calcula o total
    let total = 0;
    for (let item in carrinho) {
        if (carrinho[item] > 0) {
            let precoItem = Object.values(itens).flat().find(x => x.nome === item).preco;
            total += precoItem * carrinho[item];
        }
    }
    
    // Aplica desconto do cupom
    if (cupomAtivo) {
        total -= total * (descontoAtivo / 100);
    }
    
    // Adiciona o total formatado
    mensagem += `%0A💵 Valor Total: R$ ${total.toFixed(2).replace(".", ",")}%0A%0A`;
    
    // Adiciona a mensagem final
    mensagem += `✅ Aguardo a confirmação. Obrigado!`;
    
    // Abre o WhatsApp
    window.open(`https://wa.me/${WHATSAPP}?text=${mensagem}`, "_blank");
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    render();
    atualizar();
});

// CONFIGURAÇÕES DAS PARTÍCULAS
let particlesActive = false;
let particleInterval = null;
const particleSettings = {
    count: 15, // Número de partículas simultâneas
    speed: 1500, // Duração da animação em ms
    types: ['fall', 'drip'], // Tipos de animação
    colors: ['#ff0033', '#cc0022', '#990011', '#ff3355'], // Cores do sangue
    sizes: [3, 4, 5, 6], // Tamanhos das partículas
    blur: [0.3, 0.5, 0.7] // Intensidade do blur
};

/**
 * Alterna o estado das partículas
 */
function toggleParticles() {
    particlesActive = !particlesActive;
    const toggleBtn = document.querySelector('.particle-toggle');
    
    if (particlesActive) {
        toggleBtn.classList.add('active');
        startParticles();
    } else {
        toggleBtn.classList.remove('active');
        stopParticles();
    }
}

/**
 * Inicia o sistema de partículas
 */
function startParticles() {
    const container = document.getElementById('particles-container');
    
    // Limpa partículas antigas
    container.innerHTML = '';
    
    // Cria partículas em intervalos
    particleInterval = setInterval(() => {
        if (!particlesActive) return;
        
        for (let i = 0; i < particleSettings.count; i++) {
            createParticle(container);
        }
    }, 300); // Intervalo entre gerações
}

/**
 * Cria uma partícula individual
 */
function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Configurações aleatórias
    const type = particleSettings.types[Math.floor(Math.random() * particleSettings.types.length)];
    const color = particleSettings.colors[Math.floor(Math.random() * particleSettings.colors.length)];
    const size = particleSettings.sizes[Math.floor(Math.random() * particleSettings.sizes.length)];
    const blur = particleSettings.blur[Math.floor(Math.random() * particleSettings.blur.length)];
    const startX = Math.random() * 100; // Posição inicial horizontal
    const xMove = (Math.random() - 0.5) * 2; // Movimento horizontal
    const speed = particleSettings.speed * (0.8 + Math.random() * 0.4); // Variação de velocidade
    
    // Estilo da partícula
    particle.style.cssText = `
        left: ${startX}%;
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        filter: blur(${blur}px);
        --x-move: ${xMove};
        animation: ${type === 'fall' ? 'bloodFall' : 'bloodDrip'} ${speed}ms linear forwards;
    `;
    
    // Adiciona ao container
    container.appendChild(particle);
    
    // Remove a partícula após a animação
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, speed);
}

/**
 * Para o sistema de partículas
 */
function stopParticles() {
    if (particleInterval) {
        clearInterval(particleInterval);
        particleInterval = null;
    }
    
    // Remove todas as partículas após um delay
    setTimeout(() => {
        const container = document.getElementById('particles-container');
        container.innerHTML = '';
    }, 2000);
}

/**
 * Ajusta as partículas quando a janela é redimensionada
 */
window.addEventListener('resize', () => {
    if (particlesActive) {
        stopParticles();
        setTimeout(startParticles, 100);
    }
});
