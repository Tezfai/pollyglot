
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: '', // PASTE IN A OPENAI KEY 
  dangerouslyAllowBrowser: true            
});

// ---- DOM refs (make sure your HTML has these IDs) ----
const translateBtn   = document.getElementById('translateBtn');
const startOverBtn   = document.getElementById('startOverBtn');
const inputView      = document.getElementById('view-input');
const resultView     = document.getElementById('view-result');
const sourceText     = document.getElementById('sourceText');
const origText       = document.getElementById('origText');
const translatedText = document.getElementById('translatedText');


const LANG = { fr: 'French', es: 'Spanish', jp: 'Japanese' };

// wire up
translateBtn.addEventListener('click', onTranslateClick);
startOverBtn?.addEventListener('click', () => {
  resultView.hidden = true;
  inputView.hidden  = false;
  sourceText.focus();
});

async function onTranslateClick(e) {
  e?.preventDefault?.();

  const text = sourceText.value.trim();
  if (!text) { sourceText.focus(); return; }

  const langEl = document.querySelector('input[name="lang"]:checked');
  const langCode = langEl ? langEl.value : 'fr'; // 'fr' | 'es' | 'jp'
  const target = LANG[langCode] || 'French';

  translateBtn.disabled = true;
  const prev = translateBtn.textContent;
  translateBtn.textContent = 'Translating…';

  try {
    const messages = [
      {
        role: 'system',
        content:
          `You are a precise translator. Translate the user's message into ${target}. ` +
          `Return ONLY the translation — no quotes, no extra text.`
      },
      { role: 'user', content: text }
    ];

    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',   // use a model you have access to
      messages,
      temperature: 0.2
    });

    const translation = resp.choices?.[0]?.message?.content?.trim() || '';

    // show result
    origText.value       = text;
    translatedText.value = translation;
    inputView.hidden  = true;
    resultView.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    console.error(err);
    alert(err?.message || 'Translation failed.');
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = prev || 'Translate';
  }
}

// focus input on load
window.addEventListener('DOMContentLoaded', () => {
  inputView.hidden  = false;
  resultView.hidden = true;
  sourceText?.focus?.();
});
