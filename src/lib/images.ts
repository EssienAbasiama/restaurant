import jollofGrilledFish from "@/assets/food/jollof-grilled-fish.jpg";
import jollofKebab from "@/assets/food/jollof-kebab.jpg";
import riceAndStew from "@/assets/food/rice-and-stew.jpg";
import chickenJollof from "@/assets/food/chicken-jollof.jpg";
import egusi from "@/assets/food/egusi.jpg";
import efoRiro from "@/assets/food/efo-riro.jpg";
import naijaSpread from "@/assets/food/naija-spread.jpg";
import suyaGrill from "@/assets/food/suya-grill.jpg";
import obeAta from "@/assets/food/obe-ata.jpg";
import fishPlantain from "@/assets/food/fish-plantain.jpg";
import dodo from "@/assets/food/dodo.jpg";
import puffPuff from "@/assets/food/puff-puff.jpg";
import puffPuff2 from "@/assets/food/puff-puff-2.jpg";
import pepperSoup from "@/assets/food/pepper-soup.jpg";
import zobo from "@/assets/food/zobo.jpg";
import chapman from "@/assets/food/chapman.jpg";
import streetFood from "@/assets/food/street-food.jpg";
import ramenShrimp from "@/assets/food/ramen-shrimp.jpg";
import ramenNight from "@/assets/food/ramen-night.jpg";
import tonkotsu from "@/assets/food/tonkotsu.jpg";
import carbonara from "@/assets/food/carbonara.jpg";
import cacioEPepe from "@/assets/food/cacio-e-pepe.jpg";
import margherita from "@/assets/food/margherita.jpg";
import pizzaBoard from "@/assets/food/pizza-board.jpg";
import burger from "@/assets/food/burger.jpg";
import steak from "@/assets/food/steak.jpg";
import salmon from "@/assets/food/salmon.jpg";
import tiramisu from "@/assets/food/tiramisu.jpg";
import sushiBoard from "@/assets/food/sushi-board.jpg";
import sushiBoat from "@/assets/food/sushi-boat.jpg";
import gyoza from "@/assets/food/gyoza.jpg";
import takoyaki from "@/assets/food/takoyaki.jpg";
import mochi from "@/assets/food/mochi.jpg";
import matcha from "@/assets/food/matcha.jpg";
import sake from "@/assets/food/sake.jpg";
import chefFire from "@/assets/food/chef-fire.jpg";
import chefPlating from "@/assets/food/chef-plating.jpg";
import cocktailBar from "@/assets/food/cocktail-bar.jpg";
import ramenCounter from "@/assets/food/ramen-counter.jpg";
import diningRoom from "@/assets/food/dining-room.jpg";
import diningDark from "@/assets/food/dining-dark.jpg";

export const img = {
  jollofGrilledFish,
  jollofKebab,
  riceAndStew,
  chickenJollof,
  egusi,
  efoRiro,
  naijaSpread,
  suyaGrill,
  obeAta,
  fishPlantain,
  dodo,
  puffPuff,
  puffPuff2,
  pepperSoup,
  zobo,
  chapman,
  streetFood,
  ramenShrimp,
  ramenNight,
  tonkotsu,
  carbonara,
  cacioEPepe,
  margherita,
  pizzaBoard,
  burger,
  steak,
  salmon,
  tiramisu,
  sushiBoard,
  sushiBoat,
  gyoza,
  takoyaki,
  mochi,
  matcha,
  sake,
  chefFire,
  chefPlating,
  cocktailBar,
  ramenCounter,
  diningRoom,
  diningDark,
};

export type ImgKey = keyof typeof img;

/** Unsplash photographers — all images used under the Unsplash License. */
export const credits: { key: ImgKey; by: string; id: string }[] = [
  { key: "jollofGrilledFish", by: "Keesha's Kitchen", id: "1665332195309-9d75071138f0" },
  { key: "jollofKebab", by: "Keesha's Kitchen", id: "1664992960082-0ea299a9c53e" },
  { key: "riceAndStew", by: "Kevin kevin", id: "1569058242252-623df46b5025" },
  { key: "chickenJollof", by: "Dr Muhammad Amer", id: "1603496987674-79600a000f55" },
  { key: "egusi", by: "Tosan Dudun", id: "1763048443535-1243379234e2" },
  { key: "efoRiro", by: "Femoree", id: "1604329760661-e71dc83f8f26" },
  { key: "naijaSpread", by: "Keesha's Kitchen", id: "1665400808116-f0e6339b7e9a" },
  { key: "suyaGrill", by: "Victoria Shes", id: "1555939594-58d7cb561ad1" },
  { key: "obeAta", by: "VK bro", id: "1534939561126-855b8675edd7" },
  { key: "fishPlantain", by: "Emmanuel M", id: "1783408356251-f4953f943bb2" },
  { key: "dodo", by: "Valdhy Mbemba", id: "1788530757669-417558f26bef" },
  { key: "puffPuff", by: "Keesha's Kitchen", id: "1664993085274-80c6ba725ccc" },
  { key: "puffPuff2", by: "Keesha's Kitchen", id: "1665833613236-7c1d087463b1" },
  { key: "pepperSoup", by: "Bobbi Wu", id: "1775480617686-405e19721d88" },
  { key: "zobo", by: "Gabi Miranda", id: "1563636680-28d36aeb83a4" },
  { key: "chapman", by: "The Pop'd Shop", id: "1593624191635-f1a49f5eca76" },
  { key: "streetFood", by: "Zoshua Colah", id: "1769019401093-38f564d6408a" },
  { key: "ramenShrimp", by: "Michele Blackwell", id: "1569718212165-3a8278d5f624" },
  { key: "ramenNight", by: "Diego Lozano", id: "1623341214825-9f4f963727da" },
  { key: "tonkotsu", by: "Crystal Jo", id: "1591325418441-ff678baf78ef" },
  { key: "carbonara", by: "Rob Wicks", id: "1633337474564-1d9478ca4e2e" },
  { key: "cacioEPepe", by: "Zoran Borojevic", id: "1588013273468-315fd88ea34c" },
  { key: "margherita", by: "Aurélien Lemasson-Théobald", id: "1574071318508-1cdbab80d002" },
  { key: "pizzaBoard", by: "Ivan Torres", id: "1513104890138-7c749659a591" },
  { key: "burger", by: "Mae Mu", id: "1550547660-d9450f859349" },
  { key: "steak", by: "Tim Toomey", id: "1600891964092-4316c288032e" },
  { key: "salmon", by: "Caroline Attwood", id: "1519708227418-c8fd9a32b7a2" },
  { key: "tiramisu", by: "mediha ekici", id: "1766232333746-b0a2697d6d0d" },
  { key: "sushiBoard", by: "Unsplash contributor", id: "1579584425555-c3ce17fd4351" },
  { key: "sushiBoat", by: "Unsplash contributor", id: "1553621042-f6e147245754" },
  { key: "gyoza", by: "Mikey Frost", id: "1738681336104-608b4e7dc3b0" },
  { key: "takoyaki", by: "sooji min", id: "1751094364516-02b351f9c277" },
  { key: "mochi", by: "Leongsan", id: "1775492477980-abad58a1b52b" },
  { key: "matcha", by: "Olena Bohovyk", id: "1717603545758-88cc454db69b" },
  { key: "sake", by: "Frederick Shaw", id: "1664477407933-dd42ed0c6c62" },
  { key: "chefFire", by: "Louis Hansel", id: "1577219491135-ce391730fb2c" },
  { key: "chefPlating", by: "Alfonso Betancourt", id: "1775513153018-0c7ac7899751" },
  { key: "cocktailBar", by: "Louis Hansel", id: "1566417713940-fe7c737a9ef2" },
  { key: "ramenCounter", by: "Maximilian Csali", id: "1693822998952-b8d18c61043b" },
  { key: "diningRoom", by: "Jay Wennington", id: "1414235077428-338989a2e8c0" },
  { key: "diningDark", by: "Adrien Olichon", id: "1578474846511-04ba529f0b88" },
];
