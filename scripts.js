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

  return `Capital: R$ ${(capital + adValorem + adCargaValor + coleta + capatazia + emissao).toFixed(2)}
Interior: R$ ${(interior + adValorem + adCargaValorInterior + adInterior + coleta + capatazia + emissao).toFixed(2)}
Redespacho: R$ ${(redespacho + adValorem + adCargaValorInterior + adInterior + coleta + capatazia + emissao).toFixed(2)}`;
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

  return `Capital: R$ ${(capital + adValorem + adCargaValor + coleta + capatazia + emissao + frap).toFixed(2)}
Interior: R$ ${(interior + adValorem + adCargaValorInterior + adInterior + coleta + capatazia + emissao + frap).toFixed(2)}
Redespacho: R$ ${(redespacho + adValorem + adCargaValorInterior + adInterior + coleta + capatazia + emissao + frap).toFixed(2)}`;
}
