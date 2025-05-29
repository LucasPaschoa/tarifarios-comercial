
function mostrarCampoValor() {
  const servico = document.getElementById("servico").value;
  const containerValor = document.getElementById("valorDeclaradoContainer");
  const camposStandard = document.getElementById("camposStandard");
  const camposUF = document.getElementById("camposUF");

  containerValor.style.display = (servico === "premium" || servico === "expresso" || servico === "standard") ? "block" : "none";
  camposStandard.style.display = (servico === "standard") ? "block" : "none";
  camposUF.style.display = (servico === "standard") ? "none" : "block";

  popularSelects();
}

function popularSelects() {
  const servico = document.getElementById("servico").value;

  if (servico === "standard") {
    const siglaOrigem = document.getElementById("sigla_origem");
    const cidadeOrigem = document.getElementById("cidade_origem");
    const ufOrigem = document.getElementById("uf_origem");
    const siglaDestino = document.getElementById("sigla_destino");
    const cidadeDestino = document.getElementById("cidade_destino");
    const ufDestino = document.getElementById("uf_destino");

    const siglasOrigem = [...new Set(tabelaStandard.map(r => r.sigla_origem))].sort();
    const cidadesOrigem = [...new Set(tabelaStandard.map(r => r.cidade_origem))].sort();
    const ufsOrigem = [...new Set(tabelaStandard.map(r => r.uf_origem))].sort();
    const siglasDestino = [...new Set(tabelaStandard.map(r => r.sigla_destino))].sort();
    const cidadesDestino = [...new Set(tabelaStandard.map(r => r.cidade_destino))].sort();
    const ufsDestino = [...new Set(tabelaStandard.map(r => r.uf_destino))].sort();

    siglaOrigem.innerHTML = siglasOrigem.map(s => `<option value="${s}">${s}</option>`).join("");
    cidadeOrigem.innerHTML = cidadesOrigem.map(c => `<option value="${c}">${c}</option>`).join("");
    ufOrigem.innerHTML = ufsOrigem.map(u => `<option value="${u}">${u}</option>`).join("");
    siglaDestino.innerHTML = siglasDestino.map(s => `<option value="${s}">${s}</option>`).join("");
    cidadeDestino.innerHTML = cidadesDestino.map(c => `<option value="${c}">${c}</option>`).join("");
    ufDestino.innerHTML = ufsDestino.map(u => `<option value="${u}">${u}</option>`).join("");
  } else {
    const origemSelect = document.getElementById("origem");
    const destinoSelect = document.getElementById("destino");

    let dados = servico === "premium" ? tabelaPremium : servico === "expresso" ? tabelaExpresso : tabelaFunerario;

    const origens = [...new Set(dados.map(r => r.origem).filter(o => o !== "BR"))].sort();
    const destinos = [...new Set(dados.map(r => r.destino).filter(d => d !== "BR"))].sort();

    origemSelect.innerHTML = origens.map(o => `<option value="${o}">${o}</option>`).join('');
    destinoSelect.innerHTML = destinos.map(d => `<option value="${d}">${d}</option>`).join('');
  }
}

function calcularTarifa() {
  const servico = document.getElementById("servico").value;
  const peso = parseFloat(document.getElementById("peso").value);
  const valorDeclarado = parseFloat(document.getElementById("valorDeclarado").value || 0);
  const resultado = document.getElementById("resultado");

  if (servico === "standard") {
    const sigla_origem = document.getElementById("sigla_origem").value;
    const cidade_origem = document.getElementById("cidade_origem").value;
    const uf_origem = document.getElementById("uf_origem").value;
    const sigla_destino = document.getElementById("sigla_destino").value;
    const cidade_destino = document.getElementById("cidade_destino").value;
    const uf_destino = document.getElementById("uf_destino").value;

    const origemPreenchida = [sigla_origem, cidade_origem, uf_origem].find(v => v);
    const destinoPreenchida = [sigla_destino, cidade_destino, uf_destino].find(v => v);

    if (!origemPreenchida || !destinoPreenchida) {
      resultado.innerText = "Preencha pelo menos um campo de origem e um de destino.";
      return;
    }

    const rota = tabelaStandard.find(r =>
      (sigla_origem === r.sigla_origem || cidade_origem === r.cidade_origem || uf_origem === r.uf_origem) &&
      (sigla_destino === r.sigla_destino || cidade_destino === r.cidade_destino || uf_destino === r.uf_destino)
    );

    if (!rota) return resultado.innerText = "Rota não encontrada.";

    let valorBase = rota.minimo;
    if (peso > 10) valorBase += (peso - 10) * rota.adicional;

    const adValorem = valorDeclarado * 0.004;
    const capatazia = peso * 0.20;
    const emissao = 4.00;
    const total = valorBase + adValorem + capatazia + emissao;

    resultado.innerText = `Valor estimado: R$ ${total.toFixed(2)} (inclui ad-valorem, capatazia e emissão)`;
  }

  if (servico === "funerario") {
    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;
    const rota = tabelaFunerario.find(r => r.origem === origem && r.destino === destino);
    if (!rota) return resultado.innerText = "Rota não encontrada.";

    let valorBase = rota.minimo;
    if (peso > 6) valorBase += (peso - 6) * rota.adicional;
    const capatazia = peso * 0.20;
    const emissao = 4.00;
    const total = valorBase + capatazia + emissao;

    resultado.innerText = `Valor estimado: R$ ${total.toFixed(2)} (inclui capatazia e emissão)`;
  }

  if (servico === "premium") {
    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;
    const rota = tabelaPremium.find(r => r.origem === origem && r.destino === destino);
    if (!rota) return resultado.innerText = "Rota não encontrada.";

    let valorBase = 0;
    if (peso <= 0.1 && rota.ate_100g) {
      valorBase = rota.ate_100g;
    } else if (peso > 0.1 && peso <= 30) {
      valorBase = rota.tarifas[Math.ceil(peso).toString()] || 0;
    } else {
      valorBase = rota.tarifas["30"] + (peso - 30) * rota.adicional;
    }

    const capatazia = peso * 0.20;
    const emissao = 4.00;
    const advalorem = valorDeclarado * 0.01;
    const total = valorBase + capatazia + emissao + advalorem;

    resultado.innerText = `Valor estimado: R$ ${total.toFixed(2)} (inclui capatazia, emissão e ad-valorem)`;
  }

  if (servico === "expresso") {
    const origem = document.getElementById("origem").value;
    const destino = document.getElementById("destino").value;

    const rotasPossiveis = tabelaExpresso.filter(r =>
      (r.origem === origem || r.origem === "BR") &&
      (r.destino === destino || r.destino === "BR")
    );

    if (!rotasPossiveis.length) return resultado.innerText = "Rota não encontrada.";

    const tipos = ["capital", "interior", "redespacho"];
    let resultados = [];

    tipos.forEach(tipo => {
      let dados = null;

      for (const rota of rotasPossiveis) {
        if (rota.origem === origem && rota.destino === destino && rota[tipo]) { dados = rota[tipo]; break; }
        if (rota.origem === "BR" && rota.destino === destino && rota[tipo]) { dados = rota[tipo]; break; }
        if (rota.origem === origem && rota.destino === "BR" && rota[tipo]) { dados = rota[tipo]; break; }
        if (rota.origem === "BR" && rota.destino === "BR" && rota[tipo]) { dados = rota[tipo]; break; }
      }

      if (dados) {
        let valorBase = 0;
        if (peso <= 0.1 && dados.ate_100g) {
          valorBase = dados.ate_100g;
        } else if (peso > 0.1 && peso <= 30) {
          valorBase = dados.tarifas[Math.ceil(peso).toString()] || 0;
        } else {
          valorBase = dados.tarifas["30"] + (peso - 30) * dados.adicional;
        }
        const capatazia = peso * 0.20;
        const emissao = 4.00;
        const advalorem = valorDeclarado * 0.007;
        const total = valorBase + capatazia + emissao + advalorem;
        resultados.push(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)}: R$ ${total.toFixed(2)}`);
      }
    });

    resultado.innerText = resultados.length ? resultados.join("\n") : "Sem tarifas disponíveis para essa rota.";
  }
}

window.onload = () => {
  mostrarCampoValor();
};
