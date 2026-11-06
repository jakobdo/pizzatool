// Dejforhold og fremgangsmåder fra PizzaTool v14.6. Gær er angivet som friskgærækvivalent.
export const recipes = [
  {
    "id": "gorm",
    "name": "Gorms grunddej til pizza",
    "time": "ca. 2 timer",
    "hydration": 66.666667,
    "salt": 2.333333,
    "yeast": 3.333333,
    "oil": 4.333333,
    "sugar": 2.333333,
    "flours": [
      [
        "Hvedemel tipo 00",
        66.666667
      ],
      [
        "Durum- eller semolamel",
        33.333333
      ]
    ],
    "category": "italian"
  },
  {
    "id": "umut",
    "name": "Umuts hurtige pizzadej",
    "time": "ca. 2 timer",
    "hydration": 70,
    "salt": 1,
    "yeast": 5,
    "sugar": 0.84,
    "category": "italian"
  },
  {
    "id": "seb-24",
    "name": "Sebastians 24 timers dej",
    "time": "ca. 24 timer",
    "hydration": 70.049751,
    "salt": 2.985075,
    "yeast": 0.0597015,
    "category": "italian"
  },
  {
    "id": "seb-biga",
    "name": "Sebastians biga",
    "time": "1–2 dage",
    "hydration": 72.018779,
    "salt": 2.535211,
    "yeast": 1,
    "prefermentName": "Biga",
    "prefermentFlour": 100,
    "prefermentHydration": 45.01,
    "flours": [
      [
        "Caputo Nuvola Super",
        70
      ],
      [
        "Caputo Pizzeria",
        30
      ]
    ],
    "category": "italian"
  },
  {
    "id": "vito",
    "name": "Vitos poolishpizza",
    "time": "21–29 timer",
    "hydration": 64.516129,
    "salt": 2.6,
    "yeast": 1.29032258,
    "prefermentName": "Poolish",
    "prefermentFlour": 19.354839,
    "prefermentHydration": 100,
    "sugar": 0.322580645,
    "sugarName": "Honning",
    "yeastType": "instantDry",
    "category": "italian"
  },
  {
    "id": "vito-double",
    "name": "Vitos poolishpizza med dobbelt fermentering",
    "time": "37–53 timer",
    "hydration": 70,
    "salt": 2.5,
    "yeast": 0.5,
    "prefermentName": "Poolish",
    "prefermentFlour": 30,
    "prefermentHydration": 100,
    "sugar": 0.5,
    "sugarName": "Honning",
    "oil": 1,
    "yeastType": "instantDry",
    "category": "italian"
  },
  {
    "id": "vito-autolyse",
    "name": "Vitos poolishpizza med autolyse",
    "time": "26–34 timer",
    "hydration": 70,
    "salt": 2.5,
    "yeast": 1.332,
    "prefermentName": "Poolish",
    "prefermentFlour": 30,
    "prefermentHydration": 100,
    "sugar": 0.5,
    "sugarName": "Honning",
    "oil": 0.42,
    "yeastType": "instantDry",
    "category": "italian"
  },
  {
    "id": "pizzapal",
    "name": "PizzaPals New York Style",
    "time": "ca. 2 dage",
    "hydration": 57.5,
    "salt": 2.5,
    "yeast": 1.5,
    "oil": 2,
    "sugar": 2.5,
    "category": "american"
  },
  {
    "id": "tony-poolish",
    "name": "Tony Gemignanis Master Dough med Poolish",
    "time": "2–3 dage",
    "hydration": 65.4,
    "salt": 1.8,
    "yeast": 1.856,
    "oil": 0.99958845,
    "extras": [
      [
        "Diastatisk malt eller bageenzym",
        1.8
      ]
    ],
    "prefermentName": "Poolish",
    "prefermentFlour": 9.39624334,
    "prefermentHydration": 100,
    "prefermentYeastShare": 0.05062631109913793,
    "yeastType": "instantDry",
    "category": "american"
  },
  {
    "id": "tony-tiga",
    "name": "Tony Gemignanis Master Dough med Tiga",
    "time": "2–3 dage",
    "hydration": 62.79527559,
    "salt": 1.77165354,
    "yeast": 1.84251969,
    "oil": 0.98425197,
    "extras": [
      [
        "Diastatisk malt eller bageenzym",
        1.77165354
      ]
    ],
    "prefermentName": "Tiga",
    "prefermentFlour": 10.82677165,
    "prefermentHydration": 70.90909091,
    "prefermentYeastShare": 0.05876068358325115,
    "yeastType": "instantDry",
    "category": "american"
  },
  {
    "id": "ppah",
    "name": "Perfect Pizza at Home New York Style",
    "time": "4 dage",
    "hydration": 57.999091,
    "salt": 1.999773,
    "yeast": 0.27837746,
    "oil": 2.999659,
    "sugar": 2.799398,
    "yeastType": "instantDry",
    "category": "american"
  },
  {
    "id": "oskar",
    "name": "Oskar Montanos New York Style",
    "time": "4 dage",
    "hydration": 66.153846,
    "salt": 2.615385,
    "yeast": 0.46153846,
    "oil": 3.076923,
    "sugar": 2.923077,
    "sugarName": "Rørsukker",
    "flours": [
      [
        "Hvedemel tipo 00",
        90.769231
      ],
      [
        "Fintmalet fuldkornsmel",
        9.230769
      ]
    ],
    "category": "american"
  },
  {
    "id": "bk-surdej",
    "name": "Surdejspizza",
    "time": "1–2 dage",
    "hydration": 60,
    "salt": 2.5,
    "yeast": 0,
    "extras": [
      [
        "Aktiv surdej",
        15
      ]
    ],
    "category": "baker"
  },
  {
    "id": "bk-hand",
    "name": "Håndæltet pizza",
    "time": "1–3 dage",
    "hydration": 60,
    "salt": 2.962963,
    "yeast": 0.04444444,
    "category": "baker"
  },
  {
    "id": "bk-poolish",
    "name": "Poolishpizza",
    "time": "ca. 2 dage",
    "hydration": 64.568765,
    "salt": 2.564103,
    "yeast": 0.60606061,
    "prefermentName": "Poolish",
    "prefermentFlour": 19.34731935,
    "prefermentHydration": 100,
    "yeastType": "instantDry",
    "category": "baker"
  },
  {
    "id": "bk-enzyme",
    "name": "Pizza med bageenzym",
    "time": "2–3 dage",
    "hydration": 63.829787,
    "salt": 2.431611,
    "yeast": 0.18844985,
    "extras": [
      [
        "Speltsur eller hvedesur",
        4.7112462
      ],
      [
        "Bageenzym",
        0.9118541
      ]
    ],
    "yeastType": "instantDry",
    "category": "baker"
  },
  {
    "id": "bk-napoli",
    "name": "Pizza Napoli",
    "time": "1–3 dage",
    "hydration": 63,
    "salt": 2.5,
    "yeast": 0.05,
    "category": "baker"
  },
  {
    "id": "bk-biga1",
    "name": "Biga Pizza V1",
    "time": "2–3 dage",
    "hydration": 64.988814,
    "salt": 2.684563,
    "yeast": 0.89485459,
    "prefermentName": "Biga",
    "prefermentFlour": 100,
    "prefermentHydration": 50,
    "yeastType": "instantDry",
    "category": "baker"
  },
  {
    "id": "bk-biga2",
    "name": "Biga Pizza V2",
    "time": "2–3 dage",
    "hydration": 62.863535,
    "salt": 2.684564,
    "yeast": 0.07829978,
    "prefermentName": "Biga",
    "prefermentFlour": 100,
    "prefermentHydration": 50,
    "category": "baker"
  },
  {
    "id": "bk-glutenfri",
    "name": "Glutenfri håndæltet pizza",
    "time": "ca. 1 dag",
    "hydration": 74,
    "salt": 3,
    "yeast": 1.66666667,
    "oil": 4.166667,
    "flours": [
      [
        "Glutenfri melblanding (rød Finax)",
        100
      ]
    ],
    "yeastType": "instantDry",
    "category": "baker"
  },
  {
    "id": "bk-detroit",
    "name": "Detroit Style Pizza",
    "time": "5–6 timer",
    "hydration": 72,
    "salt": 2,
    "yeast": 2.4,
    "extras": [
      [
        "Hvedesur",
        5
      ]
    ],
    "yeastType": "instantDry",
    "category": "baker"
  }
];
