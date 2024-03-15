import { HanBraille } from './hanbraille.js';
var han = (window.document.getElementById("han") as HTMLInputElement);
var brl = (window.document.getElementById("brl") as HTMLInputElement);
var u11bc = (window.document.getElementById("u11bc") as HTMLInputElement);
var u3163 = (window.document.getElementById("u3163") as HTMLInputElement);
var ieung: boolean = false;
var i_iso: boolean = false;
brl.placeholder = new HanBraille().HangBrai(han.placeholder);
u11bc.addEventListener('click', (e?: Event) => {
    ieung = u11bc.checked;
    console.log(`Ieung`);
    han2brl(e);
});
u3163.addEventListener('click', (e?: Event) => {
    i_iso = u3163.checked;
    console.log(`I`);
    han2brl(e);
});
han.addEventListener('input', han2brl);
function han2brl(x?: Event) {
    var hanbraille = new HanBraille(ieung, i_iso);
    var q = hanbraille.HangBrai(han.value);
    brl.value = q;
    console.log(`"${han.value}" > "${q}"`);
}
