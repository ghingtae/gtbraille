import { HanBraille } from './hanbraille.js';
var han = window.document.getElementById("han");
var brl = window.document.getElementById("brl");
var u11bc = window.document.getElementById("u11bc");
var u3163 = window.document.getElementById("u3163");
var ieung = false;
var i_iso = false;
brl.placeholder = new HanBraille().HangBrai(han.placeholder);
u11bc.addEventListener('click', (e) => {
    ieung = u11bc.checked;
    console.log(`Ieung`);
    han2brl(e);
});
u3163.addEventListener('click', (e) => {
    i_iso = u3163.checked;
    console.log(`I`);
    han2brl(e);
});
han.addEventListener('input', han2brl);
function han2brl(x) {
    var hanbraille = new HanBraille(ieung, i_iso);
    var q = hanbraille.HangBrai(han.value);
    brl.value = q;
    console.log(`"${han.value}" > "${q}"`);
}
