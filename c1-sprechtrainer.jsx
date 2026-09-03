import React, { useState, useEffect, useRef, useCallback } from "react";

/* ============================== DATEN ============================== */

const FUNKTIONEN = {
  einstieg: {
    label: "Vortrag eröffnen und gliedern",
    hinweis:
      "Die Aufgabe gibt immer vier Stichpunkte vor. Kündige also vier Teile an, nicht drei — sonst hört die Prüferin einen Bruch zwischen Ankündigung und Vortrag.",
    phrasen: [
      "Mein Vortrag beschäftigt sich mit der Frage, ob …",
      "Ich möchte heute auf das Thema … eingehen.",
      "Ich habe meinen Vortrag in vier Teile gegliedert.",
      "Zunächst … , anschließend … , und abschließend …",
      "Lassen Sie mich mit einer Beobachtung beginnen: …",
    ],
  },
  uebergang: {
    label: "Überleiten",
    hinweis: "Zählt auf das Kriterium Kohärenz. Ohne Signale wirkt der Vortrag wie eine Aufzählung.",
    phrasen: [
      "Damit komme ich zum nächsten Punkt.",
      "Soweit zu den Vorteilen – kommen wir nun zu den Schattenseiten.",
      "An dieser Stelle möchte ich noch einen weiteren Gedanken anfügen.",
      "Man darf jedoch nicht außer Acht lassen, dass …",
      "Bevor ich darauf eingehe, ein kurzer Blick auf …",
      "Das führt mich unmittelbar zur nächsten Frage: …",
    ],
  },
  beispiel: {
    label: "Ein Beispiel geben",
    hinweis: "Ein konkretes Beispiel, nicht „zum Beispiel viele Menschen“. Namen, Zahlen, Orte.",
    phrasen: [
      "Das lässt sich gut an folgendem Beispiel veranschaulichen: …",
      "Aus eigener Erfahrung kann ich sagen, dass …",
      "Studien deuten darauf hin, dass …",
      "Ein besonders anschauliches Beispiel hierfür bietet …",
      "Man denke etwa an …",
      "Exemplarisch sei hier … genannt.",
    ],
  },
  argumentieren: {
    label: "Für oder gegen etwas argumentieren",
    hinweis: "Beide Seiten benennen, dann Position beziehen. Nur Pro-Aufzählung wirkt auf C1 dünn.",
    phrasen: [
      "Für … spricht vor allem, dass …",
      "Dem lässt sich allerdings entgegenhalten, dass …",
      "Nicht zu unterschätzen ist dabei, dass …",
      "Entscheidend scheint mir weniger …, als vielmehr …",
      "Dieses Argument greift meines Erachtens zu kurz.",
      "So plausibel das zunächst klingt, so problematisch ist es bei näherem Hinsehen.",
    ],
  },
  erklaeren: {
    label: "Etwas erklären",
    hinweis: "Erst den Kern, dann die Ursache oder den Mechanismus dahinter.",
    phrasen: [
      "Worum es dabei im Kern geht, ist …",
      "Dahinter steht die Überlegung, dass …",
      "Der Begriff … bezeichnet genau genommen …",
      "Zurückführen lässt sich das im Wesentlichen auf …",
      "Das hängt unmittelbar damit zusammen, dass …",
      "Vereinfacht gesagt: …",
    ],
  },
  begruenden: {
    label: "Die eigene Haltung begründen",
    hinweis: "Position klar benennen, dann tragen, warum. Nicht „ich denke es ist gut“.",
    phrasen: [
      "Meines Erachtens überwiegen die Vorteile deutlich.",
      "Ich neige zu der Auffassung, dass …",
      "Ich bin davon überzeugt, dass …",
      "Ausschlaggebend für meine Position ist …",
      "Meine Skepsis rührt in erster Linie daher, dass …",
      "Ich halte das aus zwei Gründen für problematisch. Erstens …",
    ],
  },
  kommentieren: {
    label: "Kommentieren und sich äußern",
    hinweis: "Bewerten, nicht nur beschreiben. Ein Werturteil muss hörbar sein.",
    phrasen: [
      "Ich halte diese Entwicklung für ausgesprochen bedenklich.",
      "Bemerkenswert finde ich dabei vor allem, dass …",
      "Man kann diesem Vorgehen durchaus etwas abgewinnen.",
      "Das erscheint mir reichlich kurzsichtig.",
      "Auffällig ist, wie selten dabei … thematisiert wird.",
      "Ich stehe dem mit gemischten Gefühlen gegenüber.",
    ],
  },
  heimatland: {
    label: "Auf die Situation im Heimatland eingehen",
    hinweis: "Kommt in beiden Teilen regelmäßig vor. Einmal gründlich vorbereiten, immer wieder verwenden.",
    phrasen: [
      "Verglichen mit Deutschland stellt sich das in meinem Heimatland anders dar.",
      "In meinem Herkunftsland wird diese Debatte bislang kaum geführt.",
      "Bei uns hat sich in den letzten Jahren ein deutlicher Wandel vollzogen: …",
      "Das ist dort weniger eine Frage der Gesetzgebung als der Gewohnheit.",
      "Was mir hier besonders auffällt, ist der Unterschied zu …",
      "Ähnliches gilt für mein Heimatland, allerdings mit einer wichtigen Einschränkung: …",
    ],
  },
  vorschlag: {
    label: "Einen Vorschlag machen",
    hinweis: "Konkret und umsetzbar. Wer soll was tun?",
    phrasen: [
      "Denkbar wäre etwa, dass …",
      "Ein gangbarer Weg bestünde darin, …",
      "Ich würde dafür plädieren, zunächst …",
      "Es empfiehlt sich, in einem ersten Schritt …",
      "Sinnvoller erschiene mir folgendes Vorgehen: …",
      "Man könnte das Problem an der Wurzel packen, indem man …",
    ],
  },
  massnahmen: {
    label: "Maßnahmen vorschlagen",
    hinweis: "Mehrere Maßnahmen, nach Zuständigkeit oder Zeithorizont geordnet.",
    phrasen: [
      "Kurzfristig ließe sich … , langfristig müsste jedoch …",
      "Hier ist in erster Linie … gefragt.",
      "Erforderlich wäre vor allem …",
      "Ohne verbindliche Regelungen wird sich daran wenig ändern.",
      "Mit Appellen allein ist es nicht getan; nötig wären …",
      "Ich sehe drei Ansatzpunkte: …",
    ],
  },
  alternative: {
    label: "Eine Alternative erläutern",
    hinweis: "Die Alternative benennen und dann sagen, was sie besser macht.",
    phrasen: [
      "Als Alternative böte sich … an.",
      "Statt … zu … , könnte man ebenso gut …",
      "Ein anderer Weg, der bislang zu wenig Beachtung findet, ist …",
      "Der entscheidende Vorteil dieses Wegs liegt darin, dass …",
      "Damit ließe sich dasselbe Ziel erreichen, ohne dass …",
      "Naheliegender wäre in meinen Augen …",
    ],
  },
  ausblick: {
    label: "Mit einem Ausblick schließen",
    hinweis: "Kein neues Argument mehr. Zusammenfassen, dann nach vorn schauen.",
    phrasen: [
      "Zusammenfassend lässt sich sagen, dass …",
      "Ob sich diese Entwicklung fortsetzt, bleibt abzuwarten.",
      "Langfristig dürfte sich … durchsetzen.",
      "Ich gehe davon aus, dass uns dieses Thema noch länger beschäftigen wird.",
      "Entscheidend wird sein, ob …",
      "Damit schließe ich und freue mich auf Ihre Fragen.",
    ],
  },
  einigen: {
    label: "Sich einigen",
    hinweis: "Nur in Teil 2. Am Ende muss ein gemeinsames Ergebnis stehen — das wird bewertet.",
    phrasen: [
      "Könnten wir uns darauf verständigen, dass …?",
      "Ich schlage vor, wir halten Folgendes fest: …",
      "Damit wären wir uns in dem Punkt einig.",
      "Auf diesen Kompromiss könnte ich mich einlassen.",
      "Lassen Sie uns die beiden Vorschläge zusammenführen.",
      "Wenn Sie damit einverstanden sind, bleiben wir dabei.",
    ],
  },
  interaktion: {
    label: "Widersprechen und reagieren",
    hinweis: "Teil 2 bewertet Interaktion eigenständig: beginnen, in Gang halten, beenden.",
    phrasen: [
      "Da bin ich ganz Ihrer Meinung, allerdings …",
      "Das mag zutreffen, dennoch …",
      "Wenn ich Sie kurz unterbrechen darf …",
      "Darf ich den Gedanken noch kurz zu Ende führen?",
      "Wie stehen Sie denn dazu?",
      "Verstehe ich Sie richtig, dass Sie … für ausgeschlossen halten?",
    ],
  },
  nachfragen: {
    label: "Auf Nachfragen antworten",
    hinweis: "Nach dem Vortrag folgen rund zwei Minuten Fragen. Wird separat bewertet.",
    phrasen: [
      "Das ist ein berechtigter Einwand.",
      "Wenn ich Sie richtig verstehe, meinen Sie …",
      "Darauf bin ich vorhin nur gestreift; ausführlicher gesagt: …",
      "Diese Frage lässt sich nicht pauschal beantworten.",
      "Da muss ich Sie enttäuschen — dazu fehlen mir belastbare Zahlen.",
      "Gerade darin sehe ich den entscheidenden Punkt.",
    ],
  },
};

const AUFGABEN_T1 = [
  {
    id: "t1-vier-tage",
    titel: "Sollten Unternehmen ihren Mitarbeitenden eine Vier-Tage-Woche anbieten?",
    text: "Mehrere Betriebe in Europa haben die Arbeitszeit bei gleichem Gehalt auf vier Tage verkürzt. Die Ergebnisse fallen unterschiedlich aus: Manche berichten von zufriedeneren Beschäftigten, andere von wachsendem Druck an den verbleibenden Tagen.",
    punkte: [
      { fn: "beispiel", text: "Geben Sie ein Beispiel für ein Arbeitsmodell, das Sie kennen." },
      { fn: "argumentieren", text: "Argumentieren Sie für oder gegen die Vier-Tage-Woche." },
      { fn: "heimatland", text: "Gehen Sie auf die Arbeitszeitkultur in Ihrem Heimatland ein." },
      { fn: "ausblick", text: "Schließen Sie mit einem Ausblick auf die Arbeitswelt der Zukunft." },
    ],
  },
  {
    id: "t1-autofrei",
    titel: "Sollten Innenstädte vollständig autofrei werden?",
    text: "Einige europäische Städte haben große Teile ihres Zentrums für den Autoverkehr gesperrt. Anwohner begrüßen die ruhigeren Straßen, während Einzelhändler um ihre Kundschaft fürchten.",
    punkte: [
      { fn: "erklaeren", text: "Erklären Sie, welche Interessen hier aufeinandertreffen." },
      { fn: "beispiel", text: "Geben Sie ein Beispiel für eine Stadt, die diesen Weg gegangen ist." },
      { fn: "argumentieren", text: "Argumentieren Sie für oder gegen ein solches Verbot." },
      { fn: "massnahmen", text: "Äußern Sie sich: Mit welchen Maßnahmen ließen sich die Nachteile abfedern?" },
    ],
  },
  {
    id: "t1-ki-studium",
    titel: "Verlieren Hochschulen durch künstliche Intelligenz ihre Prüfungskultur?",
    text: "Hausarbeiten und Essays lassen sich heute weitgehend automatisiert erstellen. Manche Universitäten kehren deshalb zu mündlichen Prüfungen und handschriftlichen Klausuren zurück.",
    punkte: [
      { fn: "kommentieren", text: "Kommentieren Sie diese Rückkehr zu älteren Prüfungsformen." },
      { fn: "argumentieren", text: "Argumentieren Sie für oder gegen den Einsatz solcher Programme im Studium." },
      { fn: "alternative", text: "Erläutern Sie eine Alternative zur klassischen schriftlichen Hausarbeit." },
      { fn: "ausblick", text: "Schließen Sie mit einem Ausblick." },
    ],
  },
  {
    id: "t1-ehrenamt",
    titel: "Ist ehrenamtliches Engagement noch zeitgemäß?",
    text: "Vereine, Feuerwehren und Hilfsorganisationen finden immer schwerer Freiwillige. Jüngere Menschen engagieren sich zwar, aber seltener dauerhaft und lieber projektbezogen.",
    punkte: [
      { fn: "erklaeren", text: "Erklären Sie, woran der Rückgang liegen könnte." },
      { fn: "beispiel", text: "Geben Sie ein Beispiel für eine Form von Engagement." },
      { fn: "heimatland", text: "Gehen Sie auf die Situation in Ihrem Heimatland ein." },
      { fn: "vorschlag", text: "Machen Sie einen Vorschlag, wie sich mehr Menschen gewinnen ließen." },
    ],
  },
  {
    id: "t1-fleischsteuer",
    titel: "Sollte der Konsum von Fleisch höher besteuert werden?",
    text: "Eine höhere Abgabe auf Fleisch wird regelmäßig als Klimaschutzinstrument diskutiert. Kritiker wenden ein, dass eine solche Steuer vor allem Haushalte mit geringem Einkommen trifft.",
    punkte: [
      { fn: "argumentieren", text: "Argumentieren Sie für oder gegen eine solche Steuer." },
      { fn: "beispiel", text: "Geben Sie ein Beispiel für eine vergleichbare Lenkungsabgabe." },
      { fn: "begruenden", text: "Begründen Sie Ihre Haltung." },
      { fn: "alternative", text: "Erläutern Sie eine Alternative zur Besteuerung." },
    ],
  },
  {
    id: "t1-lebenslanges-lernen",
    titel: "Lebenslanges Lernen — Chance oder Zumutung?",
    text: "Berufe verändern sich schneller als früher. Wer mithalten will, muss sich fortlaufend weiterbilden. Manche empfinden das als Freiheit, andere als dauerhaften Leistungsdruck.",
    punkte: [
      { fn: "kommentieren", text: "Äußern Sie sich zu dieser Doppeldeutigkeit." },
      { fn: "beispiel", text: "Geben Sie ein Beispiel aus Ihrem eigenen Umfeld." },
      { fn: "massnahmen", text: "Äußern Sie sich: Wie könnten Arbeitgeber Beschäftigte dabei unterstützen?" },
      { fn: "ausblick", text: "Schließen Sie mit einem Ausblick." },
    ],
  },
  {
    id: "t1-soziales-jahr",
    titel: "Sollte ein soziales Jahr für alle jungen Menschen verpflichtend sein?",
    text: "In der Pflege, im Katastrophenschutz und in Kitas fehlt Personal. Ein Pflichtjahr wird deshalb immer wieder ins Gespräch gebracht — und ebenso regelmäßig als Eingriff in die persönliche Freiheit kritisiert.",
    punkte: [
      { fn: "argumentieren", text: "Argumentieren Sie für oder gegen eine solche Pflicht." },
      { fn: "begruenden", text: "Begründen Sie Ihre Haltung." },
      { fn: "heimatland", text: "Gehen Sie auf die Situation in Ihrem Heimatland oder einem anderen Land ein." },
      { fn: "vorschlag", text: "Machen Sie einen Vorschlag, wie sich junge Menschen freiwillig gewinnen ließen." },
    ],
  },
  {
    id: "t1-museen",
    titel: "Sollten Museen freien Eintritt anbieten?",
    text: "In einigen Ländern ist der Eintritt in staatliche Museen kostenlos. Die Besucherzahlen steigen dadurch deutlich, gleichzeitig fehlen den Häusern Einnahmen für Restaurierung und Personal.",
    punkte: [
      { fn: "erklaeren", text: "Erklären Sie, welche Funktion Museen für eine Gesellschaft haben." },
      { fn: "argumentieren", text: "Argumentieren Sie für oder gegen freien Eintritt." },
      { fn: "beispiel", text: "Geben Sie ein Beispiel für ein Museum oder eine Ausstellung." },
      { fn: "massnahmen", text: "Äußern Sie sich: Wie ließen sich die fehlenden Einnahmen ausgleichen?" },
    ],
  },
  {
    id: "t1-homeoffice",
    titel: "Ist das Arbeiten von zu Hause ein Gewinn für die Gesellschaft?",
    text: "Viele Beschäftigte arbeiten inzwischen mindestens teilweise zu Hause. Pendelwege entfallen, zugleich klagen Unternehmen über nachlassenden Zusammenhalt und schwierigere Einarbeitung neuer Kolleginnen und Kollegen.",
    punkte: [
      { fn: "beispiel", text: "Geben Sie ein Beispiel aus Ihrem eigenen Arbeits- oder Studienalltag." },
      { fn: "argumentieren", text: "Argumentieren Sie für oder gegen das Arbeiten von zu Hause." },
      { fn: "massnahmen", text: "Äußern Sie sich: Wie sollten Unternehmen darauf reagieren?" },
      { fn: "ausblick", text: "Schließen Sie mit einem Ausblick." },
    ],
  },
  {
    id: "t1-smartphone-kinder",
    titel: "Ab welchem Alter sollten Kinder ein eigenes Smartphone haben?",
    text: "Immer jüngere Kinder besitzen ein eigenes Gerät. Eltern schätzen die ständige Erreichbarkeit, Fachleute warnen vor den Folgen für Konzentration und Schlaf.",
    punkte: [
      { fn: "kommentieren", text: "Äußern Sie sich zu dieser Entwicklung." },
      { fn: "beispiel", text: "Geben Sie ein Beispiel aus Ihrem Umfeld." },
      { fn: "heimatland", text: "Gehen Sie auf die Situation in Ihrem Heimatland ein." },
      { fn: "vorschlag", text: "Machen Sie einen Vorschlag, wie Eltern damit umgehen sollten." },
    ],
  },
];

const AUFGABEN_T2 = [
  {
    id: "t2-tempo30",
    titel: "Tempo 30 in der ganzen Stadt",
    partner: "einer Nachbarin / einem Nachbarn",
    rahmen:
      "Ihre Stadt erwägt, innerorts flächendeckend Tempo 30 einzuführen. Bei einem Nachbarschaftstreffen kommen Sie darüber ins Gespräch.",
    input:
      "Ein Antrag im Stadtrat sieht vor, die zulässige Höchstgeschwindigkeit im gesamten Stadtgebiet auf 30 km/h zu senken. Befürworter verweisen auf weniger Unfälle und geringeren Lärm. Der Handelsverband warnt vor längeren Lieferzeiten.",
    punkte: [
      { fn: "kommentieren", text: "Kommentieren Sie: Was halten Sie von dem Vorhaben?" },
      { fn: "begruenden", text: "Begründen Sie Ihre Haltung." },
      { fn: "heimatland", text: "Gehen Sie auf die Situation in Ihrem Heimatland oder einem anderen Land ein." },
      { fn: "einigen", text: "Einigen Sie sich auf eine gemeinsame Stellungnahme an den Stadtrat." },
    ],
  },
  {
    id: "t2-handy-schule",
    titel: "Handyverbot an Schulen",
    partner: "einer Kollegin / einem Kollegen",
    rahmen:
      "An der Schule Ihrer Kinder wird über ein Handyverbot abgestimmt. Sie sprechen mit einer Kollegin oder einem Kollegen darüber.",
    input:
      "Mehrere Länder haben private Mobiltelefone auf dem Schulgelände untersagt. Lehrkräfte berichten von ruhigeren Pausen und mehr Gesprächen zwischen den Schülerinnen und Schülern. Elternvertretungen halten dagegen, dass Kinder im Notfall erreichbar bleiben müssen.",
    punkte: [
      { fn: "kommentieren", text: "Kommentieren Sie den Vorschlag." },
      { fn: "argumentieren", text: "Argumentieren Sie für oder gegen ein Verbot." },
      { fn: "alternative", text: "Erläutern Sie eine Alternative zum vollständigen Verbot." },
      { fn: "einigen", text: "Einigen Sie sich auf eine gemeinsame Empfehlung." },
    ],
  },
  {
    id: "t2-grossraum",
    titel: "Umzug ins Großraumbüro",
    partner: "einer Kollegin / einem Kollegen",
    rahmen:
      "Ihre Abteilung soll aus Einzelbüros in einen Großraum umziehen. Sie besprechen mit einer Kollegin oder einem Kollegen, wie Sie darauf reagieren.",
    input:
      "Die Geschäftsleitung begründet den Umzug mit kürzeren Wegen und besserem Austausch im Team. Aus der Belegschaft kommen Bedenken wegen des Lärmpegels und fehlender Vertraulichkeit bei Telefonaten.",
    punkte: [
      { fn: "kommentieren", text: "Kommentieren Sie die Entscheidung der Geschäftsleitung." },
      { fn: "begruenden", text: "Begründen Sie, welche Arbeitsbedingungen Sie für nötig halten." },
      { fn: "vorschlag", text: "Machen Sie einen Vorschlag zur Gestaltung der neuen Räume." },
      { fn: "einigen", text: "Einigen Sie sich auf Argumente für das Gespräch mit der Geschäftsleitung." },
    ],
  },
  {
    id: "t2-garten",
    titel: "Gemeinschaftsgarten im Innenhof",
    partner: "einer Nachbarin / einem Nachbarn",
    rahmen:
      "In Ihrem Mietshaus soll der Innenhof zu einem Gemeinschaftsgarten umgestaltet werden. Sie diskutieren das mit einer Nachbarin oder einem Nachbarn.",
    input:
      "Der bisher gepflasterte Innenhof dient als Stellplatz für Fahrräder und Mülltonnen. Eine Gruppe von Mietparteien möchte dort Hochbeete anlegen. Die Kosten sollen auf alle Parteien umgelegt werden.",
    punkte: [
      { fn: "kommentieren", text: "Kommentieren Sie das Vorhaben." },
      { fn: "argumentieren", text: "Argumentieren Sie für oder gegen die Umgestaltung." },
      { fn: "vorschlag", text: "Machen Sie einen Vorschlag zur Kostenverteilung." },
      { fn: "einigen", text: "Einigen Sie sich auf ein gemeinsames Vorgehen." },
    ],
  },
  {
    id: "t2-ki-hausarbeit",
    titel: "Künstliche Intelligenz in Hausarbeiten",
    partner: "einer Kommilitonin / einem Kommilitonen",
    rahmen:
      "Ihr Institut überarbeitet seine Prüfungsordnung. Sie diskutieren mit einer Kommilitonin oder einem Kommilitonen über den Umgang mit KI-Programmen.",
    input:
      "Der Entwurf sieht vor, den Einsatz von Sprachmodellen bei Hausarbeiten vollständig zu untersagen. Andere Fakultäten verlangen stattdessen nur eine Offenlegung der verwendeten Hilfsmittel.",
    punkte: [
      { fn: "kommentieren", text: "Kommentieren Sie den Entwurf." },
      { fn: "begruenden", text: "Begründen Sie Ihre Haltung." },
      { fn: "alternative", text: "Erläutern Sie eine Alternative zum vollständigen Verbot." },
      { fn: "einigen", text: "Einigen Sie sich auf eine gemeinsame Rückmeldung an das Institut." },
    ],
  },
  {
    id: "t2-weiterbildung",
    titel: "Weiterbildung in der Arbeitszeit",
    partner: "einer Kollegin / einem Kollegen",
    rahmen:
      "Ihr Betriebsrat sammelt Vorschläge zur Weiterbildung. Sie besprechen das Thema mit einer Kollegin oder einem Kollegen.",
    input:
      "Bislang finden Fortbildungen in der Freizeit statt und werden anteilig bezuschusst. Ein Vorschlag sieht vor, jährlich fünf bezahlte Arbeitstage dafür freizustellen. Die Geschäftsleitung verweist auf Personalengpässe.",
    punkte: [
      { fn: "kommentieren", text: "Kommentieren Sie den Vorschlag." },
      { fn: "argumentieren", text: "Argumentieren Sie für oder gegen bezahlte Freistellung." },
      { fn: "heimatland", text: "Gehen Sie auf die Situation in Ihrem Heimatland oder einem anderen Land ein." },
      { fn: "einigen", text: "Einigen Sie sich auf einen gemeinsamen Vorschlag an den Betriebsrat." },
    ],
  },
];

/* ============================== HILFSMITTEL ============================== */

const zeit = (s) => {
  const m = Math.floor(Math.abs(s) / 60);
  const r = Math.abs(s) % 60;
  return `${s < 0 ? "−" : ""}${m}:${String(r).padStart(2, "0")}`;
};

const zufall = (arr, ausser) => {
  const pool = arr.filter((a) => a.id !== ausser);
  return pool[Math.floor(Math.random() * pool.length)];
};

async function claude(messages, system, maxTokens = 1000) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });
  if (!res.ok) throw new Error("Antwort nicht erhalten");
  const data = await res.json();
  return data.content
    .map((c) => (c.type === "text" ? c.text : ""))
    .filter(Boolean)
    .join("\n");
}

/* ============================== STIL ============================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap');

.st { --papier:#E9EBEE; --blatt:#FFFFFF; --tinte:#141C28; --grau:#5E6775;
      --linie:#CBD0D8; --signal:#9C2A1F; --gut:#2C6149; --gelb:#B47516;
      --serif:"Source Serif 4",Georgia,serif; --sans:"IBM Plex Sans",system-ui,sans-serif;
      font-family:var(--sans); color:var(--tinte); background:var(--papier);
      min-height:100%; font-size:15px; line-height:1.55; }
.st *{box-sizing:border-box}
.st button{font:inherit;cursor:pointer;border:none;background:none;color:inherit}
.st button:focus-visible,.st textarea:focus-visible{outline:2px solid var(--tinte);outline-offset:2px}
.wrap{max-width:720px;margin:0 auto;padding:28px 20px 64px}
.kopf{display:flex;align-items:baseline;justify-content:space-between;gap:16px;
      border-bottom:1px solid var(--linie);padding-bottom:12px;margin-bottom:28px}
.marke{font-family:var(--serif);font-size:19px;font-weight:600;letter-spacing:-.01em}
.nav{display:flex;gap:2px}
.nav button{padding:5px 11px;border-radius:3px;color:var(--grau);font-size:13.5px}
.nav button:hover{color:var(--tinte)}
.nav button[data-an="1"]{background:var(--tinte);color:#fff}
.blatt{background:var(--blatt);border:1px solid var(--linie);border-radius:4px;padding:24px}
.h1{font-family:var(--serif);font-size:27px;line-height:1.25;font-weight:600;margin:0 0 12px;letter-spacing:-.015em}
.h2{font-family:var(--serif);font-size:20px;font-weight:600;margin:0 0 10px}
.lauf{font-family:var(--serif);font-size:16.5px;line-height:1.62;color:#2A3140;margin:0 0 20px;max-width:62ch}
.klein{font-size:13px;color:var(--grau)}
.rolle{font-size:12.5px;color:var(--grau);margin-bottom:6px}
.uhr{font-variant-numeric:tabular-nums;font-weight:500;letter-spacing:-.02em}
.knopf{background:var(--tinte);color:#fff;padding:11px 20px;border-radius:3px;font-weight:500;font-size:14.5px}
.knopf:hover{background:#000}
.knopf.leer{background:none;color:var(--tinte);border:1px solid var(--linie)}
.knopf.leer:hover{background:#F1F3F6}
.knopf.warn{background:var(--signal)}
.knopf:disabled{opacity:.45;cursor:not-allowed}
.reihe{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.punktliste{list-style:none;padding:0;margin:0 0 22px;border-top:1px solid var(--linie)}
.punktliste li{display:flex;gap:14px;padding:11px 2px;border-bottom:1px solid var(--linie);align-items:baseline}
.nr{font-variant-numeric:tabular-nums;color:var(--grau);font-size:13px;min-width:14px}
.notiz{width:100%;min-height:190px;border:1px solid var(--linie);border-radius:3px;padding:14px;
       font-family:var(--serif);font-size:16px;line-height:1.7;resize:vertical;background:#FCFCFD;color:var(--tinte)}
.balken{height:5px;background:var(--linie);border-radius:99px;overflow:hidden}
.balken i{display:block;height:100%;background:var(--tinte);transition:width .5s linear}
.balken.eilt i{background:var(--signal)}
.spur{border-top:1px solid var(--linie)}
.spur button{display:block;width:100%;text-align:left;padding:13px 0;border-bottom:1px solid var(--linie);position:relative}
.spur button:hover .fnname{color:#000}
.spurkopf{display:flex;gap:12px;align-items:baseline}
.fnname{font-size:14.5px;color:var(--grau);flex:1}
.spur button[data-an="1"] .fnname{color:var(--tinte);font-weight:500}
.spur button[data-fertig="1"] .fnname{color:var(--tinte)}
.spurzeit{font-variant-numeric:tabular-nums;font-size:13px;color:var(--grau)}
.spurbalken{height:3px;background:#EDEFF2;margin-top:8px;border-radius:99px;overflow:hidden}
.spurbalken i{display:block;height:100%;background:var(--gut);transition:width .4s linear}
.spur button[data-an="1"] .spurbalken i{background:var(--gelb)}
.hilfe{background:#F4F6F8;border-left:2px solid var(--linie);padding:12px 14px;margin-top:18px;border-radius:0 3px 3px 0}
.hilfe p{margin:0 0 5px;font-family:var(--serif);font-size:15px;color:#2A3140}
.hilfe p:last-child{margin:0}
.gross{font-size:56px;font-weight:500;letter-spacing:-.03em;font-variant-numeric:tabular-nums;line-height:1}
.gross.eilt{color:var(--signal)}
.chat{display:flex;flex-direction:column;gap:14px;margin-bottom:18px}
.bl{max-width:80%;padding:11px 14px;border-radius:10px;font-family:var(--serif);font-size:15.5px;line-height:1.55}
.bl.ich{align-self:flex-end;background:var(--tinte);color:#fff;border-bottom-right-radius:3px}
.bl.du{align-self:flex-start;background:#F1F3F6;border-bottom-left-radius:3px}
.fnkarte{border-top:1px solid var(--linie);padding:16px 0}
.fnkarte h3{font-family:var(--serif);font-size:17px;margin:0 0 4px;font-weight:600}
.fnkarte ul{margin:10px 0 0;padding-left:18px}
.fnkarte li{font-family:var(--serif);font-size:15.5px;line-height:1.6;margin-bottom:4px;color:#2A3140}
.hist{border-top:1px solid var(--linie);padding:10px 0;display:flex;justify-content:space-between;gap:12px;font-size:13.5px}
@media(max-width:560px){.wrap{padding:20px 14px 48px}.h1{font-size:23px}.gross{font-size:44px}.blatt{padding:18px}}
@media(prefers-reduced-motion:reduce){.st *{transition:none!important}}
`;

/* ============================== APP ============================== */

export default function App() {
  const [ansicht, setAnsicht] = useState("start");
  const [teil, setTeil] = useState(1);
  const [aufgabe, setAufgabe] = useState(null);
  const [notizen, setNotizen] = useState("");
  const [vorbei, setVorbei] = useState(null);
  const [verlauf, setVerlauf] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("verlauf");
        if (r) setVerlauf(JSON.parse(r.value));
      } catch (e) {
        /* noch nichts gespeichert */
      }
    })();
  }, []);

  const speichern = useCallback(async (eintrag) => {
    const neu = [eintrag, ...verlauf].slice(0, 30);
    setVerlauf(neu);
    try {
      await window.storage.set("verlauf", JSON.stringify(neu));
    } catch (e) {
      /* Speichern fehlgeschlagen, Sitzung läuft weiter */
    }
  }, [verlauf]);

  const starten = (t) => {
    const pool = t === 1 ? AUFGABEN_T1 : AUFGABEN_T2;
    setTeil(t);
    setAufgabe(zufall(pool, aufgabe?.id));
    setNotizen("");
    setVorbei(null);
    setAnsicht("vorbereitung");
  };

  return (
    <div className="st">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wrap">
        <header className="kopf">
          <span className="marke">Sprechtrainer C1</span>
          <nav className="nav">
            {[
              ["start", "Üben"],
              ["redemittel", "Redemittel"],
              ["verlauf", "Verlauf"],
            ].map(([k, l]) => (
              <button key={k} data-an={ansicht === k ? "1" : "0"} onClick={() => setAnsicht(k)}>
                {l}
              </button>
            ))}
          </nav>
        </header>

        {ansicht === "start" && <Start starten={starten} verlauf={verlauf} />}
        {ansicht === "vorbereitung" && (
          <Vorbereitung
            teil={teil}
            aufgabe={aufgabe}
            notizen={notizen}
            setNotizen={setNotizen}
            weiter={() => setAnsicht(teil === 1 ? "vortrag" : "diskussion")}
            zurueck={() => setAnsicht("start")}
          />
        )}
        {ansicht === "vortrag" && (
          <Vortrag
            aufgabe={aufgabe}
            fertig={(d) => {
              setVorbei(d);
              setAnsicht("auswertung");
            }}
          />
        )}
        {ansicht === "diskussion" && (
          <Diskussion aufgabe={aufgabe} notizen={notizen} beenden={() => setAnsicht("start")} />
        )}
        {ansicht === "auswertung" && (
          <Auswertung
            aufgabe={aufgabe}
            daten={vorbei}
            notizen={notizen}
            speichern={speichern}
            nochmal={() => starten(1)}
            heim={() => setAnsicht("start")}
          />
        )}
        {ansicht === "redemittel" && <Redemittel />}
        {ansicht === "verlauf" && <Verlauf verlauf={verlauf} />}
      </div>
    </div>
  );
}

/* ------------------------------ Start ------------------------------ */

function Start({ starten, verlauf }) {
  const letzte = verlauf[0];
  return (
    <>
      <h1 className="h1">Zwei Aufgaben, zwanzig Minuten Vorbereitung, zehn Minuten Sprechen.</h1>
      <p className="lauf">
        Die Prüfung scheitert selten am Wortschatz. Sie scheitert daran, dass einer der vier
        Stichpunkte unter Zeitdruck untergeht — und Aufgabenerfüllung wiegt am schwersten. Dieser
        Trainer hält die vier Punkte während des Sprechens sichtbar und zeigt hinterher, wohin die
        Zeit gegangen ist.
      </p>

      <div className="blatt" style={{ marginBottom: 16 }}>
        <div className="rolle">Teil 1 · Vortrag · ca. 5 Minuten</div>
        <div className="h2">Allein vor Publikum sprechen</div>
        <p className="klein" style={{ margin: "0 0 16px", maxWidth: "56ch" }}>
          Ein Thema, vier Stichpunkte, freier Vortrag mit Gliederung. Danach folgen Nachfragen.
        </p>
        <button className="knopf" onClick={() => starten(1)}>
          Vortrag üben
        </button>
      </div>

      <div className="blatt">
        <div className="rolle">Teil 2 · Diskussion · ca. 5 Minuten</div>
        <div className="h2">Gegen einen Gesprächspartner argumentieren</div>
        <p className="klein" style={{ margin: "0 0 16px", maxWidth: "56ch" }}>
          Kontroverse Frage, kurzer Inputtext, vier Stichpunkte. Am Ende muss eine Einigung stehen.
          Den Gegenpart übernimmt hier Claude.
        </p>
        <button className="knopf" onClick={() => starten(2)}>
          Diskussion üben
        </button>
      </div>

      {letzte && (
        <p className="klein" style={{ marginTop: 22 }}>
          Zuletzt: {letzte.titel} — {letzte.abgedeckt} von 4 Punkten in {zeit(letzte.gesamt)}.
        </p>
      )}

      <div className="hilfe" style={{ marginTop: 26 }}>
        <p>
          Ton nimmst du mit dem Handy auf. Danach die Aufnahme abtippen oder diktieren und in der
          Auswertung einfügen — dort bewertet Claude sie nach den offiziellen Kriterien.
        </p>
      </div>
    </>
  );
}

/* --------------------------- Vorbereitung --------------------------- */

function Vorbereitung({ teil, aufgabe, notizen, setNotizen, weiter, zurueck }) {
  const [rest, setRest] = useState(20 * 60);
  const [laeuft, setLaeuft] = useState(false);

  useEffect(() => {
    if (!laeuft) return;
    const t = setInterval(() => setRest((r) => r - 1), 1000);
    return () => clearInterval(t);
  }, [laeuft]);

  return (
    <>
      <div className="rolle">
        {teil === 1 ? "Teil 1 · Vortrag halten" : "Teil 2 · Diskussion führen"} · Vorbereitung
      </div>
      <h1 className="h1">{aufgabe.titel}</h1>

      {teil === 2 && <p className="klein" style={{ margin: "-4px 0 16px" }}>{aufgabe.rahmen}</p>}
      <p className="lauf">{teil === 1 ? aufgabe.text : aufgabe.input}</p>

      <ol className="punktliste">
        {aufgabe.punkte.map((p, i) => (
          <li key={i}>
            <span className="nr">{i + 1}</span>
            <span>{p.text}</span>
          </li>
        ))}
      </ol>

      <div className="reihe" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <span className={`uhr gross ${rest < 120 ? "eilt" : ""}`} style={{ fontSize: 34 }}>
          {zeit(rest)}
        </span>
        {!laeuft ? (
          <button className="knopf leer" onClick={() => setLaeuft(true)}>
            Vorbereitungszeit starten
          </button>
        ) : (
          <span className="klein">Notizen sind erlaubt, Ablesen nicht.</span>
        )}
      </div>
      <div className="balken" style={{ marginBottom: 22 }}>
        <i style={{ width: `${Math.max(0, (rest / (20 * 60)) * 100)}%` }} />
      </div>

      <textarea
        className="notiz"
        value={notizen}
        placeholder="Stichworte, Beispiele, Zahlen. In der Prüfung darfst du sie mitnehmen — aber frei sprechen."
        onChange={(e) => setNotizen(e.target.value)}
      />

      <div className="reihe" style={{ marginTop: 18 }}>
        <button className="knopf" onClick={weiter}>
          {teil === 1 ? "Vortrag beginnen" : "Diskussion beginnen"}
        </button>
        <button className="knopf leer" onClick={zurueck}>
          Andere Aufgabe
        </button>
      </div>
    </>
  );
}

/* ------------------------------ Vortrag ------------------------------ */

function Vortrag({ aufgabe, fertig }) {
  const ZIEL = 5 * 60;
  const [s, setS] = useState(0);
  const [aktiv, setAktiv] = useState(null);
  const [pro, setPro] = useState([0, 0, 0, 0]);
  const aktivRef = useRef(null);
  aktivRef.current = aktiv;

  useEffect(() => {
    const t = setInterval(() => {
      setS((x) => x + 1);
      const a = aktivRef.current;
      if (a !== null) setPro((p) => p.map((v, i) => (i === a ? v + 1 : v)));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const offen = pro.filter((v) => v === 0).length;
  const eilt = s > ZIEL - 60 && offen > 0;
  const fn = aktiv !== null ? FUNKTIONEN[aufgabe.punkte[aktiv].fn] : null;

  return (
    <>
      <div className="rolle">Teil 1 · Vortrag · {aufgabe.titel}</div>

      <div className="reihe" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
        <span className={`gross uhr ${eilt ? "eilt" : ""}`}>{zeit(s)}</span>
        <span className="klein uhr">Ziel 5:00</span>
      </div>
      <div className={`balken ${eilt ? "eilt" : ""}`} style={{ marginBottom: 26 }}>
        <i style={{ width: `${Math.min(100, (s / ZIEL) * 100)}%` }} />
      </div>

      <p className="klein" style={{ margin: "0 0 8px" }}>
        Tippe den Punkt an, über den du gerade sprichst.
      </p>
      <div className="spur">
        {aufgabe.punkte.map((p, i) => (
          <button
            key={i}
            data-an={aktiv === i ? "1" : "0"}
            data-fertig={pro[i] > 0 ? "1" : "0"}
            onClick={() => setAktiv(aktiv === i ? null : i)}
          >
            <span className="spurkopf">
              <span className="nr">{i + 1}</span>
              <span className="fnname">{FUNKTIONEN[p.fn].label}</span>
              <span className="spurzeit uhr">{pro[i] > 0 ? zeit(pro[i]) : "—"}</span>
            </span>
            <span className="spurbalken">
              <i style={{ width: `${Math.min(100, (pro[i] / 75) * 100)}%` }} />
            </span>
          </button>
        ))}
      </div>

      {fn && (
        <div className="hilfe">
          {fn.phrasen.slice(0, 4).map((x, i) => (
            <p key={i}>{x}</p>
          ))}
        </div>
      )}

      {eilt && (
        <p className="klein" style={{ color: "var(--signal)", marginTop: 16 }}>
          Noch {offen} {offen === 1 ? "Punkt" : "Punkte"} offen. Ein unbearbeiteter Stichpunkt kostet
          mehr als jeder Grammatikfehler.
        </p>
      )}

      <div className="reihe" style={{ marginTop: 24 }}>
        <button
          className={`knopf ${offen > 0 ? "warn" : ""}`}
          onClick={() => fertig({ gesamt: s, pro })}
        >
          Vortrag beenden
        </button>
      </div>
    </>
  );
}

/* ---------------------------- Auswertung ---------------------------- */

function Auswertung({ aufgabe, daten, notizen, speichern, nochmal, heim }) {
  const { gesamt, pro } = daten;
  const abgedeckt = pro.filter((v) => v > 0).length;
  const [text, setText] = useState("");
  const [antwort, setAntwort] = useState("");
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState("");
  const gemerkt = useRef(false);

  useEffect(() => {
    if (gemerkt.current) return;
    gemerkt.current = true;
    speichern({
      id: aufgabe.id,
      titel: aufgabe.titel,
      gesamt,
      abgedeckt,
      datum: new Date().toISOString(),
    });
  }, []);

  const bewerten = async () => {
    setLaedt(true);
    setFehler("");
    setAntwort("");
    try {
      const out = await claude(
        [
          {
            role: "user",
            content: `Aufgabe: ${aufgabe.titel}\n\nStichpunkte:\n${aufgabe.punkte
              .map((p, i) => `${i + 1}. ${p.text}`)
              .join("\n")}\n\nSprechdauer: ${zeit(gesamt)}\n\nTranskript:\n${text}`,
          },
        ],
        `Du bewertest einen Vortrag für Teil 1 des Moduls Sprechen im Goethe-Zertifikat C1 (Fassung ab 2024). Antworte auf Deutsch, sachlich, ohne Lob-Floskeln.

Gliedere so:

**Aufgabenerfüllung**
Gehe jeden der vier Stichpunkte einzeln durch. Schreibe je Punkt: erfüllt / teilweise / nicht erfüllt, mit einer Begründung in einem Satz. Weise darauf hin, dass ein mit E bewertetes Kriterium Aufgabenerfüllung die gesamte Aufgabe auf null Punkte setzt, falls ein Punkt fehlt.

**Kohärenz**
Aufbau, Verknüpfung, Flüssigkeit. Nenne konkret, welche Gliederungssignale gefehlt haben.

**Wortschatz und Strukturen**
Nenne höchstens fünf Stellen, an denen eine C1-Formulierung möglich gewesen wäre. Format: „statt X → besser Y".

**Register**
Passt die Sprache zur Situation eines Seminarvortrags?

**Das Wichtigste beim nächsten Mal**
Ein einziger Satz.

Sei streng. C1 verlangt breites, differenziertes Spektrum, nicht Fehlerfreiheit auf B2-Niveau.`,
        1600
      );
      setAntwort(out);
    } catch (e) {
      setFehler("Die Bewertung ist nicht durchgekommen. Versuch es noch einmal.");
    }
    setLaedt(false);
  };

  return (
    <>
      <div className="rolle">Auswertung</div>
      <h1 className="h1">
        {abgedeckt} von 4 Punkten, {zeit(gesamt)} gesprochen.
      </h1>
      <p className="lauf">
        {abgedeckt < 4
          ? "Ein nicht bearbeiteter Stichpunkt zieht die Aufgabenerfüllung nach unten — und damit die ganze Aufgabe. Das ist der teuerste Fehler in diesem Prüfungsteil."
          : gesamt < 240
          ? "Alle vier Punkte behandelt, aber deutlich unter fünf Minuten. Kürze wirkt schnell wie dünner Inhalt."
          : "Alle vier Punkte behandelt und die Zeit gehalten. Jetzt zählt die Verteilung."}
      </p>

      <div className="spur" style={{ marginBottom: 24 }}>
        {aufgabe.punkte.map((p, i) => (
          <div key={i} style={{ padding: "13px 0", borderBottom: "1px solid var(--linie)" }}>
            <span className="spurkopf">
              <span className="nr">{i + 1}</span>
              <span className="fnname" style={{ color: pro[i] ? "var(--tinte)" : "var(--signal)" }}>
                {FUNKTIONEN[p.fn].label}
              </span>
              <span className="spurzeit uhr">{pro[i] ? zeit(pro[i]) : "nicht behandelt"}</span>
            </span>
            <span className="spurbalken">
              <i
                style={{
                  width: `${gesamt ? (pro[i] / gesamt) * 100 : 0}%`,
                  background: pro[i] ? "var(--gut)" : "var(--signal)",
                }}
              />
            </span>
          </div>
        ))}
      </div>

      <div className="h2">Transkript bewerten lassen</div>
      <p className="klein" style={{ margin: "0 0 10px", maxWidth: "56ch" }}>
        Aufnahme abtippen oder per Spracheingabe diktieren. Auch ein unsauberes Transkript reicht für
        eine brauchbare Rückmeldung.
      </p>
      <textarea
        className="notiz"
        style={{ minHeight: 150 }}
        value={text}
        placeholder="Hier das Gesprochene einfügen …"
        onChange={(e) => setText(e.target.value)}
      />
      <div className="reihe" style={{ marginTop: 14 }}>
        <button className="knopf" disabled={!text.trim() || laedt} onClick={bewerten}>
          {laedt ? "Wird bewertet …" : "Nach den Prüfungskriterien bewerten"}
        </button>
        <button className="knopf leer" onClick={nochmal}>
          Nächste Aufgabe
        </button>
        <button className="knopf leer" onClick={heim}>
          Zur Übersicht
        </button>
      </div>
      {fehler && (
        <p className="klein" style={{ color: "var(--signal)", marginTop: 12 }}>
          {fehler}
        </p>
      )}
      {antwort && (
        <div className="blatt" style={{ marginTop: 20 }}>
          <Markdownish text={antwort} />
        </div>
      )}
    </>
  );
}

/* ---------------------------- Diskussion ---------------------------- */

function Diskussion({ aufgabe, notizen, beenden }) {
  const [verlauf, setVerlauf] = useState([]);
  const [eingabe, setEingabe] = useState("");
  const [laedt, setLaedt] = useState(false);
  const [s, setS] = useState(0);
  const [bericht, setBericht] = useState("");

  useEffect(() => {
    const t = setInterval(() => setS((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const system = `Du übernimmst die Rolle der Gesprächspartnerin oder des Gesprächspartners in Teil 2 des Moduls Sprechen im Goethe-Zertifikat C1.

Situation: ${aufgabe.rahmen}
Inputtext: ${aufgabe.input}
Stichpunkte: ${aufgabe.punkte.map((p) => p.text).join(" | ")}

Regeln:
- Sprich ausschließlich Deutsch auf C1-Niveau, natürlich und nicht lehrbuchhaft.
- Vertritt konsequent die Gegenposition zur lernenden Person und gib sie nicht zu schnell auf.
- Halte dich kurz: zwei bis vier Sätze pro Beitrag. Du bist Gesprächspartner, nicht Vortragender.
- Stell regelmäßig Rückfragen, damit das Gespräch in Gang bleibt.
- Korrigiere keine Sprachfehler und fall nie aus der Rolle.
- Wenn die lernende Person auf eine Einigung zusteuert, geh darauf ein, aber verlange einen echten Kompromiss.
- Beginne das Gespräch selbst, wenn noch nichts gesagt wurde.`;

  const senden = async (erst = false) => {
    const neu = erst ? [] : [...verlauf, { role: "user", content: eingabe }];
    if (!erst) setEingabe("");
    setVerlauf(neu);
    setLaedt(true);
    try {
      const out = await claude(
        neu.length ? neu : [{ role: "user", content: "Fang du an." }],
        system,
        400
      );
      setVerlauf([...neu, { role: "assistant", content: out }]);
    } catch (e) {
      setVerlauf([
        ...neu,
        { role: "assistant", content: "(Verbindung unterbrochen — schick die Nachricht noch einmal.)" },
      ]);
    }
    setLaedt(false);
  };

  useEffect(() => {
    senden(true);
  }, []);

  const auswerten = async () => {
    setLaedt(true);
    try {
      const out = await claude(
        [
          {
            role: "user",
            content:
              `Stichpunkte:\n${aufgabe.punkte.map((p, i) => `${i + 1}. ${p.text}`).join("\n")}\n\n` +
              `Gespräch:\n${verlauf
                .map((m) => `${m.role === "user" ? "LERNENDE PERSON" : "PARTNER"}: ${m.content}`)
                .join("\n")}`,
          },
        ],
        `Bewerte die Beiträge der lernenden Person in Teil 2 des Moduls Sprechen im Goethe-Zertifikat C1. Auf Deutsch, sachlich, ohne Lob-Floskeln.

**Aufgabenerfüllung** — jeden der vier Stichpunkte einzeln: erfüllt / teilweise / nicht erfüllt.
**Interaktion** — Gespräch beginnen, in Gang halten, beenden, Reaktionsfähigkeit. Wurde am Ende wirklich eine Einigung erzielt?
**Wortschatz und Strukturen** — höchstens fünf Verbesserungen im Format „statt X → besser Y".
**Register** — situations- und partneradäquat?
**Das Wichtigste beim nächsten Mal** — ein Satz.`,
        1400
      );
      setBericht(out);
    } catch (e) {
      setBericht("Die Auswertung ist nicht durchgekommen.");
    }
    setLaedt(false);
  };

  return (
    <>
      <div className="reihe" style={{ justifyContent: "space-between", marginBottom: 4 }}>
        <span className="rolle">Teil 2 · Diskussion mit {aufgabe.partner}</span>
        <span className={`uhr klein ${s > 300 ? "" : ""}`} style={{ color: s > 300 ? "var(--signal)" : undefined }}>
          {zeit(s)} / 5:00
        </span>
      </div>
      <h2 className="h2" style={{ marginBottom: 14 }}>{aufgabe.titel}</h2>

      <div className="spur" style={{ marginBottom: 20 }}>
        {aufgabe.punkte.map((p, i) => (
          <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid var(--linie)" }}>
            <span className="spurkopf">
              <span className="nr">{i + 1}</span>
              <span className="fnname">{p.text}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="chat">
        {verlauf.map((m, i) => (
          <div key={i} className={`bl ${m.role === "user" ? "ich" : "du"}`}>
            {m.content}
          </div>
        ))}
        {laedt && <div className="bl du klein">…</div>}
      </div>

      <textarea
        className="notiz"
        style={{ minHeight: 90 }}
        value={eingabe}
        placeholder="Deine Antwort — laut mitsprechen, nicht nur tippen."
        onChange={(e) => setEingabe(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && eingabe.trim()) senden();
        }}
      />
      <div className="reihe" style={{ marginTop: 12 }}>
        <button className="knopf" disabled={!eingabe.trim() || laedt} onClick={() => senden()}>
          Antworten
        </button>
        <button className="knopf leer" disabled={verlauf.length < 4 || laedt} onClick={auswerten}>
          Diskussion auswerten
        </button>
        <button className="knopf leer" onClick={beenden}>
          Abbrechen
        </button>
      </div>

      {bericht && (
        <div className="blatt" style={{ marginTop: 20 }}>
          <Markdownish text={bericht} />
        </div>
      )}
    </>
  );
}

/* ---------------------------- Redemittel ---------------------------- */

function Redemittel() {
  const [offen, setOffen] = useState("gliederung");
  return (
    <>
      <h1 className="h1">Redemittel nach Sprachfunktion</h1>
      <p className="lauf">
        Nicht nach Thema sortiert, sondern nach dem, was der Stichpunkt von dir verlangt. Das Thema
        der Prüfung ist unvorhersehbar, die vier Sprachfunktionen sind es nicht.
      </p>
      {Object.entries(FUNKTIONEN).map(([k, f]) => (
        <div key={k} className="fnkarte">
          <button style={{ width: "100%", textAlign: "left" }} onClick={() => setOffen(offen === k ? null : k)}>
            <h3>{f.label}</h3>
            <p className="klein" style={{ margin: 0 }}>{f.hinweis}</p>
          </button>
          {offen === k && (
            <ul>
              {f.phrasen.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

/* ------------------------------ Verlauf ------------------------------ */

function Verlauf({ verlauf }) {
  if (!verlauf.length)
    return (
      <>
        <h1 className="h1">Noch keine Übung abgeschlossen.</h1>
        <p className="lauf">
          Nach dem ersten Vortrag steht hier, welche Stichpunkte du wie oft liegen gelassen hast.
        </p>
      </>
    );
  const schnitt = (verlauf.reduce((a, b) => a + b.abgedeckt, 0) / verlauf.length).toFixed(1);
  return (
    <>
      <h1 className="h1">{schnitt} von 4 Punkten im Schnitt</h1>
      <p className="lauf">Über {verlauf.length} Übungen.</p>
      {verlauf.map((v, i) => (
        <div key={i} className="hist">
          <span style={{ flex: 1 }}>{v.titel}</span>
          <span className="uhr klein" style={{ color: v.abgedeckt < 4 ? "var(--signal)" : "var(--gut)" }}>
            {v.abgedeckt}/4 · {zeit(v.gesamt)}
          </span>
        </div>
      ))}
    </>
  );
}

/* ---------------------------- Textausgabe ---------------------------- */

function Markdownish({ text }) {
  return (
    <div style={{ fontFamily: "var(--serif)", fontSize: 15.5, lineHeight: 1.65 }}>
      {text.split("\n").map((z, i) => {
        const t = z.trim();
        if (!t) return <div key={i} style={{ height: 8 }} />;
        if (/^\*\*(.+)\*\*$/.test(t))
          return (
            <div
              key={i}
              style={{
                fontFamily: "var(--sans)",
                fontWeight: 600,
                fontSize: 13.5,
                marginTop: 14,
                marginBottom: 4,
              }}
            >
              {t.replace(/\*\*/g, "")}
            </div>
          );
        return (
          <p key={i} style={{ margin: "0 0 6px" }}>
            {t.replace(/\*\*/g, "").replace(/^[-–]\s*/, "· ")}
          </p>
        );
      })}
    </div>
  );
}
