// Guider og opskrifter bearbejdet fra PizzaTool v14.6.
export const extras = [
  { id: 'mel', name: 'Mel', kind: 'Guide', description: 'Hydrering, meltyper og melstyrke.' },
  { id: 'gaer', name: 'Gær / omregner', kind: 'Beregner', description: 'Skift mellem frisk gær, aktiv tørgær og instant tørgær.' },
  { id: 'vand', name: 'Vand', kind: 'Beregner', description: 'Find vandtemperaturen ud fra mel, dejtemperatur og æltetid.' },
  { id: 'tomatsauce', name: 'Tomatsauce', kind: 'Opskrifter', description: 'To italienske saucer, med og uden kogning.' },
  { id: 'chili-og-hvidloeg', name: 'Chili og hvidløg', kind: 'Opskrifter', description: 'Chilipasta, chilisauce, chilimarmelade og hvidløgsolie.' },
  { id: 'maengde-og-antal', name: 'Mængde og antal', kind: 'Beregner', description: 'Beregn pizzaer til gæster, dej til formen og mængden af fyld.' },
  { id: 'skaler-opskrift', name: 'Skaler opskrift', kind: 'Beregner', description: 'Omregn din egen direkte dej til det antal og den dejvægt, du ønsker.' },
  { id: 'toppings', name: 'Toppings', kind: 'Inspiration', description: 'Klassiske og alternative kombinationer af fyld.' },
  { id: 'oevrigt', name: 'Øvrigt', kind: 'Opskrifter og tips', description: 'Hvidløgsbrød, pistaciepesto og genopvarmning.' },
];

export const flourStrength = [
  ['Svagt mel', '150–200', '55–60 %', '8 timer'],
  ['Mellemstærkt mel', '200–250', '60–75 %', '24 timer'],
  ['Stærkt mel', '250–300', '60–80 %', '48 timer'],
  ['Meget stærkt mel', '300–400', '70–100 %', 'Over 72 timer'],
];

export const pizzaSizes = [
  { name: 'Lille', diameter: 25, neapolitan: 190, newYork: 150, slices: 4 },
  { name: 'Mellem', diameter: 30, neapolitan: 275, newYork: 220, slices: 6 },
  { name: 'Stor', diameter: 35, neapolitan: 375, newYork: 300, slices: 8 },
  { name: 'Ekstra stor', diameter: 40, neapolitan: 490, newYork: 390, slices: 10 },
];

export const articles = {
  tomatsauce: [
    {
      title: 'Frisk tomatsauce uden kogning',
      intro: 'Til 3–4 pizzaer · Ca. 5 minutter',
      ingredients: ['400 g hakkede tomater', '3 tsk. ekstra jomfruolivenolie', '¼ tsk. havsalt', '2–3 nip tørret oregano', '2–3 blade frisk basilikum', 'Evt. 1 fed hvidløg'],
      steps: ['Riv basilikummen i små stykker. Rør alle ingredienserne sammen i en skål.', 'Smag til med havsalt. Blend kort, hvis du vil have en glattere sauce.'],
    },
    {
      title: 'Kogt italiensk tomatsauce',
      intro: 'Til 3–4 pizzaer · Også god til pasta eller brød',
      ingredients: ['400 g hakkede tomater', '1 fed finthakket hvidløg', '1 tsk. tørret oregano', '1 håndfuld persille', '1 lille håndfuld basilikum', '2 spsk. vand', '1 spsk. olivenolie', 'Evt. 1 tsk. balsamico', 'Havsalt'],
      steps: ['Varm olien, og steg hvidløg og oregano i ca. 30 sekunder. Tilsæt hakket persille, basilikum og evt. balsamico.', 'Tilsæt tomater, vand og lidt salt. Kog i 1 minut, og mos tomaterne til den ønskede konsistens.', 'Lad saucen simre i ca. 8 minutter. Rør jævnligt, og smag til.'],
    },
  ],
  'chili-og-hvidloeg': [
    {
      title: 'Chilipasta',
      ingredients: ['Chiliflager', 'Lidt vand', 'Tomatkoncentrat', 'Presset hvidløg', 'Salt, citron og sukker', 'Kanel og spidskommen', 'Neutral olie', 'Evt. frisk chili'],
      steps: ['Giv chiliflagerne et opkog i lidt vand til den ønskede konsistens.', 'Tilsæt tomatkoncentrat, og lad det stege kort. Rør de øvrige ingredienser i, og smag til.'],
    },
    {
      title: 'Chilisauce med soltørrede tomater',
      ingredients: ['1 glas soltørrede tomater i olie', '3 spsk. chiliflager', '½ tsk. hvidløgspulver', '1 tsk. garam masala', '½ tsk. salt', '1 tsk. cayennepeber', '1 tsk. citronsaft', '2 tsk. sukker', '180 g tomatpuré', 'Neutral olie'],
      steps: ['Hæld lidt af olien fra tomaterne, og blend tomaterne jævne.', 'Rør de øvrige ingredienser i. Tilsæt neutral olie lidt ad gangen, til saucen har den ønskede konsistens. Brug færre chiliflager, hvis du vil have en mildere sauce.'],
    },
    {
      title: 'Chilimarmelade',
      ingredients: ['2 røde peberfrugter', '2 røde chilier', '1 dl sukker', '1 dl hvidvinseddike', '½ dl vand', 'Friskkværnet peber'],
      steps: ['Skær peberfrugt og chili i mindre stykker. Lad alle ingredienser simre i 15–20 minutter.', 'Blend kort, så marmeladen beholder lidt struktur. Lad den køle af, og sæt den på køl.'],
    },
    {
      title: 'Hvidløgsolie',
      ingredients: ['10 fed hvidløg', '150 ml neutral olie', 'Salt efter smag'],
      steps: ['Varm olien til ca. 70–80 °C. Pres hvidløget i olien, og smag til med salt.', 'Sæt olien på køl efter tilberedning, og kassér rester efter 4 dage.'],
      source: ['CDC’s råd om hjemmelavet hvidløgsolie', 'https://www.cdc.gov/botulism/prevention/index.html'],
    },
  ],
  toppings: [
    { title: 'Caprese', ingredients: ['Tomatsauce, mozzarella, tomat, hvidløg, basilikum, olivenolie og peber'], steps: ['Fordel tomatsauce og tynde skiver mozzarella, tomat og hvidløg med basilikum. Bag, og afslut med olie og peber.'] },
    { title: 'Capricciosa', ingredients: ['Tomatsauce, røget skinke, tomat, champignon, hvidløg, mozzarella, basilikum, olivenolie og peber'], steps: ['Skær grøntsagerne tyndt, og fordel med skinke, mozzarella og basilikum. Bag, og afslut med olie og peber.'] },
    { title: 'Bianca', ingredients: ['Ricotta, parmesan, mozzarella, pinjekerner, hvidløg, rosmarin, olivenolie, flagesalt og peber'], steps: ['Smør ricotta på bunden, og fordel ost, pinjekerner, tyndt hvidløg og finthakket rosmarin. Dryp med olie, krydr, og bag.'] },
    { title: 'Ai carciofi', ingredients: ['Tomatsauce, artiskokhjerter, pecorino, valnødder, olivenolie, flagesalt, peber og timian'], steps: ['Afdryp og steg artiskokkerne gyldne. Fordel dem med ost og hakkede valnødder. Bag, og pynt med timian.'] },
    { title: 'Quattro formaggi', ingredients: ['Tomatsauce, taleggio, fontina, parmesan, gorgonzola og valnødder'], steps: ['Riv de hårde oste, og skær de bløde i små stykker. Fordel på tomatsaucen med hakkede valnødder, og bag.'] },
    { title: 'Kartoffel og jalapeño', ingredients: ['Tyndtskåret kartoffel og jalapeño, mozzarella, 120 ml olivenolie og 4 fed hvidløg'], steps: ['Blend olie og hvidløg, og smør et tyndt lag på bunden. Fordel kartoffel, jalapeño og ost, og bag.'] },
    { title: 'Prosciutto crudo eller bresaola', ingredients: ['Tomatsauce, mozzarella, lufttørret skinke eller bresaola, rucola, parmesan og olivenolie'], steps: ['Bag med tomatsauce og mozzarella. Top med skinke, rucola, parmesanflager og olivenolie efter bagning.'] },
    { title: 'Prosciutto cotto e funghi', ingredients: ['Tomatsauce, kogt skinke, champignon og revet mozzarella'], steps: ['Fordel skinke, champignon og mozzarella på et tyndt lag tomatsauce, og bag.'] },
    { title: 'Margherita', ingredients: ['Tomatsauce, mozzarella og frisk basilikum'], steps: ['Fordel tomatsauce, mozzarella og basilikum på bunden, og bag.'] },
    { title: 'Marinara', ingredients: ['Tomatsauce, hvidløg, oregano, frisk basilikum og olivenolie'], steps: ['Fordel tomatsauce og tynde hvidløgsskiver. Drys med oregano og basilikum, dryp med olie, og bag.'] },
    { title: 'Diavola', ingredients: ['Tomatsauce, stærk salami, mozzarella, basilikum og evt. jalapeño'], steps: ['Fordel fyldet på tomatsaucen, og bag.'] },
    { title: 'Al salame piccante', ingredients: ['Tomatsauce, hvidløg, mild rød chili, mozzarella, krydret salami, oregano, olivenolie, flagesalt og peber'], steps: ['Skær hvidløg, chili og mozzarella tyndt. Fordel med salami og oregano på tomatsaucen, og bag.'] },
  ],
  oevrigt: [
    { title: 'Hvidløgsbrød', ingredients: ['1 pizzadejbolle', 'Smør', 'Et par fed hvidløg', 'Rosmarin eller timian', 'Flagesalt'], steps: ['Form dejbollen til et fladt brød. Smelt smør med hvidløg og krydderurter.', 'Pensl dejen med smørret, bag brødet, og drys med flagesalt.'] },
    { title: 'Sebastians pistaciepesto', ingredients: ['60 g usaltede pistacienødder', '35 g pinjekerner', '1 stor håndfuld basilikum', '70 g parmesan', '1 fed hvidløg', '1 dl olivenolie', '1 knivspids salt'], steps: ['Rist eventuelt pinjekernerne kort på en tør pande. Blend alle ingredienser til den ønskede konsistens.', 'Prøv pestoen med fior di latte, mortadella, stracciatella og knuste pistacienødder.'] },
    { title: 'Genopvarm pizza på pande', intro: 'Ca. 4–7 minutter', steps: ['Varm stykket på en pande ved middelvarme, til bunden er sprød.', 'Tilsæt lidt vand på den tomme side af panden. Skru ned, og læg låg på i ca. 1 minut, så dampen smelter osten.'] },
    { title: 'Genopvarm pizza i ovn', intro: 'Ca. 35 minutter', steps: ['Læg stykkerne på en bageplade med kant, og dæk dem med folie.', 'Sæt pladen nederst i en kold ovn, og tænd ved ca. 160 °C. Varm pizzaen, til den er gennemvarm.'] },
  ],
};
