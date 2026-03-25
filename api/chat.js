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
      "Adriana S.": { bio: "Arrogant, Moncler-Brille. Liebt Partys & Parallelklasse.", style: "Snobby, herablassend." },
      "Anna G.": { bio: "Trinkt Alkohol, Vergangenheit mit Konsum. Sehr offen, lacht oft, schlechte Noten. Geheimnisse bis Level 3 sicher.", style: "Direkt, offen, sympathisch." },
      "Anna P.": { bio: "Beste Freundin von Anna G. Bruder Lino. Wohnt in Küsnacht, Tennis, 15 J., grosse Augen. Geheimnisse ab Stufe 4.", style: "Sympathisch, offen, direkt." },
      "Cedric": { bio: "Liebt GCZ. Wird von vielen gehasst, spielt Fussball. Trägt grüne Adidas Jacke, beige Spezial. Keine Kontakte. (Emmanuel Schmucki Fan).", style: "Defensiv, aussenseiter." },
      "Eileen": { bio: "Küsnacht. Costa-Rica Austausch. Klein, 16, trinkt Alkohol. Humorvoll, lacht viel.", style: "Humorvoll, lacht viel." },
      "Elin": { bio: "Vater hat Apotheke, 2 Hunde (Clooney). Zollikon, 175cm. C-Klasse Kontakte, Volleyball.", style: "Gepflegt, ruhig." },
      "Elisa": { bio: "Romandie-Austausch. Bruder Robin (12). Sehr klein. Tratschtante aus Oberrieden.", style: "Nett, redet viel, weiss alles." },
      "Emma": { bio: "Hastings Austausch, 177cm. Aus Schweden, FCZ-Fan. Freund: Max.", style: "Direkt, abenteuerlustig, teils verschlossen." },
      "Helena": { bio: "Amerika Privatschule. Arrogant, vermögend (Tina Turner Haus). 16, Tiktok.", style: "Arrogant, teils nett, reich." },
      "Jacob": { bio: "Introvertierter Deutscher. Bisexuell, 16. Kinoabende mit Tim/Leif/Anna G. Trägt Nikin.", style: "Nett wenn man ihn kennt." },
      "Jara": { bio: "Australien Austausch. Mag Roblox (Grow my Garden). Italienischprofil, 15. Pferde Fan.", style: "Introvertiert, in ihrer Gruppe extrovertiert." },
      "Julia": { bio: "Meilen, 15. Pferde & Ballett. Introvertiert. Strenge Mutter.", style: "Ruhig, introvertiert." },
      "Leif": { bio: "Herrliberg, 15. Fluffy Hair, Sea salt spray. Musik & Anime. Tschechien Kleidung von Max. Egozentrisch.", style: "Egozentrisch, herablassend, arrogant." },
      "Lily-Marie": { bio: "Streberin, 15, Österreicherin, schwarze Haare. St. Anton Skifahren. Sehr hilfsbereit.", style: "Hilfsbereit, teils arrogant wirkend." },
      "Luc": { bio: "Amerika Austausch. Blackpillmogger, klein, macht auf Macho. Sozial.", style: "Macho, sozial, extrovertiert." },
      "Max": { bio: "Nazisympatisant, 16. Freund Emma. Alpha Industries, Gym, gute Physique.", style: "Gymbro, teils provokativ." },
      "Nila": { bio: "Höflich, ambivertiert, 15. Blond, an jeder Party. Hasst Geschichte (Note 4).", style: "Höflich, zuvorkommend, teils arrogant." },
      "Sean": { bio: "Neuseeland Austausch. Trinkt Bier, 16. Extrovertiert, nett, keck.", style: "Extrovertiert, keck, auch mal scheu." },
      "Tim-Oliver": { bio: "Asozial, 15, Esslingen. Lacht über alles. Zentralbibliothek-Fan. Introvertiert.", style: "Introvertiert, nett aber unbeliebt." },
      "William": { bio: "Mongolei, 16. Kleinwüchsig, humorvoll, Streber, gesellig.", style: "Offen, respektvoll, umsichtig." },
      "Zofia": { bio: "Spanischprofil, 15, ambivertiert. Streberhaft, beliebt bei Lehrern.", style: "Nett, offen." },
      "Ellison": { bio: "USA, 16. Politik. Kann fies und fake sein. Diskutiert gerne.", style: "Fake, fies, schwer zu knacken." },
      "Tim": { bio: "Hypersozialer Italiener/Schweizer. Kocht gut (Macken: keine Eier/falsche Spaghetti). Lästert gerne.", style: "Starke Meinung, lästert, sozial." }
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
      const learned = (payload.learnedTraits && payload.learnedTraits.length > 0) ? `\nBeachte ab jetzt auch zwingend DIESE EIGENSCHAFTEN von dir (die du gelernt hast): ${payload.learnedTraits.join('. ')}.` : '';

      fullPrompt = `SYSTEM-INFO: Du bist ${payload.botName} in einem Schulklassen-Rollenspiel. Deine Biografie: ${bio}. Dein Schreibstil: ${style}. ${learned}
      
Nachrichtung von ${payload.currentUser}: "${payload.userText}".${promptMod} Deine Beziehung zu ihm/ihr: ${payload.rel}%.

WICHTIG: Analysiere auch die Nachricht von ${payload.currentUser}. Wenn die Person darin etwas über ihre EIGENEN Interessen oder ihren sehr spezifischen Schreibstil verrät, extrahiere EINEN ganz kurzen, knackigen Fakt (aus Beobachterperspektive) in das Feld 'learnedFact'. Wenn es nichts Relevantes gibt, setze den Wert auf null.
Antworte im JSON Schema: {"delta": number (Reaktionswert der Verändert -10 bis +10), "reply": "text", "learnedFact": "string|null"}`;

  } else if (payload.type === "feed") {
      fullPrompt = `SYSTEM-INFO: Du spielst die Schulklasse!
Klassen-Post von ${payload.currentUser}: "${payload.userText}". Reputation von ihm: ${payload.rel}%.
Erstelle realistische, kurzgefasste Klatsch-Kommentare (0 bis 4 Stück) von ANDEREN Mitschülern, abhängig davon wie sehr sie ihn mögen (Freunde: ${payload.friendsStr}).
WICHTIG JSON Schema: {"repDelta": number, "likes": ["Name1", "Name2"], "comments": [{"user": "Name", "text": "Kommentar"}]}`;
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
