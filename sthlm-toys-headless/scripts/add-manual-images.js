// FILE: scripts/add-manual-images-with-progress.js
// Add manually uploaded Shopify CDN images to products with progress indicators


// Your manual filename to handle mapping
const FILENAME_TO_HANDLE = {
  // Product: #N/A
  '40813_40678_Lifestyle_envr_crop.webp': '#N/A',

  // Product: 10280-blombukett
  '10280_1200x1200_.webp': '10280-blombukett',
  '10280_Box1_v29.webp': '10280-blombukett',
  '10280_Lifestyle_cons_crop.webp': '10280-blombukett',
  '10280_Prod.webp': '10280-blombukett',

  // Product: 10281-bonsaitrad
  '10281_Box1_v29.webp': '10281-bonsaitrad',
  '10281_Lifestyle_04_crop.webp': '10281-bonsaitrad',
  '10281_Prod.webp': '10281-bonsaitrad',

  // Product: 10298-vespa-125
  '10298_Box1_v29.webp': '10298-vespa-125',
  '10298_Lifestyle_cons_crop.webp': '10298-vespa-125',
  '10298_Lifestyle_envr_crop.webp': '10298-vespa-125',
  '10298_Prod.webp': '10298-vespa-125',
  '10298_boxprod_v29.webp': '10298-vespa-125',

  // Product: 10302-optimus-prime
  '10302_Box1_v29.webp': '10302-optimus-prime',
  '10302_Prod.webp': '10302-optimus-prime',
  '10302_boxprod_v29.webp': '10302-optimus-prime',

  // Product: 10311-orkide
  '10311_Box1_v29.webp': '10311-orkide',
  '10311_Lifestyle_Cons_crop.webp': '10311-orkide',
  '10311_Lifestyle_Envr_crop.webp': '10311-orkide',
  '10311_Prod.webp': '10311-orkide',
  '10311_boxprod_v29.webp': '10311-orkide',

  // Product: 10313-bukett-med-vilda-blommor
  '10313_Box1_v29.webp': '10313-bukett-med-vilda-blommor',
  '10313_Lifestyle_Cons_crop.webp': '10313-bukett-med-vilda-blommor',
  '10313_Lifestyle_Envr_crop.webp': '10313-bukett-med-vilda-blommor',
  '10313_Prod.webp': '10313-bukett-med-vilda-blommor',
  '10313_boxprod_v29.webp': '10313-bukett-med-vilda-blommor',

  // Product: 10315-fridfull-tradgard
  '10315_Box1_v29.webp': '10315-fridfull-tradgard',
  '10315_Lifestyle_Cons_crop.webp': '10315-fridfull-tradgard',
  '10315_Lifestyle_Envr_crop.webp': '10315-fridfull-tradgard',
  '10315_Prod.webp': '10315-fridfull-tradgard',
  '10315_boxprod_v29.webp': '10315-fridfull-tradgard',

  // Product: 10327-dune-atreides-royal-ornithopter
  '10327_Box1_v29.webp': '10327-dune-atreides-royal-ornithopter',
  '10327_Lifestyle_Cons_crop.webp': '10327-dune-atreides-royal-ornithopter',
  '10327_Lifestyle_Envr_crop.webp': '10327-dune-atreides-royal-ornithopter',
  '10327_Prod.webp': '10327-dune-atreides-royal-ornithopter',
  '10327_boxprod_v29.webp': '10327-dune-atreides-royal-ornithopter',

  // Product: 10328-bukett-med-rosor
  '10328_Box1_v29.webp': '10328-bukett-med-rosor',
  '10328_Lifestyle_Cons_crop.webp': '10328-bukett-med-rosor',
  '10328_Lifestyle_Envr_crop.webp': '10328-bukett-med-rosor',
  '10328_Prod.webp': '10328-bukett-med-rosor',
  '10328_boxprod_v29.webp': '10328-bukett-med-rosor',

  // Product: 10329-sma-vaxter
  '10329_Box1_v29.webp': '10329-sma-vaxter',
  '10329_Lifestyle_Cons_crop.webp': '10329-sma-vaxter',
  '10329_Lifestyle_Envr_crop.webp': '10329-sma-vaxter',
  '10329_Prod.webp': '10329-sma-vaxter',
  '10329_boxprod_v29.webp': '10329-sma-vaxter',

  // Product: 10330-mclaren-mp4-4-ayrton-senna
  '10330_Box1_v29.webp': '10330-mclaren-mp4-4-ayrton-senna',
  '10330_Lifestyle_Cons_crop.webp': '10330-mclaren-mp4-4-ayrton-senna',
  '10330_Lifestyle_Envr_crop.webp': '10330-mclaren-mp4-4-ayrton-senna',
  '10330_Prod.webp': '10330-mclaren-mp4-4-ayrton-senna',
  '10330_boxprod_v29.webp': '10330-mclaren-mp4-4-ayrton-senna',

  // Product: 10331-kungsfiskare
  '10331_Box1_v29.webp': '10331-kungsfiskare',
  '10331_Lifestyle_Cons_crop.webp': '10331-kungsfiskare',
  '10331_Lifestyle_Envr_crop.webp': '10331-kungsfiskare',
  '10331_Prod.webp': '10331-kungsfiskare',
  '10331_boxprod_v29.webp': '10331-kungsfiskare',

  // Product: 10338-bumblebee
  '10338_Box1_v29.webp': '10338-bumblebee',
  '10338_Lifestyle_Cons_crop.webp': '10338-bumblebee',
  '10338_Lifestyle_Envr_crop.webp': '10338-bumblebee',
  '10338_Prod.webp': '10338-bumblebee',
  '10338_boxprod_v29_sha.webp': '10338-bumblebee',

  // Product: 10342-vacker-rosa-blombukett
  '10342_Box1_v29.webp': '10342-vacker-rosa-blombukett',
  '10342_Lifestyle_Cons_crop.webp': '10342-vacker-rosa-blombukett',
  '10342_Lifestyle_Envr_crop.webp': '10342-vacker-rosa-blombukett',
  '10342_Prod.webp': '10342-vacker-rosa-blombukett',
  '10342_boxprod_v29_sha.webp': '10342-vacker-rosa-blombukett',

  // Product: 10343-miniorkide
  '10343_Box1_v29.webp': '10343-miniorkide',
  '10343_Lifestyle_Cons_crop.webp': '10343-miniorkide',
  '10343_Lifestyle_Envr_crop.webp': '10343-miniorkide',
  '10343_Prod.webp': '10343-miniorkide',
  '10343_boxprod_v29_sha.webp': '10343-miniorkide',

  // Product: 10344-bambudracena
  '10344_Box1_v29.webp': '10344-bambudracena',
  '10344_Lifestyle_Cons_crop.webp': '10344-bambudracena',
  '10344_Lifestyle_Envr_crop.webp': '10344-bambudracena',
  '10344_Prod.webp': '10344-bambudracena',
  '10344_boxprod_v29_sha.webp': '10344-bambudracena',

  // Product: 10347-liten-sommarbukett
  '10347_Box1_v29.webp': '10347-liten-sommarbukett',
  '10347_Lifestyle_cons_crop.webp': '10347-liten-sommarbukett',
  '10347_Lifestyle_envr_crop.webp': '10347-liten-sommarbukett',
  '10347_Prod.webp': '10347-liten-sommarbukett',
  '10347_boxprod_v29_sha.webp': '10347-liten-sommarbukett',

  // Product: 10348-bonsaitrad-japansk-lonn
  '10348_Box1_v29.webp': '10348-bonsaitrad-japansk-lonn',
  '10348_Lifestyle_Cons_crop.webp': '10348-bonsaitrad-japansk-lonn',
  '10348_Lifestyle_Envr_crop.webp': '10348-bonsaitrad-japansk-lonn',
  '10348_Prod.webp': '10348-bonsaitrad-japansk-lonn',
  '10348_boxprod_v29_sha.webp': '10348-bonsaitrad-japansk-lonn',

  // Product: 10349-glada-vaxter
  '10349_Box1_v29.webp': '10349-glada-vaxter',
  '10349_Lifestyle_Cons_crop.webp': '10349-glada-vaxter',
  '10349_Lifestyle_Envr_crop.webp': '10349-glada-vaxter',
  '10349_Prod.webp': '10349-glada-vaxter',
  '10349_boxprod_v29_sha.webp': '10349-glada-vaxter',

  // Product: 10353-williams-racing-fw14b-nigel-mansell
  '10353_Box1_v29.webp': '10353-williams-racing-fw14b-nigel-mansell',
  '10353_Lifestyle_Cons_crop.webp': '10353-williams-racing-fw14b-nigel-mansell',
  '10353_Lifestyle_Envr_crop.webp': '10353-williams-racing-fw14b-nigel-mansell',
  '10353_Prod.webp': '10353-williams-racing-fw14b-nigel-mansell',
  '10353_boxprod_v29_sha.webp': '10353-williams-racing-fw14b-nigel-mansell',

  // Product: 10358-icons-10358
  '10358_Box1_v29.webp': '10358-icons-10358',
  '10358_Lifestyle_Cons_crop.webp': '10358-icons-10358',
  '10358_Lifestyle_Envr_crop.webp': '10358-icons-10358',
  '10358_Prod.webp': '10358-icons-10358',
  '10358_boxprod_v29_sha.webp': '10358-icons-10358',

  // Product: 10359-fontantradgard
  '10359_Box1_v29.webp': '10359-fontantradgard',
  '10359_Lifestyle_Cons_crop.webp': '10359-fontantradgard',
  '10359_Lifestyle_Envr_crop.webp': '10359-fontantradgard',
  '10359_Prod.webp': '10359-fontantradgard',
  '10359_boxprod_v29_sha.webp': '10359-fontantradgard',

  // Product: 10362-franskt-kafe
  '10362_Box1_v29.webp': '10362-franskt-kafe',
  '10362_Lifestyle_Cons_crop.webp': '10362-franskt-kafe',
  '10362_Lifestyle_Envr_crop.webp': '10362-franskt-kafe',
  '10362_Prod.webp': '10362-franskt-kafe',

  // Product: 10363-leonardo-da-vincis-flygmaskin
  '10363_Box1_v29.webp': '10363-leonardo-da-vincis-flygmaskin',
  '10363_Lifestyle_Cons_crop.webp': '10363-leonardo-da-vincis-flygmaskin',
  '10363_Lifestyle_Envr_crop.webp': '10363-leonardo-da-vincis-flygmaskin',
  '10363_Prod.webp': '10363-leonardo-da-vincis-flygmaskin',
  '10363_boxprod_v29_sha.webp': '10363-leonardo-da-vincis-flygmaskin',

  // Product: 10367-icons-10367
  '10367_Box1_v29.webp': '10367-icons-10367',
  '10367_Lifestyle_Cons_crop.webp': '10367-icons-10367',
  '10367_Lifestyle_Envr_crop.webp': '10367-icons-10367',
  '10367_Prod.webp': '10367-icons-10367',
  '10367_boxprod_v29_sha.webp': '10367-icons-10367',

  // Product: 10368-krysantemum
  '10368_Box1_v29.webp': '10368-krysantemum',
  '10368_Lifestyle_Cons_crop.webp': '10368-krysantemum',
  '10368_Lifestyle_Envr_crop.webp': '10368-krysantemum',
  '10368_Prod.webp': '10368-krysantemum',
  '10368_boxprod_v29_sha.webp': '10368-krysantemum',

  // Product: 10369-plommonblomma
  '10369_Box1_v29.webp': '10369-plommonblomma',
  '10369_Lifestyle_Cons_crop.webp': '10369-plommonblomma',
  '10369_Lifestyle_Envr_crop.webp': '10369-plommonblomma',
  '10369_Prod.webp': '10369-plommonblomma',
  '10369_boxprod_v29_sha.webp': '10369-plommonblomma',

  // Product: 10374-botanicals-10374
  '10374_Box1_v29.webp': '10374-botanicals-10374',
  '10374_Lifestyle_Cons_crop.webp': '10374-botanicals-10374',
  '10374_Lifestyle_Envr_crop.webp': '10374-botanicals-10374',
  '10374_Prod.webp': '10374-botanicals-10374',
  '10374_boxprod_v29_sha.webp': '10374-botanicals-10374',

  // Product: 10412-djurtag
  '10412_Box1_v29.webp': '10412-djurtag',
  '10412_Lifestyle_cons_crop.webp': '10412-djurtag',
  '10412_Lifestyle_envr_crop.webp': '10412-djurtag',
  '10412_Prod.webp': '10412-djurtag',
  '10412_boxprod_v29.webp': '10412-djurtag',

  // Product: 10413-vardagsrutiner-baddags
  '10413_Box1_v29.webp': '10413-vardagsrutiner-baddags',
  '10413_Lifestyle_cons_crop.webp': '10413-vardagsrutiner-baddags',
  '10413_Lifestyle_envr_crop.webp': '10413-vardagsrutiner-baddags',
  '10413_Prod.webp': '10413-vardagsrutiner-baddags',
  '10413_boxprod_v29.webp': '10413-vardagsrutiner-baddags',

  // Product: 10414-vardagsrutiner-mat-och-nattning
  '10414_Box1_v29.webp': '10414-vardagsrutiner-mat-och-nattning',
  '10414_Lifestyle_cons_crop.webp': '10414-vardagsrutiner-mat-och-nattning',
  '10414_Lifestyle_envr_crop.webp': '10414-vardagsrutiner-mat-och-nattning',
  '10414_Prod.webp': '10414-vardagsrutiner-mat-och-nattning',
  '10414_boxprod_v29.webp': '10414-vardagsrutiner-mat-och-nattning',

  // Product: 10415-stora-kanslor
  '10415_Box1_v29.webp': '10415-stora-kanslor',
  '10415_Lifestyle_cons_crop.webp': '10415-stora-kanslor',
  '10415_Lifestyle_envr_crop.webp': '10415-stora-kanslor',
  '10415_Prod.webp': '10415-stora-kanslor',
  '10415_boxprod_v29.webp': '10415-stora-kanslor',

  // Product: 10416-skota-om-djur-pa-bondgarden
  '10416_Box1_v29.webp': '10416-skota-om-djur-pa-bondgarden',
  '10416_Lifestyle_cons_crop.webp': '10416-skota-om-djur-pa-bondgarden',
  '10416_Lifestyle_envr_crop.webp': '10416-skota-om-djur-pa-bondgarden',
  '10416_Prod.webp': '10416-skota-om-djur-pa-bondgarden',
  '10416_boxprod_v29.webp': '10416-skota-om-djur-pa-bondgarden',

  // Product: 10417-mack-pa-tavlingen
  '10417_Box1_v29.webp': '10417-mack-pa-tavlingen',
  '10417_Lifestyle_Cons_crop.webp': '10417-mack-pa-tavlingen',
  '10417_Lifestyle_Envr_crop.webp': '10417-mack-pa-tavlingen',
  '10417_Prod.webp': '10417-mack-pa-tavlingen',
  '10417_boxprod_v29.webp': '10417-mack-pa-tavlingen',

  // Product: 10418-elsa-och-bruni-i-den-fortrollade-skogen
  '10418_Box1_v29.webp': '10418-elsa-och-bruni-i-den-fortrollade-skogen',
  '10418_Lifestyle_Cons_crop.webp': '10418-elsa-och-bruni-i-den-fortrollade-skogen',
  '10418_Lifestyle_Envr_crop.webp': '10418-elsa-och-bruni-i-den-fortrollade-skogen',
  '10418_Prod.webp': '10418-elsa-och-bruni-i-den-fortrollade-skogen',
  '10418_boxprod_v29.webp': '10418-elsa-och-bruni-i-den-fortrollade-skogen',

  // Product: 10419-skota-om-bin-och-bikupor
  '10419_Box1_v29.webp': '10419-skota-om-bin-och-bikupor',
  '10419_Lifestyle_cons_crop.webp': '10419-skota-om-bin-och-bikupor',
  '10419_Lifestyle_envr_crop.webp': '10419-skota-om-bin-och-bikupor',
  '10419_Prod.webp': '10419-skota-om-bin-och-bikupor',
  '10419_boxprod_v29.webp': '10419-skota-om-bin-och-bikupor',

  // Product: 10421-alfabetslastbil
  '10421_Box1_v29.webp': '10421-alfabetslastbil',
  '10421_Lifestyle_cons_crop.webp': '10421-alfabetslastbil',
  '10421_Lifestyle_envr_crop.webp': '10421-alfabetslastbil',
  '10421_Prod.webp': '10421-alfabetslastbil',
  '10421_boxprod_v29.webp': '10421-alfabetslastbil',

  // Product: 10422-3in1-aventyr-med-rymdfarja
  '10422_Box1_v29.webp': '10422-3in1-aventyr-med-rymdfarja',
  '10422_Lifestyle_Cons_crop.webp': '10422-3in1-aventyr-med-rymdfarja',
  '10422_Lifestyle_Envr_crop.webp': '10422-3in1-aventyr-med-rymdfarja',
  '10422_Prod.webp': '10422-3in1-aventyr-med-rymdfarja',
  '10422_boxprod_v29.webp': '10422-3in1-aventyr-med-rymdfarja',

  // Product: 10423-byggbara-manniskor-med-stora-kanslor
  '10423_Box1_v29.webp': '10423-byggbara-manniskor-med-stora-kanslor',
  '10423_Lifestyle_cons_crop.webp': '10423-byggbara-manniskor-med-stora-kanslor',
  '10423_Lifestyle_envr_crop.webp': '10423-byggbara-manniskor-med-stora-kanslor',
  '10423_Prod.webp': '10423-byggbara-manniskor-med-stora-kanslor',
  '10423_boxprod_v29.webp': '10423-byggbara-manniskor-med-stora-kanslor',

  // Product: 10424-spins-motorcykelaventyr
  '10424_Box1_v29.webp': '10424-spins-motorcykelaventyr',
  '10424_Lifestyle_Cons_crop.webp': '10424-spins-motorcykelaventyr',
  '10424_Lifestyle_Envr_crop.webp': '10424-spins-motorcykelaventyr',
  '10424_Prod.webp': '10424-spins-motorcykelaventyr',
  '10424_boxprod_v29_sha.webp': '10424-spins-motorcykelaventyr',

  // Product: 10425-tagtunnel-och-spar-expansionsset
  '10425_Box1_v29.webp': '10425-tagtunnel-och-spar-expansionsset',
  '10425_Lifestyle_cons_crop.webp': '10425-tagtunnel-och-spar-expansionsset',
  '10425_Lifestyle_envr_crop.webp': '10425-tagtunnel-och-spar-expansionsset',
  '10425_Prod.webp': '10425-tagtunnel-och-spar-expansionsset',
  '10425_boxprod_v29_sha.webp': '10425-tagtunnel-och-spar-expansionsset',

  // Product: 10426-tagbro-och-spar-expansionsset
  '10426_Box1_v29.webp': '10426-tagbro-och-spar-expansionsset',
  '10426_Lifestyle_cons_crop.webp': '10426-tagbro-och-spar-expansionsset',
  '10426_Lifestyle_envr_crop.webp': '10426-tagbro-och-spar-expansionsset',
  '10426_Prod.webp': '10426-tagbro-och-spar-expansionsset',
  '10426_boxprod_v29_sha.webp': '10426-tagbro-och-spar-expansionsset',

  // Product: 10427-interaktivt-aventyrstag
  '10427_Box1_v29.webp': '10427-interaktivt-aventyrstag',
  '10427_Lifestyle_cons_crop.webp': '10427-interaktivt-aventyrstag',
  '10427_Lifestyle_envr_crop.webp': '10427-interaktivt-aventyrstag',
  '10427_Prod.webp': '10427-interaktivt-aventyrstag',
  '10427_boxprod_v29_sha.webp': '10427-interaktivt-aventyrstag',

  // Product: 10428-stort-interaktivt-pendeltag
  '10428_Box1_v29.webp': '10428-stort-interaktivt-pendeltag',
  '10428_Lifestyle_cons_crop.webp': '10428-stort-interaktivt-pendeltag',
  '10428_Lifestyle_envr_crop.webp': '10428-stort-interaktivt-pendeltag',
  '10428_Prod.webp': '10428-stort-interaktivt-pendeltag',
  '10428_boxprod_v29_sha.webp': '10428-stort-interaktivt-pendeltag',

  // Product: 10431-greta-gris-tradgard-och-tradkoja
  '10431_Box1_v29.webp': '10431-greta-gris-tradgard-och-tradkoja',
  '10431_Lifestyle_Cons_crop.webp': '10431-greta-gris-tradgard-och-tradkoja',
  '10431_Lifestyle_Envr_crop.webp': '10431-greta-gris-tradgard-och-tradkoja',
  '10431_Prod.webp': '10431-greta-gris-tradgard-och-tradkoja',
  '10431_boxprod_v29_sha.webp': '10431-greta-gris-tradgard-och-tradkoja',

  // Product: 10432-greta-gris-battur
  '10432_Box1_v29.webp': '10432-greta-gris-battur',
  '10432_Lifestyle_Cons_crop.webp': '10432-greta-gris-battur',
  '10432_Lifestyle_Envr_crop.webp': '10432-greta-gris-battur',
  '10432_Prod.webp': '10432-greta-gris-battur',
  '10432_boxprod_v29_sha.webp': '10432-greta-gris-battur',

  // Product: 10433-greta-gris-fodelsedagshus
  '10433_Box1_v29.webp': '10433-greta-gris-fodelsedagshus',
  '10433_Lifestyle_Cons_crop.webp': '10433-greta-gris-fodelsedagshus',
  '10433_Lifestyle_Envr_crop.webp': '10433-greta-gris-fodelsedagshus',
  '10433_Prod.webp': '10433-greta-gris-fodelsedagshus',
  '10433_boxprod_v29_sha.webp': '10433-greta-gris-fodelsedagshus',

  // Product: 10434-greta-gris-stormarknad
  '10434_Box1_v29.webp': '10434-greta-gris-stormarknad',
  '10434_Lifestyle_cons_crop.webp': '10434-greta-gris-stormarknad',
  '10434_Lifestyle_envr_crop.webp': '10434-greta-gris-stormarknad',
  '10434_Prod.webp': '10434-greta-gris-stormarknad',
  '10434_boxprod_v29_sha.webp': '10434-greta-gris-stormarknad',

  // Product: 10435-ariels-magiska-undervattenspalats
  '10435_Box1_v29.webp': '10435-ariels-magiska-undervattenspalats',
  '10435_Lifestyle_Cons_crop.webp': '10435-ariels-magiska-undervattenspalats',
  '10435_Lifestyle_Envr_crop.webp': '10435-ariels-magiska-undervattenspalats',
  '10435_Prod.webp': '10435-ariels-magiska-undervattenspalats',
  '10435_boxprod_v29_sha.webp': '10435-ariels-magiska-undervattenspalats',

  // Product: 10440-balans-och-stapeltrad
  '10440_Box1_v29.webp': '10440-balans-och-stapeltrad',
  '10440_Lifestyle_cons_crop.webp': '10440-balans-och-stapeltrad',
  '10440_Lifestyle_envr_crop.webp': '10440-balans-och-stapeltrad',
  '10440_Prod.webp': '10440-balans-och-stapeltrad',
  '10440_boxprod_v29_sha.webp': '10440-balans-och-stapeltrad',

  // Product: 10441-formsorterare-valphus
  '10441_Box1_v29.webp': '10441-formsorterare-valphus',
  '10441_Lifestyle_Cons_crop.webp': '10441-formsorterare-valphus',
  '10441_Lifestyle_Envr_crop.webp': '10441-formsorterare-valphus',
  '10441_Prod.webp': '10441-formsorterare-valphus',
  '10441_boxprod_v29_sha.webp': '10441-formsorterare-valphus',

  // Product: 10442-vilda-djurfamiljer-pingviner-och-lejon
  '10442_Box1_v29.webp': '10442-vilda-djurfamiljer-pingviner-och-lejon',
  '10442_Lifestyle_cons_crop.webp': '10442-vilda-djurfamiljer-pingviner-och-lejon',
  '10442_Lifestyle_envr_crop.webp': '10442-vilda-djurfamiljer-pingviner-och-lejon',
  '10442_Prod.webp': '10442-vilda-djurfamiljer-pingviner-och-lejon',
  '10442_boxprod_v29_sha.webp': '10442-vilda-djurfamiljer-pingviner-och-lejon',

  // Product: 10443-forsta-gangen-pa-flygplatsen
  '10443_Box1_v29.webp': '10443-forsta-gangen-pa-flygplatsen',
  '10443_Lifestyle_Cons_crop.webp': '10443-forsta-gangen-pa-flygplatsen',
  '10443_Lifestyle_Envr_crop.webp': '10443-forsta-gangen-pa-flygplatsen',
  '10443_Prod.webp': '10443-forsta-gangen-pa-flygplatsen',
  '10443_boxprod_v29_sha.webp': '10443-forsta-gangen-pa-flygplatsen',

  // Product: 10444-kreativ-tradgard-och-blommor
  '10444_Box1_v29.webp': '10444-kreativ-tradgard-och-blommor',
  '10444_Lifestyle_cons_crop.webp': '10444-kreativ-tradgard-och-blommor',
  '10444_Lifestyle_envr_crop.webp': '10444-kreativ-tradgard-och-blommor',
  '10444_Prod.webp': '10444-kreativ-tradgard-och-blommor',
  '10444_boxprod_v29_sha.webp': '10444-kreativ-tradgard-och-blommor',

  // Product: 10445-f1®-team-racerbilar-och-forare
  '10445_Box1_v29.webp': '10445-f1®-team-racerbilar-och-forare',
  '10445_Prod.webp': '10445-f1®-team-racerbilar-och-forare',
  '10445_boxprod_v29_sha.webp': '10445-f1®-team-racerbilar-och-forare',

  // Product: 10446-3-i-1-vilda-djurfamiljer
  '10446_Box1_v29.webp': '10446-3-i-1-vilda-djurfamiljer',
  '10446_Lifestyle_cons_crop.webp': '10446-3-i-1-vilda-djurfamiljer',
  '10446_Lifestyle_envr_crop.webp': '10446-3-i-1-vilda-djurfamiljer',
  '10446_Prod.webp': '10446-3-i-1-vilda-djurfamiljer',
  '10446_boxprod_v29_sha.webp': '10446-3-i-1-vilda-djurfamiljer',

  // Product: 10447-ambulans-och-forare
  '10447_Box1_v29.webp': '10447-ambulans-och-forare',
  '10447_Lifestyle_cons_crop.webp': '10447-ambulans-och-forare',
  '10447_Lifestyle_envr_crop.webp': '10447-ambulans-och-forare',
  '10447_Prod.webp': '10447-ambulans-och-forare',
  '10447_boxprod_v29_sha.webp': '10447-ambulans-och-forare',

  // Product: 10448-3-i-1-djur-pa-hjul
  '10448_Box1_v29.webp': '10448-3-i-1-djur-pa-hjul',
  '10448_Lifestyle_Cons_crop.webp': '10448-3-i-1-djur-pa-hjul',
  '10448_Lifestyle_Envr_crop.webp': '10448-3-i-1-djur-pa-hjul',
  '10448_Prod.webp': '10448-3-i-1-djur-pa-hjul',
  '10448_boxprod_v29_sha.webp': '10448-3-i-1-djur-pa-hjul',

  // Product: 10449-forsta-gangen-ga-till-doktorn
  '10449_Box1_v29.webp': '10449-forsta-gangen-ga-till-doktorn',
  '10449_Lifestyle_cons_crop.webp': '10449-forsta-gangen-ga-till-doktorn',
  '10449_Lifestyle_envr_crop.webp': '10449-forsta-gangen-ga-till-doktorn',
  '10449_Prod.webp': '10449-forsta-gangen-ga-till-doktorn',
  '10449_boxprod_v29_sha.webp': '10449-forsta-gangen-ga-till-doktorn',

  // Product: 10450-hopsys-slottsspel
  '10450_Box1_v29.webp': '10450-hopsys-slottsspel',
  '10450_Lifestyle_Cons_crop.webp': '10450-hopsys-slottsspel',
  '10450_Lifestyle_Envr_crop.webp': '10450-hopsys-slottsspel',
  '10450_Prod.webp': '10450-hopsys-slottsspel',
  '10450_boxprod_v29_sha.webp': '10450-hopsys-slottsspel',

  // Product: 10451-3-i-1-dinosaurier-pa-hjul
  '10451_Box1_v29.webp': '10451-3-i-1-dinosaurier-pa-hjul',
  '10451_Lifestyle_Cons_crop.webp': '10451-3-i-1-dinosaurier-pa-hjul',
  '10451_Lifestyle_Envr_crop.webp': '10451-3-i-1-dinosaurier-pa-hjul',
  '10451_Prod.webp': '10451-3-i-1-dinosaurier-pa-hjul',
  '10451_boxprod_v29_sha.webp': '10451-3-i-1-dinosaurier-pa-hjul',

  // Product: 10452-campingtur
  '10452_Box1_v29.webp': '10452-campingtur',
  '10452_Lifestyle_cons_crop.webp': '10452-campingtur',
  '10452_Lifestyle_envr_crop.webp': '10452-campingtur',
  '10452_Prod.webp': '10452-campingtur',
  '10452_boxprod_v39_sha.webp': '10452-campingtur',

  // Product: 10453-tivoli
  '10453_Box1_v29.webp': '10453-tivoli',
  '10453_Lifestyle_cons_crop.webp': '10453-tivoli',
  '10453_Lifestyle_envr_crop.webp': '10453-tivoli',
  '10453_Prod.webp': '10453-tivoli',

  // Product: 10454-musse-piggs-klubbhus-och-bil
  '10454_Box1_v29.webp': '10454-musse-piggs-klubbhus-och-bil',
  '10454_Lifestyle_cons_crop.webp': '10454-musse-piggs-klubbhus-och-bil',
  '10454_Lifestyle_envr_crop.webp': '10454-musse-piggs-klubbhus-och-bil',
  '10454_Prod.webp': '10454-musse-piggs-klubbhus-och-bil',

  // Product: 10455-annas-och-elsas-frostiga-slottsparty
  '10455_Box1_v29.webp': '10455-annas-och-elsas-frostiga-slottsparty',
  '10455_Lifestyle_Cons_crop.webp': '10455-annas-och-elsas-frostiga-slottsparty',
  '10455_Lifestyle_Envr_crop.webp': '10455-annas-och-elsas-frostiga-slottsparty',
  '10455_Prod.webp': '10455-annas-och-elsas-frostiga-slottsparty',
  '10455_boxprod_v29_sha.webp': '10455-annas-och-elsas-frostiga-slottsparty',

  // Product: 10456-mcqueens-besok-i-docs-garage
  '10456_Box1_v29.webp': '10456-mcqueens-besok-i-docs-garage',
  '10456_Lifestyle_Cons_crop.webp': '10456-mcqueens-besok-i-docs-garage',
  '10456_Lifestyle_Envr_crop.webp': '10456-mcqueens-besok-i-docs-garage',
  '10456_Prod.webp': '10456-mcqueens-besok-i-docs-garage',
  '10456_boxprod_v29_sha.webp': '10456-mcqueens-besok-i-docs-garage',

  // Product: 10457-nalle-puhs-fodelsedagskalas
  '10457_Box1_v29.webp': '10457-nalle-puhs-fodelsedagskalas',
  '10457_Lifestyle_cons_crop.webp': '10457-nalle-puhs-fodelsedagskalas',
  '10457_Lifestyle_envr_crop.webp': '10457-nalle-puhs-fodelsedagskalas',
  '10457_Prod.webp': '10457-nalle-puhs-fodelsedagskalas',
  '10457_boxprod_v29_sha.webp': '10457-nalle-puhs-fodelsedagskalas',

  // Product: 10458-glassutflykt-med-bluey
  '10458_Box1_v29.webp': '10458-glassutflykt-med-bluey',
  '10458_Lifestyle_Cons_crop.webp': '10458-glassutflykt-med-bluey',
  '10458_Lifestyle_Envr_crop.webp': '10458-glassutflykt-med-bluey',
  '10458_Prod.webp': '10458-glassutflykt-med-bluey',
  '10458_boxprod_v29_sha.webp': '10458-glassutflykt-med-bluey',

  // Product: 10459-blueys-hus-med-memoryspel
  '10459_Box1_v29.webp': '10459-blueys-hus-med-memoryspel',
  '10459_Lifestyle_Cons_crop.webp': '10459-blueys-hus-med-memoryspel',
  '10459_Lifestyle_Envr_crop.webp': '10459-blueys-hus-med-memoryspel',
  '10459_Prod.webp': '10459-blueys-hus-med-memoryspel',
  '10459_boxprod_v29_sha.webp': '10459-blueys-hus-med-memoryspel',

  // Product: 10460-gron-byggplatta
  '10460_Box1_v29.webp': '10460-gron-byggplatta',
  '10460_Lifestyle_cons_crop.webp': '10460-gron-byggplatta',
  '10460_Lifestyle_envr_crop.webp': '10460-gron-byggplatta',
  '10460_Prod.webp': '10460-gron-byggplatta',
  '10460_boxprod_v29_sha.webp': '10460-gron-byggplatta',

  // Product: 10696-lego®-fantasiklosslada-mellan
  '10696_Box1_in.webp': '10696-lego®-fantasiklosslada-mellan',
  '10696_Prod.webp': '10696-lego®-fantasiklosslada-mellan',

  // Product: 10698-lego®-fantasiklosslada-stor
  '10698_Prod_Alt_01.webp': '10698-lego®-fantasiklosslada-stor',
  '10698_box1_in.webp': '10698-lego®-fantasiklosslada-stor',

  // Product: 10713-fantasivaska
  '10713_Box1_V29.webp': '10713-fantasivaska',
  '10713_Prod.webp': '10713-fantasivaska',

  // Product: 10788-gabbys-dockskap
  '10788_Box1_v29.webp': '10788-gabbys-dockskap',
  '10788_Lifestyle_Cons_crop.webp': '10788-gabbys-dockskap',
  '10788_Lifestyle_Envr_crop.webp': '10788-gabbys-dockskap',
  '10788_Prod.webp': '10788-gabbys-dockskap',
  '10788_boxprod_v29.webp': '10788-gabbys-dockskap',

  // Product: 10789-spider-mans-bil-och-doc-ock
  '10789_Box1_v29.webp': '10789-spider-mans-bil-och-doc-ock',
  '10789_Lifestyle_Cons_crop.webp': '10789-spider-mans-bil-och-doc-ock',
  '10789_Lifestyle_Envr_crop.webp': '10789-spider-mans-bil-och-doc-ock',
  '10789_Prod.webp': '10789-spider-mans-bil-och-doc-ock',
  '10789_boxprod_v29.webp': '10789-spider-mans-bil-och-doc-ock',

  // Product: 10794-team-spideys-nathogkvarter
  '10794_Box1_v29.webp': '10794-team-spideys-nathogkvarter',
  '10794_Lifestyle_Cons_crop.webp': '10794-team-spideys-nathogkvarter',
  '10794_Lifestyle_Envr_crop.webp': '10794-team-spideys-nathogkvarter',
  '10794_Prod.webp': '10794-team-spideys-nathogkvarter',
  '10794_boxprod_v29.webp': '10794-team-spideys-nathogkvarter',

  // Product: 10795-pyssel-med-lill-boxen
  '10795_Box1_v29.webp': '10795-pyssel-med-lill-boxen',
  '10795_Lifestyle_Cons_crop.webp': '10795-pyssel-med-lill-boxen',
  '10795_Lifestyle_Envr_crop.webp': '10795-pyssel-med-lill-boxen',
  '10795_Prod.webp': '10795-pyssel-med-lill-boxen',
  '10795_boxprod_v29_sha.webp': '10795-pyssel-med-lill-boxen',

  // Product: 10796-gabbys-kattskotora
  '10796_Box1_v29.webp': '10796-gabbys-kattskotora',
  '10796_Lifestyle_Cons_crop.webp': '10796-gabbys-kattskotora',
  '10796_Lifestyle_Envr_crop.webp': '10796-gabbys-kattskotora',
  '10796_Prod.webp': '10796-gabbys-kattskotora',
  '10796_boxprod_v29_sha.webp': '10796-gabbys-kattskotora',

  // Product: 10797-gabbys-partyrum
  '10797_Box1_v29.webp': '10797-gabbys-partyrum',
  '10797_Lifestyle_Cons_crop.webp': '10797-gabbys-partyrum',
  '10797_Lifestyle_Envr_crop.webp': '10797-gabbys-partyrum',
  '10797_Prod.webp': '10797-gabbys-partyrum',
  '10797_boxprod_v29_sha.webp': '10797-gabbys-partyrum',

  // Product: 10913-klosslada
  '10913_Box1_v29.webp': '10913-klosslada',
  '10913_Lifestyle_Cons_crop.webp': '10913-klosslada',
  '10913_Lifestyle_Envr_crop.webp': '10913-klosslada',
  '10913_Prod.webp': '10913-klosslada',

  // Product: 10914-klosslada-deluxe
  '10914_Box1_v29.webp': '10914-klosslada-deluxe',
  '10914_Lifestyle_Cons_crop.webp': '10914-klosslada-deluxe',
  '10914_Lifestyle_Envr_crop.webp': '10914-klosslada-deluxe',
  '10914_Prod.webp': '10914-klosslada-deluxe',

  // Product: 10931-lastbil-och-gravmaskin
  '10931_Box1_v29.webp': '10931-lastbil-och-gravmaskin',
  '10931_Lifestyle_cons_crop.webp': '10931-lastbil-och-gravmaskin',
  '10931_Lifestyle_envr_crop.webp': '10931-lastbil-och-gravmaskin',
  '10931_Prod.webp': '10931-lastbil-och-gravmaskin',

  // Product: 10941-musse-och-mimmis-fodelsedagstag
  '10941_Box1_v29.webp': '10941-musse-och-mimmis-fodelsedagstag',
  '10941_Lifestyle_Cons_crop.webp': '10941-musse-och-mimmis-fodelsedagstag',
  '10941_Lifestyle_Envr_crop.webp': '10941-musse-och-mimmis-fodelsedagstag',
  '10941_Prod.webp': '10941-musse-och-mimmis-fodelsedagstag',

  // Product: 10954-siffertag-lar-dig-rakna
  '10954_Box1_v29.webp': '10954-siffertag-lar-dig-rakna',
  '10954_Lifestyle_Cons_crop.webp': '10954-siffertag-lar-dig-rakna',
  '10954_Lifestyle_Envr_crop.webp': '10954-siffertag-lar-dig-rakna',
  '10954_Prod.webp': '10954-siffertag-lar-dig-rakna',

  // Product: 10965-skoj-i-badet-flytande-djurtag
  '10965_Box1_v29.webp': '10965-skoj-i-badet-flytande-djurtag',
  '10965_Lifestyle_cons_crop.webp': '10965-skoj-i-badet-flytande-djurtag',
  '10965_Lifestyle_envr_crop.webp': '10965-skoj-i-badet-flytande-djurtag',
  '10965_Prod.webp': '10965-skoj-i-badet-flytande-djurtag',
  '10965_boxprod_v29.webp': '10965-skoj-i-badet-flytande-djurtag',

  // Product: 10967-polismotorcykel
  '10967_Box1_v29.webp': '10967-polismotorcykel',
  '10967_Lifestyle_cons_crop.webp': '10967-polismotorcykel',
  '10967_Lifestyle_envr_crop.webp': '10967-polismotorcykel',
  '10967_Prod.webp': '10967-polismotorcykel',
  '10967_boxprod_v29.webp': '10967-polismotorcykel',

  // Product: 10969-brandbil
  '10969_Box1_v29.webp': '10969-brandbil',
  '10969_Lifestyle_cons_crop.webp': '10969-brandbil',
  '10969_Lifestyle_envr_crop.webp': '10969-brandbil',
  '10969_Prod.webp': '10969-brandbil',
  '10969_boxprod_v29.webp': '10969-brandbil',

  // Product: 10993-3in1-tradkoja
  '10993_Box1_v29.webp': '10993-3in1-tradkoja',
  '10993_Lifestyle_Cons_crop.webp': '10993-3in1-tradkoja',
  '10993_Lifestyle_Envr_crop.webp': '10993-3in1-tradkoja',
  '10993_Prod.webp': '10993-3in1-tradkoja',
  '10993_boxprod_v29.webp': '10993-3in1-tradkoja',

  // Product: 10994-3in1-familjehus
  '10994_Box1_v29.webp': '10994-3in1-familjehus',
  '10994_Lifestyle_Cons_crop.webp': '10994-3in1-familjehus',
  '10994_Lifestyle_Envr_crop.webp': '10994-3in1-familjehus',
  '10994_Prod.webp': '10994-3in1-familjehus',
  '10994_boxprod_v29.webp': '10994-3in1-familjehus',

  // Product: 11023-gron-basplatta
  '11023_Box1_v29.webp': '11023-gron-basplatta',
  '11023_Lifestyle_cons_crop.webp': '11023-gron-basplatta',
  '11023_Lifestyle_envr_crop.webp': '11023-gron-basplatta',
  '11023_Prod.webp': '11023-gron-basplatta',
  '11023_boxprod_v29.webp': '11023-gron-basplatta',

  // Product: 11024-gra-basplatta
  '11024_Box1_v29.webp': '11024-gra-basplatta',
  '11024_Lifestyle_cons_crop.webp': '11024-gra-basplatta',
  '11024_Lifestyle_envr_crop.webp': '11024-gra-basplatta',
  '11024_Prod.webp': '11024-gra-basplatta',
  '11024_boxprod_v29.webp': '11024-gra-basplatta',

  // Product: 11025-bla-basplatta
  '11025_Box1_v29.webp': '11025-bla-basplatta',
  '11025_Lifestyle_cons_crop.webp': '11025-bla-basplatta',
  '11025_Lifestyle_envr_crop.webp': '11025-bla-basplatta',
  '11025_Prod.webp': '11025-bla-basplatta',
  '11025_boxprod_v29.webp': '11025-bla-basplatta',

  // Product: 11026-vit-basplatta
  '11026_Box1_v29.webp': '11026-vit-basplatta',
  '11026_Lifestyle_cons_crop.webp': '11026-vit-basplatta',
  '11026_Lifestyle_envr_crop.webp': '11026-vit-basplatta',
  '11026_Prod.webp': '11026-vit-basplatta',
  '11026_boxprod_v29.webp': '11026-vit-basplatta',

  // Product: 11034-kreativa-husdjur
  '11034_Box1_v29.webp': '11034-kreativa-husdjur',
  '11034_Lifestyle_Cons_crop.webp': '11034-kreativa-husdjur',
  '11034_Lifestyle_Envr_crop.webp': '11034-kreativa-husdjur',
  '11034_Prod.webp': '11034-kreativa-husdjur',
  '11034_boxprod_v29.webp': '11034-kreativa-husdjur',

  // Product: 11035-kreativa-hus
  '11035_Box1_v29.webp': '11035-kreativa-hus',
  '11035_Lifestyle_Envr_crop.webp': '11035-kreativa-hus',
  '11035_Prod.webp': '11035-kreativa-hus',
  '11035_boxprod_v29.webp': '11035-kreativa-hus',

  // Product: 11036-kreativa-fordon
  '11036_Box1_v29.webp': '11036-kreativa-fordon',
  '11036_Lifestyle_Cons_crop.webp': '11036-kreativa-fordon',
  '11036_Lifestyle_Envr_crop.webp': '11036-kreativa-fordon',
  '11036_Prod.webp': '11036-kreativa-fordon',
  '11036_boxprod_v29.webp': '11036-kreativa-fordon',

  // Product: 11037-kreativa-planeter
  '11037_Box1_v29.webp': '11037-kreativa-planeter',
  '11037_Lifestyle_Cons_crop.webp': '11037-kreativa-planeter',
  '11037_Lifestyle_Envr_crop.webp': '11037-kreativa-planeter',
  '11037_Prod.webp': '11037-kreativa-planeter',
  '11037_boxprod_v29.webp': '11037-kreativa-planeter',

  // Product: 11039-kreativa-matvanner
  '11039_Box1_v29.webp': '11039-kreativa-matvanner',
  '11039_Lifestyle_Cons_crop.webp': '11039-kreativa-matvanner',
  '11039_Lifestyle_Envr_crop.webp': '11039-kreativa-matvanner',
  '11039_Prod.webp': '11039-kreativa-matvanner',
  '11039_boxprod_v29_sha.webp': '11039-kreativa-matvanner',

  // Product: 11040-magisk-genomskinlig-lada
  '11040_Box1_v29.webp': '11040-magisk-genomskinlig-lada',
  '11040_Lifestyle_Cons_crop.webp': '11040-magisk-genomskinlig-lada',
  '11040_Lifestyle_Envr_crop.webp': '11040-magisk-genomskinlig-lada',
  '11040_Prod.webp': '11040-magisk-genomskinlig-lada',
  '11040_boxprod_v29_sha.webp': '11040-magisk-genomskinlig-lada',

  // Product: 11041-kreativa-dinosaurier
  '11041_Box1_v29.webp': '11041-kreativa-dinosaurier',
  '11041_Lifestyle_Cons_crop.webp': '11041-kreativa-dinosaurier',
  '11041_Lifestyle_Envr_crop.webp': '11041-kreativa-dinosaurier',
  '11041_Prod.webp': '11041-kreativa-dinosaurier',
  '11041_boxprod_v29_sha.webp': '11041-kreativa-dinosaurier',

  // Product: 11042-kreativ-gladlada
  '11042_Box1_v29.webp': '11042-kreativ-gladlada',
  '11042_Lifestyle_Cons_crop.webp': '11042-kreativ-gladlada',
  '11042_Lifestyle_Envr_crop.webp': '11042-kreativ-gladlada',
  '11042_Prod.webp': '11042-kreativ-gladlada',
  '11042_boxprod_v29_sha.webp': '11042-kreativ-gladlada',

  // Product: 11198-spins-och-electros-jakt-med-dinosauriefordon
  '11198_Box1_v29.webp': '11198-spins-och-electros-jakt-med-dinosauriefordon',
  '11198_Lifestyle_Cons_crop.webp': '11198-spins-och-electros-jakt-med-dinosauriefordon',
  '11198_Lifestyle_Envr_crop.webp': '11198-spins-och-electros-jakt-med-dinosauriefordon',
  '11198_Prod.webp': '11198-spins-och-electros-jakt-med-dinosauriefordon',
  '11198_boxprod_v29_sha.webp': '11198-spins-och-electros-jakt-med-dinosauriefordon',

  // Product: 11199-team-spideys-raddning-med-dino-crawler
  '11199_Box1_v29.webp': '11199-team-spideys-raddning-med-dino-crawler',
  '11199_Lifestyle_Cons_crop.webp': '11199-team-spideys-raddning-med-dino-crawler',
  '11199_Lifestyle_Envr_crop.webp': '11199-team-spideys-raddning-med-dino-crawler',
  '11199_Prod.webp': '11199-team-spideys-raddning-med-dino-crawler',
  '11199_boxprod_v29_sha.webp': '11199-team-spideys-raddning-med-dino-crawler',

  // Product: 11200-spideys-och-gobbys-raptorstrid-vid-tradkojan
  '11200_Box1_v29.webp': '11200-spideys-och-gobbys-raptorstrid-vid-tradkojan',
  '11200_Lifestyle_Cons_crop.webp': '11200-spideys-och-gobbys-raptorstrid-vid-tradkojan',
  '11200_Lifestyle_Envr_crop.webp': '11200-spideys-och-gobbys-raptorstrid-vid-tradkojan',
  '11200_Prod.webp': '11200-spideys-och-gobbys-raptorstrid-vid-tradkojan',
  '11200_boxprod_v29_sha.webp': '11200-spideys-och-gobbys-raptorstrid-vid-tradkojan',

  // Product: 11201-skoj-pa-lekplatsen-med-bluey-och-chloe
  '11201_Box1_v29.webp': '11201-skoj-pa-lekplatsen-med-bluey-och-chloe',
  '11201_Lifestyle_Cons_crop.webp': '11201-skoj-pa-lekplatsen-med-bluey-och-chloe',
  '11201_Lifestyle_Envr_crop.webp': '11201-skoj-pa-lekplatsen-med-bluey-och-chloe',
  '11201_Prod.webp': '11201-skoj-pa-lekplatsen-med-bluey-och-chloe',
  '11201_boxprod_v29_sha.webp': '11201-skoj-pa-lekplatsen-med-bluey-och-chloe',

  // Product: 11202-blueys-familjetur-till-stranden
  '11202_Box1_v29.webp': '11202-blueys-familjetur-till-stranden',
  '11202_Lifestyle_Cons_crop.webp': '11202-blueys-familjetur-till-stranden',
  '11202_Lifestyle_Envr_crop.webp': '11202-blueys-familjetur-till-stranden',
  '11202_Prod.webp': '11202-blueys-familjetur-till-stranden',
  '11202_boxprod_v29_sha.webp': '11202-blueys-familjetur-till-stranden',

  // Product: 11203-blueys-hus
  '11203_Box1_v29.webp': '11203-blueys-hus',
  '11203_Lifestyle_Cons_crop.webp': '11203-blueys-hus',
  '11203_Lifestyle_Envr_crop.webp': '11203-blueys-hus',
  '11203_Prod.webp': '11203-blueys-hus',
  '11203_boxprod_v29_sha.webp': '11203-blueys-hus',

  // Product: 11204-gabby-11204
  '11204_Box1_v29.webp': '11204-gabby-11204',
  '11204_Lifestyle_Cons_crop.webp': '11204-gabby-11204',
  '11204_Lifestyle_Envr_crop.webp': '11204-gabby-11204',
  '11204_Prod.webp': '11204-gabby-11204',
  '11204_boxprod_v29_sha.webp': '11204-gabby-11204',

  // Product: 11205-gabby-11205
  '11205_Box1_v29.webp': '11205-gabby-11205',
  '11205_Lifestyle_Cons_crop.webp': '11205-gabby-11205',
  '11205_Lifestyle_Envr_crop.webp': '11205-gabby-11205',
  '11205_Prod.webp': '11205-gabby-11205',
  '11205_boxprod_v29_sha.webp': '11205-gabby-11205',

  // Product: 21028-new-york-city
  '21028_box1_in.webp': '21028-new-york-city',
  '21028_prod.webp': '21028-new-york-city',

  // Product: 21034-london
  '21034_Box1_v29.webp': '21034-london',
  '21034_Prod.webp': '21034-london',

  // Product: 21042-frihetsgudinnan
  '21042_Box1_v29.webp': '21042-frihetsgudinnan',
  '21042_Prod.webp': '21042-frihetsgudinnan',

  // Product: 21044-paris
  '21044_Box1_v29.webp': '21044-paris',
  '21044_Prod.webp': '21044-paris',

  // Product: 21058-cheopspyramiden
  '21058_Box1_v29.webp': '21058-cheopspyramiden',
  '21058_Lifestyle_Cons_crop.webp': '21058-cheopspyramiden',
  '21058_Lifestyle_Envr_crop.webp': '21058-cheopspyramiden',
  '21058_Prod.webp': '21058-cheopspyramiden',
  '21058_boxprod_v29.webp': '21058-cheopspyramiden',

  // Product: 21060-himeji-slott
  '21060_Box1_v29.webp': '21060-himeji-slott',
  '21060_Lifestyle_Cons_crop.webp': '21060-himeji-slott',
  '21060_Lifestyle_Envr_crop.webp': '21060-himeji-slott',
  '21060_Prod.webp': '21060-himeji-slott',
  '21060_boxprod_v29.webp': '21060-himeji-slott',

  // Product: 21061-notre-dame-de-paris
  '21061_Box1_v29.webp': '21061-notre-dame-de-paris',
  '21061_Lifestyle_Cons_crop.webp': '21061-notre-dame-de-paris',
  '21061_Lifestyle_Envr_crop.webp': '21061-notre-dame-de-paris',
  '21061_Prod.webp': '21061-notre-dame-de-paris',
  '21061_boxprod_v29_sha.webp': '21061-notre-dame-de-paris',

  // Product: 21062-trevifontanen
  '21062_Box1_v29.webp': '21062-trevifontanen',
  '21062_Lifestyle_Cons_crop.webp': '21062-trevifontanen',
  '21062_Lifestyle_Envr_crop.webp': '21062-trevifontanen',
  '21062_Prod.webp': '21062-trevifontanen',
  '21062_boxprod_v29_sha.webp': '21062-trevifontanen',

  // Product: 21063-architecture-21063
  '21063_Box1_v29.webp': '21063-architecture-21063',
  '21063_Lifestyle_Cons_crop.webp': '21063-architecture-21063',
  '21063_Lifestyle_Envr_crop.webp': '21063-architecture-21063',
  '21063_Prod.webp': '21063-architecture-21063',
  '21063_boxprod_v29_sha.webp': '21063-architecture-21063',

  // Product: 21178-ravstugan
  '21178_Box1_v29.webp': '21178-ravstugan',
  '21178_Lifestyle_cons_crop.webp': '21178-ravstugan',
  '21178_Lifestyle_envr_crop.webp': '21178-ravstugan',
  '21178_Prod.webp': '21178-ravstugan',
  '21178_boxprod_v29.webp': '21178-ravstugan',

  // Product: 21251-steves-okenexpedition
  '21251_Box1_v29.webp': '21251-steves-okenexpedition',
  '21251_Lifestyle_Cons_crop.webp': '21251-steves-okenexpedition',
  '21251_Lifestyle_Envr_crop.webp': '21251-steves-okenexpedition',
  '21251_Prod.webp': '21251-steves-okenexpedition',
  '21251_boxprod_v29.webp': '21251-steves-okenexpedition',

  // Product: 21252-vapenforradet
  '21252_Box1_v29.webp': '21252-vapenforradet',
  '21252_Lifestyle_Cons_crop.webp': '21252-vapenforradet',
  '21252_Lifestyle_Envr_crop.webp': '21252-vapenforradet',
  '21252_Prod.webp': '21252-vapenforradet',
  '21252_boxprod_v29.webp': '21252-vapenforradet',

  // Product: 21254-skoldpaddshuset
  '21254_Box1_v29.webp': '21254-skoldpaddshuset',
  '21254_Lifestyle_Cons_crop.webp': '21254-skoldpaddshuset',
  '21254_Lifestyle_Envr_crop.webp': '21254-skoldpaddshuset',
  '21254_Prod.webp': '21254-skoldpaddshuset',
  '21254_boxprod_v29.webp': '21254-skoldpaddshuset',

  // Product: 21255-attack-vid-nether-portalen
  '21255_Box1_v29.webp': '21255-attack-vid-nether-portalen',
  '21255_Lifestyle_Cons_crop.webp': '21255-attack-vid-nether-portalen',
  '21255_Lifestyle_Envr_crop.webp': '21255-attack-vid-nether-portalen',
  '21255_Prod.webp': '21255-attack-vid-nether-portalen',
  '21255_boxprod_v29.webp': '21255-attack-vid-nether-portalen',

  // Product: 21256-grodhuset
  '21256_Box1_v29.webp': '21256-grodhuset',
  '21256_Lifestyle_Cons_crop.webp': '21256-grodhuset',
  '21256_Lifestyle_Envr_crop.webp': '21256-grodhuset',
  '21256_Prod.webp': '21256-grodhuset',
  '21256_boxprod_v29.webp': '21256-grodhuset',

  // Product: 21259-piratskeppsresan
  '21259_Box1_v29.webp': '21259-piratskeppsresan',
  '21259_Lifestyle_Cons_crop.webp': '21259-piratskeppsresan',
  '21259_Lifestyle_Envr_crop.webp': '21259-piratskeppsresan',
  '21259_Prod.webp': '21259-piratskeppsresan',
  '21259_boxprod_v29_sha.webp': '21259-piratskeppsresan',

  // Product: 21260-korsbarstradgarden
  '21260_Box1_v29.webp': '21260-korsbarstradgarden',
  '21260_Lifestyle_Cons_crop.webp': '21260-korsbarstradgarden',
  '21260_Lifestyle_Envr_crop.webp': '21260-korsbarstradgarden',
  '21260_Prod.webp': '21260-korsbarstradgarden',
  '21260_boxprod_v29_sha.webp': '21260-korsbarstradgarden',

  // Product: 21261-vargfastningen
  '21261_Box1_v29.webp': '21261-vargfastningen',
  '21261_Lifestyle_Cons_crop.webp': '21261-vargfastningen',
  '21261_Lifestyle_Envr_crop.webp': '21261-vargfastningen',
  '21261_Prod.webp': '21261-vargfastningen',
  '21261_boxprod_v29_sha.webp': '21261-vargfastningen',

  // Product: 21263-gruvschaktet-i-stenoknen
  '21263_Box1_v29.webp': '21263-gruvschaktet-i-stenoknen',
  '21263_Lifestyle_Cons_crop.webp': '21263-gruvschaktet-i-stenoknen',
  '21263_Lifestyle_Envr_crop.webp': '21263-gruvschaktet-i-stenoknen',
  '21263_Prod.webp': '21263-gruvschaktet-i-stenoknen',
  '21263_boxprod_v29_sha.webp': '21263-gruvschaktet-i-stenoknen',

  // Product: 21264-enderdraken-och-endskeppet
  '21264_Box1_v29.webp': '21264-enderdraken-och-endskeppet',
  '21264_Lifestyle_Cons_crop.webp': '21264-enderdraken-och-endskeppet',
  '21264_Lifestyle_Envr_crop.webp': '21264-enderdraken-och-endskeppet',
  '21264_Prod.webp': '21264-enderdraken-och-endskeppet',
  '21264_boxprod_v29_sha.webp': '21264-enderdraken-och-endskeppet',

  // Product: 21265-arbetsbank
  '21265_Box1_v29.webp': '21265-arbetsbank',
  '21265_Lifestyle_Envr_crop.webp': '21265-arbetsbank',
  '21265_Prod.webp': '21265-arbetsbank',
  '21265_boxprod_v29_sha.webp': '21265-arbetsbank',

  // Product: 21266-lavastriden-i-nether
  '21266_Box1_v29.webp': '21266-lavastriden-i-nether',
  '21266_Lifestyle_Cons_crop.webp': '21266-lavastriden-i-nether',
  '21266_Lifestyle_Envr_crop.webp': '21266-lavastriden-i-nether',
  '21266_Prod.webp': '21266-lavastriden-i-nether',
  '21266_boxprod_v29_sha.webp': '21266-lavastriden-i-nether',

  // Product: 21267-fybornas-okenpatrull
  '21267_Box1_v29.webp': '21267-fybornas-okenpatrull',
  '21267_Lifestyle_Cons_crop.webp': '21267-fybornas-okenpatrull',
  '21267_Lifestyle_Envr_crop.webp': '21267-fybornas-okenpatrull',
  '21267_Prod.webp': '21267-fybornas-okenpatrull',
  '21267_boxprod_v29_sha.webp': '21267-fybornas-okenpatrull',

  // Product: 21268-griskultingens-hus
  '21268_Box1_v29.webp': '21268-griskultingens-hus',
  '21268_Lifestyle_Cons_crop.webp': '21268-griskultingens-hus',
  '21268_Lifestyle_Envr_crop.webp': '21268-griskultingens-hus',
  '21268_Prod.webp': '21268-griskultingens-hus',
  '21268_boxprod_v29_sha.webp': '21268-griskultingens-hus',

  // Product: 21269-expeditionen-till-baltdjursgruvan
  '21269_Box1_v29.webp': '21269-expeditionen-till-baltdjursgruvan',
  '21269_Lifestyle_Cons_crop.webp': '21269-expeditionen-till-baltdjursgruvan',
  '21269_Lifestyle_Envr_crop.webp': '21269-expeditionen-till-baltdjursgruvan',
  '21269_Prod.webp': '21269-expeditionen-till-baltdjursgruvan',
  '21269_boxprod_v29_sha.webp': '21269-expeditionen-till-baltdjursgruvan',

  // Product: 21270-mooshroomhuset
  '21270_Box1_v29.webp': '21270-mooshroomhuset',
  '21270_Lifestyle_Cons_crop.webp': '21270-mooshroomhuset',
  '21270_Lifestyle_Envr_crop.webp': '21270-mooshroomhuset',
  '21270_Prod.webp': '21270-mooshroomhuset',
  '21270_boxprod_v29_sha.webp': '21270-mooshroomhuset',

  // Product: 21272-skogsherrgardens-stridsring
  '21272_Box1_v29.webp': '21272-skogsherrgardens-stridsring',
  '21272_Lifestyle_Cons_crop.webp': '21272-skogsherrgardens-stridsring',
  '21272_Lifestyle_Envr_crop.webp': '21272-skogsherrgardens-stridsring',
  '21272_Prod.webp': '21272-skogsherrgardens-stridsring',
  '21272_boxprod_v29_sha.webp': '21272-skogsherrgardens-stridsring',

  // Product: 21273-byanfall-med-gastballong
  '21273_Box1_v29.webp': '21273-byanfall-med-gastballong',
  '21273_Lifestyle_Cons_crop.webp': '21273-byanfall-med-gastballong',
  '21273_Lifestyle_Envr_crop.webp': '21273-byanfall-med-gastballong',
  '21273_Prod.webp': '21273-byanfall-med-gastballong',
  '21273_boxprod_v29_sha.webp': '21273-byanfall-med-gastballong',

  // Product: 21274-motet-med-vaktaren
  '21274_Box1_v29.webp': '21274-motet-med-vaktaren',
  '21274_Lifestyle_Cons_crop.webp': '21274-motet-med-vaktaren',
  '21274_Lifestyle_Envr_crop.webp': '21274-motet-med-vaktaren',
  '21274_Prod.webp': '21274-motet-med-vaktaren',
  '21274_boxprod_v29_sha.webp': '21274-motet-med-vaktaren',

  // Product: 21275-dynamithuset-i-djungeln
  '21275_Box1_v29.webp': '21275-dynamithuset-i-djungeln',
  '21275_Lifestyle_Cons_crop.webp': '21275-dynamithuset-i-djungeln',
  '21275_Lifestyle_Envr_crop.webp': '21275-dynamithuset-i-djungeln',
  '21275_Prod.webp': '21275-dynamithuset-i-djungeln',
  '21275_boxprod_v29_sha.webp': '21275-dynamithuset-i-djungeln',

  // Product: 21276-creeper™
  '21276_Box1_v29.webp': '21276-creeper™',
  '21276_Lifestyle_Cons_crop.webp': '21276-creeper™',
  '21276_Lifestyle_Envr_crop.webp': '21276-creeper™',
  '21276_Prod.webp': '21276-creeper™',
  '21276_boxprod_v29_sha.webp': '21276-creeper™',

  // Product: 21277-spetshackegruvan
  '21277_Box1_v29.webp': '21277-spetshackegruvan',
  '21277_Lifestyle_Cons_crop.webp': '21277-spetshackegruvan',
  '21277_Lifestyle_Envr_crop.webp': '21277-spetshackegruvan',
  '21277_Prod.webp': '21277-spetshackegruvan',
  '21277_boxprod_v29_sha.webp': '21277-spetshackegruvan',

  // Product: 21278-plundrarvakttorn-och-vildtjur
  '21278_Box1_v29.webp': '21278-plundrarvakttorn-och-vildtjur',
  '21278_Lifestyle_Cons_crop.webp': '21278-plundrarvakttorn-och-vildtjur',
  '21278_Lifestyle_Envr_crop.webp': '21278-plundrarvakttorn-och-vildtjur',
  '21278_Prod.webp': '21278-plundrarvakttorn-och-vildtjur',
  '21278_boxprod_v29_sha.webp': '21278-plundrarvakttorn-och-vildtjur',

  // Product: 21279-endermantornet
  '21279_Box1_v29.webp': '21279-endermantornet',
  '21279_Lifestyle_Cons_crop.webp': '21279-endermantornet',
  '21279_Lifestyle_Envr_crop.webp': '21279-endermantornet',
  '21279_Prod.webp': '21279-endermantornet',
  '21279_boxprod_v29_sha.webp': '21279-endermantornet',

  // Product: 21280-adventskalender-2025
  '21280_Box1_v29.webp': '21280-adventskalender-2025',
  '21280_Lifestyle_Cons_crop.webp': '21280-adventskalender-2025',
  '21280_Lifestyle_Envr_crop.webp': '21280-adventskalender-2025',
  '21280_Prod.webp': '21280-adventskalender-2025',
  '21280_boxprod_v29_sha.webp': '21280-adventskalender-2025',

  // Product: 21345-polaroid-onestep-sx-70-kamera
  '21345_Box1_v29.webp': '21345-polaroid-onestep-sx-70-kamera',
  '21345_Lifestyle_Cons_crop.webp': '21345-polaroid-onestep-sx-70-kamera',
  '21345_Lifestyle_Envr_crop.webp': '21345-polaroid-onestep-sx-70-kamera',
  '21345_Prod.webp': '21345-polaroid-onestep-sx-70-kamera',
  '21345_boxprod_v29.webp': '21345-polaroid-onestep-sx-70-kamera',

  // Product: 21357-disney-pixar-luxo-jr
  '21357_Box1_v29.webp': '21357-disney-pixar-luxo-jr',
  '21357_Lifestyle_Cons_crop.webp': '21357-disney-pixar-luxo-jr',
  '21357_Lifestyle_Envr_crop.webp': '21357-disney-pixar-luxo-jr',
  '21357_Prod.webp': '21357-disney-pixar-luxo-jr',
  '21357_boxprod_v29_sha.webp': '21357-disney-pixar-luxo-jr',

  // Product: 30660-zoeys-snabba-dromjetpack
  '30660_Box1_v29.webp': '30660-zoeys-snabba-dromjetpack',
  '30660_Prod.webp': '30660-zoeys-snabba-dromjetpack',

  // Product: 30665-mote-med-gorillaunge
  '30665_Box1_v29.webp': '30665-mote-med-gorillaunge',
  '30665_Prod.webp': '30665-mote-med-gorillaunge',

  // Product: 30670-tomtens-sladtur
  '30670_Box1_v29.webp': '30670-tomtens-sladtur',
  '30670_Prod.webp': '30670-tomtens-sladtur',

  // Product: 30672-steve-och-pandaunge
  '30672_Box1_v29.webp': '30672-steve-och-pandaunge',
  '30672_Prod.webp': '30672-steve-och-pandaunge',
  '30672_boxprod_v29.webp': '30672-steve-och-pandaunge',

  // Product: 30673-min-forsta-anka
  '30673_Box1_v110.webp': '30673-min-forsta-anka',
  '30673_Prod.webp': '30673-min-forsta-anka',

  // Product: 30675-turneringstraning
  '30675_Box1_v29.webp': '30675-turneringstraning',
  '30675_Prod.webp': '30675-turneringstraning',

  // Product: 30686-min-forsta-blomma-och-bi
  '30686_Box1_v29.webp': '30686-min-forsta-blomma-och-bi',
  '30686_Prod.webp': '30686-min-forsta-blomma-och-bi',

  // Product: 30687-blueys-tebjudning
  '30687_Box1_V29.webp': '30687-blueys-tebjudning',
  '30687_Prod.webp': '30687-blueys-tebjudning',

  // Product: 30689-kalasdjur
  '30689_Box1_v29.webp': '30689-kalasdjur',
  '30689_Prod.webp': '30689-kalasdjur',

  // Product: 30690-rolig-paskaggsmalning-med-kyckling
  '30690_Box1_v29.webp': '30690-rolig-paskaggsmalning-med-kyckling',
  '30690_Prod.webp': '30690-rolig-paskaggsmalning-med-kyckling',

  // Product: 30691-andringsbar-minimonstertruck
  '30691_Box1_v29.webp': '30691-andringsbar-minimonstertruck',
  '30691_Prod.webp': '30691-andringsbar-minimonstertruck',

  // Product: 30692-skorstensskoj-med-jultomten
  '30692_Box1_v29.webp': '30692-skorstensskoj-med-jultomten',
  '30692_Prod.webp': '30692-skorstensskoj-med-jultomten',

  // Product: 30693-polisvattenskoter
  '30693_Box1_v29.webp': '30693-polisvattenskoter',
  '30693_Prod.webp': '30693-polisvattenskoter',

  // Product: 30695-askungens-minitradgardsslott
  '30695_Box1_v29.webp': '30695-askungens-minitradgardsslott',
  '30695_Prod.webp': '30695-askungens-minitradgardsslott',

  // Product: 30696-autumns-vaffelkiosk
  '30696_Box1_v29.webp': '30696-autumns-vaffelkiosk',
  '30696_Prod.webp': '30696-autumns-vaffelkiosk',

  // Product: 30698-coopers-flygande-spelkontroll-minibygge
  '30698_Box1_v29.webp': '30698-coopers-flygande-spelkontroll-minibygge',
  '30698_Prod.webp': '30698-coopers-flygande-spelkontroll-minibygge',

  // Product: 30699-liten-ninjakomborobot
  '30699_Box1_v29.webp': '30699-liten-ninjakomborobot',
  '30699_Prod.webp': '30699-liten-ninjakomborobot',

  // Product: 30700-arins-strid-mot-dragonier
  '30700_Box1_v29.webp': '30700-arins-strid-mot-dragonier',
  '30700_Prod.webp': '30700-arins-strid-mot-dragonier',

  // Product: 30701-angsblommor
  '30701_Box1_v29.webp': '30701-angsblommor',
  '30701_Prod.webp': '30701-angsblommor',

  // Product: 30703-strandmalning-med-julian
  '30703_Box1_v29.webp': '30703-strandmalning-med-julian',
  '30703_Prod.webp': '30703-strandmalning-med-julian',

  // Product: 30704-balkiryattack
  '30704_Box1_v29.webp': '30704-balkiryattack',
  '30704_Prod.webp': '30704-balkiryattack',

  // Product: 30705-striden-i-den-frodiga-grottan
  '30705_Box1_v29.webp': '30705-striden-i-den-frodiga-grottan',
  '30705_Prod.webp': '30705-striden-i-den-frodiga-grottan',

  // Product: 30706-quidditchlektion
  '30706_Box1_v29.webp': '30706-quidditchlektion',
  '30706_Prod.webp': '30706-quidditchlektion',

  // Product: 30707-venoms-ran-pa-museet
  '30707_Box1_v29.webp': '30707-venoms-ran-pa-museet',
  '30707_Prod.webp': '30707-venoms-ran-pa-museet',

  // Product: 30708-millennium-falcon™-mini-build
  '30708_Box1_v29.webp': '30708-millennium-falcon™-mini-build',
  '30708_Prod.webp': '30708-millennium-falcon™-mini-build',

  // Product: 30709-ferrari-499p-hyperbil
  '30709_Box1_v29.webp': '30709-ferrari-499p-hyperbil',
  '30709_Front_Prod.webp': '30709-ferrari-499p-hyperbil',

  // Product: 30710-kompaktlastare
  '30710_Box1_v29.webp': '30710-kompaktlastare',
  '30710_Prod.webp': '30710-kompaktlastare',

  // Product: 31058-maktiga-dinosaurier
  '31058_Box1_v29.webp': '31058-maktiga-dinosaurier',
  '31058_Prod.webp': '31058-maktiga-dinosaurier',

  // Product: 31109-piratskepp
  '31109_Box1_v29.webp': '31109-piratskepp',
  '31109_Lifestyle_cons_crop.webp': '31109-piratskepp',
  '31109_Lifestyle_envr_2_crop.webp': '31109-piratskepp',
  '31109_Prod_Alt_01.webp': '31109-piratskepp',

  // Product: 31129-majestatisk-tiger
  '31129_Box1_v29.webp': '31129-majestatisk-tiger',
  '31129_Lifestyle_cons_crop.webp': '31129-majestatisk-tiger',
  '31129_Lifestyle_envr_A_crop.webp': '31129-majestatisk-tiger',
  '31129_Prod.webp': '31129-majestatisk-tiger',
  '31129_boxprod_v29.webp': '31129-majestatisk-tiger',

  // Product: 31134-rymdfarja
  '31134_Box1_v29.webp': '31134-rymdfarja',
  '31134_Lifestyle_Cons_crop.webp': '31134-rymdfarja',
  '31134_Lifestyle_Envr_crop.webp': '31134-rymdfarja',
  '31134_Prod.webp': '31134-rymdfarja',
  '31134_boxprod_v29.webp': '31134-rymdfarja',

  // Product: 31136-exotisk-papegoja
  '31136_Box1_v29.webp': '31136-exotisk-papegoja',
  '31136_Lifestyle_Cons_crop.webp': '31136-exotisk-papegoja',
  '31136_Lifestyle_Envr_crop.webp': '31136-exotisk-papegoja',
  '31136_Prod.webp': '31136-exotisk-papegoja',
  '31136_boxprod_v29.webp': '31136-exotisk-papegoja',

  // Product: 31137-gulliga-hundar
  '31137_Box1_v29.webp': '31137-gulliga-hundar',
  '31137_Lifestyle_Cons_crop.webp': '31137-gulliga-hundar',
  '31137_Lifestyle_Envr_B_crop.webp': '31137-gulliga-hundar',
  '31137_Prod.webp': '31137-gulliga-hundar',
  '31137_boxprod_v29.webp': '31137-gulliga-hundar',

  // Product: 31140-magisk-enhorning
  '31140_Box1_v29.webp': '31140-magisk-enhorning',
  '31140_Lifestyle_Cons_crop.webp': '31140-magisk-enhorning',
  '31140_Lifestyle_Envr_A_crop.webp': '31140-magisk-enhorning',
  '31140_Prod.webp': '31140-magisk-enhorning',
  '31140_boxprod_v29.webp': '31140-magisk-enhorning',

  // Product: 31142-bergochdalbana-med-rymdtema
  '31142_Box1_v29.webp': '31142-bergochdalbana-med-rymdtema',
  '31142_Lifestyle_Cons_crop.webp': '31142-bergochdalbana-med-rymdtema',
  '31142_Lifestyle_Envr_crop.webp': '31142-bergochdalbana-med-rymdtema',
  '31142_Prod.webp': '31142-bergochdalbana-med-rymdtema',
  '31142_boxprod_v29.webp': '31142-bergochdalbana-med-rymdtema',

  // Product: 31145-rod-drake
  '31145_Box1_v29.webp': '31145-rod-drake',
  '31145_Lifestyle_Cons_crop.webp': '31145-rod-drake',
  '31145_Lifestyle_Envr_crop.webp': '31145-rod-drake',
  '31145_Prod.webp': '31145-rod-drake',
  '31145_boxprod_v29.webp': '31145-rod-drake',

  // Product: 31146-flakbil-med-helikopter
  '31146_Box1_v29.webp': '31146-flakbil-med-helikopter',
  '31146_Lifestyle_Cons_crop.webp': '31146-flakbil-med-helikopter',
  '31146_Lifestyle_Envr_crop.webp': '31146-flakbil-med-helikopter',
  '31146_Prod.webp': '31146-flakbil-med-helikopter',
  '31146_boxprod_v29.webp': '31146-flakbil-med-helikopter',

  // Product: 31147-retrokamera
  '31147_Box1_v29.webp': '31147-retrokamera',
  '31147_Lifestyle_Cons_crop.webp': '31147-retrokamera',
  '31147_Lifestyle_Envr_crop.webp': '31147-retrokamera',
  '31147_Prod.webp': '31147-retrokamera',
  '31147_boxprod_v29.webp': '31147-retrokamera',

  // Product: 31148-retrorullskridsko
  '31148_Box1_v29.webp': '31148-retrorullskridsko',
  '31148_Lifestyle_Cons_crop.webp': '31148-retrorullskridsko',
  '31148_Lifestyle_Envr_crop.webp': '31148-retrorullskridsko',
  '31148_Prod.webp': '31148-retrorullskridsko',
  '31148_boxprod_v29.webp': '31148-retrorullskridsko',

  // Product: 31149-blommor-i-vattenkanna
  '31149_Box1_v29.webp': '31149-blommor-i-vattenkanna',
  '31149_Lifestyle_Cons_crop.webp': '31149-blommor-i-vattenkanna',
  '31149_Lifestyle_Envr_crop.webp': '31149-blommor-i-vattenkanna',
  '31149_Prod.webp': '31149-blommor-i-vattenkanna',
  '31149_boxprod_v29.webp': '31149-blommor-i-vattenkanna',

  // Product: 31150-vilda-safaridjur
  '31150_Box1_v29.webp': '31150-vilda-safaridjur',
  '31150_Lifestyle_Cons_crop.webp': '31150-vilda-safaridjur',
  '31150_Lifestyle_Envr_crop.webp': '31150-vilda-safaridjur',
  '31150_Prod.webp': '31150-vilda-safaridjur',
  '31150_boxprod_v29.webp': '31150-vilda-safaridjur',

  // Product: 31151-t-rex
  '31151_Box1_v29.webp': '31151-t-rex',
  '31151_Lifestyle_Cons_crop.webp': '31151-t-rex',
  '31151_Lifestyle_Envr_crop.webp': '31151-t-rex',
  '31151_Prod.webp': '31151-t-rex',
  '31151_boxprod_v29_sha.webp': '31151-t-rex',

  // Product: 31152-rymdastronaut
  '31152_Box1_v29.webp': '31152-rymdastronaut',
  '31152_Lifestyle_Cons_crop.webp': '31152-rymdastronaut',
  '31152_Lifestyle_Envr_crop.webp': '31152-rymdastronaut',
  '31152_Prod.webp': '31152-rymdastronaut',
  '31152_boxprod_v29.webp': '31152-rymdastronaut',

  // Product: 31153-modernt-hus
  '31153_Box1_v29.webp': '31153-modernt-hus',
  '31153_Lifestyle_Cons_crop.webp': '31153-modernt-hus',
  '31153_Lifestyle_Envr_crop.webp': '31153-modernt-hus',
  '31153_Prod.webp': '31153-modernt-hus',
  '31153_boxprod_v29_sha.webp': '31153-modernt-hus',

  // Product: 31159-vilda-djur-overraskande-spindel
  '31159_Box1_v29.webp': '31159-vilda-djur-overraskande-spindel',
  '31159_Lifestyle_Cons_crop.webp': '31159-vilda-djur-overraskande-spindel',
  '31159_Lifestyle_Envr_crop.webp': '31159-vilda-djur-overraskande-spindel',
  '31159_Prod.webp': '31159-vilda-djur-overraskande-spindel',
  '31159_boxprod_v29_sha.webp': '31159-vilda-djur-overraskande-spindel',

  // Product: 31160-flygplan-racerplan
  '31160_Box1_v29.webp': '31160-flygplan-racerplan',
  '31160_Lifestyle_Cons_crop.webp': '31160-flygplan-racerplan',
  '31160_Lifestyle_Envr_crop.webp': '31160-flygplan-racerplan',
  '31160_Prod.webp': '31160-flygplan-racerplan',
  '31160_boxprod_v29_sha.webp': '31160-flygplan-racerplan',

  // Product: 31161-medeltida-drake
  '31161_Box1_v29.webp': '31161-medeltida-drake',
  '31161_Lifestyle_cons_crop.webp': '31161-medeltida-drake',
  '31161_Lifestyle_envr_crop.webp': '31161-medeltida-drake',
  '31161_Prod.webp': '31161-medeltida-drake',
  '31161_boxprod_v29_sha.webp': '31161-medeltida-drake',

  // Product: 31162-sot-kanin
  '31162_Box1_v29.webp': '31162-sot-kanin',
  '31162_Lifestyle_Cons_crop.webp': '31162-sot-kanin',
  '31162_Lifestyle_Envr_crop.webp': '31162-sot-kanin',
  '31162_Prod.webp': '31162-sot-kanin',
  '31162_boxprod_v29_sha.webp': '31162-sot-kanin',

  // Product: 31163-lekfull-katt
  '31163_Box1_v29.webp': '31163-lekfull-katt',
  '31163_Lifestyle_cons_crop.webp': '31163-lekfull-katt',
  '31163_Lifestyle_envr_crop.webp': '31163-lekfull-katt',
  '31163_Prod.webp': '31163-lekfull-katt',
  '31163_boxprod_v29_sha.webp': '31163-lekfull-katt',

  // Product: 31164-rymdrobot
  '31164_Box1_v29.webp': '31164-rymdrobot',
  '31164_Lifestyle_cons_crop.webp': '31164-rymdrobot',
  '31164_Lifestyle_envr_crop.webp': '31164-rymdrobot',
  '31164_Prod.webp': '31164-rymdrobot',
  '31164_boxprod_v29_sha.webp': '31164-rymdrobot',

  // Product: 31165-vilda-djur-pandafamilj
  '31165_Box1_v29.webp': '31165-vilda-djur-pandafamilj',
  '31165_Lifestyle_Cons_crop.webp': '31165-vilda-djur-pandafamilj',
  '31165_Lifestyle_Envr_crop.webp': '31165-vilda-djur-pandafamilj',
  '31165_Prod.webp': '31165-vilda-djur-pandafamilj',
  '31165_boxprod_v29_sha.webp': '31165-vilda-djur-pandafamilj',

  // Product: 31166-vacker-hast
  '31166_Box1_v29.webp': '31166-vacker-hast',
  '31166_Lifestyle_Cons_crop.webp': '31166-vacker-hast',
  '31166_Lifestyle_Envr_crop.webp': '31166-vacker-hast',
  '31166_Prod.webp': '31166-vacker-hast',
  '31166_boxprod_v29_sha.webp': '31166-vacker-hast',

  // Product: 31167-hemsokt-herrgard
  '31167_Box1_v29.webp': '31167-hemsokt-herrgard',
  '31167_Lifestyle_Cons_crop.webp': '31167-hemsokt-herrgard',
  '31167_Lifestyle_Envr_crop.webp': '31167-hemsokt-herrgard',
  '31167_Prod.webp': '31167-hemsokt-herrgard',
  '31167_boxprod_v29_sha.webp': '31167-hemsokt-herrgard',

  // Product: 31168-hastriddarnas-medeltida-slott
  '31168_Box1_v29.webp': '31168-hastriddarnas-medeltida-slott',
  '31168_Lifestyle_Cons_crop.webp': '31168-hastriddarnas-medeltida-slott',
  '31168_Lifestyle_Envr_crop.webp': '31168-hastriddarnas-medeltida-slott',
  '31168_Prod.webp': '31168-hastriddarnas-medeltida-slott',
  '31168_boxprod_v29_sha.webp': '31168-hastriddarnas-medeltida-slott',

  // Product: 31169-skrivmaskin-med-blommor
  '31169_Box1_v29.webp': '31169-skrivmaskin-med-blommor',
  '31169_Lifestyle_Cons_crop.webp': '31169-skrivmaskin-med-blommor',
  '31169_Lifestyle_Envr_crop.webp': '31169-skrivmaskin-med-blommor',
  '31169_Prod.webp': '31169-skrivmaskin-med-blommor',
  '31169_boxprod_v29_sha.webp': '31169-skrivmaskin-med-blommor',

  // Product: 31170-vilda-djur-rosa-flamingo
  '31170_Box1_v29.webp': '31170-vilda-djur-rosa-flamingo',
  '31170_Lifestyle_Cons_crop.webp': '31170-vilda-djur-rosa-flamingo',
  '31170_Lifestyle_Envr_crop.webp': '31170-vilda-djur-rosa-flamingo',
  '31170_Prod.webp': '31170-vilda-djur-rosa-flamingo',
  '31170_boxprod_v29_sha.webp': '31170-vilda-djur-rosa-flamingo',

  // Product: 31173-vilda-djur-tropisk-tukan
  '31173_Box1_v29.webp': '31173-vilda-djur-tropisk-tukan',
  '31173_Lifestyle_Cons_crop.webp': '31173-vilda-djur-tropisk-tukan',
  '31173_Lifestyle_Envr_crop.webp': '31173-vilda-djur-tropisk-tukan',
  '31173_Prod.webp': '31173-vilda-djur-tropisk-tukan',
  '31173_boxprod_v29_sha.webp': '31173-vilda-djur-tropisk-tukan',

  // Product: 31174-retrotelefon
  '31174_Box1_v29.webp': '31174-retrotelefon',
  '31174_Lifestyle_Cons_crop.webp': '31174-retrotelefon',
  '31174_Lifestyle_Envr_crop.webp': '31174-retrotelefon',
  '31174_Prod.webp': '31174-retrotelefon',
  '31174_boxprod_v29_sha.webp': '31174-retrotelefon',

  // Product: 31208-hokusai-under-vagen-utanfor-kanagawa
  '31208_Lifestyle_Cons_crop.webp': '31208-hokusai-under-vagen-utanfor-kanagawa',
  '31208_Lifestyle_Envr_crop.webp': '31208-hokusai-under-vagen-utanfor-kanagawa',
  '31208_Prod.webp': '31208-hokusai-under-vagen-utanfor-kanagawa',
  '31208_box1_v29.webp': '31208-hokusai-under-vagen-utanfor-kanagawa',
  '31208_boxprod_v29.webp': '31208-hokusai-under-vagen-utanfor-kanagawa',

  // Product: 31212-vintergatans-galax
  '31212_Box1_v29.webp': '31212-vintergatans-galax',
  '31212_Lifestyle_Cons_crop.webp': '31212-vintergatans-galax',
  '31212_Lifestyle_Envr_crop.webp': '31212-vintergatans-galax',
  '31212_Prod.webp': '31212-vintergatans-galax',
  '31212_boxprod_v29.webp': '31212-vintergatans-galax',

  // Product: 31213-mona-lisa
  '31213_Box1_v29.webp': '31213-mona-lisa',
  '31213_Lifestyle_Cons_crop.webp': '31213-mona-lisa',
  '31213_Lifestyle_Envr_crop.webp': '31213-mona-lisa',
  '31213_Prod.webp': '31213-mona-lisa',
  '31213_boxprod_v29_sha.webp': '31213-mona-lisa',

  // Product: 31214-love
  '31214_Box1_v29.webp': '31214-love',
  '31214_Lifestyle_Cons_crop.webp': '31214-love',
  '31214_Lifestyle_Envr_crop.webp': '31214-love',
  '31214_Prod.webp': '31214-love',
  '31214_boxprod_v29_sha.webp': '31214-love',

  // Product: 31215-vincent-van-gogh-solrosor
  '31215_Box1_v29.webp': '31215-vincent-van-gogh-solrosor',
  '31215_Lifestyle_Cons_crop.webp': '31215-vincent-van-gogh-solrosor',
  '31215_Lifestyle_Envr_crop.webp': '31215-vincent-van-gogh-solrosor',
  '31215_Prod.webp': '31215-vincent-van-gogh-solrosor',
  '31215_boxprod_v29_sha.webp': '31215-vincent-van-gogh-solrosor',

  // Product: 31216-keith-haring-dansande-figurer
  '31216_Box1_v29.webp': '31216-keith-haring-dansande-figurer',
  '31216_Lifestyle_Cons_crop.webp': '31216-keith-haring-dansande-figurer',
  '31216_Lifestyle_Envr_crop.webp': '31216-keith-haring-dansande-figurer',
  '31216_Prod.webp': '31216-keith-haring-dansande-figurer',
  '31216_boxprod_v29_sha.webp': '31216-keith-haring-dansande-figurer',

  // Product: 31217-faunasamlingen-tiger
  '31217_Box1_v29.webp': '31217-faunasamlingen-tiger',
  '31217_Lifestyle_Cons_crop.webp': '31217-faunasamlingen-tiger',
  '31217_Lifestyle_Envr_crop.webp': '31217-faunasamlingen-tiger',
  '31217_Prod.webp': '31217-faunasamlingen-tiger',
  '31217_boxprod_v29_sha.webp': '31217-faunasamlingen-tiger',

  // Product: 40460-rosor
  '40460_Box1_v110.webp': '40460-rosor',
  '40460_Prod.webp': '40460-rosor',

  // Product: 40499-tomtens-slade
  '40499_Box1_v29.webp': '40499-tomtens-slade',
  '40499_Prod.webp': '40499-tomtens-slade',
  '40499_boxprod_v29_sha.webp': '40499-tomtens-slade',

  // Product: 40524-solrosor
  '40524_Box1_v29.webp': '40524-solrosor',
  '40524_Prod.webp': '40524-solrosor',

  // Product: 40573-julgran
  '40573_Box1_V29.webp': '40573-julgran',
  '40573_Prod.webp': '40573-julgran',
  '40573_boxprod_v29_sha.webp': '40573-julgran',

  // Product: 40638-hjartdekoration
  '40638_Box1_v29.webp': '40638-hjartdekoration',
  '40638_Prod.webp': '40638-hjartdekoration',
  '40638_boxprod_v29_sha.webp': '40638-hjartdekoration',

  // Product: 40647-lotusblommor
  '40647_Box1_v29.webp': '40647-lotusblommor',
  '40647_Prod.webp': '40647-lotusblommor',

  // Product: 40648-paradistrad
  '40648_Box1_v29.webp': '40648-paradistrad',
  '40648_Lifestyle_envr_crop.webp': '40648-paradistrad',
  '40648_Prod.webp': '40648-paradistrad',
  '40648_boxprod_v29_sha.webp': '40648-paradistrad',

  // Product: 40678-festivalkalender
  '40678_Box1_v110.webp': '40678-festivalkalender',
  '40678_Prod.webp': '40678-festivalkalender',
  '40678_boxprod_v110_sha.webp': '40678-festivalkalender',

  // Product: 40709-varlig-djurlekplats
  '40709_Box1_v29.webp': '40709-varlig-djurlekplats',
  '40709_Lifestyle_envr_crop.webp': '40709-varlig-djurlekplats',
  '40709_Prod.webp': '40709-varlig-djurlekplats',
  '40709_boxprod_v29_sha.webp': '40709-varlig-djurlekplats',

  // Product: 40711-igelkottarnas-picknickdejt
  '40711_Box1_v29.webp': '40711-igelkottarnas-picknickdejt',
  '40711_Lifestyle_envr_crop.webp': '40711-igelkottarnas-picknickdejt',
  '40711_Prod.webp': '40711-igelkottarnas-picknickdejt',
  '40711_boxprod_v29_sha.webp': '40711-igelkottarnas-picknickdejt',

  // Product: 40721-halloweenlada
  '40721_Box1_v29.webp': '40721-halloweenlada',
  '40721_Prod.webp': '40721-halloweenlada',
  '40721_boxprod_v29_sha.webp': '40721-halloweenlada',

  // Product: 40725-korsbarsblommor
  '40725_Box1_v29.webp': '40725-korsbarsblommor',
  '40725_Lifestyle_Envr_crop.webp': '40725-korsbarsblommor',
  '40725_Prod.webp': '40725-korsbarsblommor',
  '40725_boxprod_v29.webp': '40725-korsbarsblommor',

  // Product: 40743-julig-bordsdekoration
  '40743_Box1_v29.webp': '40743-julig-bordsdekoration',
  '40743_Prod.webp': '40743-julig-bordsdekoration',
  '40743_boxprod_v29_sha.webp': '40743-julig-bordsdekoration',

  // Product: 40744-blandat-julpynt
  '40744_Box1_v29.webp': '40744-blandat-julpynt',
  '40744_Prod.webp': '40744-blandat-julpynt',
  '40744_boxprod_v29_sha.webp': '40744-blandat-julpynt',

  // Product: 40746-jultomtens-budbil
  '40746_Box1_v29.webp': '40746-jultomtens-budbil',
  '40746_Prod.webp': '40746-jultomtens-budbil',
  '40746_boxprod_v29_sha.webp': '40746-jultomtens-budbil',

  // Product: 40747-paskliljor
  '40747_Box1_v29.webp': '40747-paskliljor',
  '40747_Lifestyle_Envr_crop.webp': '40747-paskliljor',
  '40747_Prod.webp': '40747-paskliljor',
  '40747_boxprod_v29.webp': '40747-paskliljor',

  // Product: 41748-heartlake-citys-aktivitetshus
  '41748_Box1_v29.webp': '41748-heartlake-citys-aktivitetshus',
  '41748_Lifestyle_Cons_crop.webp': '41748-heartlake-citys-aktivitetshus',
  '41748_Lifestyle_Envr_crop.webp': '41748-heartlake-citys-aktivitetshus',
  '41748_Prod.webp': '41748-heartlake-citys-aktivitetshus',
  '41748_boxprod_v29.webp': '41748-heartlake-citys-aktivitetshus',

  // Product: 41838-reseminnen
  '41838_Box1_v29.webp': '41838-reseminnen',
  '41838_Lifestyle_Cons_crop.webp': '41838-reseminnen',
  '41838_Lifestyle_Envr_crop.webp': '41838-reseminnen',
  '41838_Prod.webp': '41838-reseminnen',
  '41838_boxprod_v29_sha.webp': '41838-reseminnen',

  // Product: 42115-lamborghini-sian-fkp-37
  '42115_Box1_v29.webp': '42115-lamborghini-sian-fkp-37',
  '42115_Prod.webp': '42115-lamborghini-sian-fkp-37',
  '42115_RL_25_crop.webp': '42115-lamborghini-sian-fkp-37',

  // Product: 42130-bmw-m-1000-rr
  '42130_Box1_v29.webp': '42130-bmw-m-1000-rr',
  '42130_Lifestyle_cons_crop.webp': '42130-bmw-m-1000-rr',
  '42130_Lifestyle_envr_crop.webp': '42130-bmw-m-1000-rr',
  '42130_Prod.webp': '42130-bmw-m-1000-rr',
  '42130_boxprod_v29.webp': '42130-bmw-m-1000-rr',

  // Product: 42141-mclaren-formula-1™-racerbil
  '42141_Box1_v29.webp': '42141-mclaren-formula-1™-racerbil',
  '42141_Lifestyle_Cons_crop.webp': '42141-mclaren-formula-1™-racerbil',
  '42141_Lifestyle_Envr_crop.webp': '42141-mclaren-formula-1™-racerbil',
  '42141_Prod.webp': '42141-mclaren-formula-1™-racerbil',
  '42141_boxprod_v29.webp': '42141-mclaren-formula-1™-racerbil',

  // Product: 42143-ferrari-daytona-sp3
  '42143_Box1_V29.webp': '42143-ferrari-daytona-sp3',
  '42143_Lifestyle_Cons_crop.webp': '42143-ferrari-daytona-sp3',
  '42143_Lifestyle_Envr_crop.webp': '42143-ferrari-daytona-sp3',
  '42143_Prod.webp': '42143-ferrari-daytona-sp3',
  '42143_boxprod_v29.webp': '42143-ferrari-daytona-sp3',

  // Product: 42146-liebherr-bandkran-lr-13000
  '42146_Box1_v29.webp': '42146-liebherr-bandkran-lr-13000',
  '42146_Lifestyle_Cons_crop.webp': '42146-liebherr-bandkran-lr-13000',
  '42146_Lifestyle_Envr_crop.webp': '42146-liebherr-bandkran-lr-13000',
  '42146_Prod.webp': '42146-liebherr-bandkran-lr-13000',
  '42146_boxprod_v29.webp': '42146-liebherr-bandkran-lr-13000',

  // Product: 42151-bugatti-bolide
  '42151_Box1_v29.webp': '42151-bugatti-bolide',
  '42151_Lifestyle_Cons_crop.webp': '42151-bugatti-bolide',
  '42151_Lifestyle_Envr_crop.webp': '42151-bugatti-bolide',
  '42151_Prod.webp': '42151-bugatti-bolide',
  '42151_boxprod_v29.webp': '42151-bugatti-bolide',

  // Product: 42154-2022-ford-gt
  '42154_Box1_v29.webp': '42154-2022-ford-gt',
  '42154_Lifestyle_Cons_crop.webp': '42154-2022-ford-gt',
  '42154_Lifestyle_Envr_crop.webp': '42154-2022-ford-gt',
  '42154_Prod.webp': '42154-2022-ford-gt',
  '42154_boxprod_v29.webp': '42154-2022-ford-gt',

  // Product: 42156-peugeot-9x8-24h-le-mans-hybrid-hypercar
  '42156_Box1_V29.webp': '42156-peugeot-9x8-24h-le-mans-hybrid-hypercar',
  '42156_Lifestyle_Cons_crop.webp': '42156-peugeot-9x8-24h-le-mans-hybrid-hypercar',
  '42156_Lifestyle_Envr_crop.webp': '42156-peugeot-9x8-24h-le-mans-hybrid-hypercar',
  '42156_Prod.webp': '42156-peugeot-9x8-24h-le-mans-hybrid-hypercar',
  '42156_boxprod_v29.webp': '42156-peugeot-9x8-24h-le-mans-hybrid-hypercar',

  // Product: 42158-nasa-mars-rover-perseverance
  '42158_Box1_v29.webp': '42158-nasa-mars-rover-perseverance',
  '42158_Lifestyle_Cons_crop.webp': '42158-nasa-mars-rover-perseverance',
  '42158_Lifestyle_Envr_crop.webp': '42158-nasa-mars-rover-perseverance',
  '42158_Prod.webp': '42158-nasa-mars-rover-perseverance',
  '42158_boxprod_v29.webp': '42158-nasa-mars-rover-perseverance',

  // Product: 42160-audi-rs-q-e-tron
  '42160_Box1_v29.webp': '42160-audi-rs-q-e-tron',
  '42160_Lifestyle_Cons_crop.webp': '42160-audi-rs-q-e-tron',
  '42160_Lifestyle_Envr_crop.webp': '42160-audi-rs-q-e-tron',
  '42160_Prod.webp': '42160-audi-rs-q-e-tron',
  '42160_boxprod_v29.webp': '42160-audi-rs-q-e-tron',

  // Product: 42161-lamborghini-huracan-tecnica
  '42161_Box1_v29.webp': '42161-lamborghini-huracan-tecnica',
  '42161_Lifestyle_Cons_crop.webp': '42161-lamborghini-huracan-tecnica',
  '42161_Lifestyle_Envr_crop.webp': '42161-lamborghini-huracan-tecnica',
  '42161_Prod.webp': '42161-lamborghini-huracan-tecnica',
  '42161_boxprod_v29.webp': '42161-lamborghini-huracan-tecnica',

  // Product: 42163-tung-bulldozer
  '42163_Box1_v29.webp': '42163-tung-bulldozer',
  '42163_Lifestyle_Cons_crop.webp': '42163-tung-bulldozer',
  '42163_Lifestyle_Envr_crop.webp': '42163-tung-bulldozer',
  '42163_Prod.webp': '42163-tung-bulldozer',
  '42163_boxprod_v29.webp': '42163-tung-bulldozer',

  // Product: 42164-terrangracerbuggy
  '42164_Box1_v29.webp': '42164-terrangracerbuggy',
  '42164_Lifestyle_Cons_crop.webp': '42164-terrangracerbuggy',
  '42164_Lifestyle_Envr_crop.webp': '42164-terrangracerbuggy',
  '42164_Prod.webp': '42164-terrangracerbuggy',
  '42164_boxprod_v29.webp': '42164-terrangracerbuggy',

  // Product: 42165-mercedes-amg-f1-w14-e-performance-pull-back
  '42165_Box1_v29.webp': '42165-mercedes-amg-f1-w14-e-performance-pull-back',
  '42165_Lifestyle_Cons_crop.webp': '42165-mercedes-amg-f1-w14-e-performance-pull-back',
  '42165_Lifestyle_Envr_crop.webp': '42165-mercedes-amg-f1-w14-e-performance-pull-back',
  '42165_Prod.webp': '42165-mercedes-amg-f1-w14-e-performance-pull-back',
  '42165_boxprod_v29.webp': '42165-mercedes-amg-f1-w14-e-performance-pull-back',

  // Product: 42166-neom-mclaren-extreme-e-racerbil
  '42166_Box1_v29.webp': '42166-neom-mclaren-extreme-e-racerbil',
  '42166_Lifestyle_Cons_crop.webp': '42166-neom-mclaren-extreme-e-racerbil',
  '42166_Lifestyle_Envr_crop.webp': '42166-neom-mclaren-extreme-e-racerbil',
  '42166_Prod.webp': '42166-neom-mclaren-extreme-e-racerbil',
  '42166_boxprod_v29.webp': '42166-neom-mclaren-extreme-e-racerbil',

  // Product: 42167-mack®-lr-electric-sopbil
  '42167_Box1_v29.webp': '42167-mack®-lr-electric-sopbil',
  '42167_Lifestyle_Cons_crop.webp': '42167-mack®-lr-electric-sopbil',
  '42167_Lifestyle_Envr_crop.webp': '42167-mack®-lr-electric-sopbil',
  '42167_Prod.webp': '42167-mack®-lr-electric-sopbil',
  '42167_boxprod_v29.webp': '42167-mack®-lr-electric-sopbil',

  // Product: 42168-john-deere-9700-forage-harvester
  '42168_Box1_v29.webp': '42168-john-deere-9700-forage-harvester',
  '42168_Lifestyle_Cons_crop.webp': '42168-john-deere-9700-forage-harvester',
  '42168_Lifestyle_Envr_crop.webp': '42168-john-deere-9700-forage-harvester',
  '42168_Prod.webp': '42168-john-deere-9700-forage-harvester',
  '42168_boxprod_v29.webp': '42168-john-deere-9700-forage-harvester',

  // Product: 42169-neom-mclaren-formula-e-racerbil
  '42169_Box1_v29.webp': '42169-neom-mclaren-formula-e-racerbil',
  '42169_Lifestyle_Cons_crop.webp': '42169-neom-mclaren-formula-e-racerbil',
  '42169_Lifestyle_Envr_crop.webp': '42169-neom-mclaren-formula-e-racerbil',
  '42169_Prod.webp': '42169-neom-mclaren-formula-e-racerbil',
  '42169_boxprod_v29.webp': '42169-neom-mclaren-formula-e-racerbil',

  // Product: 42170-kawasaki-ninja-h2r-motorcykel
  '42170_Box1_v29.webp': '42170-kawasaki-ninja-h2r-motorcykel',
  '42170_Lifestyle_Cons_crop.webp': '42170-kawasaki-ninja-h2r-motorcykel',
  '42170_Lifestyle_Envr_crop.webp': '42170-kawasaki-ninja-h2r-motorcykel',
  '42170_Prod.webp': '42170-kawasaki-ninja-h2r-motorcykel',
  '42170_boxprod_v29.webp': '42170-kawasaki-ninja-h2r-motorcykel',

  // Product: 42171-mercedes-amg-f1-w14-e-performance
  '42171_Box1_v29.webp': '42171-mercedes-amg-f1-w14-e-performance',
  '42171_Lifestyle_Cons_crop.webp': '42171-mercedes-amg-f1-w14-e-performance',
  '42171_Lifestyle_Envr_crop.webp': '42171-mercedes-amg-f1-w14-e-performance',
  '42171_Prod.webp': '42171-mercedes-amg-f1-w14-e-performance',
  '42171_boxprod_v29.webp': '42171-mercedes-amg-f1-w14-e-performance',

  // Product: 42172-mclaren-p1™
  '42172_Box1_v29.webp': '42172-mclaren-p1™',
  '42172_Lifestyle_Cons_crop.webp': '42172-mclaren-p1™',
  '42172_Lifestyle_Envr_crop.webp': '42172-mclaren-p1™',
  '42172_Prod.webp': '42172-mclaren-p1™',
  '42172_boxprod_v29_sha.webp': '42172-mclaren-p1™',

  // Product: 42173-koenigsegg-jesko-absolut-gra-hyperbil
  '42173_Box1_v29.webp': '42173-koenigsegg-jesko-absolut-gra-hyperbil',
  '42173_Lifestyle_Cons_crop.webp': '42173-koenigsegg-jesko-absolut-gra-hyperbil',
  '42173_Lifestyle_Envr_crop.webp': '42173-koenigsegg-jesko-absolut-gra-hyperbil',
  '42173_Prod.webp': '42173-koenigsegg-jesko-absolut-gra-hyperbil',
  '42173_boxprod_v29_sha.webp': '42173-koenigsegg-jesko-absolut-gra-hyperbil',

  // Product: 42174-emirates-team-new-zealand-ac75-yacht
  '42174_Box1_v29.webp': '42174-emirates-team-new-zealand-ac75-yacht',
  '42174_Lifestyle_Cons_crop.webp': '42174-emirates-team-new-zealand-ac75-yacht',
  '42174_Lifestyle_Envr_crop.webp': '42174-emirates-team-new-zealand-ac75-yacht',
  '42174_Prod.webp': '42174-emirates-team-new-zealand-ac75-yacht',
  '42174_boxprod_v29_sha.webp': '42174-emirates-team-new-zealand-ac75-yacht',

  // Product: 42175-volvo-fmx-lastbil-ec230-elgravmaskin
  '42175_Box1_v29.webp': '42175-volvo-fmx-lastbil-ec230-elgravmaskin',
  '42175_Lifestyle_Cons_crop.webp': '42175-volvo-fmx-lastbil-ec230-elgravmaskin',
  '42175_Lifestyle_Envr_crop.webp': '42175-volvo-fmx-lastbil-ec230-elgravmaskin',
  '42175_Prod.webp': '42175-volvo-fmx-lastbil-ec230-elgravmaskin',
  '42175_boxprod_v29_sha.webp': '42175-volvo-fmx-lastbil-ec230-elgravmaskin',

  // Product: 42176-porsche-gt4-e-performance
  '42176_Box1_v29.webp': '42176-porsche-gt4-e-performance',
  '42176_Lifestyle_Cons_crop.webp': '42176-porsche-gt4-e-performance',
  '42176_Lifestyle_Envr_crop.webp': '42176-porsche-gt4-e-performance',
  '42176_Prod.webp': '42176-porsche-gt4-e-performance',
  '42176_boxprod_v29_sha.webp': '42176-porsche-gt4-e-performance',

  // Product: 42177-mercedes-benz-g-500-professional-line
  '42177_Box1_v29.webp': '42177-mercedes-benz-g-500-professional-line',
  '42177_Lifestyle_Cons_crop.webp': '42177-mercedes-benz-g-500-professional-line',
  '42177_Lifestyle_Envr_crop.webp': '42177-mercedes-benz-g-500-professional-line',
  '42177_Prod.webp': '42177-mercedes-benz-g-500-professional-line',
  '42177_boxprod_v29_sha.webp': '42177-mercedes-benz-g-500-professional-line',

  // Product: 42178-rymdlastare-lt78
  '42178_Box1_v29.webp': '42178-rymdlastare-lt78',
  '42178_Lifestyle_Cons_crop.webp': '42178-rymdlastare-lt78',
  '42178_Lifestyle_Envr_crop.webp': '42178-rymdlastare-lt78',
  '42178_Prod.webp': '42178-rymdlastare-lt78',
  '42178_boxprod_v29.webp': '42178-rymdlastare-lt78',

  // Product: 42179-jorden-och-manen
  '42179_Box1_v29.webp': '42179-jorden-och-manen',
  '42179_Lifestyle_Cons_crop.webp': '42179-jorden-och-manen',
  '42179_Lifestyle_Envr_crop.webp': '42179-jorden-och-manen',
  '42179_Prod.webp': '42179-jorden-och-manen',
  '42179_boxprod_v29.webp': '42179-jorden-och-manen',

  // Product: 42180-rover-for-utforskning-pa-mars
  '42180_Box1_v29.webp': '42180-rover-for-utforskning-pa-mars',
  '42180_Lifestyle_Cons_crop.webp': '42180-rover-for-utforskning-pa-mars',
  '42180_Lifestyle_Envr_crop.webp': '42180-rover-for-utforskning-pa-mars',
  '42180_Prod.webp': '42180-rover-for-utforskning-pa-mars',
  '42180_boxprod_v29.webp': '42180-rover-for-utforskning-pa-mars',

  // Product: 42181-vtol-tungt-fraktrymdskepp-lt81
  '42181_Box1_v29.webp': '42181-vtol-tungt-fraktrymdskepp-lt81',
  '42181_Lifestyle_Cons_crop.webp': '42181-vtol-tungt-fraktrymdskepp-lt81',
  '42181_Lifestyle_Envr_crop.webp': '42181-vtol-tungt-fraktrymdskepp-lt81',
  '42181_Prod.webp': '42181-vtol-tungt-fraktrymdskepp-lt81',
  '42181_boxprod_v29.webp': '42181-vtol-tungt-fraktrymdskepp-lt81',

  // Product: 42182-nasa-apollo-lunar-roving-vehicle-lrv
  '42182_Box1_v29.webp': '42182-nasa-apollo-lunar-roving-vehicle-lrv',
  '42182_Lifestyle_Cons_crop.webp': '42182-nasa-apollo-lunar-roving-vehicle-lrv',
  '42182_Lifestyle_Envr_crop.webp': '42182-nasa-apollo-lunar-roving-vehicle-lrv',
  '42182_Prod.webp': '42182-nasa-apollo-lunar-roving-vehicle-lrv',
  '42182_boxprod_v29_sha.webp': '42182-nasa-apollo-lunar-roving-vehicle-lrv',

  // Product: 42197-gravlastare
  '42197_Box1_v29.webp': '42197-gravlastare',
  '42197_Lifestyle_Cons_crop.webp': '42197-gravlastare',
  '42197_Lifestyle_Envr_crop.webp': '42197-gravlastare',
  '42197_Prod.webp': '42197-gravlastare',
  '42197_boxprod_v29_sha.webp': '42197-gravlastare',

  // Product: 42198-bushflygplan
  '42198_Box1_v29.webp': '42198-bushflygplan',
  '42198_Lifestyle_Cons_crop.webp': '42198-bushflygplan',
  '42198_Lifestyle_Envr_crop.webp': '42198-bushflygplan',
  '42198_Prod.webp': '42198-bushflygplan',
  '42198_boxprod_v29_sha.webp': '42198-bushflygplan',

  // Product: 42199-monster-jam™-digatron™-med-pull-back
  '42199_Box1_v29.webp': '42199-monster-jam™-digatron™-med-pull-back',
  '42199_Lifestyle_Cons_crop.webp': '42199-monster-jam™-digatron™-med-pull-back',
  '42199_Lifestyle_Envr_crop.webp': '42199-monster-jam™-digatron™-med-pull-back',
  '42199_Prod.webp': '42199-monster-jam™-digatron™-med-pull-back',
  '42199_boxprod_v29_sha.webp': '42199-monster-jam™-digatron™-med-pull-back',

  // Product: 42200-monster-jam™-thunderroarus™-med-pull-back
  '42200_Box1_v29.webp': '42200-monster-jam™-thunderroarus™-med-pull-back',
  '42200_Lifestyle_Cons_crop.webp': '42200-monster-jam™-thunderroarus™-med-pull-back',
  '42200_Lifestyle_Envr_crop.webp': '42200-monster-jam™-thunderroarus™-med-pull-back',
  '42200_Prod.webp': '42200-monster-jam™-thunderroarus™-med-pull-back',
  '42200_boxprod_v29_sha.webp': '42200-monster-jam™-thunderroarus™-med-pull-back',

  // Product: 42201-ubat-for-djuphavsforskning
  '42201_Box1_v29.webp': '42201-ubat-for-djuphavsforskning',
  '42201_Lifestyle_Cons_crop.webp': '42201-ubat-for-djuphavsforskning',
  '42201_Lifestyle_Envr_crop.webp': '42201-ubat-for-djuphavsforskning',
  '42201_Prod.webp': '42201-ubat-for-djuphavsforskning',
  '42201_boxprod_v29_sha.webp': '42201-ubat-for-djuphavsforskning',

  // Product: 42202-ducati-panigale-v4-s-motorcykel
  '42202_Box1_v29.webp': '42202-ducati-panigale-v4-s-motorcykel',
  '42202_Lifestyle_Cons_crop.webp': '42202-ducati-panigale-v4-s-motorcykel',
  '42202_Lifestyle_Envr_crop.webp': '42202-ducati-panigale-v4-s-motorcykel',
  '42202_Prod.webp': '42202-ducati-panigale-v4-s-motorcykel',
  '42202_boxprod_v29_sha.webp': '42202-ducati-panigale-v4-s-motorcykel',

  // Product: 42203-dumper-med-tippflak
  '42203_Box1_v29.webp': '42203-dumper-med-tippflak',
  '42203_Lifestyle_Cons_crop.webp': '42203-dumper-med-tippflak',
  '42203_Lifestyle_Envr_crop.webp': '42203-dumper-med-tippflak',
  '42203_Prod.webp': '42203-dumper-med-tippflak',
  '42203_boxprod_v29_sha.webp': '42203-dumper-med-tippflak',

  // Product: 42204-fast-and-furious-toyota-supra-mk4
  '42204_Box1_v29.webp': '42204-fast-and-furious-toyota-supra-mk4',
  '42204_Lifestyle_Cons_crop.webp': '42204-fast-and-furious-toyota-supra-mk4',
  '42204_Lifestyle_Envr_crop.webp': '42204-fast-and-furious-toyota-supra-mk4',
  '42204_Prod.webp': '42204-fast-and-furious-toyota-supra-mk4',
  '42204_boxprod_v29_sha.webp': '42204-fast-and-furious-toyota-supra-mk4',

  // Product: 42205-chevrolet-corvette-stingray
  '42205_Box1_v29.webp': '42205-chevrolet-corvette-stingray',
  '42205_Lifestyle_Cons_crop.webp': '42205-chevrolet-corvette-stingray',
  '42205_Lifestyle_Envr_crop.webp': '42205-chevrolet-corvette-stingray',
  '42205_Prod.webp': '42205-chevrolet-corvette-stingray',
  '42205_boxprod_v29_sha.webp': '42205-chevrolet-corvette-stingray',

  // Product: 42206-oracle-red-bull-racing-rb20-f1
  '42206_Box1_v29.webp': '42206-oracle-red-bull-racing-rb20-f1',
  '42206_Lifestyle_Cons_crop.webp': '42206-oracle-red-bull-racing-rb20-f1',
  '42206_Lifestyle_Envr_crop.webp': '42206-oracle-red-bull-racing-rb20-f1',
  '42206_Prod.webp': '42206-oracle-red-bull-racing-rb20-f1',
  '42206_boxprod_v29_sha.webp': '42206-oracle-red-bull-racing-rb20-f1',

  // Product: 42207-ferrari-sf-24-f1
  '42207_Box1_v29.webp': '42207-ferrari-sf-24-f1',
  '42207_Lifestyle_Cons_crop.webp': '42207-ferrari-sf-24-f1',
  '42207_Lifestyle_Envr_crop.webp': '42207-ferrari-sf-24-f1',
  '42207_Prod.webp': '42207-ferrari-sf-24-f1',
  '42207_boxprod_v29_sha.webp': '42207-ferrari-sf-24-f1',

  // Product: 42208-aston-martin-valkyrie
  '42208_Box1_v29.webp': '42208-aston-martin-valkyrie',
  '42208_Lifestyle_Cons_crop.webp': '42208-aston-martin-valkyrie',
  '42208_Lifestyle_Envr_crop.webp': '42208-aston-martin-valkyrie',
  '42208_Prod.webp': '42208-aston-martin-valkyrie',
  '42208_boxprod_v29_sha.webp': '42208-aston-martin-valkyrie',

  // Product: 42209-volvo-l120-eldriven-hjullastare
  '42209_Box1_v29.webp': '42209-volvo-l120-eldriven-hjullastare',
  '42209_Lifestyle_Cons_crop.webp': '42209-volvo-l120-eldriven-hjullastare',
  '42209_Lifestyle_Envr_crop.webp': '42209-volvo-l120-eldriven-hjullastare',
  '42209_Prod.webp': '42209-volvo-l120-eldriven-hjullastare',
  '42209_boxprod_v29_sha.webp': '42209-volvo-l120-eldriven-hjullastare',

  // Product: 42210-2-fast-2-furious-nissan-skyline-gt-r-r34-bil
  '42210_Box1_v29.webp': '42210-2-fast-2-furious-nissan-skyline-gt-r-r34-bil',
  '42210_Lifestyle_Cons_crop.webp': '42210-2-fast-2-furious-nissan-skyline-gt-r-r34-bil',
  '42210_Lifestyle_Envr_crop.webp': '42210-2-fast-2-furious-nissan-skyline-gt-r-r34-bil',
  '42210_Prod.webp': '42210-2-fast-2-furious-nissan-skyline-gt-r-r34-bil',
  '42210_boxprod_v29_sha.webp': '42210-2-fast-2-furious-nissan-skyline-gt-r-r34-bil',

  // Product: 42211-lunar-outpost™-manrover-rymdfordon
  '42211_Box1_v29.webp': '42211-lunar-outpost™-manrover-rymdfordon',
  '42211_Lifestyle_Cons_crop.webp': '42211-lunar-outpost™-manrover-rymdfordon',
  '42211_Lifestyle_Envr_crop.webp': '42211-lunar-outpost™-manrover-rymdfordon',
  '42211_Prod.webp': '42211-lunar-outpost™-manrover-rymdfordon',
  '42211_boxprod_v29_sha.webp': '42211-lunar-outpost™-manrover-rymdfordon',

  // Product: 42212-ferrari-fxx-k
  '42212_Box1_v29.webp': '42212-ferrari-fxx-k',
  '42212_Lifestyle_Cons_crop.webp': '42212-ferrari-fxx-k',
  '42212_Lifestyle_Envr_crop.webp': '42212-ferrari-fxx-k',
  '42212_Prod.webp': '42212-ferrari-fxx-k',
  '42212_boxprod_v29_sha.webp': '42212-ferrari-fxx-k',

  // Product: 42213-ford-bronco®-suv
  '42213_Box1_v29.webp': '42213-ford-bronco®-suv',
  '42213_Lifestyle_Cons_crop.webp': '42213-ford-bronco®-suv',
  '42213_Lifestyle_Envr_crop.webp': '42213-ford-bronco®-suv',
  '42213_Prod.webp': '42213-ford-bronco®-suv',
  '42213_boxprod_v29_sha.webp': '42213-ford-bronco®-suv',

  // Product: 42214-lamborghini-revuelto-supersportbil
  '42214_Box1_v29.webp': '42214-lamborghini-revuelto-supersportbil',
  '42214_Lifestyle_Cons_crop.webp': '42214-lamborghini-revuelto-supersportbil',
  '42214_Lifestyle_Envr_crop.webp': '42214-lamborghini-revuelto-supersportbil',
  '42214_Prod.webp': '42214-lamborghini-revuelto-supersportbil',
  '42214_boxprod_v29_sha.webp': '42214-lamborghini-revuelto-supersportbil',

  // Product: 42215-volvo-ec500-hybrid-gravmaskin
  '42215_Box1_v29.webp': '42215-volvo-ec500-hybrid-gravmaskin',
  '42215_Lifestyle_Cons_crop.webp': '42215-volvo-ec500-hybrid-gravmaskin',
  '42215_Lifestyle_Envr_crop.webp': '42215-volvo-ec500-hybrid-gravmaskin',
  '42215_Prod.webp': '42215-volvo-ec500-hybrid-gravmaskin',
  '42215_boxprod_v29_sha.webp': '42215-volvo-ec500-hybrid-gravmaskin',

  // Product: 42603-campingbil-for-stjarnskadning
  '42603_Box1_v29.webp': '42603-campingbil-for-stjarnskadning',
  '42603_Lifestyle_Cons_crop.webp': '42603-campingbil-for-stjarnskadning',
  '42603_Lifestyle_Envr_crop.webp': '42603-campingbil-for-stjarnskadning',
  '42603_Prod.webp': '42603-campingbil-for-stjarnskadning',
  '42603_boxprod_v29.webp': '42603-campingbil-for-stjarnskadning',

  // Product: 42604-heartlake-citys-shoppingcenter
  '42604_Box1_v29.webp': '42604-heartlake-citys-shoppingcenter',
  '42604_Lifestyle_Cons_crop.webp': '42604-heartlake-citys-shoppingcenter',
  '42604_Lifestyle_Envr_crop.webp': '42604-heartlake-citys-shoppingcenter',
  '42604_Prod.webp': '42604-heartlake-citys-shoppingcenter',
  '42604_boxprod_v29.webp': '42604-heartlake-citys-shoppingcenter',

  // Product: 42606-kafevagn
  '42606_Box1_v29.webp': '42606-kafevagn',
  '42606_Lifestyle_Cons_crop.webp': '42606-kafevagn',
  '42606_Lifestyle_Envr_crop.webp': '42606-kafevagn',
  '42606_Prod.webp': '42606-kafevagn',
  '42606_boxprod_v29.webp': '42606-kafevagn',

  // Product: 42610-karaokefest
  '42610_Box1_v29.webp': '42610-karaokefest',
  '42610_Lifestyle_Cons_crop.webp': '42610-karaokefest',
  '42610_Lifestyle_Envr_crop.webp': '42610-karaokefest',
  '42610_Prod.webp': '42610-karaokefest',
  '42610_boxprod_v29.webp': '42610-karaokefest',

  // Product: 42614-vintagebutik
  '42614_Box1_v29.webp': '42614-vintagebutik',
  '42614_Lifestyle_Cons_crop.webp': '42614-vintagebutik',
  '42614_Lifestyle_Envr_crop.webp': '42614-vintagebutik',
  '42614_Prod.webp': '42614-vintagebutik',
  '42614_boxprod_v29.webp': '42614-vintagebutik',

  // Product: 42618-heartlake-citys-kafe
  '42618_Box1_v29.webp': '42618-heartlake-citys-kafe',
  '42618_Lifestyle_Cons_crop.webp': '42618-heartlake-citys-kafe',
  '42618_Lifestyle_Envr_crop.webp': '42618-heartlake-citys-kafe',
  '42618_Prod.webp': '42618-heartlake-citys-kafe',
  '42618_boxprod_v29_sha.webp': '42618-heartlake-citys-kafe',

  // Product: 42620-ollys-och-paisleys-familjehus
  '42620_Box1_v29.webp': '42620-ollys-och-paisleys-familjehus',
  '42620_Lifestyle_Cons_crop.webp': '42620-ollys-och-paisleys-familjehus',
  '42620_Lifestyle_Envr_crop.webp': '42620-ollys-och-paisleys-familjehus',
  '42620_Prod.webp': '42620-ollys-och-paisleys-familjehus',
  '42620_boxprod_v29.webp': '42620-ollys-och-paisleys-familjehus',

  // Product: 42621-heartlake-citys-sjukhus
  '42621_Box1_v29.webp': '42621-heartlake-citys-sjukhus',
  '42621_Lifestyle_Cons_crop.webp': '42621-heartlake-citys-sjukhus',
  '42621_Lifestyle_Envr_crop.webp': '42621-heartlake-citys-sjukhus',
  '42621_Prod.webp': '42621-heartlake-citys-sjukhus',
  '42621_boxprod_v29.webp': '42621-heartlake-citys-sjukhus',

  // Product: 42622-aventyrslager-bagskytte
  '42622_Box1_v29.webp': '42622-aventyrslager-bagskytte',
  '42622_Lifestyle_Cons_crop.webp': '42622-aventyrslager-bagskytte',
  '42622_Lifestyle_Envr_crop.webp': '42622-aventyrslager-bagskytte',
  '42622_Prod.webp': '42622-aventyrslager-bagskytte',
  '42622_boxprod_v29_sha.webp': '42622-aventyrslager-bagskytte',

  // Product: 42623-strand-vattenskoter
  '42623_Box1_v29.webp': '42623-strand-vattenskoter',
  '42623_Lifestyle_Cons_crop.webp': '42623-strand-vattenskoter',
  '42623_Lifestyle_Envr_crop.webp': '42623-strand-vattenskoter',
  '42623_Prod.webp': '42623-strand-vattenskoter',
  '42623_boxprod_v29_sha.webp': '42623-strand-vattenskoter',

  // Product: 42624-aventyrslager-mysiga-stugor
  '42624_Box1_v29.webp': '42624-aventyrslager-mysiga-stugor',
  '42624_Lifestyle_Cons_crop.webp': '42624-aventyrslager-mysiga-stugor',
  '42624_Lifestyle_Envr_crop.webp': '42624-aventyrslager-mysiga-stugor',
  '42624_Prod.webp': '42624-aventyrslager-mysiga-stugor',
  '42624_boxprod_v29_sha.webp': '42624-aventyrslager-mysiga-stugor',

  // Product: 42625-strand-smoothiekiosk
  '42625_Box1_v29.webp': '42625-strand-smoothiekiosk',
  '42625_Lifestyle_Cons_crop.webp': '42625-strand-smoothiekiosk',
  '42625_Lifestyle_Envr_crop.webp': '42625-strand-smoothiekiosk',
  '42625_Prod.webp': '42625-strand-smoothiekiosk',
  '42625_boxprod_v29_sha.webp': '42625-strand-smoothiekiosk',

  // Product: 42626-aventyrslager-vattensporter
  '42626_Box1_v29.webp': '42626-aventyrslager-vattensporter',
  '42626_Lifestyle_Cons_crop.webp': '42626-aventyrslager-vattensporter',
  '42626_Lifestyle_Envr_crop.webp': '42626-aventyrslager-vattensporter',
  '42626_Prod.webp': '42626-aventyrslager-vattensporter',
  '42626_boxprod_v29_sha.webp': '42626-aventyrslager-vattensporter',

  // Product: 42630-heartlake-citys-vattenpark
  '42630_Box1_v29.webp': '42630-heartlake-citys-vattenpark',
  '42630_Lifestyle_Cons_crop.webp': '42630-heartlake-citys-vattenpark',
  '42630_Lifestyle_Envr_crop.webp': '42630-heartlake-citys-vattenpark',
  '42630_Prod.webp': '42630-heartlake-citys-vattenpark',
  '42630_boxprod_v29_sha.webp': '42630-heartlake-citys-vattenpark',

  // Product: 42631-aventyrslager-tradkoja
  '42631_Box1_v29.webp': '42631-aventyrslager-tradkoja',
  '42631_Lifestyle_Envr_crop.webp': '42631-aventyrslager-tradkoja',
  '42631_Prod.webp': '42631-aventyrslager-tradkoja',
  '42631_WE_eComLifestyle.webp': '42631-aventyrslager-tradkoja',
  '42631_boxprod_v29_sha.webp': '42631-aventyrslager-tradkoja',

  // Product: 42634-hast-och-ponnyslap
  '42634_Box1_v29.webp': '42634-hast-och-ponnyslap',
  '42634_Lifestyle_Cons_crop.webp': '42634-hast-och-ponnyslap',
  '42634_Lifestyle_Envr_crop.webp': '42634-hast-och-ponnyslap',
  '42634_Prod.webp': '42634-hast-och-ponnyslap',
  '42634_boxprod_v29.webp': '42634-hast-och-ponnyslap',

  // Product: 42635-hundfrisorbil
  '42635_Box1_v29.webp': '42635-hundfrisorbil',
  '42635_Lifestyle_Cons_crop.webp': '42635-hundfrisorbil',
  '42635_Lifestyle_Envr_crop.webp': '42635-hundfrisorbil',
  '42635_Prod.webp': '42635-hundfrisorbil',
  '42635_boxprod_v29_sha.webp': '42635-hundfrisorbil',

  // Product: 42638-slottspensionat
  '42638_Box1_v29.webp': '42638-slottspensionat',
  '42638_Lifestyle_Cons_crop.webp': '42638-slottspensionat',
  '42638_Lifestyle_Envr_crop.webp': '42638-slottspensionat',
  '42638_Prod.webp': '42638-slottspensionat',
  '42638_boxprod_v29_sha.webp': '42638-slottspensionat',

  // Product: 42640-marsvinens-lekplats
  '42640_Box1_v29.webp': '42640-marsvinens-lekplats',
  '42640_Lifestyle_Cons_crop.webp': '42640-marsvinens-lekplats',
  '42640_Lifestyle_Envr_crop.webp': '42640-marsvinens-lekplats',
  '42640_Prod.webp': '42640-marsvinens-lekplats',
  '42640_boxprod_v29_sha.webp': '42640-marsvinens-lekplats',

  // Product: 42641-aventyr-med-surfhundar-och-vespa
  '42641_Box1_v29.webp': '42641-aventyr-med-surfhundar-och-vespa',
  '42641_Lifestyle_Cons_crop.webp': '42641-aventyr-med-surfhundar-och-vespa',
  '42641_Lifestyle_Envr_crop.webp': '42641-aventyr-med-surfhundar-och-vespa',
  '42641_Prod.webp': '42641-aventyr-med-surfhundar-och-vespa',
  '42641_boxprod_v29_sha.webp': '42641-aventyr-med-surfhundar-och-vespa',

  // Product: 42642-filmkvall-med-vanner
  '42642_Box1_v29.webp': '42642-filmkvall-med-vanner',
  '42642_Lifestyle_Cons_crop.webp': '42642-filmkvall-med-vanner',
  '42642_Lifestyle_Envr_crop.webp': '42642-filmkvall-med-vanner',
  '42642_Prod.webp': '42642-filmkvall-med-vanner',
  '42642_boxprod_v29_sha.webp': '42642-filmkvall-med-vanner',

  // Product: 42643-sockervaddsstand-och-vespa
  '42643_Box1_v29.webp': '42643-sockervaddsstand-och-vespa',
  '42643_Lifestyle_Cons_crop.webp': '42643-sockervaddsstand-och-vespa',
  '42643_Lifestyle_Envr_crop.webp': '42643-sockervaddsstand-och-vespa',
  '42643_Prod.webp': '42643-sockervaddsstand-och-vespa',
  '42643_boxprod_v29_sha.webp': '42643-sockervaddsstand-och-vespa',

  // Product: 42644-heartlake-citys-glassbil
  '42644_Box1_v29.webp': '42644-heartlake-citys-glassbil',
  '42644_Lifestyle_Cons_crop.webp': '42644-heartlake-citys-glassbil',
  '42644_Lifestyle_Envr_crop.webp': '42644-heartlake-citys-glassbil',
  '42644_Prod.webp': '42644-heartlake-citys-glassbil',
  '42644_boxprod_v29_sha.webp': '42644-heartlake-citys-glassbil',

  // Product: 42646-autumns-rum
  '42646_Box1_v29.webp': '42646-autumns-rum',
  '42646_Lifestyle_Cons_crop.webp': '42646-autumns-rum',
  '42646_Lifestyle_Envr_crop.webp': '42646-autumns-rum',
  '42646_Prod.webp': '42646-autumns-rum',
  '42646_boxprod_v29_sha.webp': '42646-autumns-rum',

  // Product: 42647-paisleys-rum
  '42647_Box1_v29.webp': '42647-paisleys-rum',
  '42647_Lifestyle_Cons_crop.webp': '42647-paisleys-rum',
  '42647_Lifestyle_Envr_crop.webp': '42647-paisleys-rum',
  '42647_Prod.webp': '42647-paisleys-rum',
  '42647_boxprod_v29_sha.webp': '42647-paisleys-rum',

  // Product: 42648-pandareservat
  '42648_Box1_v29.webp': '42648-pandareservat',
  '42648_Lifestyle_Cons_crop.webp': '42648-pandareservat',
  '42648_Lifestyle_Envr_crop.webp': '42648-pandareservat',
  '42648_Prod.webp': '42648-pandareservat',
  '42648_boxprod_v29_sha.webp': '42648-pandareservat',

  // Product: 42649-heartlake-citys-godisaffar
  '42649_Box1_v29.webp': '42649-heartlake-citys-godisaffar',
  '42649_Lifestyle_cons_crop.webp': '42649-heartlake-citys-godisaffar',
  '42649_Lifestyle_envr_crop.webp': '42649-heartlake-citys-godisaffar',
  '42649_Prod.webp': '42649-heartlake-citys-godisaffar',
  '42649_boxprod_v29_sha.webp': '42649-heartlake-citys-godisaffar',

  // Product: 42650-djurtillbehorsaffar
  '42650_Box1_v29.webp': '42650-djurtillbehorsaffar',
  '42650_Lifestyle_cons_crop.webp': '42650-djurtillbehorsaffar',
  '42650_Lifestyle_envr_crop.webp': '42650-djurtillbehorsaffar',
  '42650_Prod.webp': '42650-djurtillbehorsaffar',
  '42650_boxprod_v29_sha.webp': '42650-djurtillbehorsaffar',

  // Product: 42651-veterinarklinik-for-hastar-och-husdjur
  '42651_Box1_v29.webp': '42651-veterinarklinik-for-hastar-och-husdjur',
  '42651_Lifestyle_cons_crop.webp': '42651-veterinarklinik-for-hastar-och-husdjur',
  '42651_Lifestyle_envr_crop.webp': '42651-veterinarklinik-for-hastar-och-husdjur',
  '42651_Prod.webp': '42651-veterinarklinik-for-hastar-och-husdjur',
  '42651_boxprod_v29_sha.webp': '42651-veterinarklinik-for-hastar-och-husdjur',

  // Product: 42652-vanskapstradkoja
  '42652_Box1_v29.webp': '42652-vanskapstradkoja',
  '42652_Lifestyle_Cons_crop.webp': '42652-vanskapstradkoja',
  '42652_Lifestyle_Envr_crop.webp': '42652-vanskapstradkoja',
  '42652_Prod.webp': '42652-vanskapstradkoja',
  '42652_boxprod_v29_sha.webp': '42652-vanskapstradkoja',

  // Product: 42653-musikaffar-lagenhet
  '42653_Box1_v29.webp': '42653-musikaffar-lagenhet',
  '42653_Lifestyle_Cons_crop.webp': '42653-musikaffar-lagenhet',
  '42653_Lifestyle_Envr_crop.webp': '42653-musikaffar-lagenhet',
  '42653_Prod.webp': '42653-musikaffar-lagenhet',
  '42653_boxprod_v29_sha.webp': '42653-musikaffar-lagenhet',

  // Product: 42654-ponnygard-stall
  '42654_Box1_v29.webp': '42654-ponnygard-stall',
  '42654_Lifestyle_Cons_crop.webp': '42654-ponnygard-stall',
  '42654_Lifestyle_Envr_crop.webp': '42654-ponnygard-stall',
  '42654_Prod.webp': '42654-ponnygard-stall',
  '42654_boxprod_v29_sha.webp': '42654-ponnygard-stall',

  // Product: 42655-restaurang-och-matlagningsskola
  '42655_Box1_v29.webp': '42655-restaurang-och-matlagningsskola',
  '42655_Lifestyle_cons_crop.webp': '42655-restaurang-och-matlagningsskola',
  '42655_Lifestyle_envr_crop.webp': '42655-restaurang-och-matlagningsskola',
  '42655_Prod.webp': '42655-restaurang-och-matlagningsskola',
  '42655_boxprod_v29_sha.webp': '42655-restaurang-och-matlagningsskola',

  // Product: 42658-poolparty-med-enhorning-och-flamingo
  '42658_Box1_v29.webp': '42658-poolparty-med-enhorning-och-flamingo',
  '42658_Lifestyle_Cons_crop.webp': '42658-poolparty-med-enhorning-och-flamingo',
  '42658_Lifestyle_Envr_crop.webp': '42658-poolparty-med-enhorning-och-flamingo',
  '42658_Prod.webp': '42658-poolparty-med-enhorning-och-flamingo',
  '42658_boxprod_v29_sha.webp': '42658-poolparty-med-enhorning-och-flamingo',

  // Product: 42659-bilresa-med-vanner
  '42659_Box1_v29.webp': '42659-bilresa-med-vanner',
  '42659_Lifestyle_Cons_crop.webp': '42659-bilresa-med-vanner',
  '42659_Lifestyle_Envr_crop.webp': '42659-bilresa-med-vanner',
  '42659_Prod.webp': '42659-bilresa-med-vanner',
  '42659_boxprod_v29_sha.webp': '42659-bilresa-med-vanner',

  // Product: 42661-maskeradfest-med-enhorning-och-alva
  '42661_Box1_v29.webp': '42661-maskeradfest-med-enhorning-och-alva',
  '42661_Lifestyle_Cons_crop.webp': '42661-maskeradfest-med-enhorning-och-alva',
  '42661_Lifestyle_Envr_crop.webp': '42661-maskeradfest-med-enhorning-och-alva',
  '42661_Prod.webp': '42661-maskeradfest-med-enhorning-och-alva',
  '42661_boxprod_v29_sha.webp': '42661-maskeradfest-med-enhorning-och-alva',

  // Product: 42662-frisorsalong-och-accessoarbutik
  '42662_Box1_v29.webp': '42662-frisorsalong-och-accessoarbutik',
  '42662_Lifestyle_cons_crop.webp': '42662-frisorsalong-och-accessoarbutik',
  '42662_Lifestyle_envr_crop.webp': '42662-frisorsalong-och-accessoarbutik',
  '42662_Prod.webp': '42662-frisorsalong-och-accessoarbutik',
  '42662_boxprod_v29_sha.webp': '42662-frisorsalong-och-accessoarbutik',

  // Product: 42663-vanskapsaventyr-med-husbil
  '42663_Box1_v29.webp': '42663-vanskapsaventyr-med-husbil',
  '42663_Lifestyle_cons_crop.webp': '42663-vanskapsaventyr-med-husbil',
  '42663_Lifestyle_envr_crop.webp': '42663-vanskapsaventyr-med-husbil',
  '42663_Prod.webp': '42663-vanskapsaventyr-med-husbil',
  '42663_boxprod_v29_sha.webp': '42663-vanskapsaventyr-med-husbil',

  // Product: 42664-bataventyr
  '42664_Box1_v29.webp': '42664-bataventyr',
  '42664_Lifestyle_Cons_crop.webp': '42664-bataventyr',
  '42664_Lifestyle_Envr_crop.webp': '42664-bataventyr',
  '42664_Prod.webp': '42664-bataventyr',
  '42664_boxprod_v29_sha.webp': '42664-bataventyr',

  // Product: 42665-valplekplats
  '42665_Box1_v29.webp': '42665-valplekplats',
  '42665_Lifestyle_Cons_crop.webp': '42665-valplekplats',
  '42665_Lifestyle_Envr_crop.webp': '42665-valplekplats',
  '42665_Prod.webp': '42665-valplekplats',
  '42665_boxprod_v29_sha.webp': '42665-valplekplats',

  // Product: 42666-kattkalas-tradkoja
  '42666_Box1_v29.webp': '42666-kattkalas-tradkoja',
  '42666_Lifestyle_Cons_crop.webp': '42666-kattkalas-tradkoja',
  '42666_Lifestyle_Envr_crop.webp': '42666-kattkalas-tradkoja',
  '42666_Prod.webp': '42666-kattkalas-tradkoja',
  '42666_boxprod_v29_sha.webp': '42666-kattkalas-tradkoja',

  // Product: 42668-adventskalender-2025
  '42668_Box1_v29.webp': '42668-adventskalender-2025',
  '42668_Lifestyle_Cons_crop.webp': '42668-adventskalender-2025',
  '42668_Lifestyle_Envr_crop.webp': '42668-adventskalender-2025',
  '42668_Prod.webp': '42668-adventskalender-2025',
  '42668_boxprod_v29_sha.webp': '42668-adventskalender-2025',

  // Product: 42669-biodlarhus-och-blomstertradgard
  '42669_Box1_v29.webp': '42669-biodlarhus-och-blomstertradgard',
  '42669_Lifestyle_cons_crop.webp': '42669-biodlarhus-och-blomstertradgard',
  '42669_Lifestyle_envr_crop.webp': '42669-biodlarhus-och-blomstertradgard',
  '42669_Prod.webp': '42669-biodlarhus-och-blomstertradgard',
  '42669_boxprod_v29_sha.webp': '42669-biodlarhus-och-blomstertradgard',

  // Product: 42670-heartlake-citys-lagenheter-och-butiker
  '42670_Box1_v29.webp': '42670-heartlake-citys-lagenheter-och-butiker',
  '42670_Lifestyle_cons_crop.webp': '42670-heartlake-citys-lagenheter-och-butiker',
  '42670_Lifestyle_envr_crop.webp': '42670-heartlake-citys-lagenheter-och-butiker',
  '42670_Prod.webp': '42670-heartlake-citys-lagenheter-och-butiker',
  '42670_boxprod_v29_sha.webp': '42670-heartlake-citys-lagenheter-och-butiker',

  // Product: 42671-vaxtkafe-blomsteraffar
  '42671_Box1_v29.webp': '42671-vaxtkafe-blomsteraffar',
  '42671_Lifestyle_Cons_crop.webp': '42671-vaxtkafe-blomsteraffar',
  '42671_Lifestyle_Envr_crop.webp': '42671-vaxtkafe-blomsteraffar',
  '42671_Prod.webp': '42671-vaxtkafe-blomsteraffar',
  '42671_boxprod_v29_sha.webp': '42671-vaxtkafe-blomsteraffar',

  // Product: 42672-kreativ-strand-och-resvaska
  '42672_Box1_v29.webp': '42672-kreativ-strand-och-resvaska',
  '42672_Lifestyle_cons_crop.webp': '42672-kreativ-strand-och-resvaska',
  '42672_Lifestyle_envr_crop.webp': '42672-kreativ-strand-och-resvaska',
  '42672_Prod.webp': '42672-kreativ-strand-och-resvaska',
  '42672_boxprod_v29_sha.webp': '42672-kreativ-strand-och-resvaska',

  // Product: 42673-familjesemester-pa-strandresort
  '42673_Box1_v29.webp': '42673-familjesemester-pa-strandresort',
  '42673_Lifestyle_Cons_crop.webp': '42673-familjesemester-pa-strandresort',
  '42673_Lifestyle_Envr_crop.webp': '42673-familjesemester-pa-strandresort',
  '42673_Prod.webp': '42673-familjesemester-pa-strandresort',
  '42673_boxprod_v29_sha.webp': '42673-familjesemester-pa-strandresort',

  // Product: 43217-huset-fran-upp
  '43217_Box1_v110.webp': '43217-huset-fran-upp',
  '43217_Lifestyle_Cons_crop.webp': '43217-huset-fran-upp',
  '43217_Lifestyle_Envr_crop.webp': '43217-huset-fran-upp',
  '43217_Prod.webp': '43217-huset-fran-upp',
  '43217_boxprod_v110_sha.webp': '43217-huset-fran-upp',

  // Product: 43230-hyllning-till-walt-disney-kamera
  '43230_Box1_v110.webp': '43230-hyllning-till-walt-disney-kamera',
  '43230_Lifestyle_Cons_crop.webp': '43230-hyllning-till-walt-disney-kamera',
  '43230_Lifestyle_Envr_crop.webp': '43230-hyllning-till-walt-disney-kamera',
  '43230_Prod.webp': '43230-hyllning-till-walt-disney-kamera',
  '43230_boxprod_v110_sha.webp': '43230-hyllning-till-walt-disney-kamera',

  // Product: 43235-ariels-musikscen
  '43235_Box1_v29.webp': '43235-ariels-musikscen',
  '43235_Lifestyle_cons_crop.webp': '43235-ariels-musikscen',
  '43235_Lifestyle_envr_crop.webp': '43235-ariels-musikscen',
  '43235_Prod.webp': '43235-ariels-musikscen',
  '43235_boxprod_v29_sha.webp': '43235-ariels-musikscen',

  // Product: 43237-isabelas-blomkruka
  '43237_Box1_v29.webp': '43237-isabelas-blomkruka',
  '43237_Lifestyle_Cons_crop.webp': '43237-isabelas-blomkruka',
  '43237_Lifestyle_Envr_crop.webp': '43237-isabelas-blomkruka',
  '43237_Prod.webp': '43237-isabelas-blomkruka',
  '43237_boxprod_v29.webp': '43237-isabelas-blomkruka',

  // Product: 43238-elsas-frostiga-slott
  '43238_Box1_v29.webp': '43238-elsas-frostiga-slott',
  '43238_Lifestyle_Cons_crop.webp': '43238-elsas-frostiga-slott',
  '43238_Lifestyle_Envr_crop.webp': '43238-elsas-frostiga-slott',
  '43238_Prod.webp': '43238-elsas-frostiga-slott',
  '43238_boxprod_v29.webp': '43238-elsas-frostiga-slott',

  // Product: 43240-maleficent-som-drake
  '43240_Box1_v29.webp': '43240-maleficent-som-drake',
  '43240_Lifestyle_cons_crop.webp': '43240-maleficent-som-drake',
  '43240_Prod.webp': '43240-maleficent-som-drake',
  '43240_boxprod_v29_sha.webp': '43240-maleficent-som-drake',

  // Product: 43243-lejonungen-simba
  '43243_Box1_v29.webp': '43243-lejonungen-simba',
  '43243_Lifestyle_cons_crop.webp': '43243-lejonungen-simba',
  '43243_Lifestyle_envr_crop.webp': '43243-lejonungen-simba',
  '43243_Prod.webp': '43243-lejonungen-simba',
  '43243_boxprod_v29_sha.webp': '43243-lejonungen-simba',

  // Product: 43244-elsas-ispalats
  '43244_Box1_v29.webp': '43244-elsas-ispalats',
  '43244_Lifestyle_cons_crop.webp': '43244-elsas-ispalats',
  '43244_Lifestyle_envr_crop.webp': '43244-elsas-ispalats',
  '43244_Prod.webp': '43244-elsas-ispalats',
  '43244_boxprod_v29_sha.webp': '43244-elsas-ispalats',

  // Product: 43245-familjen-madrigals-magiska-hus
  '43245_Box1_v29.webp': '43245-familjen-madrigals-magiska-hus',
  '43245_Lifestyle_cons_crop.webp': '43245-familjen-madrigals-magiska-hus',
  '43245_Lifestyle_envr_crop.webp': '43245-familjen-madrigals-magiska-hus',
  '43245_Prod.webp': '43245-familjen-madrigals-magiska-hus',
  '43245_boxprod_v29_sha.webp': '43245-familjen-madrigals-magiska-hus',

  // Product: 43246-disneyprinsessornas-marknadsaventyr
  '43246_Box1_v29.webp': '43246-disneyprinsessornas-marknadsaventyr',
  '43246_Lifestyle_Cons_crop.webp': '43246-disneyprinsessornas-marknadsaventyr',
  '43246_Lifestyle_Envr_crop.webp': '43246-disneyprinsessornas-marknadsaventyr',
  '43246_Prod.webp': '43246-disneyprinsessornas-marknadsaventyr',
  '43246_boxprod_v29.webp': '43246-disneyprinsessornas-marknadsaventyr',

  // Product: 43247-unge-lejonkungen-simba
  '43247_Box1_v29.webp': '43247-unge-lejonkungen-simba',
  '43247_Lifestyle_Cons_crop.webp': '43247-unge-lejonkungen-simba',
  '43247_Lifestyle_Envr_crop.webp': '43247-unge-lejonkungen-simba',
  '43247_Prod.webp': '43247-unge-lejonkungen-simba',
  '43247_boxprod_v29_sha.webp': '43247-unge-lejonkungen-simba',

  // Product: 43248-insidan-ut-2-kanslokuber
  '43248_Box1_v29.webp': '43248-insidan-ut-2-kanslokuber',
  '43248_Lifestyle_Cons_crop.webp': '43248-insidan-ut-2-kanslokuber',
  '43248_Lifestyle_Envr_crop.webp': '43248-insidan-ut-2-kanslokuber',
  '43248_Prod.webp': '43248-insidan-ut-2-kanslokuber',
  '43248_boxprod_v29.webp': '43248-insidan-ut-2-kanslokuber',

  // Product: 43249-stitch
  '43249_Box1_v29.webp': '43249-stitch',
  '43249_Lifestyle_Cons_crop.webp': '43249-stitch',
  '43249_Lifestyle_Envr_crop.webp': '43249-stitch',
  '43249_Prod.webp': '43249-stitch',
  '43249_boxprod_v29.webp': '43249-stitch',

  // Product: 43254-ariels-kristallgrotta
  '43254_Box1_v29.webp': '43254-ariels-kristallgrotta',
  '43254_Lifestyle_cons_crop.webp': '43254-ariels-kristallgrotta',
  '43254_Lifestyle_envr_crop.webp': '43254-ariels-kristallgrotta',
  '43254_Prod.webp': '43254-ariels-kristallgrotta',
  '43254_boxprod_v29_sha.webp': '43254-ariels-kristallgrotta',

  // Product: 43256-annas-sladaventyr
  '43256_Box1_v29.webp': '43256-annas-sladaventyr',
  '43256_Lifestyle_Cons_crop.webp': '43256-annas-sladaventyr',
  '43256_Lifestyle_Envr_crop.webp': '43256-annas-sladaventyr',
  '43256_Prod.webp': '43256-annas-sladaventyr',
  '43256_boxprod_v29_sha.webp': '43256-annas-sladaventyr',

  // Product: 43257-angel
  '43257_Box1_v29.webp': '43257-angel',
  '43257_Lifestyle_Cons_crop.webp': '43257-angel',
  '43257_Lifestyle_Envr_crop.webp': '43257-angel',
  '43257_Prod.webp': '43257-angel',
  '43257_boxprod_v29_sha.webp': '43257-angel',

  // Product: 43258-kakamoras-pram
  '43258_Box1_v29.webp': '43258-kakamoras-pram',
  '43258_Lifestyle_Cons_crop.webp': '43258-kakamoras-pram',
  '43258_Lifestyle_Envr_crop.webp': '43258-kakamoras-pram',
  '43258_Prod.webp': '43258-kakamoras-pram',
  '43258_boxprod_v29_sha.webp': '43258-kakamoras-pram',

  // Product: 43259-dansande-ariel
  '43259_Box1_v29.webp': '43259-dansande-ariel',
  '43259_Lifestyle_Cons_crop.webp': '43259-dansande-ariel',
  '43259_Lifestyle_Envr_crop.webp': '43259-dansande-ariel',
  '43259_Prod.webp': '43259-dansande-ariel',
  '43259_boxprod_v29_sha.webp': '43259-dansande-ariel',

  // Product: 43260-vaianas-skoj-pa-on
  '43260_Box1_v29.webp': '43260-vaianas-skoj-pa-on',
  '43260_Lifestyle_Cons_crop.webp': '43260-vaianas-skoj-pa-on',
  '43260_Lifestyle_Envr_crop.webp': '43260-vaianas-skoj-pa-on',
  '43260_Prod.webp': '43260-vaianas-skoj-pa-on',
  '43260_boxprod_v29_sha.webp': '43260-vaianas-skoj-pa-on',

  // Product: 43261-encanto-minihus
  '43261_Box1_v29.webp': '43261-encanto-minihus',
  '43261_Lifestyle_Cons_crop.webp': '43261-encanto-minihus',
  '43261_Lifestyle_Envr_crop.webp': '43261-encanto-minihus',
  '43261_Prod.webp': '43261-encanto-minihus',
  '43261_boxprod_v29_sha.webp': '43261-encanto-minihus',

  // Product: 43262-maleficents-och-cruella-de-vils-klanningar
  '43262_Box1_v29.webp': '43262-maleficents-och-cruella-de-vils-klanningar',
  '43262_Lifestyle_cons_crop.webp': '43262-maleficents-och-cruella-de-vils-klanningar',
  '43262_Lifestyle_envr_crop.webp': '43262-maleficents-och-cruella-de-vils-klanningar',
  '43262_Prod.webp': '43262-maleficents-och-cruella-de-vils-klanningar',
  '43262_boxprod_v29_sha.webp': '43262-maleficents-och-cruella-de-vils-klanningar',

  // Product: 43264-toy-story-kalastag-och-bilen-rc
  '43264_Box1_v29.webp': '43264-toy-story-kalastag-och-bilen-rc',
  '43264_Lifestyle_Cons_crop.webp': '43264-toy-story-kalastag-och-bilen-rc',
  '43264_Lifestyle_Envr_crop.webp': '43264-toy-story-kalastag-och-bilen-rc',
  '43264_Prod.webp': '43264-toy-story-kalastag-och-bilen-rc',
  '43264_boxprod_v29_sha.webp': '43264-toy-story-kalastag-och-bilen-rc',

  // Product: 43265-slottet-i-arendal
  '43265_Box1_v29.webp': '43265-slottet-i-arendal',
  '43265_Lifestyle_Cons_crop.webp': '43265-slottet-i-arendal',
  '43265_Lifestyle_Envr_crop.webp': '43265-slottet-i-arendal',
  '43265_Prod.webp': '43265-slottet-i-arendal',
  '43265_boxprod_v29_sha.webp': '43265-slottet-i-arendal',

  // Product: 43266-askungens-klanning
  '43266_Box1_v29.webp': '43266-askungens-klanning',
  '43266_Lifestyle_cons_crop.webp': '43266-askungens-klanning',
  '43266_Lifestyle_envr_crop.webp': '43266-askungens-klanning',
  '43266_Prod.webp': '43266-askungens-klanning',
  '43266_boxprod_v29_sha.webp': '43266-askungens-klanning',

  // Product: 43267-prinsesslott-och-kungliga-husdjur
  '43267_Box1_v29.webp': '43267-prinsesslott-och-kungliga-husdjur',
  '43267_Lifestyle_Cons_crop.webp': '43267-prinsesslott-och-kungliga-husdjur',
  '43267_Lifestyle_Envr_crop.webp': '43267-prinsesslott-och-kungliga-husdjur',
  '43267_Prod.webp': '43267-prinsesslott-och-kungliga-husdjur',
  '43267_boxprod_v29_sha.webp': '43267-prinsesslott-och-kungliga-husdjur',

  // Product: 43268-lilo-och-stitch-strandhus
  '43268_Box1_v29.webp': '43268-lilo-och-stitch-strandhus',
  '43268_Lifestyle_cons_crop.webp': '43268-lilo-och-stitch-strandhus',
  '43268_Lifestyle_envr_crop.webp': '43268-lilo-och-stitch-strandhus',
  '43268_Prod.webp': '43268-lilo-och-stitch-strandhus',
  '43268_boxprod_v29_sha.webp': '43268-lilo-och-stitch-strandhus',

  // Product: 43269-101-dalmatiner-valp
  '43269_Box1_v29.webp': '43269-101-dalmatiner-valp',
  '43269_Lifestyle_Cons_crop.webp': '43269-101-dalmatiner-valp',
  '43269_Lifestyle_Envr_crop.webp': '43269-101-dalmatiner-valp',
  '43269_Prod.webp': '43269-101-dalmatiner-valp',
  '43269_boxprod_v29_sha.webp': '43269-101-dalmatiner-valp',

  // Product: 43270-vaianas-aventyrskanot
  '43270_Box1_v29.webp': '43270-vaianas-aventyrskanot',
  '43270_Lifestyle_Cons_crop.webp': '43270-vaianas-aventyrskanot',
  '43270_Lifestyle_Envr_crop.webp': '43270-vaianas-aventyrskanot',
  '43270_Prod.webp': '43270-vaianas-aventyrskanot',
  '43270_boxprod_v29_sha.webp': '43270-vaianas-aventyrskanot',

  // Product: 43271-101-dalmatiner-lucky-och-penny
  '43271_Box1_v29.webp': '43271-101-dalmatiner-lucky-och-penny',
  '43271_Lifestyle_Cons_crop.webp': '43271-101-dalmatiner-lucky-och-penny',
  '43271_Lifestyle_Envr_crop.webp': '43271-101-dalmatiner-lucky-och-penny',
  '43271_Prod.webp': '43271-101-dalmatiner-lucky-och-penny',
  '43271_boxprod_v29_sha.webp': '43271-101-dalmatiner-lucky-och-penny',

  // Product: 43272-heihei
  '43272_Box1_v29.webp': '43272-heihei',
  '43272_Lifestyle_cons_crop.webp': '43272-heihei',
  '43272_Lifestyle_envr_crop.webp': '43272-heihei',
  '43272_Prod.webp': '43272-heihei',
  '43272_boxprod_v29_sha.webp': '43272-heihei',

  // Product: 43273-adventskalender-2025
  '43273_Box1_v29.webp': '43273-adventskalender-2025',
  '43273_Lifestyle_Cons_crop.webp': '43273-adventskalender-2025',
  '43273_Lifestyle_Envr_crop.webp': '43273-adventskalender-2025',
  '43273_Prod.webp': '43273-adventskalender-2025',
  '43273_boxprod_v29_sha.webp': '43273-adventskalender-2025',

  // Product: 43274-mimmis-djurhotell
  '43274_Box1_v29.webp': '43274-mimmis-djurhotell',
  '43274_Lifestyle_Cons_crop.webp': '43274-mimmis-djurhotell',
  '43274_Lifestyle_Envr_crop.webp': '43274-mimmis-djurhotell',
  '43274_Prod.webp': '43274-mimmis-djurhotell',
  '43274_boxprod_v29_sha.webp': '43274-mimmis-djurhotell',

  // Product: 43275-askungens-slott-och-hast-med-vagn
  '43275_Box1_v29.webp': '43275-askungens-slott-och-hast-med-vagn',
  '43275_Lifestyle_Cons_crop.webp': '43275-askungens-slott-och-hast-med-vagn',
  '43275_Lifestyle_Envr_crop.webp': '43275-askungens-slott-och-hast-med-vagn',
  '43275_Prod.webp': '43275-askungens-slott-och-hast-med-vagn',
  '43275_boxprod_v29_sha.webp': '43275-askungens-slott-och-hast-med-vagn',

  // Product: 43276-snovits-smyckeskrin
  '43276_Box1_v29.webp': '43276-snovits-smyckeskrin',
  '43276_Lifestyle_cons_crop.webp': '43276-snovits-smyckeskrin',
  '43276_Lifestyle_envr_crop.webp': '43276-snovits-smyckeskrin',
  '43276_Prod.webp': '43276-snovits-smyckeskrin',
  '43276_boxprod_v29_sha.webp': '43276-snovits-smyckeskrin',

  // Product: 43279-wall-e-och-eva
  '43279_Box1_v29.webp': '43279-wall-e-och-eva',
  '43279_Lifestyle_Cons_crop.webp': '43279-wall-e-och-eva',
  '43279_Lifestyle_Envr_crop.webp': '43279-wall-e-och-eva',
  '43279_Prod.webp': '43279-wall-e-och-eva',
  '43279_boxprod_v29_sha.webp': '43279-wall-e-och-eva',

  // Product: 60198-godstag
  '60198_Box1_v29.webp': '60198-godstag',
  '60198_Prod.webp': '60198-godstag',

  // Product: 60205-spar
  '60205_Box1_v29.webp': '60205-spar',
  '60205_Prod.webp': '60205-spar',

  // Product: 60238-vaxlar
  '60238_Box1_v29.webp': '60238-vaxlar',
  '60238_prod.webp': '60238-vaxlar',

  // Product: 60304-vagplattor
  '60304_Box1_v29.webp': '60304-vagplattor',
  '60304_Lifestyle_cons_crop.webp': '60304-vagplattor',
  '60304_Lifestyle_envr_crop.webp': '60304-vagplattor',
  '60304_Prod.webp': '60304-vagplattor',

  // Product: 60312-polisbil
  '60312_Box1_v29.webp': '60312-polisbil',
  '60312_Lifestyle_cons_crop.webp': '60312-polisbil',
  '60312_Lifestyle_envr_crop.webp': '60312-polisbil',
  '60312_Prod.webp': '60312-polisbil',
  '60312_boxprod_v29.webp': '60312-polisbil',

  // Product: 60316-polisstation
  '60316_Box1_v29.webp': '60316-polisstation',
  '60316_Lifestyle_cons_crop.webp': '60316-polisstation',
  '60316_Lifestyle_envr_crop.webp': '60316-polisstation',
  '60316_Prod.webp': '60316-polisstation',
  '60316_boxprod_v29.webp': '60316-polisstation',

  // Product: 60337-snabbtag
  '60337_Box1_v29.webp': '60337-snabbtag',
  '60337_Lifestyle_cons_crop.webp': '60337-snabbtag',
  '60337_Lifestyle_envr_crop.webp': '60337-snabbtag',
  '60337_Prod.webp': '60337-snabbtag',
  '60337_boxprod_v29.webp': '60337-snabbtag',

  // Product: 60367-passagerarplan
  '60367_Box1_v29.webp': '60367-passagerarplan',
  '60367_Lifestyle_Cons_crop.webp': '60367-passagerarplan',
  '60367_Lifestyle_Envr_crop.webp': '60367-passagerarplan',
  '60367_Prod.webp': '60367-passagerarplan',
  '60367_boxprod_v29.webp': '60367-passagerarplan',

  // Product: 60368-polarutforskare-och-skepp
  '60368_Box1_v29.webp': '60368-polarutforskare-och-skepp',
  '60368_Lifestyle_Cons_crop.webp': '60368-polarutforskare-och-skepp',
  '60368_Lifestyle_Envr_crop.webp': '60368-polarutforskare-och-skepp',
  '60368_Prod.webp': '60368-polarutforskare-och-skepp',
  '60368_boxprod_v29.webp': '60368-polarutforskare-och-skepp',

  // Product: 60369-polisens-mobila-hundtraning
  '60369_Box1_v29.webp': '60369-polisens-mobila-hundtraning',
  '60369_Lifestyle_Cons_crop.webp': '60369-polisens-mobila-hundtraning',
  '60369_Lifestyle_Envr_crop.webp': '60369-polisens-mobila-hundtraning',
  '60369_Prod.webp': '60369-polisens-mobila-hundtraning',
  '60369_boxprod_v29.webp': '60369-polisens-mobila-hundtraning',

  // Product: 60373-brandraddningsbat
  '60373_Box1_v29.webp': '60373-brandraddningsbat',
  '60373_Lifestyle_Cons_crop.webp': '60373-brandraddningsbat',
  '60373_Lifestyle_Envr_crop.webp': '60373-brandraddningsbat',
  '60373_Prod.webp': '60373-brandraddningsbat',
  '60373_boxprod_v29.webp': '60373-brandraddningsbat',

  // Product: 60374-brandchefens-bil
  '60374_Box1_v29.webp': '60374-brandchefens-bil',
  '60374_Lifestyle_Cons_crop.webp': '60374-brandchefens-bil',
  '60374_Lifestyle_Envr_crop.webp': '60374-brandchefens-bil',
  '60374_Prod.webp': '60374-brandchefens-bil',
  '60374_boxprod_v29.webp': '60374-brandchefens-bil',

  // Product: 60391-byggfordon-och-kran-med-rivningskula
  '60391_Box1_v29.webp': '60391-byggfordon-och-kran-med-rivningskula',
  '60391_Lifestyle_Cons_crop.webp': '60391-byggfordon-och-kran-med-rivningskula',
  '60391_Lifestyle_Envr_crop.webp': '60391-byggfordon-och-kran-med-rivningskula',
  '60391_Prod.webp': '60391-byggfordon-och-kran-med-rivningskula',
  '60391_boxprod_v29.webp': '60391-byggfordon-och-kran-med-rivningskula',

  // Product: 60400-gokarter-och-racerforare
  '60400_Box1_v29.webp': '60400-gokarter-och-racerforare',
  '60400_Lifestyle_Cons_crop.webp': '60400-gokarter-och-racerforare',
  '60400_Lifestyle_Envr_crop.webp': '60400-gokarter-och-racerforare',
  '60400_Prod.webp': '60400-gokarter-och-racerforare',
  '60400_boxprod_v29.webp': '60400-gokarter-och-racerforare',

  // Product: 60401-angvalt
  '60401_Box1_v29.webp': '60401-angvalt',
  '60401_Lifestyle_Cons_crop.webp': '60401-angvalt',
  '60401_Lifestyle_Envr_crop.webp': '60401-angvalt',
  '60401_Prod.webp': '60401-angvalt',
  '60401_boxprod_v29.webp': '60401-angvalt',

  // Product: 60402-bla-monstertruck
  '60402_Box1_v29.webp': '60402-bla-monstertruck',
  '60402_Lifestyle_Cons_crop.webp': '60402-bla-monstertruck',
  '60402_Lifestyle_Envr_crop.webp': '60402-bla-monstertruck',
  '60402_Prod.webp': '60402-bla-monstertruck',
  '60402_boxprod_v29.webp': '60402-bla-monstertruck',

  // Product: 60404-hamburgerbil
  '60404_Box1_v29.webp': '60404-hamburgerbil',
  '60404_Lifestyle_Cons_crop.webp': '60404-hamburgerbil',
  '60404_Lifestyle_Envr_crop.webp': '60404-hamburgerbil',
  '60404_Prod.webp': '60404-hamburgerbil',
  '60404_boxprod_v29.webp': '60404-hamburgerbil',

  // Product: 60406-racerbil-och-biltransport
  '60406_Box1_v29.webp': '60406-racerbil-och-biltransport',
  '60406_Lifestyle_Cons_crop.webp': '60406-racerbil-och-biltransport',
  '60406_Lifestyle_Envr_crop.webp': '60406-racerbil-och-biltransport',
  '60406_Prod.webp': '60406-racerbil-och-biltransport',
  '60406_boxprod_v29.webp': '60406-racerbil-och-biltransport',

  // Product: 60407-rod-dubbeldackare-for-sightseeing
  '60407_Box1_v29.webp': '60407-rod-dubbeldackare-for-sightseeing',
  '60407_Lifestyle_Cons_crop.webp': '60407-rod-dubbeldackare-for-sightseeing',
  '60407_Lifestyle_Envr_crop.webp': '60407-rod-dubbeldackare-for-sightseeing',
  '60407_Prod.webp': '60407-rod-dubbeldackare-for-sightseeing',
  '60407_boxprod_v29_sha.webp': '60407-rod-dubbeldackare-for-sightseeing',

  // Product: 60408-biltransport-med-sportbilar
  '60408_Box1_v29.webp': '60408-biltransport-med-sportbilar',
  '60408_Lifestyle_Cons_crop.webp': '60408-biltransport-med-sportbilar',
  '60408_Lifestyle_Envr_crop.webp': '60408-biltransport-med-sportbilar',
  '60408_Prod.webp': '60408-biltransport-med-sportbilar',
  '60408_boxprod_v29_sha.webp': '60408-biltransport-med-sportbilar',

  // Product: 60409-gul-mobil-byggkran
  '60409_Box1_v29.webp': '60409-gul-mobil-byggkran',
  '60409_Lifestyle_Cons_crop.webp': '60409-gul-mobil-byggkran',
  '60409_Lifestyle_Envr_crop.webp': '60409-gul-mobil-byggkran',
  '60409_Prod.webp': '60409-gul-mobil-byggkran',
  '60409_boxprod_v29_sha.webp': '60409-gul-mobil-byggkran',

  // Product: 60411-brandraddningshelikopter
  '60411_Box1_v29.webp': '60411-brandraddningshelikopter',
  '60411_Lifestyle_Cons_crop.webp': '60411-brandraddningshelikopter',
  '60411_Lifestyle_Envr_crop.webp': '60411-brandraddningshelikopter',
  '60411_Prod.webp': '60411-brandraddningshelikopter',
  '60411_boxprod_v29.webp': '60411-brandraddningshelikopter',

  // Product: 60412-4x4-brandbil-med-raddningsbat
  '60412_Box1_v29.webp': '60412-4x4-brandbil-med-raddningsbat',
  '60412_Lifestyle_Cons_crop.webp': '60412-4x4-brandbil-med-raddningsbat',
  '60412_Lifestyle_Envr_crop.webp': '60412-4x4-brandbil-med-raddningsbat',
  '60412_Prod.webp': '60412-4x4-brandbil-med-raddningsbat',
  '60412_boxprod_v29.webp': '60412-4x4-brandbil-med-raddningsbat',

  // Product: 60413-brandraddningsplan
  '60413_Box1_v29.webp': '60413-brandraddningsplan',
  '60413_Lifestyle_Cons_crop.webp': '60413-brandraddningsplan',
  '60413_Lifestyle_Envr_crop.webp': '60413-brandraddningsplan',
  '60413_Prod.webp': '60413-brandraddningsplan',
  '60413_boxprod_v29.webp': '60413-brandraddningsplan',

  // Product: 60414-brandstation-med-brandbil
  '60414_Box1_v29.webp': '60414-brandstation-med-brandbil',
  '60414_Lifestyle_Cons_crop.webp': '60414-brandstation-med-brandbil',
  '60414_Lifestyle_Envr_crop.webp': '60414-brandstation-med-brandbil',
  '60414_Prod.webp': '60414-brandstation-med-brandbil',
  '60414_boxprod_v29.webp': '60414-brandstation-med-brandbil',

  // Product: 60415-jakt-med-polisbil-och-muskelbil
  '60415_Box1_v29.webp': '60415-jakt-med-polisbil-och-muskelbil',
  '60415_Lifestyle_Cons_crop.webp': '60415-jakt-med-polisbil-och-muskelbil',
  '60415_Lifestyle_Envr_crop.webp': '60415-jakt-med-polisbil-och-muskelbil',
  '60415_Prod.webp': '60415-jakt-med-polisbil-och-muskelbil',
  '60415_boxprod_v29.webp': '60415-jakt-med-polisbil-och-muskelbil',

  // Product: 60418-polisens-mobila-laboratoriebil
  '60418_Box1_v29.webp': '60418-polisens-mobila-laboratoriebil',
  '60418_Lifestyle_Cons_crop.webp': '60418-polisens-mobila-laboratoriebil',
  '60418_Lifestyle_Envr_crop.webp': '60418-polisens-mobila-laboratoriebil',
  '60418_Prod.webp': '60418-polisens-mobila-laboratoriebil',
  '60418_boxprod_v29.webp': '60418-polisens-mobila-laboratoriebil',

  // Product: 60419-polisens-fangelseo
  '60419_Box1_v29.webp': '60419-polisens-fangelseo',
  '60419_Lifestyle_Cons_crop.webp': '60419-polisens-fangelseo',
  '60419_Lifestyle_Envr_crop.webp': '60419-polisens-fangelseo',
  '60419_Prod.webp': '60419-polisens-fangelseo',
  '60419_boxprod_v29.webp': '60419-polisens-fangelseo',

  // Product: 60420-gul-gravmaskin
  '60420_Box1_v29.webp': '60420-gul-gravmaskin',
  '60420_Lifestyle_Cons_crop.webp': '60420-gul-gravmaskin',
  '60420_Lifestyle_Envr_crop.webp': '60420-gul-gravmaskin',
  '60420_Prod.webp': '60420-gul-gravmaskin',
  '60420_boxprod_v29_sha.webp': '60420-gul-gravmaskin',

  // Product: 60421-robot-world-bergochdalbanepark
  '60421_Box1_v29.webp': '60421-robot-world-bergochdalbanepark',
  '60421_Lifestyle_cons_crop.webp': '60421-robot-world-bergochdalbanepark',
  '60421_Lifestyle_envr_crop.webp': '60421-robot-world-bergochdalbanepark',
  '60421_Prod.webp': '60421-robot-world-bergochdalbanepark',
  '60421_boxprod_v29_sha.webp': '60421-robot-world-bergochdalbanepark',

  // Product: 60422-kusthamn-med-lastfartyg
  '60422_Box1_v29.webp': '60422-kusthamn-med-lastfartyg',
  '60422_Lifestyle_Cons_crop.webp': '60422-kusthamn-med-lastfartyg',
  '60422_Lifestyle_Envr_crop.webp': '60422-kusthamn-med-lastfartyg',
  '60422_Prod.webp': '60422-kusthamn-med-lastfartyg',
  '60422_boxprod_v29_sha.webp': '60422-kusthamn-med-lastfartyg',

  // Product: 60423-sparvagn-och-station
  '60423_Box1_v29.webp': '60423-sparvagn-och-station',
  '60423_Lifestyle_cons_crop.webp': '60423-sparvagn-och-station',
  '60423_Lifestyle_envr_crop.webp': '60423-sparvagn-och-station',
  '60423_Prod.webp': '60423-sparvagn-och-station',
  '60423_boxprod_v29_sha.webp': '60423-sparvagn-och-station',

  // Product: 60426-djungelterrangbil
  '60426_Box1_v29.webp': '60426-djungelterrangbil',
  '60426_Lifestyle_Cons_crop.webp': '60426-djungelterrangbil',
  '60426_Lifestyle_Envr_crop.webp': '60426-djungelterrangbil',
  '60426_Prod.webp': '60426-djungelterrangbil',
  '60426_boxprod_v29_sha.webp': '60426-djungelterrangbil',

  // Product: 60429-rymdskepp-och-asteroidupptackt
  '60429_Box1_v29.webp': '60429-rymdskepp-och-asteroidupptackt',
  '60429_Lifestyle_Cons_crop.webp': '60429-rymdskepp-och-asteroidupptackt',
  '60429_Lifestyle_Envr_crop.webp': '60429-rymdskepp-och-asteroidupptackt',
  '60429_Prod.webp': '60429-rymdskepp-och-asteroidupptackt',
  '60429_boxprod_v29.webp': '60429-rymdskepp-och-asteroidupptackt',

  // Product: 60430-intergalaktiskt-rymdskepp
  '60430_Box1_v29.webp': '60430-intergalaktiskt-rymdskepp',
  '60430_Lifestyle_Cons_crop.webp': '60430-intergalaktiskt-rymdskepp',
  '60430_Lifestyle_Envr_crop.webp': '60430-intergalaktiskt-rymdskepp',
  '60430_Prod.webp': '60430-intergalaktiskt-rymdskepp',
  '60430_boxprod_v29.webp': '60430-intergalaktiskt-rymdskepp',

  // Product: 60431-rymdrover-och-utomjordiskt-liv
  '60431_Box1_v29.webp': '60431-rymdrover-och-utomjordiskt-liv',
  '60431_Lifestyle_Cons_crop.webp': '60431-rymdrover-och-utomjordiskt-liv',
  '60431_Lifestyle_Envr_crop.webp': '60431-rymdrover-och-utomjordiskt-liv',
  '60431_Prod.webp': '60431-rymdrover-och-utomjordiskt-liv',
  '60431_boxprod_v29.webp': '60431-rymdrover-och-utomjordiskt-liv',

  // Product: 60434-rymdbas-och-raketuppskjutningsramp
  '60434_Box1_v29.webp': '60434-rymdbas-och-raketuppskjutningsramp',
  '60434_Lifestyle_Cons_crop.webp': '60434-rymdbas-och-raketuppskjutningsramp',
  '60434_Lifestyle_Envr_crop.webp': '60434-rymdbas-och-raketuppskjutningsramp',
  '60434_Prod.webp': '60434-rymdbas-och-raketuppskjutningsramp',
  '60434_boxprod_v29.webp': '60434-rymdbas-och-raketuppskjutningsramp',

  // Product: 60435-bargningsbil-och-sportbilsreparation
  '60435_Box1_v29.webp': '60435-bargningsbil-och-sportbilsreparation',
  '60435_Lifestyle_Cons_crop.webp': '60435-bargningsbil-och-sportbilsreparation',
  '60435_Lifestyle_Envr_crop.webp': '60435-bargningsbil-och-sportbilsreparation',
  '60435_Prod.webp': '60435-bargningsbil-och-sportbilsreparation',
  '60435_boxprod_v29_sha.webp': '60435-bargningsbil-och-sportbilsreparation',

  // Product: 60437-djungelhelikopter-och-baslager
  '60437_Box1_v29.webp': '60437-djungelhelikopter-och-baslager',
  '60437_Lifestyle_cons_crop.webp': '60437-djungelhelikopter-och-baslager',
  '60437_Lifestyle_envr_crop.webp': '60437-djungelhelikopter-och-baslager',
  '60437_Prod.webp': '60437-djungelhelikopter-och-baslager',
  '60437_boxprod_v29_sha.webp': '60437-djungelhelikopter-och-baslager',

  // Product: 60442-f1®-forare-med-mclaren-racerbil
  '60442_Box1_v29.webp': '60442-f1®-forare-med-mclaren-racerbil',
  '60442_Lifestyle_cons_crop.webp': '60442-f1®-forare-med-mclaren-racerbil',
  '60442_Lifestyle_envr_crop.webp': '60442-f1®-forare-med-mclaren-racerbil',
  '60442_Prod.webp': '60442-f1®-forare-med-mclaren-racerbil',
  '60442_boxprod_v29_sha.webp': '60442-f1®-forare-med-mclaren-racerbil',

  // Product: 60443-f1®-depastopp-depateam-med-ferrari-bil
  '60443_Box1_v29.webp': '60443-f1®-depastopp-depateam-med-ferrari-bil',
  '60443_Lifestyle_cons_crop.webp': '60443-f1®-depastopp-depateam-med-ferrari-bil',
  '60443_Lifestyle_envr_crop.webp': '60443-f1®-depastopp-depateam-med-ferrari-bil',
  '60443_Prod.webp': '60443-f1®-depastopp-depateam-med-ferrari-bil',
  '60443_boxprod_v29_sha.webp': '60443-f1®-depastopp-depateam-med-ferrari-bil',

  // Product: 60444-f1®-garage-mercedes-amg-alpine-bilar
  '60444_Box1_v29.webp': '60444-f1®-garage-mercedes-amg-alpine-bilar',
  '60444_Lifestyle_cons_crop.webp': '60444-f1®-garage-mercedes-amg-alpine-bilar',
  '60444_Lifestyle_envr_crop.webp': '60444-f1®-garage-mercedes-amg-alpine-bilar',
  '60444_Prod.webp': '60444-f1®-garage-mercedes-amg-alpine-bilar',
  '60444_boxprod_v29_sha.webp': '60444-f1®-garage-mercedes-amg-alpine-bilar',

  // Product: 60445-f1®-lastbil-med-rb20-amr24-f1®-bilar
  '60445_Box1_v29.webp': '60445-f1®-lastbil-med-rb20-amr24-f1®-bilar',
  '60445_Lifestyle_cons_crop.webp': '60445-f1®-lastbil-med-rb20-amr24-f1®-bilar',
  '60445_Lifestyle_envr_crop.webp': '60445-f1®-lastbil-med-rb20-amr24-f1®-bilar',
  '60445_Prod.webp': '60445-f1®-lastbil-med-rb20-amr24-f1®-bilar',
  '60445_boxprod_v29_sha.webp': '60445-f1®-lastbil-med-rb20-amr24-f1®-bilar',

  // Product: 60447-4-hjulsdriven-terrangbil-for-bergskorning
  '60447_Box1_v29.webp': '60447-4-hjulsdriven-terrangbil-for-bergskorning',
  '60447_Lifestyle_cons_crop.webp': '60447-4-hjulsdriven-terrangbil-for-bergskorning',
  '60447_Lifestyle_envr_crop.webp': '60447-4-hjulsdriven-terrangbil-for-bergskorning',
  '60447_Prod.webp': '60447-4-hjulsdriven-terrangbil-for-bergskorning',
  '60447_boxprod_v29_sha.webp': '60447-4-hjulsdriven-terrangbil-for-bergskorning',

  // Product: 60448-rod-sportbil
  '60448_Box1_v29.webp': '60448-rod-sportbil',
  '60448_Lifestyle_Cons_crop.webp': '60448-rod-sportbil',
  '60448_Lifestyle_Envr_crop.webp': '60448-rod-sportbil',
  '60448_Prod.webp': '60448-rod-sportbil',
  '60448_boxprod_v29_sha.webp': '60448-rod-sportbil',

  // Product: 60450-gul-hjullastare
  '60450_Box1_v29.webp': '60450-gul-hjullastare',
  '60450_Lifestyle_Cons_crop.webp': '60450-gul-hjullastare',
  '60450_Lifestyle_Envr_crop.webp': '60450-gul-hjullastare',
  '60450_Prod.webp': '60450-gul-hjullastare',
  '60450_boxprod_v29_sha.webp': '60450-gul-hjullastare',

  // Product: 60451-akutambulans
  '60451_Box1_v29.webp': '60451-akutambulans',
  '60451_Lifestyle_Cons_crop.webp': '60451-akutambulans',
  '60451_Lifestyle_Envr_crop.webp': '60451-akutambulans',
  '60451_Prod.webp': '60451-akutambulans',
  '60451_boxprod_v29_sha.webp': '60451-akutambulans',

  // Product: 60452-munkbil
  '60452_Box1_v29.webp': '60452-munkbil',
  '60452_Lifestyle_Cons_crop.webp': '60452-munkbil',
  '60452_Lifestyle_Envr_crop.webp': '60452-munkbil',
  '60452_Prod.webp': '60452-munkbil',
  '60452_boxprod_v29_sha.webp': '60452-munkbil',

  // Product: 60453-strandraddning-med-livraddarbil
  '60453_Box1_v29.webp': '60453-strandraddning-med-livraddarbil',
  '60453_Lifestyle_Cons_crop.webp': '60453-strandraddning-med-livraddarbil',
  '60453_Lifestyle_Envr_crop.webp': '60453-strandraddning-med-livraddarbil',
  '60453_Prod.webp': '60453-strandraddning-med-livraddarbil',
  '60453_boxprod_v29_sha.webp': '60453-strandraddning-med-livraddarbil',

  // Product: 60454-semesteraventyr-med-husbil
  '60454_Box1_v29.webp': '60454-semesteraventyr-med-husbil',
  '60454_Lifestyle_cons_crop.webp': '60454-semesteraventyr-med-husbil',
  '60454_Lifestyle_envr_crop.webp': '60454-semesteraventyr-med-husbil',
  '60454_Prod.webp': '60454-semesteraventyr-med-husbil',
  '60454_boxprod_v29_sha.webp': '60454-semesteraventyr-med-husbil',

  // Product: 60455-polisens-motorcykeljakt
  '60455_Box1_v29.webp': '60455-polisens-motorcykeljakt',
  '60455_Lifestyle_Cons_crop.webp': '60455-polisens-motorcykeljakt',
  '60455_Lifestyle_Envr_crop.webp': '60455-polisens-motorcykeljakt',
  '60455_Prod.webp': '60455-polisens-motorcykeljakt',
  '60455_boxprod_v29_sha.webp': '60455-polisens-motorcykeljakt',

  // Product: 60456-polisens-batjakt
  '60456_Box1_v29.webp': '60456-polisens-batjakt',
  '60456_Lifestyle_Cons_crop.webp': '60456-polisens-batjakt',
  '60456_Lifestyle_Envr_crop.webp': '60456-polisens-batjakt',
  '60456_Prod.webp': '60456-polisens-batjakt',
  '60456_boxprod_v29_sha.webp': '60456-polisens-batjakt',

  // Product: 60458-pizzabil-mot-brandbil-racingpaket
  '60458_Box1_v29.webp': '60458-pizzabil-mot-brandbil-racingpaket',
  '60458_Lifestyle_Cons_crop.webp': '60458-pizzabil-mot-brandbil-racingpaket',
  '60458_Lifestyle_Envr_crop.webp': '60458-pizzabil-mot-brandbil-racingpaket',
  '60458_Prod.webp': '60458-pizzabil-mot-brandbil-racingpaket',
  '60458_boxprod_v29_sha.webp': '60458-pizzabil-mot-brandbil-racingpaket',

  // Product: 60459-flygplan-mot-sjukhussang-racingpaket
  '60459_Box1_v29.webp': '60459-flygplan-mot-sjukhussang-racingpaket',
  '60459_Lifestyle_Cons_crop.webp': '60459-flygplan-mot-sjukhussang-racingpaket',
  '60459_Lifestyle_Envr_crop.webp': '60459-flygplan-mot-sjukhussang-racingpaket',
  '60459_Prod.webp': '60459-flygplan-mot-sjukhussang-racingpaket',
  '60459_boxprod_v29_sha.webp': '60459-flygplan-mot-sjukhussang-racingpaket',

  // Product: 60460-inga-granser-racerbilsramper
  '60460_Box1_v29.webp': '60460-inga-granser-racerbilsramper',
  '60460_Lifestyle_cons_crop.webp': '60460-inga-granser-racerbilsramper',
  '60460_Lifestyle_envr_crop.webp': '60460-inga-granser-racerbilsramper',
  '60460_Prod.webp': '60460-inga-granser-racerbilsramper',
  '60460_boxprod_v29_sha.webp': '60460-inga-granser-racerbilsramper',

  // Product: 60461-rod-jordbrukstraktor-med-slap-och-far
  '60461_Box1_v29.webp': '60461-rod-jordbrukstraktor-med-slap-och-far',
  '60461_Lifestyle_Cons_crop.webp': '60461-rod-jordbrukstraktor-med-slap-och-far',
  '60461_Lifestyle_Envr_crop.webp': '60461-rod-jordbrukstraktor-med-slap-och-far',
  '60461_Prod.webp': '60461-rod-jordbrukstraktor-med-slap-och-far',
  '60461_boxprod_v29_sha.webp': '60461-rod-jordbrukstraktor-med-slap-och-far',

  // Product: 60462-helikopter-brandbil-och-ubat
  '60462_Box1_v29.webp': '60462-helikopter-brandbil-och-ubat',
  '60462_Lifestyle_cons_crop.webp': '60462-helikopter-brandbil-och-ubat',
  '60462_Lifestyle_envr_crop.webp': '60462-helikopter-brandbil-och-ubat',
  '60462_Prod.webp': '60462-helikopter-brandbil-och-ubat',
  '60462_boxprod_v29_sha.webp': '60462-helikopter-brandbil-och-ubat',

  // Product: 60463-brandbil-med-stege
  '60463_Box1_v29.webp': '60463-brandbil-med-stege',
  '60463_Lifestyle_Cons_crop.webp': '60463-brandbil-med-stege',
  '60463_Lifestyle_Envr_crop.webp': '60463-brandbil-med-stege',
  '60463_Prod.webp': '60463-brandbil-med-stege',
  '60463_boxprod_v29_sha.webp': '60463-brandbil-med-stege',

  // Product: 60464-f1®-williams-racing-haas-f1®-racerbilar
  '60464_Box1_v29.webp': '60464-f1®-williams-racing-haas-f1®-racerbilar',
  '60464_Lifestyle_cons_crop.webp': '60464-f1®-williams-racing-haas-f1®-racerbilar',
  '60464_Lifestyle_envr_crop.webp': '60464-f1®-williams-racing-haas-f1®-racerbilar',
  '60464_Prod.webp': '60464-f1®-williams-racing-haas-f1®-racerbilar',
  '60464_boxprod_v29_sha.webp': '60464-f1®-williams-racing-haas-f1®-racerbilar',

  // Product: 60465-ambulansflygplan
  '60465_Box1_v29.webp': '60465-ambulansflygplan',
  '60465_Lifestyle_Cons_crop.webp': '60465-ambulansflygplan',
  '60465_Lifestyle_Envr_crop.webp': '60465-ambulansflygplan',
  '60465_Prod.webp': '60465-ambulansflygplan',
  '60465_boxprod_v29_sha.webp': '60465-ambulansflygplan',

  // Product: 60466-gul-bulldozer
  '60466_Box1_v29.webp': '60466-gul-bulldozer',
  '60466_Lifestyle_Cons_crop.webp': '60466-gul-bulldozer',
  '60466_Lifestyle_Envr_crop.webp': '60466-gul-bulldozer',
  '60466_Prod.webp': '60466-gul-bulldozer',
  '60466_boxprod_v29_sha.webp': '60466-gul-bulldozer',

  // Product: 60469-centralstation
  '60469_Box1_v29.webp': '60469-centralstation',
  '60469_Lifestyle_Cons_crop.webp': '60469-centralstation',
  '60469_Lifestyle_Envr_crop.webp': '60469-centralstation',
  '60469_Prod.webp': '60469-centralstation',
  '60469_boxprod_v29_sha.webp': '60469-centralstation',

  // Product: 60470-polarutforskarnas-arktiska-expresstag
  '60470_Box1_v29.webp': '60470-polarutforskarnas-arktiska-expresstag',
  '60470_Lifestyle_Cons_crop.webp': '60470-polarutforskarnas-arktiska-expresstag',
  '60470_Lifestyle_Envr_crop.webp': '60470-polarutforskarnas-arktiska-expresstag',
  '60470_Prod.webp': '60470-polarutforskarnas-arktiska-expresstag',
  '60470_boxprod_v29_sha.webp': '60470-polarutforskarnas-arktiska-expresstag',

  // Product: 60471-polarutforskarnas-laboratoriebil
  '60471_Box1_v29.webp': '60471-polarutforskarnas-laboratoriebil',
  '60471_Lifestyle_Cons_crop.webp': '60471-polarutforskarnas-laboratoriebil',
  '60471_Lifestyle_Envr_crop.webp': '60471-polarutforskarnas-laboratoriebil',
  '60471_Prod.webp': '60471-polarutforskarnas-laboratoriebil',
  '60471_boxprod_v29_sha.webp': '60471-polarutforskarnas-laboratoriebil',

  // Product: 60472-skrotupplag-med-bilar
  '60472_Box1_v29.webp': '60472-skrotupplag-med-bilar',
  '60472_Lifestyle_cons_crop.webp': '60472-skrotupplag-med-bilar',
  '60472_Lifestyle_envr_crop.webp': '60472-skrotupplag-med-bilar',
  '60472_Prod.webp': '60472-skrotupplag-med-bilar',
  '60472_boxprod_v29_sha.webp': '60472-skrotupplag-med-bilar',

  // Product: 60475-adventskalender-2025
  '60475_Box1_v29.webp': '60475-adventskalender-2025',
  '60475_Lifestyle_Cons_crop.webp': '60475-adventskalender-2025',
  '60475_Lifestyle_Envr_crop.webp': '60475-adventskalender-2025',
  '60475_Prod.webp': '60475-adventskalender-2025',
  '60475_boxprod_v29_sha.webp': '60475-adventskalender-2025',

  // Product: 71411-den-maktiga-bowser™
  '71411_Box1_V29.webp': '71411-den-maktiga-bowser™',
  '71411_Lifestyle_Cons_crop.webp': '71411-den-maktiga-bowser™',
  '71411_Lifestyle_Envr_crop.webp': '71411-den-maktiga-bowser™',
  '71411_Prod.webp': '71411-den-maktiga-bowser™',
  '71411_boxprod_v29.webp': '71411-den-maktiga-bowser™',

  // Product: 71426-piranha-plant
  '71426_Box1_v29.webp': '71426-piranha-plant',
  '71426_Lifestyle_Cons_crop.webp': '71426-piranha-plant',
  '71426_Lifestyle_Envr_crop.webp': '71426-piranha-plant',
  '71426_Prod.webp': '71426-piranha-plant',
  '71426_boxprod_v29.webp': '71426-piranha-plant',

  // Product: 71431-bowsers-muskelbil-expansionsset
  '71431_Box1_v29.webp': '71431-bowsers-muskelbil-expansionsset',
  '71431_Lifestyle_Cons_crop.webp': '71431-bowsers-muskelbil-expansionsset',
  '71431_Lifestyle_Envr_crop.webp': '71431-bowsers-muskelbil-expansionsset',
  '71431_Prod.webp': '71431-bowsers-muskelbil-expansionsset',
  '71431_boxprod_v29_sha.webp': '71431-bowsers-muskelbil-expansionsset',

  // Product: 71433-goombas-lekplats
  '71433_Box1_v29.webp': '71433-goombas-lekplats',
  '71433_Lifestyle_cons_crop.webp': '71433-goombas-lekplats',
  '71433_Lifestyle_envr_crop.webp': '71433-goombas-lekplats',
  '71433_Prod.webp': '71433-goombas-lekplats',
  '71433_boxprod_v29_sha.webp': '71433-goombas-lekplats',

  // Product: 71435-strid-med-roy-vid-peachs-slott
  '71435_Box1_v29.webp': '71435-strid-med-roy-vid-peachs-slott',
  '71435_Lifestyle_cons_crop.webp': '71435-strid-med-roy-vid-peachs-slott',
  '71435_Lifestyle_envr_crop.webp': '71435-strid-med-roy-vid-peachs-slott',
  '71435_Prod.webp': '71435-strid-med-roy-vid-peachs-slott',
  '71435_boxprod_v29_sha.webp': '71435-strid-med-roy-vid-peachs-slott',

  // Product: 71436-king-boos-hemsokta-herrgard
  '71436_Box1_v29.webp': '71436-king-boos-hemsokta-herrgard',
  '71436_Lifestyle_cons_crop.webp': '71436-king-boos-hemsokta-herrgard',
  '71436_Lifestyle_envr_crop.webp': '71436-king-boos-hemsokta-herrgard',
  '71436_Prod.webp': '71436-king-boos-hemsokta-herrgard',
  '71436_boxprod_v29_sha.webp': '71436-king-boos-hemsokta-herrgard',

  // Product: 71437-bowsers-expresstag
  '71437_Box1_v29.webp': '71437-bowsers-expresstag',
  '71437_Lifestyle_cons_crop.webp': '71437-bowsers-expresstag',
  '71437_Lifestyle_envr_crop.webp': '71437-bowsers-expresstag',
  '71437_Prod.webp': '71437-bowsers-expresstag',
  '71437_boxprod_v29_sha.webp': '71437-bowsers-expresstag',

  // Product: 71438-super-mario-world™-mario-yoshi
  '71438_Box1_v29.webp': '71438-super-mario-world™-mario-yoshi',
  '71438_Lifestyle_Cons_crop.webp': '71438-super-mario-world™-mario-yoshi',
  '71438_Lifestyle_Envr_crop.webp': '71438-super-mario-world™-mario-yoshi',
  '71438_Prod.webp': '71438-super-mario-world™-mario-yoshi',
  '71438_boxprod_v29_sha.webp': '71438-super-mario-world™-mario-yoshi',

  // Product: 71439-aventyr-med-interaktiva-lego®-mario™
  '71439_Box1_v29.webp': '71439-aventyr-med-interaktiva-lego®-mario™',
  '71439_Lifestyle_cons_crop.webp': '71439-aventyr-med-interaktiva-lego®-mario™',
  '71439_Lifestyle_envr_crop.webp': '71439-aventyr-med-interaktiva-lego®-mario™',
  '71439_Prod.webp': '71439-aventyr-med-interaktiva-lego®-mario™',
  '71439_boxprod_v29_sha.webp': '71439-aventyr-med-interaktiva-lego®-mario™',

  // Product: 71440-aventyr-med-interaktiva-lego®-luigi™
  '71440_Box1_v29.webp': '71440-aventyr-med-interaktiva-lego®-luigi™',
  '71440_Lifestyle_cons_crop.webp': '71440-aventyr-med-interaktiva-lego®-luigi™',
  '71440_Lifestyle_envr_crop.webp': '71440-aventyr-med-interaktiva-lego®-luigi™',
  '71440_Prod.webp': '71440-aventyr-med-interaktiva-lego®-luigi™',
  '71440_boxprod_v29_sha.webp': '71440-aventyr-med-interaktiva-lego®-luigi™',

  // Product: 71441-aventyr-med-interaktiva-lego®-peach™
  '71441_Box1_v29.webp': '71441-aventyr-med-interaktiva-lego®-peach™',
  '71441_Lifestyle_cons_crop.webp': '71441-aventyr-med-interaktiva-lego®-peach™',
  '71441_Lifestyle_envr_crop.webp': '71441-aventyr-med-interaktiva-lego®-peach™',
  '71441_Prod.webp': '71441-aventyr-med-interaktiva-lego®-peach™',
  '71441_boxprod_v29_sha.webp': '71441-aventyr-med-interaktiva-lego®-peach™',

  // Product: 71478-neverhaxans-midnattskorp
  '71478_Box1_v29.webp': '71478-neverhaxans-midnattskorp',
  '71478_Lifestyle_Cons_crop.webp': '71478-neverhaxans-midnattskorp',
  '71478_Lifestyle_Envr_crop.webp': '71478-neverhaxans-midnattskorp',
  '71478_Prod.webp': '71478-neverhaxans-midnattskorp',
  '71478_boxprod_v29_sha.webp': '71478-neverhaxans-midnattskorp',

  // Product: 71479-zoeys-kattmotorcykel
  '71479_Box1_v29.webp': '71479-zoeys-kattmotorcykel',
  '71479_Lifestyle_Cons_crop.webp': '71479-zoeys-kattmotorcykel',
  '71479_Lifestyle_Envr_crop.webp': '71479-zoeys-kattmotorcykel',
  '71479_Prod.webp': '71479-zoeys-kattmotorcykel',
  '71479_boxprod_v29_sha.webp': '71479-zoeys-kattmotorcykel',

  // Product: 71481-izzies-dromdjur
  '71481_Box1_v29.webp': '71481-izzies-dromdjur',
  '71481_Lifestyle_Cons_crop.webp': '71481-izzies-dromdjur',
  '71481_Lifestyle_Envr_crop.webp': '71481-izzies-dromdjur',
  '71481_Prod.webp': '71481-izzies-dromdjur',
  '71481_boxprod_v29_sha.webp': '71481-izzies-dromdjur',

  // Product: 71483-neverhaxans-mardromsvarelser
  '71483_Box1_v29.webp': '71483-neverhaxans-mardromsvarelser',
  '71483_Lifestyle_Cons_crop.webp': '71483-neverhaxans-mardromsvarelser',
  '71483_Lifestyle_Envr_crop.webp': '71483-neverhaxans-mardromsvarelser',
  '71483_Prod.webp': '71483-neverhaxans-mardromsvarelser',
  '71483_boxprod_v29_sha.webp': '71483-neverhaxans-mardromsvarelser',

  // Product: 71484-coopers-robotdinosaurie-c-rex
  '71484_Box1_v29.webp': '71484-coopers-robotdinosaurie-c-rex',
  '71484_Lifestyle_Cons_crop.webp': '71484-coopers-robotdinosaurie-c-rex',
  '71484_Lifestyle_Envr_crop.webp': '71484-coopers-robotdinosaurie-c-rex',
  '71484_Prod.webp': '71484-coopers-robotdinosaurie-c-rex',
  '71484_boxprod_v29_sha.webp': '71484-coopers-robotdinosaurie-c-rex',

  // Product: 71485-mateo-och-riddarstridsroboten-z-blob
  '71485_Box1_v29.webp': '71485-mateo-och-riddarstridsroboten-z-blob',
  '71485_Lifestyle_Cons_crop.webp': '71485-mateo-och-riddarstridsroboten-z-blob',
  '71485_Lifestyle_Envr_crop.webp': '71485-mateo-och-riddarstridsroboten-z-blob',
  '71485_Prod.webp': '71485-mateo-och-riddarstridsroboten-z-blob',
  '71485_boxprod_v29_sha.webp': '71485-mateo-och-riddarstridsroboten-z-blob',

  // Product: 71487-aventyr-med-z-blob-robot-och-fordon
  '71487_Box1_v29.webp': '71487-aventyr-med-z-blob-robot-och-fordon',
  '71487_Lifestyle_Cons_crop.webp': '71487-aventyr-med-z-blob-robot-och-fordon',
  '71487_Lifestyle_Envr_crop.webp': '71487-aventyr-med-z-blob-robot-och-fordon',
  '71487_Prod.webp': '71487-aventyr-med-z-blob-robot-och-fordon',
  '71487_boxprod_v29_sha.webp': '71487-aventyr-med-z-blob-robot-och-fordon',

  // Product: 71488-bunchus-kreativa-djuraventyr
  '71488_Box1_v29.webp': '71488-bunchus-kreativa-djuraventyr',
  '71488_Lifestyle_Cons_crop.webp': '71488-bunchus-kreativa-djuraventyr',
  '71488_Lifestyle_Envr_crop.webp': '71488-bunchus-kreativa-djuraventyr',
  '71488_Prod.webp': '71488-bunchus-kreativa-djuraventyr',
  '71488_boxprod_v29_sha.webp': '71488-bunchus-kreativa-djuraventyr',

  // Product: 71489-coopers-spelkontrollplan
  '71489_Box1_v29.webp': '71489-coopers-spelkontrollplan',
  '71489_Lifestyle_Cons_crop.webp': '71489-coopers-spelkontrollplan',
  '71489_Lifestyle_Envr_crop.webp': '71489-coopers-spelkontrollplan',
  '71489_Prod.webp': '71489-coopers-spelkontrollplan',
  '71489_boxprod_v29_sha.webp': '71489-coopers-spelkontrollplan',

  // Product: 71490-izzie-och-spelkaninen-bunchurro
  '71490_Box1_v29.webp': '71490-izzie-och-spelkaninen-bunchurro',
  '71490_Lifestyle_Cons_crop.webp': '71490-izzie-och-spelkaninen-bunchurro',
  '71490_Lifestyle_Envr_crop.webp': '71490-izzie-och-spelkaninen-bunchurro',
  '71490_Prod.webp': '71490-izzie-och-spelkaninen-bunchurro',
  '71490_boxprod_v29_sha.webp': '71490-izzie-och-spelkaninen-bunchurro',

  // Product: 71491-mateo-och-z-blob-racerbilen
  '71491_Box1_v29.webp': '71491-mateo-och-z-blob-racerbilen',
  '71491_Lifestyle_Cons_crop.webp': '71491-mateo-och-z-blob-racerbilen',
  '71491_Lifestyle_Envr_crop.webp': '71491-mateo-och-z-blob-racerbilen',
  '71491_Prod.webp': '71491-mateo-och-z-blob-racerbilen',
  '71491_boxprod_v29_sha.webp': '71491-mateo-och-z-blob-racerbilen',

  // Product: 71492-mateos-eldkameleont
  '71492_Box1_v29.webp': '71492-mateos-eldkameleont',
  '71492_Lifestyle_Cons_crop.webp': '71492-mateos-eldkameleont',
  '71492_Lifestyle_Envr_crop.webp': '71492-mateos-eldkameleont',
  '71492_Prod.webp': '71492-mateos-eldkameleont',
  '71492_boxprod_v29_sha.webp': '71492-mateos-eldkameleont',

  // Product: 71495-mateo-mot-cyberhjarnroboten
  '71495_Box1_v29.webp': '71495-mateo-mot-cyberhjarnroboten',
  '71495_Lifestyle_Cons_crop.webp': '71495-mateo-mot-cyberhjarnroboten',
  '71495_Lifestyle_Envr_crop.webp': '71495-mateo-mot-cyberhjarnroboten',
  '71495_Prod.webp': '71495-mateo-mot-cyberhjarnroboten',
  '71495_boxprod_v29_sha.webp': '71495-mateo-mot-cyberhjarnroboten',

  // Product: 71497-coopers-tigerrobot-och-zeros-hot-rod-bil
  '71497_Box1_v29.webp': '71497-coopers-tigerrobot-och-zeros-hot-rod-bil',
  '71497_Lifestyle_Cons_crop.webp': '71497-coopers-tigerrobot-och-zeros-hot-rod-bil',
  '71497_Lifestyle_Envr_crop.webp': '71497-coopers-tigerrobot-och-zeros-hot-rod-bil',
  '71497_Prod.webp': '71497-coopers-tigerrobot-och-zeros-hot-rod-bil',
  '71497_boxprod_v29_sha.webp': '71497-coopers-tigerrobot-och-zeros-hot-rod-bil',

  // Product: 71499-mateos-sprayfargsbil
  '71499_Box1_v29.webp': '71499-mateos-sprayfargsbil',
  '71499_Lifestyle_Cons_crop.webp': '71499-mateos-sprayfargsbil',
  '71499_Lifestyle_Envr_crop.webp': '71499-mateos-sprayfargsbil',
  '71499_Prod.webp': '71499-mateos-sprayfargsbil',
  '71499_boxprod_v29_sha.webp': '71499-mateos-sprayfargsbil',

  // Product: 71500-mardrommarnas-haj-ubat
  '71500_Box1_v29.webp': '71500-mardrommarnas-haj-ubat',
  '71500_Lifestyle_Cons_crop.webp': '71500-mardrommarnas-haj-ubat',
  '71500_Lifestyle_Envr_crop.webp': '71500-mardrommarnas-haj-ubat',
  '71500_Prod.webp': '71500-mardrommarnas-haj-ubat',
  '71500_boxprod_v29_sha.webp': '71500-mardrommarnas-haj-ubat',

  // Product: 71780-kais-ninjaracerbil-evo
  '71780_Box1_v29.webp': '71780-kais-ninjaracerbil-evo',
  '71780_Lifestyle_Cons_crop.webp': '71780-kais-ninjaracerbil-evo',
  '71780_Lifestyle_Envr_crop.webp': '71780-kais-ninjaracerbil-evo',
  '71780_Prod.webp': '71780-kais-ninjaracerbil-evo',
  '71780_boxprod_v29.webp': '71780-kais-ninjaracerbil-evo',

  // Product: 71804-arins-stridsrobot
  '71804_Box1_v29.webp': '71804-arins-stridsrobot',
  '71804_Lifestyle_Cons_crop.webp': '71804-arins-stridsrobot',
  '71804_Lifestyle_Envr_crop.webp': '71804-arins-stridsrobot',
  '71804_Prod.webp': '71804-arins-stridsrobot',
  '71804_boxprod_v29.webp': '71804-arins-stridsrobot',

  // Product: 71805-jays-robotstridspack
  '71805_Box1_v29.webp': '71805-jays-robotstridspack',
  '71805_Lifestyle_Cons_crop.webp': '71805-jays-robotstridspack',
  '71805_Lifestyle_Envr_crop.webp': '71805-jays-robotstridspack',
  '71805_Prod.webp': '71805-jays-robotstridspack',
  '71805_boxprod_v29.webp': '71805-jays-robotstridspack',

  // Product: 71806-coles-elementjordrobot
  '71806_Box1_v29.webp': '71806-coles-elementjordrobot',
  '71806_Lifestyle_Cons_crop.webp': '71806-coles-elementjordrobot',
  '71806_Lifestyle_Envr_crop.webp': '71806-coles-elementjordrobot',
  '71806_Prod.webp': '71806-coles-elementjordrobot',
  '71806_boxprod_v29.webp': '71806-coles-elementjordrobot',

  // Product: 71807-soras-elementteknikrobot
  '71807_Box1_v29.webp': '71807-soras-elementteknikrobot',
  '71807_Lifestyle_Cons_crop.webp': '71807-soras-elementteknikrobot',
  '71807_Lifestyle_Envr_crop.webp': '71807-soras-elementteknikrobot',
  '71807_Prod.webp': '71807-soras-elementteknikrobot',
  '71807_boxprod_v29.webp': '71807-soras-elementteknikrobot',

  // Product: 71808-kais-elementeldrobot
  '71808_Box1_v29.webp': '71808-kais-elementeldrobot',
  '71808_Lifestyle_Cons_crop.webp': '71808-kais-elementeldrobot',
  '71808_Lifestyle_Envr_crop.webp': '71808-kais-elementeldrobot',
  '71808_Prod.webp': '71808-kais-elementeldrobot',
  '71808_boxprod_v29.webp': '71808-kais-elementeldrobot',

  // Product: 71809-mastardraken-egalt
  '71809_Box1_v29.webp': '71809-mastardraken-egalt',
  '71809_Lifestyle_Cons_crop.webp': '71809-mastardraken-egalt',
  '71809_Lifestyle_Envr_crop.webp': '71809-mastardraken-egalt',
  '71809_Prod.webp': '71809-mastardraken-egalt',
  '71809_boxprod_v29.webp': '71809-mastardraken-egalt',

  // Product: 71810-drakungen-riyu
  '71810_Box1_v29.webp': '71810-drakungen-riyu',
  '71810_Lifestyle_Cons_crop.webp': '71810-drakungen-riyu',
  '71810_Lifestyle_Envr_crop.webp': '71810-drakungen-riyu',
  '71810_Prod.webp': '71810-drakungen-riyu',
  '71810_boxprod_v29.webp': '71810-drakungen-riyu',

  // Product: 71811-arins-terrangbuggy
  '71811_Box1_v29.webp': '71811-arins-terrangbuggy',
  '71811_Lifestyle_Cons_crop.webp': '71811-arins-terrangbuggy',
  '71811_Lifestyle_Envr_crop.webp': '71811-arins-terrangbuggy',
  '71811_Prod.webp': '71811-arins-terrangbuggy',
  '71811_boxprod_v29.webp': '71811-arins-terrangbuggy',

  // Product: 71812-kais-klatterrobot
  '71812_Box1_v29.webp': '71812-kais-klatterrobot',
  '71812_Lifestyle_Cons_crop.webp': '71812-kais-klatterrobot',
  '71812_Lifestyle_Envr_crop.webp': '71812-kais-klatterrobot',
  '71812_Prod.webp': '71812-kais-klatterrobot',
  '71812_boxprod_v29.webp': '71812-kais-klatterrobot',

  // Product: 71816-zanes-ismotorcykel
  '71816_Box1_v29.webp': '71816-zanes-ismotorcykel',
  '71816_Lifestyle_Cons_crop.webp': '71816-zanes-ismotorcykel',
  '71816_Lifestyle_Envr_crop.webp': '71816-zanes-ismotorcykel',
  '71816_Prod.webp': '71816-zanes-ismotorcykel',
  '71816_boxprod_v29_sha.webp': '71816-zanes-ismotorcykel',

  // Product: 71818-turneringens-stridsarena
  '71818_Box1_v29.webp': '71818-turneringens-stridsarena',
  '71818_Lifestyle_Cons_crop.webp': '71818-turneringens-stridsarena',
  '71818_Lifestyle_Envr_crop.webp': '71818-turneringens-stridsarena',
  '71818_Prod.webp': '71818-turneringens-stridsarena',
  '71818_boxprod_v29_sha.webp': '71818-turneringens-stridsarena',

  // Product: 71819-drakstenens-tempel
  '71819_Box1_v29.webp': '71819-drakstenens-tempel',
  '71819_Lifestyle_Cons_crop.webp': '71819-drakstenens-tempel',
  '71819_Lifestyle_Envr_crop.webp': '71819-drakstenens-tempel',
  '71819_Prod.webp': '71819-drakstenens-tempel',
  '71819_boxprod_v29.webp': '71819-drakstenens-tempel',

  // Product: 71820-ninjornas-kombofordon
  '71820_Box1_v29.webp': '71820-ninjornas-kombofordon',
  '71820_Lifestyle_Cons_crop.webp': '71820-ninjornas-kombofordon',
  '71820_Lifestyle_Envr_crop.webp': '71820-ninjornas-kombofordon',
  '71820_Prod.webp': '71820-ninjornas-kombofordon',
  '71820_boxprod_v29_sha.webp': '71820-ninjornas-kombofordon',

  // Product: 71821-coles-titandrakrobot
  '71821_Box1_v29.webp': '71821-coles-titandrakrobot',
  '71821_Lifestyle_cons_crop.webp': '71821-coles-titandrakrobot',
  '71821_Lifestyle_envr_crop.webp': '71821-coles-titandrakrobot',
  '71821_Prod.webp': '71821-coles-titandrakrobot',
  '71821_boxprod_v29_sha.webp': '71821-coles-titandrakrobot',

  // Product: 71822-rorelsens-kalldrake
  '71822_Box1_v29.webp': '71822-rorelsens-kalldrake',
  '71822_Lifestyle_Cons_crop.webp': '71822-rorelsens-kalldrake',
  '71822_Lifestyle_Envr_crop.webp': '71822-rorelsens-kalldrake',
  '71822_Prod.webp': '71822-rorelsens-kalldrake',
  '71822_boxprod_v29_sha.webp': '71822-rorelsens-kalldrake',

  // Product: 71823-kais-drakspinjitzuspinner
  '71823_Box1_v29.webp': '71823-kais-drakspinjitzuspinner',
  '71823_Lifestyle_Cons_crop.webp': '71823-kais-drakspinjitzuspinner',
  '71823_Lifestyle_Envr_crop.webp': '71823-kais-drakspinjitzuspinner',
  '71823_Prod.webp': '71823-kais-drakspinjitzuspinner',
  '71823_boxprod_v29_sha.webp': '71823-kais-drakspinjitzuspinner',

  // Product: 71824-soras-drakspinjitzuspinner
  '71824_Box1_v29.webp': '71824-soras-drakspinjitzuspinner',
  '71824_Lifestyle_Cons_crop.webp': '71824-soras-drakspinjitzuspinner',
  '71824_Lifestyle_Envr_crop.webp': '71824-soras-drakspinjitzuspinner',
  '71824_Prod.webp': '71824-soras-drakspinjitzuspinner',
  '71824_boxprod_v29_sha.webp': '71824-soras-drakspinjitzuspinner',

  // Product: 71826-drakspinjitzu-stridspaket
  '71826_Box1_v29.webp': '71826-drakspinjitzu-stridspaket',
  '71826_Lifestyle_Cons_crop.webp': '71826-drakspinjitzu-stridspaket',
  '71826_Lifestyle_Envr_crop.webp': '71826-drakspinjitzu-stridspaket',
  '71826_Prod.webp': '71826-drakspinjitzu-stridspaket',
  '71826_boxprod_v29_sha.webp': '71826-drakspinjitzu-stridspaket',

  // Product: 71827-zanes-stridsrobotdrakt
  '71827_Box1_v29.webp': '71827-zanes-stridsrobotdrakt',
  '71827_Lifestyle_Cons_crop.webp': '71827-zanes-stridsrobotdrakt',
  '71827_Lifestyle_Envr_crop.webp': '71827-zanes-stridsrobotdrakt',
  '71827_Prod.webp': '71827-zanes-stridsrobotdrakt',
  '71827_boxprod_v29_sha.webp': '71827-zanes-stridsrobotdrakt',

  // Product: 71828-lloyds-pull-back-racerbil
  '71828_Box1_v29.webp': '71828-lloyds-pull-back-racerbil',
  '71828_Lifestyle_cons_crop.webp': '71828-lloyds-pull-back-racerbil',
  '71828_Lifestyle_envr_crop.webp': '71828-lloyds-pull-back-racerbil',
  '71828_Prod.webp': '71828-lloyds-pull-back-racerbil',
  '71828_boxprod_v29_sha.webp': '71828-lloyds-pull-back-racerbil',

  // Product: 71829-lloyds-grona-skogsdrake
  '71829_Box1_v29.webp': '71829-lloyds-grona-skogsdrake',
  '71829_Lifestyle_Cons_crop.webp': '71829-lloyds-grona-skogsdrake',
  '71829_Lifestyle_Envr_crop.webp': '71829-lloyds-grona-skogsdrake',
  '71829_Prod.webp': '71829-lloyds-grona-skogsdrake',
  '71829_boxprod_v29_sha.webp': '71829-lloyds-grona-skogsdrake',

  // Product: 71830-kais-robotstormforare
  '71830_Box1_v29.webp': '71830-kais-robotstormforare',
  '71830_Lifestyle_cons_crop.webp': '71830-kais-robotstormforare',
  '71830_Lifestyle_envr_crop.webp': '71830-kais-robotstormforare',
  '71830_Prod.webp': '71830-kais-robotstormforare',
  '71830_boxprod_v29_sha.webp': '71830-kais-robotstormforare',

  // Product: 71831-ninjornas-spinjitzutempel
  '71831_Box1_v29.webp': '71831-ninjornas-spinjitzutempel',
  '71831_Lifestyle_cons_crop.webp': '71831-ninjornas-spinjitzutempel',
  '71831_Lifestyle_envr_crop.webp': '71831-ninjornas-spinjitzutempel',
  '71831_Prod.webp': '71831-ninjornas-spinjitzutempel',
  '71831_boxprod_v29_sha.webp': '71831-ninjornas-spinjitzutempel',

  // Product: 71832-kaosdraken-thunderfang
  '71832_Box1_v29.webp': '71832-kaosdraken-thunderfang',
  '71832_Lifestyle_cons_crop.webp': '71832-kaosdraken-thunderfang',
  '71832_Lifestyle_envr_crop.webp': '71832-kaosdraken-thunderfang',
  '71832_Prod.webp': '71832-kaosdraken-thunderfang',
  '71832_boxprod_v29_sha.webp': '71832-kaosdraken-thunderfang',

  // Product: 71833-ras-och-arins-superstormplan
  '71833_Box1_v29.webp': '71833-ras-och-arins-superstormplan',
  '71833_Lifestyle_cons_crop.webp': '71833-ras-och-arins-superstormplan',
  '71833_Lifestyle_envr_crop.webp': '71833-ras-och-arins-superstormplan',
  '71833_Prod.webp': '71833-ras-och-arins-superstormplan',
  '71833_boxprod_v29_sha.webp': '71833-ras-och-arins-superstormplan',

  // Product: 71834-zanes-ultrakomborobot
  '71834_Box1_v29.webp': '71834-zanes-ultrakomborobot',
  '71834_Lifestyle_cons_crop.webp': '71834-zanes-ultrakomborobot',
  '71834_Lifestyle_envr_crop.webp': '71834-zanes-ultrakomborobot',
  '71834_Prod.webp': '71834-zanes-ultrakomborobot',
  '71834_boxprod_v29_sha.webp': '71834-zanes-ultrakomborobot',

  // Product: 71836-fokusdraken-arc
  '71836_Box1_v29.webp': '71836-fokusdraken-arc',
  '71836_Lifestyle_cons_crop.webp': '71836-fokusdraken-arc',
  '71836_Lifestyle_envr_crop.webp': '71836-fokusdraken-arc',
  '71836_Prod.webp': '71836-fokusdraken-arc',
  '71836_boxprod_v29_sha.webp': '71836-fokusdraken-arc',

  // Product: 71838-kais-motorcykelrace
  '71838_Box1_v29.webp': '71838-kais-motorcykelrace',
  '71838_Lifestyle_Cons_crop.webp': '71838-kais-motorcykelrace',
  '71838_Lifestyle_Envr_crop.webp': '71838-kais-motorcykelrace',
  '71838_Prod.webp': '71838-kais-motorcykelrace',
  '71838_boxprod_v29_sha.webp': '71838-kais-motorcykelrace',

  // Product: 71839-arins-spinjitzurobot
  '71839_Box1_v29.webp': '71839-arins-spinjitzurobot',
  '71839_Lifestyle_Cons_crop.webp': '71839-arins-spinjitzurobot',
  '71839_Lifestyle_Envr_crop.webp': '71839-arins-spinjitzurobot',
  '71839_Prod.webp': '71839-arins-spinjitzurobot',
  '71839_boxprod_v29_sha.webp': '71839-arins-spinjitzurobot',

  // Product: 71842-mastardraken-rontu
  '71842_Box1_v29.webp': '71842-mastardraken-rontu',
  '71842_Lifestyle_Cons_crop.webp': '71842-mastardraken-rontu',
  '71842_Lifestyle_Envr_crop.webp': '71842-mastardraken-rontu',
  '71842_Prod.webp': '71842-mastardraken-rontu',
  '71842_boxprod_v29_sha.webp': '71842-mastardraken-rontu',

  // Product: 71843-rogues-drakryttarrobot
  '71843_Box1_v29.webp': '71843-rogues-drakryttarrobot',
  '71843_Lifestyle_Cons_crop.webp': '71843-rogues-drakryttarrobot',
  '71843_Lifestyle_Envr_crop.webp': '71843-rogues-drakryttarrobot',
  '71843_Prod.webp': '71843-rogues-drakryttarrobot',
  '71843_boxprod_v29_sha.webp': '71843-rogues-drakryttarrobot',

  // Product: 71844-ninjornas-stridsfordon
  '71844_Box1_v29.webp': '71844-ninjornas-stridsfordon',
  '71844_Lifestyle_Cons_crop.webp': '71844-ninjornas-stridsfordon',
  '71844_Lifestyle_Envr_crop.webp': '71844-ninjornas-stridsfordon',
  '71844_Prod.webp': '71844-ninjornas-stridsfordon',
  '71844_boxprod_v29_sha.webp': '71844-ninjornas-stridsfordon',

  // Product: 71845-lloyds-jetrobot
  '71845_Box1_v29.webp': '71845-lloyds-jetrobot',
  '71845_Lifestyle_Cons_crop.webp': '71845-lloyds-jetrobot',
  '71845_Lifestyle_Envr_crop.webp': '71845-lloyds-jetrobot',
  '71845_Prod.webp': '71845-lloyds-jetrobot',
  '71845_boxprod_v29_sha.webp': '71845-lloyds-jetrobot',

  // Product: 71846-eldriddarroboten
  '71846_Box1_v29.webp': '71846-eldriddarroboten',
  '71846_Lifestyle_Cons_crop.webp': '71846-eldriddarroboten',
  '71846_Lifestyle_Envr_crop.webp': '71846-eldriddarroboten',
  '71846_Prod.webp': '71846-eldriddarroboten',
  '71846_boxprod_v29_sha.webp': '71846-eldriddarroboten',

  // Product: 71847-vaktardraken
  '71847_Box1_v29.webp': '71847-vaktardraken',
  '71847_Lifestyle_Cons_crop.webp': '71847-vaktardraken',
  '71847_Lifestyle_Envr_crop.webp': '71847-vaktardraken',
  '71847_Prod.webp': '71847-vaktardraken',
  '71847_boxprod_v29_sha.webp': '71847-vaktardraken',

  // Product: 71848-templets-gava
  '71848_Box1_v29.webp': '71848-templets-gava',
  '71848_Lifestyle_Cons_crop.webp': '71848-templets-gava',
  '71848_Lifestyle_Envr_crop.webp': '71848-templets-gava',
  '71848_Prod.webp': '71848-templets-gava',
  '71848_boxprod_v29_sha.webp': '71848-templets-gava',

  // Product: 72031-mario-kart™-yoshi-bike
  '72031_Box1_v29.webp': '72031-mario-kart™-yoshi-bike',
  '72031_Lifestyle_Cons_crop.webp': '72031-mario-kart™-yoshi-bike',
  '72031_Lifestyle_Envr_crop.webp': '72031-mario-kart™-yoshi-bike',
  '72031_Prod.webp': '72031-mario-kart™-yoshi-bike',
  '72031_boxprod_v29_sha.webp': '72031-mario-kart™-yoshi-bike',

  // Product: 72032-mario-kart™-standard-kart
  '72032_Box1_v29.webp': '72032-mario-kart™-standard-kart',
  '72032_Lifestyle_cons_crop.webp': '72032-mario-kart™-standard-kart',
  '72032_Lifestyle_envr_crop.webp': '72032-mario-kart™-standard-kart',
  '72032_Prod.webp': '72032-mario-kart™-standard-kart',
  '72032_boxprod_v29_sha.webp': '72032-mario-kart™-standard-kart',

  // Product: 72034-mario-kart™-baby-mario-mot-baby-luigi
  '72034_Box1_v29.webp': '72034-mario-kart™-baby-mario-mot-baby-luigi',
  '72034_Lifestyle_cons_crop.webp': '72034-mario-kart™-baby-mario-mot-baby-luigi',
  '72034_Lifestyle_envr_crop.webp': '72034-mario-kart™-baby-mario-mot-baby-luigi',
  '72034_Prod.webp': '72034-mario-kart™-baby-mario-mot-baby-luigi',
  '72034_boxprod_v29_sha.webp': '72034-mario-kart™-baby-mario-mot-baby-luigi',

  // Product: 72035-mario-kart™-toads-garage
  '72035_Box1_v29.webp': '72035-mario-kart™-toads-garage',
  '72035_Lifestyle_cons_crop.webp': '72035-mario-kart™-toads-garage',
  '72035_Lifestyle_envr_crop.webp': '72035-mario-kart™-toads-garage',
  '72035_Prod.webp': '72035-mario-kart™-toads-garage',
  '72035_boxprod_v29_sha.webp': '72035-mario-kart™-toads-garage',

  // Product: 72036-mario-kart™-baby-peach-grand-prix
  '72036_Box1_v29.webp': '72036-mario-kart™-baby-peach-grand-prix',
  '72036_Lifestyle_cons_crop.webp': '72036-mario-kart™-baby-peach-grand-prix',
  '72036_Lifestyle_envr_crop.webp': '72036-mario-kart™-baby-peach-grand-prix',
  '72036_Prod.webp': '72036-mario-kart™-baby-peach-grand-prix',
  '72036_boxprod_v29_sha.webp': '72036-mario-kart™-baby-peach-grand-prix',

  // Product: 72037-mario-kart™-mario-standard-kart
  '72037_Box1_v29.webp': '72037-mario-kart™-mario-standard-kart',
  '72037_Lifestyle_Cons_crop.webp': '72037-mario-kart™-mario-standard-kart',
  '72037_Lifestyle_Envr_crop.webp': '72037-mario-kart™-mario-standard-kart',
  '72037_Prod.webp': '72037-mario-kart™-mario-standard-kart',
  '72037_boxprod_v29_sha.webp': '72037-mario-kart™-mario-standard-kart',

  // Product: 72038-mario-kart™-wario-king-boo
  '72038_Box1_v29.webp': '72038-mario-kart™-wario-king-boo',
  '72038_Lifestyle_Cons_crop.webp': '72038-mario-kart™-wario-king-boo',
  '72038_Lifestyle_Envr_crop.webp': '72038-mario-kart™-wario-king-boo',
  '72038_Prod.webp': '72038-mario-kart™-wario-king-boo',

  // Product: 72039-mario-kart™-bowsers-slott
  '72039_Box1_v29.webp': '72039-mario-kart™-bowsers-slott',
  '72039_Lifestyle_Cons_crop.webp': '72039-mario-kart™-bowsers-slott',
  '72039_Lifestyle_Envr_crop.webp': '72039-mario-kart™-bowsers-slott',
  '72039_Prod.webp': '72039-mario-kart™-bowsers-slott',

  // Product: 72040-captain-toads-lager
  '72040_Box1_v29.webp': '72040-captain-toads-lager',
  '72040_Lifestyle_Cons_crop.webp': '72040-captain-toads-lager',
  '72040_Lifestyle_Envr_crop.webp': '72040-captain-toads-lager',
  '72040_Prod.webp': '72040-captain-toads-lager',
  '72040_boxprod_v29_sha.webp': '72040-captain-toads-lager',

  // Product: 72041-kalas-i-toads-hus
  '72041_Box1_v29.webp': '72041-kalas-i-toads-hus',
  '72041_Lifestyle_Cons_crop.webp': '72041-kalas-i-toads-hus',
  '72041_Lifestyle_Envr_crop.webp': '72041-kalas-i-toads-hus',
  '72041_Prod.webp': '72041-kalas-i-toads-hus',
  '72041_boxprod_v29_sha.webp': '72041-kalas-i-toads-hus',

  // Product: 72042-prince-florian-och-castle-bowser
  '72042_Box1_v29.webp': '72042-prince-florian-och-castle-bowser',
  '72042_Lifestyle_Cons_crop.webp': '72042-prince-florian-och-castle-bowser',
  '72042_Lifestyle_Envr_crop.webp': '72042-prince-florian-och-castle-bowser',
  '72042_Prod.webp': '72042-prince-florian-och-castle-bowser',
  '72042_boxprod_v29_sha.webp': '72042-prince-florian-och-castle-bowser',

  // Product: 72043-mario-kart™-interaktiv-lego®-mario™-standard-kart
  '72043_Box1_v29.webp': '72043-mario-kart™-interaktiv-lego®-mario™-standard-kart',
  '72043_Lifestyle_Cons_crop.webp': '72043-mario-kart™-interaktiv-lego®-mario™-standard-kart',
  '72043_Lifestyle_Envr_crop.webp': '72043-mario-kart™-interaktiv-lego®-mario™-standard-kart',
  '72043_Prod.webp': '72043-mario-kart™-interaktiv-lego®-mario™-standard-kart',
  '72043_boxprod_v29_sha.webp': '72043-mario-kart™-interaktiv-lego®-mario™-standard-kart',

  // Product: 72046-super-mario-72046
  '72046_Box1_v29.webp': '72046-super-mario-72046',
  '72046_Lifestyle_Cons_crop.webp': '72046-super-mario-72046',
  '72046_Lifestyle_Envr_crop.webp': '72046-super-mario-72046',
  '72046_Prod.webp': '72046-super-mario-72046',
  '72046_boxprod_v29_sha.webp': '72046-super-mario-72046',

  // Product: 75304-darth-vader™-helmet
  '75304_Box1_v29.webp': '75304-darth-vader™-helmet',
  '75304_Lifestyle_cons_crop.webp': '75304-darth-vader™-helmet',
  '75304_Lifestyle_envr_crop.webp': '75304-darth-vader™-helmet',
  '75304_Prod.webp': '75304-darth-vader™-helmet',

  // Product: 75325-the-mandalorian-s-n-1-starfighter™
  '75325_Box1_v29.webp': '75325-the-mandalorian-s-n-1-starfighter™',
  '75325_Lifestyle_Cons_crop.webp': '75325-the-mandalorian-s-n-1-starfighter™',
  '75325_Lifestyle_Envr_crop.webp': '75325-the-mandalorian-s-n-1-starfighter™',
  '75325_Prod.webp': '75325-the-mandalorian-s-n-1-starfighter™',
  '75325_boxprod_v29.webp': '75325-the-mandalorian-s-n-1-starfighter™',

  // Product: 75328-the-mandalorian™-helmet
  '75328_Box1_v29.webp': '75328-the-mandalorian™-helmet',
  '75328_Lifestyle_Cons_crop.webp': '75328-the-mandalorian™-helmet',
  '75328_Lifestyle_Envr_crop.webp': '75328-the-mandalorian™-helmet',
  '75328_Prod.webp': '75328-the-mandalorian™-helmet',
  '75328_boxprod_v29.webp': '75328-the-mandalorian™-helmet',

  // Product: 75333-obi-wan-kenobi-s-jedi-starfighter™
  '75333_Box1_V29.webp': '75333-obi-wan-kenobi-s-jedi-starfighter™',
  '75333_Lifestyle_Cons_crop.webp': '75333-obi-wan-kenobi-s-jedi-starfighter™',
  '75333_Lifestyle_Envr_crop.webp': '75333-obi-wan-kenobi-s-jedi-starfighter™',
  '75333_Prod.webp': '75333-obi-wan-kenobi-s-jedi-starfighter™',
  '75333_boxprod_v29.webp': '75333-obi-wan-kenobi-s-jedi-starfighter™',

  // Product: 75337-at-te™-walker
  '75337_Box1_v29.webp': '75337-at-te™-walker',
  '75337_Lifestyle_Cons_crop.webp': '75337-at-te™-walker',
  '75337_Lifestyle_Envr_crop.webp': '75337-at-te™-walker',
  '75337_Prod.webp': '75337-at-te™-walker',
  '75337_boxprod_v29.webp': '75337-at-te™-walker',

  // Product: 75345-501st-clone-troopers™-battle-pack
  '75345_Box1_v29.webp': '75345-501st-clone-troopers™-battle-pack',
  '75345_Lifestyle_Cons_crop.webp': '75345-501st-clone-troopers™-battle-pack',
  '75345_Lifestyle_Envr_crop.webp': '75345-501st-clone-troopers™-battle-pack',
  '75345_Prod.webp': '75345-501st-clone-troopers™-battle-pack',
  '75345_boxprod_v29.webp': '75345-501st-clone-troopers™-battle-pack',

  // Product: 75347-tie-bomber™
  '75347_Box1_v29.webp': '75347-tie-bomber™',
  '75347_Lifestyle_Cons_crop.webp': '75347-tie-bomber™',
  '75347_Lifestyle_Envr_crop.webp': '75347-tie-bomber™',
  '75347_Prod.webp': '75347-tie-bomber™',
  '75347_boxprod_v29.webp': '75347-tie-bomber™',

  // Product: 75349-captain-rex™-helmet
  '75349_Box1_v29.webp': '75349-captain-rex™-helmet',
  '75349_Lifestyle_Cons_crop.webp': '75349-captain-rex™-helmet',
  '75349_Lifestyle_Envr_crop.webp': '75349-captain-rex™-helmet',
  '75349_Prod.webp': '75349-captain-rex™-helmet',
  '75349_boxprod_v29.webp': '75349-captain-rex™-helmet',

  // Product: 75362-ahsoka-tanos-t-6-jedi-shuttle™
  '75362_Box1_v29.webp': '75362-ahsoka-tanos-t-6-jedi-shuttle™',
  '75362_Lifestyle_Cons_crop.webp': '75362-ahsoka-tanos-t-6-jedi-shuttle™',
  '75362_Lifestyle_Envr_crop.webp': '75362-ahsoka-tanos-t-6-jedi-shuttle™',
  '75362_Prod.webp': '75362-ahsoka-tanos-t-6-jedi-shuttle™',
  '75362_boxprod_v29.webp': '75362-ahsoka-tanos-t-6-jedi-shuttle™',

  // Product: 75372-clone-trooper™-battle-droid™-battle-pack
  '75372_Box1_v29.webp': '75372-clone-trooper™-battle-droid™-battle-pack',
  '75372_Lifestyle_Cons_crop.webp': '75372-clone-trooper™-battle-droid™-battle-pack',
  '75372_Lifestyle_Envr_crop.webp': '75372-clone-trooper™-battle-droid™-battle-pack',
  '75372_Prod.webp': '75372-clone-trooper™-battle-droid™-battle-pack',
  '75372_boxprod_v29.webp': '75372-clone-trooper™-battle-droid™-battle-pack',

  // Product: 75373-ambush-on-mandalore™-battle-pack
  '75373_Box1_v29.webp': '75373-ambush-on-mandalore™-battle-pack',
  '75373_Lifestyle_Cons_crop.webp': '75373-ambush-on-mandalore™-battle-pack',
  '75373_Lifestyle_Envr_crop.webp': '75373-ambush-on-mandalore™-battle-pack',
  '75373_Prod.webp': '75373-ambush-on-mandalore™-battle-pack',
  '75373_boxprod_v29_sha.webp': '75373-ambush-on-mandalore™-battle-pack',

  // Product: 75374-the-onyx-cinder
  '75374_Box1_v29.webp': '75374-the-onyx-cinder',
  '75374_Lifestyle_Cons_crop.webp': '75374-the-onyx-cinder',
  '75374_Lifestyle_Envr_crop.webp': '75374-the-onyx-cinder',
  '75374_Prod.webp': '75374-the-onyx-cinder',
  '75374_boxprod_v29_sha.webp': '75374-the-onyx-cinder',

  // Product: 75375-millennium-falcon™
  '75375_Box1_v29.webp': '75375-millennium-falcon™',
  '75375_Lifestyle_Cons_crop.webp': '75375-millennium-falcon™',
  '75375_Lifestyle_Envr_crop.webp': '75375-millennium-falcon™',
  '75375_Prod.webp': '75375-millennium-falcon™',
  '75375_boxprod_v29.webp': '75375-millennium-falcon™',

  // Product: 75376-tantive-iv™
  '75376_Box1_v29.webp': '75376-tantive-iv™',
  '75376_Lifestyle_Cons_crop.webp': '75376-tantive-iv™',
  '75376_Lifestyle_Envr_crop.webp': '75376-tantive-iv™',
  '75376_Prod.webp': '75376-tantive-iv™',
  '75376_boxprod_v29.webp': '75376-tantive-iv™',

  // Product: 75378-barc-speeder™-escape
  '75378_Box1_v29.webp': '75378-barc-speeder™-escape',
  '75378_Lifestyle_Cons_crop.webp': '75378-barc-speeder™-escape',
  '75378_Lifestyle_Envr_crop.webp': '75378-barc-speeder™-escape',
  '75378_Prod.webp': '75378-barc-speeder™-escape',
  '75378_boxprod_v29.webp': '75378-barc-speeder™-escape',

  // Product: 75379-r2-d2™
  '75379_Box1_v29.webp': '75379-r2-d2™',
  '75379_Lifestyle_Cons_crop.webp': '75379-r2-d2™',
  '75379_Lifestyle_Envr_crop.webp': '75379-r2-d2™',
  '75379_Prod.webp': '75379-r2-d2™',
  '75379_boxprod_v29.webp': '75379-r2-d2™',

  // Product: 75380-mos-espa-podrace™-diorama
  '75380_Box1_v29.webp': '75380-mos-espa-podrace™-diorama',
  '75380_Lifestyle_Cons_crop.webp': '75380-mos-espa-podrace™-diorama',
  '75380_Lifestyle_Envr_crop.webp': '75380-mos-espa-podrace™-diorama',
  '75380_Prod.webp': '75380-mos-espa-podrace™-diorama',
  '75380_boxprod_v29.webp': '75380-mos-espa-podrace™-diorama',

  // Product: 75381-droideka™
  '75381_Box1_v29.webp': '75381-droideka™',
  '75381_Lifestyle_Cons_crop.webp': '75381-droideka™',
  '75381_Lifestyle_Envr_crop.webp': '75381-droideka™',
  '75381_Prod.webp': '75381-droideka™',
  '75381_boxprod_v29.webp': '75381-droideka™',

  // Product: 75384-the-crimson-firehawk™
  '75384_Box1_v29.webp': '75384-the-crimson-firehawk™',
  '75384_Lifestyle_Cons_crop.webp': '75384-the-crimson-firehawk™',
  '75384_Lifestyle_Envr_crop.webp': '75384-the-crimson-firehawk™',
  '75384_Prod.webp': '75384-the-crimson-firehawk™',
  '75384_boxprod_v29.webp': '75384-the-crimson-firehawk™',

  // Product: 75386-paz-vizsla™-and-moff-gideon™-battle
  '75386_Box1_v29.webp': '75386-paz-vizsla™-and-moff-gideon™-battle',
  '75386_Lifestyle_cons_crop.webp': '75386-paz-vizsla™-and-moff-gideon™-battle',
  '75386_Lifestyle_envr_crop.webp': '75386-paz-vizsla™-and-moff-gideon™-battle',
  '75386_Prod.webp': '75386-paz-vizsla™-and-moff-gideon™-battle',
  '75386_boxprod_v29_sha.webp': '75386-paz-vizsla™-and-moff-gideon™-battle',

  // Product: 75387-boarding-the-tantive-iv™
  '75387_Box1_v29.webp': '75387-boarding-the-tantive-iv™',
  '75387_Lifestyle_Cons_crop.webp': '75387-boarding-the-tantive-iv™',
  '75387_Lifestyle_Envr_crop.webp': '75387-boarding-the-tantive-iv™',
  '75387_Prod.webp': '75387-boarding-the-tantive-iv™',
  '75387_boxprod_v29.webp': '75387-boarding-the-tantive-iv™',

  // Product: 75388-jedi-bobs-starfighter
  '75388_Box1_v29.webp': '75388-jedi-bobs-starfighter',
  '75388_Lifestyle_cons_crop.webp': '75388-jedi-bobs-starfighter',
  '75388_Lifestyle_envr_crop.webp': '75388-jedi-bobs-starfighter',
  '75388_Prod.webp': '75388-jedi-bobs-starfighter',
  '75388_boxprod_v29_sha.webp': '75388-jedi-bobs-starfighter',

  // Product: 75389-the-dark-falcon
  '75389_Box1_v29.webp': '75389-the-dark-falcon',
  '75389_Lifestyle_cons_crop.webp': '75389-the-dark-falcon',
  '75389_Lifestyle_envr_crop.webp': '75389-the-dark-falcon',
  '75389_Prod.webp': '75389-the-dark-falcon',
  '75389_boxprod_v29_sha.webp': '75389-the-dark-falcon',

  // Product: 75390-luke-skywalker™-x-wing™-mech
  '75390_Box1_v29.webp': '75390-luke-skywalker™-x-wing™-mech',
  '75390_Lifestyle_Cons_crop.webp': '75390-luke-skywalker™-x-wing™-mech',
  '75390_Lifestyle_Envr_crop.webp': '75390-luke-skywalker™-x-wing™-mech',
  '75390_Prod.webp': '75390-luke-skywalker™-x-wing™-mech',
  '75390_boxprod_v29_sha.webp': '75390-luke-skywalker™-x-wing™-mech',

  // Product: 75391-captain-rex™-y-wing™-microfighter
  '75391_Box1_v29.webp': '75391-captain-rex™-y-wing™-microfighter',
  '75391_Lifestyle_Cons_crop.webp': '75391-captain-rex™-y-wing™-microfighter',
  '75391_Lifestyle_Envr_crop.webp': '75391-captain-rex™-y-wing™-microfighter',
  '75391_Prod.webp': '75391-captain-rex™-y-wing™-microfighter',
  '75391_boxprod_v29_sha.webp': '75391-captain-rex™-y-wing™-microfighter',

  // Product: 75393-tie-fighter-x-wing-mash-up
  '75393_Box1_v29.webp': '75393-tie-fighter-x-wing-mash-up',
  '75393_Lifestyle_cons_crop.webp': '75393-tie-fighter-x-wing-mash-up',
  '75393_Lifestyle_envr_crop.webp': '75393-tie-fighter-x-wing-mash-up',
  '75393_Prod.webp': '75393-tie-fighter-x-wing-mash-up',
  '75393_boxprod_v29_sha.webp': '75393-tie-fighter-x-wing-mash-up',

  // Product: 75396-desert-skiff-sarlacc-pit
  '75396_Box1_v29.webp': '75396-desert-skiff-sarlacc-pit',
  '75396_Lifestyle_cons_crop.webp': '75396-desert-skiff-sarlacc-pit',
  '75396_Lifestyle_envr_crop.webp': '75396-desert-skiff-sarlacc-pit',
  '75396_Prod.webp': '75396-desert-skiff-sarlacc-pit',
  '75396_boxprod_v29_sha.webp': '75396-desert-skiff-sarlacc-pit',

  // Product: 75398-c-3po™
  '75398_Box1_v29.webp': '75398-c-3po™',
  '75398_Lifestyle_Cons_crop.webp': '75398-c-3po™',
  '75398_Lifestyle_Envr_crop.webp': '75398-c-3po™',
  '75398_Prod.webp': '75398-c-3po™',
  '75398_boxprod_v29_sha.webp': '75398-c-3po™',

  // Product: 75399-rebel-u-wing-starfighter™
  '75399_Box1_v29.webp': '75399-rebel-u-wing-starfighter™',
  '75399_Lifestyle_Cons_crop.webp': '75399-rebel-u-wing-starfighter™',
  '75399_Lifestyle_Envr_crop.webp': '75399-rebel-u-wing-starfighter™',
  '75399_Prod.webp': '75399-rebel-u-wing-starfighter™',
  '75399_boxprod_v29_sha.webp': '75399-rebel-u-wing-starfighter™',

  // Product: 75400-plo-koons-jedi-starfighter™-microfighter
  '75400_Box1_v29.webp': '75400-plo-koons-jedi-starfighter™-microfighter',
  '75400_Lifestyle_Cons_crop.webp': '75400-plo-koons-jedi-starfighter™-microfighter',
  '75400_Lifestyle_Envr_crop.webp': '75400-plo-koons-jedi-starfighter™-microfighter',
  '75400_Prod.webp': '75400-plo-koons-jedi-starfighter™-microfighter',
  '75400_boxprod_v29_sha.webp': '75400-plo-koons-jedi-starfighter™-microfighter',

  // Product: 75401-ahsokas-jedi-interceptor™
  '75401_Box1_v29.webp': '75401-ahsokas-jedi-interceptor™',
  '75401_Lifestyle_cons_crop.webp': '75401-ahsokas-jedi-interceptor™',
  '75401_Lifestyle_envr_crop.webp': '75401-ahsokas-jedi-interceptor™',
  '75401_Prod.webp': '75401-ahsokas-jedi-interceptor™',
  '75401_boxprod_v29_sha.webp': '75401-ahsokas-jedi-interceptor™',

  // Product: 75402-arc-170-starfighter™
  '75402_Box1_v29.webp': '75402-arc-170-starfighter™',
  '75402_Lifestyle_Cons_crop.webp': '75402-arc-170-starfighter™',
  '75402_Lifestyle_Envr_crop.webp': '75402-arc-170-starfighter™',
  '75402_Prod.webp': '75402-arc-170-starfighter™',
  '75402_boxprod_v29_sha.webp': '75402-arc-170-starfighter™',

  // Product: 75403-grogu™-with-hover-pram
  '75403_Box1_v29.webp': '75403-grogu™-with-hover-pram',
  '75403_Lifestyle_cons_crop.webp': '75403-grogu™-with-hover-pram',
  '75403_Lifestyle_envr_crop.webp': '75403-grogu™-with-hover-pram',
  '75403_Prod.webp': '75403-grogu™-with-hover-pram',
  '75403_boxprod_v29_sha.webp': '75403-grogu™-with-hover-pram',

  // Product: 75404-acclamator-class-assault-ship™
  '75404_Box1_v29.webp': '75404-acclamator-class-assault-ship™',
  '75404_Lifestyle_Cons_crop.webp': '75404-acclamator-class-assault-ship™',
  '75404_Lifestyle_Envr_crop.webp': '75404-acclamator-class-assault-ship™',
  '75404_Prod.webp': '75404-acclamator-class-assault-ship™',
  '75404_boxprod_v29_sha.webp': '75404-acclamator-class-assault-ship™',

  // Product: 75405-home-one-starcruiser
  '75405_Box1_v29.webp': '75405-home-one-starcruiser',
  '75405_Lifestyle_Cons_crop.webp': '75405-home-one-starcruiser',
  '75405_Lifestyle_Envr_crop.webp': '75405-home-one-starcruiser',
  '75405_Prod.webp': '75405-home-one-starcruiser',
  '75405_boxprod_v29_sha.webp': '75405-home-one-starcruiser',

  // Product: 75407-brick-built-star-wars™-logo
  '75407_Box1_v29.webp': '75407-brick-built-star-wars™-logo',
  '75407_Lifestyle_Cons_crop.webp': '75407-brick-built-star-wars™-logo',
  '75407_Lifestyle_Envr_crop.webp': '75407-brick-built-star-wars™-logo',
  '75407_Prod.webp': '75407-brick-built-star-wars™-logo',
  '75407_boxprod_v29_sha.webp': '75407-brick-built-star-wars™-logo',

  // Product: 75408-jango-fett™-helmet
  '75408_Box1_v29.webp': '75408-jango-fett™-helmet',
  '75408_Lifestyle_Cons_crop.webp': '75408-jango-fett™-helmet',
  '75408_Lifestyle_Envr_crop.webp': '75408-jango-fett™-helmet',
  '75408_Prod.webp': '75408-jango-fett™-helmet',
  '75408_boxprod_v29_sha.webp': '75408-jango-fett™-helmet',

  // Product: 75410-mando-and-grogus-n-1-starfighter™
  '75410_Box1_v29.webp': '75410-mando-and-grogus-n-1-starfighter™',
  '75410_Lifestyle_Cons_crop.webp': '75410-mando-and-grogus-n-1-starfighter™',
  '75410_Lifestyle_Envr_crop.webp': '75410-mando-and-grogus-n-1-starfighter™',
  '75410_Prod.webp': '75410-mando-and-grogus-n-1-starfighter™',
  '75410_boxprod_v29_sha.webp': '75410-mando-and-grogus-n-1-starfighter™',

  // Product: 75411-darth-maul™-mech
  '75411_Box1_v29.webp': '75411-darth-maul™-mech',
  '75411_Lifestyle_Cons_crop.webp': '75411-darth-maul™-mech',
  '75411_Lifestyle_Envr_crop.webp': '75411-darth-maul™-mech',
  '75411_Prod.webp': '75411-darth-maul™-mech',
  '75411_boxprod_v29_sha.webp': '75411-darth-maul™-mech',

  // Product: 75412-death-trooper-night-trooper-battle-pack
  '75412_Box1_v29.webp': '75412-death-trooper-night-trooper-battle-pack',
  '75412_Lifestyle_Cons_crop.webp': '75412-death-trooper-night-trooper-battle-pack',
  '75412_Lifestyle_Envr_crop.webp': '75412-death-trooper-night-trooper-battle-pack',
  '75412_Prod.webp': '75412-death-trooper-night-trooper-battle-pack',
  '75412_boxprod_v29_sha.webp': '75412-death-trooper-night-trooper-battle-pack',

  // Product: 75413-star-wars-75413
  '75413_Box1_v29.webp': '75413-star-wars-75413',
  '75413_Lifestyle_Cons_crop.webp': '75413-star-wars-75413',
  '75413_Lifestyle_Envr_crop.webp': '75413-star-wars-75413',
  '75413_Prod.webp': '75413-star-wars-75413',
  '75413_boxprod_v29_sha.webp': '75413-star-wars-75413',

  // Product: 75414-star-wars-75414
  '75414_Box1_v29.webp': '75414-star-wars-75414',
  '75414_Lifestyle_Cons_crop.webp': '75414-star-wars-75414',
  '75414_Lifestyle_Envr_crop.webp': '75414-star-wars-75414',
  '75414_Prod.webp': '75414-star-wars-75414',
  '75414_boxprod_v29_sha.webp': '75414-star-wars-75414',

  // Product: 75416-chopper-c1-10p™-astromech-droid
  '75416_Box1_v29.webp': '75416-chopper-c1-10p™-astromech-droid',
  '75416_Lifestyle_cons_crop.webp': '75416-chopper-c1-10p™-astromech-droid',
  '75416_Lifestyle_envr_crop.webp': '75416-chopper-c1-10p™-astromech-droid',
  '75416_Prod.webp': '75416-chopper-c1-10p™-astromech-droid',
  '75416_boxprod_v29_sha.webp': '75416-chopper-c1-10p™-astromech-droid',

  // Product: 75417-star-wars-75417
  '75417_Box1_v29.webp': '75417-star-wars-75417',
  '75417_Lifestyle_Cons_crop.webp': '75417-star-wars-75417',
  '75417_Lifestyle_Envr_crop.webp': '75417-star-wars-75417',
  '75417_Prod.webp': '75417-star-wars-75417',
  '75417_boxprod_v29_sha.webp': '75417-star-wars-75417',

  // Product: 75418-advent-calendar-2025
  '75418_Box1_v29.webp': '75418-advent-calendar-2025',
  '75418_Lifestyle_Cons_crop.webp': '75418-advent-calendar-2025',
  '75418_Lifestyle_Envr_crop.webp': '75418-advent-calendar-2025',
  '75418_Prod.webp': '75418-advent-calendar-2025',
  '75418_boxprod_v29_sha.webp': '75418-advent-calendar-2025',

  // Product: 75431-327th-star-corps-clone-troopers™-battle-pack
  '75431_Box1_v29.webp': '75431-327th-star-corps-clone-troopers™-battle-pack',
  '75431_Lifestyle_Cons_crop.webp': '75431-327th-star-corps-clone-troopers™-battle-pack',
  '75431_Lifestyle_Envr_crop.webp': '75431-327th-star-corps-clone-troopers™-battle-pack',
  '75431_Prod.webp': '75431-327th-star-corps-clone-troopers™-battle-pack',
  '75431_boxprod_v29_sha.webp': '75431-327th-star-corps-clone-troopers™-battle-pack',

  // Product: 75432-v-19-torrent-starfighter
  '75432_Box1_v29.webp': '75432-v-19-torrent-starfighter',
  '75432_Lifestyle_Cons_crop.webp': '75432-v-19-torrent-starfighter',
  '75432_Lifestyle_Envr_crop.webp': '75432-v-19-torrent-starfighter',
  '75432_Prod.webp': '75432-v-19-torrent-starfighter',
  '75432_boxprod_v29_sha.webp': '75432-v-19-torrent-starfighter',

  // Product: 75433-star-wars-75433
  '75433_Box1_v29.webp': '75433-star-wars-75433',
  '75433_Lifestyle_Cons_crop.webp': '75433-star-wars-75433',
  '75433_Lifestyle_Envr_crop.webp': '75433-star-wars-75433',
  '75433_Prod.webp': '75433-star-wars-75433',
  '75433_boxprod_v29_sha.webp': '75433-star-wars-75433',

  // Product: 75434-k-2so™-security-droid
  '75434_Box1_v29.webp': '75434-k-2so™-security-droid',
  '75434_Lifestyle_Cons_crop.webp': '75434-k-2so™-security-droid',
  '75434_Lifestyle_Envr_crop.webp': '75434-k-2so™-security-droid',
  '75434_Prod.webp': '75434-k-2so™-security-droid',
  '75434_boxprod_v29_sha.webp': '75434-k-2so™-security-droid',

  // Product: 75435-star-wars-75435
  '75435_Box1_v29.webp': '75435-star-wars-75435',
  '75435_Lifestyle_Cons_crop.webp': '75435-star-wars-75435',
  '75435_Lifestyle_Envr_crop.webp': '75435-star-wars-75435',
  '75435_Prod.webp': '75435-star-wars-75435',
  '75435_boxprod_v29_sha.webp': '75435-star-wars-75435',

  // Product: 75580-minioner-och-bananbil
  '75580_Box1_v29.webp': '75580-minioner-och-bananbil',
  '75580_Lifestyle_Cons_crop.webp': '75580-minioner-och-bananbil',
  '75580_Lifestyle_Envr_crop.webp': '75580-minioner-och-bananbil',
  '75580_Prod.webp': '75580-minioner-och-bananbil',
  '75580_boxprod_v29.webp': '75580-minioner-och-bananbil',

  // Product: 75581-minionernas-musikpartybuss
  '75581_Box1_v29.webp': '75581-minionernas-musikpartybuss',
  '75581_Lifestyle_Cons_crop.webp': '75581-minionernas-musikpartybuss',
  '75581_Lifestyle_Envr_crop.webp': '75581-minionernas-musikpartybuss',
  '75581_Prod.webp': '75581-minionernas-musikpartybuss',
  '75581_boxprod_v29_sha.webp': '75581-minionernas-musikpartybuss',

  // Product: 75582-klossbyggd-gru-med-minioner
  '75582_Box1_v29.webp': '75582-klossbyggd-gru-med-minioner',
  '75582_Lifestyle_Cons_crop.webp': '75582-klossbyggd-gru-med-minioner',
  '75582_Lifestyle_Envr_crop.webp': '75582-klossbyggd-gru-med-minioner',
  '75582_Prod.webp': '75582-klossbyggd-gru-med-minioner',
  '75582_boxprod_v29.webp': '75582-klossbyggd-gru-med-minioner',

  // Product: 75583-minionernas-och-grus-familjehem
  '75583_Box1_v29.webp': '75583-minionernas-och-grus-familjehem',
  '75583_Lifestyle_Cons_crop.webp': '75583-minionernas-och-grus-familjehem',
  '75583_Lifestyle_Envr_crop.webp': '75583-minionernas-och-grus-familjehem',
  '75583_Prod.webp': '75583-minionernas-och-grus-familjehem',
  '75583_boxprod_v29.webp': '75583-minionernas-och-grus-familjehem',

  // Product: 75636-one-piece-75636
  '75636_Box1_v29.webp': '75636-one-piece-75636',
  '75636_Lifestyle_Cons_crop.webp': '75636-one-piece-75636',
  '75636_Lifestyle_Envr_crop.webp': '75636-one-piece-75636',
  '75636_Prod.webp': '75636-one-piece-75636',
  '75636_boxprod_v29_sha.webp': '75636-one-piece-75636',

  // Product: 75637-one-piece-75637
  '75637_Box1_v29.webp': '75637-one-piece-75637',
  '75637_Lifestyle_Cons_crop.webp': '75637-one-piece-75637',
  '75637_Lifestyle_Envr_crop.webp': '75637-one-piece-75637',
  '75637_Prod.webp': '75637-one-piece-75637',
  '75637_boxprod_v29_sha.webp': '75637-one-piece-75637',

  // Product: 75638-one-piece-75638
  '75638_Box1_v29.webp': '75638-one-piece-75638',
  '75638_Lifestyle_Cons_crop.webp': '75638-one-piece-75638',
  '75638_Lifestyle_Envr_crop.webp': '75638-one-piece-75638',
  '75638_Prod.webp': '75638-one-piece-75638',
  '75638_boxprod_v29_sha.webp': '75638-one-piece-75638',

  // Product: 75639-one-piece-75639
  '75639_Box1_v29.webp': '75639-one-piece-75639',
  '75639_Lifestyle_Cons_crop.webp': '75639-one-piece-75639',
  '75639_Lifestyle_Envr_crop.webp': '75639-one-piece-75639',
  '75639_Prod.webp': '75639-one-piece-75639',
  '75639_boxprod_v29_sha.webp': '75639-one-piece-75639',

  // Product: 75640-one-piece-75640
  '75640_Box1_v29.webp': '75640-one-piece-75640',
  '75640_Lifestyle_Cons_crop.webp': '75640-one-piece-75640',
  '75640_Lifestyle_Envr_crop.webp': '75640-one-piece-75640',
  '75640_Prod.webp': '75640-one-piece-75640',
  '75640_boxprod_v29_sha.webp': '75640-one-piece-75640',

  // Product: 75681-glinda-elphaba-och-nessarose-pa-shiz-university
  '75681_Box1_v29.webp': '75681-glinda-elphaba-och-nessarose-pa-shiz-university',
  '75681_Lifestyle_Cons_crop.webp': '75681-glinda-elphaba-och-nessarose-pa-shiz-university',
  '75681_Lifestyle_Envr_crop.webp': '75681-glinda-elphaba-och-nessarose-pa-shiz-university',
  '75681_Prod.webp': '75681-glinda-elphaba-och-nessarose-pa-shiz-university',
  '75681_boxprod_v29_sha.webp': '75681-glinda-elphaba-och-nessarose-pa-shiz-university',

  // Product: 75682-elphaba-glinda
  '75682_Box1_v29.webp': '75682-elphaba-glinda',
  '75682_Lifestyle_Cons_crop.webp': '75682-elphaba-glinda',
  '75682_Lifestyle_Envr_crop.webp': '75682-elphaba-glinda',
  '75682_Prod.webp': '75682-elphaba-glinda',
  '75682_boxprod_v29_sha.webp': '75682-elphaba-glinda',

  // Product: 75683-glinda-och-elphabas-studentrum
  '75683_Box1_v29.webp': '75683-glinda-och-elphabas-studentrum',
  '75683_Lifestyle_Cons_crop.webp': '75683-glinda-och-elphabas-studentrum',
  '75683_Lifestyle_Envr_crop.webp': '75683-glinda-och-elphabas-studentrum',
  '75683_Prod.webp': '75683-glinda-och-elphabas-studentrum',
  '75683_boxprod_v29_sha.webp': '75683-glinda-och-elphabas-studentrum',

  // Product: 75684-valkommen-till-emerald-city
  '75684_Box1_v29.webp': '75684-valkommen-till-emerald-city',
  '75684_Lifestyle_Cons_crop.webp': '75684-valkommen-till-emerald-city',
  '75684_Lifestyle_Envr_crop.webp': '75684-valkommen-till-emerald-city',
  '75684_Prod.webp': '75684-valkommen-till-emerald-city',
  '75684_boxprod_v29_sha.webp': '75684-valkommen-till-emerald-city',

  // Product: 75685-wicked-75685
  '75685_Box1_v29.webp': '75685-wicked-75685',
  '75685_Lifestyle_Cons_crop.webp': '75685-wicked-75685',
  '75685_Lifestyle_Envr_crop.webp': '75685-wicked-75685',
  '75685_Prod.webp': '75685-wicked-75685',
  '75685_boxprod_v29_sha.webp': '75685-wicked-75685',

  // Product: 75687-wicked-75687
  '75687_Box1_v29.webp': '75687-wicked-75687',
  '75687_Lifestyle_Cons_crop.webp': '75687-wicked-75687',
  '75687_Lifestyle_Envr_crop.webp': '75687-wicked-75687',
  '75687_Prod.webp': '75687-wicked-75687',
  '75687_boxprod_v29_sha.webp': '75687-wicked-75687',

  // Product: 75688-wicked-75688
  '75688_Box1_v29.webp': '75688-wicked-75688',
  '75688_Lifestyle_Cons_crop.webp': '75688-wicked-75688',
  '75688_Lifestyle_Envr_crop.webp': '75688-wicked-75688',
  '75688_Prod.webp': '75688-wicked-75688',
  '75688_boxprod_v29_sha.webp': '75688-wicked-75688',

  // Product: 75689-wicked-75689
  '75689_Box1_v29.webp': '75689-wicked-75689',
  '75689_Lifestyle_Cons_crop.webp': '75689-wicked-75689',
  '75689_Lifestyle_Envr_crop.webp': '75689-wicked-75689',
  '75689_Prod.webp': '75689-wicked-75689',
  '75689_boxprod_v29_sha.webp': '75689-wicked-75689',

  // Product: 76261-spider-man-den-sista-striden
  '76261_Box1_v29.webp': '76261-spider-man-den-sista-striden',
  '76261_Lifestyle_Cons_crop.webp': '76261-spider-man-den-sista-striden',
  '76261_Lifestyle_Envr_crop.webp': '76261-spider-man-den-sista-striden',
  '76261_Prod.webp': '76261-spider-man-den-sista-striden',
  '76261_boxprod_v29.webp': '76261-spider-man-den-sista-striden',

  // Product: 76270-batman™-robotrustning
  '76270_Box1_v29.webp': '76270-batman™-robotrustning',
  '76270_Lifestyle_Cons_crop.webp': '76270-batman™-robotrustning',
  '76270_Lifestyle_Envr_crop.webp': '76270-batman™-robotrustning',
  '76270_Prod.webp': '76270-batman™-robotrustning',
  '76270_boxprod_v29_sha.webp': '76270-batman™-robotrustning',

  // Product: 76273-batman™-byggfigur-och-batpod-cykeln
  '76273_Box1_v29.webp': '76273-batman™-byggfigur-och-batpod-cykeln',
  '76273_Lifestyle_Cons_crop.webp': '76273-batman™-byggfigur-och-batpod-cykeln',
  '76273_Lifestyle_Envr_crop.webp': '76273-batman™-byggfigur-och-batpod-cykeln',
  '76273_Prod.webp': '76273-batman™-byggfigur-och-batpod-cykeln',
  '76273_boxprod_v29_sha.webp': '76273-batman™-byggfigur-och-batpod-cykeln',

  // Product: 76274-batman™-med-batmobile™-mot-harley-quinn™-och-mr-freeze™
  '76274_Box1_v29.webp': '76274-batman™-med-batmobile™-mot-harley-quinn™-och-mr-freeze™',
  '76274_Lifestyle_Cons_crop.webp': '76274-batman™-med-batmobile™-mot-harley-quinn™-och-mr-freeze™',
  '76274_Lifestyle_Envr_crop.webp': '76274-batman™-med-batmobile™-mot-harley-quinn™-och-mr-freeze™',
  '76274_Prod.webp': '76274-batman™-med-batmobile™-mot-harley-quinn™-och-mr-freeze™',
  '76274_boxprod_v29_sha.webp': '76274-batman™-med-batmobile™-mot-harley-quinn™-och-mr-freeze™',

  // Product: 76276-venoms-robotrustning-mot-miles-morales
  '76276_Box1_v29.webp': '76276-venoms-robotrustning-mot-miles-morales',
  '76276_Lifestyle_Cons_crop.webp': '76276-venoms-robotrustning-mot-miles-morales',
  '76276_Lifestyle_Envr_crop.webp': '76276-venoms-robotrustning-mot-miles-morales',
  '76276_Prod.webp': '76276-venoms-robotrustning-mot-miles-morales',
  '76276_boxprod_v29.webp': '76276-venoms-robotrustning-mot-miles-morales',

  // Product: 76277-war-machines-robotrustning
  '76277_Box1_v29.webp': '76277-war-machines-robotrustning',
  '76277_Lifestyle_Cons_crop.webp': '76277-war-machines-robotrustning',
  '76277_Lifestyle_Envr_crop.webp': '76277-war-machines-robotrustning',
  '76277_Prod.webp': '76277-war-machines-robotrustning',
  '76277_boxprod_v29.webp': '76277-war-machines-robotrustning',

  // Product: 76278-rockets-warbird-mot-ronan
  '76278_Box1_v29.webp': '76278-rockets-warbird-mot-ronan',
  '76278_Lifestyle_Cons_crop.webp': '76278-rockets-warbird-mot-ronan',
  '76278_Lifestyle_Envr_crop.webp': '76278-rockets-warbird-mot-ronan',
  '76278_Prod.webp': '76278-rockets-warbird-mot-ronan',
  '76278_boxprod_v29.webp': '76278-rockets-warbird-mot-ronan',

  // Product: 76279-spider-mans-racerbil-venom-green-goblin
  '76279_Box1_v29.webp': '76279-spider-mans-racerbil-venom-green-goblin',
  '76279_Lifestyle_Cons_crop.webp': '76279-spider-mans-racerbil-venom-green-goblin',
  '76279_Lifestyle_Envr_crop.webp': '76279-spider-mans-racerbil-venom-green-goblin',
  '76279_Prod.webp': '76279-spider-mans-racerbil-venom-green-goblin',
  '76279_boxprod_v29.webp': '76279-spider-mans-racerbil-venom-green-goblin',

  // Product: 76280-spider-man-mot-sandman-slutstriden
  '76280_Box1_v29.webp': '76280-spider-man-mot-sandman-slutstriden',
  '76280_Lifestyle_Cons_crop.webp': '76280-spider-man-mot-sandman-slutstriden',
  '76280_Lifestyle_Envr_crop.webp': '76280-spider-man-mot-sandman-slutstriden',
  '76280_Prod.webp': '76280-spider-man-mot-sandman-slutstriden',
  '76280_boxprod_v29.webp': '76280-spider-man-mot-sandman-slutstriden',

  // Product: 76281-x-men-x-jet
  '76281_Box1_v29.webp': '76281-x-men-x-jet',
  '76281_Lifestyle_Cons_crop.webp': '76281-x-men-x-jet',
  '76281_Lifestyle_Envr_crop.webp': '76281-x-men-x-jet',
  '76281_Prod.webp': '76281-x-men-x-jet',
  '76281_boxprod_v29.webp': '76281-x-men-x-jet',

  // Product: 76282-rocket-baby-groot
  '76282_Box1_v29.webp': '76282-rocket-baby-groot',
  '76282_Lifestyle_Cons_crop.webp': '76282-rocket-baby-groot',
  '76282_Lifestyle_Envr_crop.webp': '76282-rocket-baby-groot',
  '76282_Prod.webp': '76282-rocket-baby-groot',
  '76282_boxprod_v29.webp': '76282-rocket-baby-groot',

  // Product: 76284-byggfigur-green-goblin
  '76284_Box1_v29.webp': '76284-byggfigur-green-goblin',
  '76284_Lifestyle_Cons_crop.webp': '76284-byggfigur-green-goblin',
  '76284_Lifestyle_Envr_crop.webp': '76284-byggfigur-green-goblin',
  '76284_Prod.webp': '76284-byggfigur-green-goblin',
  '76284_boxprod_v29.webp': '76284-byggfigur-green-goblin',

  // Product: 76286-guardians-of-the-galaxy-milano
  '76286_Box1_v29.webp': '76286-guardians-of-the-galaxy-milano',
  '76286_Lifestyle_cons_crop.webp': '76286-guardians-of-the-galaxy-milano',
  '76286_Lifestyle_envr_crop.webp': '76286-guardians-of-the-galaxy-milano',
  '76286_Prod.webp': '76286-guardians-of-the-galaxy-milano',
  '76286_boxprod_v29_sha.webp': '76286-guardians-of-the-galaxy-milano',

  // Product: 76287-iron-man-med-motorcykel-och-hulk
  '76287_Box1_v29.webp': '76287-iron-man-med-motorcykel-och-hulk',
  '76287_Lifestyle_Cons_crop.webp': '76287-iron-man-med-motorcykel-och-hulk',
  '76287_Lifestyle_Envr_crop.webp': '76287-iron-man-med-motorcykel-och-hulk',
  '76287_Prod.webp': '76287-iron-man-med-motorcykel-och-hulk',
  '76287_boxprod_v29_sha.webp': '76287-iron-man-med-motorcykel-och-hulk',

  // Product: 76288-iron-man-iron-legion-mot-hydrasoldat
  '76288_Box1_v29.webp': '76288-iron-man-iron-legion-mot-hydrasoldat',
  '76288_Lifestyle_cons_crop.webp': '76288-iron-man-iron-legion-mot-hydrasoldat',
  '76288_Lifestyle_envr_crop.webp': '76288-iron-man-iron-legion-mot-hydrasoldat',
  '76288_Prod.webp': '76288-iron-man-iron-legion-mot-hydrasoldat',
  '76288_boxprod_v29_sha.webp': '76288-iron-man-iron-legion-mot-hydrasoldat',

  // Product: 76290-avengers-mot-leviathan
  '76290_Box1_v29.webp': '76290-avengers-mot-leviathan',
  '76290_Lifestyle_cons_crop.webp': '76290-avengers-mot-leviathan',
  '76290_Lifestyle_envr_crop.webp': '76290-avengers-mot-leviathan',
  '76290_Prod.webp': '76290-avengers-mot-leviathan',
  '76290_boxprod_v29_sha.webp': '76290-avengers-mot-leviathan',

  // Product: 76291-avengers-samlas-age-of-ultron
  '76291_Box1_v29.webp': '76291-avengers-samlas-age-of-ultron',
  '76291_Lifestyle_cons_crop.webp': '76291-avengers-samlas-age-of-ultron',
  '76291_Lifestyle_envr_crop.webp': '76291-avengers-samlas-age-of-ultron',
  '76291_Prod.webp': '76291-avengers-samlas-age-of-ultron',
  '76291_boxprod_v29_sha.webp': '76291-avengers-samlas-age-of-ultron',

  // Product: 76292-captain-america-mot-red-hulk
  '76292_Box1_v29.webp': '76292-captain-america-mot-red-hulk',
  '76292_Lifestyle_Cons_crop.webp': '76292-captain-america-mot-red-hulk',
  '76292_Lifestyle_Envr_crop.webp': '76292-captain-america-mot-red-hulk',
  '76292_Prod.webp': '76292-captain-america-mot-red-hulk',
  '76292_boxprod_v29_sha.webp': '76292-captain-america-mot-red-hulk',

  // Product: 76296-byggfigur-nya-captain-america
  '76296_Box1_v29.webp': '76296-byggfigur-nya-captain-america',
  '76296_Lifestyle_Cons_crop.webp': '76296-byggfigur-nya-captain-america',
  '76296_Lifestyle_Envr_crop.webp': '76296-byggfigur-nya-captain-america',
  '76296_Prod.webp': '76296-byggfigur-nya-captain-america',
  '76296_boxprod_v29_sha.webp': '76296-byggfigur-nya-captain-america',

  // Product: 76297-dansande-groot
  '76297_Box1_v29.webp': '76297-dansande-groot',
  '76297_Lifestyle_cons_crop.webp': '76297-dansande-groot',
  '76297_Lifestyle_envr_crop.webp': '76297-dansande-groot',
  '76297_Prod.webp': '76297-dansande-groot',
  '76297_boxprod_v29_sha.webp': '76297-dansande-groot',

  // Product: 76298-byggfigur-iron-spider-man
  '76298_Box1_v29.webp': '76298-byggfigur-iron-spider-man',
  '76298_Lifestyle_Cons_crop.webp': '76298-byggfigur-iron-spider-man',
  '76298_Lifestyle_Envr_crop.webp': '76298-byggfigur-iron-spider-man',
  '76298_Prod.webp': '76298-byggfigur-iron-spider-man',
  '76298_boxprod_v29.webp': '76298-byggfigur-iron-spider-man',

  // Product: 76301-batman™-batmobile™-mot-mr-freeze™
  '76301_Box1_v29.webp': '76301-batman™-batmobile™-mot-mr-freeze™',
  '76301_Lifestyle_Cons_crop.webp': '76301-batman™-batmobile™-mot-mr-freeze™',
  '76301_Lifestyle_Envr_crop.webp': '76301-batman™-batmobile™-mot-mr-freeze™',
  '76301_Prod.webp': '76301-batman™-batmobile™-mot-mr-freeze™',

  // Product: 76302-supermans-robot-mot-lex-luthor™
  '76302_Box1_v29.webp': '76302-supermans-robot-mot-lex-luthor™',
  '76302_Lifestyle_Cons_crop.webp': '76302-supermans-robot-mot-lex-luthor™',
  '76302_Lifestyle_Envr_crop.webp': '76302-supermans-robot-mot-lex-luthor™',
  '76302_Prod.webp': '76302-supermans-robot-mot-lex-luthor™',
  '76302_boxprod_v29_sha.webp': '76302-supermans-robot-mot-lex-luthor™',

  // Product: 76303-batmans-tumbler-mot-two-face™-jokern
  '76303_Box1_v29.webp': '76303-batmans-tumbler-mot-two-face™-jokern',
  '76303_Lifestyle_Cons_crop.webp': '76303-batmans-tumbler-mot-two-face™-jokern',
  '76303_Lifestyle_Envr_crop.webp': '76303-batmans-tumbler-mot-two-face™-jokern',
  '76303_Prod.webp': '76303-batmans-tumbler-mot-two-face™-jokern',
  '76303_boxprod_v29_sha.webp': '76303-batmans-tumbler-mot-two-face™-jokern',

  // Product: 76304-batman-forever™-batmobilen
  '76304_Box1_v29.webp': '76304-batman-forever™-batmobilen',
  '76304_Lifestyle_Cons_crop.webp': '76304-batman-forever™-batmobilen',
  '76304_Lifestyle_Envr_crop.webp': '76304-batman-forever™-batmobilen',
  '76304_Prod.webp': '76304-batman-forever™-batmobilen',
  '76304_boxprod_v29_sha.webp': '76304-batman-forever™-batmobilen',

  // Product: 76307-iron-mans-robot-mot-ultron
  '76307_Box1_v29.webp': '76307-iron-mans-robot-mot-ultron',
  '76307_Lifestyle_Cons_crop.webp': '76307-iron-mans-robot-mot-ultron',
  '76307_Lifestyle_Envr_crop.webp': '76307-iron-mans-robot-mot-ultron',
  '76307_Prod.webp': '76307-iron-mans-robot-mot-ultron',
  '76307_boxprod_v29_sha.webp': '76307-iron-mans-robot-mot-ultron',

  // Product: 76308-spider-mans-robot-mot-anti-venom
  '76308_Box1_v29.webp': '76308-spider-mans-robot-mot-anti-venom',
  '76308_Lifestyle_Cons_crop.webp': '76308-spider-mans-robot-mot-anti-venom',
  '76308_Lifestyle_Envr_crop.webp': '76308-spider-mans-robot-mot-anti-venom',
  '76308_Prod.webp': '76308-spider-mans-robot-mot-anti-venom',
  '76308_boxprod_v29_sha.webp': '76308-spider-mans-robot-mot-anti-venom',

  // Product: 76309-spider-man-mot-venoms-muskelbil
  '76309_Box1_v29.webp': '76309-spider-man-mot-venoms-muskelbil',
  '76309_Lifestyle_Cons_crop.webp': '76309-spider-man-mot-venoms-muskelbil',
  '76309_Lifestyle_Envr_crop.webp': '76309-spider-man-mot-venoms-muskelbil',
  '76309_Prod.webp': '76309-spider-man-mot-venoms-muskelbil',
  '76309_boxprod_v29_sha.webp': '76309-spider-man-mot-venoms-muskelbil',

  // Product: 76311-spider-verse-miles-morales-mot-spot
  '76311_Box1_v29.webp': '76311-spider-verse-miles-morales-mot-spot',
  '76311_Lifestyle_Cons_crop.webp': '76311-spider-verse-miles-morales-mot-spot',
  '76311_Lifestyle_Envr_crop.webp': '76311-spider-verse-miles-morales-mot-spot',
  '76311_Prod.webp': '76311-spider-verse-miles-morales-mot-spot',
  '76311_boxprod_v29_sha.webp': '76311-spider-verse-miles-morales-mot-spot',

  // Product: 76312-hulktrucken-mot-thanos
  '76312_Box1_v29.webp': '76312-hulktrucken-mot-thanos',
  '76312_Lifestyle_Cons_crop.webp': '76312-hulktrucken-mot-thanos',
  '76312_Lifestyle_Envr_crop.webp': '76312-hulktrucken-mot-thanos',
  '76312_Prod.webp': '76312-hulktrucken-mot-thanos',
  '76312_boxprod_v29_sha.webp': '76312-hulktrucken-mot-thanos',

  // Product: 76313-marvel-logotyp-och-minifigurer
  '76313_Box1_v29.webp': '76313-marvel-logotyp-och-minifigurer',
  '76313_Lifestyle_Cons_crop.webp': '76313-marvel-logotyp-och-minifigurer',
  '76313_Lifestyle_Envr_crop.webp': '76313-marvel-logotyp-och-minifigurer',
  '76313_Prod.webp': '76313-marvel-logotyp-och-minifigurer',
  '76313_boxprod_v29_sha.webp': '76313-marvel-logotyp-och-minifigurer',

  // Product: 76314-captain-america-civil-war-actionstrid
  '76314_Box1_v29.webp': '76314-captain-america-civil-war-actionstrid',
  '76314_Lifestyle_Cons_crop.webp': '76314-captain-america-civil-war-actionstrid',
  '76314_Lifestyle_Envr_crop.webp': '76314-captain-america-civil-war-actionstrid',
  '76314_Prod.webp': '76314-captain-america-civil-war-actionstrid',
  '76314_boxprod_v29_sha.webp': '76314-captain-america-civil-war-actionstrid',

  // Product: 76315-iron-mans-labb-rustningarnas-sal
  '76315_Box1_v29.webp': '76315-iron-mans-labb-rustningarnas-sal',
  '76315_Lifestyle_cons_crop.webp': '76315-iron-mans-labb-rustningarnas-sal',
  '76315_Lifestyle_envr_crop.webp': '76315-iron-mans-labb-rustningarnas-sal',
  '76315_Prod.webp': '76315-iron-mans-labb-rustningarnas-sal',
  '76315_boxprod_v29_sha.webp': '76315-iron-mans-labb-rustningarnas-sal',

  // Product: 76316-fantastic-four-mot-galactus-byggfigur
  '76316_Box1_v29.webp': '76316-fantastic-four-mot-galactus-byggfigur',
  '76316_Lifestyle_cons_crop.webp': '76316-fantastic-four-mot-galactus-byggfigur',
  '76316_Lifestyle_envr_crop.webp': '76316-fantastic-four-mot-galactus-byggfigur',
  '76316_Prod.webp': '76316-fantastic-four-mot-galactus-byggfigur',
  '76316_boxprod_v29_sha.webp': '76316-fantastic-four-mot-galactus-byggfigur',

  // Product: 76319-captain-america-mot-thanos
  '76319_Box1_v29.webp': '76319-captain-america-mot-thanos',
  '76319_Lifestyle_Cons_crop.webp': '76319-captain-america-mot-thanos',
  '76319_Lifestyle_Envr_crop.webp': '76319-captain-america-mot-thanos',
  '76319_Prod.webp': '76319-captain-america-mot-thanos',
  '76319_boxprod_v29_sha.webp': '76319-captain-america-mot-thanos',

  // Product: 76320-iron-man-war-machine-mot-hammer-drones
  '76320_Box1_v29.webp': '76320-iron-man-war-machine-mot-hammer-drones',
  '76320_Lifestyle_Cons_crop.webp': '76320-iron-man-war-machine-mot-hammer-drones',
  '76320_Lifestyle_Envr_crop.webp': '76320-iron-man-war-machine-mot-hammer-drones',
  '76320_Prod.webp': '76320-iron-man-war-machine-mot-hammer-drones',
  '76320_boxprod_v29_sha.webp': '76320-iron-man-war-machine-mot-hammer-drones',

  // Product: 76321-spider-man-mot-doc-ock-tunnelbanescenen
  '76321_Box1_v29.webp': '76321-spider-man-mot-doc-ock-tunnelbanescenen',
  '76321_Lifestyle_Cons_crop.webp': '76321-spider-man-mot-doc-ock-tunnelbanescenen',
  '76321_Lifestyle_Envr_crop.webp': '76321-spider-man-mot-doc-ock-tunnelbanescenen',
  '76321_Prod.webp': '76321-spider-man-mot-doc-ock-tunnelbanescenen',
  '76321_boxprod_v29_sha.webp': '76321-spider-man-mot-doc-ock-tunnelbanescenen',

  // Product: 76322-avengers-endgame-thor-mot-chitauri
  '76322_Box1_v29.webp': '76322-avengers-endgame-thor-mot-chitauri',
  '76322_Lifestyle_Cons_crop.webp': '76322-avengers-endgame-thor-mot-chitauri',
  '76322_Lifestyle_Envr_crop.webp': '76322-avengers-endgame-thor-mot-chitauri',
  '76322_Prod.webp': '76322-avengers-endgame-thor-mot-chitauri',
  '76322_boxprod_v29_sha.webp': '76322-avengers-endgame-thor-mot-chitauri',

  // Product: 76323-avengers-endgame-slutstriden
  '76323_Box1_v29.webp': '76323-avengers-endgame-slutstriden',
  '76323_Lifestyle_cons_crop.webp': '76323-avengers-endgame-slutstriden',
  '76323_Lifestyle_envr_crop.webp': '76323-avengers-endgame-slutstriden',
  '76323_Prod.webp': '76323-avengers-endgame-slutstriden',
  '76323_boxprod_v29_sha.webp': '76323-avengers-endgame-slutstriden',

  // Product: 76324-spider-man-mot-oscorp
  '76324_Box1_v29.webp': '76324-spider-man-mot-oscorp',
  '76324_Lifestyle_Cons_crop.webp': '76324-spider-man-mot-oscorp',
  '76324_Lifestyle_Envr_crop.webp': '76324-spider-man-mot-oscorp',
  '76324_Prod.webp': '76324-spider-man-mot-oscorp',
  '76324_boxprod_v29_sha.webp': '76324-spider-man-mot-oscorp',

  // Product: 76325-avengers-age-of-ultron-quinjet
  '76325_Box1_v29.webp': '76325-avengers-age-of-ultron-quinjet',
  '76325_Lifestyle_Cons_crop.webp': '76325-avengers-age-of-ultron-quinjet',
  '76325_Lifestyle_Envr_crop.webp': '76325-avengers-age-of-ultron-quinjet',
  '76325_Prod.webp': '76325-avengers-age-of-ultron-quinjet',
  '76325_boxprod_v29_sha.webp': '76325-avengers-age-of-ultron-quinjet',

  // Product: 76326-iron-spider-man-byst
  '76326_Box1_v29.webp': '76326-iron-spider-man-byst',
  '76326_Lifestyle_Cons_crop.webp': '76326-iron-spider-man-byst',
  '76326_Lifestyle_Envr_crop.webp': '76326-iron-spider-man-byst',
  '76326_Prod.webp': '76326-iron-spider-man-byst',
  '76326_boxprod_v29_sha.webp': '76326-iron-spider-man-byst',

  // Product: 76327-iron-man-mk4-byst
  '76327_Box1_v29.webp': '76327-iron-man-mk4-byst',
  '76327_Lifestyle_Cons_crop.webp': '76327-iron-man-mk4-byst',
  '76327_Lifestyle_Envr_crop.webp': '76327-iron-man-mk4-byst',
  '76327_Prod.webp': '76327-iron-man-mk4-byst',
  '76327_boxprod_v29_sha.webp': '76327-iron-man-mk4-byst',

  // Product: 76419-hogwarts™-slott-och-omrade
  '76419_Box1_v29.webp': '76419-hogwarts™-slott-och-omrade',
  '76419_Lifestyle_Cons_crop.webp': '76419-hogwarts™-slott-och-omrade',
  '76419_Lifestyle_Envr_crop.webp': '76419-hogwarts™-slott-och-omrade',
  '76419_Prod.webp': '76419-hogwarts™-slott-och-omrade',
  '76419_boxprod_v29.webp': '76419-hogwarts™-slott-och-omrade',

  // Product: 76421-husalfen-dobby™
  '76421_Box1_v29.webp': '76421-husalfen-dobby™',
  '76421_Lifestyle_Cons_crop.webp': '76421-husalfen-dobby™',
  '76421_Lifestyle_Envr_crop.webp': '76421-husalfen-dobby™',
  '76421_Prod.webp': '76421-husalfen-dobby™',
  '76421_boxprod_v29.webp': '76421-husalfen-dobby™',

  // Product: 76424-flygande-ford-anglia™
  '76424_Box1_v29.webp': '76424-flygande-ford-anglia™',
  '76424_Lifestyle_Cons_crop.webp': '76424-flygande-ford-anglia™',
  '76424_Lifestyle_Envr_crop.webp': '76424-flygande-ford-anglia™',
  '76424_Prod.webp': '76424-flygande-ford-anglia™',
  '76424_boxprod_v29.webp': '76424-flygande-ford-anglia™',

  // Product: 76425-hedwig™-pa-privet-drive-4
  '76425_Box1_v29.webp': '76425-hedwig™-pa-privet-drive-4',
  '76425_Lifestyle_Cons_crop.webp': '76425-hedwig™-pa-privet-drive-4',
  '76425_Lifestyle_Envr_crop.webp': '76425-hedwig™-pa-privet-drive-4',
  '76425_Prod.webp': '76425-hedwig™-pa-privet-drive-4',
  '76425_boxprod_v29.webp': '76425-hedwig™-pa-privet-drive-4',

  // Product: 76426-bathuset-pa-hogwarts™-slott
  '76426_Box1_v29.webp': '76426-bathuset-pa-hogwarts™-slott',
  '76426_Lifestyle_Cons_crop.webp': '76426-bathuset-pa-hogwarts™-slott',
  '76426_Lifestyle_Envr_crop.webp': '76426-bathuset-pa-hogwarts™-slott',
  '76426_Prod.webp': '76426-bathuset-pa-hogwarts™-slott',
  '76426_boxprod_v29.webp': '76426-bathuset-pa-hogwarts™-slott',

  // Product: 76427-vingfale
  '76427_Box1_v29.webp': '76427-vingfale',
  '76427_Lifestyle_cons_crop.webp': '76427-vingfale',
  '76427_Lifestyle_envr_crop.webp': '76427-vingfale',
  '76427_Prod.webp': '76427-vingfale',
  '76427_boxprod_v29_sha.webp': '76427-vingfale',

  // Product: 76428-hagrids-stuga-ett-ovantat-besok
  '76428_Box1_v29.webp': '76428-hagrids-stuga-ett-ovantat-besok',
  '76428_Lifestyle_Cons_crop.webp': '76428-hagrids-stuga-ett-ovantat-besok',
  '76428_Lifestyle_Envr_crop.webp': '76428-hagrids-stuga-ett-ovantat-besok',
  '76428_Prod.webp': '76428-hagrids-stuga-ett-ovantat-besok',
  '76428_boxprod_v29.webp': '76428-hagrids-stuga-ett-ovantat-besok',

  // Product: 76429-den-talande-sorteringshatten
  '76429_Box1_v29.webp': '76429-den-talande-sorteringshatten',
  '76429_Lifestyle_Cons_crop.webp': '76429-den-talande-sorteringshatten',
  '76429_Lifestyle_Envr_crop.webp': '76429-den-talande-sorteringshatten',
  '76429_Prod.webp': '76429-den-talande-sorteringshatten',
  '76429_boxprod_v29.webp': '76429-den-talande-sorteringshatten',

  // Product: 76430-uggletornet-pa-hogwarts™-slott
  '76430_Box1_v29.webp': '76430-uggletornet-pa-hogwarts™-slott',
  '76430_Lifestyle_Cons_crop.webp': '76430-uggletornet-pa-hogwarts™-slott',
  '76430_Lifestyle_Envr_crop.webp': '76430-uggletornet-pa-hogwarts™-slott',
  '76430_Prod.webp': '76430-uggletornet-pa-hogwarts™-slott',
  '76430_boxprod_v29.webp': '76430-uggletornet-pa-hogwarts™-slott',

  // Product: 76431-hogwarts™-slott-lektion-i-trolldryckskonst
  '76431_Box1_v29.webp': '76431-hogwarts™-slott-lektion-i-trolldryckskonst',
  '76431_Lifestyle_cons_crop.webp': '76431-hogwarts™-slott-lektion-i-trolldryckskonst',
  '76431_Lifestyle_envr_crop.webp': '76431-hogwarts™-slott-lektion-i-trolldryckskonst',
  '76431_Prod.webp': '76431-hogwarts™-slott-lektion-i-trolldryckskonst',
  '76431_boxprod_v29_sha.webp': '76431-hogwarts™-slott-lektion-i-trolldryckskonst',

  // Product: 76433-mandragora
  '76433_Box1_v29.webp': '76433-mandragora',
  '76433_Lifestyle_Cons_crop.webp': '76433-mandragora',
  '76433_Lifestyle_Envr_crop.webp': '76433-mandragora',
  '76433_Prod.webp': '76433-mandragora',
  '76433_boxprod_v29_sha.webp': '76433-mandragora',

  // Product: 76434-aragog-i-den-forbjudna-skogen
  '76434_Box1_v29.webp': '76434-aragog-i-den-forbjudna-skogen',
  '76434_Lifestyle_cons_crop.webp': '76434-aragog-i-den-forbjudna-skogen',
  '76434_Lifestyle_envr_crop.webp': '76434-aragog-i-den-forbjudna-skogen',
  '76434_Prod.webp': '76434-aragog-i-den-forbjudna-skogen',
  '76434_boxprod_v29_sha.webp': '76434-aragog-i-den-forbjudna-skogen',

  // Product: 76435-hogwarts™-slott-stora-salen
  '76435_Box1_v29.webp': '76435-hogwarts™-slott-stora-salen',
  '76435_Lifestyle_cons_crop.webp': '76435-hogwarts™-slott-stora-salen',
  '76435_Lifestyle_envr_crop.webp': '76435-hogwarts™-slott-stora-salen',
  '76435_Prod.webp': '76435-hogwarts™-slott-stora-salen',
  '76435_boxprod_v29_sha.webp': '76435-hogwarts™-slott-stora-salen',

  // Product: 76439-ollivanders™-madam-malkins-kladnader
  '76439_Box1_v29.webp': '76439-ollivanders™-madam-malkins-kladnader',
  '76439_Lifestyle_cons_crop.webp': '76439-ollivanders™-madam-malkins-kladnader',
  '76439_Lifestyle_envr_crop.webp': '76439-ollivanders™-madam-malkins-kladnader',
  '76439_Prod.webp': '76439-ollivanders™-madam-malkins-kladnader',
  '76439_boxprod_v29_sha.webp': '76439-ollivanders™-madam-malkins-kladnader',

  // Product: 76441-hogwarts™-slott-duellklubben
  '76441_Box1_v29.webp': '76441-hogwarts™-slott-duellklubben',
  '76441_Lifestyle_Cons_crop.webp': '76441-hogwarts™-slott-duellklubben',
  '76441_Lifestyle_Envr_crop.webp': '76441-hogwarts™-slott-duellklubben',
  '76441_Prod.webp': '76441-hogwarts™-slott-duellklubben',
  '76441_boxprod_v39_sha.webp': '76441-hogwarts™-slott-duellklubben',

  // Product: 76442-hogwarts™-slott-lektion-i-trollformellara
  '76442_Box1_v29.webp': '76442-hogwarts™-slott-lektion-i-trollformellara',
  '76442_Lifestyle_Cons_crop.webp': '76442-hogwarts™-slott-lektion-i-trollformellara',
  '76442_Lifestyle_Envr_crop.webp': '76442-hogwarts™-slott-lektion-i-trollformellara',
  '76442_Prod.webp': '76442-hogwarts™-slott-lektion-i-trollformellara',
  '76442_boxprod_v29_sha.webp': '76442-hogwarts™-slott-lektion-i-trollformellara',

  // Product: 76443-hagrids-och-harrys-motorcykeltur
  '76443_Box1_v29.webp': '76443-hagrids-och-harrys-motorcykeltur',
  '76443_Lifestyle_cons_crop.webp': '76443-hagrids-och-harrys-motorcykeltur',
  '76443_Lifestyle_envr_crop.webp': '76443-hagrids-och-harrys-motorcykeltur',
  '76443_Prod.webp': '76443-hagrids-och-harrys-motorcykeltur',
  '76443_boxprod_v29_sha.webp': '76443-hagrids-och-harrys-motorcykeltur',

  // Product: 76444-diagongrandens-trollkarlsbutiker
  '76444_Box1_v29.webp': '76444-diagongrandens-trollkarlsbutiker',
  '76444_Lifestyle_Cons_crop.webp': '76444-diagongrandens-trollkarlsbutiker',
  '76444_Lifestyle_Envr_crop.webp': '76444-diagongrandens-trollkarlsbutiker',
  '76444_Prod.webp': '76444-diagongrandens-trollkarlsbutiker',
  '76444_boxprod_v29_sha.webp': '76444-diagongrandens-trollkarlsbutiker',

  // Product: 76445-hogwarts™-slott-lektion-i-ortlara
  '76445_Box1_v29.webp': '76445-hogwarts™-slott-lektion-i-ortlara',
  '76445_Lifestyle_Cons_crop.webp': '76445-hogwarts™-slott-lektion-i-ortlara',
  '76445_Lifestyle_Envr_crop.webp': '76445-hogwarts™-slott-lektion-i-ortlara',
  '76445_Prod.webp': '76445-hogwarts™-slott-lektion-i-ortlara',
  '76445_boxprod_v29_sha.webp': '76445-hogwarts™-slott-lektion-i-ortlara',

  // Product: 76446-aventyr-pa-nattbussen
  '76446_Box1_v29.webp': '76446-aventyr-pa-nattbussen',
  '76446_Lifestyle_cons_crop.webp': '76446-aventyr-pa-nattbussen',
  '76446_Lifestyle_envr_crop.webp': '76446-aventyr-pa-nattbussen',
  '76446_Prod.webp': '76446-aventyr-pa-nattbussen',
  '76446_boxprod_v29_sha.webp': '76446-aventyr-pa-nattbussen',

  // Product: 76448-fawkes™-dumbledores-fenixfagel
  '76448_Box1_v29.webp': '76448-fawkes™-dumbledores-fenixfagel',
  '76448_Lifestyle_Cons_crop.webp': '76448-fawkes™-dumbledores-fenixfagel',
  '76448_Lifestyle_Envr_crop.webp': '76448-fawkes™-dumbledores-fenixfagel',
  '76448_Prod.webp': '76448-fawkes™-dumbledores-fenixfagel',
  '76448_boxprod_v29_sha.webp': '76448-fawkes™-dumbledores-fenixfagel',

  // Product: 76449-den-tuggande-monsterboken-om-monster
  '76449_Box1_v29.webp': '76449-den-tuggande-monsterboken-om-monster',
  '76449_Lifestyle_Cons_crop.webp': '76449-den-tuggande-monsterboken-om-monster',
  '76449_Lifestyle_Envr_crop.webp': '76449-den-tuggande-monsterboken-om-monster',
  '76449_Prod.webp': '76449-den-tuggande-monsterboken-om-monster',
  '76449_boxprod_v29_sha.webp': '76449-den-tuggande-monsterboken-om-monster',

  // Product: 76450-bokstod-hogwartsexpressen
  '76450_Box1_v29.webp': '76450-bokstod-hogwartsexpressen',
  '76450_Lifestyle_Cons_crop.webp': '76450-bokstod-hogwartsexpressen',
  '76450_Lifestyle_Envr_crop.webp': '76450-bokstod-hogwartsexpressen',
  '76450_Prod.webp': '76450-bokstod-hogwartsexpressen',
  '76450_boxprod_v29_sha.webp': '76450-bokstod-hogwartsexpressen',

  // Product: 76451-privet-drive-faster-marges-besok
  '76451_Box1_v29.webp': '76451-privet-drive-faster-marges-besok',
  '76451_Lifestyle_Cons_crop.webp': '76451-privet-drive-faster-marges-besok',
  '76451_Lifestyle_Envr_crop.webp': '76451-privet-drive-faster-marges-besok',
  '76451_Prod.webp': '76451-privet-drive-faster-marges-besok',
  '76451_boxprod_v29_sha.webp': '76451-privet-drive-faster-marges-besok',

  // Product: 76452-forstklassiga-quidditchtillbehor-glassbar
  '76452_Box1_v29.webp': '76452-forstklassiga-quidditchtillbehor-glassbar',
  '76452_Lifestyle_Cons_crop.webp': '76452-forstklassiga-quidditchtillbehor-glassbar',
  '76452_Lifestyle_Envr_crop.webp': '76452-forstklassiga-quidditchtillbehor-glassbar',
  '76452_Prod.webp': '76452-forstklassiga-quidditchtillbehor-glassbar',
  '76452_boxprod_v29_sha.webp': '76452-forstklassiga-quidditchtillbehor-glassbar',

  // Product: 76453-malfoys-herrgard
  '76453_Box1_v29.webp': '76453-malfoys-herrgard',
  '76453_Lifestyle_cons_crop.webp': '76453-malfoys-herrgard',
  '76453_Lifestyle_envr_crop.webp': '76453-malfoys-herrgard',
  '76453_Prod.webp': '76453-malfoys-herrgard',
  '76453_boxprod_v29_sha.webp': '76453-malfoys-herrgard',

  // Product: 76454-hogwarts™-slott-huvudtornet
  '76454_Box1_v29.webp': '76454-hogwarts™-slott-huvudtornet',
  '76454_Lifestyle_Cons_crop.webp': '76454-hogwarts™-slott-huvudtornet',
  '76454_Lifestyle_Envr_crop.webp': '76454-hogwarts™-slott-huvudtornet',
  '76454_Prod.webp': '76454-hogwarts™-slott-huvudtornet',
  '76454_boxprod_v29_sha.webp': '76454-hogwarts™-slott-huvudtornet',

  // Product: 76456-adventskalender-2025
  '76456_Box1_v29.webp': '76456-adventskalender-2025',
  '76456_Lifestyle_Cons_crop.webp': '76456-adventskalender-2025',
  '76456_Lifestyle_Envr_crop.webp': '76456-adventskalender-2025',
  '76456_Prod.webp': '76456-adventskalender-2025',
  '76456_boxprod_v29_sha.webp': '76456-adventskalender-2025',

  // Product: 76780-wednesday-addams-figur
  '76780_Box1_v29.webp': '76780-wednesday-addams-figur',
  '76780_Lifestyle_Cons_crop.webp': '76780-wednesday-addams-figur',
  '76780_Lifestyle_Envr_crop.webp': '76780-wednesday-addams-figur',
  '76780_Prod.webp': '76780-wednesday-addams-figur',
  '76780_boxprod_v29_sha.webp': '76780-wednesday-addams-figur',

  // Product: 76781-wednesday-enids-korridorsrum
  '76781_Box1_v29.webp': '76781-wednesday-enids-korridorsrum',
  '76781_Lifestyle_Cons_crop.webp': '76781-wednesday-enids-korridorsrum',
  '76781_Lifestyle_Envr_crop.webp': '76781-wednesday-enids-korridorsrum',
  '76781_Prod.webp': '76781-wednesday-enids-korridorsrum',
  '76781_boxprod_v29_sha.webp': '76781-wednesday-enids-korridorsrum',

  // Product: 76784-svart-dahlia
  '76784_Box1_v29.webp': '76784-svart-dahlia',
  '76784_Lifestyle_Cons_crop.webp': '76784-svart-dahlia',
  '76784_Lifestyle_Envr_crop.webp': '76784-svart-dahlia',
  '76784_Prod.webp': '76784-svart-dahlia',
  '76784_boxprod_v29_sha.webp': '76784-svart-dahlia',

  // Product: 76785-wednesday-76785
  '76785_Box1_v29.webp': '76785-wednesday-76785',
  '76785_Lifestyle_Cons_crop.webp': '76785-wednesday-76785',
  '76785_Lifestyle_Envr_crop.webp': '76785-wednesday-76785',
  '76785_Prod.webp': '76785-wednesday-76785',
  '76785_boxprod_v29_sha.webp': '76785-wednesday-76785',

  // Product: 76917-2-fast-2-furious-nissan-skyline-gt-r-r34
  '76917_Box1_v29.webp': '76917-2-fast-2-furious-nissan-skyline-gt-r-r34',
  '76917_Lifestyle_Cons_crop.webp': '76917-2-fast-2-furious-nissan-skyline-gt-r-r34',
  '76917_Lifestyle_Envr_crop.webp': '76917-2-fast-2-furious-nissan-skyline-gt-r-r34',
  '76917_Prod.webp': '76917-2-fast-2-furious-nissan-skyline-gt-r-r34',
  '76917_boxprod_v29.webp': '76917-2-fast-2-furious-nissan-skyline-gt-r-r34',

  // Product: 76919-2023-mclaren-formel-1-bil
  '76919_Box1_v29.webp': '76919-2023-mclaren-formel-1-bil',
  '76919_Lifestyle_Cons_crop.webp': '76919-2023-mclaren-formel-1-bil',
  '76919_Lifestyle_Envr_crop.webp': '76919-2023-mclaren-formel-1-bil',
  '76919_Prod.webp': '76919-2023-mclaren-formel-1-bil',
  '76919_boxprod_v29.webp': '76919-2023-mclaren-formel-1-bil',

  // Product: 76920-ford-mustang-dark-horse-sportbil
  '76920_Box1_v29.webp': '76920-ford-mustang-dark-horse-sportbil',
  '76920_Lifestyle_Cons_crop.webp': '76920-ford-mustang-dark-horse-sportbil',
  '76920_Lifestyle_Envr_crop.webp': '76920-ford-mustang-dark-horse-sportbil',
  '76920_Prod.webp': '76920-ford-mustang-dark-horse-sportbil',
  '76920_boxprod_v29.webp': '76920-ford-mustang-dark-horse-sportbil',

  // Product: 76921-audi-s1-e-tron-quattro-racerbil
  '76921_Box1_v29.webp': '76921-audi-s1-e-tron-quattro-racerbil',
  '76921_Lifestyle_Cons_crop.webp': '76921-audi-s1-e-tron-quattro-racerbil',
  '76921_Lifestyle_Envr_crop.webp': '76921-audi-s1-e-tron-quattro-racerbil',
  '76921_Prod.webp': '76921-audi-s1-e-tron-quattro-racerbil',
  '76921_boxprod_v29.webp': '76921-audi-s1-e-tron-quattro-racerbil',

  // Product: 76922-bmw-m4-gt3-och-bmw-m-hybrid-v8-racerbilar
  '76922_Box1_v29.webp': '76922-bmw-m4-gt3-och-bmw-m-hybrid-v8-racerbilar',
  '76922_Lifestyle_Cons_crop.webp': '76922-bmw-m4-gt3-och-bmw-m-hybrid-v8-racerbilar',
  '76922_Lifestyle_Envr_crop.webp': '76922-bmw-m4-gt3-och-bmw-m-hybrid-v8-racerbilar',
  '76922_Prod.webp': '76922-bmw-m4-gt3-och-bmw-m-hybrid-v8-racerbilar',
  '76922_boxprod_v29.webp': '76922-bmw-m4-gt3-och-bmw-m-hybrid-v8-racerbilar',

  // Product: 76923-lamborghini-lambo-v12-vision-gt-superbil
  '76923_Box1_v29.webp': '76923-lamborghini-lambo-v12-vision-gt-superbil',
  '76923_Lifestyle_Cons_crop.webp': '76923-lamborghini-lambo-v12-vision-gt-superbil',
  '76923_Lifestyle_Envr_crop.webp': '76923-lamborghini-lambo-v12-vision-gt-superbil',
  '76923_Prod.webp': '76923-lamborghini-lambo-v12-vision-gt-superbil',
  '76923_boxprod_v29_sha.webp': '76923-lamborghini-lambo-v12-vision-gt-superbil',

  // Product: 76924-mercedes-amg-g-63-mercedes-amg-sl-63
  '76924_Box1_v29.webp': '76924-mercedes-amg-g-63-mercedes-amg-sl-63',
  '76924_Lifestyle_cons_crop.webp': '76924-mercedes-amg-g-63-mercedes-amg-sl-63',
  '76924_Lifestyle_envr_crop.webp': '76924-mercedes-amg-g-63-mercedes-amg-sl-63',
  '76924_Prod.webp': '76924-mercedes-amg-g-63-mercedes-amg-sl-63',
  '76924_boxprod_v29_sha.webp': '76924-mercedes-amg-g-63-mercedes-amg-sl-63',

  // Product: 76934-ferrari-f40-superbil
  '76934_Box1_v29.webp': '76934-ferrari-f40-superbil',
  '76934_Lifestyle_cons_crop.webp': '76934-ferrari-f40-superbil',
  '76934_Lifestyle_envr_crop.webp': '76934-ferrari-f40-superbil',
  '76934_Prod.webp': '76934-ferrari-f40-superbil',
  '76934_boxprod_v29_sha.webp': '76934-ferrari-f40-superbil',

  // Product: 76935-nascar®-next-gen-chevrolet-camaro-zl1
  '76935_Box1_v29.webp': '76935-nascar®-next-gen-chevrolet-camaro-zl1',
  '76935_Lifestyle_cons_crop.webp': '76935-nascar®-next-gen-chevrolet-camaro-zl1',
  '76935_Lifestyle_envr_crop.webp': '76935-nascar®-next-gen-chevrolet-camaro-zl1',
  '76935_Prod.webp': '76935-nascar®-next-gen-chevrolet-camaro-zl1',
  '76935_boxprod_v29_sha.webp': '76935-nascar®-next-gen-chevrolet-camaro-zl1',

  // Product: 76962-baby-bumpy-ankylosaurus
  '76962_Box1_v29.webp': '76962-baby-bumpy-ankylosaurus',
  '76962_Lifestyle_cons_crop.webp': '76962-baby-bumpy-ankylosaurus',
  '76962_Lifestyle_envr_crop.webp': '76962-baby-bumpy-ankylosaurus',
  '76962_Prod.webp': '76962-baby-bumpy-ankylosaurus',
  '76962_boxprod_v29_sha.webp': '76962-baby-bumpy-ankylosaurus',

  // Product: 76963-raddningscenter-for-dinosaurieungar
  '76963_Box1_v29.webp': '76963-raddningscenter-for-dinosaurieungar',
  '76963_Lifestyle_Cons_crop.webp': '76963-raddningscenter-for-dinosaurieungar',
  '76963_Lifestyle_Envr_crop.webp': '76963-raddningscenter-for-dinosaurieungar',
  '76963_Prod.webp': '76963-raddningscenter-for-dinosaurieungar',
  '76963_boxprod_v29.webp': '76963-raddningscenter-for-dinosaurieungar',

  // Product: 76964-dinosauriefossiler-t-rex-skalle
  '76964_Box1_v29.webp': '76964-dinosauriefossiler-t-rex-skalle',
  '76964_Lifestyle_Cons_crop.webp': '76964-dinosauriefossiler-t-rex-skalle',
  '76964_Lifestyle_Envr_crop.webp': '76964-dinosauriefossiler-t-rex-skalle',
  '76964_Prod.webp': '76964-dinosauriefossiler-t-rex-skalle',
  '76964_boxprod_v29.webp': '76964-dinosauriefossiler-t-rex-skalle',

  // Product: 76965-dinosaurieuppdrag-stegosaurusupptackt
  '76965_Box1_v29.webp': '76965-dinosaurieuppdrag-stegosaurusupptackt',
  '76965_Lifestyle_cons_crop.webp': '76965-dinosaurieuppdrag-stegosaurusupptackt',
  '76965_Lifestyle_envr_crop.webp': '76965-dinosaurieuppdrag-stegosaurusupptackt',
  '76965_Prod.webp': '76965-dinosaurieuppdrag-stegosaurusupptackt',
  '76965_boxprod_v29_sha.webp': '76965-dinosaurieuppdrag-stegosaurusupptackt',

  // Product: 76966-dinosaurieuppdrag-transportbil-med-allosaurus
  '76966_Box1_v29.webp': '76966-dinosaurieuppdrag-transportbil-med-allosaurus',
  '76966_Lifestyle_cons_crop.webp': '76966-dinosaurieuppdrag-transportbil-med-allosaurus',
  '76966_Lifestyle_envr_crop.webp': '76966-dinosaurieuppdrag-transportbil-med-allosaurus',
  '76966_Prod.webp': '76966-dinosaurieuppdrag-transportbil-med-allosaurus',
  '76966_boxprod_v29_sha.webp': '76966-dinosaurieuppdrag-transportbil-med-allosaurus',

  // Product: 76967-little-eatie-t-rex
  '76967_Box1_v29.webp': '76967-little-eatie-t-rex',
  '76967_Lifestyle_Cons_crop.webp': '76967-little-eatie-t-rex',
  '76967_Lifestyle_Envr_crop.webp': '76967-little-eatie-t-rex',
  '76967_Prod.webp': '76967-little-eatie-t-rex',
  '76967_boxprod_v29_sha.webp': '76967-little-eatie-t-rex',

  // Product: 76969-dinosauriefossiler-triceratopsskalle
  '76969_Box1_v29.webp': '76969-dinosauriefossiler-triceratopsskalle',
  '76969_Lifestyle_Cons_crop.webp': '76969-dinosauriefossiler-triceratopsskalle',
  '76969_Lifestyle_Envr_crop.webp': '76969-dinosauriefossiler-triceratopsskalle',
  '76969_Prod.webp': '76969-dinosauriefossiler-triceratopsskalle',
  '76969_boxprod_v29_sha.webp': '76969-dinosauriefossiler-triceratopsskalle',

  // Product: 76970-dinosaurieungen-dolores-aquilops
  '76970_Box1_v29.webp': '76970-dinosaurieungen-dolores-aquilops',
  '76970_Lifestyle_Cons_crop.webp': '76970-dinosaurieungen-dolores-aquilops',
  '76970_Lifestyle_Envr_crop.webp': '76970-dinosaurieungen-dolores-aquilops',
  '76970_Prod.webp': '76970-dinosaurieungen-dolores-aquilops',
  '76970_boxprod_v29_sha.webp': '76970-dinosaurieungen-dolores-aquilops',

  // Product: 76972-terrangflykt-med-raptor
  '76972_Box1_v29.webp': '76972-terrangflykt-med-raptor',
  '76972_Lifestyle_Cons_crop.webp': '76972-terrangflykt-med-raptor',
  '76972_Lifestyle_Envr_crop.webp': '76972-terrangflykt-med-raptor',
  '76972_Prod.webp': '76972-terrangflykt-med-raptor',
  '76972_boxprod_v29_sha.webp': '76972-terrangflykt-med-raptor',

  // Product: 76973-sparningsuppdrag-med-raptor-och-titanosaurus
  '76973_Box1_v29.webp': '76973-sparningsuppdrag-med-raptor-och-titanosaurus',
  '76973_Lifestyle_Cons_crop.webp': '76973-sparningsuppdrag-med-raptor-och-titanosaurus',
  '76973_Lifestyle_Envr_crop.webp': '76973-sparningsuppdrag-med-raptor-och-titanosaurus',
  '76973_Prod.webp': '76973-sparningsuppdrag-med-raptor-och-titanosaurus',
  '76973_boxprod_v29_sha.webp': '76973-sparningsuppdrag-med-raptor-och-titanosaurus',

  // Product: 76975-flodflykt-med-t-rex
  '76975_Box1_v29.webp': '76975-flodflykt-med-t-rex',
  '76975_Lifestyle_Cons_crop.webp': '76975-flodflykt-med-t-rex',
  '76975_Lifestyle_Envr_crop.webp': '76975-flodflykt-med-t-rex',
  '76975_Prod.webp': '76975-flodflykt-med-t-rex',
  '76975_boxprod_v29_sha.webp': '76975-flodflykt-med-t-rex',

  // Product: 76976-flyguppdrag-med-spinosaurus-och-quetzalcoatlus
  '76976_Box1_v29.webp': '76976-flyguppdrag-med-spinosaurus-och-quetzalcoatlus',
  '76976_Lifestyle_Cons_crop.webp': '76976-flyguppdrag-med-spinosaurus-och-quetzalcoatlus',
  '76976_Lifestyle_Envr_crop.webp': '76976-flyguppdrag-med-spinosaurus-och-quetzalcoatlus',
  '76976_Prod.webp': '76976-flyguppdrag-med-spinosaurus-och-quetzalcoatlus',
  '76976_boxprod_v29_sha.webp': '76976-flyguppdrag-med-spinosaurus-och-quetzalcoatlus',

  // Product: 76995-shadow-the-hedgehogs-flykt
  '76995_Box1_v29.webp': '76995-shadow-the-hedgehogs-flykt',
  '76995_Lifestyle_Cons_crop.webp': '76995-shadow-the-hedgehogs-flykt',
  '76995_Lifestyle_Envr_crop.webp': '76995-shadow-the-hedgehogs-flykt',
  '76995_Prod.webp': '76995-shadow-the-hedgehogs-flykt',
  '76995_boxprod_v29.webp': '76995-shadow-the-hedgehogs-flykt',

  // Product: 76996-knuckles-robotvaktare
  '76996_Box1_v29.webp': '76996-knuckles-robotvaktare',
  '76996_Lifestyle_Cons_crop.webp': '76996-knuckles-robotvaktare',
  '76996_Lifestyle_Envr_crop.webp': '76996-knuckles-robotvaktare',
  '76996_Prod.webp': '76996-knuckles-robotvaktare',
  '76996_boxprod_v29.webp': '76996-knuckles-robotvaktare',

  // Product: 76997-tails-aventyrsbat
  '76997_Box1_v29.webp': '76997-tails-aventyrsbat',
  '76997_Lifestyle_Cons_crop.webp': '76997-tails-aventyrsbat',
  '76997_Lifestyle_Envr_crop.webp': '76997-tails-aventyrsbat',
  '76997_Prod.webp': '76997-tails-aventyrsbat',
  '76997_boxprod_v29_sha.webp': '76997-tails-aventyrsbat',

  // Product: 76998-knuckles-och-master-emerald-helgedomen
  '76998_Box1_v29.webp': '76998-knuckles-och-master-emerald-helgedomen',
  '76998_Lifestyle_Cons_crop.webp': '76998-knuckles-och-master-emerald-helgedomen',
  '76998_Lifestyle_Envr_crop.webp': '76998-knuckles-och-master-emerald-helgedomen',
  '76998_Prod.webp': '76998-knuckles-och-master-emerald-helgedomen',
  '76998_boxprod_v29_sha.webp': '76998-knuckles-och-master-emerald-helgedomen',

  // Product: 76999-super-sonic-mot-egg-drillster
  '76999_Box1_v29.webp': '76999-super-sonic-mot-egg-drillster',
  '76999_Lifestyle_Cons_crop.webp': '76999-super-sonic-mot-egg-drillster',
  '76999_Lifestyle_Envr_crop.webp': '76999-super-sonic-mot-egg-drillster',
  '76999_Prod.webp': '76999-super-sonic-mot-egg-drillster',
  '76999_boxprod_v29_sha.webp': '76999-super-sonic-mot-egg-drillster',

  // Product: 77001-sonics-lagereldsstrid
  '77001_Box1_v29.webp': '77001-sonics-lagereldsstrid',
  '77001_Lifestyle_Cons_crop.webp': '77001-sonics-lagereldsstrid',
  '77001_Lifestyle_Envr_crop.webp': '77001-sonics-lagereldsstrid',
  '77001_Prod.webp': '77001-sonics-lagereldsstrid',
  '77001_boxprod_v29_sha.webp': '77001-sonics-lagereldsstrid',

  // Product: 77002-cyclone-mot-metal-sonic
  '77002_Box1_v29.webp': '77002-cyclone-mot-metal-sonic',
  '77002_Lifestyle_Cons_crop.webp': '77002-cyclone-mot-metal-sonic',
  '77002_Lifestyle_Envr_crop.webp': '77002-cyclone-mot-metal-sonic',
  '77002_Prod.webp': '77002-cyclone-mot-metal-sonic',
  '77002_boxprod_v29_sha.webp': '77002-cyclone-mot-metal-sonic',

  // Product: 77003-super-shadow-mot-biolizard
  '77003_Box1_v29.webp': '77003-super-shadow-mot-biolizard',
  '77003_Lifestyle_Cons_crop.webp': '77003-super-shadow-mot-biolizard',
  '77003_Lifestyle_Envr_crop.webp': '77003-super-shadow-mot-biolizard',
  '77003_Prod.webp': '77003-super-shadow-mot-biolizard',
  '77003_boxprod_v29_sha.webp': '77003-super-shadow-mot-biolizard',

  // Product: 77005-knuckles-mot-dr-eggmans-egg-crusher-robot
  '77005_Box1_v29.webp': '77005-knuckles-mot-dr-eggmans-egg-crusher-robot',
  '77005_Lifestyle_Cons_crop.webp': '77005-knuckles-mot-dr-eggmans-egg-crusher-robot',
  '77005_Lifestyle_Envr_crop.webp': '77005-knuckles-mot-dr-eggmans-egg-crusher-robot',
  '77005_Prod.webp': '77005-knuckles-mot-dr-eggmans-egg-crusher-robot',
  '77005_boxprod_v29_sha.webp': '77005-knuckles-mot-dr-eggmans-egg-crusher-robot',

  // Product: 77006-team-sonics-kommandobil
  '77006_Box1_v29.webp': '77006-team-sonics-kommandobil',
  '77006_Lifestyle_Cons_crop.webp': '77006-team-sonics-kommandobil',
  '77006_Lifestyle_Envr_crop.webp': '77006-team-sonics-kommandobil',
  '77006_Prod.webp': '77006-team-sonics-kommandobil',
  '77006_boxprod_v29_sha.webp': '77006-team-sonics-kommandobil',

  // Product: 77037-aloy-och-varl-mot-skoldkryp-och-sagtand
  '77037_Box1_v29.webp': '77037-aloy-och-varl-mot-skoldkryp-och-sagtand',
  '77037_Lifestyle_Cons_crop.webp': '77037-aloy-och-varl-mot-skoldkryp-och-sagtand',
  '77037_Lifestyle_Envr_crop.webp': '77037-aloy-och-varl-mot-skoldkryp-och-sagtand',
  '77037_Prod.webp': '77037-aloy-och-varl-mot-skoldkryp-och-sagtand',
  '77037_boxprod_v29_sha.webp': '77037-aloy-och-varl-mot-skoldkryp-och-sagtand',

  // Product: 77046-fodelsedagskalas-hos-julian
  '77046_Box1_v29.webp': '77046-fodelsedagskalas-hos-julian',
  '77046_Lifestyle_Cons_crop.webp': '77046-fodelsedagskalas-hos-julian',
  '77046_Lifestyle_Envr_crop.webp': '77046-fodelsedagskalas-hos-julian',
  '77046_Prod.webp': '77046-fodelsedagskalas-hos-julian',
  '77046_boxprod_v29.webp': '77046-fodelsedagskalas-hos-julian',

  // Product: 77047-friluftsaktiviteter-med-bunnie
  '77047_Box1_v29.webp': '77047-friluftsaktiviteter-med-bunnie',
  '77047_Lifestyle_Cons_crop.webp': '77047-friluftsaktiviteter-med-bunnie',
  '77047_Lifestyle_Envr_crop.webp': '77047-friluftsaktiviteter-med-bunnie',
  '77047_Prod.webp': '77047-friluftsaktiviteter-med-bunnie',
  '77047_boxprod_v29.webp': '77047-friluftsaktiviteter-med-bunnie',

  // Product: 77048-battur-till-on-med-kappn
  '77048_Box1_v29.webp': '77048-battur-till-on-med-kappn',
  '77048_Lifestyle_Cons_crop.webp': '77048-battur-till-on-med-kappn',
  '77048_Lifestyle_Envr_crop.webp': '77048-battur-till-on-med-kappn',
  '77048_Prod.webp': '77048-battur-till-on-med-kappn',
  '77048_boxprod_v29.webp': '77048-battur-till-on-med-kappn',

  // Product: 77049-isabelle-pa-besok
  '77049_Box1_v29.webp': '77049-isabelle-pa-besok',
  '77049_Lifestyle_Cons_crop.webp': '77049-isabelle-pa-besok',
  '77049_Lifestyle_Envr_crop.webp': '77049-isabelle-pa-besok',
  '77049_Prod.webp': '77049-isabelle-pa-besok',
  '77049_boxprod_v29.webp': '77049-isabelle-pa-besok',

  // Product: 77050-nooks-cranny-huset-dar-rosie-bor
  '77050_Box1_v29.webp': '77050-nooks-cranny-huset-dar-rosie-bor',
  '77050_Lifestyle_Cons_crop.webp': '77050-nooks-cranny-huset-dar-rosie-bor',
  '77050_Lifestyle_Envr_crop.webp': '77050-nooks-cranny-huset-dar-rosie-bor',
  '77050_Prod.webp': '77050-nooks-cranny-huset-dar-rosie-bor',
  '77050_boxprod_v29.webp': '77050-nooks-cranny-huset-dar-rosie-bor',

  // Product: 77051-flyg-med-dodo-airlines
  '77051_Box1_v29.webp': '77051-flyg-med-dodo-airlines',
  '77051_Lifestyle_Cons_crop.webp': '77051-flyg-med-dodo-airlines',
  '77051_Lifestyle_Envr_crop.webp': '77051-flyg-med-dodo-airlines',
  '77051_Prod.webp': '77051-flyg-med-dodo-airlines',
  '77051_boxprod_v29_sha.webp': '77051-flyg-med-dodo-airlines',

  // Product: 77052-k-k-s-konsert-pa-plaza
  '77052_Box1_v29.webp': '77052-k-k-s-konsert-pa-plaza',
  '77052_Lifestyle_Cons_crop.webp': '77052-k-k-s-konsert-pa-plaza',
  '77052_Lifestyle_Envr_crop.webp': '77052-k-k-s-konsert-pa-plaza',
  '77052_Prod.webp': '77052-k-k-s-konsert-pa-plaza',
  '77052_boxprod_v29_sha.webp': '77052-k-k-s-konsert-pa-plaza',

  // Product: 77053-stjarnskadning-med-celeste
  '77053_Box1_v29.webp': '77053-stjarnskadning-med-celeste',
  '77053_Lifestyle_Cons_crop.webp': '77053-stjarnskadning-med-celeste',
  '77053_Lifestyle_Envr_crop.webp': '77053-stjarnskadning-med-celeste',
  '77053_Prod.webp': '77053-stjarnskadning-med-celeste',
  '77053_boxprod_v29_sha.webp': '77053-stjarnskadning-med-celeste',

  // Product: 77054-leif-med-husvagn-och-tradgardsbutik
  '77054_Box1_v29.webp': '77054-leif-med-husvagn-och-tradgardsbutik',
  '77054_Lifestyle_Cons_crop.webp': '77054-leif-med-husvagn-och-tradgardsbutik',
  '77054_Lifestyle_Envr_crop.webp': '77054-leif-med-husvagn-och-tradgardsbutik',
  '77054_Prod.webp': '77054-leif-med-husvagn-och-tradgardsbutik',
  '77054_boxprod_v29_sha.webp': '77054-leif-med-husvagn-och-tradgardsbutik',

  // Product: 77055-able-sisters-kladaffar
  '77055_Box1_v29.webp': '77055-able-sisters-kladaffar',
  '77055_Lifestyle_Cons_crop.webp': '77055-able-sisters-kladaffar',
  '77055_Lifestyle_Envr_crop.webp': '77055-able-sisters-kladaffar',
  '77055_Prod.webp': '77055-able-sisters-kladaffar',
  '77055_boxprod_v29_sha.webp': '77055-able-sisters-kladaffar',

  // Product: 77056-blathers-museisamling
  '77056_Box1_v29.webp': '77056-blathers-museisamling',
  '77056_Lifestyle_Cons_crop.webp': '77056-blathers-museisamling',
  '77056_Lifestyle_Envr_crop.webp': '77056-blathers-museisamling',
  '77056_Prod.webp': '77056-blathers-museisamling',
  '77056_boxprod_v29_sha.webp': '77056-blathers-museisamling',

  // Product: 77057-kreativa-hus-roliga-arstider
  '77057_Box1_v29.webp': '77057-kreativa-hus-roliga-arstider',
  '77057_Lifestyle_Cons_crop.webp': '77057-kreativa-hus-roliga-arstider',
  '77057_Lifestyle_Envr_crop.webp': '77057-kreativa-hus-roliga-arstider',
  '77057_Prod.webp': '77057-kreativa-hus-roliga-arstider',
  '77057_boxprod_v29_sha.webp': '77057-kreativa-hus-roliga-arstider',

  // Product: 77058-det-mysiga-huset-dar-goldie-bor
  '77058_Box1_v29.webp': '77058-det-mysiga-huset-dar-goldie-bor',
  '77058_Lifestyle_Cons_crop.webp': '77058-det-mysiga-huset-dar-goldie-bor',
  '77058_Lifestyle_Envr_crop.webp': '77058-det-mysiga-huset-dar-goldie-bor',
  '77058_Prod.webp': '77058-det-mysiga-huset-dar-goldie-bor',
  '77058_boxprod_v29_sha.webp': '77058-det-mysiga-huset-dar-goldie-bor',

  // Product: 77070-durrr-burger
  '77070_Box1_v29.webp': '77070-durrr-burger',
  '77070_Lifestyle_cons_crop.webp': '77070-durrr-burger',
  '77070_Lifestyle_envr_crop.webp': '77070-durrr-burger',
  '77070_Prod.webp': '77070-durrr-burger',
  '77070_boxprod_v29_sha.webp': '77070-durrr-burger',

  // Product: 77071-supply-llama
  '77071_Box1_v29.webp': '77071-supply-llama',
  '77071_Lifestyle_cons_crop.webp': '77071-supply-llama',
  '77071_Lifestyle_envr_crop.webp': '77071-supply-llama',
  '77071_Prod.webp': '77071-supply-llama',
  '77071_boxprod_v29_sha.webp': '77071-supply-llama',

  // Product: 77072-peely-bone
  '77072_Box1_v29.webp': '77072-peely-bone',
  '77072_Lifestyle_Cons_crop.webp': '77072-peely-bone',
  '77072_Lifestyle_Envr_crop.webp': '77072-peely-bone',
  '77072_Prod.webp': '77072-peely-bone',
  '77072_boxprod_v29_sha.webp': '77072-peely-bone',

  // Product: 77073-battle-bus
  '77073_Box1_v29.webp': '77073-battle-bus',
  '77073_Lifestyle_cons_crop.webp': '77073-battle-bus',
  '77073_Lifestyle_envr_crop.webp': '77073-battle-bus',
  '77073_Prod.webp': '77073-battle-bus',
  '77073_boxprod_v29_sha.webp': '77073-battle-bus',

  // Product: 77075-peely-och-sparkplugs-lager
  '77075_Box1_v29.webp': '77075-peely-och-sparkplugs-lager',
  '77075_Lifestyle_Cons_crop.webp': '77075-peely-och-sparkplugs-lager',
  '77075_Lifestyle_Envr_crop.webp': '77075-peely-och-sparkplugs-lager',
  '77075_Prod.webp': '77075-peely-och-sparkplugs-lager',
  '77075_boxprod_v29_sha.webp': '77075-peely-och-sparkplugs-lager',

  // Product: 77076-durrr-burgers-restaurang
  '77076_Box1_v29.webp': '77076-durrr-burgers-restaurang',
  '77076_Lifestyle_Cons_crop.webp': '77076-durrr-burgers-restaurang',
  '77076_Lifestyle_Envr_crop.webp': '77076-durrr-burgers-restaurang',
  '77076_Prod.webp': '77076-durrr-burgers-restaurang',
  '77076_boxprod_v29_sha.webp': '77076-durrr-burgers-restaurang',

  // Product: 77077-klombo
  '77077_Box1_v29.webp': '77077-klombo',
  '77077_Lifestyle_Cons_crop.webp': '77077-klombo',
  '77077_Lifestyle_Envr_crop.webp': '77077-klombo',
  '77077_Prod.webp': '77077-klombo',
  '77077_boxprod_v29_sha.webp': '77077-klombo',

  // Product: 77078-mecha-team-leader
  '77078_Box1_v29.webp': '77078-mecha-team-leader',
  '77078_Lifestyle_Cons_crop.webp': '77078-mecha-team-leader',
  '77078_Lifestyle_Envr_crop.webp': '77078-mecha-team-leader',
  '77078_Prod.webp': '77078-mecha-team-leader',
  '77078_boxprod_v29_sha.webp': '77078-mecha-team-leader',

  // Product: 77237-dodge-challenger-srt-hellcat-sportbil
  '77237_Box1_v29.webp': '77237-dodge-challenger-srt-hellcat-sportbil',
  '77237_Lifestyle_Cons_crop.webp': '77237-dodge-challenger-srt-hellcat-sportbil',
  '77237_Lifestyle_Envr_crop.webp': '77237-dodge-challenger-srt-hellcat-sportbil',
  '77237_Prod.webp': '77237-dodge-challenger-srt-hellcat-sportbil',
  '77237_boxprod_v29_sha.webp': '77237-dodge-challenger-srt-hellcat-sportbil',

  // Product: 77238-lamborghini-revuelto-huracan-sto
  '77238_Box1_v29.webp': '77238-lamborghini-revuelto-huracan-sto',
  '77238_Lifestyle_Cons_crop.webp': '77238-lamborghini-revuelto-huracan-sto',
  '77238_Lifestyle_Envr_crop.webp': '77238-lamborghini-revuelto-huracan-sto',
  '77238_Prod.webp': '77238-lamborghini-revuelto-huracan-sto',
  '77238_boxprod_v29_sha.webp': '77238-lamborghini-revuelto-huracan-sto',

  // Product: 77239-porsche-911-gt3-rs-superbil
  '77239_Box1_v29.webp': '77239-porsche-911-gt3-rs-superbil',
  '77239_Lifestyle_Cons_crop.webp': '77239-porsche-911-gt3-rs-superbil',
  '77239_Lifestyle_Envr_crop.webp': '77239-porsche-911-gt3-rs-superbil',
  '77239_Prod.webp': '77239-porsche-911-gt3-rs-superbil',
  '77239_boxprod_v29_sha.webp': '77239-porsche-911-gt3-rs-superbil',

  // Product: 77240-bugatti-centodieci-hyper-sportbil
  '77240_Box1_v29.webp': '77240-bugatti-centodieci-hyper-sportbil',
  '77240_Lifestyle_Cons_crop.webp': '77240-bugatti-centodieci-hyper-sportbil',
  '77240_Lifestyle_Envr_crop.webp': '77240-bugatti-centodieci-hyper-sportbil',
  '77240_Prod.webp': '77240-bugatti-centodieci-hyper-sportbil',
  '77240_boxprod_v29_sha.webp': '77240-bugatti-centodieci-hyper-sportbil',

  // Product: 77242-ferrari-sf-24-f1®-racerbil
  '77242_Box1_v29.webp': '77242-ferrari-sf-24-f1®-racerbil',
  '77242_Lifestyle_cons_crop.webp': '77242-ferrari-sf-24-f1®-racerbil',
  '77242_Lifestyle_envr_crop.webp': '77242-ferrari-sf-24-f1®-racerbil',
  '77242_Prod.webp': '77242-ferrari-sf-24-f1®-racerbil',
  '77242_boxprod_v29_sha.webp': '77242-ferrari-sf-24-f1®-racerbil',

  // Product: 77243-oracle-red-bull-racing-rb20-f1®-racerbil
  '77243_Box1_v29.webp': '77243-oracle-red-bull-racing-rb20-f1®-racerbil',
  '77243_Lifestyle_Cons_crop.webp': '77243-oracle-red-bull-racing-rb20-f1®-racerbil',
  '77243_Lifestyle_Envr_crop.webp': '77243-oracle-red-bull-racing-rb20-f1®-racerbil',
  '77243_Prod.webp': '77243-oracle-red-bull-racing-rb20-f1®-racerbil',
  '77243_boxprod_v29_sha.webp': '77243-oracle-red-bull-racing-rb20-f1®-racerbil',

  // Product: 77244-mercedes-amg-f1®-w15-racerbil
  '77244_Box1_v29.webp': '77244-mercedes-amg-f1®-w15-racerbil',
  '77244_Lifestyle_cons_crop.webp': '77244-mercedes-amg-f1®-w15-racerbil',
  '77244_Lifestyle_envr_crop.webp': '77244-mercedes-amg-f1®-w15-racerbil',
  '77244_Prod.webp': '77244-mercedes-amg-f1®-w15-racerbil',
  '77244_boxprod_v29_sha.webp': '77244-mercedes-amg-f1®-w15-racerbil',

  // Product: 77245-aston-martin-aramco-f1®-amr24-racerbil
  '77245_Box1_v29.webp': '77245-aston-martin-aramco-f1®-amr24-racerbil',
  '77245_Lifestyle_cons_crop.webp': '77245-aston-martin-aramco-f1®-amr24-racerbil',
  '77245_Lifestyle_envr_crop.webp': '77245-aston-martin-aramco-f1®-amr24-racerbil',
  '77245_Prod.webp': '77245-aston-martin-aramco-f1®-amr24-racerbil',
  '77245_boxprod_v29_sha.webp': '77245-aston-martin-aramco-f1®-amr24-racerbil',

  // Product: 77246-visa-cash-app-rb-vcarb-01-f1®-racerbil
  '77246_Box1_v29.webp': '77246-visa-cash-app-rb-vcarb-01-f1®-racerbil',
  '77246_Prod.webp': '77246-visa-cash-app-rb-vcarb-01-f1®-racerbil',
  '77246_boxprod_v29_sha.webp': '77246-visa-cash-app-rb-vcarb-01-f1®-racerbil',

  // Product: 77247-kick-sauber-f1®-team-c44-racerbil
  '77247_Box1_v29.webp': '77247-kick-sauber-f1®-team-c44-racerbil',
  '77247_Lifestyle_cons_crop.webp': '77247-kick-sauber-f1®-team-c44-racerbil',
  '77247_Lifestyle_envr_crop.webp': '77247-kick-sauber-f1®-team-c44-racerbil',
  '77247_Prod.webp': '77247-kick-sauber-f1®-team-c44-racerbil',
  '77247_boxprod_v29_sha.webp': '77247-kick-sauber-f1®-team-c44-racerbil',

  // Product: 77248-bwt-alpine-f1®-team-a524-racerbil
  '77248_Box1_v29.webp': '77248-bwt-alpine-f1®-team-a524-racerbil',
  '77248_Lifestyle_cons_crop.webp': '77248-bwt-alpine-f1®-team-a524-racerbil',
  '77248_Lifestyle_envr_crop.webp': '77248-bwt-alpine-f1®-team-a524-racerbil',
  '77248_Prod.webp': '77248-bwt-alpine-f1®-team-a524-racerbil',
  '77248_boxprod_v29_sha.webp': '77248-bwt-alpine-f1®-team-a524-racerbil',

  // Product: 77249-williams-racing-fw46-f1®-racerbil
  '77249_Box1_v29.webp': '77249-williams-racing-fw46-f1®-racerbil',
  '77249_Lifestyle_cons_crop.webp': '77249-williams-racing-fw46-f1®-racerbil',
  '77249_Lifestyle_envr_crop.webp': '77249-williams-racing-fw46-f1®-racerbil',
  '77249_Prod.webp': '77249-williams-racing-fw46-f1®-racerbil',
  '77249_boxprod_v29_sha.webp': '77249-williams-racing-fw46-f1®-racerbil',

  // Product: 77250-moneygram-haas-f1®-team-vf-24-racerbil
  '77250_Box1_v29.webp': '77250-moneygram-haas-f1®-team-vf-24-racerbil',
  '77250_Lifestyle_cons_crop.webp': '77250-moneygram-haas-f1®-team-vf-24-racerbil',
  '77250_Lifestyle_envr_crop.webp': '77250-moneygram-haas-f1®-team-vf-24-racerbil',
  '77250_Prod.webp': '77250-moneygram-haas-f1®-team-vf-24-racerbil',
  '77250_boxprod_v29_sha.webp': '77250-moneygram-haas-f1®-team-vf-24-racerbil',

  // Product: 77251-mclaren-f1®-team-mcl38-racerbil
  '77251_Box1_v29.webp': '77251-mclaren-f1®-team-mcl38-racerbil',
  '77251_Lifestyle_cons_crop.webp': '77251-mclaren-f1®-team-mcl38-racerbil',
  '77251_Lifestyle_envr_crop.webp': '77251-mclaren-f1®-team-mcl38-racerbil',
  '77251_Prod.webp': '77251-mclaren-f1®-team-mcl38-racerbil',
  '77251_boxprod_v29_sha.webp': '77251-mclaren-f1®-team-mcl38-racerbil',
};

// Progress tracking
let processedProducts = 0;
let processedImages = 0;
let totalProducts = 0;
let totalImages = 0;

async function addImageToProduct(productHandle, filename, position) {
  const imageUrl = `https://cdn.shopify.com/s/files/1/0900/8811/2507/files/${filename}`;
  
  const productResponse = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?handle=${productHandle}`, {
    headers: {
      'X-Shopify-Access-Token': ACCESS_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  
  const productData = await productResponse.json();
  const product = productData.products?.[0];
  
  if (!product) {
    console.log(`❌ Product not found: ${productHandle}`);
    processedImages++;
    return false;
  }
  
  const imageResponse = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products/${product.id}/images.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': ACCESS_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: {
        src: imageUrl,
        position: position,
        alt: `${product.title} - Image ${position}`
      }
    })
  });
  
  processedImages++;
  
  if (imageResponse.ok) {
    console.log(`✅ [${processedImages}/${totalImages}] Added ${filename} to ${product.title}`);
    return true;
  } else {
    console.log(`❌ [${processedImages}/${totalImages}] Failed: ${filename}`);
    return false;
  }
}

async function processImages() {
  console.log('🔄 Preparing to add images to products...');
  
  // Group by product handle and count totals
  const handleToImages = {};
  for (const [filename, handle] of Object.entries(FILENAME_TO_HANDLE)) {
    if (!handleToImages[handle]) {
      handleToImages[handle] = [];
    }
    handleToImages[handle].push(filename);
  }
  
  totalProducts = Object.keys(handleToImages).length;
  totalImages = Object.keys(FILENAME_TO_HANDLE).length;
  
  console.log(`📊 Processing ${totalProducts} products with ${totalImages} total images\n`);
  
  for (const [handle, filenames] of Object.entries(handleToImages)) {
    processedProducts++;
    console.log(`\n📦 [${processedProducts}/${totalProducts}] Processing: ${handle}`);
    
    for (let i = 0; i < filenames.length; i++) {
      await addImageToProduct(handle, filenames[i], i + 1);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    }
  }
  
  console.log(`\n🎉 Complete! Processed ${processedProducts} products and ${processedImages} images.`);
}

processImages();