const form = document.getElementById("profileForm");
const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const domainSelect = document.getElementById("domain");
const bioTextarea = document.getElementById("bio");
const charCounter = document.getElementById("charCounter");
const profileCardContainer = document.getElementById("profileCardContainer");
const radioError = document.getElementById("radioError");
const checkboxError = document.getElementById("checkboxError");
const workStyleGroup = document.getElementById("workStyleGroup");
const interestsGroup = document.getElementById("interestsGroup");
const radios = document.querySelectorAll('input[name="workStyle"]');
const interests = document.querySelectorAll(".interest");


// Affiche d'un état d'erreur 
function showError(element, message) {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");

    const errorElement = element.nextElementSibling;
    errorElement.textContent = message;
}


//  Affiche d'un état de succès
function showSuccess(element) {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");

    const errorElement = element.nextElementSibling;
    errorElement.textContent = "";
}


// Validation du nom et prénom
function validateName() {
    const rawValue = fullnameInput.value;
    const value = rawValue.trim().replace(/\s+/g, " ");
    const words = value.split(" ");

    if (words.length < 2) {
        showError(fullnameInput, "Veuillez saisir un prénom et un nom.");
        return false;
    }

    const nameRegex = /^[A-Za-zÀ-ÿ]+(?:[-'][A-Za-zÀ-ÿ]+)*$/;
    const isValidWords = words.every(word => nameRegex.test(word));

    if (!isValidWords) {
        showError(fullnameInput, "Nom invalide (lettres uniquement, min 2 caractères par partie).");
        return false;
    }

    showSuccess(fullnameInput);
    return true;
}


// Validation email
function validateEmail() {
    const value = emailInput.value.trim().toLowerCase();
    emailInput.value = value;
    const emailRegex = /^[a-zA-Z]{2,}(?:[._-][a-zA-Z0-9]{2,})*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
        showError(emailInput,"Email invalide.");
        return false;
    }

    showSuccess(emailInput);
    return true;
}


// Validation du domaine
function validateDomain() {
    const domaines = ["Front-End", "Back-End", "Design/UX", "Data"];
    const selectedValue = domainSelect.value

    if (selectedValue.value === "" && !domaines.includes(selectedValue)) {
        showError(domainSelect, "Veuillez sélectionner un domaine parmi la liste.");
        return false;
    }

    showSuccess(domainSelect);
    return true;
}


//  Validation du choix de rythme 
function validateWorkStyle() {
    const selected = [...radios].some(radio => radio.checked);

    if (!selected) {
        radioError.textContent = "Veuillez sélectionner une option.";
        workStyleGroup.classList.remove("success-group");
        workStyleGroup.classList.add("error-group");
        return false;
    }

    radioError.textContent = "";
    workStyleGroup.classList.remove("error-group");
    workStyleGroup.classList.add("success-group");
    return true;
}


//  Validation des centres d’intérêt
function validateInterests() {
    const selected = [...interests].filter(cb => cb.checked);

    if (selected.length < 2) {
        checkboxError.textContent = "Choisissez au moins 2 centres d'intérêt.";

        interestsGroup.classList.remove("success-group");
        interestsGroup.classList.add("error-group");
        return false;
    }

    checkboxError.textContent = "";

    interestsGroup.classList.remove("error-group");
    interestsGroup.classList.add("success-group");

    return true;
}


// Validation bio 
function validateBio() {
    const value = bioTextarea.value.trim();

    const letters = value.replace(/[^a-zA-ZÀ-ÿ]/g, "").length;

    if (value.length < 25) {
        showError(bioTextarea, "Minimum 25 caractères.");
        return false;
    }

    if (value.length > 255) {
        showError(bioTextarea, "Maximum 255 caractères.");
        return false;
    }

    if (letters / value.length < 0.3) {
        showError(bioTextarea, "Texte trop incohérent (trop de caractères non alphabétiques).");
        return false;
    }

    showSuccess(bioTextarea);
    return true;
}


//  Mise à jour du compteur de caractères en temps réel
function updateCounter() {
    const remaining = 255 - bioTextarea.value.length;

    charCounter.textContent = `${remaining} caractères restants`;
}



// Génère la carte de profil après validation complète
function createProfileCard() {
    const selectedWorkStyle = document.querySelector('input[name="workStyle"]:checked').value;

    const selectedInterests = [...interests].filter(cb => cb.checked).map(cb => cb.value);

    profileCardContainer.innerHTML = `
        <div class="card shadow profile-card">

            <div class="card-header">
            <h3 class="mb-3">${fullnameInput.value.trim()}</h3>
            </div>

            <div class="card-body">

                <p><strong>Email :</strong> ${emailInput.value.trim()}</p>
                <p><strong>Domaine :</strong> ${domainSelect.value}</p>
                <p><strong>Rythme :</strong> ${selectedWorkStyle}</p>
                <p><strong>Passions :</strong> ${selectedInterests.join(", ")}</p>
                <p><strong>Présentation :</strong> ${bioTextarea.value.trim()}</p>

            </div>
        </div>
    `;
}


// Validation en temps réel
fullnameInput.addEventListener("blur", validateName);
emailInput.addEventListener("blur", validateEmail);
domainSelect.addEventListener("change", validateDomain);

bioTextarea.addEventListener("input", () => {
    updateCounter();
    validateBio();
});

radios.forEach(radio => {
    radio.addEventListener("change", validateWorkStyle);
});

interests.forEach(cb => {
    cb.addEventListener("change", validateInterests);
});


// Submit final
form.addEventListener("submit", event => {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isDomainValid = validateDomain();
    const isWorkStyleValid = validateWorkStyle();
    const isInterestsValid = validateInterests();
    const isBioValid = validateBio();

    const isValid = isNameValid && isEmailValid && isDomainValid &&
        isWorkStyleValid && isInterestsValid && isBioValid;

    if (!isValid) return;

    createProfileCard();
    form.reset();

    document.querySelectorAll(".is-valid").forEach(el => el.classList.remove("is-valid"));

    workStyleGroup.classList.remove("success-group");
    interestsGroup.classList.remove("success-group");

    charCounter.textContent = "255 caractères restants";
});