import { map } from "@trpc/server/observable";
import "./../pages/index.tsx"

function getMap(){
    const map = new Map();
    map.set(0, "#F94144");
    map.set(1, "#F3722C");
    map.set(2, "#F8961E");
    map.set(3, "#90BE6D");
    map.set(4, "#43AA8B");
    return map;
}

export default function getColor (){
    const map = getMap();
    const randomint = getRandomInt();
    return map.get(randomint);
}

function getRandomInt(){
    return Math.floor(Math.random() * 5);
}

