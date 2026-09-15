import random
import time
import requests

# URL do seu servidor Node.js local
URL = "http://localhost:3000/receber"

print("Iniciando simulador completo dos sensores da fazenda...")

while True:
    # Sorteia qual dispositivo vai enviar dados (1: Ambiente, 2: Bebedouro, 3: Ordenha)
    dispositivo_id = random.choice([1, 2, 3])
    
    # Payload base comum
    payload = {
        "dispositivo_id": dispositivo_id,
        "temperatura": None,
        "umidade": None,
        "indice_ith": None,
        "gas_bruto": None,
        "alerta_gas": False,
        "nivel_agua": None,
        "ph_agua": None,
        "brinco_rfid_vaca": None,
        "condutividade_leite": None,
        "alerta_mastite": False
    }

    # Preenche os dados de acordo com o módulo do dispositivo
    if dispositivo_id == 1:
        # Módulo Ambiente
        temperatura = round(random.uniform(20.0, 35.0), 2)
        umidade = round(random.uniform(50.0, 90.0), 2)
        payload["temperatura"] = temperatura
        payload["umidade"] = umidade
        payload["indice_ith"] = round(0.8 * temperatura + (umidade / 100.0) * (temperatura - 14.4) + 46.4, 2)
        payload["gas_bruto"] = random.randint(1000, 3900)
        payload["alerta_gas"] = True if payload["gas_bruto"] > 3763 else False
        descricao = f"Ambiente -> Temp: {temperatura}°C"

    elif dispositivo_id == 2:
        # Módulo Bebedouro
        payload["nivel_agua"] = round(random.uniform(10.0, 100.0), 2)
        payload["ph_agua"] = round(random.uniform(6.5, 8.5), 2)
        descricao = f"Bebedouro -> Nível: {payload['nivel_agua']}% | pH: {payload['ph_agua']}"

    elif dispositivo_id == 3:
        # Módulo Ordenha
        brincos = ["BRINCO-101", "BRINCO-205", "BRINCO-309", "BRINCO-412"]
        condutividade = round(random.uniform(3.0, 8.5), 2)
        payload["brinco_rfid_vaca"] = random.choice(brincos)
        payload["condutividade_leite"] = condutividade
        payload["alerta_mastite"] = True if condutividade > 7.5 else False
        descricao = f"Ordenha -> Vaca: {payload['brinco_rfid_vaca']} | Condutividade: {condutividade}"

    try:
        # Envia os dados via POST para o Node.js
        resposta = requests.post(URL, json=payload)
        print(f"[{dispositivo_id}] Enviado! {descricao} | Status: {resposta.status_code}")
    except Exception as e:
        print("Erro ao enviar dados para o servidor:", e)

    # Espera 5 segundos para a próxima simulação
    time.sleep(5)