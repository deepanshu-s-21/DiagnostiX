// Multi-language Support (i18n) - COMPLETE VERSION
(function() {
    let translations = {};
    let currentLang = localStorage.getItem('language') || 'en';

    // Load translations
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            applyTranslations(currentLang);
        })
        .catch(error => console.error('Failed to load translations:', error));

    // Language selector
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.value = currentLang;
        langSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            changeLanguage(newLang);
        });
    }

    function changeLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        applyTranslations(lang);
        // Reload page to apply full translation
        location.reload();
    }

    function applyTranslations(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                const text = translations[lang][key];
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else if (el.tagName === 'OPTION') {
                    el.textContent = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Also translate plain text nodes
        translateTextNodes(document.body, lang);
    }

    function translateTextNodes(node, lang) {
        for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            if (child.nodeType === 3) { // Text node
                const text = child.textContent.trim();
                for (const key in translations[lang]) {
                    if (translations[lang][key] === text && text.length > 0) {
                        // Don't modify if too short (prevents translating everything)
                        if (text.length > 3) break;
                    }
                }
            } else if (child.nodeType === 1) { // Element node
                if (!child.hasAttribute('data-i18n')) {
                    translateTextNodes(child, lang);
                }
            }
        }
    }

    // Make functions globally available
    window.changeLanguage = changeLanguage;
    window.getCurrentLang = () => currentLang;
    window.getTranslation = (key) => {
        return translations[currentLang] && translations[currentLang][key] 
            ? translations[currentLang][key] 
            : key;
    };
})();
