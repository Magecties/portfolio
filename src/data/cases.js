// Eksamenscases til Product Optimization. Brødteksten (lead + sections.body)
// tæller med i de 12.000 anslag — tjek med `npm run anslag`.
const BASE = import.meta.env?.BASE_URL ?? "/";
// Billeder til casesiderne ligger i public/cases/.
export const ASSETS = `${BASE}cases/`;

const DECLARATION =
  "Brødteksten på denne side er skrevet med generativ AI (Claude, Anthropic) på baggrund af mit eget projektmateriale og mine oplysninger om mit bidrag. Jeg har gennemgået og godkendt indholdet. Casesidernes layout er også bygget med hjælp fra Claude.";

export const CASES = [
  {
    slug: "mellemrum",
    number: 1,
    title: "Fra prototype til produktionsklar React-løsning",
    client: "Mellemrum",
    meta: [
      { label: "Periode", value: "24.08–04.09.2026" },
      { label: "Rolle/Team", value: "Individuel" },
      { label: "Værktøjer", value: "React, Vite, Supabase, GitHub Pages, Lighthouse" },
    ],
    lead: "Mellemrum er en lokal kultur- og eventplatform i Aarhus. Jeg overtog en hurtigt bygget React-prototype og gjorde den mere robust, tilgængelig og lettere at videreudvikle – og fik tilmeldingsflowet til faktisk at gemme tilmeldingen.",
    links: [
      { label: "GitHub-repository", href: "https://github.com/Magecties/Case-1-optimize-eksamen" },
      { label: "Deployet løsning (GitHub Pages)", href: "https://magecties.github.io/Case-1-optimize-eksamen/" },
    ],
    sections: [
      {
        id: "udfordring",
        heading: "Case og udfordring",
        body: [
          "Prototypen så færdig ud, men tilmeldinger blev kun skrevet til konsollen, siderne var tomme ved langsomme svar og fejl, og datamodellen gentog venue- og eventdata som tekst. Kunden nævnte også performance. Målet var ikke at ændre mest muligt, men at løse de betydningsfulde problemer, så andre kan bygge videre. Casen var individuel.",
        ],
      },
      {
        id: "undersoegelse",
        heading: "Undersøgelse og prioritering",
        body: [
          "Jeg gennemførte brugerflowene, gennemgik koden og dokumenterede 17 fund i en teknisk audit med evidens, konsekvens og planlagt verifikation. Prioriteringen byggede på konsekvens for brugeren, risiko for fejl, vedligehold og effekt i forhold til indsats. Rækkefølgen fulgte afhængighederne: Venues-tabellen kom før tilmeldingsflowet, ellers skulle flowet skrives om to gange.",
        ],
        plan: [
          {
            group: "Skal med",
            items: [
              { label: "Sprog, titel og metadata", status: "done" },
              { label: "Label og validering på formularen", status: "done" },
              { label: "Alt-tekst på eventbilleder", status: "done" },
              { label: "Venues som relateret tabel", status: "done" },
              { label: "Tilmeldingsflow med fremmednøgle", status: "done" },
              { label: "Intern side med relaterede data", status: "done" },
              { label: "UI-states og fejlhåndtering", status: "done" },
            ],
          },
          {
            group: "Bør med",
            items: [
              { label: "Footer og eventkort som komponenter", status: "skipped" },
              { label: "Fælles datoformatering", status: "skipped" },
              { label: "Services-lag til dataadgang", status: "partial" },
              { label: "Titel og fokus ved routeskift", status: "skipped" },
            ],
          },
          {
            group: "Hvis tiden rækker",
            items: [
              { label: "Billeder og lazy loading", status: "done" },
              { label: "CSS Modules", status: "skipped" },
            ],
          },
        ],
      },
      {
        id: "loesning",
        heading: "Løsning og faglige valg",
        body: [
          "Hver forbedring fik sin egen feature branch med beskrivende commits. Her er de vigtigste.",
        ],
        items: [
          {
            title: "Tilmeldingen bliver gemt",
            branch: "registration-flow",
            problem: "handleSubmit() lavede kun console.log, så tilmeldingen gik tabt.",
            fix: "En service-funktion sender tilmeldingen med event_id og tjekker svaret. Knappen låses under afsendelse, og kvittering eller fejl læses op via aria-live.",
            check: "Testtilmelding: 201 i Network og en ny række med korrekt event_id.",
            before: {
              src: `${ASSETS}mellemrum-foer-tilmelding.webp`,
              alt: "Kodeudsnit: handleSubmit kalder kun console.log med navn, e-mail og eventtitel.",
            },
            code: `async function handleSubmit(eventSubmit) {
  eventSubmit.preventDefault();
  setIsSubmitting(true);
  try {
    await createRegistration({ name, email, event_id: event.id });
    setFormMessage({ type: "success", text: "Tak! Din tilmelding er sendt til arrangøren." });
  } catch (error) {
    console.error("Could not create registration", error);
    setFormMessage({ type: "error", text: "Din tilmelding kunne ikke sendes. Prøv igen om lidt." });
  } finally {
    setIsSubmitting(false);
  }
}`,
          },
          {
            title: "Data ligger ét sted",
            branch: "venues-relation",
            stack: true,
            problem: "Venue-felter var gentaget på hvert event, og tilmeldinger kopierede eventets titel og dato som tekst.",
            fix: "Ny venues-tabel og fremmednøglerne venue_id og event_id. Eksisterende data blev migreret i SQL.",
            check: "Venue vises korrekt på forside og detaljeside.",
            before: {
              src: `${ASSETS}mellemrum-foer-registrations-sql.webp`,
              alt: "SQL-udsnit: registrations-tabellen gemmer eventTitle, eventDate og eventLocation som tekst uden fremmednøgle.",
            },
            after: {
              src: `${ASSETS}mellemrum-datamodel.svg`,
              alt: "Diagram over datamodellen. Før: events og registrations uden relationer. Efter: venues, events og registrations forbundet med fremmednøglerne venue_id og event_id.",
            },
          },
          {
            title: "Den interne side viser aktuelle eventdata",
            branch: "registrations-page",
            problem: "Siden viste en tekstkopi af eventet, så rettelser aldrig slog igennem.",
            fix: "Én request henter tilmeldinger med eventets titel, dato og venue – kun de felter, siden bruger. Antallet afledes af listen.",
            check: "Testtilmeldingen vises på /tilmeldinger med eventtitel og venue.",
            before: {
              src: `${ASSETS}mellemrum-foer-intern-side.webp`,
              alt: "Kodeudsnit: den interne side henter registrations uden relaterede data og gemmer antallet i separat state.",
            },
            code: `fetch(
  \`\${SUPABASE_URL}/registrations?select=*,event:events(title,date,venue:venues(name))&order=createdAt.desc\`,
  { headers }
);`,
          },
          {
            title: "Siden holder til langsomme svar og fejl",
            branch: "ui-states",
            problem: "Ingen requests havde fejlhåndtering, og eventsiden returnerede null – brugeren så en tom side.",
            fix: "Loading-, fejl- og tomtilstande med role=\"status\" og role=\"alert\". Tekniske fejl logges, brugeren får en forståelig besked.",
            check: "Offline i DevTools viser fejlbeskeden i stedet for en tom side.",
            before: {
              src: `${ASSETS}mellemrum-foer-uistates.webp`,
              alt: "Kodeudsnit: fetch uden try/catch og uden tjek af response.ok, og en komponent der returnerer null, mens data mangler.",
            },
            code: `if (isLoading) {
  return <p role="status">Henter event ...</p>;
}
if (hasError) {
  return <p role="alert">Vi kunne ikke hente eventet lige nu. Prøv at genindlæse siden.</p>;
}
if (!event) {
  return <p>Vi kan ikke finde det event. Brug linket ovenfor til at se alle events.</p>;
}`,
          },
          {
            title: "Formularen virker for flere",
            branch: "meta-og-sprog · a11y",
            problem: "E-mail havde en span i stedet for en label, ingen validering, billederne manglede alt-tekst, og siden var markeret som engelsk.",
            fix: "Labels med htmlFor, type=\"email\" og required, alt-tekster, lang=\"da\" og dansk metadata.",
            check: "Formularen kan udfyldes med tastatur, og en ugyldig e-mail stoppes før afsendelse.",
            before: {
              src: `${ASSETS}mellemrum-foer-formular.webp`,
              alt: "Kodeudsnit: e-mail-feltet har en span i stedet for en label og mangler type og required.",
            },
            code: `<label htmlFor="signup-email">E-mail</label>
<input
  id="signup-email"
  type="email"
  value={email}
  onChange={(inputEvent) => setEmail(inputEvent.target.value)}
  required
/>`,
          },
          {
            title: "Lettere billeder",
            branch: "performance",
            problem: "Billeder blev hentet i op til 3080 px og vist i cirka 370 px – 7.605 af 7.701 KiB var billeder.",
            fix: "Billederne hentes i 800 px, og kortbillederne lazy loades.",
            check: "Lighthouse før og efter på den deployede version – se resultatet.",
            before: {
              src: `${ASSETS}mellemrum-lighthouse-foer.webp`,
              alt: "Lighthouse-rapport for den udleverede prototype med Performance 80 og en samlet overførsel på 7.701 KiB, næsten kun billeder.",
            },
            code: `<img src={event.image} alt={event.title} loading="lazy" />

-- starter.sql
'https://images.unsplash.com/photo-1562423426-934230877f7a?q=80&w=800&auto=format&fit=crop&…'`,
          },
        ],
      },
      {
        id: "resultat",
        heading: "Resultat og dokumentation",
        body: [
          "UDFYLD efter deploy: Lighthouse før/efter (3 + 3 kørsler på den deployede version), POST 201 og ny række med event_id, fejltilstand offline, direkte link og reload.",
        ],
      },
      {
        id: "refleksion",
        heading: "Faglig refleksion",
        body: [
          "Jeg valgte billederne frem for fælles komponenter og datoformatering, fordi de gav en målbar effekt for brugeren – derfor ligger footeren stadig fem steder. Min vigtigste læring handler om git: Mine branches blev stablet og først merget til sidst. Imens kørte databasen den nye model, mens main deployede den gamle kode, så den publicerede løsning var i stykker. Næste gang merger jeg løbende. RLS er slået fra efter casens afgrænsning, så alle kan læse tilmeldingernes e-mails – det skal løses, før løsningen tages i brug.",
        ],
      },
      {
        id: "forretning",
        heading: "Forretningspotentiale",
        body: [
          "Tilmeldinger bliver nu gemt – det er platformens kerneformål, og før gik de tabt. Arrangører får et pålideligt overblik, fordi hver tilmelding hænger sammen med sit event, og relationen åbner for kapacitet og statistik. Et venue rettes ét sted, lettere billeder gør siden hurtigere på mobil, og en tilgængelig formular betyder, at flere kan tilmelde sig.",
        ],
      },
    ],
    images: [],
    sources: [
      "Udleveret Mellemrum-prototype og casebeskrivelse (EAAA, Product Optimization)",
      "React-dokumentationen (react.dev) og Supabase REST API-dokumentationen",
      "Google Lighthouse",
    ],
    declaration: DECLARATION,
  },
  {
    slug: "vuuh",
    number: 2,
    title: "Design Better Onboarding",
    client: "Vuuh",
    meta: [
      { label: "Periode", value: "Uge 37–38 2026" },
      { label: "Rolle/Team", value: "Gruppe på fem · mit fokus: motion og UI" },
      { label: "Værktøjer", value: "Figma, Figma Slides, Lottie" },
    ],
    lead: "Vuuh henter automatisk produktdata og billeder fra brands og sender dem til forhandlernes webshop. I en gruppe på fem redesignede vi onboardingen for nye Shopify-brugere – fra installation til det første demoprodukt.",
    links: [
      {
        label: "UX Audit Summary",
        href: "https://docs.google.com/document/d/1Ihv0yCQZbov13Y2WLvs6R4R3NTuxXBUxlc8wJpMF2aQ/edit?usp=sharing",
      },
      {
        label: "Figma-prototype",
        href: "https://www.figma.com/proto/reqZjXUxZJj8l2q5l9sjf9/Case-2---3.-Semester?page-id=2137%3A198&node-id=2428-9026&viewport=603%2C167%2C0.11&t=fdG1AkPamuiHbcVR-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=2681%3A1421",
      },
      {
        label: "Figma-designfil",
        href: "https://www.figma.com/design/reqZjXUxZJj8l2q5l9sjf9/Case-2---3.-Semester?node-id=2137-198&t=fhEXjmJN9P6ZPVur-1",
      },
      { label: "Præsentation for Vuuh", href: "https://www.figma.com/deck/Fg2N624IMB5Grf1ESC9aNj" },
    ],
    sections: [
      {
        id: "udfordring",
        heading: "Case og udfordring",
        body: [
          "En ny bruger installerer Vuuh fra Shopify App Store, forbinder sin butik og skal helst hurtigt opleve »magien«: et produkt, der oprettes automatisk. Den rejse brød sammen flere steder, og Vuuh har brug for, at nye brugere når frem til værdien, før de skal betale. Gruppen bestod af Martin, Mathias, Sebastian, Daniel og mig. Analysen og redesignet lavede vi sammen. Jeg stod især for motion og micro-interactions og for anden version af skærmene i Vuuhs eget designsprog.",
        ],
      },
      {
        id: "undersoegelse",
        heading: "Undersøgelse og prioritering",
        body: [
          "Vi lavede en heuristisk evaluering ud fra Nielsens 10 heuristikker og en cognitive walkthrough i ni trin med en bruger, der kender Shopify, men ikke Vuuh eller integrationer. Det mest kritiske fund var skærmen efter installationen: Shopify viste en server error, mens Vuuhs side lignede en tom tilstand uden vej videre. »Connect to Shopify« sendte brugeren til en Outputs-side, hvor Shopify skulle vælges igen, og opsætningen krævede forståelse af felter som »Option names«. I walkthroughen blev trin 2–5 og 7 primært vurderet som »unclear« eller »unlikely«.",
          "Vi samlede fundene i fem Finding Cards og prioriterede manglende retning og uklar systemstatus højest. Syntesen var, at Vuuh ikke fortæller brugeren, hvor de er, hvad de skal nu, og om handlingen lykkedes. Slutningen var til gengæld stærk: Når demoproduktet ses i Shopify, giver det hele mening.",
        ],
      },
      {
        id: "loesning",
        heading: "Løsning og faglige valg",
        body: [
          "Målet blev derfor at gøre vejen frem mod resultatet lige så tydelig som resultatet. Vi kombinerede next-step suggestions med in-context guidance og besluttede, at onboardingen ikke må tage kontrollen: Modaler kan lukkes uden at miste fremskridt, og trin kan springes over.",
          "Success-siden bekræfter nu installationen og har én knap direkte ind i Vuuh. På dashboardet viser en stepper med tre trin – Install Vuuh, Connect to Shopify og See the Magic in Action – hvor brugeren er, og »Connect to Shopify« åbner opsætningen direkte, så vejen er ét klik i stedet for tre. Demoproduktet forklares som »only a demo«, og brands kommer først efter aha-oplevelsen. I anden iteration flyttede jeg designet over i Vuuhs eget designsprog, fjernede støj som velkomstwidget og placeholder-brands og animerede statusskiftene, så stepperen selv viser, at et trin er gennemført.",
        ],
      },
      {
        id: "resultat",
        heading: "Resultat og dokumentation",
        body: [
          "Vi kvalificerede designet med de 12 checks i et Accessibility Design Check. Statusændringer og knaptekster var opfyldt, og status vises med ikon, tekst og gennemstregning – ikke kun farve. Vi prioriterede fire forbedringer: Shopify-feltet blev til »Shopify store URL« med hjælpetekst og en fejlbesked med næste skridt, hjælpetekster og disabled states fik højere kontrast, interaktive elementer fik synligt fokus, og demoflowet fik én gennemgående terminologi. Løsningen er ikke testet med rigtige brugere endnu.",
        ],
      },
      {
        id: "refleksion",
        heading: "Faglig refleksion",
        body: [
          "Vi lagde onboardingen oven på Vuuhs eksisterende sider frem for at redesigne hele produktet. Det holder løsningen realistisk at bygge. Fravalget er, at shopnavnet stadig skal skrives manuelt, selvom det sandsynligvis kan hentes fra installationen. Min vigtigste læring er, at motion ikke er pynt: Animationen i stepperen er selve feedbacken på, at et trin er gennemført. Næste skridt er en test med rigtige butiksejere.",
        ],
      },
      {
        id: "forretning",
        heading: "Forretningspotentiale",
        body: [
          "Shopify-integrationen koster €199 om måneden efter prøveperioden, så hver bruger, der kommer igennem »Connect to Shopify«, er en potentiel betalende kunde. Når demoproduktet viser værdien tidligt og uden risiko, bliver vejen fra installation til betaling kortere. En tydeligere opsætning kan også give færre supporthenvendelser, og stepperen kan genbruges til Vuuhs andre integrationer.",
        ],
      },
    ],
    images: [
      {
        src: `${ASSETS}vuuh-success-foer.webp`,
        alt: "Den oprindelige side efter installationen: en tom tilstand med teksten Start receiving product data og ingen vej videre til Vuuh.",
        caption: "Før: Siden efter installationen ligner en tom tilstand og leder ikke videre.",
        after: "undersoegelse",
      },
      {
        src: `${ASSETS}vuuh-success-efter.webp`,
        alt: "Redesignet succesmodal: Vuuh is installed successfully, en tjekliste med Install Vuuh afkrydset og knappen Open Vuuh.",
        caption: "Efter: Bekræftelse, næste skridt og én knap direkte ind i Vuuh.",
        after: "loesning",
        maxWidth: 454,
      },
      {
        src: `${ASSETS}vuuh-dashboard-foer.webp`,
        alt: "Det oprindelige Vuuh-dashboard med fire ligestillede kort: velkomst, Shopify-integration, demoprodukt og foreslåede brands.",
        caption: "Før: Fire ligestillede kort og ingen rækkefølge.",
        after: "loesning",
      },
      {
        src: `${ASSETS}vuuh-dashboard-efter.webp`,
        alt: "Redesignet Vuuh-dashboard med en stepper i tre trin øverst, hvor Install Vuuh er gennemført og Connect to Shopify er næste trin.",
        caption: "Efter: Stepperen viser, hvor brugeren er, og hvad næste skridt er.",
        after: "loesning",
      },
    ],
    sources: [
      "Jakob Nielsen: 10 Usability Heuristics for User Interface Design (Nielsen Norman Group)",
      "EAAA-workbooks: UX Audit, Interaction Redesign og Accessibility Design Check",
      "WCAG 2.2",
    ],
    declaration: DECLARATION,
  },
  {
    slug: "again",
    number: 3,
    // ­ = blød bindestreg, så ordet kan deles pænt på smalle skærme.
    title: "Koncept- og subbrand­udvikling",
    client: "LA RŌUGE · AGAIN",
    meta: [
      { label: "Periode", value: "28.09–09.10.2026" },
      { label: "Rolle/Team", value: "Magnus og Mathias · alt i fællesskab" },
      { label: "Værktøjer", value: "Figma, Figma Slides" },
    ],
    lead: "LA RŌUGEs secondhand-salg levede i skyggen af hovedbrandet. Sammen med Mathias udviklede jeg AGAIN by LA RŌUGE – et re-commerce-subbrand med eget navn, egen identitet og tone og en brugerrejse for både køber og sælger.",
    links: [
      {
        label: "Branddeck",
        href: "https://www.figma.com/slides/zchYm1dFnKPVZ3AzpuNgAQ/AGAIN-by-LA-R%25C5%258CUGE-%25E2%2580%2593-Branddeck--Copy-?node-id=2-2&t=NML88tIsObKh11AQ-0",
      },
      // TODO: indsæt link til Figma-prototypen (play mode), når den er delt.
      { label: "Figma-prototype", href: "" },
      {
        label: "Figma-designfil",
        href: "https://www.figma.com/design/P3Hvb9XDy080R7zP5iuDq7/Magnus-og-Matty-designproject-la-rouge?node-id=148-2807&p=f&t=EsvA9WMccaAXEgth-0",
      },
    ],
    sections: [
      {
        id: "udfordring",
        heading: "Case og udfordring",
        body: [
          "LA RŌUGE er et dansk modebrand med fokus på tidløst tøj, kvalitet og self-love. Brandet har en secondhand-løsning, men uden identitet, tone eller kommunikation – den er bare en kategori i webshoppen. Vores spørgsmål blev: Hvordan gør vi secondhand til et univers, kunderne opsøger, frem for en funktion i webshoppen? Vi fandt ud af, at løsningen allerede kører på en white-label Shopify-app. Motoren fandtes – der manglede et brand ovenpå. Mathias og jeg lavede hele projektet i fællesskab.",
        ],
      },
      {
        id: "undersoegelse",
        heading: "Undersøgelse og prioritering",
        body: [
          "Vi tog udgangspunkt i undersøgelser fra PostNord og Dansk Erhverv fra 2026: Tøj er den største secondhand-kategori, og pris er hovedårsagen til at købe brugt. Bæredygtighed fylder mindre, især hos de 18–29-årige. »Pris slår bæredygtighed« blev projektets vigtigste indsigt og gav princippet »brugt tøj, men ikke en brugt oplevelse«.",
          "Vi analyserede MOS MOSH ReLoved, RE:SELECTED, GANNI og Roccamore og brugte Vinted som kontrast: Dér er annonceflowet 18 skærme, og sælgeren skriver selv annoncen. Målgrupperne definerede vi ud fra motivation frem for demografi: den prisbevidste kvalitetsjæger, den loyale LA RŌUGE-kunde, der også sælger, og archive hunteren, der jagter tidligere kollektioner.",
        ],
      },
      {
        id: "loesning",
        heading: "Løsning og faglige valg",
        body: [
          "Navnet AGAIN binder rejsen sammen – wear it again, love it again, sell it again – og »by LA RŌUGE« fungerer som kvalitetsstempel. I logoet flyttede vi stregen fra LA RŌUGEs Ō til det andet A: bogstavet, der kommer igen. Genkendeligheden ligger i stregen, den mørke rød og sprogfiguren, hvor »Mais Qui:« bliver til »Encore: Found again«. Selvstændigheden kommer fra et omvendt farvehierarki, hvor aubergine og sandsten bærer, og rød kun er signal – rød har ikke kontrast nok til små tekster. Typografien er Assistant og Inter. Tonen er engelsk i brandlinjer, dansk i alt funktionelt og konkret: »Meget god. Båret få gange, ingen synlige spor« frem for »Næsten som ny!«.",
          "Prototypen har 11 skærme og to broer mellem køb og salg. Køberen filtrerer først på størrelse og ser stand, førpris og »tjekket, renset, repareret«. Sælgeren vælger tøjet blandt sine tidligere køb, vurderer standen på en skala med tre niveauer og får et estimat, før noget sendes. Sælgerflowet er seks skærme, og ingen skal skrive en annonce.",
        ],
      },
      {
        id: "resultat",
        heading: "Resultat og dokumentation",
        body: [
          "Vi pitchede konceptet i 15 minutter for Pernille, Partner og Head of Sales hos LA RŌUGE. Hun fremhævede vores markedsresearch – at kunderne går mere op i pris end i miljø og genbrug – som spændende. Det bekræftede den indsigt, hele konceptet hviler på. Brugerrejsen er ikke testet med rigtige købere og sælgere endnu.",
        ],
      },
      {
        id: "refleksion",
        heading: "Faglig refleksion",
        body: [
          "Researchen flyttede vores vinkel fra et grønt budskab til pris og tryghed, og det gjorde konceptet skarpere. Vores første visuelle identitet med egne farver, mono-skrift og stempel skrottede vi, da analysen af LA RŌUGEs lookbook viste, at vi kunne skabe genkendelighed med brandets egne virkemidler i et omvendt hierarki. Vi fravalgte bevidst at lade bæredygtighed bære budskabet, selvom det er en del af LA RŌUGEs DNA. Næste skridt er en brugertest af køb og salg, en afklaring af voucherens værdi og et varemærketjek af navnet.",
        ],
      },
      {
        id: "forretning",
        heading: "Forretningspotentiale",
        body: [
          "AGAIN kræver ingen ny platform – det lægger et brand oven på en løsning, der allerede kører. Det giver LA RŌUGE en ny indgang for prisbevidste kunder, og prisniveauet på 150–650 kr. mod 699–2.995 kr. for nyt gør risikoen for kannibalisering lav. Vouchers holder sælgeren i universet, fordi de også kan bruges på nyt LA RŌUGE, og videresalget bliver hos brandet i stedet for på Vinted. Effekten kan måles på nye kunder via AGAIN, indløste vouchers og andelen af indsendte varer, der bliver solgt.",
        ],
      },
    ],
    images: [
      {
        src: `${ASSETS}again-forside.webp`,
        alt: "Forsiden af branddecket: AGAIN-logoet på aubergine ved siden af et lookbook-foto på sandstensfarvet baggrund.",
        caption: "AGAIN by LA RŌUGE. Foto fra LA RŌUGEs lookbook.",
        after: "intro",
      },
      {
        src: `${ASSETS}again-logo.webp`,
        alt: "LA RŌUGE-logoet ved siden af AGAIN-logoet, hvor stregen over Ō er flyttet til det andet A.",
        caption: "Stregen fra LA RŌUGEs Ō flytter til det andet A – bogstavet, der kommer igen.",
        after: "loesning",
      },
      {
        src: `${ASSETS}again-farver.webp`,
        alt: "Farvepaletten med sandsten, rød og ink og deres farvekoder.",
        caption: "Sandsten, rød og ink. Rød bruges kun som signal.",
        after: "loesning",
      },
      {
        src: `${ASSETS}again-typografi.webp`,
        alt: "Typografi-slide med Assistant til overskrifter og Inter til brødtekst og knapper.",
        caption: "Typografi: Assistant og Inter.",
        after: "loesning",
      },
      {
        src: `${ASSETS}again-billedbrug.webp`,
        alt: "Billedbrug: et editorial-foto fra LA RŌUGEs lookbook ved siden af et produktbillede af tøjet alene på sandsten.",
        caption: "Lookbooken sætter stemningen, produktbilledet viser tøjet. Foto fra LA RŌUGEs lookbook.",
        after: "loesning",
      },
      {
        src: `${ASSETS}again-flow.webp`,
        alt: "Oversigt over brugerrejsen med 11 skærme fordelt på et købsflow og et salgsflow og to broer imellem.",
        caption: "11 skærme og to broer: kvitteringen leder til salg, voucheren leder tilbage til shoppen.",
        after: "loesning",
      },
      {
        src: `${ASSETS}again-standskala.webp`,
        alt: "Standskalaen med tre niveauer: Som ny, Meget god og God, hver med en kort definition.",
        caption: "Det, sælgeren vælger, er det, køberen læser igen.",
        after: "loesning",
      },
    ],
    sources: [
      "PostNord: E-handel og secondhand (forår 2026)",
      "Dansk Erhverv: forbrugeranalyse om cirkulære services (august 2026)",
      "LA RŌUGE: lookbook AW26 og casebeskrivelse",
      "Konkurrenter: MOS MOSH ReLoved, SELECTED RE:SELECTED, GANNI, Roccamore og Vinted",
    ],
    declaration: DECLARATION,
  },
];

export const findCase = (slug) => CASES.find((c) => c.slug === slug);
