export type Theme = "light" | "dark" | "system";
export const THEME_KEY = "pa-theme";
export const THEME_EVENT = "pa-themechange";

export const themeScript = `(
function(){
    try{
        var t=localStorage.getItem("${THEME_KEY}");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}
    } catch(e){}})()`;
