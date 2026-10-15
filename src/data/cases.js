// Eksamenscases til Product Optimization. Brødteksten (lead + sections.body)
// tæller med i de 12.000 anslag — tjek med `npm run anslag`.
const BASE = import.meta.env?.BASE_URL ?? "/";
// Billeder til casesiderne ligger i public/cases/.
export const ASSETS = `${BASE}cases/`;

export const CASES = [
  {
    slug: "mellemrum",
    number: 1,
    layout: "story",
    year: "2026",
    title: "Fra prototype til produktionsklar React-løsning",
    client: "Mellemrum",
    cover: {
      src: `${ASSETS}mellemrum-cover.webp`,
      alt: "Mellemrums forside med overskriften Find plads til noget nyt og knappen Se kommende events.",
    },
    tags: ["React", "Supabase", "Accessibility", "Performance"],
    meta: [
      { label: "Fremgangsmåder", value: "Teknisk audit · Feature branches · Lighthouse" },
      { label: "Projektform", value: "Individuelt projekt · 3. semester" },
      { label: "Værktøjer", value: "VS Code · React · Supabase REST API · GitHub Pages" },
    ],
    lead: "Jeg overtog en hurtigt bygget prototype for kultur- og eventplatformen Mellemrum og gjorde den robust, tilgængelig og klar til deployment.",
    links: [
      { label: "Live site", href: "https://magecties.github.io/Case-1-optimize-eksamen/" },
      { label: "GitHub repo", href: "https://github.com/Magecties/Case-1-optimize-eksamen" },
    ],
    sections: [
      {
        id: "udfordring",
        heading: "Om casen",
        body: [
          "Mellemrum er en lokal platform, hvor man kan finde og tilmelde sig koncerter, talks og workshops i Aarhus. Prototypen var bygget hurtigt for at afprøve idéen, og selvom den så færdig ud, virkede de vigtigste dele ikke: Tilmeldinger blev ikke gemt, siderne blev tomme ved fejl, og de samme oplysninger om spillesteder var skrevet ind igen og igen. Casen var individuel, så audit, kode og datamodel er mit eget arbejde.",
        ],
      },
      {
        id: "audit",
        heading: "Teknisk audit",
        body: [
          "Jeg startede med at bruge løsningen som en almindelig bruger og gennemgå koden. Alle fund skrev jeg ind i en teknisk audit – 17 i alt – med hvad problemet var, hvad det betød for brugeren, og hvordan jeg ville teste en løsning.",
        ],
        media: {
          type: "carousel",
          slides: [
            {
              title: "Tilmelding",
              src: `${ASSETS}mellemrum-foer-tilmelding.webp`,
              alt: "Kodeudsnit: handleSubmit kalder kun console.log med navn, e-mail og eventtitel.",
              caption: "Tilmeldingen blev kun skrevet til konsollen og aldrig gemt.",
            },
            {
              title: "Datamodel",
              src: `${ASSETS}mellemrum-foer-registrations-sql.webp`,
              alt: "SQL-udsnit: registrations-tabellen gemmer eventTitle, eventDate og eventLocation som tekst uden fremmednøgle.",
              caption: "Tilmeldinger kopierede eventets titel og dato som tekst uden relation.",
            },
            {
              title: "Fejlhåndtering",
              src: `${ASSETS}mellemrum-foer-uistates.webp`,
              alt: "Kodeudsnit: fetch uden try/catch og uden tjek af response.ok, og en komponent der returnerer null, mens data mangler.",
              caption: "Ingen fejlhåndtering – og eventsiden returnerede null, mens data manglede.",
            },
            {
              title: "Formular",
              src: `${ASSETS}mellemrum-foer-formular.webp`,
              alt: "Kodeudsnit: e-mail-feltet har en span i stedet for en label og mangler type og required.",
              caption: "E-mail-feltet havde en span i stedet for en label og ingen validering.",
            },
            {
              title: "Billeder",
              src: `${ASSETS}mellemrum-lighthouse-foer.webp`,
              alt: "Lighthouse-rapport for den udleverede prototype med Performance 80 og en samlet overførsel på 7.701 KiB, næsten kun billeder.",
              caption: "7.605 af 7.701 KiB var billeder i op til 3080 px bredde.",
            },
          ],
        },
      },
      {
        id: "undersoegelse",
        heading: "Min prioritering",
        body: [
          "Jeg prioriterede efter, hvor meget et problem påvirkede brugeren, hvor stor risikoen for fejl var, og hvor meget det gjorde koden lettere at arbejde videre med. Tilmeldingen og datamodellen kom højest, fordi de er kernen i produktet – og datamodellen kom først, så tilmeldingen ikke skulle bygges to gange.",
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
        id: "tilmelding",
        heading: "Tilmeldingen bliver gemt",
        wide: true,
        body: [
          "Det vigtigste var tilmeldingen. Nu bliver den gemt i Supabase og koblet til det rigtige event med en fremmednøgle. Knappen viser »Sender …«, mens tilmeldingen sendes, og brugeren får en kvittering eller en fejlbesked, som også bliver læst op af skærmlæsere.",
        ],
        media: {
          type: "pair",
          items: [
            {
              label: "Før",
              src: `${ASSETS}mellemrum-foer-tilmelding.webp`,
              alt: "Kodeudsnit: handleSubmit kalder kun console.log med navn, e-mail og eventtitel.",
              caption: "Tilmeldingen blev kun logget i konsollen.",
            },
            {
              label: "Efter",
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
              caption: "Tilmeldingen gemmes med eventets id, og brugeren får besked.",
            },
          ],
        },
      },
      {
        id: "datamodel",
        heading: "Én datamodel i Supabase",
        wide: true,
        body: [
          "Spillestederne lå som tekst på hvert event, og tilmeldinger kopierede eventets titel og dato. Jeg flyttede spillestederne over i deres egen tabel og forbandt tabellerne med fremmednøgler. Nu rettes et venue ét sted, og den interne side henter tilmeldinger med eventets aktuelle titel, dato og venue i én request.",
        ],
        media: {
          src: `${ASSETS}mellemrum-datamodel.svg`,
          alt: "Diagram over datamodellen. Før: events og registrations uden relationer, med venue- og eventoplysninger kopieret som tekst. Efter: venues, events og registrations forbundet med fremmednøglerne venue_id og event_id.",
          caption: "Før: data kopieret som tekst. Efter: venues, events og registrations forbundet med fremmednøgler.",
          light: true,
        },
      },
      {
        id: "states",
        heading: "Loading, fejl og tomme tilstande",
        body: [
          "Siderne viste ingenting, mens data blev hentet, og blev tomme, hvis noget gik galt. Nu har forsiden og eventsiden loading-, fejl- og tomme tilstande med forståelige beskeder, mens den tekniske fejl logges i konsollen. Et ukendt event behandles ikke som en fejl, men får sin egen besked.",
        ],
        media: {
          type: "carousel",
          slides: [
            {
              title: "Loading",
              src: `${ASSETS}mellemrum-efter-loading.webp`,
              alt: "Forsiden mens events hentes: Kommende events med teksten Henter events.",
              caption: "Efter: Mens data hentes, står der »Henter events …«.",
              light: true,
            },
            {
              title: "Fejl",
              src: `${ASSETS}mellemrum-efter-fejl.webp`,
              alt: "Forsiden når Supabase ikke svarer: Kommende events med teksten Vi kunne ikke hente events lige nu. Prøv at genindlæse siden.",
              caption: "Efter: Når Supabase ikke svarer, får brugeren en forståelig besked.",
              light: true,
            },
            {
              title: "Kode før",
              src: `${ASSETS}mellemrum-foer-uistates.webp`,
              alt: "Kodeudsnit: fetch uden try/catch og uden tjek af response.ok, og en komponent der returnerer null, mens data mangler.",
              caption: "Før: ingen fejlhåndtering, og eventsiden returnerede null.",
            },
            {
              title: "Kode efter",
              code: `if (isLoading) {
  return <p role="status">Henter event ...</p>;
}
if (hasError) {
  return <p role="alert">Vi kunne ikke hente eventet lige nu. Prøv at genindlæse siden.</p>;
}
if (!event) {
  return <p>Vi kan ikke finde det event. Brug linket ovenfor til at se alle events.</p>;
}`,
              caption: "Efter: hver tilstand har sin egen besked med role=\"status\" og role=\"alert\".",
            },
          ],
        },
      },
      {
        id: "a11y",
        heading: "Tilgængelighed",
        body: [
          "Formularen fik rigtige labels, e-mailvalidering og påkrævede felter, eventbillederne fik alt-tekst, og siden blev sat til dansk, så skærmlæsere udtaler teksten rigtigt.",
        ],
        media: {
          type: "pair",
          items: [
            {
              label: "Før",
              src: `${ASSETS}mellemrum-foer-formular.webp`,
              alt: "Kodeudsnit: e-mail-feltet har en span i stedet for en label og mangler type og required.",
            },
            {
              label: "Efter",
              code: `<label htmlFor="signup-email">E-mail</label>
<input
  id="signup-email"
  type="email"
  value={email}
  onChange={(inputEvent) => setEmail(inputEvent.target.value)}
  required
/>`,
            },
          ],
        },
      },
      {
        id: "resultat",
        heading: "Resultat og dokumentation",
        wide: true,
        body: [
          "Jeg målte med Lighthouse tre gange før og tre gange efter på den deployede version under samme forhold. Den samlede overførsel faldt fra 7.922 til 805 KiB, og antallet af requests fra 16 til 9. Performance gik fra 75–81 til 79–82, og LCP fra 5,0–6,6 til 5,0–5,3 sekunder.",
        ],
        media: {
          type: "pair",
          items: [
            {
              label: "Lighthouse før",
              src: `${ASSETS}mellemrum-lh-foer.webp`,
              alt: "Lighthouse før: Performance 76, Largest Contentful Paint 6,3 sekunder, Speed Index 3,9 sekunder.",
              caption: "Median af tre målinger før: Performance 76, LCP 6,3 s.",
              light: true,
            },
            {
              label: "Lighthouse efter",
              src: `${ASSETS}mellemrum-lh-efter.webp`,
              alt: "Lighthouse efter: Performance 80, Largest Contentful Paint 5,3 sekunder, Speed Index 1,3 sekunder.",
              caption: "Median af tre målinger efter: Performance 80, LCP 5,3 s.",
              light: true,
            },
          ],
        },
      },
      {
        id: "verifikation",
        heading: "Verificering af tilmeldingsflowet",
        body: [
          "En testtilmelding gav 201 i Network og blev vist på den interne side med eventets titel og venue – også når siden blev åbnet via direkte link og genindlæst.",
        ],
        media: {
          type: "carousel",
          label: "Verifikation på den deployede løsning",
          slides: [
            {
              title: "Kvittering",
              src: `${ASSETS}mellemrum-efter-kvittering.webp`,
              alt: "Tilmeldingsformularen efter afsendelse med beskeden Tak! Din tilmelding er sendt til arrangøren.",
              caption: "Tilmeldingen er sendt, og brugeren får en kvittering (POST svarede 201).",
              light: true,
            },
            {
              title: "Intern side",
              src: `${ASSETS}mellemrum-efter-tilmeldinger.webp`,
              alt: "Den interne side med tilmeldinger, hvor testtilmeldingen vises med eventet Lyd mellem husene, venue Godsbanen og dato.",
              caption: "Testtilmeldingen vises med eventets titel, venue og dato fra de relaterede tabeller.",
              light: true,
            },
            {
              title: "Forside",
              src: `${ASSETS}mellemrum-efter-events.webp`,
              alt: "Forsidens eventkort med kategori, titel, dato og venue, fx Lyd mellem husene på Godsbanen.",
              caption: "Eventkortene henter venue fra den nye venues-tabel.",
              light: true,
            },
          ],
        },
      },
      {
        id: "refleksion",
        heading: "Refleksion og næste skridt",
        body: ["Projektet har lært mig meget om at overtage og forbedre en andens kode. Mine vigtigste refleksioner er:"],
        bullets: [
          {
            lead: "Prioritering",
            text: "Målet er ikke at ændre mest muligt, men at løse det, der betyder mest. Derfor valgte jeg fx fælles komponenter og datoformatering fra.",
          },
          {
            lead: "Performance",
            text: "Overførslen faldt med 90 %, men LCP flyttede sig kun lidt, fordi det største element er hero-billedet – ikke eventbillederne. Det er det næste, jeg ville optimere.",
          },
          {
            lead: "Sikkerhed",
            text: "Databasen er åben efter casens afgrænsning, så alle kan læse tilmeldingernes e-mails. Det skal løses med login og adgangsregler, før løsningen tages i brug.",
          },
        ],
      },
      {
        id: "forretning",
        heading: "Hvordan skaber løsningen værdi?",
        body: [
          "Den største gevinst er, at tilmeldinger nu bliver gemt – det er hele formålet med Mellemrum, og før gik de tabt. Arrangører får et pålideligt overblik over, hvem der kommer, og datamodellen gør det muligt senere at vise kapacitet og statistik. Lettere billeder gør siden hurtigere på mobil, en tilgængelig formular betyder, at flere kan tilmelde sig, og koden er nemmere for den næste udvikler at bygge videre på.",
        ],
      },
    ],
    images: [],
  },
  {
    slug: "vuuh",
    number: 2,
    layout: "story",
    year: "2026",
    title: "Design Better Onboarding",
    client: "Vuuh",
    cover: {
      src: `${ASSETS}vuuh-dashboard-efter.webp`,
      alt: "Det redesignede Vuuh-dashboard med en stepper i tre trin øverst: Install Vuuh, Connect to Shopify og See the Magic in Action.",
      position: "top",
    },
    tags: ["UX audit", "Interaktionsdesign", "Accessibility", "Motion"],
    meta: [
      { label: "Fremgangsmåder", value: "Nielsen’s 10 Usability Heuristics · Cognitive Walkthrough · Accessibility Design Check" },
      { label: "Projektform", value: "Gruppeprojekt · 3. semester" },
      { label: "Værktøjer", value: "Figma · Figma Slides · Lottie" },
    ],
    lead: "Case 2 var et gruppeprojekt, hvor vi redesignede onboardingen for nye Shopify-brugere hos Vuuh – fra installation til det første demoprodukt.",
    links: [
      {
        label: "Figma prototype",
        href: "https://www.figma.com/proto/reqZjXUxZJj8l2q5l9sjf9/Case-2---3.-Semester?page-id=2137%3A198&node-id=2428-9026&viewport=603%2C167%2C0.11&t=fdG1AkPamuiHbcVR-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=2681%3A1421",
      },
      {
        label: "Figma-designfil",
        href: "https://www.figma.com/design/reqZjXUxZJj8l2q5l9sjf9/Case-2---3.-Semester?node-id=2137-198&t=fhEXjmJN9P6ZPVur-1",
      },
      { label: "Præsentation", href: "https://www.figma.com/deck/Fg2N624IMB5Grf1ESC9aNj" },
    ],
    sections: [
      {
        id: "udfordring",
        heading: "Om casen",
        body: [
          "Vuuh henter automatisk produktdata og billeder fra brands og sender dem til forhandlernes webshop. En ny bruger installerer Vuuh fra Shopify App Store, forbinder sin butik og skal hurtigt opleve »magien«: et produkt, der oprettes automatisk. Den rejse brød sammen flere steder. Analysen og redesignet lavede vi i fællesskab – jeg stod især for motion, micro-interactions og anden version af skærmene.",
        ],
      },
      {
        id: "audit",
        heading: "UX audit",
        body: [
          "Vi lavede en heuristisk evaluering ud fra Nielsens 10 heuristikker og en cognitive walkthrough i ni trin med en bruger, der kender Shopify, men ikke Vuuh. Det mest kritiske var skærmen efter installationen, som lignede en tom tilstand uden vej videre. Trin 2–5 og 7 blev primært vurderet som »unclear« eller »unlikely«.",
        ],
        media: {
          type: "carousel",
          slides: [
            {
              title: "Efter installation",
              src: `${ASSETS}vuuh-success-foer.webp`,
              alt: "Den oprindelige side efter installationen: en tom tilstand med teksten Start receiving product data og ingen vej videre til Vuuh.",
              caption: "Siden efter installationen ligner en tom tilstand og leder ikke videre (heuristik 1).",
              light: true,
            },
            {
              title: "Dashboard",
              src: `${ASSETS}vuuh-dashboard-foer.webp`,
              alt: "Det oprindelige Vuuh-dashboard med fire ligestillede kort: velkomst, Shopify-integration, demoprodukt og foreslåede brands.",
              caption: "Fire ligestillede kort og ingen rækkefølge (heuristik 10).",
              light: true,
            },
            {
              title: "Outputs",
              src: `${ASSETS}vuuh-outputs-foer.webp`,
              alt: "Den oprindelige Outputs-side med mange integrationer, hvor Shopify skal findes blandt de andre.",
              caption: "»Connect to Shopify« førte til Outputs, hvor Shopify skulle vælges igen (heuristik 1).",
              light: true,
            },
            {
              title: "Opsætning",
              src: `${ASSETS}vuuh-modal-foer.webp`,
              alt: "Den oprindelige Shopify-opsætning med tekniske felter som Shop name, Option names og Colour option label.",
              caption: "Felter som »Option names« kræver forståelse af Shopifys datamodel (heuristik 2).",
              light: true,
            },
          ],
        },
      },
      {
        id: "undersoegelse",
        heading: "Fund og prioritering",
        body: [
          "Vi samlede fundene i fem Finding Cards. Syntesen var, at Vuuh ikke fortæller brugeren, hvor de er, hvad de skal nu, og om handlingen lykkedes. Slutningen var til gengæld stærk: Når demoproduktet ses i Shopify, giver det mening.",
        ],
        plan: [
          {
            group: "Finding Cards og prioritet",
            items: [
              { label: "Onboardingflowet mangler retning", status: "high" },
              { label: "Systemstatus og feedback er utydelig", status: "high" },
              { label: "Shopify-opsætningen kræver teknisk viden" },
              { label: "Sammenhængen mellem Shopify, brands og produkter er uklar", status: "medium" },
              { label: "Dashboardet viser ikke, hvad der er vigtigt", status: "high" },
            ],
          },
        ],
      },
      {
        id: "installation",
        heading: "Installationen leder videre",
        wide: true,
        body: [
          "Den største ændring var overgangen fra installation til første brug. Success-siden bekræfter nu, at Vuuh er installeret, viser de tre trin og har én knap direkte ind i appen.",
        ],
        media: {
          type: "pair",
          items: [
            {
              label: "Før",
              src: `${ASSETS}vuuh-success-foer.webp`,
              alt: "Den oprindelige side efter installationen: en tom tilstand med teksten Start receiving product data.",
              caption: "En tom tilstand uden vej videre.",
              light: true,
            },
            {
              label: "Efter",
              src: `${ASSETS}vuuh-success-efter.webp`,
              alt: "Redesignet succesmodal: Vuuh is installed successfully, en tjekliste med Install Vuuh afkrydset og knappen Open Vuuh.",
              caption: "Bekræftelse, næste skridt og én knap ind i Vuuh.",
              light: true,
            },
          ],
        },
      },
      {
        id: "dashboard",
        heading: "Dashboardet viser vejen",
        wide: true,
        body: [
          "En stepper i tre trin – Install Vuuh, Connect to Shopify og See the Magic in Action – viser, hvor brugeren er, og hvad næste skridt er. Velkomstwidget og placeholder-brands er fjernet, og brands kommer først efter aha-oplevelsen.",
        ],
        media: {
          type: "pair",
          items: [
            {
              label: "Før",
              src: `${ASSETS}vuuh-dashboard-foer.webp`,
              alt: "Det oprindelige Vuuh-dashboard med fire ligestillede kort.",
              caption: "Fire ligestillede kort.",
              light: true,
            },
            {
              label: "Efter",
              src: `${ASSETS}vuuh-dashboard-efter.webp`,
              alt: "Det redesignede dashboard med en stepper i tre trin øverst.",
              caption: "Én tydelig vej gennem tre trin.",
              light: true,
            },
          ],
        },
      },
      {
        id: "shopify",
        heading: "Ét klik i stedet for tre",
        body: [
          "»Connect to Shopify« åbner nu opsætningen direkte i stedet for at sende brugeren omkring Outputs-siden. Modalen forklarer, hvad brugeren får ud af at forbinde butikken, og kan lukkes uden at miste fremskridt, så onboardingen ikke tager kontrollen.",
        ],
        media: {
          src: `${ASSETS}vuuh-modal-efter.webp`,
          alt: "Redesignet Connect to Shopify-modal med fordele i venstre side og felter for butiksnavn, sprog og valuta i højre side.",
          caption: "Den nye modal åbner direkte fra dashboardet.",
          light: true,
        },
      },
      {
        id: "motion",
        heading: "Motion og feedback",
        wide: true,
        body: [
          "Mit hovedbidrag var animationerne. Når et trin er gennemført, fyldes cirklen med et flueben, linjen bliver lilla, og næste trin bliver aktivt. Loading og succes vises også med tekst, så status ikke kun bæres af bevægelse og farve.",
        ],
        media: [
          {
            type: "carousel",
            label: "Stepper-animationer",
            ratio: "1200 / 230",
            slides: [
              {
                title: "Install Vuuh",
                src: `${ASSETS}vuuh-anim-install.webp`,
                alt: "Animation: Install Vuuh får et flueben, og stepperen går videre.",
                caption: "Første trin gennemføres.",
                light: true,
              },
              {
                title: "Connect to Shopify",
                src: `${ASSETS}vuuh-stepper-animation.webp`,
                alt: "Animation: linjen fyldes lilla, og Connect to Shopify bliver det aktive trin.",
                caption: "Linjen fyldes, og næste trin bliver aktivt.",
                light: true,
              },
              {
                title: "See the Magic",
                src: `${ASSETS}vuuh-anim-magic.webp`,
                alt: "Animation: See the Magic in Action bliver det aktive trin.",
                caption: "Sidste trin: demoproduktet.",
                light: true,
              },
            ],
          },
          {
            type: "pair",
            items: [
              {
                label: "Success",
                src: `${ASSETS}vuuh-anim-success.webp`,
                alt: "Animation af et lilla flueben, der tegnes op.",
                light: true,
              },
              {
                label: "Loading",
                src: `${ASSETS}vuuh-anim-spinner.webp`,
                alt: "Animation af en loading-spinner.",
                light: true,
              },
              {
                label: "Onboarding færdig",
                src: `${ASSETS}vuuh-anim-confetti.webp`,
                alt: "Animation af konfetti, når onboardingen er gennemført.",
                light: true,
              },
            ],
          },
        ],
      },
      {
        id: "adc",
        heading: "Accessibility Design Check",
        body: [
          "Vi kvalificerede designet med 12 checks og prioriterede fire forbedringer: Shopify-feltet fik formatet »my-store.myshopify.com« og en fejlbesked med næste skridt, hjælpetekster og disabled states fik højere kontrast, interaktive elementer fik synligt fokus, og demoflowet fik én gennemgående terminologi.",
        ],
        plan: [
          {
            group: "Vurdering af første version",
            items: [
              { label: "Kontrast", status: "fix" },
              { label: "Farve", status: "fix" },
              { label: "Statusændringer", status: "met" },
              { label: "Tastatur", status: "na" },
              { label: "Synligt fokus", status: "fix" },
              { label: "Target size", status: "fix" },
              { label: "Labels og instruktioner", status: "fix" },
              { label: "Action copy", status: "met" },
              { label: "Fejlidentifikation", status: "fix" },
              { label: "Error recovery", status: "fix" },
              { label: "Konsistens", status: "fix" },
              { label: "Indsats", status: "partial" },
            ],
          },
        ],
      },
      {
        id: "resultat",
        heading: "Resultat og dokumentation",
        body: [
          "Løsningen svarer direkte på fundene: Brugeren ved nu, hvor de er, hvad næste skridt er, og om handlingen lykkedes. Vi præsenterede den for Vuuh, men har ikke testet den med rigtige brugere – vores Finding Cards peger netop på, at det kræver en brugertest.",
        ],
      },
      {
        id: "refleksion",
        heading: "Refleksion og næste skridt",
        body: ["Mine vigtigste refleksioner er:"],
        bullets: [
          {
            lead: "Motion",
            text: "Animation er ikke pynt. I stepperen er bevægelsen selve feedbacken på, at et trin er gennemført.",
          },
          {
            lead: "Afgrænsning",
            text: "Vi lagde onboardingen oven på Vuuhs eksisterende sider, så løsningen er realistisk at bygge.",
          },
          {
            lead: "Næste skridt",
            text: "En test med rigtige butiksejere og et shopnavn, der udfyldes automatisk fra installationen.",
          },
        ],
      },
      {
        id: "forretning",
        heading: "Hvordan skaber løsningen værdi?",
        body: [
          "Shopify-integrationen koster €199 om måneden efter prøveperioden, så hver bruger, der kommer igennem »Connect to Shopify«, er en potentiel betalende kunde. Når demoproduktet viser værdien tidligt og uden risiko, bliver vejen til betaling kortere, og en tydeligere opsætning kan give færre supporthenvendelser.",
        ],
      },
    ],
    images: [],
  },
  {
    slug: "again",
    number: 3,
    layout: "story",
    year: "2026",
    // ­ = blød bindestreg, så ordet kan deles pænt på smalle skærme.
    title: "Koncept- og subbrand­udvikling",
    client: "LA RŌUGE · AGAIN",
    cover: {
      src: `${ASSETS}again-forside.webp`,
      alt: "Forsiden af branddecket: AGAIN-logoet på aubergine ved siden af et foto fra LA RŌUGEs lookbook på sandstensfarvet baggrund.",
    },
    tags: ["Brandudvikling", "Visuel identitet", "UX/UI", "Re-commerce"],
    meta: [
      { label: "Fremgangsmåder", value: "Desk research · Konkurrentanalyse · Målgrupper ud fra motivation" },
      { label: "Projektform", value: "Gruppeprojekt · 3. semester" },
      { label: "Værktøjer", value: "Figma · Figma Slides" },
    ],
    lead: "Case 3 var et gruppeprojekt, hvor Mathias og jeg udviklede AGAIN by LA RŌUGE – et subbrand, der giver LA RŌUGEs secondhand-salg sit eget navn, sin egen identitet og en brugerrejse for både køber og sælger.",
    links: [
      {
        label: "Branddeck",
        href: "https://www.figma.com/slides/zchYm1dFnKPVZ3AzpuNgAQ/AGAIN-by-LA-R%25C5%258CUGE-%25E2%2580%2593-Branddeck--Copy-?node-id=2-2&t=NML88tIsObKh11AQ-0",
      },
      {
        label: "Figma prototype",
        href: "https://www.figma.com/proto/P3Hvb9XDy080R7zP5iuDq7/Magnus-og-Matty-designproject-la-rouge?node-id=148-3674&p=f&viewport=600%2C159%2C0.16&t=J88rN4LdDftN72tT-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=148%3A3674&show-proto-sidebar=1&page-id=148%3A2807",
      },
      {
        label: "Figma-designfil",
        href: "https://www.figma.com/design/P3Hvb9XDy080R7zP5iuDq7/Magnus-og-Matty-designproject-la-rouge?node-id=148-2807&p=f&t=EsvA9WMccaAXEgth-0",
      },
    ],
    sections: [
      {
        id: "udfordring",
        heading: "Om casen",
        body: [
          "LA RŌUGE er et dansk modebrand med fokus på tidløst tøj, kvalitet og self-love. Brandets secondhand-løsning havde ingen identitet, tone eller kommunikation – den var bare en kategori i webshoppen. Vores spørgsmål blev: Hvordan gør vi secondhand til et univers, kunderne opsøger? Løsningen kører allerede på en white-label Shopify-app, så motoren fandtes – der manglede et brand ovenpå. Mathias og jeg lavede hele projektet i fællesskab.",
        ],
      },
      {
        id: "undersoegelse",
        heading: "Research og målgrupper",
        body: [
          "Vi byggede på undersøgelser fra PostNord og Dansk Erhverv fra 2026 og analyserede MOS MOSH ReLoved, RE:SELECTED, GANNI og Roccamore med Vinted som kontrast. Indsigten »pris slår bæredygtighed« blev projektets fundament og gav princippet »brugt tøj, men ikke en brugt oplevelse«. Målgrupperne definerede vi ud fra motivation: den prisbevidste kvalitetsjæger, den loyale LA RŌUGE-kunde, der også sælger, og archive hunteren.",
        ],
        plan: [
          {
            group: "Det, researchen viste",
            items: [
              { label: "Pris er hovedårsagen til at købe brugt" },
              { label: "Bæredygtighed fylder mindst hos de 18–29-årige" },
              { label: "Vinteds annonceflow er 18 skærme" },
              { label: "Secondhand 150–650 kr. mod nyt 699–2.995 kr." },
            ],
          },
        ],
      },
      {
        id: "koncept",
        heading: "Navn og koncept",
        body: [
          "AGAIN binder hele rejsen sammen – wear it again, love it again, sell it again – og »by LA RŌUGE« fungerer som kvalitetsstempel. Balancen mellem selvstændighed og genkendelighed styrede alle valg: LA RŌUGE skal kunne ses hele vejen, men AGAIN skal føles som et sted i sig selv.",
        ],
      },
      {
        id: "identitet",
        heading: "Visuel identitet",
        body: [
          "I logoet flyttede vi stregen fra LA RŌUGEs Ō til det andet A – bogstavet, der kommer igen. Aubergine og sandsten bærer, mens rød kun bruges som signal, fordi den ikke har kontrast nok til små tekster. Overskrifter står i Assistant og brødtekst i Inter, og produktbilleder viser tøjet alene på sandsten med et nærbillede af label eller slid.",
        ],
        media: {
          type: "carousel",
          slides: [
            {
              title: "Logo",
              src: `${ASSETS}again-logo.webp`,
              alt: "LA RŌUGE-logoet ved siden af AGAIN-logoet, hvor stregen over Ō er flyttet til det andet A.",
              caption: "Stregen fra LA RŌUGEs Ō flytter til det andet A.",
              light: true,
            },
            {
              title: "Farver",
              src: `${ASSETS}again-farver.webp`,
              alt: "Farvepaletten med sandsten, rød og ink og deres farvekoder.",
              caption: "Sandsten, rød og ink. Rød bruges kun som signal.",
              light: true,
            },
            {
              title: "Typografi",
              src: `${ASSETS}again-typografi.webp`,
              alt: "Typografi-slide med Assistant til overskrifter og Inter til brødtekst og knapper.",
              caption: "Assistant til overskrifter, Inter til brødtekst og knapper.",
              light: true,
            },
            {
              title: "Billedbrug",
              src: `${ASSETS}again-billedbrug.webp`,
              alt: "Billedbrug: et editorial-foto fra LA RŌUGEs lookbook ved siden af et produktbillede af tøjet alene på sandsten.",
              caption: "Lookbooken sætter stemningen, produktbilledet viser tøjet. Foto fra LA RŌUGEs lookbook.",
              light: true,
            },
          ],
        },
      },
      {
        id: "tone",
        heading: "Tone of voice",
        wide: true,
        body: [
          "Brandlinjer er på engelsk, alt funktionelt på dansk. Sproget er konkret, fordi det skaber tryghed om standen: »Meget god. Båret få gange, ingen synlige spor« frem for »Næsten som ny!«. Sprogfiguren »Encore: Found again« spejler LA RŌUGEs »Mais Qui:«.",
        ],
        media: {
          type: "pair",
          items: [
            {
              label: "Skriv / skriv ikke",
              src: `${ASSETS}again-tone.webp`,
              alt: "Tone of voice-slide med eksempler på, hvad AGAIN skriver, og hvad AGAIN ikke skriver.",
              light: true,
            },
            {
              label: "Labels",
              src: `${ASSETS}again-labels.webp`,
              alt: "De fire labels Found again, Back again, Loved again og Sell it again med deres betydning.",
              light: true,
            },
          ],
        },
      },
      {
        id: "rejse",
        heading: "Brugerrejsen",
        wide: true,
        body: [
          "Prototypen har 11 skærme og to broer mellem køb og salg. Sælgeren vælger tøjet blandt sine tidligere køb, vurderer standen og får et estimat, før noget sendes – seks skærme, og ingen skal skrive en annonce. Standskalaen er fælles: Det, sælgeren vælger, er det, køberen læser.",
        ],
        media: {
          type: "pair",
          items: [
            {
              label: "Flow",
              src: `${ASSETS}again-flow.webp`,
              alt: "Oversigt over brugerrejsen med 11 skærme fordelt på et købsflow og et salgsflow og to broer imellem.",
              caption: "Kvitteringen leder til salg, og voucheren leder tilbage til shoppen.",
              light: true,
            },
            {
              label: "Standskala",
              src: `${ASSETS}again-standskala.webp`,
              alt: "Standskalaen med tre niveauer: Som ny, Meget god og God, hver med en kort definition.",
              caption: "Tre niveauer med en kort definition.",
              light: true,
            },
          ],
        },
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
        heading: "Refleksion og næste skridt",
        body: ["Mine vigtigste refleksioner er:"],
        bullets: [
          {
            lead: "Research",
            text: "Undersøgelserne flyttede vores vinkel fra et grønt budskab til pris og tryghed, og det gjorde konceptet skarpere.",
          },
          {
            lead: "Identitet",
            text: "Vores første identitet med egne farver og mono-skrift skrottede vi, da analysen af lookbooken viste, at vi kunne skabe genkendelighed med LA RŌUGEs egne virkemidler.",
          },
          {
            lead: "Næste skridt",
            text: "En brugertest af køb og salg, en afklaring af voucherens værdi og et varemærketjek af navnet.",
          },
        ],
      },
      {
        id: "forretning",
        heading: "Hvordan skaber løsningen værdi?",
        body: [
          "AGAIN kræver ingen ny platform. Det giver en ny indgang for prisbevidste kunder, og det lave prisniveau mindsker risikoen for kannibalisering. Vouchers holder sælgeren i universet, fordi de også kan bruges på nyt LA RŌUGE, og videresalget bliver hos brandet i stedet for på Vinted. Effekten kan måles på nye kunder, indløste vouchers og andelen af indsendte varer, der bliver solgt.",
        ],
      },
    ],
    images: [],
  },
];

export const findCase = (slug) => CASES.find((c) => c.slug === slug);
