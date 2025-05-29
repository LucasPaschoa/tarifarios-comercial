function calcularTarifa() {
  const servico = document.getElementById("servico").value;
  const peso = parseFloat(document.getElementById("peso").value);
  const valorDeclarado = parseFloat(document.getElementById("valorDeclarado").value || 0);

  if (servico === "funerario") return calcularFunerario(peso);
  if (servico === "premium") return calcularPremium(peso, valorDeclarado);
  if (servico === "expresso") return calcularExpresso(peso, valorDeclarado);
  if (servico === "standard") return calcularStandard(peso);
}

function calcularFunerario(peso) {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const rota = tabelaFunerario.find(r => r.origem === origem && r.destino === destino);
  if (!rota) return mostrarResultado("Rota não encontrada.");

  let valorBase = rota.minimo;
  if (peso > 6) valorBase += (peso - 6) * rota.adicional;
  const capatazia = peso * 0.20;
  const emissao = 4.00;
  const total = valorBase + capatazia + emissao;
  mostrarResultado(`Valor estimado: R$ ${total.toFixed(2)} (incluindo capatazia e emissão)`);
}

function calcularPremium(peso, valorDeclarado) {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const rota = tabelaPremium.find(r => r.origem === origem && r.destino === destino);
  if (!rota) return mostrarResultado("Rota não encontrada.");

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
  mostrarResultado(`Valor estimado: R$ ${total.toFixed(2)} (incluindo capatazia, emissão e ad-valorem)`);
}

function calcularExpresso(peso, valorDeclarado) {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const rotasPossiveis = tabelaExpresso.filter(r =>
    (r.origem === origem || r.origem === "BR") &&
    (r.destino === destino || r.destino === "BR")
  );

  if (!rotasPossiveis.length) return mostrarResultado("Rota não encontrada.");

  const tipos = ["capital", "interior", "redespacho"];
  let valores = {};

  tipos.forEach(tipo => {
    for (const rota of rotasPossiveis) {
      if (rota[tipo]) {
        let dados = rota[tipo];
        let valorBase = 0;
        if (peso <= 0.1 && dados.ate_100g) {
          valorBase = dados.ate_100g;
        } else if (peso > 0.1 && peso <= 30) {
          valorBase = dados.tarifas[Math.ceil(peso).toString()] || 0;
        } else {
          valorBase = dados.tarifas["30"] + (peso - 30) * dados.adicional;
        }
        valores[tipo] = valorBase;
        break;
      }
    }
  });

  const capatazia = peso * 0.20;
  const emissao = 4.00;
  const advalorem = valorDeclarado * 0.007;

  const capital = valores.capital || 0;
  const interior = capital + (valores.interior || 0);
  const redespacho = capital + (valores.redespacho || 0);

  const resultados = [];
  if (capital) resultados.push(`Capital: R$ ${(capital + capatazia + emissao + advalorem).toFixed(2)}`);
  if (valores.interior) resultados.push(`Interior: R$ ${(interior + capatazia + emissao + advalorem).toFixed(2)}`);
  if (valores.redespacho) resultados.push(`Redespacho: R$ ${(redespacho + capatazia + emissao + advalorem).toFixed(2)}`);

  mostrarResultado(resultados.length ? resultados.join("\n") : "Sem tarifas disponíveis para essa rota.");
}

function calcularStandard(peso) {
  const siglaOrigem = document.getElementById("sigla_origem").value.trim().toUpperCase();
  const cidadeOrigem = document.getElementById("cidade_origem").value.trim().toUpperCase();
  const ufOrigem = document.getElementById("uf_origem").value.trim().toUpperCase();
  const siglaDestino = document.getElementById("sigla_destino").value.trim().toUpperCase();
  const cidadeDestino = document.getElementById("cidade_destino").value.trim().toUpperCase();
  const ufDestino = document.getElementById("uf_destino").value.trim().toUpperCase();

  const rota = tabelaStandard.find(r =>
    (r.sigla_origem === siglaOrigem || r.cidade_origem === cidadeOrigem || r.uf_origem === ufOrigem) &&
    (r.sigla_destino === siglaDestino || r.cidade_destino === cidadeDestino || r.uf_destino === ufDestino)
  );

  if (!rota) return mostrarResultado("Rota não encontrada.");

  let valorBase = rota.minimo;
  if (peso > 10) valorBase += (peso - 10) * rota.adicional;

  const capatazia = peso * 0.20;
  const emissao = 4.00;
  const total = valorBase + capatazia + emissao;
  mostrarResultado(`Valor estimado: R$ ${total.toFixed(2)} (incluindo capatazia e emissão)`);
}

function mostrarResultado(texto) {
  document.getElementById("resultado").innerText = texto;
}

function mostrarCampoValor() {
  const servico = document.getElementById("servico").value;
  document.getElementById("valorDeclaradoContainer").style.display = (servico === "premium" || servico === "expresso") ? "block" : "none";
  document.getElementById("camposUF").style.display = (servico === "standard") ? "none" : "block";
  document.getElementById("camposStandard").style.display = (servico === "standard") ? "block" : "none";

  if (servico === "standard") {
    popularCamposStandard();
  } else {
    popularSelects();
  }
}

;
}

function popularSelects() {
  const origem = document.getElementById("origem");
  const destino = document.getElementById("destino");
  const servico = document.getElementById("servico").value;
  let dados = [];
  if (servico === "funerario") dados = tabelaFunerario;
  else if (servico === "premium") dados = tabelaPremium;
  else if (servico === "expresso") dados = tabelaExpresso;
  else return;
  const origens = [...new Set(dados.map(r => r.origem).filter(o => o !== "BR"))].sort();
  const destinos = [...new Set(dados.map(r => r.destino).filter(d => d !== "BR"))].sort();
  origem.innerHTML = '<option value=""></option>' + origens.map(o => `<option value="${o}">${o}</option>`).join('');
  destino.innerHTML = '<option value=""></option>' + destinos.map(d => `<option value="${d}">${d}</option>`).join('');
}

document.addEventListener("DOMContentLoaded", mostrarCampoValor);

function popularCamposStandard() {
  const siglaOrigem = document.getElementById("sigla_origem");
  const cidadeOrigem = document.getElementById("cidade_origem");
  const ufOrigem = document.getElementById("uf_origem");

  const siglaDestino = document.getElementById("sigla_destino");
  const cidadeDestino = document.getElementById("cidade_destino");
  const ufDestino = document.getElementById("uf_destino");

  const siglasOrigem = [...new Set(tabelaStandard.map(r => r.sigla_origem).filter(Boolean))].sort();
  const cidadesOrigem = [...new Set(tabelaStandard.map(r => r.cidade_origem).filter(Boolean))].sort();
  const ufsOrigem = [...new Set(tabelaStandard.map(r => r.uf_origem).filter(Boolean))].sort();

  const siglasDestino = [...new Set(tabelaStandard.map(r => r.sigla_destino).filter(Boolean))].sort();
  const cidadesDestino = [...new Set(tabelaStandard.map(r => r.cidade_destino).filter(Boolean))].sort();
  const ufsDestino = [...new Set(tabelaStandard.map(r => r.uf_destino).filter(Boolean))].sort();

  siglaOrigem.innerHTML = '<option value="">Selecione</option>' + siglasOrigem.map(v => `<option value="${v}">${v}</option>`).join('');
  cidadeOrigem.innerHTML = '<option value="">Selecione</option>' + cidadesOrigem.map(v => `<option value="${v}">${v}</option>`).join('');
  ufOrigem.innerHTML = '<option value="">Selecione</option>' + ufsOrigem.map(v => `<option value="${v}">${v}</option>`).join('');

  siglaDestino.innerHTML = '<option value="">Selecione</option>' + siglasDestino.map(v => `<option value="${v}">${v}</option>`).join('');
  cidadeDestino.innerHTML = '<option value="">Selecione</option>' + cidadesDestino.map(v => `<option value="${v}">${v}</option>`).join('');
  ufDestino.innerHTML = '<option value="">Selecione</option>' + ufsDestino.map(v => `<option value="${v}">${v}</option>`).join('');
}

