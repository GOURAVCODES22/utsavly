(function(){
const T={Wedding:'Janu & Janvi',Anniversary:'Janu & Janvi',Birthday:'Janvi',Baby:'Baby Janvi',Muslim:'Eid Mubarak',Hindu:'Janu & Janvi',Festival:'Navratri',Music:'Sangeet Night'};
const R=`Hindu|Krishna Peacock Scroll|c01|50|46|56|#4a2e12|F|wax-pull|flowers
Birthday|Pink Rose Crown|c02|50|55|44|#8a3a56|P|mirror-crown|flowers
Birthday|Burgundy Rose Frame|c03|50|57|56|#4a1a24|P|mirror-crown|flowers
Anniversary|Maroon Memory Lanterns|c04|42|41|56|#4a3520|P|wax-pull|lights
Hindu|Peacock Parchment|c05|32|50|44|#4a3a22|F|wax-pull|flowers
Birthday|Chocolate Cake Roses|c06|50|40|44|#7a1a1a|P|mirror-crown|confetti
Muslim|Golden Quran Palace|c07|50|34|52|#6b4a1a|P|arch-glow|lights
Wedding|Burgundy Arch Florals|c08|50|50|58|#5a1010|F|bell-split|flowers
Wedding|Carved Mughal Arch|c09|50|50|58|#4a3a2a|P|arch-glow|lights
Anniversary|Velvet Rose Lilies|c10|50|48|66|#f5e6d0|F|wax-pull|flowers
Muslim|Mint Copper Mosque|c11|50|38|56|#6b4a2a|F|arch-glow|lights
Muslim|Purple Lantern Wall|c12|50|62|72|#fff0f8|P|arch-glow|lights
Muslim|Crescent Leaves Eid|c13|50|90|68|#2f5a2a|F|arch-glow|stars
Muslim|Ivory Crescent Lanterns|c14|42|46|56|#6b5a2a|F|arch-glow|stars
Muslim|Ivory Quran Window|c15|63|30|52|#7a5a2a|P|arch-glow|lights
Muslim|Watercolor Eid Arch|c16|50|93|78|#6b3a3a|F|arch-glow|flowers
Anniversary|Emerald Gold Pearl Frame|c17|50|52|52|#f6ecc8|P|mirror-crown|lights
Festival|Garba Navratri Night|c18|50|45|52|#ffe9b3|P|bell-split|fire
Wedding|Cream Gold Rose Arch|c19|50|52|56|#6b4a1a|F|bell-split|flowers
Wedding|Persian Tile Arch|c20|50|52|58|#5a4a1a|P|arch-glow|flowers
Wedding|Blue Ivory Aisle|d01|50|38|42|#3b5f8f|P|bell-split|flowers
Wedding|Garden Mandap Peach|d02|50|13|68|#ffffff|F|bell-split|flowers
Anniversary|Purple Better Together|d03|50|47|44|#4a2a6a|F|wax-pull|lights
Baby|Golden Cloud Balloons|d04|50|40|44|#8a6a1e|F|lake-castle|confetti
Wedding|Royal Blue Drape|d05|30|46|34|#1a3a7a|P|bell-split|flowers
Wedding|Silver Blue Stage|d06|50|52|44|#ffffff|P|mirror-crown|snow
Birthday|White Balloon Candles|d07|50|57|44|#8a6a2a|F|mirror-crown|lights
Wedding|Pink Chandelier Arch|d08|50|58|40|#7a4a4a|P|bell-split|flowers
Birthday|Pink Gold Balloons|d09|50|58|42|#7a2a4a|F|lake-castle|confetti
Music|Purple Gold Fringe|d10|50|40|46|#ffe9a8|P|mirror-crown|lights
Birthday|Purple Pink Balloon Frame|d11|50|44|42|#ffe9a8|F|lake-castle|confetti
Birthday|Lilac Rose Stage|d12|50|57|40|#5a2a7a|F|lake-castle|flowers
Baby|Pink Bears Hearts|d13|50|40|52|#b03060|F|lake-castle|hearts
Anniversary|Silver Blue Satin|d14|50|45|68|#3a5a78|P|mirror-crown|snow
Birthday|Pink Curtain Gold Text|d15|50|52|52|#ffffff|P|wax-pull|lights
Birthday|Cloud Crown Gateway|d16|50|48|36|#8a4a7a|P|lake-castle|stars
Birthday|Silver Cinderella Frame|d17|50|48|46|#3b5a78|P|mirror-crown|snow
Wedding|Wisteria White Stage|d18|50|42|38|#6a4a8a|F|bell-split|flowers
Birthday|Cinderella Carriage Blank|d19|66|50|50|#7a5a2a|F|lake-castle|stars
Birthday|Cinderella Castle Night|d20|50|9|72|#ffffff|P|lake-castle|stars`.split('\n');
window.PHOTO_CARDS=R.map(r=>{const p=r.split('|');return [p[0],p[1],'theme-ivory','✦',p[1]+' · live background card',p[7]==='P'?'PREMIUM':'FREE',null,{img:'images/'+p[2]+'.webp',x:+p[3],y:+p[4],w:+p[5],ink:p[6],o:p[8],fx:p[9],t:T[p[0]]||'Celebrate'}]});
})();
