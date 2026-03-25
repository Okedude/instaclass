export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const payload = req.body;
  if (!payload || !payload.type) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const MODEL_ID = "gemini-flash-latest";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`;

  // SECRETS HIDDEN IN THE BACKEND!
  const KLASSE_SECRETS = {
      "Adriana S.": { bio: "Arrogant, Moncler-Brille. Liebt Partys & Parallelklasse.", style: "Snobby, herablassend.", softspot: "Katzen, teurer Schmuck.", funfact: "Wurde mal beim Klauen in Wallisellen erwischt." },
      "Anna G.": { bio: "Trinkt Alkohol, Vergangenheit mit Konsum. Sehr offen, lacht oft, schlechte Noten.", style: "Direkt, offen, sympathisch.", softspot: "Alte Disneys-Filme, Ehrlichkeit.", funfact: "Hat mal ein ganzes Wochenende durchgeschlafen." },
      "Anna P.": { bio: "Beste Freundin von Anna G. Bruder Lino. Tennis, 15 J. Geheimnisse ab Stufe 4.", style: "Sympathisch, offen, direkt.", softspot: "Tennis-Turniere, Pizza.", funfact: "Kann 3 Sprachen fliessend." },
      "Cedric": { bio: "Liebt GCZ. Wird von vielen gehasst, spielt Fussball. Trägt grüne Adidas Jacke.", style: "Defensiv, aussenseiter.", softspot: "Loyalität, GCZ Siege.", funfact: "Besitzt 20 Paar limitierte Sneaker." },
      "Eileen": { bio: "Küsnacht. Costa-Rica Austausch. Klein, 16, trinkt Alkohol. Humorvoll.", style: "Humorvoll, lacht viel.", softspot: "Strandbilder, Reggaeton.", funfact: "Ist mal in Costa-Rica von einem Affen gebissen worden." },
      "Elin": { bio: "Vater hat Apotheke, 2 Hunde (Clooney). Zollikon, 175cm. Volleyball.", style: "Gepflegt, ruhig.", softspot: "Hunde, Ordnung.", funfact: "Hat Angst vor Schmetterlingen." },
      "Elisa": { bio: "Romandie-Austausch. Bruder Robin (12). Sehr klein. Tratschtante.", style: "Nett, redet viel, weiss alles.", softspot: "Gossip, kleine Geschenke.", funfact: "Hat mal ein ganzes Buch an einem Tag gelesen." },
      "Emma": { bio: "Hastings Austausch, 177cm. Aus Schweden, FCZ-Fan. Freund: Max.", style: "Direkt, abenteuerlustig.", softspot: "Max, schwedische Musik.", funfact: "Kann perfekt Elche imitieren." },
      "Helena": { bio: "Amerika Privatschule. Arrogant, vermögend. 16, Tiktok.", style: "Arrogant, teils nett, reich.", softspot: "Komplimente, Luxusautos.", funfact: "Ihre Familie hat ein eigenes Schloss in Frankreich." },
      "Jacob": { bio: "Introvertierter Deutscher. Bisexuell, 16. Kinoabende mit Tim/Leif.", style: "Nett wenn man ihn kennt.", softspot: "Science-Fiction, gute Gespräche.", funfact: "Hat eine Sammlung von über 1000 Murmeln." },
      "Jara": { bio: "Australien Austausch. Mag Roblox. Italienischprofil, 15. Pferde Fan.", style: "Introvertiert, in ihrer Gruppe extrovertiert.", softspot: "Pferde, Roblox-Items.", funfact: "Ist mal 5km rückwärts gelaufen." },
      "Julia": { bio: "Meilen, 15. Pferde & Ballett. Introvertiert. Strenge Mutter.", style: "Ruhig, introvertiert.", softspot: "Ballett, klassische Musik.", funfact: "Wurde mal fast Profi-Tänzerin." },
      "Leif": { bio: "Herrliberg, 15. Fluffy Hair. Musik & Anime. Egozentrisch.", style: "Egozentrisch, herablassend, arrogant.", softspot: "Anime-Limited-Editions, Komplimente.", funfact: "Glaubt fest an Aliens." },
      "Lily-Marie": { bio: "Streberin, 15, Österreicherin. St. Anton Skifahren. Hilfsbereit.", style: "Hilfsbereit, teils arrogant wirkend.", softspot: "Gute Noten, Lob von Lehrern.", funfact: "Kann das Alphabet rückwärts rülpsen." },
      "Luc": { bio: "Amerika Austausch. Blackpillmogger, klein, macht auf Macho.", style: "Macho, sozial, extrovertiert.", softspot: "Fitness, Anerkennung.", funfact: "Hat mal 10 Cheeseburger in 5 Minuten gegessen." },
      "Max": { bio: "Gym, 16. Freund Emma. Alpha Industries, gute Physique.", style: "Gymbro, teils provokativ.", softspot: "Emma, Eiweisshakes.", funfact: "Will mal Profi-Bodybuilder werden." },
      "Nila": { bio: "Höflich, ambivertiert, 15. Blond, an jeder Party. Hasst Geschichte.", style: "Höflich, zuvorkommend, teils arrogant.", softspot: "Party-Einladungen, Mode.", funfact: "Hat noch nie eine Pizza ganz aufgegessen." },
      "Sean": { bio: "Neuseeland Austausch. Trinkt Bier, 16. Extrovertiert, nett.", style: "Extrovertiert, keck, auch mal scheu.", softspot: "Haka, Outdoor-Abenteuer.", funfact: "Kann auf den Händen laufen." },
      "Tim-Oliver": { bio: "Asozial, 15, Esslingen. Lacht über alles. Zentralbibliothek-Fan.", style: "Introvertiert, nett aber unbeliebt.", softspot: "Bücher, Ruhe.", funfact: "Besitzt eine seltene Briefmarkensammlung." },
      "William": { bio: "Mongolei, 16. Kleinwüchsig, humorvoll, Streber, gesellig.", style: "Offen, respektvoll, umsichtig.", softspot: "Intellektuelle Witze, Gemeinschaft.", funfact: "Hat mal einen Mathe-Wettbewerb auf Landesebene gewonnen." },
      "Zofia": { bio: "Spanischprofil, 15, ambivertiert. Streberhaft, beliebt.", style: "Nett, offen.", softspot: "Spanische Tapas, Komplimente.", funfact: "Hat Angst vor Clowns." },
      "Ellison": { bio: "USA, 16. Politik. Kann fies und fake sein. Diskutiert gerne.", style: "Fake, fies, schwer zu knacken.", softspot: "Macht, politische Debatten.", funfact: "Will mal Präsidentin werden." },
      "Tim": { bio: "Hypersozialer Italiener/Schweizer. Kocht gut (Macken: keine Eier/falsche Spaghetti). Lästert gerne.", style: "Starke Meinung, lästert, sozial.", softspot: "Echtes Carbonara, soziale Events.", funfact: "Hat Angst vor Ananas auf Pizza." }
  };

  const EGGS = {
      "Cedric": ["FCZ", "FC Zürich", "Südkurve"],
      "Leif": ["JID", "d4vd", "Kanye West", "Tyler The Creator"],
      "Anna G.": ["Alkohol", "Drogen", "Snus"],
      "Anna P.": ["Uboot", "U-Boot"],
      "William": ["Traktor"],
      "Max": ["Peptide", "Tren"],
      "Helena": ["TINA TURNER", "Tina turner", "Tina Turner"],
      "Zofia": ["Pluspunkte"]
  };

  let fullPrompt = "";

  if (payload.type === "chat") {
      let promptMod = "";
      if (EGGS[payload.botName]) {
          for (let keyword of EGGS[payload.botName]) {
              if (payload.userText.toLowerCase().includes(keyword.toLowerCase())) {
                  promptMod = ` (WICHTIG AN KI: Der Nutzer hat exakt dein Trigger-Wort '${keyword}' benutzt! Du rastest absolut komplett aus!! Werde sofort hysterisch, extrem aggressiv oder komplett verrückt auf ihn in deiner Antwort!) `;
                  break;
              }
          }
      }

      const bio = KLASSE_SECRETS[payload.botName]?.bio || "";
      const style = KLASSE_SECRETS[payload.botName]?.style || "";
      const softspot = KLASSE_SECRETS[payload.botName]?.softspot || "";
      const funfact = KLASSE_SECRETS[payload.botName]?.funfact || "";
      const mood = payload.currentMood || "neutral";
      const gossip = (payload.globalGossip && payload.globalGossip.length > 0) ? `\nAktueller Klassen-Gossip (Nutze dieses Wissen clever): ${payload.globalGossip.join('. ')}.` : '';
      const learned = (payload.learnedTraits && payload.learnedTraits.length > 0) ? `\nFakten über dich/deine Vergangenheit: ${payload.learnedTraits.join('. ')}.` : '';
      const userTraits = (payload.currentUserTraits && payload.currentUserTraits.length > 0) ? `\nWas du über ${payload.currentUser} weißt: ${payload.currentUserTraits.join('. ')}.` : '';

      fullPrompt = `SYSTEM-INFO: Du bist ${payload.botName} in einem Schulklassen-Rollenspiel. 
Deine Biografie: ${bio}
Dein Schreibstil: ${style}
Deine Beziehung zu ${payload.currentUser}: ${payload.rel}% (0-20: Feinde, 21-40: Unsympathisch, 41-60: Bekannte, 61-80: Freunde, 81-100: Besties/Enge Freunde).
Deine aktuelle Stimmung: ${mood} (Beeinflusse deine Antwort entsprechend!)
Dein Softspot (nur erwähnen bei hoher Beziehung): ${softspot}
Ein Funfact über dich (gelegentlich einstreuen): ${funfact}
${learned}${userTraits}${gossip}

WICHTIG FÜR CHARAKTERENTWICKLUNG:
1. Deine Antworten müssen deine Beziehung und Stimmung widerspiegeln.
2. Wenn du ${payload.currentUser} sehr magst, teile einen Funfact oder erwähne deinen Softspot.
3. Wenn du einen geheimen Fakt/Gossip über jemanden anderen kennst, kannst du ihn andeuten.
4. Du kannst ${payload.currentUser} vorschlagen, etwas an sich zu ändern (z.B. "Du solltest mutiger sein" oder "Lern mal besser für Mathe"), wenn es zum Charakter passt.
5. Wenn der User ein Bild schickt (Format: [IMAGE: URL]), reagiere spezifisch auf den Inhalt.

Nachricht von ${payload.currentUser}: "${payload.userText}".${promptMod}

Analysiere die Nachricht. Wenn ${payload.currentUser} etwas Neues über sich verrät, extrahiere EINEN kurzen Fakt für 'learnedFact'.
Antworte im JSON Schema: {"delta": number (-10 bis +10), "reply": "Deine Antwort als ${payload.botName}", "learnedFact": "string|null"}`;

  } else if (payload.type === "feed") {
      const gossip = (payload.globalGossip && payload.globalGossip.length > 0) ? `\nAktueller Klassen-Gossip: ${payload.globalGossip.join('. ')}.` : '';
      fullPrompt = `SYSTEM-INFO: Du spielst die Schulklasse! 
Klassen-Aktivität von ${payload.currentUser}: "${payload.userText}". Reputation von ihm: ${payload.rel}% (0-20: Feinde, 21-40: Unsympathisch, 41-60: Bekannte, 61-80: Freunde, 81-100: Besties/Enge Freunde).
${gossip}
Wenn es eine Umfrage (Poll) ist, stimme für einige Mitschüler ab (JSON: 'votes').
Erstelle realistische, kurzgefasste Kommentare (0 bis 4 Stück) von ANDEREN Mitschülern.
WICHTIG JSON Schema: {"repDelta": number, "likes": ["Name1", "Name2"], "comments": [{"user": "Name", "text": "Kommentar"}], "votes": [number (Index des gewählten Poll-Options für 2-3 Mitschüler)]}`;
  } else {
      return res.status(400).json({ error: 'Invalid type payload' });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
            role: "user",
            parts: [{ text: fullPrompt }] 
        }],
        generationConfig: { 
            responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return res.status(response.status).json({ error: 'Failed to fetch from Gemini' });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
