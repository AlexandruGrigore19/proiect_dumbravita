import honeyImg from '../assets/honey.png';
import milkImg from '../assets/milk.png';
import cheeseImg from '../assets/cheese.png';
import gigelImg from '../assets/gigel-frone.png';
import klausImg from '../assets/klaus-iohannis.png';

export const producers = [
    {
        id: 'gigel-frone',
        name: 'Gigel Frone',
        specialty: 'Miere Naturală',
        description: 'Gigel Frone este un apicultor pasionat cu peste 15 ani de experiență. Stupina sa este situată la marginea Pădurii Verzi, unde albinele culeg polen din flori sălbatice nepoluate.',
        location: 'Strada Albinelor, Nr. 12',
        image: gigelImg,
        products: [
            {
                id: 'p1',
                name: 'Miere de Salcâm',
                price: '40 RON',
                unit: '400g',
                image: honeyImg,
                badge: 'Premium'
            },
            {
                id: 'p2',
                name: 'Miere Polifloră',
                price: '35 RON',
                unit: '400g',
                image: honeyImg,
                badge: 'Best Seller'
            },
            {
                id: 'p3',
                name: 'Miere Nebună',
                price: '50 RON',
                unit: '400g',
                image: honeyImg,
                badge: 'Exclusiv'
            }
        ]
    },
    {
        id: 'klaus-iohannis',
        name: 'Klaus Iohannis',
        specialty: 'Lactate Tradiționale',
        description: 'Klaus produce lactate artizanale după rețete vechi săsești. Ferma sa mică pune accent pe calitatea laptelui și bunăstarea animalelor, oferind produse proaspete zilnic.',
        location: 'Aleea Palatului, Nr. 1',
        image: klausImg,
        products: [
            {
                id: 'p4',
                name: 'Lapte de Vacă',
                price: '10 RON',
                unit: '1L',
                image: milkImg,
                badge: 'Bio'
            },
            {
                id: 'p5',
                name: 'Caș Proaspăt',
                price: '25 RON',
                unit: '500g',
                image: cheeseImg,
                badge: 'Tradițional'
            },
            {
                id: 'p6',
                name: 'Brânză de Burduf',
                price: '45 RON',
                unit: 'kg',
                image: cheeseImg,
                badge: 'Maturat'
            }
        ]
    }
];
