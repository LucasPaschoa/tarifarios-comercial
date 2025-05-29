// scripts.js

function calcularTarifa() {
  const servico = document.getElementById("servico").value;
  const peso = parseFloat(document.getElementById("peso").value);
  const valorDeclarado = parseFloat(document.getElementById("valorDeclarado").value || 0);

  if (servico === "funerario") return calcularFunerario(peso);
  if (servico === "premium") return calcularPremium(peso, valorDeclarado);
  if (servico === "expresso") return calcularExpresso(peso, valorDeclarado);
  if (servico === "standard") return calcularStandard(peso);
  if (servico === "ecom") return calcularEcom(peso, valorDeclarado);
  if (servico === "servin") return calcularServin(peso, valorDeclarado);
}

function mostrarResultado(texto) {
  document.getElementById("resultado").innerText = texto;
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

function calcularEcom(peso, valorDeclarado) {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const rotasPossiveis = tabelaEcom.filter(r =>
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
  const emissao = 3.00;
  const advalorem = valorDeclarado * 0.004;

  const capital = valores.capital || 0;
  const interior = capital + (valores.interior || 0);
  const redespacho = capital + (valores.redespacho || 0);

  const resultados = [];
  if (capital) resultados.push(`Capital: R$ ${(capital + capatazia + emissao + advalorem).toFixed(2)}`);
  if (valores.interior) resultados.push(`Interior: R$ ${(interior + capatazia + emissao + advalorem).toFixed(2)}`);
  if (valores.redespacho) resultados.push(`Redespacho: R$ ${(redespacho + capatazia + emissao + advalorem).toFixed(2)}`);

  mostrarResultado(resultados.length ? resultados.join("\n") : "Sem tarifas disponíveis para essa rota.");
}

function calcularServin(peso, valorDeclarado) {
  const origem = document.getElementById("origem").value;
  const destino = document.getElementById("destino").value;
  const rotasPossiveis = tabelaServin.filter(r =>
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
