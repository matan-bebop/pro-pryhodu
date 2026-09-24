let resolve_input = undefined
var promise_read_input = new Promise(r => {resolve_input = r})

var swipl;
var swipl_options = {
  arguments: ["-q"],
  on_output: function(msg,stream) {
    console.log(msg)
    if (stream == "stdout") {
      const pars = document.getElementsByTagName("p"),
            last_par = pars[pars.length-1]
      last_par.appendChild(document.createTextNode(msg))
      if (msg.charCodeAt(msg.length-1) == 10) {
        const br = document.createElement("br")
        last_par.appendChild(br)
      }
      prompt_line.scrollIntoView(false)
    }
  }
};

async function new_game(chapter)
{
  swipl = await SWIPL(swipl_options)

  await swipl.prolog.consult("hra/swipl-interface.pl")
  await swipl.prolog.consult(chapter)
  await swipl.prolog.forEach("гра.")
}

const page = document.getElementById("page")
const prompt_line = document.getElementById("prompt_line")
const input = document.getElementById("input")

function enter() {
  /* It can be hard to input proper apostrophe symbol, and it seems that is
     merely impossible on iPhone. So, first, change every apostrophe-like
     symbol (except ") to the proper apostrophe */
  /* TODO: properly treat quoted words and move this to Prolog, possibly by
     compiling it with PCRE. */
  input.value = input.value.replace(/[‘’’']/g, "ʼ")

  new_paragraph()
  continue_styled("", "Телекоманда— ")
  continue_with("command", input.value)

  resolve_input(input.value)
  promise_read_input = new Promise(r => {resolve_input = r})
  input.value = ""
  new_paragraph()
}

/* Fucking iPhone scrolls about 5-6em before the element when the page is longer
   than one screen. Moreover, that amount depends on the input box font size. */
if(navigator.userAgent.includes("iPhone")) {
  prompt_line.style.paddingBottom = "15ex"
}

function grow(el) {
  page.insertBefore(el, prompt_line)
  prompt_line.scrollIntoView(false)
}

function new_paragraph() {
  const	new_par = document.createElement("p")
  grow(new_par)
}

function span(style, text) {
  let el = document.createElement("span")
  el.className = style; el.innerText = text
  return el
}

function continue_styled(style, text) {
  const pars = document.getElementsByTagName("p")
  const last_par = pars[pars.length-1]
  if(style) last_par.className = style
  last_par.appendChild(document.createTextNode(text))
}

function continue_with(style, text) {
  const pars = document.getElementsByTagName("p")
  const last_par = pars[pars.length-1]
  last_par.appendChild(span(style, text))
}

function chapter(title) {
  el = document.createElement("h3")
  el.className = "athome"
  el.innerText = title
  grow(el)
}
