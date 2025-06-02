// scripts.js

function calcularTarifa() {
  const servico = document.getElementById("servico").value;
  const peso = parseFloat(document.getElementById("peso").value);
  const valorDeclarado = parseFloat(document.getElementById("valorDeclarado").value || 0);

  if (servico === "funerario") return mostrarResultado(calcularFunerario(peso));
  if (servico === "premium") return mostrarResultado(calcularPremium(peso, valorDeclarado));
  if (servico === "expresso") return mostrarResultado(calcularExpresso(peso, valorDeclarado));
  if (servico === "standard") return mostrarResultado(calcularStandard(peso));
  if (servico === "ecom") return mostrarResultado(calcularEcom(peso, valorDeclarado));
  if (servico === "servin") return mostrarResultado(calcularServin(peso, valorDeclarado));
}

function mostrarResultado(texto) {
  document.getElementById("resultado").innerText = texto;
}

function calcularFunerario(peso) {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const rota = tabelaFunerario.find(r => r.origem === origem && r.destino === destino);
  if (!rota) return "Rota não encontrada.";

  let valorBase = rota.minimo;
  if (peso > 6) valorBase += (peso - 6) * rota.adicional;
  const capatazia = peso * 0.20;
  const emissao = 4.00;
  const total = valorBase + capatazia + emissao;
  return `Valor estimado: R$ ${total.toFixed(2)} (incluindo capatazia e emissão)`;
}

function calcularPremium(peso, valorDeclarado) {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const rota = tabelaPremium.find(r => r.origem === origem && r.destino === destino);
  if (!rota) return "Rota não encontrada.";

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
  return `Valor estimado: R$ ${total.toFixed(2)} (incluindo capatazia, emissão e ad-valorem)`;
}

function calcularExpresso(peso, valorDeclarado) {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const rotasPossiveis = tabelaExpresso.filter(r =>
    (r.origem === origem || r.origem === "BR") &&
    (r.destino === destino || r.destino === "BR")
  );

  if (!rotasPossiveis.length) return "Rota não encontrada.";

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

  return resultados.length ? resultados.join("\n") : "Sem tarifas disponíveis para essa rota.";
}

function calcularStandard(peso) {
  const siglaOrigem = document.getElementById("sigla_origem").value.trim().toUpperCase();
  const siglaDestino = document.getElementById("sigla_destino").value.trim().toUpperCase();

  const rota = tabelaStandard.find(r =>
    r.sigla_origem === siglaOrigem &&
    r.sigla_destino === siglaDestino
  );

  if (!rota) return "Rota não encontrada.";

  let valorBase = rota.minimo;
  if (peso > 10) valorBase += (peso - 10) * rota.adicional;

  const capatazia = peso * 0.20;
  const emissao = 4.00;
  const total = valorBase + capatazia + emissao;
  return `Valor estimado: R$ ${total.toFixed(2)} (incluindo capatazia e emissão)`;
}

function calcularEcom(peso, valorDeclarado) {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const faixaPeso = Math.ceil(peso);
  const rota = tabelaEcom.find(r => r.origem === origem && r.destino === destino);
  if (!rota) return "Rota não encontrada.";

  let capital = rota.capital?.tarifas?.[faixaPeso] || 0;
  let interior = capital + (rota.interior?.tarifas?.[faixaPeso] || 0);
  let redespacho = capital + (rota.redespacho?.tarifas?.[faixaPeso] || 0);

  const adValorem = valorDeclarado * 0.004;
  const adCargaValor = valorDeclarado * 0.008;
  const adCargaValorInterior = valorDeclarado * 0.018;
  const adInterior = valorDeclarado * 0.009;

  const coleta = peso <= 10 ? 25 : 25 + ((peso - 10) * 0.62);
  const capatazia = peso * 0.20;
  const emissao = 3.00;

  return `Capital: R$ ${(capital + adValorem + adCargaValor + coleta + capatazia + emissao).toFixed(2)}\nInterior: R$ ${(interior + adValorem + adCargaValorInterior + adInterior + coleta + capatazia + emissao).toFixed(2)}\nRedespacho: R$ ${(redespacho + adValorem + adCargaValorInterior + adInterior + coleta + capatazia + emissao).toFixed(2)}`;
}

function calcularServin(peso, valorDeclarado) {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const faixaPeso = Math.ceil(peso);
  const rota = tabelaServin.find(r => r.origem === origem && r.destino === destino);
  if (!rota) return "Rota não encontrada.";

  let capital = rota.capital?.tarifas?.[faixaPeso] || 0;
  let interior = capital + (rota.interior?.tarifas?.[faixaPeso] || 0);
  let redespacho = capital + (rota.redespacho?.tarifas?.[faixaPeso] || 0);

  const adValorem = valorDeclarado * 0.007;
  const adCargaValor = valorDeclarado * 0.014;
  const adCargaValorInterior = valorDeclarado * 0.018;
  const adInterior = valorDeclarado * 0.009;

  const coleta = peso <= 10 ? 22.60 : 22.60 + ((peso - 10) * 0.56);
  const capatazia = peso * 0.20;
  const emissao = 4.00;
  const frap = 15.00;

  return `Capital: R$ ${(capital + adValorem + adCargaValor + coleta + capatazia + emissao + frap).toFixed(2)}\nInterior: R$ ${(interior + adValorem + adCargaValorInterior + adInterior + coleta + capatazia + emissao + frap).toFixed(2)}\nRedespacho: R$ ${(redespacho + adValorem + adCargaValorInterior + adInterior + coleta + capatazia + emissao + frap).toFixed(2)}`;
}

function popularSelects() {
  const origem = document.getElementById("origem");
  const destino = document.getElementById("destino");
  const servico = document.getElementById("servico").value;
  let dados = [];

  if (servico === "funerario") dados = tabelaFunerario;
  else if (servico === "premium") dados = tabelaPremium;
  else if (servico === "expresso") dados = tabelaExpresso;
  else if (servico === "ecom") dados = tabelaEcom;
  else if (servico === "servin") dados = tabelaServin;
  else return;

  const origens = [...new Set(dados.map(r => r.origem).filter(Boolean))].sort();
  const destinos = [...new Set(dados.map(r => r.destino).filter(Boolean))].sort();

  origem.innerHTML = '<option value=""></option>' + origens.map(o => `<option value="${o}">${o}</option>`).join('');
  destino.innerHTML = '<option value=""></option>' + destinos.map(d => `<option value="${d}">${d}</option>`).join('');
}

function popularCamposStandard() {
  const siglaOrigem = document.getElementById("sigla_origem");
  const siglaDestino = document.getElementById("sigla_destino");

  const siglasOrigem = [...new Set(tabelaStandard.map(r => r.sigla_origem).filter(Boolean))].sort();
  const siglasDestino = [...new Set(tabelaStandard.map(r => r.sigla_destino).filter(Boolean))].sort();

  siglaOrigem.innerHTML = '<option value=""></option>' + siglasOrigem.map(v => `<option value="${v}">${v}</option>`).join('');
  siglaDestino.innerHTML = '<option value=""></option>' + siglasDestino.map(v => `<option value="${v}">${v}</option>`).join('');
}

document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("servico");
  select.addEventListener("change", mostrarCampoValor);
  mostrarCampoValor();
});
