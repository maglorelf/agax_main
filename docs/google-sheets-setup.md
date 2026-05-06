# Configuración de Google Sheets para formularios AGAX

Esta guía explica, paso a paso, como activar o rexistro de formularios web en Google Sheets para poder reproducilo sempre.

## Resumo rápido

Hai dous formularios no proxecto:

- Lichess (Inscrición equipo online): usa a constante GOOGLE_SCRIPT_URL en [src/constants.ts](../src/constants.ts).
- Faite socio: usa a constante REXISTRO_SOCIOS_AGAX en [src/constants.ts](../src/constants.ts).

Cada formulario pode apuntar á súa propia URL de Google Apps Script (recomendado).

## Requisitos previos

- Conta de Google con acceso a Google Sheets e Apps Script.
- Permisos para crear despregues tipo Web app.
- Proxecto local funcionando.

## Opción recomendada: 2 follas, 2 scripts, 2 URLs

- Unha folla para rexistros de Lichess.
- Unha folla para altas de socio.

Isto simplifica mantemento, auditoría e exportación de datos.

---

## Parte A: Activar rexistro do formulario de Lichess

### 1) Crear folla de cálculo

1. Crea unha folla nova en Google Sheets.
2. Renomea a lapela principal como Lichess (opcional, pero recomendado).

### 2) Cargar script

1. Abre a folla.
2. Vai a Extensións > Apps Script.
3. Elimina o código por defecto.
4. Copia e pega o contido de [scripts/google-apps-script/Code.gs](../scripts/google-apps-script/Code.gs).
5. Garda.

### 3) Crear cabeceiras

1. No selector de función, escolle setupHeaders.
2. Preme Run.
3. Autoriza permisos cando os pida Google.

### 4) Despregue web

1. Preme Deploy > New deployment.
2. Tipo: Web app.
3. Execute as: Me.
4. Who has access: Anyone.
5. Preme Deploy e copia a URL final do web app.

### 5) Conectar coa web

1. Abre [src/constants.ts](../src/constants.ts).
2. Pega a URL na constante GOOGLE_SCRIPT_URL.
3. Garda.

### 6) Proba funcional

1. Arrinca a app local.
2. Entra no formulario Inscrición Equipo Online.
3. Envía un rexistro de proba.
4. Verifica que aparece unha fila nova na folla.

---

## Parte B: Activar rexistro do formulario Faite socio

### 1) Crear folla de cálculo

1. Crea outra folla nova en Google Sheets.
2. Renomea a lapela principal como Socios (opcional, recomendado).

### 2) Cargar script

1. Abre a folla.
2. Vai a Extensións > Apps Script.
3. Elimina o código por defecto.
4. Copia e pega o contido de [scripts/google-apps-script/CodeMembers.gs](../scripts/google-apps-script/CodeMembers.gs).
5. Garda.

### 3) Crear cabeceiras

1. No selector de función, escolle setupMemberHeaders.
2. Preme Run.
3. Autoriza permisos cando os pida Google.

### 4) Despregue web

1. Preme Deploy > New deployment.
2. Tipo: Web app.
3. Execute as: Me.
4. Who has access: Anyone.
5. Preme Deploy e copia a URL final do web app.

### 5) Conectar coa web

1. Abre [src/constants.ts](../src/constants.ts).
2. Substitúe o valor da constante REXISTRO_SOCIOS_AGAX pola URL creada.
3. Garda.

### 6) Proba funcional

1. Arrinca a app local.
2. Entra en Faite socio.
3. Envía unha solicitude de proba.
4. Verifica que aparece unha fila nova na folla de Socios.

---

## Como actualizar un script sen cambiar a URL

Cando modifiques un script xa despregado:

1. Vai a Extensións > Apps Script.
2. Edita o código.
3. Deploy > Manage deployments.
4. Preme no lapis do despregue actual.
5. Selecciona New version.
6. Deploy.

A URL do web app mantense.

---

## Solución de problemas

### Non se garda nada na folla

- Comproba que a URL copiada é a do Web app e non a do editor.
- Comproba permisos do despregue (Anyone).
- Revisa Execution log no editor de Apps Script.

### No formulario de socios parece que funciona pero non chega a Google

- Se REXISTRO_SOCIOS_AGAX segue en PENDENTE_DE_CONFIGURAR, a app usa modo simulado.
- Debes poñer a URL real en [src/constants.ts](../src/constants.ts).

### Cambiei o script pero non vexo cambios

- Fai redeploy con New version en Manage deployments.

---

## Checklist final

- GOOGLE_SCRIPT_URL configurada.
- REXISTRO_SOCIOS_AGAX configurada.
- setupHeaders executada na folla de Lichess.
- setupMemberHeaders executada na folla de Socios.
- Test real de envío en ambos formularios.
